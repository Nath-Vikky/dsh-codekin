import {
  CAPTURE_CORE_QUALITIES,
  STARTER_CREATURE_IDS,
  TRACE_ECOLOGIES,
  creatureById,
  creaturesInEcology,
} from './catalog.ts'
import {
  BASE_ACTIONS_PER_CREATURE,
  BASE_BOSS_ACTIONS,
  BOSS_SKILL_ENERGY_COST,
  BOSS_SKILL_ENERGY_LIMIT,
  CAPTURE_HEALTH_RATIO,
  MATERIAL_DROP_WEIGHTS,
  MATERIAL_XP,
  MAX_ACTIONS_PER_CREATURE,
  MAX_BOSS_ACTIONS,
  MAX_BOSS_BONUS_ACTIONS,
  MAX_BOSS_SWAPS_PER_PHASE,
  MAX_BONUS_ACTIONS_PER_STAGE,
  MAX_CAPTURE_ATTEMPTS,
  MAX_MAP_ENCOUNTERS,
  MAX_PLAYER_LEVEL,
  captureChance,
  coreQualityWeights,
  effectivePartyLevel,
  encounterLifetimeMs,
  idleRewardTier,
  levelForXp,
  playerStats,
  qualityIndex,
  threatPoints,
  totalXpForLevel,
  wildLevelForRoster,
  wildQualityWeights,
  wildStats,
} from './balance.ts'
import {
  MATCH_BOARD_CELLS,
  createMatchBoard,
  chooseBossBattleSwap,
  convertRandomBattleTiles,
  findFirstLegalBattleSwap,
  hasBattleMatches,
  reshuffleBattleBoard,
  resolveBattleSwap,
  resolveExistingBattleMatches,
  resolveForcedTiles,
} from './match3.ts'
import { QUALITY_SKILL_MULTIPLIERS, skillByCreatureId } from './skills.ts'
import {
  MAX_TOWER_FLOOR,
  emptyTowerMaterialReward,
  towerBossStats,
  towerFloorProfile,
} from './tower.ts'
import type {
  BattleLogEntry,
  BattlePartyMember,
  BattleState,
  CaptureCoreQuality,
  CapturedCreature,
  CreatureStats,
  EnemyIntent,
  MatchCascadeFrame,
  MatchTile,
  RandomSource,
  TileSpecial,
  TraceEcology,
  TraceLogEntry,
  TraceSignal,
  TraceWildAction,
  TraceWildBattleAnimation,
  TraceWildIdleReward,
  TraceWildState,
} from './types.ts'

const MAX_CREATURES = 240
const MAX_PROCESSED_SIGNALS = 256
const MAX_LOG_ENTRIES = 40
const MAX_BATTLE_LOG_ENTRIES = 14
const ENERGY_LIMIT = 12
const MAX_IDLE_ELAPSED_MS = 12 * 60 * 60 * 1000

export const ECOLOGY_ADVANTAGE: Readonly<Record<TraceEcology, TraceEcology>> = Object.freeze({
  lumen: 'glitch',
  glitch: 'relay',
  relay: 'forge',
  forge: 'aegis',
  aegis: 'lumen',
})

export class TraceWildRuleError extends Error {
  constructor(readonly code: 'invalid-action' | 'conflict') {
    super(code)
  }
}

function emptyCores(): Record<CaptureCoreQuality, number> {
  return { pebble: 0, pulse: 0, prism: 0, nova: 0, origin: 0 }
}

export function createInitialTraceWildState(now = Date.now()): TraceWildState {
  return {
    schemaVersion: 3,
    revision: 0,
    createdAt: now,
    updatedAt: now,
    starterChosen: false,
    cores: emptyCores(),
    materials: emptyCores(),
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

function boundedRandom(random: RandomSource): number {
  const value = random()
  if (!Number.isFinite(value)) return 0
  return Math.min(0.999999999, Math.max(0, value))
}

function randomId(prefix: string, now: number, random: RandomSource): string {
  const first = Math.floor(boundedRandom(random) * 0x1_0000_0000).toString(36).padStart(7, '0')
  const second = Math.floor(boundedRandom(random) * 0x1_0000_0000).toString(36).padStart(7, '0')
  return `${prefix}_${now.toString(36)}_${first}${second}`
}

function chooseWeighted<T extends string>(weights: Readonly<Record<T, number>>, random: RandomSource): T {
  const entries = Object.entries(weights) as [T, number][]
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0)
  let cursor = boundedRandom(random) * total
  for (const [key, weight] of entries) {
    cursor -= weight
    if (cursor < 0) return key
  }
  return entries[entries.length - 1]![0]
}

function logEntry(state: TraceWildState, entry: Omit<TraceLogEntry, 'id'>, random: RandomSource): void {
  state.log.unshift({ ...entry, id: randomId('log', entry.at, random) })
  state.log = state.log.slice(0, MAX_LOG_ENTRIES)
}

function appendBattleLog(battle: BattleState, row: BattleLogEntry): void {
  battle.log.push(row)
  battle.log = battle.log.slice(-MAX_BATTLE_LOG_ENTRIES)
}

function commit(state: TraceWildState, now: number): TraceWildState {
  state.revision += 1
  state.updatedAt = now
  return state
}

function isHighQuality(quality: CaptureCoreQuality): boolean {
  return qualityIndex(quality) >= qualityIndex('prism')
}

function chooseWildQuality(state: TraceWildState, activeMinutes: number, random: RandomSource): CaptureCoreQuality {
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

function chooseCoreQuality(state: TraceWildState, activeMinutes: number, random: RandomSource): CaptureCoreQuality {
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
  const materials = emptyCores()
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

function updateDex(state: TraceWildState, creatureId: string, at: number, captured: boolean): void {
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

function pickCreature(signal: TraceSignal, random: RandomSource): string {
  if (signal.ecology === 'glitch' && signal.variant !== undefined && boundedRandom(random) < 0.78) {
    return ({
      missing: 'glitch-null-nibbler', stack: 'glitch-stack-weaver', timeout: 'glitch-lagtoad',
      crash: 'glitch-crashfox', overflow: 'glitch-overflow-maw',
    } as const)[signal.variant]
  }
  const intensity = Math.min(5, Math.max(0, signal.intensity))
  const candidates = creaturesInEcology(signal.ecology)
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

function purgeExpiredEncounters(state: TraceWildState, now: number): void {
  const activeEncounter = state.battle?.mode === 'tower' ? undefined : state.battle?.encounterId
  state.encounters = state.encounters.filter(encounter => (
    encounter.id === activeEncounter || now < encounter.expiresAt
  ))
  if (activeEncounter !== undefined && !state.encounters.some(row => row.id === activeEncounter)) delete state.battle
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

export function applyTraceSignal(current: TraceWildState, signal: TraceSignal, random: RandomSource): TraceWildState {
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
    const creatureId = pickCreature(signal, random)
    const quality = chooseWildQuality(next, signal.activeMinutes, random)
    const level = wildLevelForRoster(next.creatures, signal.activeMinutes, quality, boundedRandom(random))
    const point = mapPoint(signal.ecology, random)
    next.encounters.push({
      id: randomId('wild', signal.at, random),
      creatureId,
      ecology: signal.ecology,
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
    logEntry(next, { at: signal.at, kind: 'encounter', creatureId, ecology: signal.ecology, quality }, random)
  } else {
    next.materials.pebble += 1
    next.stats.materialsEarned += 1
    logEntry(next, { at: signal.at, kind: 'material-drop', quality: 'pebble', ecology: signal.ecology }, random)
  }
  return commit(next, signal.at)
}

function levelStats(creature: CapturedCreature): CreatureStats {
  const definition = creatureById(creature.creatureId)
  if (definition === undefined) throw new TraceWildRuleError('conflict')
  return playerStats(definition.stats, creature.level, creature.quality)
}

function memberStats(member: BattlePartyMember): CreatureStats {
  const definition = creatureById(member.creatureId)
  if (definition === undefined) throw new TraceWildRuleError('conflict')
  return playerStats(definition.stats, member.level, member.quality)
}

function affinity(attacker: TraceEcology, defender: TraceEcology): number {
  if (ECOLOGY_ADVANTAGE[attacker] === defender) return 1.2
  if (ECOLOGY_ADVANTAGE[defender] === attacker) return 0.8
  return 1
}

function ecologyThatCounters(defender: TraceEcology): TraceEcology {
  return TRACE_ECOLOGIES.find(ecology => ECOLOGY_ADVANTAGE[ecology] === defender) ?? 'lumen'
}

function activeMember(battle: BattleState): BattlePartyMember {
  const member = battle.party[battle.activeIndex]
  if (member === undefined || member.hp <= 0) throw new TraceWildRuleError('conflict')
  return member
}

function livingMembers(battle: BattleState): BattlePartyMember[] {
  return battle.party.filter(member => member.hp > 0)
}

function qualityMultiplier(member: BattlePartyMember): number {
  return QUALITY_SKILL_MULTIPLIERS[member.quality]
}

function playerOffenseLevelFactor(member: BattlePartyMember, battle: BattleState): number {
  const levelDelta = member.level - battle.wildLevel
  if (levelDelta < 0) return Math.max(0.45, Math.exp(levelDelta / 34))
  return Math.min(1.15, 1 + levelDelta * 0.003)
}

function healMember(member: BattlePartyMember, amount: number): number {
  const before = member.hp
  member.hp = Math.min(member.maxHp, member.hp + Math.max(0, Math.round(amount)))
  return member.hp - before
}

function shieldMember(member: BattlePartyMember, amount: number): number {
  const limit = Math.round(member.maxHp * 0.75)
  const before = member.shield
  member.shield = Math.min(limit, member.shield + Math.max(0, Math.round(amount)))
  return member.shield - before
}

function grantEnergy(member: BattlePartyMember, amount: number): void {
  const whole = Math.max(0, Math.floor(amount))
  const available = Math.max(0, ENERGY_LIMIT - member.energy)
  member.energy += Math.min(available, whole)
  const overflow = whole - available
  if (overflow > 0 && member.creatureId === 'glitch-overflow-maw') {
    member.overcharge = Math.min(5, member.overcharge + overflow)
  }
}

function applyWildDamage(battle: BattleState, rawAmount: number, contributor?: BattlePartyMember): number {
  let amount = Math.max(1, Math.round(rawAmount))
  if (battle.enemyMarks > 0) {
    amount = Math.round(amount * (1 + battle.enemyMarks * 0.1))
    battle.enemyMarks = 0
  }
  if (battle.wildArmor > 0) amount = Math.max(1, Math.round(amount * 0.35))
  battle.pendingTeamDamage = Math.min(9_999_999, battle.pendingTeamDamage + amount)
  const owner = contributor ?? battle.party[battle.activeIndex]
  if (owner !== undefined) owner.stageDamage = Math.min(9_999_999, owner.stageDamage + amount)
  return amount
}

function applyRawHit(battle: BattleState, member: BattlePartyMember, power: number): number {
  const stats = memberStats(member)
  const defended = stats.attack * power * playerOffenseLevelFactor(member, battle) * 100 / (100 + battle.wildDefense)
  return applyWildDamage(battle, defended, member)
}

function settleTeamStrike(battle: BattleState): boolean {
  const pending = Math.max(0, Math.round(battle.pendingTeamDamage))
  const contributions = battle.party
    .filter(member => member.stageDamage > 0)
    .map(member => ({ instanceId: member.instanceId, amount: Math.round(member.stageDamage) }))
  let remaining = pending
  const absorbed = Math.min(battle.wildShield, remaining)
  battle.wildShield -= absorbed
  remaining -= absorbed
  const before = battle.wildHp
  battle.wildHp = Math.max(0, battle.wildHp - remaining)
  const applied = absorbed + before - battle.wildHp
  battle.lastTeamStrike = pending
  battle.lastTeamDamageApplied = applied
  battle.lastTeamContributions = contributions
  battle.lastPlayerDamage = pending
  battle.pendingTeamDamage = 0
  for (const member of battle.party) member.stageDamage = 0
  if (pending > 0) appendBattleLog(battle, { turn: battle.turn, kind: 'team-strike', amount: applied })
  if (battle.wildHp > 0 && battle.enemyPhase === 1 && battle.wildHp * 2 <= battle.wildMaxHp
    && battle.bossSkillTier >= 5) {
    battle.enemyPhase = 2
    battle.wildShield = Math.min(
      Math.round(battle.wildMaxHp * 0.4),
      battle.wildShield + Math.round(battle.wildMaxHp * 0.12),
    )
    appendBattleLog(battle, { turn: battle.turn, kind: 'phase-shift', amount: battle.wildShield })
  }
  return battle.wildHp <= 0
}

function damageForStep(battle: BattleState, member: BattlePartyMember, counts: Readonly<Record<TraceEcology, number>>, chain: number): number {
  const wild = creatureById(battleEncounterCreatureId(battle))
  if (wild === undefined) throw new TraceWildRuleError('conflict')
  const stats = memberStats(member)
  const hasForktail = livingMembers(battle).some(row => row.creatureId === 'relay-forktail')
  const hasAtlas = livingMembers(battle).some(row => row.creatureId === 'lumen-atlashart')
  let combo = Math.min(2, 1 + 0.2 * (chain - 1) + (hasForktail ? 0.05 * (chain - 1) : 0))
  if (hasAtlas && chain === 1 && battle.party.some(row => row.creatureId === 'lumen-atlashart' && row.passiveRound !== battle.round)) {
    combo = Math.max(combo, 1.15)
  }
  let total = 0
  for (const ecology of TRACE_ECOLOGIES) {
    const count = counts[ecology]
    if (count <= 0) continue
    const element = battle.affinityFloorActions > 0 ? Math.max(1.2, affinity(ecology, wild.ecology)) : affinity(ecology, wild.ecology)
    total += stats.attack * (count / 3) * combo * element
      * playerOffenseLevelFactor(member, battle) * 100 / (100 + battle.wildDefense)
  }
  if (member.creatureId === 'glitch-crashfox' && member.hp * 2 < member.maxHp) total *= 1.25
  if (member.creatureId === 'relay-duplex-hare' && battle.round % 2 === 1) total *= 1.1
  return Math.max(1, Math.round(total))
}

function battleEncounterCreatureId(battle: BattleState): string {
  return battle.wildCreatureId
}

function lowestHealthMember(battle: BattleState): BattlePartyMember | undefined {
  return livingMembers(battle).sort((left, right) => left.hp / left.maxHp - right.hp / right.maxHp)[0]
}

function convertOnePassiveTile(
  boardValue: readonly MatchTile[],
  ecology: TraceEcology,
  random: RandomSource,
): MatchTile[] {
  const board = boardValue.map(current => ({ ...current }))
  const start = Math.floor(boundedRandom(random) * board.length)
  for (let offset = 0; offset < board.length; offset += 1) {
    const index = (start + offset) % board.length
    const current = board[index]!
    if (current.special !== 'none' || current.ecology === ecology) continue
    board[index] = { ecology, special: 'none' }
    if (!hasBattleMatches(board)) return board
    board[index] = current
  }
  return board
}

function createGuaranteedMatch(boardValue: readonly MatchTile[], ecology: TraceEcology): MatchTile[] {
  const board = boardValue.map(current => ({ ...current }))
  for (let row = 0; row < 7; row += 1) {
    for (let column = 0; column <= 4; column += 1) {
      const indexes = [row * 7 + column, row * 7 + column + 1, row * 7 + column + 2]
      if (indexes.every(index => board[index]!.special === 'none')) {
        for (const index of indexes) board[index] = { ecology, special: 'none' }
        return board
      }
    }
  }
  return board
}

function applyMatchPassives(
  battle: BattleState,
  counts: Readonly<Record<TraceEcology, number>>,
  chain: number,
  maxGroup: number,
  specialCount: number,
  stepDamage: number,
  random: RandomSource,
): number {
  let bonusDamage = 0
  const active = activeMember(battle)
  const colors = TRACE_ECOLOGIES.filter(ecology => counts[ecology] > 0).length
  for (const member of livingMembers(battle)) {
    const scale = qualityMultiplier(member)
    switch (member.creatureId) {
      case 'lumen-indeximp':
        if (counts.lumen > 0 && member.passiveRound !== battle.round) {
          battle.enemyMarks = Math.min(3, battle.enemyMarks + 1)
          member.passiveRound = battle.round
        }
        break
      case 'lumen-foliomoth':
        if (counts.lumen >= 4) {
          const target = lowestHealthMember(battle)
          if (target !== undefined) healMember(target, target.maxHp * 0.03 * scale)
        }
        break
      case 'lumen-lensel':
        if (chain >= 2 && member.passiveStage !== battle.stage) {
          grantEnergy(member, 2)
          member.passiveStage = battle.stage
        }
        break
      case 'lumen-echocoil':
        if (chain >= 2 && member.passiveRound !== battle.round) {
          bonusDamage += applyWildDamage(battle, stepDamage * 0.3 * scale)
          member.passiveRound = battle.round
        }
        break
      case 'lumen-atlashart':
        if (chain === 1) member.passiveRound = battle.round
        break
      case 'forge-sparkmite':
        if (counts.forge >= 4) bonusDamage += applyRawHit(battle, member, 0.25 * scale)
        break
      case 'forge-rivetclaw':
        if (counts.forge > 0 && member.counterPower > 0) {
          bonusDamage += applyRawHit(battle, member, member.counterPower)
          member.counterPower = 0
        }
        break
      case 'forge-solderling':
        if (counts.forge > 0 && colors > 1) battle.enemyBurn = Math.min(4.2, battle.enemyBurn + scale)
        break
      case 'forge-anvilback':
        if (counts.forge >= 5 && battle.wildArmor > 0) battle.wildArmor -= 1
        break
      case 'forge-kiln-colossus':
        if (counts.forge > 0 && chain >= 2) battle.enemyBurn = Math.min(4.2, battle.enemyBurn + 0.25 * scale)
        break
      case 'relay-duplex-hare':
        if (counts.relay > 0 && battle.round % 2 === 0) grantEnergy(member, 1)
        break
      case 'relay-routeray':
        if (counts.relay > 0 && member.passiveStage !== battle.stage) {
          battle.board = convertOnePassiveTile(battle.board, 'relay', random)
          member.passiveStage = battle.stage
        }
        break
      case 'aegis-veribud':
        if (counts.aegis > 0 && member.passiveStage !== battle.stage) {
          healMember(active, active.maxHp * 0.02 * scale)
          member.passiveStage = battle.stage
        }
        break
      case 'aegis-anchorbee':
        if (specialCount > 0) shieldMember(active, active.maxHp * 0.04 * scale)
        break
      case 'aegis-steady-ram': {
        const wild = creatureById(battleEncounterCreatureId(battle))!
        const resisted = ECOLOGY_ADVANTAGE[wild.ecology]
        if (counts[resisted] > 0) shieldMember(active, stepDamage * 0.2 * scale)
        break
      }
      case 'glitch-null-nibbler':
        if (counts.glitch > 0) {
          if (battle.wildArmor > 0) battle.wildArmor -= 1
          else battle.wildShield = Math.max(0, battle.wildShield - Math.round(memberStats(member).attack * scale))
        }
        break
      case 'glitch-stack-weaver':
        if (chain >= 2) battle.board = convertOnePassiveTile(battle.board, 'glitch', random)
        break
    }
  }
  if (maxGroup >= 5 && battle.wildArmor > 0) appendBattleLog(battle, { turn: battle.turn, kind: 'armor-break' })
  return bonusDamage
}

function distributeEnergy(battle: BattleState, totals: Readonly<Record<TraceEcology, number>>): void {
  for (const member of livingMembers(battle)) {
    const ecology = creatureById(member.creatureId)?.ecology
    if (ecology === undefined) continue
    grantEnergy(member, Math.min(8, totals[ecology]))
  }
  if (totals.relay > 0 && livingMembers(battle).some(member => member.creatureId === 'relay-mesh-jelly')) {
    const shared = Math.floor(Math.min(8, totals.relay) * 0.25)
    if (shared > 0) {
      for (const member of livingMembers(battle)) {
        if (creatureById(member.creatureId)?.ecology !== 'relay') grantEnergy(member, shared)
      }
    }
  }
}

function applyResolution(
  battle: BattleState,
  resolution: ReturnType<typeof resolveExistingBattleMatches>,
  random: RandomSource,
  consumeRepeat: boolean,
): number {
  battle.board = resolution.board
  const totals: Record<TraceEcology, number> = { lumen: 0, forge: 0, relay: 0, aegis: 0, glitch: 0 }
  const active = activeMember(battle)
  let totalDamage = 0
  const armorBefore = battle.wildArmor
  for (const step of resolution.steps) {
    for (const ecology of TRACE_ECOLOGIES) totals[ecology] += step.counts[ecology]
    const rawDamage = damageForStep(battle, active, step.counts, step.chain)
    const damage = applyWildDamage(battle, rawDamage)
    totalDamage += damage
    totalDamage += applyMatchPassives(
      battle, step.counts, step.chain, step.maxGroup, step.specialCount, damage, random,
    )
  }
  if (resolution.steps.length > 0 && armorBefore > 0 && battle.wildArmor === armorBefore) {
    battle.wildArmor -= 1
    appendBattleLog(battle, { turn: battle.turn, kind: 'armor-break' })
  }
  distributeEnergy(battle, totals)
  if (consumeRepeat && battle.repeatPower > 0 && totalDamage > 0) {
    totalDamage += applyWildDamage(battle, totalDamage * battle.repeatPower)
    battle.repeatPower = 0
  }
  battle.lastPlayerDamage = totalDamage
  if (totalDamage > 0) appendBattleLog(battle, { turn: battle.turn, kind: 'match', amount: totalDamage })
  if (resolution.steps.length > 1) appendBattleLog(battle, { turn: battle.turn, kind: 'combo', amount: resolution.steps.length })
  return totalDamage
}

function applyStageEntryPassives(battle: BattleState): void {
  const member = activeMember(battle)
  member.skillUsedStage = false
  const scale = qualityMultiplier(member)
  if (member.creatureId === 'relay-pingfly') grantEnergy(member, 2)
  if (member.creatureId === 'aegis-loop-tortoise') shieldMember(member, member.maxHp * 0.08 * scale)
  appendBattleLog(battle, { turn: battle.turn, kind: 'switch', creatureId: member.creatureId })
}

function nextLivingIndex(battle: BattleState): { index: number; wrapped: boolean } | undefined {
  for (let offset = 1; offset <= battle.party.length; offset += 1) {
    const index = (battle.activeIndex + offset) % battle.party.length
    if (battle.party[index]!.hp > 0) return { index, wrapped: index <= battle.activeIndex }
  }
  return undefined
}

function damagePartyMember(member: BattlePartyMember, amountValue: number): number {
  let amount = Math.max(1, Math.round(amountValue))
  const absorbed = Math.min(member.shield, amount)
  member.shield -= absorbed
  amount -= absorbed
  const before = member.hp
  member.hp = Math.max(0, member.hp - amount)
  return absorbed + before - member.hp
}

function maybePreventDefeat(battle: BattleState, target: BattlePartyMember): boolean {
  if (target.hp > 0) return true
  const guardian = battle.party.find(member => member.creatureId === 'aegis-dawnguard' && !member.reviveUsed)
  if (guardian === undefined) return false
  guardian.reviveUsed = true
  target.hp = 1
  shieldMember(target, target.maxHp * 0.1 * qualityMultiplier(guardian))
  return true
}

function maybeDelayForLagtoad(battle: BattleState): void {
  const lagtoad = battle.party.find(member => member.hp > 0 && member.creatureId === 'glitch-lagtoad' && !member.passiveBattleUsed)
  if (lagtoad !== undefined && battle.party.some(member => member.hp > 0 && member.hp * 2 < member.maxHp)) {
    lagtoad.passiveBattleUsed = true
    battle.enemyDelayed = Math.max(1, battle.enemyDelayed)
  }
}

function mutateBoardForEnemy(battle: BattleState, ecology: TraceEcology, random: RandomSource): void {
  if (battle.boardLockActions > 0) return
  if (ecology === 'relay') battle.board = reshuffleBattleBoard(battle.board, random)
  if (ecology === 'glitch') battle.board = convertRandomBattleTiles(battle.board, 'glitch', 2, random)
}

function baseEnemyIntent(ecology: TraceEcology): EnemyIntent {
  switch (ecology) {
    case 'lumen': return 'mark'
    case 'forge': return 'strike'
    case 'relay': return 'disrupt'
    case 'aegis': return 'guard'
    case 'glitch': return 'corrupt'
  }
}

function bossSkillTierForThreat(threat: number): 1 | 2 | 3 | 4 | 5 {
  if (threat >= 105) return 5
  if (threat >= 75) return 4
  if (threat >= 45) return 3
  if (threat >= 20) return 2
  return 1
}

function enemyTargetFor(battle: BattleState, intent: EnemyIntent): { scope: BattleState['enemyTargetScope']; index?: number } {
  if (intent === 'guard') return { scope: 'self' }
  if (intent === 'sweep') return { scope: 'all' }
  if (intent === 'freeze') {
    const next = nextLivingIndex(battle)
    return { scope: 'single', ...(next === undefined ? {} : { index: next.index }) }
  }
  return { scope: 'single', index: battle.activeIndex }
}

function prepareBossIntent(battle: BattleState, random: RandomSource): void {
  const wild = creatureById(battleEncounterCreatureId(battle))
  if (wild === undefined) throw new TraceWildRuleError('conflict')
  const tier = battle.bossSkillTier
  const roll = boundedRandom(random)
  battle.bossSkillArmed = battle.bossEnergy >= BOSS_SKILL_ENERGY_COST
  let intent: EnemyIntent
  if (!battle.bossSkillArmed) {
    intent = tier >= 2 && roll < 0.16 + tier * 0.03 ? 'sweep' : 'strike'
  } else {
    intent = tier >= 2 ? baseEnemyIntent(wild.ecology) : 'strike'
    if (tier >= 4 && battle.enemyHardControlCooldown === 0 && roll < 0.1 + tier * 0.02) {
      intent = wild.ecology === 'lumen' || wild.ecology === 'relay' ? 'lock' : 'freeze'
    } else if (tier >= 2 && roll < 0.26 + tier * 0.025) {
      intent = 'sweep'
    } else if (tier >= 3 && roll < 0.5 + tier * 0.02 && (wild.ecology === 'lumen' || wild.ecology === 'glitch')) {
      intent = 'lock'
    }
  }
  const target = enemyTargetFor(battle, intent)
  battle.enemyIntent = intent
  battle.enemyTargetScope = target.scope
  if (target.index === undefined) delete battle.enemyTargetIndex
  else battle.enemyTargetIndex = target.index
}

function applyEnemyHit(
  battle: BattleState,
  target: BattlePartyMember,
  wildEcology: TraceEcology,
  power: number,
  maximumHealthRatio: number,
  random: RandomSource,
): number {
  const targetDefinition = creatureById(target.creatureId)
  if (targetDefinition === undefined) throw new TraceWildRuleError('conflict')
  const roll = battle.wildAttack * power * (0.88 + boundedRandom(random) * 0.24)
    * affinity(wildEcology, targetDefinition.ecology) * 100 / (100 + memberStats(target).defense)
  const bounded = Math.min(roll, target.maxHp * maximumHealthRatio)
  const damage = damagePartyMember(target, bounded)
  if (target.creatureId === 'forge-rivetclaw' && damage > 0) {
    target.counterPower = 0.8 * qualityMultiplier(target)
  }
  maybePreventDefeat(battle, target)
  return damage
}

function lockEnemyTiles(battle: BattleState, random: RandomSource): number {
  const target = battle.party[battle.enemyTargetIndex ?? battle.activeIndex]
  const definition = target === undefined ? undefined : creatureById(target.creatureId)
  const ecology = definition?.ecology ?? 'lumen'
  const maximum = Math.min(5, Math.max(3, battle.bossSkillTier))
  const candidates = battle.board.map((tile, index) => (
    tile.ecology === ecology && tile.special === 'none' && (tile.lockedActions ?? 0) === 0 ? index : -1
  )).filter(index => index >= 0)
  let count = 0
  while (candidates.length > 0 && count < maximum) {
    const cursor = Math.floor(boundedRandom(random) * candidates.length)
    const index = candidates.splice(cursor, 1)[0]!
    battle.board[index] = { ...battle.board[index]!, lockedActions: 2 }
    count += 1
  }
  return count
}

function performBossSettlement(battle: BattleState, random: RandomSource): boolean {
  const wild = creatureById(battleEncounterCreatureId(battle))
  if (wild === undefined) throw new TraceWildRuleError('conflict')
  if (battle.enemyBurn > 0) {
    applyWildDamage(battle, battle.wildMaxHp * 0.025 * battle.enemyBurn, undefined)
    battle.enemyBurn = Math.max(0, battle.enemyBurn - 0.5)
  }
  const finalPower = Math.min(1.55, Math.max(0.55, 0.35 + 0.22 * battle.bossAttackCharge))
  const intendedTarget = battle.party[battle.enemyTargetIndex ?? battle.activeIndex]
  const target = intendedTarget !== undefined && intendedTarget.hp > 0
    ? intendedTarget
    : livingMembers(battle)[0]
  let totalDamage = 0
  if (battle.enemyIntent === 'sweep') {
    for (const member of livingMembers(battle)) {
      totalDamage += applyEnemyHit(battle, member, wild.ecology, finalPower * 0.62, 0.25, random)
    }
    appendBattleLog(battle, { turn: battle.turn, kind: 'enemy-sweep', amount: totalDamage })
  } else if (target !== undefined && target.hp > 0) {
    const strikePower = battle.enemyIntent === 'strike' && battle.bossSkillArmed ? finalPower * 1.15 : finalPower
    totalDamage = applyEnemyHit(battle, target, wild.ecology, strikePower, 0.35, random)
    appendBattleLog(battle, { turn: battle.turn, kind: 'enemy', amount: totalDamage, creatureId: target.creatureId })
  }
  battle.lastBossAttack = totalDamage

  if (battle.bossSkillArmed) {
    battle.bossEnergy = Math.max(0, battle.bossEnergy - BOSS_SKILL_ENERGY_COST)
    appendBattleLog(battle, { turn: battle.turn, kind: 'boss-skill', creatureId: wild.id })
    switch (battle.enemyIntent) {
      case 'guard':
        battle.wildShield = Math.min(
          Math.round(battle.wildMaxHp * 0.4),
          battle.wildShield + Math.round(battle.wildMaxHp * 0.1),
        )
        appendBattleLog(battle, { turn: battle.turn, kind: 'enemy-shield', amount: battle.wildShield })
        break
      case 'freeze':
        if (target !== undefined && target.hp > 0) {
          target.frozenStages = Math.max(target.frozenStages, 1)
          battle.enemyHardControlCooldown = 3
          appendBattleLog(battle, { turn: battle.turn, kind: 'enemy-freeze', amount: 1, creatureId: target.creatureId })
        }
        break
      case 'lock': {
        const count = lockEnemyTiles(battle, random)
        battle.enemyHardControlCooldown = Math.max(battle.enemyHardControlCooldown, 2)
        appendBattleLog(battle, { turn: battle.turn, kind: 'enemy-lock', amount: count })
        break
      }
      case 'disrupt':
        mutateBoardForEnemy(battle, 'relay', random)
        break
      case 'corrupt':
        mutateBoardForEnemy(battle, 'glitch', random)
        break
      case 'mark':
        if (target !== undefined) target.energy = Math.max(0, target.energy - 2)
        break
      case 'strike':
      case 'sweep':
        break
    }
  } else {
    mutateBoardForEnemy(battle, wild.ecology, random)
  }
  if (battle.enemyHardControlCooldown > 0 && battle.enemyIntent !== 'freeze' && battle.enemyIntent !== 'lock') {
    battle.enemyHardControlCooldown -= 1
  }
  return livingMembers(battle).length === 0
}

function advanceBattleStage(battle: BattleState): boolean {
  if (livingMembers(battle).length === 0) return true
  const next = nextLivingIndex(battle)
  if (next === undefined) return true
  battle.activeIndex = next.index
  if (next.wrapped) battle.round += 1
  battle.stage += 1
  battle.actionsRemaining = battle.party[next.index]!.frozenStages > 0 ? 0 : BASE_ACTIONS_PER_CREATURE
  battle.bonusActionsGranted = 0
  battle.turn += 1
  if (battle.actionsRemaining > 0) applyStageEntryPassives(battle)
  return false
}

function createBattleParty(state: TraceWildState): BattlePartyMember[] {
  const selected = state.squad.map(id => state.creatures.find(row => row.instanceId === id))
    .filter((row): row is CapturedCreature => row !== undefined).slice(0, 3)
  if (selected.length === 0) throw new TraceWildRuleError('conflict')
  return selected.map((captured) => {
    const stats = levelStats(captured)
    return {
      instanceId: captured.instanceId,
      creatureId: captured.creatureId,
      quality: captured.quality,
      level: captured.level,
      hp: stats.hp,
      maxHp: stats.hp,
      shield: 0,
      energy: 0,
      skillUsedStage: false,
      passiveRound: 0,
      passiveStage: 0,
      passiveBattleUsed: false,
      reviveUsed: false,
      counterPower: 0,
      overcharge: 0,
      stageDamage: 0,
      frozenStages: 0,
    }
  })
}

function installBattle(
  state: TraceWildState,
  input: Readonly<{
    encounterId: string
    wildCreatureId: string
    level: number
    quality: CaptureCoreQuality
    armor: number
    stats: CreatureStats
    mode: 'wild' | 'tower'
    bossSkillTier: 1 | 2 | 3 | 4 | 5
    startingBossEnergy: number
    towerFloor?: number
  }>,
  party: BattlePartyMember[],
  now: number,
  random: RandomSource,
): void {
  const wild = creatureById(input.wildCreatureId)
  if (wild === undefined) throw new TraceWildRuleError('conflict')
  const wildMaxHp = input.stats.hp
  const battle: BattleState = {
    id: randomId('battle', now, random),
    encounterId: input.encounterId,
    wildCreatureId: wild.id,
    mode: input.mode,
    ...(input.towerFloor === undefined ? {} : { towerFloor: input.towerFloor }),
    bossSkillTier: input.bossSkillTier,
    board: createMatchBoard(random),
    party,
    turnOwner: 'player',
    activeIndex: 0,
    actionsRemaining: BASE_ACTIONS_PER_CREATURE,
    bossActionsRemaining: 0,
    bossActionsTaken: 0,
    bossEnergy: input.startingBossEnergy,
    bossAttackCharge: 0,
    bossBonusActionsGranted: 0,
    bossSkillArmed: false,
    lastBossAttack: 0,
    lastBossMatch: 0,
    stage: 1,
    round: 1,
    wildHp: wildMaxHp,
    wildMaxHp,
    wildArmor: input.armor,
    wildShield: 0,
    wildDefense: input.stats.defense,
    wildAttack: input.stats.attack,
    wildLevel: input.level,
    wildQuality: input.quality,
    enemyIntent: 'strike',
    enemyTargetScope: 'single',
    enemyTargetIndex: 0,
    enemyMarks: 0,
    enemyBurn: 0,
    enemyDelayed: 0,
    affinityFloorActions: 0,
    boardLockActions: 0,
    repeatPower: 0,
    lastPlayerDamage: 0,
    pendingTeamDamage: 0,
    lastTeamStrike: 0,
    lastTeamDamageApplied: 0,
    lastTeamContributions: [],
    bonusActionsGranted: 0,
    captureWindow: false,
    captureAttempts: 0,
    enemyHardControlCooldown: 0,
    enemyPhase: 1,
    turn: 1,
    log: [{ turn: 0, kind: 'start', creatureId: wild.id, ecology: wild.ecology }],
  }
  state.battle = battle
  prepareBossIntent(battle, random)
  applyStageEntryPassives(battle)
  state.stats.battlesStarted += 1
}

function startBattle(state: TraceWildState, encounterId: string, now: number, random: RandomSource): void {
  if (!state.starterChosen || state.battle !== undefined) throw new TraceWildRuleError('conflict')
  const encounter = state.encounters.find(row => row.id === encounterId)
  if (encounter === undefined) throw new TraceWildRuleError('invalid-action')
  const wild = creatureById(encounter.creatureId)
  if (wild === undefined) throw new TraceWildRuleError('conflict')
  const party = createBattleParty(state)
  const partyAverageLevel = party.reduce((sum, member) => sum + member.level, 0) / party.length
  const rawStats = wildStats(wild, encounter.level, encounter.quality, party.length, partyAverageLevel)
  const stats = encounter.enhanced
    ? { ...rawStats, hp: Math.round(rawStats.hp * 1.12) }
    : rawStats
  installBattle(state, {
    encounterId,
    wildCreatureId: wild.id,
    level: encounter.level,
    quality: encounter.quality,
    armor: encounter.armor,
    stats,
    mode: 'wild',
    bossSkillTier: bossSkillTierForThreat(threatPoints(encounter.level, encounter.quality)),
    startingBossEnergy: 0,
  }, party, now, random)
  state.battle!.captureAttempts = encounter.captureAttempts
}

function startTowerBattle(state: TraceWildState, now: number, random: RandomSource): void {
  if (!state.starterChosen || state.battle !== undefined) throw new TraceWildRuleError('conflict')
  const floor = state.tower.highestClearedFloor + 1
  if (floor > MAX_TOWER_FLOOR) throw new TraceWildRuleError('conflict')
  const profile = towerFloorProfile(floor)
  const wild = creatureById(profile.creatureId)
  if (wild === undefined) throw new TraceWildRuleError('conflict')
  const party = createBattleParty(state)
  const partyAverageLevel = party.reduce((sum, member) => sum + member.level, 0) / party.length
  const stats = towerBossStats(wild, profile, party.length, partyAverageLevel)
  installBattle(state, {
    encounterId: `tower_${floor}`,
    wildCreatureId: wild.id,
    level: profile.level,
    quality: profile.quality,
    armor: profile.armor,
    stats,
    mode: 'tower',
    bossSkillTier: profile.skillTier,
    startingBossEnergy: profile.startingBossEnergy,
    towerFloor: floor,
  }, party, now, random)
  state.tower.attempts = Math.min(999_999_999, state.tower.attempts + 1)
}

type BattleOutcome = 'none' | 'battle-lost' | 'wild-defeated'

function isCaptureWindowAvailable(battle: BattleState): boolean {
  return battle.mode === 'wild'
    && battle.wildArmor === 0
    && battle.wildHp > 0
    && battle.captureAttempts < MAX_CAPTURE_ATTEMPTS
    && battle.wildHp / battle.wildMaxHp <= CAPTURE_HEALTH_RATIO
}

function ageTileLocks(battle: BattleState): void {
  battle.board = battle.board.map(tile => {
    const remaining = Math.max(0, (tile.lockedActions ?? 0) - 1)
    return remaining > 0 ? { ...tile, lockedActions: remaining } : { ecology: tile.ecology, special: tile.special }
  })
}

function beginBossPhase(battle: BattleState, random: RandomSource): BattleOutcome {
  maybeDelayForLagtoad(battle)
  if (battle.enemyDelayed > 0) {
    battle.enemyDelayed -= 1
    appendBattleLog(battle, { turn: battle.turn, kind: 'enemy-delay' })
    battle.turnOwner = 'player'
    if (advanceBattleStage(battle)) return 'battle-lost'
    prepareBossIntent(battle, random)
    return 'none'
  }
  battle.turnOwner = 'boss'
  battle.bossActionsRemaining = BASE_BOSS_ACTIONS
  battle.bossActionsTaken = 0
  battle.bossAttackCharge = 0
  battle.bossBonusActionsGranted = 0
  battle.lastBossMatch = 0
  return 'none'
}

function finishBossPhase(battle: BattleState, random: RandomSource): BattleOutcome {
  if (performBossSettlement(battle, random)) return 'battle-lost'
  battle.turnOwner = 'player'
  battle.bossActionsRemaining = 0
  battle.bossActionsTaken = 0
  battle.bossAttackCharge = 0
  battle.bossBonusActionsGranted = 0
  if (advanceBattleStage(battle)) return 'battle-lost'
  prepareBossIntent(battle, random)
  return 'none'
}

function completeBattleStage(
  battle: BattleState,
  random: RandomSource,
): BattleOutcome {
  const next = nextLivingIndex(battle)
  const wrapped = next?.wrapped === true
  if (wrapped && settleTeamStrike(battle)) return 'wild-defeated'
  if (wrapped && isCaptureWindowAvailable(battle)) {
    battle.captureWindow = true
    return 'none'
  }
  if (wrapped) return beginBossPhase(battle, random)
  return advanceBattleStage(battle) ? 'battle-lost' : 'none'
}

function performBattleSwap(
  state: TraceWildState,
  from: number,
  to: number,
  random: RandomSource,
): { outcome: BattleOutcome; animation: TraceWildBattleAnimation } {
  const battle = state.battle
  if (battle === undefined || battle.turnOwner !== 'player' || battle.captureWindow || battle.actionsRemaining <= 0) {
    throw new TraceWildRuleError('conflict')
  }
  const resolution = resolveBattleSwap(battle.board, from, to, random)
  if (resolution === undefined) throw new TraceWildRuleError('invalid-action')
  const animation: TraceWildBattleAnimation = {
    kind: 'match', battleId: battle.id, actor: 'player', swap: { from, to }, frames: resolution.frames,
  }
  applyResolution(battle, resolution, random, true)
  const beforeActions = battle.actionsRemaining
  const directMaxGroup = resolution.steps[0]?.maxGroup ?? 0
  if (directMaxGroup >= 5 && battle.bonusActionsGranted < MAX_BONUS_ACTIONS_PER_STAGE) {
    battle.actionsRemaining = Math.min(MAX_ACTIONS_PER_CREATURE, beforeActions + 1)
    if (battle.actionsRemaining > beforeActions) battle.bonusActionsGranted += 1
    appendBattleLog(battle, { turn: battle.turn, kind: 'action-bonus', amount: battle.actionsRemaining - beforeActions })
  } else if (directMaxGroup >= 4) {
    battle.actionsRemaining = beforeActions
    appendBattleLog(battle, { turn: battle.turn, kind: 'action-refund', amount: battle.actionsRemaining })
  } else {
    battle.actionsRemaining = Math.max(0, beforeActions - 1)
  }
  ageTileLocks(battle)
  if (battle.affinityFloorActions > 0) battle.affinityFloorActions -= 1
  if (battle.boardLockActions > 0) battle.boardLockActions -= 1
  const outcome = battle.actionsRemaining === 0 ? completeBattleStage(battle, random) : 'none'
  return { outcome, animation }
}

function performBossBoardAction(
  battle: BattleState,
  random: RandomSource,
): { outcome: BattleOutcome; animation: TraceWildBattleAnimation } {
  if (battle.turnOwner !== 'boss' || battle.bossActionsRemaining <= 0) throw new TraceWildRuleError('conflict')
  const wild = creatureById(battleEncounterCreatureId(battle))
  if (wild === undefined) throw new TraceWildRuleError('conflict')
  const swap = chooseBossBattleSwap(battle.board, wild.ecology, random)
  if (swap === undefined) throw new TraceWildRuleError('conflict')
  const resolution = resolveBattleSwap(battle.board, swap.from, swap.to, random)
  if (resolution === undefined) throw new TraceWildRuleError('conflict')
  battle.board = resolution.board
  let matched = 0
  let ownColor = 0
  let charge = 0
  for (const step of resolution.steps) {
    const count = TRACE_ECOLOGIES.reduce((sum, ecology) => sum + step.counts[ecology], 0)
    const combo = Math.min(2, 1 + 0.2 * (step.chain - 1))
    matched += count
    ownColor += step.counts[wild.ecology]
    charge += count / 3 * combo
  }
  battle.lastBossMatch = matched
  battle.bossAttackCharge = Math.min(32, battle.bossAttackCharge + charge)
  const energyGain = Math.min(8, ownColor)
  if (energyGain > 0) {
    battle.bossEnergy = Math.min(BOSS_SKILL_ENERGY_LIMIT, battle.bossEnergy + energyGain)
    appendBattleLog(battle, { turn: battle.turn, kind: 'boss-energy', amount: energyGain, ecology: wild.ecology })
  }
  appendBattleLog(battle, { turn: battle.turn, kind: 'boss-match', amount: matched, ecology: wild.ecology })
  if (resolution.steps.length > 1) {
    appendBattleLog(battle, { turn: battle.turn, kind: 'boss-combo', amount: resolution.steps.length })
  }
  const beforeActions = battle.bossActionsRemaining
  battle.bossActionsTaken += 1
  const directMaxGroup = resolution.steps[0]?.maxGroup ?? 0
  if (directMaxGroup >= 5 && battle.bossBonusActionsGranted < MAX_BOSS_BONUS_ACTIONS) {
    battle.bossActionsRemaining = Math.min(MAX_BOSS_ACTIONS, beforeActions + 1)
    if (battle.bossActionsRemaining > beforeActions) battle.bossBonusActionsGranted += 1
    appendBattleLog(battle, {
      turn: battle.turn,
      kind: 'boss-action-bonus',
      amount: battle.bossActionsRemaining - beforeActions,
    })
  } else if (directMaxGroup >= 4) {
    battle.bossActionsRemaining = beforeActions
    appendBattleLog(battle, { turn: battle.turn, kind: 'boss-action-refund', amount: beforeActions })
  } else {
    battle.bossActionsRemaining = Math.max(0, beforeActions - 1)
  }
  if (battle.bossActionsTaken >= MAX_BOSS_SWAPS_PER_PHASE) battle.bossActionsRemaining = 0
  const outcome = battle.bossActionsRemaining === 0 ? finishBossPhase(battle, random) : 'none'
  return {
    outcome,
    animation: {
      kind: 'match', battleId: battle.id, actor: 'boss', swap: { from: swap.from, to: swap.to }, frames: resolution.frames,
    },
  }
}

function continueBattle(
  battle: BattleState,
  random: RandomSource,
): { outcome: BattleOutcome; animation?: TraceWildBattleAnimation } {
  if (battle.captureWindow) {
    battle.captureWindow = false
    return { outcome: beginBossPhase(battle, random) }
  }
  if (battle.turnOwner === 'boss') return performBossBoardAction(battle, random)
  const active = battle.party[battle.activeIndex]
  if (battle.turnOwner !== 'player' || battle.actionsRemaining !== 0 || active === undefined || active.frozenStages <= 0) {
    throw new TraceWildRuleError('conflict')
  }
  active.frozenStages -= 1
  appendBattleLog(battle, { turn: battle.turn, kind: 'frozen-skip', creatureId: active.creatureId })
  return { outcome: completeBattleStage(battle, random) }
}

function skipPlayerStage(battle: BattleState, random: RandomSource): BattleOutcome {
  const active = battle.party[battle.activeIndex]
  if (battle.mode !== 'wild' || battle.turnOwner !== 'player' || battle.captureWindow
    || battle.actionsRemaining <= 0 || active === undefined || active.hp <= 0) {
    throw new TraceWildRuleError('conflict')
  }
  battle.actionsRemaining = 0
  appendBattleLog(battle, { turn: battle.turn, kind: 'stage-skip', creatureId: active.creatureId })
  return completeBattleStage(battle, random)
}

function selectedIndexes(board: readonly MatchTile[], ecology: TraceEcology, maximum: number): number[] {
  return board.map((current, index) => current.ecology === ecology ? index : -1)
    .filter(index => index >= 0).slice(0, maximum)
}

function resolveConvertedBoard(battle: BattleState, random: RandomSource): MatchCascadeFrame[] {
  const resolution = resolveExistingBattleMatches(battle.board, random)
  if (resolution.steps.length > 0) applyResolution(battle, resolution, random, false)
  return resolution.frames
}

function castActiveSkill(state: TraceWildState, creatureInstanceId: string, random: RandomSource): MatchCascadeFrame[] {
  const battle = state.battle
  if (battle === undefined || battle.turnOwner !== 'player' || battle.captureWindow || battle.actionsRemaining <= 0) {
    throw new TraceWildRuleError('conflict')
  }
  const member = activeMember(battle)
  if (member.instanceId !== creatureInstanceId || member.skillUsedStage) throw new TraceWildRuleError('conflict')
  const definition = skillByCreatureId(member.creatureId)
  if (definition === undefined || member.energy < definition.energyCost) throw new TraceWildRuleError('invalid-action')
  member.energy -= definition.energyCost
  member.skillUsedStage = true
  let scale = qualityMultiplier(member)
  if (member.creatureId === 'glitch-overflow-maw') {
    scale *= 1 + member.overcharge * 0.03
    member.overcharge = 0
  }
  let damage = 0
  const animationFrames: MatchCascadeFrame[] = []
  switch (member.creatureId) {
    case 'lumen-indeximp':
      damage += applyRawHit(battle, member, 0.8 * scale)
      battle.enemyMarks = Math.min(3, battle.enemyMarks + 1)
      battle.board = convertRandomBattleTiles(battle.board, 'lumen', 3, random)
      animationFrames.push(...resolveConvertedBoard(battle, random))
      break
    case 'lumen-foliomoth':
      for (const ally of livingMembers(battle)) healMember(ally, ally.maxHp * 0.08 * scale)
      shieldMember(member, member.maxHp * 0.1 * scale)
      break
    case 'lumen-lensel': {
      const wild = creatureById(battleEncounterCreatureId(battle))!
      battle.board = convertRandomBattleTiles(battle.board, ecologyThatCounters(wild.ecology), 4, random)
      animationFrames.push(...resolveConvertedBoard(battle, random))
      break
    }
    case 'lumen-echocoil':
      damage += applyWildDamage(battle, Math.max(memberStats(member).attack, battle.lastPlayerDamage) * 0.75 * scale)
      break
    case 'lumen-atlashart':
      battle.affinityFloorActions = Math.max(battle.affinityFloorActions, 2)
      break
    case 'forge-sparkmite':
      for (let hit = 0; hit < 3; hit += 1) damage += applyRawHit(battle, member, 0.55 * scale)
      break
    case 'forge-rivetclaw':
      shieldMember(member, member.maxHp * 0.18 * scale)
      member.counterPower = 0.8 * scale
      break
    case 'forge-solderling':
      battle.board = convertRandomBattleTiles(battle.board, 'forge', 4, random)
      battle.enemyBurn = Math.min(4.2, battle.enemyBurn + scale)
      animationFrames.push(...resolveConvertedBoard(battle, random))
      break
    case 'forge-anvilback':
      damage += applyRawHit(battle, member, 1.8 * scale)
      battle.wildArmor = Math.max(0, battle.wildArmor - 3)
      break
    case 'forge-kiln-colossus': {
      const resolution = resolveForcedTiles(battle.board, selectedIndexes(battle.board, 'forge', MATCH_BOARD_CELLS), random)
      damage += applyResolution(battle, resolution, random, false)
      animationFrames.push(...resolution.frames)
      break
    }
    case 'relay-pingfly': {
      battle.board = createGuaranteedMatch(battle.board, 'relay')
      animationFrames.push(...resolveConvertedBoard(battle, random))
      break
    }
    case 'relay-duplex-hare':
      battle.repeatPower = Math.max(battle.repeatPower, Math.min(0.9, 0.6 * scale))
      break
    case 'relay-routeray':
      battle.board = reshuffleBattleBoard(battle.board, random)
      break
    case 'relay-forktail':
      battle.repeatPower = Math.max(battle.repeatPower, Math.min(0.95, 0.7 * scale))
      break
    case 'relay-mesh-jelly':
      for (const ally of livingMembers(battle)) grantEnergy(ally, Math.round(2 * scale))
      battle.board = convertRandomBattleTiles(battle.board, 'relay', 3, random)
      animationFrames.push(...resolveConvertedBoard(battle, random))
      break
    case 'aegis-veribud':
      for (const ally of livingMembers(battle)) healMember(ally, ally.maxHp * 0.1 * scale)
      break
    case 'aegis-loop-tortoise':
      for (const ally of livingMembers(battle)) shieldMember(ally, ally.maxHp * 0.2 * scale)
      break
    case 'aegis-anchorbee':
      battle.enemyDelayed = Math.max(1, battle.enemyDelayed)
      battle.boardLockActions = Math.max(3, battle.boardLockActions)
      break
    case 'aegis-steady-ram':
      shieldMember(member, member.maxHp * 0.1 * scale)
      damage += applyRawHit(battle, member, 1.4 * scale)
      break
    case 'aegis-dawnguard':
      for (const ally of livingMembers(battle)) {
        healMember(ally, ally.maxHp * 0.16 * scale)
        shieldMember(ally, ally.maxHp * 0.08 * scale)
      }
      break
    case 'glitch-null-nibbler':
      battle.wildShield = 0
      battle.wildArmor = Math.max(0, battle.wildArmor - 2)
      damage += applyRawHit(battle, member, scale)
      break
    case 'glitch-stack-weaver':
      battle.board = convertRandomBattleTiles(battle.board, 'glitch', 5, random)
      battle.enemyMarks = Math.min(3, battle.enemyMarks + 1)
      animationFrames.push(...resolveConvertedBoard(battle, random))
      break
    case 'glitch-lagtoad':
      damage += applyRawHit(battle, member, 1.1 * scale)
      battle.enemyDelayed = Math.max(1, battle.enemyDelayed)
      break
    case 'glitch-crashfox':
      damage += applyRawHit(battle, member, 2.2 * scale)
      member.hp = Math.max(1, member.hp - Math.round(member.hp * 0.08))
      break
    case 'glitch-overflow-maw': {
      const resolution = resolveForcedTiles(battle.board, selectedIndexes(battle.board, 'glitch', 12), random)
      damage += applyResolution(battle, resolution, random, false)
      animationFrames.push(...resolution.frames)
      break
    }
  }
  battle.lastPlayerDamage = Math.max(battle.lastPlayerDamage, damage)
  appendBattleLog(battle, { turn: battle.turn, kind: 'skill', amount: damage, creatureId: member.creatureId })
  return animationFrames
}

function addCapturedCreature(
  state: TraceWildState,
  creatureId: string,
  ecology: TraceEcology,
  quality: CaptureCoreQuality,
  level: number,
  now: number,
  random: RandomSource,
): CapturedCreature {
  if (state.creatures.length >= MAX_CREATURES) throw new TraceWildRuleError('conflict')
  const captured: CapturedCreature = {
    instanceId: randomId('pet', now, random), creatureId, quality,
    level: Math.min(MAX_PLAYER_LEVEL, Math.max(1, Math.round(level))),
    xp: totalXpForLevel(level, quality), wins: 0, caughtAt: now,
    firstSignal: ecology,
  }
  state.creatures.push(captured)
  if (state.squad.length < 3) state.squad.push(captured.instanceId)
  updateDex(state, creatureId, now, true)
  return captured
}

function rosterMedianLevel(state: TraceWildState): number {
  if (state.creatures.length === 0) return 1
  const levels = state.creatures.map(creature => creature.level).sort((left, right) => left - right)
  return levels[Math.floor((levels.length - 1) / 2)] ?? 1
}

export function captureChanceForBattle(state: TraceWildState, quality: CaptureCoreQuality): number {
  const battle = state.battle
  if (battle === undefined || battle.mode !== 'wild') return 0
  const encounter = state.encounters.find(row => row.id === battle.encounterId)
  const wild = encounter === undefined ? undefined : creatureById(encounter.creatureId)
  if (encounter === undefined || wild === undefined) return 0
  const partyAverageLevel = battle.party.length === 0
    ? 1
    : battle.party.reduce((sum, member) => sum + member.level, 0) / battle.party.length
  return captureChance({
    rarity: wild.rarity,
    baseCaptureRate: wild.baseCaptureRate,
    wildQuality: encounter.quality,
    coreQuality: quality,
    healthRatio: battle.wildHp / battle.wildMaxHp,
    partyAverageLevel,
    wildLevel: encounter.level,
    priorFailures: encounter.captureAttempts,
  })
}

function attemptCapture(
  state: TraceWildState,
  quality: CaptureCoreQuality,
  now: number,
  random: RandomSource,
): 'capture-success' | 'capture-failed' | 'battle-lost' {
  const battle = state.battle
  if (battle === undefined || battle.mode !== 'wild' || !battle.captureWindow || battle.captureAttempts >= MAX_CAPTURE_ATTEMPTS) {
    throw new TraceWildRuleError('conflict')
  }
  if (state.cores[quality] <= 0) throw new TraceWildRuleError('invalid-action')
  const encounter = state.encounters.find(row => row.id === battle.encounterId)
  const wild = encounter === undefined ? undefined : creatureById(encounter.creatureId)
  if (encounter === undefined || wild === undefined) throw new TraceWildRuleError('conflict')
  state.cores[quality] -= 1
  const chance = captureChanceForBattle(state, quality)
  if (boundedRandom(random) < chance) {
    const capturedLevel = Math.min(encounter.level, rosterMedianLevel(state) + 5)
    addCapturedCreature(state, wild.id, encounter.ecology, encounter.quality, capturedLevel, now, random)
    const excessLevels = Math.max(0, encounter.level - capturedLevel)
    const bonusMaterials = Math.min(3, Math.floor(excessLevels / 5))
    for (let index = 0; index < bonusMaterials; index += 1) {
      state.materials[encounter.quality] += 1
      state.stats.materialsEarned += 1
    }
    state.encounters = state.encounters.filter(row => row.id !== encounter.id)
    state.stats.successfulCaptures += 1
    logEntry(state, { at: now, kind: 'capture', creatureId: wild.id, ecology: wild.ecology, quality: encounter.quality }, random)
    delete state.battle
    return 'capture-success'
  }
  encounter.captureAttempts += 1
  battle.captureAttempts = encounter.captureAttempts
  battle.captureWindow = false
  state.stats.failedCaptures += 1
  appendBattleLog(battle, { turn: battle.turn, kind: 'capture-failed' })
  const outcome = beginBossPhase(battle, random)
  if (outcome !== 'battle-lost') return 'capture-failed'
  logEntry(state, { at: now, kind: 'defeat', creatureId: wild.id, ecology: wild.ecology }, random)
  delete state.battle
  return 'battle-lost'
}

function awardWildDefeat(state: TraceWildState, now: number, random: RandomSource): void {
  const battle = state.battle
  const encounter = battle === undefined ? undefined : state.encounters.find(row => row.id === battle.encounterId)
  if (battle === undefined || encounter === undefined) throw new TraceWildRuleError('conflict')
  const drops = 1 + (encounter.quality === 'origin'
    ? (boundedRandom(random) < 0.5 ? 1 : 0)
    : encounter.quality === 'nova' && boundedRandom(random) < 0.25 ? 1 : 0)
  for (let index = 0; index < drops; index += 1) {
    const quality = chooseWeighted(MATERIAL_DROP_WEIGHTS[encounter.quality], random)
    state.materials[quality] += 1
    state.stats.materialsEarned += 1
    logEntry(state, { at: now, kind: 'material-drop', quality, ecology: encounter.ecology }, random)
  }
  for (const member of battle.party) {
    const captured = state.creatures.find(creature => creature.instanceId === member.instanceId)
    if (captured !== undefined) captured.wins += 1
  }
  state.stats.wildDefeats += 1
  logEntry(state, {
    at: now,
    kind: 'wild-defeat',
    creatureId: encounter.creatureId,
    ecology: encounter.ecology,
    quality: encounter.quality,
  }, random)
  state.encounters = state.encounters.filter(row => row.id !== encounter.id)
  delete state.battle
}

function awardTowerClear(state: TraceWildState, now: number, random: RandomSource): void {
  const battle = state.battle
  if (battle?.mode !== 'tower' || battle.towerFloor === undefined
    || battle.towerFloor !== state.tower.highestClearedFloor + 1) {
    throw new TraceWildRuleError('conflict')
  }
  const profile = towerFloorProfile(battle.towerFloor)
  if (profile.creatureId !== battle.wildCreatureId || profile.quality !== battle.wildQuality
    || profile.level !== battle.wildLevel || profile.skillTier !== battle.bossSkillTier) {
    throw new TraceWildRuleError('conflict')
  }
  const wild = creatureById(profile.creatureId)
  if (wild === undefined) throw new TraceWildRuleError('conflict')
  const materials = emptyTowerMaterialReward()
  for (let index = 0; index < profile.baseMaterialDrops; index += 1) {
    const quality = chooseWeighted(MATERIAL_DROP_WEIGHTS[profile.quality], random)
    materials[quality] += 1
  }
  if (profile.milestoneMaterial) materials[profile.quality] += 1
  for (const quality of CAPTURE_CORE_QUALITIES) {
    const count = materials[quality]
    if (count <= 0) continue
    state.materials[quality] += count
    state.stats.materialsEarned += count
    for (let index = 0; index < count; index += 1) {
      logEntry(state, { at: now, kind: 'material-drop', quality, ecology: wild.ecology }, random)
    }
  }
  for (const member of battle.party) {
    const captured = state.creatures.find(creature => creature.instanceId === member.instanceId)
    if (captured !== undefined) captured.wins += 1
  }
  state.tower.highestClearedFloor = profile.floor
  state.tower.clears = Math.min(999_999_999, state.tower.clears + 1)
  state.tower.lastReward = { floor: profile.floor, materials, awardedAt: now }
  logEntry(state, {
    at: now,
    kind: 'tower-clear',
    creatureId: wild.id,
    ecology: wild.ecology,
    quality: profile.quality,
  }, random)
  delete state.battle
}

function settleBattleVictory(state: TraceWildState, now: number, random: RandomSource): 'wild-defeated' | 'tower-cleared' {
  if (state.battle?.mode === 'tower') {
    awardTowerClear(state, now, random)
    return 'tower-cleared'
  }
  awardWildDefeat(state, now, random)
  return 'wild-defeated'
}

function logBattleDefeat(state: TraceWildState, now: number, random: RandomSource): void {
  const battle = state.battle
  if (battle === undefined) return
  const encounter = battle.mode === 'wild'
    ? state.encounters.find(row => row.id === battle.encounterId)
    : undefined
  const wild = creatureById(battle.wildCreatureId)
  const creatureId = encounter?.creatureId ?? wild?.id
  const ecology = encounter?.ecology ?? wild?.ecology
  logEntry(state, {
    at: now,
    kind: 'defeat',
    ...(creatureId === undefined ? {} : { creatureId }),
    ...(ecology === undefined ? {} : { ecology }),
  }, random)
}

export function applyTraceWildAction(
  current: TraceWildState,
  action: TraceWildAction,
  random: RandomSource,
  now = Date.now(),
): {
  state: TraceWildState
  notice?: 'capture-success' | 'capture-failed' | 'battle-lost' | 'wild-defeated' | 'tower-cleared' | 'skill-cast' | 'material-used' | 'idle-claimed'
  animation?: TraceWildBattleAnimation
} {
  const settled = settleTraceWildIdleRewards(current, now, random)
  const next = structuredClone(settled)
  purgeExpiredEncounters(next, now)
  let notice: 'capture-success' | 'capture-failed' | 'battle-lost' | 'wild-defeated' | 'tower-cleared' | 'skill-cast' | 'material-used' | 'idle-claimed' | undefined
  let animation: TraceWildBattleAnimation | undefined
  switch (action.type) {
    case 'choose-starter': {
      if (next.starterChosen || !STARTER_CREATURE_IDS.includes(action.creatureId as typeof STARTER_CREATURE_IDS[number])) {
        throw new TraceWildRuleError('conflict')
      }
      const definition = creatureById(action.creatureId)
      if (definition === undefined) throw new TraceWildRuleError('invalid-action')
      addCapturedCreature(next, definition.id, definition.ecology, 'prism', 1, now, random)
      next.starterChosen = true
      next.cores.pebble += 2
      logEntry(next, { at: now, kind: 'starter', creatureId: definition.id, ecology: definition.ecology }, random)
      break
    }
    case 'start-battle':
      startBattle(next, action.encounterId, now, random)
      break
    case 'start-tower':
      startTowerBattle(next, now, random)
      break
    case 'battle-swap': {
      const result = performBattleSwap(next, action.from, action.to, random)
      animation = result.animation
      if (result.outcome === 'battle-lost') {
        logBattleDefeat(next, now, random)
        delete next.battle
        notice = 'battle-lost'
      } else if (result.outcome === 'wild-defeated') {
        notice = settleBattleVictory(next, now, random)
      }
      break
    }
    case 'battle-cast': {
      const battleId = next.battle?.id
      const frames = castActiveSkill(next, action.creatureInstanceId, random)
      if (battleId !== undefined && frames.length > 0) animation = { kind: 'match', battleId, actor: 'player', frames }
      notice = 'skill-cast'
      break
    }
    case 'battle-skip-stage': {
      if (next.battle === undefined) throw new TraceWildRuleError('conflict')
      const outcome = skipPlayerStage(next.battle, random)
      if (outcome === 'battle-lost') {
        logBattleDefeat(next, now, random)
        delete next.battle
        notice = 'battle-lost'
      } else if (outcome === 'wild-defeated') {
        notice = settleBattleVictory(next, now, random)
      }
      break
    }
    case 'battle-continue': {
      if (next.battle === undefined) throw new TraceWildRuleError('conflict')
      const result = continueBattle(next.battle, random)
      animation = result.animation
      const { outcome } = result
      if (outcome === 'battle-lost') {
        logBattleDefeat(next, now, random)
        delete next.battle
        notice = 'battle-lost'
      } else if (outcome === 'wild-defeated') {
        notice = settleBattleVictory(next, now, random)
      }
      break
    }
    case 'capture':
      notice = attemptCapture(next, action.quality, now, random)
      break
    case 'claim-idle-reward': {
      const reward = next.idle.pendingReward
      if (reward === undefined) throw new TraceWildRuleError('invalid-action')
      if (reward.coreQuality !== undefined) next.cores[reward.coreQuality] += 1
      for (const quality of CAPTURE_CORE_QUALITIES) {
        const count = reward.materials[quality]
        next.materials[quality] += count
        next.stats.materialsEarned += count
      }
      next.idle = {
        lastSettlementAt: next.idle.lastSettlementAt,
        lastReward: structuredClone(reward),
      }
      logEntry(next, {
        at: now,
        kind: 'idle-reward',
        ...(reward.coreQuality === undefined ? {} : { quality: reward.coreQuality }),
      }, random)
      notice = 'idle-claimed'
      break
    }
    case 'flee':
      if (next.battle === undefined) throw new TraceWildRuleError('conflict')
      delete next.battle
      break
    case 'feed-material': {
      if (next.battle !== undefined || !Number.isSafeInteger(action.count) || action.count < 1 || action.count > 99) {
        throw new TraceWildRuleError('invalid-action')
      }
      const creature = next.creatures.find(row => row.instanceId === action.creatureInstanceId)
      if (creature === undefined || creature.level >= MAX_PLAYER_LEVEL || next.materials[action.quality] < action.count) {
        throw new TraceWildRuleError('invalid-action')
      }
      next.materials[action.quality] -= action.count
      creature.xp = Math.min(
        totalXpForLevel(MAX_PLAYER_LEVEL, creature.quality),
        creature.xp + MATERIAL_XP[action.quality] * action.count,
      )
      creature.level = levelForXp(creature.xp, creature.quality)
      notice = 'material-used'
      break
    }
    case 'set-squad': {
      if (action.instanceIds.length === 0 || action.instanceIds.length > 3) throw new TraceWildRuleError('invalid-action')
      const unique = [...new Set(action.instanceIds)]
      if (unique.length !== action.instanceIds.length
        || unique.some(id => !next.creatures.some(row => row.instanceId === id))) {
        throw new TraceWildRuleError('invalid-action')
      }
      next.squad = unique
      break
    }
  }
  // An active encounter is protected while its battle exists. Once the player
  // leaves or loses that battle, an elapsed encounter must not reappear behind
  // the modal for another action cycle.
  purgeExpiredEncounters(next, now)
  const state = commit(next, now)
  return {
    state,
    ...(notice === undefined ? {} : { notice }),
    ...(animation === undefined ? {} : { animation }),
  }
}

function record(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined
}

function safeInt(value: unknown, fallback: number, max = Number.MAX_SAFE_INTEGER): number {
  return Number.isSafeInteger(value) && (value as number) >= 0 ? Math.min(value as number, max) : fallback
}

function safeNumber(value: unknown, fallback: number, minimum: number, maximum: number): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(maximum, Math.max(minimum, value))
    : fallback
}

function isCoreQuality(value: unknown): value is CaptureCoreQuality {
  return typeof value === 'string' && CAPTURE_CORE_QUALITIES.includes(value as CaptureCoreQuality)
}

function restoreIdleReward(value: unknown, now: number): TraceWildIdleReward | undefined {
  const row = record(value)
  if (row === undefined) return undefined
  const settledAt = safeInt(row.settledAt, now + 1)
  const elapsedMinutes = safeInt(row.elapsedMinutes, 0, MAX_IDLE_ELAPSED_MS / 60_000)
  if (settledAt > now || elapsedMinutes < 60) return undefined
  const rawMaterials = record(row.materials)
  const materials = emptyCores()
  for (const quality of CAPTURE_CORE_QUALITIES) materials[quality] = safeInt(rawMaterials?.[quality], 0, 4)
  const materialCount = CAPTURE_CORE_QUALITIES.reduce((sum, quality) => sum + materials[quality], 0)
  if (materialCount > 4) return undefined
  const coreQuality = isCoreQuality(row.coreQuality) ? row.coreQuality : undefined
  if (coreQuality === undefined && materialCount === 0) return undefined
  return {
    settledAt,
    elapsedMinutes,
    ...(coreQuality === undefined ? {} : { coreQuality }),
    materials,
  }
}

function isEcology(value: unknown): value is TraceEcology {
  return typeof value === 'string' && TRACE_ECOLOGIES.includes(value as TraceEcology)
}

function isSpecial(value: unknown): value is TileSpecial {
  return value === 'none' || value === 'row' || value === 'column' || value === 'burst' || value === 'origin'
}

function restoreBoard(value: unknown): MatchTile[] | undefined {
  if (!Array.isArray(value) || value.length !== MATCH_BOARD_CELLS) return undefined
  const board: MatchTile[] = []
  for (const raw of value) {
    const row = record(raw)
    if (row === undefined || !isEcology(row.ecology) || !isSpecial(row.special)) return undefined
    const lockedActions = safeInt(row.lockedActions, 0, 2)
    board.push(lockedActions > 0
      ? { ecology: row.ecology, special: row.special, lockedActions }
      : { ecology: row.ecology, special: row.special })
  }
  return findFirstLegalBattleSwap(board) === undefined ? undefined : board
}

function restoreBattle(root: Record<string, unknown>, state: TraceWildState): BattleState | undefined {
  const raw = record(root.battle)
  if (raw === undefined) return undefined
  const mode = raw.mode === 'tower' ? 'tower' : 'wild'
  const encounterId = typeof raw.encounterId === 'string' ? raw.encounterId : ''
  const encounter = mode === 'wild' ? state.encounters.find(row => row.id === encounterId) : undefined
  const towerFloor = mode === 'tower' ? safeInt(raw.towerFloor, 0, MAX_TOWER_FLOOR) : 0
  if (mode === 'tower' && (towerFloor < 1 || towerFloor !== state.tower.highestClearedFloor + 1
    || encounterId !== `tower_${towerFloor}`)) return undefined
  const towerProfile = mode === 'tower' ? towerFloorProfile(towerFloor) : undefined
  const wild = creatureById(encounter?.creatureId ?? towerProfile?.creatureId ?? '')
  const board = restoreBoard(raw.board)
  if ((mode === 'wild' && encounter === undefined) || wild === undefined || board === undefined) return undefined
  const rawParty = Array.isArray(raw.party) ? raw.party : []
  if (rawParty.length < 1 || rawParty.length > 3) return undefined
  const party: BattlePartyMember[] = []
  for (const rawMember of rawParty) {
    const row = record(rawMember)
    const instanceId = typeof row?.instanceId === 'string' ? row.instanceId : ''
    const captured = state.creatures.find(item => item.instanceId === instanceId)
    if (row === undefined || captured === undefined || party.some(item => item.instanceId === instanceId)) return undefined
    const stats = levelStats(captured)
    party.push({
      instanceId,
      creatureId: captured.creatureId,
      quality: captured.quality,
      level: captured.level,
      hp: Math.min(stats.hp, safeInt(row.hp, stats.hp, stats.hp)),
      maxHp: stats.hp,
      shield: safeInt(row.shield, 0, stats.hp),
      energy: safeInt(row.energy, 0, ENERGY_LIMIT),
      skillUsedStage: row.skillUsedStage === true,
      passiveRound: safeInt(row.passiveRound, 0, 999999),
      passiveStage: safeInt(row.passiveStage, 0, 999999),
      passiveBattleUsed: row.passiveBattleUsed === true,
      reviveUsed: row.reviveUsed === true,
      counterPower: safeNumber(row.counterPower, 0, 0, 2),
      overcharge: safeInt(row.overcharge, 0, 5),
      stageDamage: safeInt(row.stageDamage, 0, 9_999_999),
      frozenStages: safeInt(row.frozenStages, 0, 1),
    })
  }
  const activeIndex = safeInt(raw.activeIndex, 0, party.length - 1)
  if (party[activeIndex]!.hp <= 0 || party.every(member => member.hp <= 0)) return undefined
  const id = typeof raw.id === 'string' && /^battle_[a-z0-9_]{8,64}$/.test(raw.id) ? raw.id : ''
  if (id === '') return undefined
  const enemyIntent = raw.enemyIntent
  if (enemyIntent !== 'strike' && enemyIntent !== 'guard' && enemyIntent !== 'disrupt'
    && enemyIntent !== 'corrupt' && enemyIntent !== 'mark' && enemyIntent !== 'sweep'
    && enemyIntent !== 'lock' && enemyIntent !== 'freeze') return undefined
  const partyAverageLevel = party.reduce((sum, member) => sum + member.level, 0) / party.length
  const battleLevel = encounter?.level ?? towerProfile!.level
  const battleQuality = encounter?.quality ?? towerProfile!.quality
  const fallbackWildStats = towerProfile === undefined
    ? wildStats(wild, battleLevel, battleQuality, party.length, partyAverageLevel)
    : towerBossStats(wild, towerProfile, party.length, partyAverageLevel)
  const wildMaxHp = towerProfile === undefined
    ? Math.max(1, safeInt(raw.wildMaxHp, fallbackWildStats.hp, 9_999_999))
    : fallbackWildStats.hp
  const enemyTargetScope = raw.enemyTargetScope
  if (enemyTargetScope !== 'single' && enemyTargetScope !== 'all' && enemyTargetScope !== 'self') return undefined
  const rawContributions = Array.isArray(raw.lastTeamContributions) ? raw.lastTeamContributions.slice(0, 3) : []
  const lastTeamContributions = rawContributions.flatMap(value => {
    const row = record(value)
    const instanceId = typeof row?.instanceId === 'string' ? row.instanceId : ''
    if (!party.some(member => member.instanceId === instanceId)) return []
    return [{ instanceId, amount: safeInt(row?.amount, 0, 9_999_999) }]
  })
  const captureWindow = mode === 'wild' && raw.captureWindow === true
  const actionsRemaining = safeInt(raw.actionsRemaining, BASE_ACTIONS_PER_CREATURE, MAX_ACTIONS_PER_CREATURE)
  const turnOwner = !captureWindow && raw.turnOwner === 'boss' ? 'boss' : 'player'
  return {
    id,
    encounterId,
    wildCreatureId: wild.id,
    mode,
    ...(towerProfile === undefined ? {} : { towerFloor: towerProfile.floor }),
    bossSkillTier: towerProfile?.skillTier
      ?? bossSkillTierForThreat(threatPoints(battleLevel, battleQuality)),
    board,
    party,
    turnOwner,
    activeIndex,
    actionsRemaining,
    bossActionsRemaining: turnOwner === 'boss'
      ? Math.max(1, safeInt(raw.bossActionsRemaining, BASE_BOSS_ACTIONS, MAX_BOSS_ACTIONS))
      : 0,
    bossActionsTaken: turnOwner === 'boss'
      ? safeInt(raw.bossActionsTaken, 0, MAX_BOSS_SWAPS_PER_PHASE - 1)
      : 0,
    bossEnergy: safeInt(raw.bossEnergy, 0, BOSS_SKILL_ENERGY_LIMIT),
    bossAttackCharge: safeNumber(raw.bossAttackCharge, 0, 0, 32),
    bossBonusActionsGranted: safeInt(raw.bossBonusActionsGranted, 0, MAX_BOSS_BONUS_ACTIONS),
    bossSkillArmed: raw.bossSkillArmed === true,
    lastBossAttack: safeInt(raw.lastBossAttack, 0, 9_999_999),
    lastBossMatch: safeInt(raw.lastBossMatch, 0, MATCH_BOARD_CELLS),
    stage: Math.max(1, safeInt(raw.stage, 1, 999999)),
    round: Math.max(1, safeInt(raw.round, 1, 999999)),
    wildHp: Math.max(1, safeInt(raw.wildHp, wildMaxHp, wildMaxHp)),
    wildMaxHp,
    wildArmor: safeInt(raw.wildArmor, encounter?.armor ?? towerProfile!.armor, 12),
    wildShield: safeInt(raw.wildShield, 0, wildMaxHp),
    wildDefense: towerProfile === undefined
      ? safeInt(raw.wildDefense, fallbackWildStats.defense, 999_999)
      : fallbackWildStats.defense,
    wildAttack: towerProfile === undefined
      ? safeInt(raw.wildAttack, fallbackWildStats.attack, 999_999)
      : fallbackWildStats.attack,
    wildLevel: battleLevel,
    wildQuality: battleQuality,
    enemyIntent,
    enemyTargetScope,
    ...(Number.isSafeInteger(raw.enemyTargetIndex) && (raw.enemyTargetIndex as number) >= 0
      && (raw.enemyTargetIndex as number) < party.length
      ? { enemyTargetIndex: raw.enemyTargetIndex as number }
      : {}),
    enemyMarks: safeInt(raw.enemyMarks, 0, 3),
    enemyBurn: safeNumber(raw.enemyBurn, 0, 0, 4.2),
    enemyDelayed: safeInt(raw.enemyDelayed, 0, 1),
    affinityFloorActions: safeInt(raw.affinityFloorActions, 0, 2),
    boardLockActions: safeInt(raw.boardLockActions, 0, 3),
    repeatPower: safeNumber(raw.repeatPower, 0, 0, 0.95),
    lastPlayerDamage: safeInt(raw.lastPlayerDamage, 0, 999999),
    pendingTeamDamage: safeInt(raw.pendingTeamDamage, 0, 9_999_999),
    lastTeamStrike: safeInt(raw.lastTeamStrike, 0, 9_999_999),
    lastTeamDamageApplied: safeInt(raw.lastTeamDamageApplied, 0, 9_999_999),
    lastTeamContributions,
    bonusActionsGranted: safeInt(raw.bonusActionsGranted, 0, MAX_BONUS_ACTIONS_PER_STAGE),
    captureWindow,
    captureAttempts: encounter?.captureAttempts ?? 0,
    enemyHardControlCooldown: safeInt(raw.enemyHardControlCooldown, 0, 3),
    enemyPhase: Math.max(1, safeInt(raw.enemyPhase, 1, 2)),
    turn: Math.max(1, safeInt(raw.turn, 1, 999999)),
    log: [{ turn: 0, kind: 'start', creatureId: wild.id, ecology: wild.ecology }],
  }
}

/** Tolerant, bounded loader with schema-v1/v2 migration. Invalid or future data starts a fresh profile. */
export function restoreTraceWildState(value: unknown, now = Date.now()): TraceWildState {
  const root = record(value)
  if (root?.schemaVersion !== 1 && root?.schemaVersion !== 2 && root?.schemaVersion !== 3) return createInitialTraceWildState(now)
  const next = createInitialTraceWildState(now)
  next.revision = safeInt(root.revision, 0)
  next.createdAt = safeInt(root.createdAt, now)
  next.updatedAt = safeInt(root.updatedAt, next.createdAt)
  const cores = record(root.cores)
  for (const quality of CAPTURE_CORE_QUALITIES) next.cores[quality] = safeInt(cores?.[quality], 0, 9999)
  const materials = record(root.materials)
  for (const quality of CAPTURE_CORE_QUALITIES) next.materials[quality] = safeInt(materials?.[quality], 0, 9999)

  const rawCreatures = Array.isArray(root.creatures) ? root.creatures.slice(0, MAX_CREATURES) : []
  const instanceIds = new Set<string>()
  for (const raw of rawCreatures) {
    const row = record(raw)
    if (row === undefined) continue
    const instanceId = typeof row.instanceId === 'string' ? row.instanceId : ''
    const creatureId = typeof row.creatureId === 'string' ? row.creatureId : ''
    const definition = creatureById(creatureId)
    if (!/^pet_[a-z0-9_]{8,64}$/.test(instanceId) || instanceIds.has(instanceId) || definition === undefined) continue
    instanceIds.add(instanceId)
    const savedLevel = Math.max(1, safeInt(row.level, 1, root.schemaVersion === 3 ? MAX_PLAYER_LEVEL : 30))
    const quality = isCoreQuality(row.quality) ? row.quality : 'prism'
    const levelFloorXp = totalXpForLevel(savedLevel, quality)
    const savedXp = root.schemaVersion === 3
      ? Math.max(levelFloorXp, safeInt(row.xp, levelFloorXp, totalXpForLevel(MAX_PLAYER_LEVEL, quality)))
      : levelFloorXp
    next.creatures.push({
      instanceId,
      creatureId,
      quality,
      level: levelForXp(savedXp, quality),
      xp: savedXp,
      wins: safeInt(row.wins, 0, 999999),
      caughtAt: safeInt(row.caughtAt, next.createdAt),
      firstSignal: definition.ecology,
    })
  }
  next.starterChosen = root.starterChosen === true && next.creatures.length > 0
  const rawSquad = Array.isArray(root.squad) ? root.squad : []
  next.squad = [...new Set(rawSquad.filter((id): id is string => typeof id === 'string' && instanceIds.has(id)))].slice(0, 3)
  if (next.squad.length === 0 && next.creatures[0] !== undefined) next.squad = [next.creatures[0].instanceId]
  const migratedParty = next.squad.map(id => next.creatures.find(creature => creature.instanceId === id))
    .filter((creature): creature is CapturedCreature => creature !== undefined)
  const migratedPartyLevel = effectivePartyLevel(migratedParty)

  const rawDex = Array.isArray(root.dex) ? root.dex.slice(0, 25) : []
  for (const raw of rawDex) {
    const row = record(raw)
    if (row === undefined) continue
    const creatureId = typeof row.creatureId === 'string' ? row.creatureId : ''
    if (creatureById(creatureId) === undefined || next.dex.some(item => item.creatureId === creatureId)) continue
    next.dex.push({
      creatureId,
      seen: Math.max(1, safeInt(row.seen, 1, 999999)),
      captured: safeInt(row.captured, 0, 999999),
      firstSeenAt: safeInt(row.firstSeenAt, next.createdAt),
      lastSeenAt: safeInt(row.lastSeenAt, next.updatedAt),
    })
  }
  for (const creature of next.creatures) {
    if (!next.dex.some(row => row.creatureId === creature.creatureId)) {
      next.dex.push({
        creatureId: creature.creatureId, seen: 1, captured: 1,
        firstSeenAt: creature.caughtAt, lastSeenAt: creature.caughtAt,
      })
    }
  }

  const rawEncounters = Array.isArray(root.encounters) ? root.encounters.slice(0, MAX_MAP_ENCOUNTERS) : []
  const persistedBattle = record(root.battle)
  const persistedActiveEncounterId = persistedBattle?.mode === 'tower' || typeof persistedBattle?.encounterId !== 'string'
    ? undefined
    : persistedBattle.encounterId
  const encounterIds = new Set<string>()
  for (const raw of rawEncounters) {
    const row = record(raw)
    if (row === undefined) continue
    const id = typeof row.id === 'string' ? row.id : ''
    const creatureId = typeof row.creatureId === 'string' ? row.creatureId : ''
    const definition = creatureById(creatureId)
    if (!/^wild_[a-z0-9_]{8,64}$/.test(id) || encounterIds.has(id) || definition === undefined) continue
    const spawnedAt = safeInt(row.spawnedAt, now)
    const quality = root.schemaVersion === 3 && isCoreQuality(row.quality) ? row.quality : 'pebble'
    const level = root.schemaVersion === 3
      ? Math.max(1, safeInt(row.level, migratedPartyLevel, MAX_PLAYER_LEVEL))
      : migratedPartyLevel
    const expiresAt = Math.min(Number.MAX_SAFE_INTEGER, spawnedAt + encounterLifetimeMs(quality, level))
    if (now >= expiresAt && id !== persistedActiveEncounterId) continue
    encounterIds.add(id)
    next.encounters.push({
      id,
      creatureId,
      ecology: definition.ecology,
      quality,
      level,
      captureAttempts: root.schemaVersion === 3 ? safeInt(row.captureAttempts, 0, MAX_CAPTURE_ATTEMPTS) : 0,
      spawnedAt,
      expiresAt,
      enhanced: row.enhanced === true,
      armor: safeInt(row.armor, row.enhanced === true ? 2 : 0, 2),
      mapX: Math.min(92, Math.max(8, safeInt(row.mapX, 50, 100))),
      mapY: Math.min(90, Math.max(10, safeInt(row.mapY, 50, 100))),
    })
  }
  const stats = record(root.stats)
  for (const key of Object.keys(next.stats) as (keyof typeof next.stats)[]) {
    next.stats[key] = safeInt(stats?.[key], 0, 999999999)
  }
  const rewardPity = record(root.rewardPity)
  next.rewardPity = {
    wildHighQualityMisses: safeInt(rewardPity?.wildHighQualityMisses, 0, 12),
    coreHighQualityMisses: safeInt(rewardPity?.coreHighQualityMisses, 0, 20),
  }
  const idle = record(root.idle)
  const lastSettlementAt = safeInt(idle?.lastSettlementAt, next.updatedAt)
  next.idle = { lastSettlementAt: Math.min(now, lastSettlementAt) }
  const pendingReward = restoreIdleReward(idle?.pendingReward, now)
  if (pendingReward !== undefined) next.idle.pendingReward = pendingReward
  const lastReward = restoreIdleReward(idle?.lastReward, now)
  if (lastReward !== undefined) next.idle.lastReward = lastReward
  const tower = record(root.tower)
  const highestClearedFloor = safeInt(tower?.highestClearedFloor, 0, MAX_TOWER_FLOOR)
  const clears = Math.max(highestClearedFloor, safeInt(tower?.clears, highestClearedFloor, 999_999_999))
  next.tower = {
    highestClearedFloor,
    clears,
    attempts: Math.max(clears, safeInt(tower?.attempts, clears, 999_999_999)),
  }
  const rawTowerReward = record(tower?.lastReward)
  const rewardFloor = safeInt(rawTowerReward?.floor, 0, highestClearedFloor)
  const rewardMaterials = record(rawTowerReward?.materials)
  const towerMaterials = emptyTowerMaterialReward()
  for (const quality of CAPTURE_CORE_QUALITIES) {
    towerMaterials[quality] = safeInt(rewardMaterials?.[quality], 0, 9)
  }
  const towerRewardCount = CAPTURE_CORE_QUALITIES.reduce((sum, quality) => sum + towerMaterials[quality], 0)
  const awardedAt = safeInt(rawTowerReward?.awardedAt, now + 1)
  if (rewardFloor > 0 && rewardFloor <= highestClearedFloor && towerRewardCount > 0 && towerRewardCount <= 9
    && awardedAt <= now) {
    next.tower.lastReward = { floor: rewardFloor, materials: towerMaterials, awardedAt }
  }
  next.processedSignals = Array.isArray(root.processedSignals)
    ? root.processedSignals.filter((id): id is string => typeof id === 'string' && /^[a-f0-9]{24}$/.test(id))
      .slice(-MAX_PROCESSED_SIGNALS)
    : []
  next.log = []
  if (root.schemaVersion === 3) {
    const restoredBattle = restoreBattle(root, next)
    if (restoredBattle !== undefined) next.battle = restoredBattle
  }
  // A persisted active battle may temporarily keep its elapsed encounter long
  // enough for strict battle validation. Invalid battles must not leave that
  // otherwise-expired encounter behind after migration.
  purgeExpiredEncounters(next, now)
  return next
}
