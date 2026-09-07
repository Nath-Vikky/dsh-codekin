import { EventEmitter } from 'node:events'
import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { CORE_CONTENT_VIEW } from '../src/core-runtime.ts'
import { createTraceWildRoutes, TRACEWILD_API_PREFIX } from '../packages/dsh-adapter/src/routes.ts'
import type { TraceWildService } from '../packages/dsh-adapter/src/service.ts'

const assetDirectory = fileURLToPath(new URL('../assets/creatures/', import.meta.url))

function request(path: string): IncomingMessage {
  return Object.assign(new EventEmitter(), {
    method: 'GET',
    url: `${TRACEWILD_API_PREFIX}/assets/${path}?content=${encodeURIComponent(CORE_CONTENT_VIEW.id)}`,
    headers: {
      host: '127.0.0.1:63214',
      origin: 'http://127.0.0.1:63214',
      'sec-fetch-site': 'same-origin',
    },
  }) as unknown as IncomingMessage
}

function response() {
  let status = 0
  let headers: Record<string, string> = {}
  let body = Buffer.alloc(0)
  const raw = Object.assign(new EventEmitter(), {
    destroyed: false,
    writableEnded: false,
    writeHead(value: number, valueHeaders: Record<string, string>) {
      status = value
      headers = valueHeaders
      return raw
    },
    end(value?: string | Uint8Array) {
      if (value !== undefined) body = Buffer.from(value)
      raw.writableEnded = true
      return raw
    },
  })
  return { response: raw as unknown as ServerResponse, status: () => status, headers: () => headers, body: () => body }
}

describe('production evolution asset delivery', () => {
  it('serves all five apex ultimate portraits through the registered asset route', async () => {
    const group = createTraceWildRoutes({} as TraceWildService, assetDirectory, CORE_CONTENT_VIEW)
    const route = group.routes.find(row => row.path === `${TRACEWILD_API_PREFIX}/assets`)!
    const assets = CORE_CONTENT_VIEW.assets.filter(row => row.key.endsWith(':ultimate'))
    expect(assets).toHaveLength(5)
    expect(assets.map(asset => asset.key)).toEqual(CORE_CONTENT_VIEW.creatures.filter(creature => creature.rarity === 'apex').map(creature => `creature:${creature.id}:ultimate`))
    try {
      for (const asset of assets) {
        const res = response()
        await route.handler(request(asset.path), res.response)
        expect(res.status(), asset.key).toBe(200)
        expect(res.headers()['content-type']).toBe('image/webp')
        expect(res.body().subarray(8, 12).toString('ascii')).toBe('WEBP')
        // Extended WebP's alpha flag prevents an opaque paper-backed replacement.
        expect(res.body().subarray(12, 16).toString('ascii'), asset.key).toBe('VP8X')
        expect(res.body()[20]! & 0x10, asset.key).toBe(0x10)
        expect(res.body().equals(await readFile(join(assetDirectory, asset.path)))).toBe(true)
      }
      const silhouettes = CORE_CONTENT_VIEW.assets.filter(row => row.key.endsWith(':ultimate-silhouette'))
      expect(silhouettes).toHaveLength(5)
      for (const asset of silhouettes) {
        const res = response()
        await route.handler(request(asset.path), res.response)
        expect(res.status(), asset.key).toBe(200)
        expect(res.headers()['content-type']).toBe('image/webp')
        expect(res.body().equals(await readFile(join(assetDirectory, asset.path)))).toBe(true)
      }
      const filenames = await readdir(join(assetDirectory, 'ultimate'))
      expect(filenames.sort()).toEqual([...assets, ...silhouettes].map(asset => asset.path.split('/').at(-1)).sort())
      const metadata = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')) as { files: string[] }
      expect(metadata.files).toContain('assets/creatures/ultimate')
    } finally { group.close() }
  })

  it('serves each of the 25 registered evolved images through the actual asset route', async () => {
    const group = createTraceWildRoutes({} as TraceWildService, assetDirectory, CORE_CONTENT_VIEW)
    const route = group.routes.find(row => row.path === `${TRACEWILD_API_PREFIX}/assets`)!
    try {
      expect(CORE_CONTENT_VIEW.creatures).toHaveLength(25)
      expect(CORE_CONTENT_VIEW.assets.filter(row => row.key.endsWith(':evolved'))).toHaveLength(25)
      for (const creature of CORE_CONTENT_VIEW.creatures) {
        const asset = CORE_CONTENT_VIEW.assets.find(row => row.key === `creature:${creature.id}:evolved`)
        expect(asset, creature.id).toMatchObject({ path: `evolved/${creature.id}.webp`, mime: 'image/webp', kind: 'creature' })
        const res = response()
        await route.handler(request(asset!.path), res.response)
        expect(res.status(), creature.id).toBe(200)
        expect(res.headers()['content-type'], creature.id).toBe('image/webp')
        expect(res.headers()['x-content-type-options']).toBe('nosniff')
        expect(res.body().subarray(0, 4).toString('ascii'), creature.id).toBe('RIFF')
        expect(res.body().subarray(8, 12).toString('ascii'), creature.id).toBe('WEBP')
        expect(res.headers()['content-length']).toBe(String(res.body().byteLength))
        expect(res.body().equals(await readFile(join(assetDirectory, asset!.path))), creature.id).toBe(true)
      }
    } finally {
      group.close()
    }
  })

  it('rejects unregistered galleries, prompts, and internal document paths', async () => {
    const group = createTraceWildRoutes({} as TraceWildService, assetDirectory, CORE_CONTENT_VIEW)
    const route = group.routes.find(row => row.path === `${TRACEWILD_API_PREFIX}/assets`)!
    try {
      // An existing image outside the registry demonstrates this is an allowlist, not a directory server.
      expect(existsSync(join(assetDirectory, 'sprite-gallery-v1.png'))).toBe(true)
      for (const path of [
        'sprite-gallery-v1.png',
        'gallery.html',
        'evolved/gallery.html',
        'evolved/production-manifest.json',
        'ultimate/gallery.html',
        'ultimate/manifest.json',
        'prompts/lumen-indeximp.md',
        'codekin-internal-docs/art/evolution/EVOLUTION_ART_STYLE_GUIDE.zh-CN.md',
        '../../codekin-internal-docs/art/evolution/EVOLUTION_ART_STYLE_GUIDE.zh-CN.md',
        '%2e%2e%2fcodekin-internal-docs%2fart%2fevolution%2fINDEXIMP_V8_PROMPT.md',
      ]) {
        const res = response()
        await route.handler(request(path), res.response)
        expect(res.status(), path).toBe(404)
        expect(res.body().byteLength, path).toBe(0)
      }
    } finally {
      group.close()
    }
  })

  it('packages the evolved assets without putting review documents in their production directory', async () => {
    const metadata = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')) as { files: string[] }
    expect(metadata.files).toContain('assets/creatures/evolved')
    expect(metadata.files.filter(path => /codekin-internal-docs|(?:^|\/)prompts(?:\/|$)|\.workspace|gallery\.html/i.test(path))).toEqual([])
    const filenames = await readdir(join(assetDirectory, 'evolved'))
    expect(filenames.sort()).toEqual(CORE_CONTENT_VIEW.creatures.map(creature => `${creature.id}.webp`).sort())
  })
})
