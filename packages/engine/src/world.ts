import { TRACE_ECOLOGIES } from '../../content-sdk/src/types.ts'
import {
  MAX_MAP_ENCOUNTERS,
  coreQualityWeights,
  encounterLifetimeMs,
  idleRewardTier,
  qualityIndex,
  wildLevelForRoster,
  wildQualityWeights,
} from './balance.ts'
import { currentEngineContent } from './content.ts'
import {
  MAX_IDLE_ELAPSED_MS,
  MAX_PROCESSED_SIGNALS,
  boundedRandom,
  chooseWeighted,
  commit,
  emptyQualityCounts,
  logEntry,
  purgeExpiredEncounters,
  randomId,
  updateDex,
} from './state.ts'
import type {
  CaptureCoreQuality,
  RandomSource,
  TraceEcology,
  TraceSignal,
  TraceWildState,
  WildEncounter,
} from './types.ts'

function isHighQuality(quality: CaptureCoreQuality): boolean {
  return qualityIndex(quality) >= qualityIndex('prism')
}

function chooseWildQuality(
  state: TraceWildState,
  activeMinutes: number,
  random: RandomSource,
): CaptureCoreQuality {
  const eligibleForPity = activeMinutes >= 15
  const forced = eligibleForPity && state.rewardPity.wildHighQualityMisses >= 12
  const quality = forced ? 'prism' : chooseWeighted(wildQualityWeights(activeMinutes), random)
  if (eligibleForPity) {
    state.rewardPity.wildHighQualityMisses = isHighQuality(quality)
      ? 0
      : Math.min(12, state.rewardPity.wildHighQualityMisses + 1)
  }
  return quality
}

function chooseCoreQuality(
  state: TraceWildState,
  activeMinutes: number,
  random: RandomSource,
): CaptureCoreQuality {
  const forced = state.rewardPity.coreHighQualityMisses >= 20
  const quality = forced ? 'prism' : chooseWeighted(coreQualityWeights(activeMinutes), random)
  state.rewardPity.coreHighQualityMisses = isHighQuality(quality)
    ? 0
    : Math.min(20, state.rewardPity.coreHighQualityMisses + 1)
  return quality
}

export function settleTraceWildIdleRewards(
  current: TraceWildState,
  now: number,
  random: RandomSource,
): TraceWildState {
  if (!current.enabled) return current
  if (!Number.isSafeInteger(now) || now < 0) return current
  const last = current.idle.lastSettlementAt
  if (!Number.isSafeInteger(last) || last < 0) {
    const next = structuredClone(current)
    next.idle = { lastSettlementAt: now }
    return commit(next, now)
  }
  if (current.idle.pendingReward !== undefined) return current
  // A wall-clock rollback must not move the reward watermark backwards and enable duplicate idle claims.
  if (now < last) return current
  const elapsedMs = Math.min(MAX_IDLE_ELAPSED_MS, now - last)
  const tier = idleRewardTier(elapsedMs / 60_000)
  if (tier.coreCount === 0 || tier.weights === undefined) return current
  const next = structuredClone(current)
  const materials = emptyQualityCounts()
  for (let index = 0; index < tier.materialCount; index += 1) {
    const quality = chooseWeighted(tier.weights, random)
    materials[quality] += 1
  }
  const coreQuality = chooseWeighted(tier.weights, random)
  next.idle = {
    ...next.idle,
    lastSettlementAt: now,
    pendingReward: {
      settledAt: now,
      elapsedMinutes: Math.floor(elapsedMs / 60_000),
      coreQuality,
      materials,
    },
  }
  return commit(next, now)
}

function mapPoint(ecology: TraceEcology, random: RandomSource): { mapX: number; mapY: number } {
  const centers: Record<TraceEcology, readonly [number, number]> = {
    lumen: [19, 27], forge: [80, 27], relay: [50, 16], aegis: [25, 76], glitch: [76, 76],
  }
  const [centerX, centerY] = centers[ecology]
  return {
    mapX: Math.round(Math.min(92, Math.max(8, centerX + (boundedRandom(random) - 0.5) * 19))),
    mapY: Math.round(Math.min(90, Math.max(10, centerY + (boundedRandom(random) - 0.5) * 17))),
  }
}

function pickCreature(signal: TraceSignal, ecology: TraceEcology, random: RandomSource): string {
  const content = currentEngineContent()
  if (ecology === 'glitch' && signal.variant !== undefined && boundedRandom(random) < 0.78) {
    const variantCreatureId = content.encounterVariantCreatureId(signal.variant)
    if (variantCreatureId !== undefined) return variantCreatureId
  }
  const intensity = Math.min(5, Math.max(0, signal.intensity))
  const candidates = content.creaturesInEcology(ecology)
  const weights = candidates.map((creature) => {
    switch (creature.rarity) {
      case 'common': return 38
      case 'uncommon': return 18 + intensity * 2.5
      case 'rare': return 7 + intensity * 1.8
      case 'apex': return 1 + intensity * 0.7
    }
  })
  let cursor = boundedRandom(random) * weights.reduce((sum, weight) => sum + weight, 0)
  for (let index = 0; index < candidates.length; index += 1) {
    cursor -= weights[index]!
    if (cursor < 0) return candidates[index]!.id
  }
  return candidates[0]!.id
}

const REGION_DIVERSITY_THRESHOLD = 5

function chooseEncounterEcology(
  encounters: readonly WildEncounter[],
  signal: TraceSignal,
  random: RandomSource,
): TraceEcology {
  const counts = Object.fromEntries(TRACE_ECOLOGIES.map(ecology => [ecology, 0])) as Record<TraceEcology, number>
  for (const encounter of encounters) counts[encounter.ecology] += 1

  const candidates = Array.from(new Set(
    (signal.ecologyCandidates ?? [signal.ecology]).filter(ecology => TRACE_ECOLOGIES.includes(ecology)),
  ))
  if (candidates.length === 0) candidates.push(signal.ecology)

  let pool: TraceEcology[]
  if (candidates.length > 1) {
    // A mixed turn still creates one encounter, weighted toward the scarcer observed ecology.
    pool = candidates
  } else if (counts[candidates[0]!] > REGION_DIVERSITY_THRESHOLD) {
    // A single repeatedly observed ecology may reach six residents, then new activity diversifies the map.
    pool = TRACE_ECOLOGIES.filter(ecology => ecology !== candidates[0])
  } else {
    return candidates[0]!
  }

  const leastResidents = Math.min(...pool.map(ecology => counts[ecology]))
  const tied = pool.filter(ecology => counts[ecology] === leastResidents)
  return tied[Math.floor(boundedRandom(random) * tied.length)] ?? tied[0]!
}

/** Removes elapsed map encounters without disturbing an encounter in an active wild battle. */
export function expireTraceWildEncounters(current: TraceWildState, now: number): TraceWildState {
  if (!Number.isSafeInteger(now) || now < 0) return current
  const activeEncounter = current.battle?.mode === 'tower' ? undefined : current.battle?.encounterId
  const hasExpired = current.encounters.some(encounter => encounter.id !== activeEncounter && now >= encounter.expiresAt)
  if (!hasExpired) return current
  const next = structuredClone(current)
  purgeExpiredEncounters(next, now)
  return commit(next, now)
}

export function applyTraceSignal(
  current: TraceWildState,
  signal: TraceSignal,
  random: RandomSource,
): TraceWildState {
  if (!current.enabled) return current
  const settled = settleTraceWildIdleRewards(current, signal.at, random)
  if (settled.processedSignals.includes(signal.id)) return settled
  const next = structuredClone(settled)
  purgeExpiredEncounters(next, signal.at)
  next.processedSignals.push(signal.id)
  next.processedSignals = next.processedSignals.slice(-MAX_PROCESSED_SIGNALS)
  if (signal.outcome === 'completed') {
    next.stats.completedTurns += 1
    next.stats.currentSuccessStreak += 1
    next.stats.longestSuccessStreak = Math.max(next.stats.longestSuccessStreak, next.stats.currentSuccessStreak)
    const quality = chooseCoreQuality(next, signal.activeMinutes, random)
    next.cores[quality] += 1
    logEntry(next, { at: signal.at, kind: 'core-drop', quality, ecology: signal.ecology }, random)
  } else {
    next.stats.failedTurns += 1
    next.stats.currentSuccessStreak = 0
  }
  if (next.encounters.length < MAX_MAP_ENCOUNTERS) {
    const encounterEcology = chooseEncounterEcology(next.encounters, signal, random)
    const creatureId = pickCreature(signal, encounterEcology, random)
    const quality = chooseWildQuality(next, signal.activeMinutes, random)
    const level = wildLevelForRoster(next.creatures, signal.activeMinutes, quality, boundedRandom(random))
    const point = mapPoint(encounterEcology, random)
    next.encounters.push({
      id: randomId('wild', signal.at, random),
      creatureId,
      ecology: encounterEcology,
      quality,
      level,
      captureAttempts: 0,
      spawnedAt: signal.at,
      expiresAt: signal.at + encounterLifetimeMs(quality, level),
      enhanced: signal.enhanced,
      armor: signal.enhanced ? 2 : 0,
      ...point,
    })
    updateDex(next, creatureId, signal.at, false)
    logEntry(next, { at: signal.at, kind: 'encounter', creatureId, ecology: encounterEcology, quality }, random)
  } else {
    next.materials.pebble += 1
    next.stats.materialsEarned += 1
    logEntry(next, { at: signal.at, kind: 'material-drop', quality: 'pebble', ecology: signal.ecology }, random)
  }
  return commit(next, signal.at)
}
