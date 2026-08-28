import { EventEmitter } from 'node:events'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { describe, expect, it, vi } from 'vitest'
import { createTraceWildRoutes, TRACEWILD_API_PREFIX } from '../src/host/routes.ts'
import type { TraceWildService } from '../src/host/service.ts'

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
    const group = createTraceWildRoutes(service, '.')
    const events = group.routes.find(route => route.path === `${TRACEWILD_API_PREFIX}/events`)!
    const res = response()

    events.handler(request('GET'), res.response)
    expect(subscribed).toBe(1)
    expect(res.writes.some(value => value.startsWith('data: '))).toBe(true)

    group.close()
    expect(unsubscribed).toBe(1)
    expect(res.ended()).toBe(true)
    group.close()
    expect(unsubscribed).toBe(1)
  })

  it('fails closed without committing an action that was awaiting its body during unload', async () => {
    const act = vi.fn()
    const service = { act } as unknown as TraceWildService
    const group = createTraceWildRoutes(service, '.')
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
