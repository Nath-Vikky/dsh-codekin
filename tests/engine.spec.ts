import { describe, expect, it } from 'vitest'
import { CREATURE_CATALOG } from '../src/core/catalog.ts'
import {
  applyTraceSignal,
  applyTraceWildAction,
  createInitialTraceWildState,
  restoreTraceWildState,
} from '../src/core/engine.ts'
import { findFirstLegalBattleSwap } from '../src/core/match3.ts'
import { CREATURE_SKILLS } from '../src/core/skills.ts'
import type { TraceWildState } from '../src/core/types.ts'

const low = (): number => 0

function battleState(): TraceWildState {
  let state = applyTraceWildAction(
    createInitialTraceWildState(100),
    { type: 'choose-starter', creatureId: 'aegis-veribud' },
    low,
    150,
  ).state
  state = applyTraceSignal(state, {
    id: 'turn-3', at: 200, ecology: 'glitch', outcome: 'failed', intensity: 5,
    enhanced: true, variant: 'missing',
  }, low)
  return applyTraceWildAction(state, { type: 'start-battle', encounterId: state.encounters[0]!.id }, low, 210).state
}

describe('TraceWild match battle', () => {
  it('ships 25 creatures with exactly one passive and active definition each', () => {
    expect(CREATURE_CATALOG).toHaveLength(25)
    expect(CREATURE_SKILLS).toHaveLength(25)
    expect(new Set(CREATURE_CATALOG.map(row => row.id))).toHaveProperty('size', 25)
    expect(new Set(CREATURE_SKILLS.map(row => row.creatureId))).toHaveProperty('size', 25)
    expect(new Set(CREATURE_CATALOG.map(row => row.ecology))).toHaveProperty('size', 5)
  })

  it('drops one core, spawns one encounter, and applies a signal idempotently', () => {
    const initial = createInitialTraceWildState(100)
    const signal = {
      id: 'turn-1', at: 200, ecology: 'lumen', outcome: 'completed', intensity: 2, enhanced: false,
    } as const
    const next = applyTraceSignal(initial, signal, low)
    expect(next.schemaVersion).toBe(2)
    expect(next.cores.pebble).toBe(1)
    expect(next.encounters).toHaveLength(1)
    expect(applyTraceSignal(next, signal, low)).toBe(next)
  })

  it('creates a playable 7x7 board and rotates after three valid swaps', () => {
    let state = battleState()
    expect(state.battle?.board).toHaveLength(49)
    for (let move = 0; move < 3; move += 1) {
      const swap = findFirstLegalBattleSwap(state.battle!.board)
      expect(swap).toBeDefined()
      state = applyTraceWildAction(state, { type: 'battle-swap', ...swap! }, low, 220 + move).state
    }
    expect(state.battle?.actionsRemaining).toBe(3)
    expect(state.battle?.stage).toBe(2)
    expect(state.battle?.round).toBe(2)
  })

  it('charges and casts the active creature skill without consuming a swap', () => {
    const state = battleState()
    state.battle!.party[0]!.energy = 12
    const beforeActions = state.battle!.actionsRemaining
    const result = applyTraceWildAction(state, {
      type: 'battle-cast', creatureInstanceId: state.battle!.party[0]!.instanceId,
    }, low, 230)
    expect(result.notice).toBe('skill-cast')
    expect(result.state.battle?.party[0]).toMatchObject({ energy: 0, skillUsedStage: true })
    expect(result.state.battle?.actionsRemaining).toBe(beforeActions)
  })

  it('captures a weakened creature and records the core as individual quality', () => {
    const state = battleState()
    state.battle!.wildArmor = 0
    state.battle!.wildHp = 1
    state.cores.origin = 1
    const result = applyTraceWildAction(state, { type: 'capture', quality: 'origin' }, low, 240)
    expect(result.notice).toBe('capture-success')
    expect(result.state.battle).toBeUndefined()
    expect(result.state.creatures.at(-1)?.quality).toBe('origin')
  })

  it('migrates schema-v1 creatures to Prism quality and drops the legacy battle', () => {
    const current = battleState()
    const legacy = structuredClone(current) as unknown as Record<string, unknown>
    legacy.schemaVersion = 1
    const creatures = legacy.creatures as Array<Record<string, unknown>>
    for (const creature of creatures) delete creature.quality
    const restored = restoreTraceWildState(legacy, 500)
    expect(restored.schemaVersion).toBe(2)
    expect(restored.creatures.every(creature => creature.quality === 'prism')).toBe(true)
    expect(restored.battle).toBeUndefined()
  })
})
