import { describe, expect, it, vi } from 'vitest'
import {
  CORE_ENGINE_CONTENT, CREATURE_ULTIMATE_LEVEL, MATERIAL_XP, applyTraceWildAction,
  createInitialTraceWildState, normalizeTraceWildAction, resolveCreatureAppearance,
  restoreTraceWildState, totalXpForLevel,
} from '../src/core-runtime.ts'
import type { CreatureAppearance, TraceWildState } from '../src/core-runtime.ts'

const instanceId = 'pet_ultimate_00000001'
function fixture(level: number, appearance?: CreatureAppearance, creatureId = 'lumen-atlashart'): TraceWildState {
  const state = createInitialTraceWildState(100)
  state.creatures = [{ instanceId, creatureId, quality: 'prism', level,
    ...(appearance === undefined ? {} : { appearance }), xp: totalXpForLevel(level, 'prism'),
    wins: 7, caughtAt: 100, firstSignal: 'lumen' }]
  state.starterChosen = true
  state.squad = [instanceId]
  state.materials = { pebble: 99, pulse: 99, prism: 99, nova: 99, origin: 99 }
  return state
}
const select = (appearance: CreatureAppearance) => ({ type: 'set-creature-appearance' as const, creatureInstanceId: instanceId, appearance })

describe('level 60 cosmetic ultimate form', () => {
  it('unlocks only registered apex art at level 60', () => {
    expect(CREATURE_ULTIMATE_LEVEL).toBe(60)
    expect(CORE_ENGINE_CONTENT.creatures.filter(row => CORE_ENGINE_CONTENT.hasUltimateAppearance(row.id))).toHaveLength(5)
    expect(resolveCreatureAppearance({ level: 59 }, true)).toBe('evolved')
    expect(resolveCreatureAppearance({ level: 60 }, true)).toBe('ultimate')
    expect(resolveCreatureAppearance({ level: 100 }, false)).toBe('evolved')
    for (const appearance of ['original', 'evolved', 'ultimate'] as const) {
      expect(resolveCreatureAppearance({ level: 60, appearance }, true)).toBe(appearance)
    }
    for (const state of [fixture(59), fixture(60, undefined, 'lumen-indeximp')]) {
      expect(() => applyTraceWildAction(state, select('ultimate'), () => 0, 200)).toThrow('invalid-action')
    }
    expect(normalizeTraceWildAction(select('ultimate'))).toEqual(select('ultimate'))
  })

  it('automatically selects ultimate when feeding crosses 60, including a jump across both thresholds', () => {
    for (const appearance of ['original', 'evolved'] as const) {
      const state = fixture(59, appearance)
      state.creatures[0]!.xp = totalXpForLevel(60, 'prism') - MATERIAL_XP.pebble
      const result = applyTraceWildAction(state, { type: 'feed-material', creatureInstanceId: instanceId, quality: 'pebble', count: 1 }, () => 0, 200)
      expect(result.state.creatures[0]).toMatchObject({ level: 60, appearance: 'ultimate', ultimateAppearanceUnlocked: true })
      expect(result.state.materials.pebble).toBe(98)
      expect(state.creatures[0]!.appearance).toBe(appearance)
    }
    const skipped = applyTraceWildAction(fixture(29, 'original'), { type: 'feed-material', creatureInstanceId: instanceId, quality: 'origin', count: 99 }, () => 0, 200).state
    expect(skipped.creatures[0]!.level).toBeGreaterThanOrEqual(60)
    expect(skipped.creatures[0]!.appearance).toBe('ultimate')
    const lowerRarity = applyTraceWildAction(fixture(59, 'evolved', 'lumen-indeximp'), { type: 'feed-material', creatureInstanceId: instanceId, quality: 'origin', count: 1 }, () => 0, 200).state
    expect(lowerRarity.creatures[0]!.appearance).toBe('evolved')
  })

  it('migrates existing level-60 saves once and preserves every later wardrobe choice through reloads and upgrades', () => {
    const old = fixture(60, 'evolved')
    const migrated = restoreTraceWildState(old, 200)
    expect(migrated.creatures[0]).toMatchObject({ appearance: 'ultimate', ultimateAppearanceUnlocked: true })
    for (const appearance of ['original', 'evolved', 'ultimate'] as const) {
      const selected = applyTraceWildAction(migrated, select(appearance), () => 0, 201).state
      const restored = restoreTraceWildState(JSON.parse(JSON.stringify(selected)), 202)
      expect(restored.creatures[0]!.appearance).toBe(appearance)
      const upgraded = applyTraceWildAction(restored, { type: 'feed-material', creatureInstanceId: instanceId, quality: 'origin', count: 1 }, () => 0, 203).state
      expect(upgraded.creatures[0]!.appearance).toBe(appearance)
    }
    const corrected = fixture(59, 'original')
    corrected.creatures[0]!.xp = totalXpForLevel(61, 'prism')
    expect(restoreTraceWildState(corrected, 200).creatures[0]).toMatchObject({ level: 61, appearance: 'ultimate' })
    for (const invalid of [fixture(59, 'ultimate'), fixture(70, 'ultimate', 'lumen-indeximp')]) {
      invalid.creatures[0]!.ultimateAppearanceUnlocked = true
      const cleaned = restoreTraceWildState(invalid, 200).creatures[0]!
      expect(cleaned.appearance).toBeUndefined()
      expect(cleaned.ultimateAppearanceUnlocked).toBeUndefined()
    }
  })

  it('changes only cosmetic state and bookkeeping, with identical combat and random consumption', () => {
    const state = restoreTraceWildState(fixture(60), 100)
    const random = vi.fn(() => 0.2)
    const changed = applyTraceWildAction(state, select('original'), random, 200).state
    expect(random).not.toHaveBeenCalled()
    expect(changed).toEqual({ ...state, revision: state.revision + 1, updatedAt: 200,
      creatures: [{ ...state.creatures[0], appearance: 'original' }] })
    const originalRandom = vi.fn(() => 0.2)
    const ultimateRandom = vi.fn(() => 0.2)
    const originalBattle = applyTraceWildAction(changed, { type: 'start-tower' }, originalRandom, 201).state.battle
    const ultimateBattle = applyTraceWildAction(state, { type: 'start-tower' }, ultimateRandom, 201).state.battle
    expect(originalBattle).toEqual(ultimateBattle)
    expect(originalRandom.mock.calls.length).toBe(ultimateRandom.mock.calls.length)
    expect(() => applyTraceWildAction({ ...state, battle: ultimateBattle! }, select('evolved'), random, 202)).toThrow('conflict')
  })
})
