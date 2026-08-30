import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { WebRoute } from '@deepseek-ai/dsh-host-webserver'
import { CREATURE_CATALOG } from '../../packages/engine/src/catalog.ts'
import { normalizeTraceWildAction } from '../../packages/engine/src/protocol.ts'
import { TraceWildRuleError } from '../../packages/engine/src/engine.ts'
import type { TraceWildFailureResponse } from '../../packages/engine/src/types.ts'
import type { TraceWildService } from './service.ts'

export const TRACEWILD_API_PREFIX = '/api/tracewild'
const MAX_ACTION_BODY_BYTES = 4 * 1024
const HEARTBEAT_MS = 15_000

class TraceWildRoutesClosedError extends Error {}

class TraceWildRouteLifecycle {
  private readonly controller = new AbortController()
  private readonly streams = new Map<ServerResponse, () => void>()

  get signal(): AbortSignal {
    return this.controller.signal
  }

  trackStream(res: ServerResponse, cleanup: () => void): void {
    if (this.signal.aborted) {
      cleanup()
      if (!res.writableEnded && !res.destroyed) res.end()
      return
    }
    this.streams.set(res, cleanup)
  }

  releaseStream(res: ServerResponse): void {
    this.streams.delete(res)
  }

  close(): void {
    if (this.signal.aborted) return
    this.controller.abort()
    for (const [res, cleanup] of [...this.streams]) {
      cleanup()
      if (!res.writableEnded && !res.destroyed) res.end()
    }
    this.streams.clear()
  }
}

export interface TraceWildRouteGroup {
  readonly routes: readonly WebRoute[]
  close(): void
}

const ASSET_FILES = new Set([
  'sprites/codekin-launcher-v1.webp',
  ...CREATURE_CATALOG.map(creature => `sprites/${creature.id}.webp`),
])

function securityHeaders(): Record<string, string> {
  return {
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'no-referrer',
    'cross-origin-resource-policy': 'same-origin',
  }
}

function sendJson(res: ServerResponse, status: number, value: unknown): void {
  res.writeHead(status, {
    ...securityHeaders(),
    'content-type': 'application/json; charset=utf-8',
  })
  res.end(JSON.stringify(value))
}

function failure(res: ServerResponse, status: number, error: TraceWildFailureResponse['error']): void {
  sendJson(res, status, { ok: false, error } satisfies TraceWildFailureResponse)
}

function requestHeader(req: IncomingMessage, name: keyof IncomingMessage['headers']): string | undefined {
  const value = req.headers[name]
  return typeof value === 'string' ? value : undefined
}

function isLoopbackHostname(hostname: string): boolean {
  if (hostname === 'localhost' || hostname === '[::1]') return true
  const parts = hostname.split('.')
  return parts.length === 4
    && parts[0] === '127'
    && parts.every(part => /^\d{1,3}$/.test(part) && Number(part) <= 255)
}

function loopbackAuthority(req: IncomingMessage): URL | undefined {
  const host = requestHeader(req, 'host')
  if (host === undefined || host.length === 0 || host.length > 255 || /[\s\\/@?#]/u.test(host)) return undefined
  try {
    const parsed = new URL(`http://${host}`)
    return isLoopbackHostname(parsed.hostname) ? parsed : undefined
  } catch {
    return undefined
  }
}

/**
 * Local Web trust fence kept inside Codekin so it does not depend on private
 * or version-specific Connection internals. This is a DNS-rebinding and
 * browser-origin fence, not user authentication.
 */
function rejectUntrusted(req: IncomingMessage, res: ServerResponse): boolean {
  const authority = loopbackAuthority(req)
  const site = requestHeader(req, 'sec-fetch-site')
  const origin = requestHeader(req, 'origin')
  let trusted = authority !== undefined
    && site !== 'cross-site'
    && (req.headers['sec-fetch-site'] === undefined || site !== undefined)
    && (req.headers.origin === undefined || origin !== undefined)
  if (authority !== undefined && trusted && origin !== undefined) {
    try {
      const parsed = new URL(origin)
      trusted = (parsed.protocol === 'http:' || parsed.protocol === 'https:')
        && parsed.host === authority.host
    } catch {
      trusted = false
    }
  }
  if (trusted) return false
  res.writeHead(403, securityHeaders())
  res.end('forbidden')
  return true
}

function sameOrigin(req: IncomingMessage): boolean {
  const host = req.headers.host
  if (typeof host !== 'string' || host.length === 0 || host.length > 255) return false
  const site = req.headers['sec-fetch-site']
  if (site !== undefined && site !== 'same-origin' && site !== 'none') return false
  const origin = req.headers.origin
  if (origin === undefined) return site === 'same-origin' || site === 'none'
  if (typeof origin !== 'string' || origin.length > 512) return false
  try {
    const parsed = new URL(origin)
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && parsed.host === host
  } catch {
    return false
  }
}

function readBody(req: IncomingMessage, signal: AbortSignal): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let size = 0
    let settled = false
    const chunks: Buffer[] = []
    const cleanup = (): void => {
      req.off('data', onData)
      req.off('end', onEnd)
      req.off('error', onError)
      signal.removeEventListener('abort', onAbort)
    }
    const finish = (callback: () => void): void => {
      if (settled) return
      settled = true
      cleanup()
      callback()
    }
    const onData = (chunk: Buffer): void => {
      if (settled) return
      size += chunk.byteLength
      if (size > MAX_ACTION_BODY_BYTES) {
        finish(() => { reject(new TypeError('body too large')) })
        queueMicrotask(() => req.destroy())
        return
      }
      chunks.push(chunk)
    }
    const onEnd = (): void => {
      finish(() => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown)
        } catch {
          reject(new TypeError('invalid json'))
        }
      })
    }
    const onError = (): void => {
      finish(() => { reject(new TypeError('request error')) })
    }
    const onAbort = (): void => {
      finish(() => { reject(new TraceWildRoutesClosedError()) })
    }
    if (signal.aborted) {
      onAbort()
      return
    }
    req.on('data', onData)
    req.on('end', onEnd)
    req.on('error', onError)
    signal.addEventListener('abort', onAbort, { once: true })
  })
}

function stateRoute(
  service: TraceWildService,
  lifecycle: TraceWildRouteLifecycle,
): WebRoute {
  return {
    kind: 'exact',
    path: `${TRACEWILD_API_PREFIX}/state`,
    handler(req, res) {
      if (rejectUntrusted(req, res)) return
      if (req.method !== 'GET') {
        res.writeHead(405, securityHeaders())
        res.end()
        return
      }
      if (lifecycle.signal.aborted) {
        failure(res, 503, 'unavailable')
        return
      }
      sendJson(res, 200, service.snapshot())
    },
  }
}

function actionRoute(
  service: TraceWildService,
  lifecycle: TraceWildRouteLifecycle,
): WebRoute {
  return {
    kind: 'exact',
    path: `${TRACEWILD_API_PREFIX}/action`,
    async handler(req, res) {
      if (rejectUntrusted(req, res)) return
      if (req.method !== 'POST') {
        res.writeHead(405, securityHeaders())
        res.end()
        return
      }
      if (!sameOrigin(req) || !/^application\/json(?:\s*;|$)/i.test(String(req.headers['content-type'] ?? ''))) {
        failure(res, 403, 'invalid-action')
        return
      }
      try {
        const action = normalizeTraceWildAction(await readBody(req, lifecycle.signal))
        if (lifecycle.signal.aborted) throw new TraceWildRoutesClosedError()
        sendJson(res, 200, service.act(action))
      } catch (error) {
        if (error instanceof TraceWildRoutesClosedError || lifecycle.signal.aborted) {
          failure(res, 503, 'unavailable')
          return
        }
        if (error instanceof TraceWildRuleError) {
          failure(res, error.code === 'conflict' ? 409 : 400, error.code)
          return
        }
        if (error instanceof TypeError) {
          failure(res, 400, 'invalid-action')
          return
        }
        failure(res, 500, 'unavailable')
      }
    },
  }
}

function saveRoute(
  service: TraceWildService,
  lifecycle: TraceWildRouteLifecycle,
): WebRoute {
  return {
    kind: 'exact',
    path: `${TRACEWILD_API_PREFIX}/save`,
    async handler(req, res) {
      if (rejectUntrusted(req, res)) return
      if (req.method !== 'DELETE') {
        res.writeHead(405, securityHeaders())
        res.end()
        return
      }
      if (!sameOrigin(req) || !/^application\/json(?:\s*;|$)/i.test(String(req.headers['content-type'] ?? ''))) {
        failure(res, 403, 'invalid-action')
        return
      }
      try {
        const value = await readBody(req, lifecycle.signal)
        if (lifecycle.signal.aborted) throw new TraceWildRoutesClosedError()
        if (typeof value !== 'object' || value === null || Array.isArray(value)
          || Object.getPrototypeOf(value) !== Object.prototype) throw new TypeError('invalid cleanup request')
        const row = value as Record<string, unknown>
        const keys = Object.keys(row)
        if (keys.length !== 1 || keys[0] !== 'confirmation' || row.confirmation !== 'delete-codekin-save') {
          throw new TypeError('invalid cleanup request')
        }
        sendJson(res, 200, service.clearLocalData())
      } catch (error) {
        if (error instanceof TraceWildRoutesClosedError || lifecycle.signal.aborted) {
          failure(res, 503, 'unavailable')
          return
        }
        if (error instanceof TypeError) {
          failure(res, 400, 'invalid-action')
          return
        }
        failure(res, 500, 'unavailable')
      }
    },
  }
}

function eventsRoute(
  service: TraceWildService,
  lifecycle: TraceWildRouteLifecycle,
): WebRoute {
  return {
    kind: 'exact',
    path: `${TRACEWILD_API_PREFIX}/events`,
    handler(req, res) {
      if (rejectUntrusted(req, res)) return
      if (req.method !== 'GET') {
        res.writeHead(405, securityHeaders())
        res.end()
        return
      }
      if (lifecycle.signal.aborted) {
        failure(res, 503, 'unavailable')
        return
      }
      res.writeHead(200, {
        ...securityHeaders(),
        'cache-control': 'no-cache, no-transform',
        'content-type': 'text/event-stream; charset=utf-8',
        'connection': 'keep-alive',
        'x-accel-buffering': 'no',
      })
      res.flushHeaders?.()
      let closed = false
      let unsubscribe: (() => void) | undefined
      const heartbeat = setInterval(() => {
        if (!closed) res.write(': tracewild\n\n')
      }, HEARTBEAT_MS)
      heartbeat.unref?.()
      const close = (): void => {
        if (closed) return
        closed = true
        clearInterval(heartbeat)
        req.off('close', close)
        res.off('close', close)
        lifecycle.releaseStream(res)
        unsubscribe?.()
      }
      req.once('close', close)
      res.once('close', close)
      lifecycle.trackStream(res, close)
      unsubscribe = service.subscribe((snapshot) => {
        if (closed) return
        try {
          res.write(`data: ${JSON.stringify(snapshot)}\n\n`)
        } catch {
          close()
        }
      })
      if (closed) unsubscribe()
    },
  }
}

function assetRoute(
  assetDirectory: string,
  lifecycle: TraceWildRouteLifecycle,
): WebRoute {
  return {
    kind: 'prefix',
    path: `${TRACEWILD_API_PREFIX}/assets`,
    async handler(req, res) {
      if (rejectUntrusted(req, res)) return
      if (req.method !== 'GET') {
        res.writeHead(405, securityHeaders())
        res.end()
        return
      }
      if (lifecycle.signal.aborted) {
        failure(res, 503, 'unavailable')
        return
      }
      const pathname = new URL(req.url ?? '/', 'http://tracewild.invalid').pathname
      const filename = pathname.slice(`${TRACEWILD_API_PREFIX}/assets/`.length)
      if (!ASSET_FILES.has(filename)) {
        res.writeHead(404, securityHeaders())
        res.end()
        return
      }
      try {
        const body = await readFile(join(assetDirectory, filename))
        if (lifecycle.signal.aborted) {
          failure(res, 503, 'unavailable')
          return
        }
        res.writeHead(200, {
          ...securityHeaders(),
          'cache-control': 'public, max-age=86400, immutable',
          'content-type': 'image/webp',
          'content-length': String(body.byteLength),
        })
        res.end(body)
      } catch {
        res.writeHead(404, securityHeaders())
        res.end()
      }
    },
  }
}

export function createTraceWildRoutes(
  service: TraceWildService,
  assetDirectory: string,
): TraceWildRouteGroup {
  const lifecycle = new TraceWildRouteLifecycle()
  return {
    routes: [
      stateRoute(service, lifecycle),
      actionRoute(service, lifecycle),
      saveRoute(service, lifecycle),
      eventsRoute(service, lifecycle),
      assetRoute(assetDirectory, lifecycle),
    ],
    close: () => { lifecycle.close() },
  }
}
