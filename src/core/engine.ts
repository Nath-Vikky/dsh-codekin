import {
  CAPTURE_CORE_QUALITIES,
  CORE_CAPTURE_MULTIPLIERS,
  CORE_DROP_WEIGHTS,
  STARTER_CREATURE_IDS,
  TRACE_ECOLOGIES,
  creatureById,
  creaturesInEcology,
} from './catalog.ts'
import {
  MATCH_BOARD_CELLS,
  createMatchBoard,
  convertRandomBattleTiles,
  findFirstLegalBattleSwap,
  hasBattleMatches,
  reshuffleBattleBoard,
  resolveBattleSwap,
  resolveExistingBattleMatches,
  resolveForcedTiles,
} from './match3.ts'
import { QUALITY_SKILL_MULTIPLIERS, skillByCreatureId } from './skills.ts'
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
  TraceWildState,
} from './types.ts'

const MAX_ENCOUNTERS = 12
const MAX_CREATURES = 240
const MAX_PROCESSED_SIGNALS = 256
const MAX_LOG_ENTRIES = 40
const MAX_BATTLE_LOG_ENTRIES = 14
const ENCOUNTER_LIFETIME_MS = 72 * 60 * 60 * 1000
const ACTIONS_PER_CREATURE = 3
const ENERGY_LIMIT = 12
const CAPTURE_HEALTH_RATIO = 0.30

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
    schemaVersion: 2,
    revision: 0,
    createdAt: now,
    updatedAt: now,
    starterChosen: false,
    cores: emptyCores(),
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
      currentSuccessStreak: 0,
      longestSuccessStreak: 0,
    },
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
  const activeEncounter = state.battle?.encounterId
  state.encounters = state.encounters.filter(encounter => (
    encounter.id === activeEncounter || now - encounter.spawnedAt <= ENCOUNTER_LIFETIME_MS
  ))
  if (activeEncounter !== undefined && !state.encounters.some(row => row.id === activeEncounter)) delete state.battle
}

export function applyTraceSignal(current: TraceWildState, signal: TraceSignal, random: RandomSource): TraceWildState {
  if (current.processedSignals.includes(signal.id)) return current
  const next = structuredClone(current)
  purgeExpiredEncounters(next, signal.at)
  next.processedSignals.push(signal.id)
  next.processedSignals = next.processedSignals.slice(-MAX_PROCESSED_SIGNALS)
  if (signal.outcome === 'completed') {
    next.stats.completedTurns += 1
    next.stats.currentSuccessStreak += 1
    next.stats.longestSuccessStreak = Math.max(next.stats.longestSuccessStreak, next.stats.currentSuccessStreak)
    const quality = chooseWeighted(CORE_DROP_WEIGHTS, random)
    next.cores[quality] += 1
    logEntry(next, { at: signal.at, kind: 'core-drop', quality, ecology: signal.ecology }, random)
  } else {
    next.stats.failedTurns += 1
    next.stats.currentSuccessStreak = 0
  }
  if (next.encounters.length < MAX_ENCOUNTERS) {
    const creatureId = pickCreature(signal, random)
    const point = mapPoint(signal.ecology, random)
    next.encounters.push({
      id: randomId('wild', signal.at, random),
      creatureId,
      ecology: signal.ecology,
      spawnedAt: signal.at,
      enhanced: signal.enhanced,
      armor: signal.enhanced ? 2 : 0,
      ...point,
    })
    updateDex(next, creatureId, signal.at, false)
    logEntry(next, { at: signal.at, kind: 'encounter', creatureId, ecology: signal.ecology }, random)
  }
  return commit(next, signal.at)
}

function levelStats(creature: CapturedCreature): CreatureStats {
  const definition = creatureById(creature.creatureId)
  if (definition === undefined) throw new TraceWildRuleError('conflict')
  const growth = Math.max(0, creature.level - 1)
  return {
    hp: definition.stats.hp + growth * 4,
    attack: definition.stats.attack + growth * 2,
    defense: definition.stats.defense + growth * 2,
    speed: definition.stats.speed + growth,
  }
}

function memberStats(member: BattlePartyMember): CreatureStats {
  const definition = creatureById(member.creatureId)
  if (definition === undefined) throw new TraceWildRuleError('conflict')
  const growth = Math.max(0, member.level - 1)
  return {
    hp: definition.stats.hp + growth * 4,
    attack: definition.stats.attack + growth * 2,
    defense: definition.stats.defense + growth * 2,
    speed: definition.stats.speed + growth,
  }
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

function applyWildDamage(battle: BattleState, rawAmount: number): number {
  let amount = Math.max(1, Math.round(rawAmount))
  if (battle.enemyMarks > 0) {
    amount = Math.round(amount * (1 + battle.enemyMarks * 0.1))
    battle.enemyMarks = 0
  }
  if (battle.wildArmor > 0) amount = Math.max(1, Math.round(amount * 0.35))
  const absorbed = Math.min(battle.wildShield, amount)
  battle.wildShield -= absorbed
  amount -= absorbed
  const before = battle.wildHp
  battle.wildHp = Math.max(1, battle.wildHp - amount)
  return absorbed + before - battle.wildHp
}

function applyRawHit(battle: BattleState, member: BattlePartyMember, power: number): number {
  const stats = memberStats(member)
  const defended = stats.attack * power * 100 / (100 + battle.wildDefense)
  return applyWildDamage(battle, defended)
}

function damageForStep(battle: BattleState, member: BattlePartyMember, counts: Readonly<Record<TraceEcology, number>>, chain: number): number {
  const wild = creatureById(battleEncounterCreatureId(battle))
  if (wild === undefined) throw new TraceWildRuleError('conflict')
  const stats = memberStats(member)
  const hasForktail = livingMembers(battle).some(row => row.creatureId === 'relay-forktail')
  const hasAtlas = livingMembers(battle).some(row => row.creatureId === 'lumen-atlashart')
  let combo = Math.min(1.6, 1 + 0.15 * (chain - 1) + (hasForktail ? 0.05 * (chain - 1) : 0))
  if (hasAtlas && chain === 1 && battle.party.some(row => row.creatureId === 'lumen-atlashart' && row.passiveRound !== battle.round)) {
    combo = Math.max(combo, 1.15)
  }
  let total = 0
  for (const ecology of TRACE_ECOLOGIES) {
    const count = counts[ecology]
    if (count <= 0) continue
    const element = battle.affinityFloorActions > 0 ? Math.max(1.2, affinity(ecology, wild.ecology)) : affinity(ecology, wild.ecology)
    total += stats.attack * (count / 3) * combo * element * 100 / (100 + battle.wildDefense)
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

function enemyIntentFor(ecology: TraceEcology): EnemyIntent {
  switch (ecology) {
    case 'lumen': return 'mark'
    case 'forge': return 'strike'
    case 'relay': return 'disrupt'
    case 'aegis': return 'guard'
    case 'glitch': return 'corrupt'
  }
}

function performEnemyAction(battle: BattleState, random: RandomSource): boolean {
  const wild = creatureById(battleEncounterCreatureId(battle))
  if (wild === undefined) throw new TraceWildRuleError('conflict')
  if (battle.enemyBurn > 0) {
    applyWildDamage(battle, battle.wildMaxHp * 0.025 * battle.enemyBurn)
    battle.enemyBurn = Math.max(0, battle.enemyBurn - 0.5)
  }
  maybeDelayForLagtoad(battle)
  if (battle.enemyDelayed > 0) {
    battle.enemyDelayed -= 1
    appendBattleLog(battle, { turn: battle.turn, kind: 'enemy-delay' })
  } else {
    const target = activeMember(battle)
    const targetDefinition = creatureById(target.creatureId)
    if (targetDefinition === undefined) throw new TraceWildRuleError('conflict')
    let power = battle.enemyIntent === 'strike' ? 1.15 : battle.enemyIntent === 'guard' ? 0.72 : 0.92
    if (battle.enemyIntent === 'guard') {
      battle.wildShield = Math.min(Math.round(battle.wildMaxHp * 0.4), battle.wildShield + Math.round(battle.wildMaxHp * 0.1))
      appendBattleLog(battle, { turn: battle.turn, kind: 'enemy-shield', amount: battle.wildShield })
    }
    if (battle.enemyIntent === 'mark') power *= 1.05
    const roll = wild.stats.attack * power * (0.88 + boundedRandom(random) * 0.24)
      * affinity(wild.ecology, targetDefinition.ecology) * 100 / (100 + memberStats(target).defense)
    const damage = damagePartyMember(target, roll)
    appendBattleLog(battle, { turn: battle.turn, kind: 'enemy', amount: damage, creatureId: target.creatureId })
    if (target.creatureId === 'forge-rivetclaw' && damage > 0) {
      target.counterPower = 0.8 * qualityMultiplier(target)
    }
    mutateBoardForEnemy(battle, wild.ecology, random)
    maybePreventDefeat(battle, target)
  }
  if (livingMembers(battle).length === 0) return true
  const next = nextLivingIndex(battle)
  if (next === undefined) return true
  battle.activeIndex = next.index
  if (next.wrapped) battle.round += 1
  battle.stage += 1
  battle.actionsRemaining = ACTIONS_PER_CREATURE
  battle.turn += 1
  battle.enemyIntent = enemyIntentFor(wild.ecology)
  applyStageEntryPassives(battle)
  return false
}

function startBattle(state: TraceWildState, encounterId: string, now: number, random: RandomSource): void {
  if (!state.starterChosen || state.battle !== undefined) throw new TraceWildRuleError('conflict')
  const encounter = state.encounters.find(row => row.id === encounterId)
  if (encounter === undefined) throw new TraceWildRuleError('invalid-action')
  const selected = state.squad.map(id => state.creatures.find(row => row.instanceId === id))
    .filter((row): row is CapturedCreature => row !== undefined).slice(0, 3)
  if (selected.length === 0) throw new TraceWildRuleError('conflict')
  const wild = creatureById(encounter.creatureId)
  if (wild === undefined) throw new TraceWildRuleError('conflict')
  const party: BattlePartyMember[] = selected.map((captured) => {
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
    }
  })
  const partyScale = 1.25 + Math.max(0, party.length - 1) * 0.34
  const enhancedScale = encounter.enhanced ? 1.22 : 1
  const wildMaxHp = Math.round(wild.stats.hp * partyScale * enhancedScale)
  const battle: BattleState = {
    id: randomId('battle', now, random),
    encounterId,
    wildCreatureId: wild.id,
    board: createMatchBoard(random),
    party,
    activeIndex: 0,
    actionsRemaining: ACTIONS_PER_CREATURE,
    stage: 1,
    round: 1,
    wildHp: wildMaxHp,
    wildMaxHp,
    wildArmor: encounter.armor,
    wildShield: 0,
    wildDefense: wild.stats.defense,
    enemyIntent: enemyIntentFor(wild.ecology),
    enemyMarks: 0,
    enemyBurn: 0,
    enemyDelayed: 0,
    affinityFloorActions: 0,
    boardLockActions: 0,
    repeatPower: 0,
    lastPlayerDamage: 0,
    turn: 1,
    log: [{ turn: 0, kind: 'start', creatureId: wild.id, ecology: wild.ecology }],
  }
  state.battle = battle
  applyStageEntryPassives(battle)
  state.stats.battlesStarted += 1
}

function performBattleSwap(
  state: TraceWildState,
  from: number,
  to: number,
  random: RandomSource,
): { defeated: boolean; animation: TraceWildBattleAnimation } {
  const battle = state.battle
  if (battle === undefined) throw new TraceWildRuleError('conflict')
  const resolution = resolveBattleSwap(battle.board, from, to, random)
  if (resolution === undefined) throw new TraceWildRuleError('invalid-action')
  const animation: TraceWildBattleAnimation = { kind: 'match', battleId: battle.id, frames: resolution.frames }
  applyResolution(battle, resolution, random, true)
  battle.actionsRemaining -= 1
  if (battle.affinityFloorActions > 0) battle.affinityFloorActions -= 1
  if (battle.boardLockActions > 0) battle.boardLockActions -= 1
  const defeated = battle.actionsRemaining === 0 && performEnemyAction(battle, random)
  return { defeated, animation }
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
  if (battle === undefined) throw new TraceWildRuleError('conflict')
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
  now: number,
  random: RandomSource,
): CapturedCreature {
  if (state.creatures.length >= MAX_CREATURES) throw new TraceWildRuleError('conflict')
  const captured: CapturedCreature = {
    instanceId: randomId('pet', now, random), creatureId, quality, level: 1, xp: 0, wins: 0, caughtAt: now,
    firstSignal: ecology,
  }
  state.creatures.push(captured)
  if (state.squad.length < 3) state.squad.push(captured.instanceId)
  updateDex(state, creatureId, now, true)
  return captured
}

function attemptCapture(
  state: TraceWildState,
  quality: CaptureCoreQuality,
  now: number,
  random: RandomSource,
): 'capture-success' | 'capture-failed' | 'battle-lost' {
  const battle = state.battle
  if (battle === undefined) throw new TraceWildRuleError('conflict')
  if (battle.wildArmor > 0 || battle.wildHp / battle.wildMaxHp > CAPTURE_HEALTH_RATIO) {
    throw new TraceWildRuleError('conflict')
  }
  if (state.cores[quality] <= 0) throw new TraceWildRuleError('invalid-action')
  const encounter = state.encounters.find(row => row.id === battle.encounterId)
  const wild = encounter === undefined ? undefined : creatureById(encounter.creatureId)
  if (encounter === undefined || wild === undefined) throw new TraceWildRuleError('conflict')
  state.cores[quality] -= 1
  const healthRatio = battle.wildHp / battle.wildMaxHp
  const healthFactor = 0.72 + (1 - healthRatio) * 1.28
  const enhancedPenalty = encounter.enhanced ? 0.82 : 1
  const chance = Math.min(0.98, wild.baseCaptureRate * CORE_CAPTURE_MULTIPLIERS[quality] * healthFactor * enhancedPenalty)
  if (boundedRandom(random) < chance) {
    addCapturedCreature(state, wild.id, encounter.ecology, quality, now, random)
    state.encounters = state.encounters.filter(row => row.id !== encounter.id)
    state.stats.successfulCaptures += 1
    const active = battle.party[battle.activeIndex]
    const player = active === undefined ? undefined : state.creatures.find(row => row.instanceId === active.instanceId)
    if (player !== undefined) {
      player.wins += 1
      player.xp += 1
      player.level = Math.min(30, 1 + Math.floor(player.xp / 3))
    }
    logEntry(state, { at: now, kind: 'capture', creatureId: wild.id, ecology: wild.ecology, quality }, random)
    delete state.battle
    return 'capture-success'
  }
  state.stats.failedCaptures += 1
  appendBattleLog(battle, { turn: battle.turn, kind: 'capture-failed' })
  const defeated = performEnemyAction(battle, random)
  if (!defeated) return 'capture-failed'
  logEntry(state, { at: now, kind: 'defeat', creatureId: wild.id, ecology: wild.ecology }, random)
  delete state.battle
  return 'battle-lost'
}

export function applyTraceWildAction(
  current: TraceWildState,
  action: TraceWildAction,
  random: RandomSource,
  now = Date.now(),
): {
  state: TraceWildState
  notice?: 'capture-success' | 'capture-failed' | 'battle-lost' | 'skill-cast'
  animation?: TraceWildBattleAnimation
} {
  const next = structuredClone(current)
  purgeExpiredEncounters(next, now)
  let notice: 'capture-success' | 'capture-failed' | 'battle-lost' | 'skill-cast' | undefined
  let animation: TraceWildBattleAnimation | undefined
  switch (action.type) {
    case 'choose-starter': {
      if (next.starterChosen || !STARTER_CREATURE_IDS.includes(action.creatureId as typeof STARTER_CREATURE_IDS[number])) {
        throw new TraceWildRuleError('conflict')
      }
      const definition = creatureById(action.creatureId)
      if (definition === undefined) throw new TraceWildRuleError('invalid-action')
      addCapturedCreature(next, definition.id, definition.ecology, 'prism', now, random)
      next.starterChosen = true
      next.cores.pebble += 2
      logEntry(next, { at: now, kind: 'starter', creatureId: definition.id, ecology: definition.ecology }, random)
      break
    }
    case 'start-battle':
      startBattle(next, action.encounterId, now, random)
      break
    case 'battle-swap': {
      const result = performBattleSwap(next, action.from, action.to, random)
      animation = result.animation
      if (result.defeated) {
        const encounter = next.encounters.find(row => row.id === next.battle?.encounterId)
        logEntry(next, {
          at: now,
          kind: 'defeat',
          ...(encounter === undefined ? {} : { creatureId: encounter.creatureId, ecology: encounter.ecology }),
        }, random)
        delete next.battle
        notice = 'battle-lost'
      }
      break
    }
    case 'battle-cast': {
      const battleId = next.battle?.id
      const frames = castActiveSkill(next, action.creatureInstanceId, random)
      if (battleId !== undefined && frames.length > 0) animation = { kind: 'match', battleId, frames }
      notice = 'skill-cast'
      break
    }
    case 'capture':
      notice = attemptCapture(next, action.quality, now, random)
      break
    case 'flee':
      if (next.battle === undefined) throw new TraceWildRuleError('conflict')
      delete next.battle
      break
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
    board.push({ ecology: row.ecology, special: row.special })
  }
  return findFirstLegalBattleSwap(board) === undefined ? undefined : board
}

function restoreBattle(root: Record<string, unknown>, state: TraceWildState): BattleState | undefined {
  const raw = record(root.battle)
  if (raw === undefined) return undefined
  const encounterId = typeof raw.encounterId === 'string' ? raw.encounterId : ''
  const encounter = state.encounters.find(row => row.id === encounterId)
  const wild = encounter === undefined ? undefined : creatureById(encounter.creatureId)
  const board = restoreBoard(raw.board)
  if (encounter === undefined || wild === undefined || board === undefined) return undefined
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
    })
  }
  const activeIndex = safeInt(raw.activeIndex, 0, party.length - 1)
  if (party[activeIndex]!.hp <= 0 || party.every(member => member.hp <= 0)) return undefined
  const id = typeof raw.id === 'string' && /^battle_[a-z0-9_]{8,64}$/.test(raw.id) ? raw.id : ''
  if (id === '') return undefined
  const enemyIntent = raw.enemyIntent
  if (enemyIntent !== 'strike' && enemyIntent !== 'guard' && enemyIntent !== 'disrupt'
    && enemyIntent !== 'corrupt' && enemyIntent !== 'mark') return undefined
  const wildMaxHp = Math.max(1, safeInt(raw.wildMaxHp, wild.stats.hp, 999999))
  return {
    id,
    encounterId,
    wildCreatureId: wild.id,
    board,
    party,
    activeIndex,
    actionsRemaining: Math.max(1, safeInt(raw.actionsRemaining, ACTIONS_PER_CREATURE, ACTIONS_PER_CREATURE)),
    stage: Math.max(1, safeInt(raw.stage, 1, 999999)),
    round: Math.max(1, safeInt(raw.round, 1, 999999)),
    wildHp: Math.max(1, safeInt(raw.wildHp, wildMaxHp, wildMaxHp)),
    wildMaxHp,
    wildArmor: safeInt(raw.wildArmor, encounter.armor, 12),
    wildShield: safeInt(raw.wildShield, 0, wildMaxHp),
    wildDefense: safeInt(raw.wildDefense, wild.stats.defense, 9999),
    enemyIntent,
    enemyMarks: safeInt(raw.enemyMarks, 0, 3),
    enemyBurn: safeNumber(raw.enemyBurn, 0, 0, 4.2),
    enemyDelayed: safeInt(raw.enemyDelayed, 0, 1),
    affinityFloorActions: safeInt(raw.affinityFloorActions, 0, 2),
    boardLockActions: safeInt(raw.boardLockActions, 0, 3),
    repeatPower: safeNumber(raw.repeatPower, 0, 0, 0.95),
    lastPlayerDamage: safeInt(raw.lastPlayerDamage, 0, 999999),
    turn: Math.max(1, safeInt(raw.turn, 1, 999999)),
    log: [{ turn: 0, kind: 'start', creatureId: wild.id, ecology: wild.ecology }],
  }
}

/** Tolerant, bounded loader with schema-v1 migration. Invalid or future data starts a fresh profile. */
export function restoreTraceWildState(value: unknown, now = Date.now()): TraceWildState {
  const root = record(value)
  if (root?.schemaVersion !== 1 && root?.schemaVersion !== 2) return createInitialTraceWildState(now)
  const next = createInitialTraceWildState(now)
  next.revision = safeInt(root.revision, 0)
  next.createdAt = safeInt(root.createdAt, now)
  next.updatedAt = safeInt(root.updatedAt, next.createdAt)
  const cores = record(root.cores)
  for (const quality of CAPTURE_CORE_QUALITIES) next.cores[quality] = safeInt(cores?.[quality], 0, 9999)

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
    next.creatures.push({
      instanceId,
      creatureId,
      quality: isCoreQuality(row.quality) ? row.quality : 'prism',
      level: Math.max(1, safeInt(row.level, 1, 30)),
      xp: safeInt(row.xp, 0, 999999),
      wins: safeInt(row.wins, 0, 999999),
      caughtAt: safeInt(row.caughtAt, next.createdAt),
      firstSignal: definition.ecology,
    })
  }
  next.starterChosen = root.starterChosen === true && next.creatures.length > 0
  const rawSquad = Array.isArray(root.squad) ? root.squad : []
  next.squad = [...new Set(rawSquad.filter((id): id is string => typeof id === 'string' && instanceIds.has(id)))].slice(0, 3)
  if (next.squad.length === 0 && next.creatures[0] !== undefined) next.squad = [next.creatures[0].instanceId]

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

  const rawEncounters = Array.isArray(root.encounters) ? root.encounters.slice(0, MAX_ENCOUNTERS) : []
  const encounterIds = new Set<string>()
  for (const raw of rawEncounters) {
    const row = record(raw)
    if (row === undefined) continue
    const id = typeof row.id === 'string' ? row.id : ''
    const creatureId = typeof row.creatureId === 'string' ? row.creatureId : ''
    const definition = creatureById(creatureId)
    if (!/^wild_[a-z0-9_]{8,64}$/.test(id) || encounterIds.has(id) || definition === undefined) continue
    const spawnedAt = safeInt(row.spawnedAt, now)
    if (now - spawnedAt > ENCOUNTER_LIFETIME_MS) continue
    encounterIds.add(id)
    next.encounters.push({
      id,
      creatureId,
      ecology: definition.ecology,
      spawnedAt,
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
  next.processedSignals = Array.isArray(root.processedSignals)
    ? root.processedSignals.filter((id): id is string => typeof id === 'string' && /^[a-f0-9]{24}$/.test(id))
      .slice(-MAX_PROCESSED_SIGNALS)
    : []
  next.log = []
  if (root.schemaVersion === 2) {
    const restoredBattle = restoreBattle(root, next)
    if (restoredBattle !== undefined) next.battle = restoredBattle
  }
  return next
}
