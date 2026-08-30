import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { createInitialTraceWildState } from '../packages/engine/src/engine.ts'
import { TraceWildPersistence } from '../src/host/persistence.ts'

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

    const loaded = new TraceWildPersistence(current, legacy).load(200)

    expect(loaded.cores.prism).toBe(7)
    expect(existsSync(legacy)).toBe(false)
    expect(JSON.parse(readFileSync(current, 'utf8'))).toMatchObject({ cores: { prism: 7 } })
  })

  it('removes current, legacy, and interrupted temporary save files', () => {
    const root = mkdtempSync(join(tmpdir(), 'codekin-clear-'))
    roots.push(root)
    const legacy = join(root, 'tracewild', 'state.json')
    const current = join(root, 'codekinsave', 'state.json')
    for (const filename of [legacy, current, `${legacy}.tmp`, `${current}.tmp`]) {
      mkdirSync(dirname(filename), { recursive: true })
      writeFileSync(filename, '{}', 'utf8')
    }

    new TraceWildPersistence(current, legacy).clear()

    expect([legacy, current, `${legacy}.tmp`, `${current}.tmp`].some(existsSync)).toBe(false)
  })
})
