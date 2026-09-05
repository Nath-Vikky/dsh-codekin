import { describe, expect, it, vi } from 'vitest'
import {
  CREATURE_EVOLUTION_LEVEL,
  MATERIAL_XP,
  applyTraceWildAction,
  createInitialTraceWildState,
  normalizeTraceWildAction,
  resolveCreatureAppearance,
  restoreTraceWildState,
  totalXpForLevel,
} from '../src/core-runtime.ts'
import type { CreatureAppearance, TraceWildAction, TraceWildState } from '../src/core-runtime.ts'

const instanceId = 'pet_appearance_00000001'
const otherInstanceId = 'pet_appearance_00000002'

function rosterState(level: number, appearance?: CreatureAppearance): TraceWildState {
  const state = createInitialTraceWildState(100)
  state.creatures = [{
    instanceId,
    creatureId: 'lumen-indeximp',
    quality: 'prism',
    level,
    ...(appearance === undefined ? {} : { appearance }),
    xp: totalXpForLevel(level, 'prism'),
    wins: 7,
    caughtAt: 100,
    firstSignal: 'lumen',
  }]
  state.starterChosen = true
  state.squad = [instanceId]
  state.materials = { pebble: 99, pulse: 99, prism: 99, nova: 99, origin: 99 }
  return state
}

function appearanceAction(appearance: CreatureAppearance): TraceWildAction {
  return { type: 'set-creature-appearance', creatureInstanceId: instanceId, appearance }
}

function seededRandom(): () => number {
  let seed = 0xc0de_0030
  return () => {
    seed = (Math.imul(seed, 1_664_525) + 1_013_904_223) >>> 0
    return seed / 0x1_0000_0000
  }
}

describe('level 30 cosmetic evolution', () => {
  it('locks the evolution threshold and defaults old creatures to their level appearance', () => {
    expect(CREATURE_EVOLUTION_LEVEL).toBe(30)
    for (const appearance of [undefined, 'original', 'evolved'] as const) {
      const selection = appearance === undefined ? {} : { appearance }
      expect(resolveCreatureAppearance({ level: 29, ...selection })).toBe('original')
      expect(resolveCreatureAppearance({ level: 30, ...selection })).toBe(appearance === 'original' ? 'original' : 'evolved')
      expect(resolveCreatureAppearance({ level: 100, ...selection })).toBe(appearance === 'original' ? 'original' : 'evolved')
    }
  })

  it('switches 29 to 30 to evolved even after the player previously chose original', () => {
    const state = rosterState(29, 'original')
    state.creatures[0]!.xp = totalXpForLevel(30, 'prism') - MATERIAL_XP.pebble
    const result = applyTraceWildAction(state, {
      type: 'feed-material', creatureInstanceId: instanceId, quality: 'pebble', count: 1,
    }, () => 0, 200)
    expect(result.state.creatures[0]).toMatchObject({ level: 30, appearance: 'evolved' })
    expect(result.state.materials.pebble).toBe(98)
    expect(result.notice).toBe('material-used')
    expect(state.creatures[0]).toMatchObject({ level: 29, appearance: 'original' })
  })

  it('evolves when one feed skips several levels across the threshold', () => {
    const state = rosterState(28, 'original')
    const result = applyTraceWildAction(state, {
      type: 'feed-material', creatureInstanceId: instanceId, quality: 'origin', count: 1,
    }, () => 0, 200)
    expect(result.state.creatures[0]!.level).toBeGreaterThan(30)
    expect(result.state.creatures[0]!.appearance).toBe('evolved')
  })

  it('respects original selections during later upgrades and before evolution unlocks', () => {
    for (const [from, to] of [[28, 29], [30, 31], [70, 71]] as const) {
      const state = rosterState(from, 'original')
      state.creatures[0]!.xp = totalXpForLevel(to, 'prism') - MATERIAL_XP.pebble
      const result = applyTraceWildAction(state, {
        type: 'feed-material', creatureInstanceId: instanceId, quality: 'pebble', count: 1,
      }, () => 0, 200)
      expect(result.state.creatures[0]).toMatchObject({ level: to, appearance: 'original' })
    }
  })

  it('restores old saves without adding a choice, including legacy schema migrations', () => {
    for (const schemaVersion of [1, 2, 3]) {
      for (const level of [29, 30]) {
        const restored = restoreTraceWildState({ ...rosterState(level), schemaVersion }, 200)
        expect(restored.creatures[0]!.appearance).toBeUndefined()
        expect(resolveCreatureAppearance(restored.creatures[0]!)).toBe(level < 30 ? 'original' : 'evolved')
      }
    }
    expect(resolveCreatureAppearance(restoreTraceWildState(rosterState(75), 200).creatures[0]!)).toBe('evolved')
  })

  it('saves explicit choices per instance, independently of another copy of the same species', () => {
    const state = rosterState(30)
    state.creatures.push({ ...state.creatures[0]!, instanceId: otherInstanceId })
    const selected = applyTraceWildAction(state, appearanceAction('original'), () => 0, 200).state
    const restored = restoreTraceWildState(JSON.parse(JSON.stringify(selected)), 201)
    expect(restored.creatures[0]!.appearance).toBe('original')
    expect(resolveCreatureAppearance(restored.creatures[0]!)).toBe('original')
    expect(restored.creatures[1]!.appearance).toBeUndefined()
    expect(resolveCreatureAppearance(restored.creatures[1]!)).toBe('evolved')
    const evolved = applyTraceWildAction(restored, appearanceAction('evolved'), () => 0, 202).state
    expect(restoreTraceWildState(JSON.parse(JSON.stringify(evolved)), 203).creatures[0]!.appearance).toBe('evolved')
    expect(evolved.creatures[1]).toEqual(restored.creatures[1])
  })

  it('cleans invalid saved choices and rejects locked evolved appearances during restore', () => {
    for (const appearance of [null, false, 30, '', 'EVOLVED', 'future', {}, []]) {
      const state = rosterState(30)
      const saved = { ...state, creatures: [{ ...state.creatures[0], appearance }] }
      const restored = restoreTraceWildState(saved, 200).creatures[0]!
      expect(restored).not.toHaveProperty('appearance')
      expect(resolveCreatureAppearance(restored)).toBe('evolved')
    }
    const locked = restoreTraceWildState(rosterState(29, 'evolved'), 200).creatures[0]!
    expect(locked).not.toHaveProperty('appearance')
    expect(resolveCreatureAppearance(locked)).toBe('original')
  })

  it('uses the corrected XP level when a saved creature crosses 30 during restore', () => {
    const state = rosterState(29, 'original')
    state.creatures[0]!.xp = totalXpForLevel(32, 'prism')
    expect(restoreTraceWildState(state, 200).creatures[0]).toMatchObject({ level: 32, appearance: 'evolved' })
  })

  it('changes only appearance and action bookkeeping even when idle rewards are due', () => {
    const state = rosterState(30)
    const before = structuredClone(state)
    const random = vi.fn(() => 0)
    const now = 100 + 2 * 60 * 60_000
    const result = applyTraceWildAction(state, appearanceAction('original'), random, now)
    expect(result).toEqual({
      state: {
        ...before,
        revision: before.revision + 1,
        updatedAt: now,
        creatures: [{ ...before.creatures[0], appearance: 'original' }],
      },
    })
    expect(random).not.toHaveBeenCalled()
    expect(state).toEqual(before)
  })

  it('keeps future battle state and random consumption identical across appearances', () => {
    const state = rosterState(40)
    const original = applyTraceWildAction(state, appearanceAction('original'), () => 0, 200).state
    const evolvedRandom = vi.fn(seededRandom())
    const originalRandom = vi.fn(seededRandom())
    const evolvedBattle = applyTraceWildAction(state, { type: 'start-tower' }, evolvedRandom, 300).state.battle
    const originalBattle = applyTraceWildAction(original, { type: 'start-tower' }, originalRandom, 300).state.battle
    expect(evolvedBattle).toBeDefined()
    expect(originalBattle).toEqual(evolvedBattle)
    expect(originalRandom.mock.results).toEqual(evolvedRandom.mock.results)
  })

  it('rejects unknown instances, locked forms, and invalid enum values without mutation', () => {
    const state = rosterState(29)
    const before = structuredClone(state)
    const random = vi.fn(() => 0)
    const invalidActions = [
      appearanceAction('evolved'),
      { ...appearanceAction('original'), creatureInstanceId: otherInstanceId },
      { ...appearanceAction('original'), appearance: 'future' },
      { ...appearanceAction('original'), appearance: undefined },
    ] as TraceWildAction[]
    for (const action of invalidActions) {
      expect(() => applyTraceWildAction(state, action, random, 200)).toThrowError('invalid-action')
    }
    expect(state).toEqual(before)
    expect(random).not.toHaveBeenCalled()
    expect(applyTraceWildAction(state, appearanceAction('original'), random, 200).state.creatures[0]!.appearance).toBe('original')
  })

  it('disallows cosmetic changes while disabled or in a battle', () => {
    const disabled = rosterState(30)
    disabled.enabled = false
    const battle = applyTraceWildAction(rosterState(30), { type: 'start-tower' }, seededRandom(), 200).state
    for (const state of [disabled, battle]) {
      const before = structuredClone(state)
      const random = vi.fn(() => 0)
      expect(() => applyTraceWildAction(state, appearanceAction('original'), random, 300)).toThrowError('conflict')
      expect(state).toEqual(before)
      expect(random).not.toHaveBeenCalled()
    }
  })
})

describe('appearance action protocol', () => {
  it('accepts only the exact action fields and both supported choices', () => {
    for (const appearance of ['original', 'evolved'] as const) {
      const action = appearanceAction(appearance)
      expect(normalizeTraceWildAction(action)).toEqual(action)
    }
    const valid = appearanceAction('original')
    const invalid: unknown[] = [
      { type: 'set-creature-appearance', creatureInstanceId: instanceId },
      { type: 'set-creature-appearance', appearance: 'original' },
      { ...valid, extra: true },
      { ...valid, appearance: 'Original' },
      { ...valid, appearance: null },
      { ...valid, appearance: true },
      { ...valid, appearance: 30 },
      { ...valid, creatureInstanceId: 'wild_00000001' },
      { ...valid, creatureInstanceId: '../pet_00000001' },
      { ...valid, creatureInstanceId: '' },
      { ...valid, creatureInstanceId: 12 },
      { ...valid, creatureInstanceId: `pet_${'a'.repeat(100)}` },
      Object.assign(Object.create({ injected: true }), valid),
      [valid],
    ]
    for (const value of invalid) expect(() => normalizeTraceWildAction(value)).toThrowError(TypeError)
  })
})
