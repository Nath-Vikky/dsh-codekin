import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { totalXpForLevel } from '../packages/engine/src/balance.ts'
import { findFirstLegalBattleSwap } from '../packages/engine/src/match3.ts'
import type {
  CaptureCoreQuality,
  TraceWildState,
} from '../packages/engine/src/types.ts'
import {
  CORE_CODEKIN_RUNTIME,
  CORE_CONTENT_REGISTRY,
} from '../src/core-runtime.ts'
import { createSeededRandom, SEEDED_RANDOM_ALGORITHM } from './random.ts'

export const SIMULATION_FORMAT = 'codekin-simulation-v1' as const
export const DEFAULT_SIMULATION_SEED = 0x3300
export const DEFAULT_SIMULATION_SEEDS = 24

export interface CombatSimulationScenario {
  name: string
  levels: readonly number[]
  qualities: readonly CaptureCoreQuality[]
  wildLevel: number
  wildQuality: CaptureCoreQuality
}

export interface CombatSimulationSample {
  won: boolean
  playerPhases: number
  bossPhases: number
  firstPlayerRatio: number
  firstBossRatio: number
}

export interface CombatSimulationRow {
  name: string
  winRate: number
  playerPhases: number
  bossPhases: number
  firstPlayerRatio: number
  firstBossRatio: number
  maxFirstBossRatio: number
}

export interface CombatSimulationReport {
  format: typeof SIMULATION_FORMAT
  engineVersion: string
  contentPacks: readonly { id: string; version: string }[]
  random: typeof SEEDED_RANDOM_ALGORITHM
  seedBase: number
  seedCount: number
  rows: readonly CombatSimulationRow[]
}

export const COMBAT_SIMULATION_SCENARIOS: readonly CombatSimulationScenario[] = Object.freeze([
  { name: 'solo pebble 1 vs common 1', levels: [1], qualities: ['pebble'], wildLevel: 1, wildQuality: 'pebble' },
  { name: 'mixed 12/15/20 vs common 15', levels: [12, 15, 20], qualities: ['prism', 'pulse', 'nova'], wildLevel: 15, wildQuality: 'pebble' },
  { name: 'prism 15 vs prism 15', levels: [15, 15, 15], qualities: ['prism', 'prism', 'prism'], wildLevel: 15, wildQuality: 'prism' },
  { name: 'prism 30 vs prism 30', levels: [30, 30, 30], qualities: ['prism', 'prism', 'prism'], wildLevel: 30, wildQuality: 'prism' },
  { name: 'prism 15 vs origin 25', levels: [15, 15, 15], qualities: ['prism', 'prism', 'prism'], wildLevel: 25, wildQuality: 'origin' },
  { name: 'pebble 1 vs common 12', levels: [1, 1, 1], qualities: ['pebble', 'pebble', 'pebble'], wildLevel: 12, wildQuality: 'pebble' },
  { name: 'solo pebble 1 vs origin 22', levels: [1], qualities: ['pebble'], wildLevel: 22, wildQuality: 'origin' },
])

function startScenario(scenario: CombatSimulationScenario, random: () => number): TraceWildState {
  if (scenario.levels.length === 0 || scenario.levels.length > 3
    || scenario.levels.length !== scenario.qualities.length) {
    throw new RangeError('simulation scenarios require one to three matching levels and qualities')
  }
  const ids = ['lumen-indeximp', 'forge-sparkmite', 'aegis-veribud'] as const
  const state = CORE_CODEKIN_RUNTIME.createInitialTraceWildState(1_000)
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
  return CORE_CODEKIN_RUNTIME.applyTraceWildAction(
    state,
    { type: 'start-battle', encounterId: state.encounters[0]!.id },
    random,
    2_000,
  ).state
}

export function simulateCombatScenario(
  scenario: CombatSimulationScenario,
  seed: number,
): CombatSimulationSample {
  const random = createSeededRandom(seed)
  let state = startScenario(scenario, random.next)
  let playerPhases = 0
  let bossPhases = 0
  let firstPlayerRatio = 0
  let firstBossRatio = 0
  for (let action = 0; action < 180 && state.battle !== undefined; action += 1) {
    const before = state.battle
    const response = before.captureWindow || before.turnOwner === 'boss'
      ? CORE_CODEKIN_RUNTIME.applyTraceWildAction(state, { type: 'battle-continue' }, random.next, 2_001 + action)
      : CORE_CODEKIN_RUNTIME.applyTraceWildAction(state, {
          type: 'battle-swap', ...findFirstLegalBattleSwap(before.board)!,
        }, random.next, 2_001 + action)
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

export function runCombatSimulation(
  seedCount = DEFAULT_SIMULATION_SEEDS,
  seedBase = DEFAULT_SIMULATION_SEED,
  scenarios: readonly CombatSimulationScenario[] = COMBAT_SIMULATION_SCENARIOS,
): CombatSimulationReport {
  if (!Number.isSafeInteger(seedCount) || seedCount < 1 || seedCount > 10_000) {
    throw new RangeError('seed count must be an integer from 1 to 10000')
  }
  if (!Number.isSafeInteger(seedBase) || seedBase < 0 || seedBase > 0xffff_ffff) {
    throw new RangeError('seed base must be an unsigned 32-bit integer')
  }
  const rows = scenarios.map((scenario, scenarioIndex) => {
    const samples = Array.from({ length: seedCount }, (_, seed) => (
      simulateCombatScenario(scenario, (seedBase + scenarioIndex * 100 + seed) >>> 0)
    ))
    const average = (pick: (sample: CombatSimulationSample) => number): number => (
      samples.reduce((sum, sample) => sum + pick(sample), 0) / samples.length
    )
    return Object.freeze({
      name: scenario.name,
      winRate: samples.filter(sample => sample.won).length / samples.length,
      playerPhases: average(sample => sample.playerPhases),
      bossPhases: average(sample => sample.bossPhases),
      firstPlayerRatio: average(sample => sample.firstPlayerRatio),
      firstBossRatio: average(sample => sample.firstBossRatio),
      maxFirstBossRatio: Math.max(...samples.map(sample => sample.firstBossRatio)),
    })
  })
  return Object.freeze({
    format: SIMULATION_FORMAT,
    engineVersion: CORE_CODEKIN_RUNTIME.engineVersion,
    contentPacks: Object.freeze(CORE_CONTENT_REGISTRY.packs.map(pack => Object.freeze({
      id: pack.manifest.id,
      version: pack.manifest.version,
    }))),
    random: SEEDED_RANDOM_ALGORITHM,
    seedBase,
    seedCount,
    rows: Object.freeze(rows),
  })
}

export function combatSimulationGateIssues(report: CombatSimulationReport): readonly string[] {
  if (report.rows.length !== COMBAT_SIMULATION_SCENARIOS.length) return Object.freeze(['default seven-scenario matrix is required'])
  if (report.seedCount < DEFAULT_SIMULATION_SEEDS) return Object.freeze([`at least ${DEFAULT_SIMULATION_SEEDS} seeds are required for balance gates`])
  const rows = report.rows
  const issues: string[] = []
  const require = (condition: boolean, message: string): void => {
    if (!condition) issues.push(message)
  }
  require(rows[0]!.winRate >= 0.5, 'solo equal-level win rate is below 50%')
  require(rows[1]!.winRate >= 0.7, 'ordinary mixed-party win rate is below 70%')
  require(rows[1]!.playerPhases >= 2.5 && rows[1]!.playerPhases <= 5, 'ordinary fight player phases left the 2.5–5 range')
  require(rows[1]!.firstBossRatio > 0.15 && rows[1]!.firstBossRatio < 0.4, 'ordinary first boss strike left the 15%–40% range')
  require(rows[1]!.maxFirstBossRatio < 0.5, 'ordinary maximum first boss strike reached 50%')
  require(rows[1]!.firstPlayerRatio > 0.2 && rows[1]!.firstPlayerRatio < 0.5, 'ordinary first player strike left the 20%–50% range')
  require(rows[2]!.playerPhases >= 3 && rows[2]!.playerPhases <= 5, 'equal prism fight left the 3–5 phase range')
  require(rows[4]!.winRate <= 0.25, 'over-level Origin target win rate exceeded 25%')
  require(rows[5]!.winRate > 0 && rows[5]!.winRate <= 0.45, 'under-level pebble win rate left the 0%–45% range')
  require(rows[6]!.winRate <= 0.1, 'solo Origin target win rate exceeded 10%')
  return Object.freeze(issues)
}

export async function simulationCli(argv: readonly string[]): Promise<number> {
  let seedCount = DEFAULT_SIMULATION_SEEDS
  let seedBase = DEFAULT_SIMULATION_SEED
  let check = false
  let json = false
  let quiet = false
  let output: string | undefined
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]!
    const value = (): string => {
      const next = argv[++index]
      if (next === undefined) throw new TypeError(`${argument} requires a value`)
      return next
    }
    if (argument === '--seeds') seedCount = Number(value())
    else if (argument === '--seed') seedBase = Number(value())
    else if (argument === '--output') output = value()
    else if (argument === '--check') check = true
    else if (argument === '--json') json = true
    else if (argument === '--quiet') quiet = true
    else if (argument === '--help' || argument === '-h') {
      console.log('Usage: node tools/simulation.ts [--seeds 24] [--seed 13056] [--check] [--json] [--quiet] [--output report.json]')
      return 0
    } else throw new TypeError(`unknown option ${argument}`)
  }
  const report = runCombatSimulation(seedCount, seedBase)
  const issues = check ? combatSimulationGateIssues(report) : []
  if (output !== undefined) await writeFile(resolve(output), `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  if (!quiet) {
    if (json) console.log(JSON.stringify(report, null, 2))
    else console.table(report.rows)
  }
  for (const issue of issues) console.error(`Simulation gate: ${issue}`)
  return issues.length === 0 ? 0 : 1
}

const isMain = process.argv[1] !== undefined && pathToFileURL(resolve(process.argv[1])).href === import.meta.url
if (isMain) {
  simulationCli(process.argv.slice(2)).then(code => {
    process.exitCode = code
  }).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
