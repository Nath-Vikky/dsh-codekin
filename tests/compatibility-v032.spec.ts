import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { CREATURE_CATALOG } from '../packages/engine/src/catalog.ts'
import {
  applyTraceSignal,
  applyTraceWildAction,
  createInitialTraceWildState,
  restoreTraceWildState,
  settleTraceWildIdleRewards,
} from '../packages/engine/src/engine.ts'
import { findFirstLegalBattleSwap } from '../packages/engine/src/match3.ts'
import { CREATURE_SKILLS } from '../packages/engine/src/skills.ts'
import type { TraceSignal, TraceWildState } from '../packages/engine/src/types.ts'

function seededRandom(seedValue: number): () => number {
  let seed = seedValue >>> 0
  return () => {
    seed = (Math.imul(seed, 1_664_525) + 1_013_904_223) >>> 0
    return seed / 0x1_0000_0000
  }
}

function fingerprint(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex')
}

function worldTranscript(): TraceWildState {
  const random = seededRandom(0x0320_2401)
  const startedAt = 1_700_000_000_000
  let state = applyTraceWildAction(
    createInitialTraceWildState(startedAt),
    { type: 'choose-starter', creatureId: 'forge-sparkmite' },
    random,
    startedAt + 10,
  ).state

  const signals: Omit<TraceSignal, 'at'>[] = [
    { id: 'compat-complete', ecology: 'lumen', outcome: 'completed', intensity: 3, activeMinutes: 18, enhanced: false },
    { id: 'compat-mixed', ecology: 'forge', ecologyCandidates: ['forge', 'relay'], outcome: 'completed', intensity: 5, activeMinutes: 42, enhanced: true },
    { id: 'compat-failed', ecology: 'glitch', outcome: 'failed', intensity: 4, activeMinutes: 27, enhanced: true, variant: 'timeout' },
  ]
  for (const [index, signal] of signals.entries()) {
    state = applyTraceSignal(state, { ...signal, at: startedAt + 100 + index }, random)
  }

  state = settleTraceWildIdleRewards(state, startedAt + 95 * 60_000, random)
  state = applyTraceWildAction(state, { type: 'claim-idle-reward' }, random, startedAt + 95 * 60_000 + 1).state
  return state
}

function battleTranscript(): TraceWildState {
  const random = seededRandom(0x0320_b477)
  const startedAt = 1_700_100_000_000
  let state = applyTraceWildAction(
    createInitialTraceWildState(startedAt),
    { type: 'choose-starter', creatureId: 'aegis-veribud' },
    random,
    startedAt + 1,
  ).state
  state = applyTraceSignal(state, {
    id: 'compat-battle', at: startedAt + 2, ecology: 'glitch', outcome: 'failed',
    intensity: 5, activeMinutes: 31, enhanced: true, variant: 'crash',
  }, random)
  state = applyTraceWildAction(
    state,
    { type: 'start-battle', encounterId: state.encounters[0]!.id },
    random,
    startedAt + 3,
  ).state

  let step = 0
  while (state.battle?.turnOwner === 'player' && step < 8) {
    const swap = findFirstLegalBattleSwap(state.battle.board)
    if (swap === undefined) throw new Error('0.3.2 compatibility board has no legal player swap')
    state = applyTraceWildAction(state, { type: 'battle-swap', ...swap }, random, startedAt + 10 + step).state
    step += 1
  }
  while (state.battle?.turnOwner === 'boss' && step < 16) {
    state = applyTraceWildAction(state, { type: 'battle-continue' }, random, startedAt + 10 + step).state
    step += 1
  }
  return state
}

describe('Codekin 0.3.2 compatibility transcripts', () => {
  it('pins the shipped catalog and skill definitions', () => {
    expect(fingerprint({ catalog: CREATURE_CATALOG, skills: CREATURE_SKILLS })).toBe(
      'dd54c15b082e3a7aba8f6fd1144a194be920f08d58e608074a58dc469db383d4',
    )
  })

  it('pins world, reward, encounter, inventory, and log behavior', () => {
    const state = worldTranscript()
    expect(state).toMatchObject({ schemaVersion: 3, starterChosen: true, revision: 6 })
    expect(fingerprint(state)).toBe('bb3379be14765efc58497c6808c45f4d8f8da8bd07627fb0c1c57ef7c3086904')
    expect(fingerprint(restoreTraceWildState(state, state.updatedAt))).toBe(
      'd492ca6063205a839ac03a489e9c366747dfd8b07f7a2b3434c8624c2f59ac68',
    )
  })

  it('pins one complete player and Boss board phase', () => {
    const state = battleTranscript()
    expect(state.battle).toMatchObject({ turnOwner: 'player', stage: 2, round: 2 })
    expect(fingerprint(state)).toBe('1984fab09720111056d3e4979792a0f4abf4f41fd43ac44562a753ed4b70f7df')
  })
})
