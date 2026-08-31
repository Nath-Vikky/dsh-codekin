import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { CORE_CODEKIN_RUNTIME, createInitialTraceWildState } from '../src/core-runtime.ts'
import {
  CODEKIN_SAVE_FORMAT,
  CODEKIN_SAVE_VERSION,
  TraceWildPersistence,
} from '../packages/dsh-adapter/src/persistence.ts'

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe('Codekin save persistence', () => {
  it('migrates the legacy tracewild save into codekinsave without losing progress', () => {
    const root = mkdtempSync(join(tmpdir(), 'codekin-save-'))
    roots.push(root)
    const legacy = join(root, 'tracewild', 'state.json')
    const current = join(root, 'codekinsave', 'state.json')
    const state = createInitialTraceWildState(100)
    state.cores.prism = 7
    mkdirSync(join(root, 'tracewild'), { recursive: true })
    writeFileSync(legacy, JSON.stringify(state), 'utf8')

    const loaded = new TraceWildPersistence(CORE_CODEKIN_RUNTIME, current, legacy).load(200)

    expect(loaded.cores.prism).toBe(7)
    expect(existsSync(legacy)).toBe(false)
    expect(JSON.parse(readFileSync(`${current}.migration-backup`, 'utf8'))).toMatchObject({
      cores: { prism: 7 },
    })
    expect(JSON.parse(readFileSync(current, 'utf8'))).toMatchObject({
      format: CODEKIN_SAVE_FORMAT,
      version: CODEKIN_SAVE_VERSION,
      engineVersion: '0.3.5-alpha.1',
      content: {
        id: CORE_CODEKIN_RUNTIME.content.id,
        packs: [{ id: '@nath-vikky/codekin-core', version: '0.3.5-alpha.1' }],
      },
      state: { cores: { prism: 7 } },
    })
  })

  it('upgrades an existing raw state and round-trips the versioned envelope', () => {
    const root = mkdtempSync(join(tmpdir(), 'codekin-envelope-'))
    roots.push(root)
    const current = join(root, 'codekinsave', 'state.json')
    const state = createInitialTraceWildState(100)
    state.materials.nova = 4
    mkdirSync(dirname(current), { recursive: true })
    writeFileSync(current, JSON.stringify(state), 'utf8')

    const persistence = new TraceWildPersistence(CORE_CODEKIN_RUNTIME, current, undefined)
    const migrated = persistence.load(200)
    const stored = JSON.parse(readFileSync(current, 'utf8')) as Record<string, unknown>

    expect(migrated.materials.nova).toBe(4)
    expect(JSON.parse(readFileSync(`${current}.migration-backup`, 'utf8'))).toMatchObject({
      materials: { nova: 4 },
    })
    expect(stored).toMatchObject({
      format: CODEKIN_SAVE_FORMAT,
      version: CODEKIN_SAVE_VERSION,
      state: { materials: { nova: 4 } },
    })
    expect(persistence.load(300).materials.nova).toBe(4)
  })

  it('rewrites stale content metadata after the engine has restored the state', () => {
    const root = mkdtempSync(join(tmpdir(), 'codekin-content-migration-'))
    roots.push(root)
    const current = join(root, 'codekinsave', 'state.json')
    const state = createInitialTraceWildState(100)
    state.cores.origin = 2
    mkdirSync(dirname(current), { recursive: true })
    writeFileSync(current, JSON.stringify({
      format: CODEKIN_SAVE_FORMAT,
      version: CODEKIN_SAVE_VERSION,
      engineVersion: '0.3.1',
      content: { id: 'old-content@0.3.1', packs: [{ id: 'old-content', version: '0.3.1' }] },
      state,
    }), 'utf8')

    const loaded = new TraceWildPersistence(CORE_CODEKIN_RUNTIME, current, undefined).load(200)
    const rewritten = JSON.parse(readFileSync(current, 'utf8')) as Record<string, unknown>

    expect(loaded.cores.origin).toBe(2)
    expect(JSON.parse(readFileSync(`${current}.migration-backup`, 'utf8'))).toMatchObject({
      content: { id: 'old-content@0.3.1' },
      state: { cores: { origin: 2 } },
    })
    expect(rewritten).toMatchObject({
      engineVersion: CORE_CODEKIN_RUNTIME.engineVersion,
      content: { id: CORE_CODEKIN_RUNTIME.content.id },
      state: { cores: { origin: 2 } },
    })
  })

  it('does not interpret an unknown future envelope as a current save', () => {
    const root = mkdtempSync(join(tmpdir(), 'codekin-future-save-'))
    roots.push(root)
    const current = join(root, 'codekinsave', 'state.json')
    const future = {
      format: CODEKIN_SAVE_FORMAT,
      version: 2,
      state: { ...createInitialTraceWildState(100), cores: { pebble: 99 } },
    }
    mkdirSync(dirname(current), { recursive: true })
    writeFileSync(current, JSON.stringify(future), 'utf8')

    const persistence = new TraceWildPersistence(CORE_CODEKIN_RUNTIME, current, undefined)
    const loaded = persistence.load(200)

    expect(loaded.cores.pebble).toBe(0)
    expect(JSON.parse(readFileSync(current, 'utf8'))).toMatchObject({ version: 2 })
    persistence.save(loaded)
    expect(JSON.parse(readFileSync(`${current}.migration-backup`, 'utf8'))).toMatchObject({ version: 2 })
    expect(JSON.parse(readFileSync(current, 'utf8'))).toMatchObject({
      version: CODEKIN_SAVE_VERSION,
      state: { cores: { pebble: 0 } },
    })
  })

  it('removes current, legacy, and interrupted temporary save files', () => {
    const root = mkdtempSync(join(tmpdir(), 'codekin-clear-'))
    roots.push(root)
    const legacy = join(root, 'tracewild', 'state.json')
    const current = join(root, 'codekinsave', 'state.json')
    for (const filename of [
      legacy, current, `${legacy}.tmp`, `${current}.tmp`, `${current}.migration-backup`,
    ]) {
      mkdirSync(dirname(filename), { recursive: true })
      writeFileSync(filename, '{}', 'utf8')
    }

    new TraceWildPersistence(CORE_CODEKIN_RUNTIME, current, legacy).clear()

    expect([
      legacy, current, `${legacy}.tmp`, `${current}.tmp`, `${current}.migration-backup`,
    ].some(existsSync)).toBe(false)
  })
})
