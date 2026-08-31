import type {
  BattleLogEntry,
  BattleState,
  CaptureCoreQuality,
  RandomSource,
  TraceLogEntry,
  TraceWildState,
} from './types.ts'

export const MAX_CREATURES = 240
export const MAX_PROCESSED_SIGNALS = 256
export const MAX_LOG_ENTRIES = 40
export const MAX_BATTLE_LOG_ENTRIES = 14
export const ENERGY_LIMIT = 12
export const MAX_IDLE_ELAPSED_MS = 12 * 60 * 60 * 1000
export const MAX_AMPLIFIERS_PER_SIDE = 8

export function emptyQualityCounts(): Record<CaptureCoreQuality, number> {
  return { pebble: 0, pulse: 0, prism: 0, nova: 0, origin: 0 }
}

export function createInitialTraceWildState(now = Date.now()): TraceWildState {
  return {
    schemaVersion: 3,
    revision: 0,
    createdAt: now,
    updatedAt: now,
    enabled: true,
    starterChosen: false,
    cores: emptyQualityCounts(),
    materials: emptyQualityCounts(),
    creatures: [],
    squad: [],
    dex: [],
    encounters: [],
    stats: {
      completedTurns: 0,
      failedTurns: 0,
      successfulCaptures: 0,
      failedCaptures: 0,
      battlesStarted: 0,
      wildDefeats: 0,
      materialsEarned: 0,
      currentSuccessStreak: 0,
      longestSuccessStreak: 0,
    },
    rewardPity: { wildHighQualityMisses: 0, coreHighQualityMisses: 0 },
    idle: { lastSettlementAt: now },
    tower: { highestClearedFloor: 0, attempts: 0, clears: 0 },
    processedSignals: [],
    log: [],
  }
}

export function boundedRandom(random: RandomSource): number {
  const value = random()
  if (!Number.isFinite(value)) return 0
  return Math.min(0.999999999, Math.max(0, value))
}

export function randomId(prefix: string, now: number, random: RandomSource): string {
  const first = Math.floor(boundedRandom(random) * 0x1_0000_0000).toString(36).padStart(7, '0')
  const second = Math.floor(boundedRandom(random) * 0x1_0000_0000).toString(36).padStart(7, '0')
  return `${prefix}_${now.toString(36)}_${first}${second}`
}

export function chooseWeighted<T extends string>(
  weights: Readonly<Record<T, number>>,
  random: RandomSource,
): T {
  const entries = Object.entries(weights) as [T, number][]
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0)
  let cursor = boundedRandom(random) * total
  for (const [key, weight] of entries) {
    cursor -= weight
    if (cursor < 0) return key
  }
  return entries[entries.length - 1]![0]
}

export function logEntry(
  state: TraceWildState,
  entry: Omit<TraceLogEntry, 'id'>,
  random: RandomSource,
): void {
  state.log.unshift({ ...entry, id: randomId('log', entry.at, random) })
  state.log = state.log.slice(0, MAX_LOG_ENTRIES)
}

export function appendBattleLog(battle: BattleState, row: BattleLogEntry): void {
  battle.log.push(row)
  battle.log = battle.log.slice(-MAX_BATTLE_LOG_ENTRIES)
}

export function commit(state: TraceWildState, now: number): TraceWildState {
  state.revision += 1
  state.updatedAt = now
  return state
}

export function updateDex(state: TraceWildState, creatureId: string, at: number, captured: boolean): void {
  const existing = state.dex.find(row => row.creatureId === creatureId)
  if (existing === undefined) {
    state.dex.push({
      creatureId,
      seen: 1,
      captured: captured ? 1 : 0,
      firstSeenAt: at,
      lastSeenAt: at,
    })
    return
  }
  existing.seen += 1
  existing.captured += captured ? 1 : 0
  existing.lastSeenAt = at
}

export function purgeExpiredEncounters(state: TraceWildState, now: number): void {
  const activeEncounter = state.battle?.mode === 'tower' ? undefined : state.battle?.encounterId
  state.encounters = state.encounters.filter(encounter => (
    encounter.id === activeEncounter || now < encounter.expiresAt
  ))
  if (activeEncounter !== undefined && !state.encounters.some(row => row.id === activeEncounter)) delete state.battle
}
