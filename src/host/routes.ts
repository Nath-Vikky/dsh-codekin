import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { WebRoute } from '@deepseek-ai/dsh-host-webserver'
import { CREATURE_CATALOG } from '../core/catalog.ts'
import { normalizeTraceWildAction } from '../core/protocol.ts'
import { TraceWildRuleError } from '../core/engine.ts'
import type { TraceWildFailureResponse } from '../core/types.ts'
import type { TraceWildService } from './service.ts'

export const TRACEWILD_API_PREFIX = '/api/tracewild'
const MAX_ACTION_BODY_BYTES = 4 * 1024
const HEARTBEAT_MS = 15_000

const ASSET_FILES = new Set([
  'sprites/codekin-launcher-v1.png',
  ...CREATURE_CATALOG.map(creature => `sprites/${creature.id}.png`),
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

function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let size = 0
    let settled = false
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => {
      if (settled) return
      size += chunk.byteLength
      if (size > MAX_ACTION_BODY_BYTES) {
        settled = true
        reject(new TypeError('body too large'))
        queueMicrotask(() => req.destroy())
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (settled) return
      settled = true
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown)
      } catch {
        reject(new TypeError('invalid json'))
      }
    })
    req.on('error', () => {
      if (settled) return
      settled = true
      reject(new TypeError('request error'))
    })
  })
}

function stateRoute(service: TraceWildService): WebRoute {
  return {
    kind: 'exact',
    path: `${TRACEWILD_API_PREFIX}/state`,
    handler(req, res) {
      if (req.method !== 'GET') {
        res.writeHead(405, securityHeaders())
        res.end()
        return
      }
      sendJson(res, 200, service.snapshot())
    },
  }
}

function actionRoute(service: TraceWildService): WebRoute {
  return {
    kind: 'exact',
    path: `${TRACEWILD_API_PREFIX}/action`,
    async handler(req, res) {
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
        sendJson(res, 200, service.act(normalizeTraceWildAction(await readBody(req))))
      } catch (error) {
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

function eventsRoute(service: TraceWildService): WebRoute {
  return {
    kind: 'exact',
    path: `${TRACEWILD_API_PREFIX}/events`,
    handler(req, res) {
      if (req.method !== 'GET') {
        res.writeHead(405, securityHeaders())
        res.end()
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
      let unsubscribe = (): void => undefined
      const heartbeat = setInterval(() => {
        if (!closed) res.write(': tracewild\n\n')
      }, HEARTBEAT_MS)
      heartbeat.unref?.()
      const close = (): void => {
        if (closed) return
        closed = true
        clearInterval(heartbeat)
        unsubscribe()
      }
      req.once('close', close)
      unsubscribe = service.subscribe((snapshot) => {
        if (closed) return
        try {
          res.write(`data: ${JSON.stringify(snapshot)}\n\n`)
        } catch {
          close()
        }
      })
    },
  }
}

function assetRoute(assetDirectory: string): WebRoute {
  return {
    kind: 'prefix',
    path: `${TRACEWILD_API_PREFIX}/assets`,
    async handler(req, res) {
      if (req.method !== 'GET') {
        res.writeHead(405, securityHeaders())
        res.end()
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
        res.writeHead(200, {
          ...securityHeaders(),
          'cache-control': 'public, max-age=86400, immutable',
          'content-type': 'image/png',
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

export function createTraceWildRoutes(service: TraceWildService, assetDirectory: string): readonly WebRoute[] {
  return [stateRoute(service), actionRoute(service), eventsRoute(service), assetRoute(assetDirectory)]
}
