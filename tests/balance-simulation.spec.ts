import { describe, expect, it } from 'vitest'
import { totalXpForLevel } from '../packages/engine/src/balance.ts'
import { applyTraceWildAction, createInitialTraceWildState } from '../src/core-runtime.ts'
import { findFirstLegalBattleSwap } from '../packages/engine/src/match3.ts'
import type { CaptureCoreQuality, TraceWildState } from '../packages/engine/src/types.ts'

function seededRandom(seedValue: number): () => number {
  let seed = seedValue >>> 0
  return () => {
    seed = (Math.imul(seed, 1_664_525) + 1_013_904_223) >>> 0
    return seed / 0x1_0000_0000
  }
}

interface Scenario {
  name: string
  levels: readonly number[]
  qualities: readonly CaptureCoreQuality[]
  wildLevel: number
  wildQuality: CaptureCoreQuality
}

function startScenario(scenario: Scenario, random: () => number): TraceWildState {
  const ids = ['lumen-indeximp', 'forge-sparkmite', 'aegis-veribud'] as const
  const state = createInitialTraceWildState(1_000)
  state.starterChosen = true
  state.creatures = scenario.levels.map((level, index) => ({
    instanceId: `pet_balance_${index}_00000000`,
    creatureId: ids[index]!,
    quality: scenario.qualities[index]!,
    level,
    xp: totalXpForLevel(level, scenario.qualities[index]!),
    wins: 0,
    caughtAt: 1_000,
    firstSignal: index === 0 ? 'lumen' : index === 1 ? 'forge' : 'aegis',
  }))
  state.squad = state.creatures.map(creature => creature.instanceId)
  state.encounters = [{
    id: 'wild_balance_00000000', creatureId: 'relay-forktail', ecology: 'relay',
    quality: scenario.wildQuality, level: scenario.wildLevel, captureAttempts: 0,
    spawnedAt: 1_000, expiresAt: 99_999_999, enhanced: false, armor: 0, mapX: 50, mapY: 50,
  }]
  return applyTraceWildAction(state, { type: 'start-battle', encounterId: state.encounters[0]!.id }, random, 2_000).state
}

function simulate(scenario: Scenario, seed: number): {
  won: boolean
  playerPhases: number
  bossPhases: number
  firstPlayerRatio: number
  firstBossRatio: number
} {
  const random = seededRandom(seed)
  let state = startScenario(scenario, random)
  let playerPhases = 0
  let bossPhases = 0
  let firstPlayerRatio = 0
  let firstBossRatio = 0
  for (let action = 0; action < 180 && state.battle !== undefined; action += 1) {
    const before = state.battle
    const response = before.captureWindow
      ? applyTraceWildAction(state, { type: 'battle-continue' }, random, 2_001 + action)
      : before.turnOwner === 'boss'
        ? applyTraceWildAction(state, { type: 'battle-continue' }, random, 2_001 + action)
        : applyTraceWildAction(state, {
            type: 'battle-swap', ...findFirstLegalBattleSwap(before.board)!,
          }, random, 2_001 + action)
    if (response.animation?.strike?.actor === 'player') {
      playerPhases += 1
      if (firstPlayerRatio === 0) firstPlayerRatio = response.animation.strike.damage / response.animation.strike.targetMaxHp
    }
    if (response.animation?.strike?.actor === 'boss') {
      bossPhases += 1
      if (firstBossRatio === 0) firstBossRatio = response.animation.strike.damage / response.animation.strike.targetMaxHp
    }
    state = response.state
    if (response.notice === 'wild-defeated') return { won: true, playerPhases, bossPhases, firstPlayerRatio, firstBossRatio }
    if (response.notice === 'battle-lost') return { won: false, playerPhases, bossPhases, firstPlayerRatio, firstBossRatio }
  }
  return { won: false, playerPhases, bossPhases, firstPlayerRatio, firstBossRatio }
}

const SCENARIOS: readonly Scenario[] = [
  { name: 'solo pebble 1 vs common 1', levels: [1], qualities: ['pebble'], wildLevel: 1, wildQuality: 'pebble' },
  { name: 'mixed 12/15/20 vs common 15', levels: [12, 15, 20], qualities: ['prism', 'pulse', 'nova'], wildLevel: 15, wildQuality: 'pebble' },
  { name: 'prism 15 vs prism 15', levels: [15, 15, 15], qualities: ['prism', 'prism', 'prism'], wildLevel: 15, wildQuality: 'prism' },
  { name: 'prism 30 vs prism 30', levels: [30, 30, 30], qualities: ['prism', 'prism', 'prism'], wildLevel: 30, wildQuality: 'prism' },
  { name: 'prism 15 vs origin 25', levels: [15, 15, 15], qualities: ['prism', 'prism', 'prism'], wildLevel: 25, wildQuality: 'origin' },
  { name: 'pebble 1 vs common 12', levels: [1, 1, 1], qualities: ['pebble', 'pebble', 'pebble'], wildLevel: 12, wildQuality: 'pebble' },
  { name: 'solo pebble 1 vs origin 22', levels: [1], qualities: ['pebble'], wildLevel: 22, wildQuality: 'origin' },
]

describe('combat pacing matrix', () => {
  it('keeps ordinary fights multi-round and over-level elites dangerous', () => {
    const rows = SCENARIOS.map((scenario, scenarioIndex) => {
      const samples = Array.from({ length: 24 }, (_, seed) => simulate(scenario, 0x3300 + scenarioIndex * 100 + seed))
      const wins = samples.filter(sample => sample.won).length
      const average = (pick: (sample: typeof samples[number]) => number): number => (
        samples.reduce((sum, sample) => sum + pick(sample), 0) / samples.length
      )
      return {
        name: scenario.name,
        winRate: wins / samples.length,
        playerPhases: average(sample => sample.playerPhases),
        bossPhases: average(sample => sample.bossPhases),
        firstPlayerRatio: average(sample => sample.firstPlayerRatio),
        firstBossRatio: average(sample => sample.firstBossRatio),
        maxFirstBossRatio: Math.max(...samples.map(sample => sample.firstBossRatio)),
      }
    })
    console.table(rows)
    expect(rows[0]!.winRate).toBeGreaterThanOrEqual(0.5)
    expect(rows[1]!.winRate).toBeGreaterThanOrEqual(0.7)
    expect(rows[1]!.playerPhases).toBeGreaterThanOrEqual(2.5)
    expect(rows[1]!.playerPhases).toBeLessThanOrEqual(5)
    expect(rows[1]!.firstBossRatio).toBeGreaterThan(0.15)
    expect(rows[1]!.firstBossRatio).toBeLessThan(0.4)
    expect(rows[1]!.maxFirstBossRatio).toBeLessThan(0.5)
    expect(rows[1]!.firstPlayerRatio).toBeGreaterThan(0.2)
    expect(rows[1]!.firstPlayerRatio).toBeLessThan(0.5)
    expect(rows[2]!.playerPhases).toBeGreaterThanOrEqual(3)
    expect(rows[2]!.playerPhases).toBeLessThanOrEqual(5)
    expect(rows[4]!.winRate).toBeLessThanOrEqual(0.25)
    expect(rows[5]!.winRate).toBeGreaterThan(0)
    expect(rows[5]!.winRate).toBeLessThanOrEqual(0.45)
    expect(rows[6]!.winRate).toBeLessThanOrEqual(0.1)
  })
})
