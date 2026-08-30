import { EventEmitter } from 'node:events'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { describe, expect, it, vi } from 'vitest'
import { CORE_CONTENT_VIEW } from '../src/core-runtime.ts'
import { createTraceWildRoutes, TRACEWILD_API_PREFIX } from '../packages/dsh-adapter/src/routes.ts'
import type { TraceWildService } from '../packages/dsh-adapter/src/service.ts'

interface FakeResponse {
  readonly response: ServerResponse
  readonly statuses: number[]
  readonly writes: string[]
  readonly ended: () => boolean
}

function response(): FakeResponse {
  const emitter = new EventEmitter()
  let ended = false
  const statuses: number[] = []
  const writes: string[] = []
  const raw = Object.assign(emitter, {
    destroyed: false,
    writeHead(status: number) {
      statuses.push(status)
      return raw
    },
    flushHeaders() {},
    write(value: string) {
      writes.push(value)
      return true
    },
    end(value?: string) {
      if (value !== undefined) writes.push(value)
      if (!ended) {
        ended = true
        emitter.emit('close')
      }
      return raw
    },
  })
  Object.defineProperty(raw, 'writableEnded', { get: () => ended })
  return {
    response: raw as unknown as ServerResponse,
    statuses,
    writes,
    ended: () => ended,
  }
}

function request(method: string, headers: IncomingMessage['headers'] = {}): IncomingMessage {
  return Object.assign(new EventEmitter(), {
    method,
    headers,
    url: '/',
    destroy: vi.fn(),
  }) as unknown as IncomingMessage
}

describe('TraceWild Cordis lifecycle', () => {
  it('rejects every direct Web route before touching game state', async () => {
    const snapshot = vi.fn()
    const act = vi.fn()
    const subscribe = vi.fn()
    const service = { snapshot, act, subscribe } as unknown as TraceWildService
    const group = createTraceWildRoutes(service, '.', CORE_CONTENT_VIEW)

    await Promise.all(group.routes.map(async (route) => {
      const res = response()
      await route.handler(request(route.path.endsWith('/action') ? 'POST' : 'GET'), res.response)
      expect(res.statuses).toEqual([403])
      expect(res.writes).toEqual(['forbidden'])
    }))

    expect(snapshot).not.toHaveBeenCalled()
    expect(act).not.toHaveBeenCalled()
    expect(subscribe).not.toHaveBeenCalled()
  })

  it('accepts the full loopback range but rejects non-loopback and foreign-origin requests', () => {
    const snapshot = vi.fn(() => ({ ok: true }))
    const service = { snapshot } as unknown as TraceWildService
    const group = createTraceWildRoutes(service, '.', CORE_CONTENT_VIEW)
    const state = group.routes.find(route => route.path === `${TRACEWILD_API_PREFIX}/state`)!

    const local = response()
    state.handler(request('GET', {
      host: '127.23.45.67:63214',
      origin: 'http://127.23.45.67:63214',
      'sec-fetch-site': 'same-origin',
    }), local.response)
    expect(local.statuses).toEqual([200])

    for (const headers of [
      { host: '128.0.0.1:63214' },
      { host: '127.0.0.1:63214', origin: 'http://evil.example' },
      { host: '127.0.0.1:63214', 'sec-fetch-site': 'cross-site' },
    ]) {
      const rejected = response()
      state.handler(request('GET', headers), rejected.response)
      expect(rejected.statuses).toEqual([403])
    }
    expect(snapshot).toHaveBeenCalledOnce()
  })

  it('serves the client-safe content view over the loopback API', () => {
    const group = createTraceWildRoutes({} as TraceWildService, '.', CORE_CONTENT_VIEW)
    const content = group.routes.find(route => route.path === `${TRACEWILD_API_PREFIX}/content`)!
    const res = response()

    content.handler(request('GET', {
      host: '127.0.0.1:63214',
      origin: 'http://127.0.0.1:63214',
      'sec-fetch-site': 'same-origin',
    }), res.response)

    expect(res.statuses).toEqual([200])
    const body = JSON.parse(res.writes.join('')) as Record<string, unknown>
    expect(body.id).toBe(CORE_CONTENT_VIEW.id)
    expect(body.creatures).toHaveLength(25)
    expect(body).not.toHaveProperty('mechanics')
  })

  it('ends active event streams and removes their subscriptions when unloaded', () => {
    let subscribed = 0
    let unsubscribed = 0
    const service = {
      subscribe(listener: (value: unknown) => void) {
        subscribed += 1
        listener({ schemaVersion: 3 })
        return () => { unsubscribed += 1 }
      },
    } as unknown as TraceWildService
    const group = createTraceWildRoutes(service, '.', CORE_CONTENT_VIEW)
    const events = group.routes.find(route => route.path === `${TRACEWILD_API_PREFIX}/events`)!
    const res = response()

    events.handler(request('GET', { host: '127.0.0.1:63214' }), res.response)
    expect(subscribed).toBe(1)
    expect(res.writes.some(value => value.startsWith('data: '))).toBe(true)

    group.close()
    expect(unsubscribed).toBe(1)
    expect(res.ended()).toBe(true)
    group.close()
    expect(unsubscribed).toBe(1)
  })

  it('requires the explicit cleanup phrase before deleting the local save', async () => {
    const clearLocalData = vi.fn(() => ({ ok: true, schemaVersion: 3, state: { schemaVersion: 3 }, serverTime: 1 }))
    const service = { clearLocalData } as unknown as TraceWildService
    const group = createTraceWildRoutes(service, '.', CORE_CONTENT_VIEW)
    const route = group.routes.find(candidate => candidate.path === `${TRACEWILD_API_PREFIX}/save`)!
    const req = request('DELETE', {
      host: '127.0.0.1:63214',
      origin: 'http://127.0.0.1:63214',
      'content-type': 'application/json',
    })
    const res = response()

    const pending = route.handler(req, res.response)
    req.emit('data', Buffer.from('{"confirmation":"delete-codekin-save"}'))
    req.emit('end')
    await pending

    expect(clearLocalData).toHaveBeenCalledOnce()
    expect(res.statuses).toEqual([200])
  })

  it('fails closed without committing an action that was awaiting its body during unload', async () => {
    const act = vi.fn()
    const service = { act } as unknown as TraceWildService
    const group = createTraceWildRoutes(service, '.', CORE_CONTENT_VIEW)
    const action = group.routes.find(route => route.path === `${TRACEWILD_API_PREFIX}/action`)!
    const req = request('POST', {
      host: '127.0.0.1:63214',
      origin: 'http://127.0.0.1:63214',
      'content-type': 'application/json',
    })
    const res = response()

    const pending = action.handler(req, res.response)
    group.close()
    await pending

    expect(act).not.toHaveBeenCalled()
    expect(res.statuses).toEqual([503])
    expect(res.writes.join('')).not.toContain('stack')
  })
})
