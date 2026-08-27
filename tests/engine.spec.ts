import { describe, expect, it } from 'vitest'
import { CREATURE_CATALOG } from '../src/core/catalog.ts'
import {
  applyTraceSignal,
  applyTraceWildAction,
  createInitialTraceWildState,
} from '../src/core/engine.ts'

const low = (): number => 0

describe('TraceWild engine', () => {
  it('ships 25 unique creatures across five ecologies', () => {
    expect(CREATURE_CATALOG).toHaveLength(25)
    expect(new Set(CREATURE_CATALOG.map(row => row.id))).toHaveProperty('size', 25)
    expect(new Set(CREATURE_CATALOG.map(row => row.ecology))).toHaveProperty('size', 5)
  })

  it('turn completion drops one core, spawns one encounter, and is idempotent', () => {
    const initial = createInitialTraceWildState(100)
    const signal = {
      id: 'turn-1', at: 200, ecology: 'lumen', outcome: 'completed', intensity: 2, enhanced: false,
    } as const
    const next = applyTraceSignal(initial, signal, low)
    expect(next.cores.pebble).toBe(1)
    expect(next.encounters).toHaveLength(1)
    expect(next.stats.completedTurns).toBe(1)
    expect(applyTraceSignal(next, signal, low)).toBe(next)
  })

  it('turn failure creates an armored Glitch encounter without awarding a core', () => {
    const next = applyTraceSignal(createInitialTraceWildState(100), {
      id: 'turn-2', at: 200, ecology: 'glitch', outcome: 'failed', intensity: 5,
      enhanced: true, variant: 'crash',
    }, low)
    expect(next.stats.failedTurns).toBe(1)
    expect(next.encounters[0]).toMatchObject({ ecology: 'glitch', enhanced: true, armor: 2 })
    expect(Object.values(next.cores).reduce((sum, count) => sum + count, 0)).toBe(0)
  })

  it('supports starter selection, battle, armor break, and capture', () => {
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
    const encounterId = state.encounters[0]!.id
    state = applyTraceWildAction(state, { type: 'start-battle', encounterId }, low, 210).state
    state = applyTraceWildAction(state, { type: 'battle-move', move: 'strike' }, low, 220).state
    state = applyTraceWildAction(state, { type: 'battle-move', move: 'strike' }, low, 230).state
    const result = applyTraceWildAction(state, { type: 'capture', quality: 'pebble' }, low, 240)
    expect(result.notice).toBe('capture-success')
    expect(result.state.battle).toBeUndefined()
    expect(result.state.creatures).toHaveLength(2)
    expect(result.state.encounters).toHaveLength(0)
  })
})
