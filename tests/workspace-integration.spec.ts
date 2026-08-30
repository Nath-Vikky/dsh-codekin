import { EventEmitter } from 'node:events'
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CORE_CODEKIN_RUNTIME, CORE_CONTENT_VIEW } from '../src/core-runtime.ts'
import { TraceWildPersistence } from '../packages/dsh-adapter/src/persistence.ts'
import { createTraceWildRoutes, TRACEWILD_API_PREFIX } from '../packages/dsh-adapter/src/routes.ts'
import { TraceWildService } from '../packages/dsh-adapter/src/service.ts'
import {
  activateCodekinContent,
  contentAssetUrl,
  creatureById,
  parseCodekinContentView,
} from '../packages/renderer-react/src/content.ts'

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

function request(path: string): IncomingMessage {
  return Object.assign(new EventEmitter(), {
    method: 'GET',
    url: path,
    headers: {
      host: '127.0.0.1:63214',
      origin: 'http://127.0.0.1:63214',
      'sec-fetch-site': 'same-origin',
    },
  }) as unknown as IncomingMessage
}

function response(): { response: ServerResponse; status: () => number; body: () => string } {
  let status = 0
  let body = ''
  const raw = Object.assign(new EventEmitter(), {
    destroyed: false,
    writableEnded: false,
    writeHead(value: number) {
      status = value
      return raw
    },
    end(value?: string) {
      if (value !== undefined) body += value
      raw.writableEnded = true
      return raw
    },
  })
  return { response: raw as unknown as ServerResponse, status: () => status, body: () => body }
}

describe('engine/content/adapter/renderer integration', () => {
  it('persists an engine action and serves matching state and content to the renderer', async () => {
    const root = mkdtempSync(join(tmpdir(), 'codekin-workspace-'))
    roots.push(root)
    const filename = join(root, 'codekinsave', 'state.json')
    mkdirSync(dirname(filename), { recursive: true })
    let now = 1_700_000_000_000
    const ctx = {
      sessions: { get: vi.fn() },
      logger: { warn: vi.fn() },
    } as unknown as Context
    const persistence = new TraceWildPersistence(CORE_CODEKIN_RUNTIME, filename, undefined)
    const service = new TraceWildService(ctx, {
      runtime: CORE_CODEKIN_RUNTIME,
      persistence,
      random: () => 0,
      now: () => now,
    })
    const starterId = CORE_CODEKIN_RUNTIME.content.starterCreatureIds[0]!

    now += 1
    service.act({ type: 'choose-starter', creatureId: starterId })
    const routes = createTraceWildRoutes(service, '.', CORE_CONTENT_VIEW)
    const contentResponse = response()
    const stateResponse = response()
    await routes.routes.find(route => route.path === `${TRACEWILD_API_PREFIX}/content`)!
      .handler(request(`${TRACEWILD_API_PREFIX}/content`), contentResponse.response)
    await routes.routes.find(route => route.path === `${TRACEWILD_API_PREFIX}/state`)!
      .handler(request(`${TRACEWILD_API_PREFIX}/state`), stateResponse.response)

    expect(contentResponse.status()).toBe(200)
    const view = parseCodekinContentView(JSON.parse(contentResponse.body()) as unknown)
    activateCodekinContent(view)
    expect(creatureById(starterId)?.id).toBe(starterId)
    expect(contentAssetUrl(`creature:${starterId}:sprite`)).toContain('/api/tracewild/assets/')

    expect(stateResponse.status()).toBe(200)
    const snapshot = JSON.parse(stateResponse.body()) as { state: { creatures: { creatureId: string }[] } }
    expect(snapshot.state.creatures[0]?.creatureId).toBe(starterId)
    expect(JSON.parse(readFileSync(filename, 'utf8'))).toMatchObject({
      format: 'codekin.save',
      content: { id: view.id },
      state: { creatures: [{ creatureId: starterId }] },
    })
    expect(new TraceWildPersistence(CORE_CODEKIN_RUNTIME, filename, undefined).load(now + 1)
      .creatures[0]?.creatureId).toBe(starterId)
  })
})
