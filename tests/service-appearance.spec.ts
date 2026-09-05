import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TraceWildPersistence } from '../packages/dsh-adapter/src/persistence.ts'
import { TraceWildService } from '../packages/dsh-adapter/src/service.ts'
import { CORE_CODEKIN_RUNTIME, createInitialTraceWildState, totalXpForLevel } from '../src/core-runtime.ts'
import type { TraceWildSnapshot } from '../src/core-runtime.ts'

const roots: string[] = []
const instanceId = 'pet_service_appearance_00000001'

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'codekin-appearance-'))
  roots.push(root)
  const filename = join(root, 'state.json')
  let now = 100
  const state = createInitialTraceWildState(now)
  state.starterChosen = true
  state.materials.nova = 5
  state.cores.prism = 2
  state.creatures = [{
    instanceId,
    creatureId: 'lumen-indeximp',
    quality: 'prism',
    level: 30,
    xp: totalXpForLevel(30, 'prism'),
    wins: 3,
    caughtAt: now,
    firstSignal: 'lumen',
  }]
  state.squad = [instanceId]
  const persistence = new TraceWildPersistence(CORE_CODEKIN_RUNTIME, filename, undefined)
  persistence.save(state)
  const random = vi.fn(() => 0.25)
  const service = new TraceWildService({} as Context, {
    runtime: CORE_CODEKIN_RUNTIME,
    persistence,
    random,
    now: () => now,
  })
  return { service, persistence, filename, random, advance: () => { now += 3 * 60 * 60_000 } }
}

describe('service appearance persistence and settlement', () => {
  it('persists and broadcasts a cosmetic change without rolling an overdue idle reward', () => {
    const { service, persistence, random, advance } = fixture()
    const listener = vi.fn<(snapshot: TraceWildSnapshot) => void>()
    const unsubscribe = service.subscribe(listener)
    const before = listener.mock.calls[0]![0]
    listener.mockClear()
    advance()

    const result = service.act({ type: 'set-creature-appearance', creatureInstanceId: instanceId, appearance: 'original' })

    expect(result.ok).toBe(true)
    expect(result.state.revision).toBe(before.state.revision + 1)
    expect(result.state.updatedAt).toBe(result.serverTime)
    expect(result.state.creatures[0]).toMatchObject({
      appearance: 'original', level: 30, xp: before.state.creatures[0]!.xp, wins: 3,
    })
    expect(result.state.materials).toEqual(before.state.materials)
    expect(result.state.cores).toEqual(before.state.cores)
    expect(result.state.stats).toEqual(before.state.stats)
    expect(result.state.idle).toEqual(before.state.idle)
    expect(random).not.toHaveBeenCalled()
    expect(listener).toHaveBeenCalledExactlyOnceWith({
      schemaVersion: result.schemaVersion, state: result.state, serverTime: result.serverTime,
    })
    const restored = persistence.load(result.serverTime)
    expect(restored.creatures[0]!.appearance).toBe('original')
    expect(restored.idle.pendingReward).toBeUndefined()

    // A later ordinary refresh still settles the reward once; cosmetics do not reset its watermark.
    const refreshed = service.snapshot()
    expect(refreshed.state.idle.pendingReward).toBeDefined()
    expect(random).toHaveBeenCalled()
    const consumed = random.mock.calls.length
    expect(service.snapshot().state.idle).toEqual(refreshed.state.idle)
    expect(random).toHaveBeenCalledTimes(consumed)
    unsubscribe()
  })

  it('keeps response mutations outside the service state while switching back to evolved', () => {
    const { service, persistence, random, advance } = fixture()
    advance()
    const original = service.act({ type: 'set-creature-appearance', creatureInstanceId: instanceId, appearance: 'original' })
    original.state.creatures[0]!.level = 1
    original.state.materials.nova = 9999

    const evolved = service.act({ type: 'set-creature-appearance', creatureInstanceId: instanceId, appearance: 'evolved' })
    expect(evolved.state.creatures[0]).toMatchObject({ level: 30, appearance: 'evolved' })
    expect(evolved.state.materials.nova).toBe(5)
    expect(persistence.load(evolved.serverTime).creatures[0]!.appearance).toBe('evolved')
    expect(random).not.toHaveBeenCalled()
  })

  it('does not save, publish, or settle when an appearance action is rejected', () => {
    const { service, filename, random, advance } = fixture()
    const listener = vi.fn()
    const unsubscribe = service.subscribe(listener)
    listener.mockClear()
    const before = readFileSync(filename, 'utf8')
    advance()

    expect(() => service.act({
      type: 'set-creature-appearance', creatureInstanceId: 'pet_missing_00000001', appearance: 'original',
    })).toThrowError('invalid-action')

    expect(readFileSync(filename, 'utf8')).toBe(before)
    expect(listener).not.toHaveBeenCalled()
    expect(random).not.toHaveBeenCalled()
    unsubscribe()
  })
})
