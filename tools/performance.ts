import { readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { performance } from 'node:perf_hooks'
import { pathToFileURL } from 'node:url'
import { gzipSync } from 'node:zlib'
import { CORE_CONTENT_PACK } from '../content-packs/core/src/index.ts'
import { createContentRegistry } from '../packages/content-sdk/src/index.ts'
import { findFirstLegalBattleSwap } from '../packages/engine/src/match3.ts'
import type { TraceWildState } from '../packages/engine/src/types.ts'
import { CORE_CODEKIN_RUNTIME } from '../src/core-runtime.ts'
import { lintContentPacks } from './content-pack-lint.ts'
import { createSeededRandom } from './random.ts'
import {
  COMBAT_SIMULATION_SCENARIOS,
  createCombatSimulationBattle,
  runCombatSimulation,
} from './simulation.ts'

export const PERFORMANCE_FORMAT = 'codekin-performance-v1' as const
export const PERFORMANCE_BUDGET_FORMAT = 'codekin-performance-budget-v1' as const

interface PerformanceBudget {
  format: typeof PERFORMANCE_BUDGET_FORMAT
  minimumIterations: number
  actionP95Ms: number
  restoreLargeRosterP95Ms: number
  contentRegistryP95Ms: number
  simulationMatrixMs: number
  clientBundleBytes: number
  clientBundleGzipBytes: number
  shippedJavaScriptBytes: number
  coreAssetBytes: number
  largeRosterJsonBytes: number
}

interface TimingSummary {
  medianMs: number
  p95Ms: number
  maximumMs: number
}

export interface PerformanceReport {
  format: typeof PERFORMANCE_FORMAT
  engineVersion: string
  node: string
  platform: NodeJS.Platform
  iterations: number
  timings: {
    action: TimingSummary
    restoreLargeRoster: TimingSummary
    contentRegistry: TimingSummary
    simulationMatrixMs: number
  }
  sizes: {
    clientBundleBytes: number
    clientBundleGzipBytes: number
    shippedJavaScriptBytes: number
    coreAssetBytes: number
    largeRosterJsonBytes: number
  }
}

function percentile(sorted: readonly number[], ratio: number): number {
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * ratio) - 1)] ?? 0
}

function summarize(samples: number[]): TimingSummary {
  samples.sort((left, right) => left - right)
  return {
    medianMs: percentile(samples, 0.5),
    p95Ms: percentile(samples, 0.95),
    maximumMs: samples.at(-1) ?? 0,
  }
}

function benchmark(iterations: number, prepare: (index: number) => () => void): TimingSummary {
  const warmups = Math.min(20, Math.max(5, Math.floor(iterations / 10)))
  for (let index = 0; index < warmups; index += 1) prepare(index)()
  const samples: number[] = []
  for (let index = 0; index < iterations; index += 1) {
    const operation = prepare(index + warmups)
    const started = performance.now()
    operation()
    samples.push(performance.now() - started)
  }
  return summarize(samples)
}

function largeRosterState(size = 750): TraceWildState {
  const state = CORE_CODEKIN_RUNTIME.createInitialTraceWildState(1_000)
  state.starterChosen = true
  const catalog = CORE_CODEKIN_RUNTIME.content.creatures
  const qualities = ['pebble', 'pulse', 'prism', 'nova', 'origin'] as const
  state.creatures = Array.from({ length: size }, (_, index) => {
    const creature = catalog[index % catalog.length]!
    return {
      instanceId: `pet_perf_${String(index).padStart(8, '0')}`,
      creatureId: creature.id,
      quality: qualities[index % qualities.length]!,
      level: index % 100 + 1,
      xp: index * 100,
      wins: index % 500,
      caughtAt: 1_000 + index,
      firstSignal: creature.ecology,
    }
  })
  state.squad = state.creatures.slice(0, 3).map(creature => creature.instanceId)
  return state
}

async function shippedJavaScriptBytes(directory: string): Promise<number> {
  const entries = await readdir(directory, { withFileTypes: true })
  const sizes = await Promise.all(entries.filter(entry => entry.isFile() && entry.name.endsWith('.js'))
    .map(entry => stat(resolve(directory, entry.name)).then(value => value.size)))
  return sizes.reduce((sum, size) => sum + size, 0)
}

export async function measurePerformance(iterations = 120): Promise<PerformanceReport> {
  if (!Number.isSafeInteger(iterations) || iterations < 10 || iterations > 10_000) {
    throw new RangeError('iterations must be an integer from 10 to 10000')
  }
  const scenario = COMBAT_SIMULATION_SCENARIOS[1]!
  const baseRandom = createSeededRandom(0x3600_0001)
  const baseBattle = createCombatSimulationBattle(scenario, baseRandom.next)
  const swap = findFirstLegalBattleSwap(baseBattle.battle!.board)
  if (swap === undefined) throw new Error('performance fixture has no legal battle swap')
  const action = benchmark(iterations, (index) => {
    const state = structuredClone(baseBattle)
    const random = createSeededRandom((0x3601_0000 + index) >>> 0)
    return () => {
      CORE_CODEKIN_RUNTIME.applyTraceWildAction(state, { type: 'battle-swap', ...swap }, random.next, 2_100 + index)
    }
  })

  const roster = largeRosterState()
  const restoreLargeRoster = benchmark(iterations, index => () => {
    CORE_CODEKIN_RUNTIME.restoreTraceWildState(roster, 5_000 + index)
  })
  const contentRegistry = benchmark(iterations, () => () => {
    createContentRegistry([CORE_CONTENT_PACK], { engineVersion: CORE_CODEKIN_RUNTIME.engineVersion })
  })
  const simulationStarted = performance.now()
  runCombatSimulation()
  const simulationMatrixMs = performance.now() - simulationStarted

  const clientPath = resolve('lib/client.js')
  const client = await readFile(clientPath).catch(() => {
    throw new Error('lib/client.js is missing; run pnpm build before the performance gate')
  })
  const contentReport = await lintContentPacks([{
    pack: CORE_CONTENT_PACK,
    source: 'core-performance',
    assetRoot: resolve('assets/creatures'),
  }])
  if (!contentReport.ok) throw new Error('core content failed lint during performance measurement')

  return Object.freeze({
    format: PERFORMANCE_FORMAT,
    engineVersion: CORE_CODEKIN_RUNTIME.engineVersion,
    node: process.version,
    platform: process.platform,
    iterations,
    timings: Object.freeze({ action, restoreLargeRoster, contentRegistry, simulationMatrixMs }),
    sizes: Object.freeze({
      clientBundleBytes: client.byteLength,
      clientBundleGzipBytes: gzipSync(client).byteLength,
      shippedJavaScriptBytes: await shippedJavaScriptBytes(resolve('lib')),
      coreAssetBytes: contentReport.packs.reduce((sum, pack) => sum + pack.assetBytes, 0),
      largeRosterJsonBytes: Buffer.byteLength(JSON.stringify(roster), 'utf8'),
    }),
  })
}

function validPositive(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}

async function readBudget(filename: string): Promise<PerformanceBudget> {
  const value: unknown = JSON.parse(await readFile(filename, 'utf8'))
  const row = typeof value === 'object' && value !== null ? value as Record<string, unknown> : undefined
  const keys = [
    'minimumIterations', 'actionP95Ms', 'restoreLargeRosterP95Ms', 'contentRegistryP95Ms',
    'simulationMatrixMs', 'clientBundleBytes', 'clientBundleGzipBytes',
    'shippedJavaScriptBytes', 'coreAssetBytes', 'largeRosterJsonBytes',
  ] as const
  if (row?.format !== PERFORMANCE_BUDGET_FORMAT || keys.some(key => !validPositive(row[key]))) {
    throw new TypeError(`invalid performance budget ${filename}`)
  }
  return row as unknown as PerformanceBudget
}

export function performanceGateIssues(
  report: PerformanceReport,
  budget: PerformanceBudget,
): readonly string[] {
  const issues: string[] = []
  const maximum = (value: number, limit: number, label: string): void => {
    if (value > limit) issues.push(`${label} ${value.toFixed(3)} exceeds ${limit}`)
  }
  if (report.iterations < budget.minimumIterations) issues.push(`iterations ${report.iterations} is below ${budget.minimumIterations}`)
  maximum(report.timings.action.p95Ms, budget.actionP95Ms, 'action p95 ms')
  maximum(report.timings.restoreLargeRoster.p95Ms, budget.restoreLargeRosterP95Ms, 'large-roster restore p95 ms')
  maximum(report.timings.contentRegistry.p95Ms, budget.contentRegistryP95Ms, 'content registry p95 ms')
  maximum(report.timings.simulationMatrixMs, budget.simulationMatrixMs, 'simulation matrix ms')
  maximum(report.sizes.clientBundleBytes, budget.clientBundleBytes, 'client bundle bytes')
  maximum(report.sizes.clientBundleGzipBytes, budget.clientBundleGzipBytes, 'client bundle gzip bytes')
  maximum(report.sizes.shippedJavaScriptBytes, budget.shippedJavaScriptBytes, 'shipped JavaScript bytes')
  maximum(report.sizes.coreAssetBytes, budget.coreAssetBytes, 'core asset bytes')
  maximum(report.sizes.largeRosterJsonBytes, budget.largeRosterJsonBytes, 'large roster JSON bytes')
  return Object.freeze(issues)
}

export async function performanceCli(argv: readonly string[]): Promise<number> {
  let iterations = 120
  let budgetPath = resolve('tools/performance-budget.json')
  let output: string | undefined
  let check = false
  let json = false
  let quiet = false
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]!
    const value = (): string => {
      const next = argv[++index]
      if (next === undefined) throw new TypeError(`${argument} requires a value`)
      return next
    }
    if (argument === '--iterations') iterations = Number(value())
    else if (argument === '--budget') budgetPath = resolve(value())
    else if (argument === '--output') output = resolve(value())
    else if (argument === '--check') check = true
    else if (argument === '--json') json = true
    else if (argument === '--quiet') quiet = true
    else if (argument === '--help' || argument === '-h') {
      console.log('Usage: node tools/performance.ts [--iterations 120] [--check] [--json] [--quiet] [--budget path] [--output report.json]')
      return 0
    } else throw new TypeError(`unknown option ${argument}`)
  }
  const report = await measurePerformance(iterations)
  const budget = await readBudget(budgetPath)
  const issues = check ? performanceGateIssues(report, budget) : []
  if (output !== undefined) await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  if (!quiet) {
    if (json) console.log(JSON.stringify(report, null, 2))
    else {
      console.table({
        action: report.timings.action,
        restoreLargeRoster: report.timings.restoreLargeRoster,
        contentRegistry: report.timings.contentRegistry,
        simulation: { medianMs: report.timings.simulationMatrixMs },
      })
      console.table(report.sizes)
    }
  }
  for (const issue of issues) console.error(`Performance gate: ${issue}`)
  return issues.length === 0 ? 0 : 1
}

const isMain = process.argv[1] !== undefined && pathToFileURL(resolve(process.argv[1])).href === import.meta.url
if (isMain) {
  performanceCli(process.argv.slice(2)).then(code => {
    process.exitCode = code
  }).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
