import { EventEmitter } from 'node:events'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import type { WebRoute } from '@deepseek-ai/dsh-host-webserver'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { apply } from '../src/index.ts'
import { TRACEWILD_API_PREFIX } from '../packages/dsh-adapter/src/routes.ts'

interface FakeResponse {
  response: ServerResponse
  status: () => number
  body: () => string
  ended: () => boolean
}

interface PluginHarness {
  routes: Map<string, WebRoute>
  eventListeners: Map<string, Set<(...args: never[]) => void>>
  routeDisposals: ReturnType<typeof vi.fn>
  eventDisposals: ReturnType<typeof vi.fn>
  unload(): void
}

const temporaryRoots: string[] = []
const originalDshHome = process.env.DSH_HOME

afterEach(() => {
  if (originalDshHome === undefined) delete process.env.DSH_HOME
  else process.env.DSH_HOME = originalDshHome
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true })
})

function response(): FakeResponse {
  const emitter = new EventEmitter()
  let status = 0
  let body = ''
  let ended = false
  const raw = Object.assign(emitter, {
    destroyed: false,
    writeHead(value: number) {
      status = value
      return raw
    },
    flushHeaders() {},
    write(value: string) {
      body += value
      return true
    },
    end(value?: string | Buffer) {
      if (value !== undefined) body += value.toString()
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
    status: () => status,
    body: () => body,
    ended: () => ended,
  }
}

function request(method: string, path: string, contentType = false): IncomingMessage {
  return Object.assign(new EventEmitter(), {
    method,
    url: path,
    headers: {
      host: '127.0.0.1:63214',
      origin: 'http://127.0.0.1:63214',
      'sec-fetch-site': 'same-origin',
      ...(contentType ? { 'content-type': 'application/json' } : {}),
    },
    destroy: vi.fn(),
  }) as unknown as IncomingMessage
}

function startPlugin(): PluginHarness {
  const routes = new Map<string, WebRoute>()
  const eventListeners = new Map<string, Set<(...args: never[]) => void>>()
  const effects: (() => void)[] = []
  const routeDisposals = vi.fn()
  const eventDisposals = vi.fn()
  const ctx = {
    sessions: { get: vi.fn() },
    logger: { warn: vi.fn() },
    webServer: {
      register(route: WebRoute) {
        routes.set(route.path, route)
        return () => {
          routes.delete(route.path)
          routeDisposals(route.path)
        }
      },
    },
    on(name: string, listener: (...args: never[]) => void) {
      const listeners = eventListeners.get(name) ?? new Set()
      listeners.add(listener)
      eventListeners.set(name, listeners)
      return () => {
        listeners.delete(listener)
        eventDisposals(name)
      }
    },
    effect(callback: () => void | (() => void)) {
      const cleanup = callback()
      if (typeof cleanup === 'function') effects.push(cleanup)
    },
  } as unknown as Context
  apply(ctx)
  return {
    routes,
    eventListeners,
    routeDisposals,
    eventDisposals,
    unload() {
      for (const cleanup of effects.splice(0).reverse()) cleanup()
    },
  }
}

async function post(harness: PluginHarness, action: unknown): Promise<Record<string, unknown>> {
  const route = harness.routes.get(`${TRACEWILD_API_PREFIX}/action`)!
  const req = request('POST', route.path, true)
  const res = response()
  const pending = route.handler(req, res.response)
  req.emit('data', Buffer.from(JSON.stringify(action)))
  req.emit('end')
  await pending
  expect(res.status()).toBe(200)
  return JSON.parse(res.body()) as Record<string, unknown>
}

async function getState(harness: PluginHarness): Promise<Record<string, unknown>> {
  const route = harness.routes.get(`${TRACEWILD_API_PREFIX}/state`)!
  const res = response()
  await route.handler(request('GET', route.path), res.response)
  expect(res.status()).toBe(200)
  return JSON.parse(res.body()) as Record<string, unknown>
}

describe('installed plugin lifecycle', () => {
  it('unloads every route, event listener, and stream while preserving progress across restarts and uninstall', async () => {
    const root = mkdtempSync(join(tmpdir(), 'codekin-plugin-lifecycle-'))
    temporaryRoots.push(root)
    process.env.DSH_HOME = root
    const save = join(root, 'codekinsave', 'state.json')

    const first = startPlugin()
    expect(first.routes).toHaveLength(6)
    expect([...first.eventListeners.values()].reduce((sum, listeners) => sum + listeners.size, 0)).toBe(2)
    await post(first, { type: 'choose-starter', creatureId: 'lumen-indeximp' })
    await post(first, { type: 'set-enabled', enabled: false })
    expect(existsSync(save)).toBe(true)

    const events = first.routes.get(`${TRACEWILD_API_PREFIX}/events`)!
    const stream = response()
    await events.handler(request('GET', events.path), stream.response)
    expect(stream.ended()).toBe(false)

    first.unload()
    expect(stream.ended()).toBe(true)
    expect(first.routes).toHaveLength(0)
    expect(first.routeDisposals).toHaveBeenCalledTimes(6)
    expect(first.eventDisposals).toHaveBeenCalledTimes(2)
    const afterUnload = readFileSync(save, 'utf8')

    const restarted = startPlugin()
    const restartedSnapshot = await getState(restarted) as {
      state: { enabled: boolean; creatures: { creatureId: string }[] }
    }
    expect(restartedSnapshot.state.enabled).toBe(false)
    expect(restartedSnapshot.state.creatures[0]?.creatureId).toBe('lumen-indeximp')
    restarted.unload()

    // Plugin removal only tears down Cordis resources. Save deletion remains
    // an explicit, separately confirmed settings action.
    expect(readFileSync(save, 'utf8')).toBe(afterUnload)
    const reinstalled = startPlugin()
    const reinstalledSnapshot = await getState(reinstalled) as {
      state: { enabled: boolean; creatures: { creatureId: string }[] }
    }
    expect(reinstalledSnapshot.state).toMatchObject({
      enabled: false,
      creatures: [{ creatureId: 'lumen-indeximp' }],
    })
    reinstalled.unload()
  })
})
