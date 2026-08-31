import {
  CAPTURE_CORE_QUALITIES,
  TRACE_ECOLOGIES,
} from '../../content-sdk/src/types.ts'
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
  MAX_PLAYER_LEVEL,
  captureChance,
  levelForXp,
  playerStats,
  qualityIndex,
  threatPoints,
  totalXpForLevel,
  wildStats,
} from './balance.ts'
import {
  MATCH_BOARD_SIZE,
  createMatchBoard,
  chooseBossBattleSwap,
  convertRandomBattleTiles,
  hasBattleMatches,
  reshuffleBattleBoard,
  resolveBattleSwap,
  resolveExistingBattleMatches,
  resolveForcedTiles,
} from './match3.ts'
import {
  QUALITY_SKILL_MULTIPLIERS,
  currentEngineContent,
} from './content.ts'
import {
  MAX_TOWER_FLOOR,
  emptyTowerMaterialReward,
  towerBossStats,
  towerFloorProfile,
} from './tower.ts'
import {
  ENERGY_LIMIT,
  MAX_AMPLIFIERS_PER_SIDE,
  MAX_CREATURES,
  appendBattleLog,
  boundedRandom,
  chooseWeighted,
  commit,
  logEntry,
  purgeExpiredEncounters,
  randomId,
  updateDex,
} from './state.ts'
import { settleTraceWildIdleRewards } from './world.ts'
import type {
  BattleAmplifier,
  BattlePartyMember,
  BattleState,
  CaptureCoreQuality,
  CapturedCreature,
  CreatureStats,
  EnemyIntent,
  MatchCascadeFrame,
  MatchDamageEffectiveness,
  MatchSignalEffect,
  MatchTile,
  RandomSource,
  TraceEcology,
  TraceWildAction,
  TraceWildBattleAnimation,
  TraceWildBattleRecovery,
  TraceWildBattleStrike,
  TraceWildState,
} from './types.ts'
import type {
  ContentMechanicBinding,
  ContentMechanicTrigger,
} from '../../content-sdk/src/types.ts'

const AMPLIFIER_DURATION_ROUNDS = 2

export { createInitialTraceWildState } from './state.ts'
export { applyTraceSignal, expireTraceWildEncounters, settleTraceWildIdleRewards } from './world.ts'
export { restoreTraceWildState } from './restore.ts'

const creatureById = (id: string) => currentEngineContent().creature(id)
const skillByCreatureId = (creatureId: string) => currentEngineContent().skill(creatureId)
const mechanicsByCreatureId = (creatureId: string) => currentEngineContent().creatureMechanics(creatureId)

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

type MechanicHandler<Context> = (binding: ContentMechanicBinding, context: Context) => void

function mechanicBindings(creatureId: string, trigger: ContentMechanicTrigger): readonly ContentMechanicBinding[] {
  return (mechanicsByCreatureId(creatureId)?.bindings ?? [])
    .map((binding, index) => ({ binding, index }))
    .filter(row => row.binding.trigger === trigger)
    .sort((left, right) => (left.binding.priority ?? 0) - (right.binding.priority ?? 0) || left.index - right.index)
    .map(row => row.binding)
}

function runMechanics<Context>(
  creatureId: string,
  trigger: ContentMechanicTrigger,
  handlers: Readonly<Record<string, MechanicHandler<Context>>>,
  context: Context,
): void {
  for (const binding of mechanicBindings(creatureId, trigger)) {
    const handler = handlers[binding.opcode]
    if (handler === undefined) throw new TraceWildRuleError('conflict')
    handler(binding, context)
  }
}

function mechanicNumber(binding: ContentMechanicBinding, key: string): number {
  const value = binding.params?.[key]
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new TraceWildRuleError('conflict')
  return value
}

function mechanicString(binding: ContentMechanicBinding, key: string): string {
  const value = binding.params?.[key]
  if (typeof value !== 'string') throw new TraceWildRuleError('conflict')
  return value
}

function mechanicBoolean(binding: ContentMechanicBinding, key: string, fallback = false): boolean {
  const value = binding.params?.[key]
  if (value === undefined) return fallback
  if (typeof value !== 'boolean') throw new TraceWildRuleError('conflict')
  return value
}

function mechanicEcology(binding: ContentMechanicBinding, key = 'ecology'): TraceEcology {
  const value = mechanicString(binding, key)
  if (!TRACE_ECOLOGIES.includes(value as TraceEcology)) throw new TraceWildRuleError('conflict')
  return value as TraceEcology
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
  if (member === undefined || battle.partyHp <= 0) throw new TraceWildRuleError('conflict')
  return member
}

function livingMembers(battle: BattleState): BattlePartyMember[] {
  return battle.partyHp > 0 ? battle.party : []
}

function qualityMultiplier(member: BattlePartyMember): number {
  return QUALITY_SKILL_MULTIPLIERS[member.quality]
}

function playerOffenseLevelFactor(member: BattlePartyMember, battle: BattleState): number {
  const levelDelta = member.level - battle.wildLevel
  return Math.min(1.16, Math.max(0.55, Math.pow(2, levelDelta / 50)))
}

function playerDefenseFactor(defense: number): number {
  return 1_400 / (1_400 + Math.max(0, defense) * 2.4)
}

function syncLegacyPartyHealth(battle: BattleState): void {
  const ratio = battle.partyMaxHp <= 0 ? 0 : battle.partyHp / battle.partyMaxHp
  for (const member of battle.party) {
    member.hp = battle.partyHp <= 0 ? 0 : Math.max(1, Math.min(member.maxHp, Math.round(member.maxHp * ratio)))
    member.shield = 0
  }
}

function healParty(battle: BattleState, amount: number): number {
  const before = battle.partyHp
  battle.partyHp = Math.min(battle.partyMaxHp, battle.partyHp + Math.max(0, Math.round(amount)))
  syncLegacyPartyHealth(battle)
  return battle.partyHp - before
}

function shieldParty(battle: BattleState, amount: number): number {
  const limit = Math.round(battle.partyMaxHp * 0.6)
  const before = battle.partyShield
  battle.partyShield = Math.min(limit, battle.partyShield + Math.max(0, Math.round(amount)))
  return battle.partyShield - before
}

function queuePartyHealing(battle: BattleState, amount: number): number {
  const available = Math.max(0, battle.partyMaxHp - battle.partyHp - battle.pendingPartyHealing)
  const queued = Math.min(available, Math.max(0, Math.round(amount)))
  battle.pendingPartyHealing += queued
  return queued
}

function queuePartyShielding(battle: BattleState, amount: number): number {
  const limit = Math.round(battle.partyMaxHp * 0.6)
  const available = Math.max(0, limit - battle.partyShield - battle.pendingPartyShielding)
  const queued = Math.min(available, Math.max(0, Math.round(amount)))
  battle.pendingPartyShielding += queued
  return queued
}

function healWild(battle: BattleState, amount: number): number {
  const before = battle.wildHp
  battle.wildHp = Math.min(battle.wildMaxHp, battle.wildHp + Math.max(0, Math.round(amount)))
  return battle.wildHp - before
}

function shieldWild(battle: BattleState, amount: number): number {
  const limit = Math.round(battle.wildMaxHp * 0.4)
  const before = battle.wildShield
  battle.wildShield = Math.min(limit, battle.wildShield + Math.max(0, Math.round(amount)))
  return battle.wildShield - before
}

function queueWildHealing(battle: BattleState, amount: number): number {
  const available = Math.max(0, battle.wildMaxHp - battle.wildHp - battle.pendingWildHealing)
  const queued = Math.min(available, Math.max(0, Math.round(amount)))
  battle.pendingWildHealing += queued
  return queued
}

function queueWildShielding(battle: BattleState, amount: number): number {
  const limit = Math.round(battle.wildMaxHp * 0.4)
  const available = Math.max(0, limit - battle.wildShield - battle.pendingWildShielding)
  const queued = Math.min(available, Math.max(0, Math.round(amount)))
  battle.pendingWildShielding += queued
  return queued
}

function settlePartyRecovery(battle: BattleState): TraceWildBattleRecovery | undefined {
  const targetHpBefore = battle.partyHp
  const targetShieldBefore = battle.partyShield
  const healing = healParty(battle, battle.pendingPartyHealing)
  const shielding = shieldParty(battle, battle.pendingPartyShielding)
  battle.pendingPartyHealing = 0
  battle.pendingPartyShielding = 0
  if (healing > 0) appendBattleLog(battle, { turn: battle.turn, kind: 'heal', amount: healing })
  if (shielding > 0) appendBattleLog(battle, { turn: battle.turn, kind: 'shield', amount: shielding })
  if (healing <= 0 && shielding <= 0) return undefined
  return {
    actor: 'player', healing, shielding,
    targetHpBefore, targetHpAfter: battle.partyHp, targetMaxHp: battle.partyMaxHp,
    targetShieldBefore, targetShieldAfter: battle.partyShield,
  }
}

function settleWildRecovery(battle: BattleState): TraceWildBattleRecovery | undefined {
  const targetHpBefore = battle.wildHp
  const targetShieldBefore = battle.wildShield
  const healing = healWild(battle, battle.pendingWildHealing)
  const shielding = shieldWild(battle, battle.pendingWildShielding)
  battle.pendingWildHealing = 0
  battle.pendingWildShielding = 0
  if (shielding > 0) appendBattleLog(battle, { turn: battle.turn, kind: 'enemy-shield', amount: battle.wildShield })
  if (healing <= 0 && shielding <= 0) return undefined
  return {
    actor: 'boss', healing, shielding,
    targetHpBefore, targetHpAfter: battle.wildHp, targetMaxHp: battle.wildMaxHp,
    targetShieldBefore, targetShieldAfter: battle.wildShield,
  }
}

function sameAmplifier(left: BattleAmplifier, right: BattleAmplifier): boolean {
  return left.signal === right.signal && left.stat === right.stat && left.scope === right.scope
    && left.targetInstanceId === right.targetInstanceId
}

function upsertAmplifier(target: BattleAmplifier[], next: BattleAmplifier): void {
  const current = target.find(value => sameAmplifier(value, next))
  if (current !== undefined) {
    current.valuePermille = Math.max(current.valuePermille, next.valuePermille)
    current.remainingRounds = Math.max(current.remainingRounds, next.remainingRounds)
    current.ecology = next.ecology
    return
  }
  if (target.length >= MAX_AMPLIFIERS_PER_SIDE) target.shift()
  target.push(next)
}

function activatePlayerAmplifier(battle: BattleState, effect: MatchSignalEffect): void {
  const member = activeMember(battle)
  if (effect.kind === 'sync') {
    upsertAmplifier(battle.partyAmplifiers, {
      signal: 'sync', ecology: effect.ecology, stat: 'attack', scope: 'team',
      valuePermille: 30, remainingRounds: AMPLIFIER_DURATION_ROUNDS,
    })
  } else if (effect.kind === 'overclock') {
    upsertAmplifier(battle.partyAmplifiers, {
      signal: 'overclock', ecology: effect.ecology, stat: 'attack', scope: 'member',
      valuePermille: 50, remainingRounds: AMPLIFIER_DURATION_ROUNDS,
      targetInstanceId: member.instanceId,
    })
  } else if (effect.kind === 'breach') {
    upsertAmplifier(battle.partyAmplifiers, {
      signal: 'breach', ecology: effect.ecology, stat: 'penetration', scope: 'opponent',
      valuePermille: 40, remainingRounds: AMPLIFIER_DURATION_ROUNDS,
    })
  }
}

function activateBossAmplifier(battle: BattleState, effect: MatchSignalEffect): void {
  if (effect.kind === 'sync') {
    upsertAmplifier(battle.bossAmplifiers, {
      signal: 'sync', ecology: effect.ecology, stat: 'attack', scope: 'self',
      valuePermille: 80, remainingRounds: AMPLIFIER_DURATION_ROUNDS,
    })
  } else if (effect.kind === 'overclock') {
    upsertAmplifier(battle.bossAmplifiers, {
      signal: 'overclock', ecology: effect.ecology, stat: 'attack', scope: 'self',
      valuePermille: 110, remainingRounds: AMPLIFIER_DURATION_ROUNDS,
    })
  } else if (effect.kind === 'breach') {
    upsertAmplifier(battle.bossAmplifiers, {
      signal: 'breach', ecology: effect.ecology, stat: 'penetration', scope: 'opponent',
      valuePermille: 90, remainingRounds: AMPLIFIER_DURATION_ROUNDS,
    })
  }
}

function playerAttackAmplifier(battle: BattleState, member: BattlePartyMember): number {
  return battle.partyAmplifiers.reduce((sum, value) => (
    value.stat === 'attack' && (value.scope === 'team'
      || value.scope === 'member' && value.targetInstanceId === member.instanceId)
      ? sum + value.valuePermille
      : sum
  ), 0)
}

function playerPenetrationAmplifier(battle: BattleState): number {
  return battle.partyAmplifiers.reduce((sum, value) => (
    value.stat === 'penetration' && value.scope === 'opponent' ? sum + value.valuePermille : sum
  ), 0)
}

function bossAttackAmplifier(battle: BattleState): number {
  return battle.bossAmplifiers.reduce((sum, value) => (
    value.stat === 'attack' && value.scope === 'self' ? sum + value.valuePermille : sum
  ), 0)
}

function bossPenetrationAmplifier(battle: BattleState): number {
  return battle.bossAmplifiers.reduce((sum, value) => (
    value.stat === 'penetration' && value.scope === 'opponent' ? sum + value.valuePermille : sum
  ), 0)
}

function ageAmplifiers(battle: BattleState): void {
  const age = (values: BattleAmplifier[]): BattleAmplifier[] => values
    .map(value => ({ ...value, remainingRounds: value.remainingRounds - 1 }))
    .filter(value => value.remainingRounds > 0)
  battle.partyAmplifiers = age(battle.partyAmplifiers)
  battle.bossAmplifiers = age(battle.bossAmplifiers)
}

function damageParty(battle: BattleState, amountValue: number): number {
  let amount = Math.max(1, Math.round(amountValue))
  const absorbed = Math.min(battle.partyShield, amount)
  battle.partyShield -= absorbed
  amount -= absorbed
  const before = battle.partyHp
  battle.partyHp = Math.max(0, battle.partyHp - amount)
  syncLegacyPartyHealth(battle)
  return absorbed + before - battle.partyHp
}

interface EnergyOverflowMechanicContext {
  member: BattlePartyMember
  overflow: number
}

const ENERGY_OVERFLOW_HANDLERS: Readonly<Record<string, MechanicHandler<EnergyOverflowMechanicContext>>> = {
  'energy.store-overflow': (binding, { member, overflow }) => {
    member.overcharge = Math.min(mechanicNumber(binding, 'maximum'), member.overcharge + overflow)
  },
}

function grantEnergy(member: BattlePartyMember, amount: number): void {
  const whole = Math.max(0, Math.floor(amount))
  const available = Math.max(0, ENERGY_LIMIT - member.energy)
  member.energy += Math.min(available, whole)
  const overflow = whole - available
  if (overflow > 0) runMechanics(
    member.creatureId,
    'energy:overflow',
    ENERGY_OVERFLOW_HANDLERS,
    { member, overflow },
  )
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
  const defended = stats.attack * power * playerOffenseLevelFactor(member, battle)
    * playerDefenseFactor(battle.wildDefense)
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

interface MatchStepDamage {
  total: number
  effectiveness: MatchDamageEffectiveness
  signalEffect?: MatchSignalEffect
}

interface DamageModifierMechanicContext {
  battle: BattleState
  owner: BattlePartyMember
  acting: BattlePartyMember
  chain: number
  combo: number
  multiplier: number
  appliedAuras: Set<string>
}

const DAMAGE_MODIFIER_HANDLERS: Readonly<Record<string, MechanicHandler<DamageModifierMechanicContext>>> = {
  'damage.combo-per-cascade': (binding, context) => {
    if (context.appliedAuras.has(binding.opcode)) return
    context.appliedAuras.add(binding.opcode)
    context.combo += mechanicNumber(binding, 'amount') * Math.max(0, context.chain - 1)
  },
  'damage.first-match-floor': (binding, context) => {
    if (context.appliedAuras.has(binding.opcode)) return
    if (context.chain !== mechanicNumber(binding, 'chain') || context.owner.passiveRound === context.battle.round) return
    context.appliedAuras.add(binding.opcode)
    context.combo = Math.max(context.combo, mechanicNumber(binding, 'minimum'))
  },
  'damage.low-runtime-multiplier': (binding, context) => {
    if (context.owner.instanceId !== context.acting.instanceId) return
    if (context.battle.partyHp < context.battle.partyMaxHp * mechanicNumber(binding, 'belowRatio')) {
      context.multiplier *= mechanicNumber(binding, 'multiplier')
    }
  },
  'damage.round-parity-multiplier': (binding, context) => {
    if (context.owner.instanceId !== context.acting.instanceId) return
    const parity = mechanicString(binding, 'parity')
    const matches = parity === 'odd' ? context.battle.round % 2 === 1 : context.battle.round % 2 === 0
    if (matches) context.multiplier *= mechanicNumber(binding, 'multiplier')
  },
}

function damageForStep(
  battle: BattleState,
  member: BattlePartyMember,
  counts: Readonly<Record<TraceEcology, number>>,
  chain: number,
): MatchStepDamage {
  const wild = creatureById(battleEncounterCreatureId(battle))
  if (wild === undefined) throw new TraceWildRuleError('conflict')
  const stats = memberStats(member)
  const activeEcology = creatureById(member.creatureId)?.ecology
  if (activeEcology === undefined) throw new TraceWildRuleError('conflict')
  const attackMultiplier = 1 + Math.min(500, playerAttackAmplifier(battle, member)) / 1_000
  const penetratedDefense = battle.wildDefense
    * (1 - Math.min(500, playerPenetrationAmplifier(battle)) / 1_000)
  const modifierContext: DamageModifierMechanicContext = {
    battle,
    owner: member,
    acting: member,
    chain,
    combo: 1 + 0.25 * (chain - 1),
    multiplier: 1,
    appliedAuras: new Set(),
  }
  for (const owner of livingMembers(battle)) {
    modifierContext.owner = owner
    runMechanics(owner.creatureId, 'damage:modify', DAMAGE_MODIFIER_HANDLERS, modifierContext)
  }
  const combo = Math.min(2.25, modifierContext.combo)
  let total = 0
  let signalEffect: MatchSignalEffect | undefined
  const effectivenessDamage: Record<MatchDamageEffectiveness, number> = { advantage: 0, neutral: 0, resisted: 0 }
  for (const ecology of TRACE_ECOLOGIES) {
    const count = counts[ecology]
    if (count <= 0) continue
    const element = battle.affinityFloorActions > 0 ? Math.max(1.2, affinity(ecology, wild.ecology)) : affinity(ecology, wild.ecology)
    const baseContribution = stats.attack * (count / 3) * combo * element * attackMultiplier
      * playerOffenseLevelFactor(member, battle) * playerDefenseFactor(penetratedDefense)
    let contribution = baseContribution
    if (ecology === activeEcology) {
      if (ecology === 'aegis') {
        contribution = 0
        signalEffect = {
          kind: 'repair', ecology,
          amount: Math.min(
            Math.round(battle.partyMaxHp * 0.045),
            Math.max(1, Math.round(stats.defense * (count / 3) * combo * (0.26 + Math.max(0, count - 3) * 0.02))),
          ),
        }
      } else if (ecology === 'relay') {
        contribution = 0
        signalEffect = {
          kind: 'guard', ecology,
          amount: Math.min(
            Math.round(battle.partyMaxHp * 0.045),
            Math.max(1, Math.round(stats.speed * (count / 3) * combo * (0.28 + Math.max(0, count - 3) * 0.02))),
          ),
        }
      } else if (ecology === 'lumen') {
        contribution *= 1.18
        signalEffect = { kind: 'sync', ecology, amount: Math.max(1, Math.round(contribution - baseContribution)) }
      } else if (ecology === 'forge') {
        contribution *= Math.min(1.32, 1.12 + Math.max(0, count - 3) * 0.035 + Math.max(0, chain - 1) * 0.025)
        signalEffect = { kind: 'overclock', ecology, amount: Math.max(1, Math.round(contribution - baseContribution)) }
      } else {
        contribution = stats.attack * (count / 3) * combo * element * attackMultiplier
          * playerOffenseLevelFactor(member, battle) * playerDefenseFactor(penetratedDefense * 0.4) * 1.03
        signalEffect = { kind: 'breach', ecology, amount: Math.max(1, Math.round(contribution - baseContribution)) }
      }
    }
    total += contribution
    if (contribution <= 0) continue
    const effectiveness: MatchDamageEffectiveness = element > 1 ? 'advantage' : element < 1 ? 'resisted' : 'neutral'
    effectivenessDamage[effectiveness] += contribution
  }
  total *= modifierContext.multiplier
  const effectiveness = total <= 0
    ? 'neutral'
    : (Object.entries(effectivenessDamage) as [MatchDamageEffectiveness, number][])
        .sort((left, right) => right[1] - left[1]
          || ['advantage', 'neutral', 'resisted'].indexOf(left[0]) - ['advantage', 'neutral', 'resisted'].indexOf(right[0]))[0]?.[0]
      ?? 'neutral'
  return {
    total: Math.max(0, Math.round(total)), effectiveness,
    ...(signalEffect === undefined ? {} : { signalEffect }),
  }
}

function applyPlayerSignalEffect(battle: BattleState, effect: MatchSignalEffect): MatchSignalEffect {
  if (effect.kind === 'repair') {
    return { ...effect, amount: queuePartyHealing(battle, effect.amount) }
  }
  if (effect.kind === 'guard') {
    return { ...effect, amount: queuePartyShielding(battle, effect.amount) }
  }
  activatePlayerAmplifier(battle, effect)
  return effect
}

function battleEncounterCreatureId(battle: BattleState): string {
  return battle.wildCreatureId
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
    if (current.special !== 'none' || (current.hazardActions ?? 0) > 0 || current.ecology === ecology) continue
    board[index] = { ecology, special: 'none' }
    if (!hasBattleMatches(board)) return board
    board[index] = current
  }
  return board
}

function createGuaranteedMatch(boardValue: readonly MatchTile[], ecology: TraceEcology): MatchTile[] {
  const board = boardValue.map(current => ({ ...current }))
  for (let row = 0; row < MATCH_BOARD_SIZE; row += 1) {
    for (let column = 0; column <= MATCH_BOARD_SIZE - 3; column += 1) {
      const start = row * MATCH_BOARD_SIZE + column
      const indexes = [start, start + 1, start + 2]
      if (indexes.every(index => board[index]!.special === 'none' && (board[index]!.hazardActions ?? 0) === 0)) {
        for (const index of indexes) board[index] = { ecology, special: 'none' }
        return board
      }
    }
  }
  return board
}

interface MatchMechanicContext {
  battle: BattleState
  member: BattlePartyMember
  active: BattlePartyMember
  counts: Readonly<Record<TraceEcology, number>>
  chain: number
  specialCount: number
  stepDamage: number
  colors: number
  scale: number
  random: RandomSource
  bonusDamage: number
}

function mechanicScopeUsed(
  binding: ContentMechanicBinding,
  member: BattlePartyMember,
  battle: BattleState,
): boolean {
  const scope = binding.params?.once
  if (scope === undefined) return false
  if (scope === 'round') return member.passiveRound === battle.round
  if (scope === 'stage') return member.passiveStage === battle.stage
  throw new TraceWildRuleError('conflict')
}

function consumeMechanicScope(
  binding: ContentMechanicBinding,
  member: BattlePartyMember,
  battle: BattleState,
): void {
  const scope = binding.params?.once
  if (scope === undefined) return
  if (scope === 'round') member.passiveRound = battle.round
  else if (scope === 'stage') member.passiveStage = battle.stage
  else throw new TraceWildRuleError('conflict')
}

function mechanicHpBasis(binding: ContentMechanicBinding, context: MatchMechanicContext): number {
  switch (mechanicString(binding, 'basis')) {
    case 'member-max-hp': return context.member.maxHp
    case 'active-max-hp': return context.active.maxHp
    case 'party-max-hp': return context.battle.partyMaxHp
    default: throw new TraceWildRuleError('conflict')
  }
}

const MATCH_MECHANIC_HANDLERS: Readonly<Record<string, MechanicHandler<MatchMechanicContext>>> = {
  'match.add-mark': (binding, context) => {
    const ecology = mechanicEcology(binding)
    if (context.counts[ecology] < mechanicNumber(binding, 'minCount')
      || mechanicScopeUsed(binding, context.member, context.battle)) return
    context.battle.enemyMarks = Math.min(
      mechanicNumber(binding, 'maximum'),
      context.battle.enemyMarks + mechanicNumber(binding, 'amount'),
    )
    consumeMechanicScope(binding, context.member, context.battle)
  },
  'match.heal': (binding, context) => {
    const ecology = mechanicEcology(binding)
    if (context.counts[ecology] < mechanicNumber(binding, 'minCount')
      || mechanicScopeUsed(binding, context.member, context.battle)) return
    queuePartyHealing(context.battle, mechanicHpBasis(binding, context) * mechanicNumber(binding, 'ratio') * context.scale)
    consumeMechanicScope(binding, context.member, context.battle)
  },
  'match.grant-energy-on-cascade': (binding, context) => {
    if (context.chain < mechanicNumber(binding, 'minChain')
      || mechanicScopeUsed(binding, context.member, context.battle)) return
    grantEnergy(context.member, mechanicNumber(binding, 'amount'))
    consumeMechanicScope(binding, context.member, context.battle)
  },
  'match.echo-damage': (binding, context) => {
    if (context.chain < mechanicNumber(binding, 'minChain')
      || mechanicScopeUsed(binding, context.member, context.battle)) return
    context.bonusDamage += applyWildDamage(
      context.battle,
      context.stepDamage * mechanicNumber(binding, 'factor') * context.scale,
    )
    consumeMechanicScope(binding, context.member, context.battle)
  },
  'match.consume-first-match': (binding, context) => {
    if (context.chain !== mechanicNumber(binding, 'chain')) return
    consumeMechanicScope(binding, context.member, context.battle)
  },
  'match.raw-hit': (binding, context) => {
    const ecology = mechanicEcology(binding)
    if (context.counts[ecology] < mechanicNumber(binding, 'minCount')) return
    context.bonusDamage += applyRawHit(
      context.battle,
      context.member,
      mechanicNumber(binding, 'power') * context.scale,
    )
  },
  'match.consume-counter': (binding, context) => {
    const ecology = mechanicEcology(binding)
    if (context.counts[ecology] <= 0 || context.member.counterPower <= 0) return
    context.bonusDamage += applyRawHit(context.battle, context.member, context.member.counterPower)
    context.member.counterPower = 0
  },
  'match.add-burn-mixed': (binding, context) => {
    const ecology = mechanicEcology(binding)
    if (context.counts[ecology] <= 0 || context.colors <= 1) return
    context.battle.enemyBurn = Math.min(
      mechanicNumber(binding, 'maximum'),
      context.battle.enemyBurn + context.scale,
    )
  },
  'match.break-armor': (binding, context) => {
    const ecology = mechanicEcology(binding)
    if (context.counts[ecology] >= mechanicNumber(binding, 'minCount') && context.battle.wildArmor > 0) {
      context.battle.wildArmor = Math.max(0, context.battle.wildArmor - mechanicNumber(binding, 'amount'))
    }
  },
  'match.add-burn-cascade': (binding, context) => {
    const ecology = mechanicEcology(binding)
    if (context.counts[ecology] <= 0 || context.chain < mechanicNumber(binding, 'minChain')) return
    context.battle.enemyBurn = Math.min(
      mechanicNumber(binding, 'maximum'),
      context.battle.enemyBurn + mechanicNumber(binding, 'amount') * context.scale,
    )
  },
  'match.grant-energy-round-parity': (binding, context) => {
    const ecology = mechanicEcology(binding)
    const parity = mechanicString(binding, 'parity')
    const matches = parity === 'odd' ? context.battle.round % 2 === 1 : context.battle.round % 2 === 0
    if (context.counts[ecology] > 0 && matches) grantEnergy(context.member, mechanicNumber(binding, 'amount'))
  },
  'match.convert-one': (binding, context) => {
    const ecology = mechanicEcology(binding)
    const minimumCount = binding.params?.minCount
    const minimumChain = binding.params?.minChain
    if (minimumCount !== undefined && (typeof minimumCount !== 'number' || context.counts[ecology] < minimumCount)) return
    if (minimumChain !== undefined && (typeof minimumChain !== 'number' || context.chain < minimumChain)) return
    if (minimumCount === undefined && minimumChain === undefined) throw new TraceWildRuleError('conflict')
    if (mechanicScopeUsed(binding, context.member, context.battle)) return
    context.battle.board = convertOnePassiveTile(context.battle.board, ecology, context.random)
    consumeMechanicScope(binding, context.member, context.battle)
  },
  'match.shield-on-special': (binding, context) => {
    if (context.specialCount <= 0) return
    queuePartyShielding(context.battle, mechanicHpBasis(binding, context) * mechanicNumber(binding, 'ratio') * context.scale)
  },
  'match.shield-on-resisted': (binding, context) => {
    const wild = creatureById(battleEncounterCreatureId(context.battle))
    if (wild === undefined || context.counts[ECOLOGY_ADVANTAGE[wild.ecology]] <= 0) return
    queuePartyShielding(context.battle, context.stepDamage * mechanicNumber(binding, 'ratio') * context.scale)
  },
  'match.erode-protection': (binding, context) => {
    const ecology = mechanicEcology(binding)
    if (context.counts[ecology] <= 0) return
    if (context.battle.wildArmor > 0) {
      context.battle.wildArmor = Math.max(0, context.battle.wildArmor - mechanicNumber(binding, 'armor'))
    } else {
      context.battle.wildShield = Math.max(
        0,
        context.battle.wildShield - Math.round(
          memberStats(context.member).attack * mechanicNumber(binding, 'shieldAttackRatio') * context.scale,
        ),
      )
    }
  },
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
  const active = activeMember(battle)
  const context: MatchMechanicContext = {
    battle,
    member: active,
    active,
    counts,
    chain,
    specialCount,
    stepDamage,
    colors: TRACE_ECOLOGIES.filter(ecology => counts[ecology] > 0).length,
    scale: 1,
    random,
    bonusDamage: 0,
  }
  for (const member of livingMembers(battle)) {
    context.member = member
    context.scale = qualityMultiplier(member)
    runMechanics(member.creatureId, 'match:after', MATCH_MECHANIC_HANDLERS, context)
  }
  if (maxGroup >= 5 && battle.wildArmor > 0) appendBattleLog(battle, { turn: battle.turn, kind: 'armor-break' })
  return context.bonusDamage
}

interface EnergyDistributionMechanicContext {
  battle: BattleState
  totals: Readonly<Record<TraceEcology, number>>
  appliedAuras: Set<string>
}

const ENERGY_DISTRIBUTION_HANDLERS: Readonly<Record<string, MechanicHandler<EnergyDistributionMechanicContext>>> = {
  'energy.share': (binding, context) => {
    if (context.appliedAuras.has(binding.opcode)) return
    const ecology = mechanicEcology(binding)
    if (context.totals[ecology] <= 0) return
    context.appliedAuras.add(binding.opcode)
    const shared = Math.floor(
      Math.min(mechanicNumber(binding, 'maximumSource'), context.totals[ecology])
      * mechanicNumber(binding, 'ratio'),
    )
    if (shared <= 0) return
    for (const member of livingMembers(context.battle)) {
      const memberEcology = creatureById(member.creatureId)?.ecology
      if (!mechanicBoolean(binding, 'excludeEcology') || memberEcology !== ecology) grantEnergy(member, shared)
    }
  },
}

function distributeEnergy(battle: BattleState, totals: Readonly<Record<TraceEcology, number>>): void {
  for (const member of livingMembers(battle)) {
    const ecology = creatureById(member.creatureId)?.ecology
    if (ecology === undefined) continue
    grantEnergy(member, Math.min(8, totals[ecology]))
  }
  const context: EnergyDistributionMechanicContext = { battle, totals, appliedAuras: new Set() }
  for (const member of livingMembers(battle)) {
    runMechanics(
      member.creatureId,
      'energy:after-distribute',
      ENERGY_DISTRIBUTION_HANDLERS,
      context,
    )
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
  for (let index = 0; index < resolution.steps.length; index += 1) {
    const step = resolution.steps[index]!
    const frame = resolution.frames[index]
    const pendingBefore = battle.pendingTeamDamage
    for (const ecology of TRACE_ECOLOGIES) totals[ecology] += step.counts[ecology]
    const stepDamage = damageForStep(battle, active, step.counts, step.chain)
    const damage = stepDamage.total > 0 ? applyWildDamage(battle, stepDamage.total) : 0
    const rawSignalEffect = stepDamage.signalEffect
    const scaledSignalEffect = rawSignalEffect === undefined
      || rawSignalEffect.kind === 'repair' || rawSignalEffect.kind === 'guard'
      ? rawSignalEffect
      : {
          ...rawSignalEffect,
          amount: stepDamage.total <= 0 ? 0 : Math.round(rawSignalEffect.amount * damage / stepDamage.total),
        }
    const signalEffect = scaledSignalEffect === undefined
      ? undefined
      : applyPlayerSignalEffect(battle, scaledSignalEffect)
    totalDamage += damage
    totalDamage += applyMatchPassives(
      battle, step.counts, step.chain, step.maxGroup, step.specialCount, damage, random,
    )
    if (frame !== undefined) {
      const hazardCount = frame.removed.reduce((count, tileIndex) => (
        count + ((frame.before[tileIndex]?.hazardActions ?? 0) > 0 ? 1 : 0)
      ), 0)
      const partyBeforeHazard = battle.partyHp
      if (hazardCount > 0 && battle.partyHp > 0) {
        const hazardDamage = damageParty(
          battle,
          Math.min(battle.partyMaxHp * 0.16, battle.partyMaxHp * (0.018 + battle.bossSkillTier * 0.002) * hazardCount),
        )
        if (hazardDamage > 0) {
          appendBattleLog(battle, { turn: battle.turn, kind: 'hazard-damage', amount: hazardDamage })
        }
      }
      frame.damage = Math.max(0, battle.pendingTeamDamage - pendingBefore)
      frame.totalDamage = battle.pendingTeamDamage
      frame.effectiveness = stepDamage.effectiveness
      if (signalEffect !== undefined) frame.signalEffect = signalEffect
      const hazardDamage = Math.max(0, partyBeforeHazard - battle.partyHp)
      if (hazardDamage > 0) frame.hazardDamage = hazardDamage
    }
  }
  if (resolution.steps.length > 0 && armorBefore > 0 && battle.wildArmor === armorBefore) {
    battle.wildArmor -= 1
    appendBattleLog(battle, { turn: battle.turn, kind: 'armor-break' })
  }
  distributeEnergy(battle, totals)
  if (consumeRepeat && battle.repeatPower > 0 && totalDamage > 0) {
    const repeated = applyWildDamage(battle, totalDamage * battle.repeatPower)
    totalDamage += repeated
    const lastFrame = resolution.frames.at(-1)
    if (lastFrame !== undefined) {
      lastFrame.damage = Math.min(9_999_999, (lastFrame.damage ?? 0) + repeated)
      lastFrame.totalDamage = battle.pendingTeamDamage
    }
    battle.repeatPower = 0
  }
  battle.lastPlayerDamage = totalDamage
  if (totalDamage > 0) appendBattleLog(battle, { turn: battle.turn, kind: 'match', amount: totalDamage })
  if (resolution.steps.length > 1) appendBattleLog(battle, { turn: battle.turn, kind: 'combo', amount: resolution.steps.length })
  return totalDamage
}

interface StageEntryMechanicContext {
  battle: BattleState
  member: BattlePartyMember
  scale: number
}

const STAGE_ENTRY_HANDLERS: Readonly<Record<string, MechanicHandler<StageEntryMechanicContext>>> = {
  'stage.grant-energy': (binding, context) => {
    grantEnergy(context.member, mechanicNumber(binding, 'amount'))
  },
  'stage.shield': (binding, context) => {
    const basis = mechanicString(binding, 'basis')
    const amount = basis === 'member-max-hp'
      ? context.member.maxHp
      : basis === 'party-max-hp'
        ? context.battle.partyMaxHp
        : undefined
    if (amount === undefined) throw new TraceWildRuleError('conflict')
    queuePartyShielding(context.battle, amount * mechanicNumber(binding, 'ratio') * context.scale)
  },
}

function applyStageEntryPassives(battle: BattleState): void {
  const member = activeMember(battle)
  member.skillUsedStage = false
  const scale = qualityMultiplier(member)
  runMechanics(member.creatureId, 'stage:enter', STAGE_ENTRY_HANDLERS, { battle, member, scale })
  appendBattleLog(battle, { turn: battle.turn, kind: 'switch', creatureId: member.creatureId })
}

function nextLivingIndex(battle: BattleState): { index: number; wrapped: boolean } | undefined {
  if (battle.partyHp <= 0) return undefined
  for (let offset = 1; offset <= battle.party.length; offset += 1) {
    const index = (battle.activeIndex + offset) % battle.party.length
    if (battle.party[index] !== undefined) return { index, wrapped: index <= battle.activeIndex }
  }
  return undefined
}

interface DefeatMechanicContext {
  battle: BattleState
  member: BattlePartyMember
  prevented: boolean
}

const DEFEAT_HANDLERS: Readonly<Record<string, MechanicHandler<DefeatMechanicContext>>> = {
  'defeat.prevent': (binding, context) => {
    if (context.prevented || context.member.reviveUsed) return
    context.member.reviveUsed = true
    context.battle.partyHp = mechanicNumber(binding, 'hp')
    syncLegacyPartyHealth(context.battle)
    shieldParty(
      context.battle,
      context.battle.partyMaxHp * mechanicNumber(binding, 'shieldRatio') * qualityMultiplier(context.member),
    )
    context.prevented = true
  },
}

function maybePreventDefeat(battle: BattleState): boolean {
  if (battle.partyHp > 0) return true
  const context: DefeatMechanicContext = { battle, member: battle.party[0]!, prevented: false }
  for (const member of battle.party) {
    context.member = member
    runMechanics(member.creatureId, 'defeat:before', DEFEAT_HANDLERS, context)
    if (context.prevented) break
  }
  return context.prevented
}

interface RuntimeThresholdMechanicContext {
  battle: BattleState
  member: BattlePartyMember
  applied: boolean
}

const RUNTIME_THRESHOLD_HANDLERS: Readonly<Record<string, MechanicHandler<RuntimeThresholdMechanicContext>>> = {
  'runtime.delay-enemy': (binding, context) => {
    if (context.applied || context.member.passiveBattleUsed) return
    if (context.battle.partyHp < context.battle.partyMaxHp * mechanicNumber(binding, 'belowRatio')) {
      context.member.passiveBattleUsed = true
      context.battle.enemyDelayed = Math.max(
        context.battle.enemyDelayed,
        mechanicNumber(binding, 'actions'),
      )
      context.applied = true
    }
  },
}

function maybeApplyRuntimeThresholdMechanics(battle: BattleState): void {
  const context: RuntimeThresholdMechanicContext = { battle, member: battle.party[0]!, applied: false }
  for (const member of battle.party) {
    context.member = member
    runMechanics(member.creatureId, 'runtime:threshold', RUNTIME_THRESHOLD_HANDLERS, context)
    if (context.applied) break
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
    case 'forge': return 'corrupt'
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

function enemyTargetFor(
  battle: Pick<BattleState, 'activeIndex'>,
  intent: EnemyIntent,
): { scope: BattleState['enemyTargetScope']; index?: number } {
  if (intent === 'guard') return { scope: 'self' }
  if (intent === 'strike') return { scope: 'team' }
  if (intent === 'freeze' || intent === 'mark') return { scope: 'member', index: battle.activeIndex }
  return { scope: 'board' }
}

function prepareBossIntent(battle: BattleState, random: RandomSource): void {
  const wild = creatureById(battleEncounterCreatureId(battle))
  if (wild === undefined) throw new TraceWildRuleError('conflict')
  const tier = battle.bossSkillTier
  const roll = boundedRandom(random)
  battle.bossSkillArmed = battle.bossEnergy >= BOSS_SKILL_ENERGY_COST
  let intent: EnemyIntent
  if (!battle.bossSkillArmed) {
    intent = 'strike'
  } else {
    // Even entry-level bosses spend a full energy bar on a visible board or
    // status mechanic. Their tier controls intensity, not whether the cast is
    // meaningful at all.
    intent = baseEnemyIntent(wild.ecology)
    if (tier >= 4 && battle.enemyHardControlCooldown === 0 && roll < 0.1 + tier * 0.02) {
      intent = wild.ecology === 'lumen' || wild.ecology === 'relay' ? 'lock' : 'freeze'
    } else if (tier >= 3 && roll < 0.42 + tier * 0.02 && (wild.ecology === 'lumen' || wild.ecology === 'glitch')) {
      intent = 'lock'
    }
  }
  const target = enemyTargetFor(battle, intent)
  battle.enemyIntent = intent
  battle.enemyTargetScope = target.scope
  if (target.index === undefined) delete battle.enemyTargetIndex
  else battle.enemyTargetIndex = target.index
}

function partyDefense(battle: BattleState): number {
  return battle.party.reduce((sum, member) => sum + memberStats(member).defense, 0) / battle.party.length
}

function partyAffinity(battle: BattleState, wildEcology: TraceEcology): number {
  return battle.party.reduce((sum, member) => {
    const definition = creatureById(member.creatureId)
    return sum + (definition === undefined ? 1 : affinity(wildEcology, definition.ecology))
  }, 0) / battle.party.length
}

function bossPhaseDamageCap(battle: BattleState): number {
  const partyAverageLevel = battle.party.reduce((sum, member) => sum + member.level, 0) / battle.party.length
  const levelPressure = Math.min(0.08, Math.max(0, battle.wildLevel - partyAverageLevel) * 0.004)
  const qualityPressure = qualityIndex(battle.wildQuality) * 0.035
  const skillPressure = (battle.bossSkillTier - 1) * 0.01
  const amplifier = 1 + Math.min(500, bossAttackAmplifier(battle)) / 1_000
  return Math.max(1, Math.round(
    battle.partyMaxHp * Math.min(0.68, (0.34 + qualityPressure + skillPressure + levelPressure) * amplifier),
  ))
}

function enemyDamageForStep(
  battle: BattleState,
  wildEcology: TraceEcology,
  counts: Readonly<Record<TraceEcology, number>>,
  chain: number,
): MatchStepDamage {
  if (battle.partyHp <= 0) return { total: 0, effectiveness: 'neutral' }
  const combo = Math.min(2.25, 1 + 0.25 * Math.max(0, chain - 1))
  // Full squads have more shared runtime and nine player actions per cycle.
  // This pressure term rises with party size, but much slower than shared HP,
  // preserving the value of building a team without making solo starts free.
  const partyPressure = 0.42 + 0.42 * Math.max(0, battle.party.length - 1)
  const defense = partyDefense(battle) * (1 - Math.min(500, bossPenetrationAmplifier(battle)) / 1_000)
  const attackMultiplier = 1 + Math.min(500, bossAttackAmplifier(battle)) / 1_000
  let total = 0
  let signalEffect: MatchSignalEffect | undefined
  const effectivenessDamage: Record<MatchDamageEffectiveness, number> = { advantage: 0, neutral: 0, resisted: 0 }
  for (const ecology of TRACE_ECOLOGIES) {
    const count = counts[ecology]
    if (count <= 0) continue
    const element = partyAffinity(battle, ecology)
    const tilePower = Math.pow(count / 3, 0.9)
    const baseContribution = battle.wildAttack * tilePower * combo * (battle.bossDamageScale / 1000) * attackMultiplier
      * partyPressure * element * (1_400 / (1_400 + Math.max(0, defense) * 2.2))
    let contribution = baseContribution
    if (ecology === wildEcology) {
      if (ecology === 'aegis') {
        // Boss signal panels keep half their attack pressure in addition to
        // their elite sustain; support-ecology turns must still threaten the
        // shared player runtime pool.
        contribution *= 0.5
        signalEffect = {
          kind: 'repair', ecology,
          amount: Math.max(1, Math.round(battle.wildMaxHp * Math.min(0.06, 0.012 * (count / 3) * combo))),
        }
      } else if (ecology === 'relay') {
        contribution *= 0.5
        signalEffect = {
          kind: 'guard', ecology,
          amount: Math.max(1, Math.round(battle.wildMaxHp * Math.min(0.05, 0.01 * (count / 3) * combo))),
        }
      } else if (ecology === 'lumen') {
        contribution *= 1.25
        signalEffect = { kind: 'sync', ecology, amount: Math.max(1, Math.round(contribution - baseContribution)) }
      } else if (ecology === 'forge') {
        contribution *= Math.min(1.4, 1.16 + Math.max(0, count - 3) * 0.04 + Math.max(0, chain - 1) * 0.03)
        signalEffect = { kind: 'overclock', ecology, amount: Math.max(1, Math.round(contribution - baseContribution)) }
      } else {
        contribution = battle.wildAttack * tilePower * combo * (battle.bossDamageScale / 1000) * attackMultiplier
          * partyPressure * element * (1_400 / (1_400 + Math.max(0, defense * 0.35) * 2.2)) * 1.05
        signalEffect = { kind: 'breach', ecology, amount: Math.max(1, Math.round(contribution - baseContribution)) }
      }
    }
    total += contribution
    if (contribution <= 0) continue
    const effectiveness: MatchDamageEffectiveness = element > 1.05 ? 'advantage' : element < 0.95 ? 'resisted' : 'neutral'
    effectivenessDamage[effectiveness] += contribution
  }
  const effectiveness = total <= 0
    ? 'neutral'
    : (Object.entries(effectivenessDamage) as [MatchDamageEffectiveness, number][])
        .sort((left, right) => right[1] - left[1]
          || ['advantage', 'neutral', 'resisted'].indexOf(left[0]) - ['advantage', 'neutral', 'resisted'].indexOf(right[0]))[0]?.[0]
      ?? 'neutral'
  return {
    total: Math.max(0, Math.round(total)), effectiveness,
    ...(signalEffect === undefined ? {} : { signalEffect }),
  }
}

function applyBossSignalEffect(battle: BattleState, effect: MatchSignalEffect): MatchSignalEffect {
  if (effect.kind === 'repair') {
    return { ...effect, amount: queueWildHealing(battle, effect.amount) }
  }
  if (effect.kind === 'guard') {
    return { ...effect, amount: queueWildShielding(battle, effect.amount) }
  }
  activateBossAmplifier(battle, effect)
  return effect
}

function projectedBossActionsAfterSwap(battle: BattleState, beforeActions: number, directMaxGroup: number): number {
  if (directMaxGroup >= 5 && battle.bossBonusActionsGranted < MAX_BOSS_BONUS_ACTIONS) {
    return Math.min(MAX_BOSS_ACTIONS, beforeActions + 1)
  }
  if (directMaxGroup >= 4) return beforeActions
  return Math.max(0, beforeActions - 1)
}

function allocateBossStepDamage(rawValues: readonly number[], budgetValue: number): number[] {
  const positiveCount = rawValues.filter(value => value > 0).length
  const rawTotal = rawValues.reduce((sum, value) => sum + Math.max(0, value), 0)
  if (rawTotal <= 0 || positiveCount === 0 || budgetValue <= 0) return rawValues.map(() => 0)
  const target = Math.min(rawTotal, Math.floor(budgetValue))
  if (target < positiveCount) {
    const selected = new Set(rawValues
      .map((value, index) => ({ value, index }))
      .filter(row => row.value > 0)
      .sort((left, right) => right.value - left.value || left.index - right.index)
      .slice(0, target)
      .map(row => row.index))
    return rawValues.map((_, index) => selected.has(index) ? 1 : 0)
  }
  if (target >= rawTotal) return rawValues.map(value => Math.max(0, value))
  let remainingTarget = target
  let remainingWeight = rawTotal
  let remainingPositive = positiveCount
  return rawValues.map(rawValue => {
    const value = Math.max(0, rawValue)
    if (value <= 0) return 0
    remainingPositive -= 1
    const upper = remainingTarget - remainingPositive
    const allocated = remainingPositive === 0
      ? remainingTarget
      : Math.max(1, Math.min(upper, Math.round(remainingTarget * value / remainingWeight)))
    remainingTarget -= allocated
    remainingWeight -= value
    return allocated
  })
}

interface DamageTakenMechanicContext {
  battle: BattleState
  member: BattlePartyMember
  damage: number
}

const DAMAGE_TAKEN_HANDLERS: Readonly<Record<string, MechanicHandler<DamageTakenMechanicContext>>> = {
  'damage.arm-counter': (binding, context) => {
    if (context.damage <= 0) return
    context.member.counterPower = mechanicNumber(binding, 'power') * qualityMultiplier(context.member)
  },
}

function applyEnemyTeamHit(battle: BattleState, amount: number): number {
  if (amount <= 0) return 0
  const damage = damageParty(battle, amount)
  if (damage > 0) {
    for (const member of battle.party) {
      runMechanics(member.creatureId, 'damage:taken', DAMAGE_TAKEN_HANDLERS, { battle, member, damage })
    }
  }
  maybePreventDefeat(battle)
  return damage
}

function installHazardTiles(battle: BattleState, random: RandomSource): number {
  const countLimit = Math.min(6, 2 + battle.bossSkillTier)
  const candidates = battle.board.map((tile, index) => (
    tile.special === 'none' && (tile.lockedActions ?? 0) === 0 && (tile.hazardActions ?? 0) === 0 ? index : -1
  )).filter(index => index >= 0)
  let count = 0
  while (candidates.length > 0 && count < countLimit) {
    const cursor = Math.floor(boundedRandom(random) * candidates.length)
    const index = candidates.splice(cursor, 1)[0]!
    battle.board[index] = { ...battle.board[index]!, hazardActions: 3 }
    count += 1
  }
  return count
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
  const target = battle.party[battle.enemyTargetIndex ?? battle.activeIndex]
  const totalDamage = applyEnemyTeamHit(battle, battle.pendingBossDamage)
  appendBattleLog(battle, { turn: battle.turn, kind: 'enemy', amount: totalDamage })
  battle.lastBossAttack = totalDamage

  // A defeated team must not receive a late board mutation or status effect.
  // This also keeps the final combat frame focused on the shared-HP knockout.
  if (battle.partyHp <= 0) return true

  if (battle.bossSkillArmed) {
    battle.bossEnergy = Math.max(0, battle.bossEnergy - BOSS_SKILL_ENERGY_COST)
    appendBattleLog(battle, { turn: battle.turn, kind: 'boss-skill', creatureId: wild.id })
    switch (battle.enemyIntent) {
      case 'guard':
        queueWildShielding(battle, battle.wildMaxHp * 0.1)
        break
      case 'freeze':
        if (target !== undefined) {
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
        appendBattleLog(battle, { turn: battle.turn, kind: 'enemy-hazard', amount: installHazardTiles(battle, random) })
        break
      case 'mark':
        if (target !== undefined) {
          target.energy = Math.max(0, target.energy - 2)
          target.skillSealedStages = Math.max(target.skillSealedStages, 1)
          appendBattleLog(battle, { turn: battle.turn, kind: 'enemy-seal', amount: 1, creatureId: target.creatureId })
        }
        break
      case 'strike':
        break
    }
  } else {
    mutateBoardForEnemy(battle, wild.ecology, random)
  }
  if (battle.enemyHardControlCooldown > 0 && battle.enemyIntent !== 'freeze' && battle.enemyIntent !== 'lock') {
    battle.enemyHardControlCooldown -= 1
  }
  return battle.partyHp <= 0
}

function advanceBattleStage(battle: BattleState): boolean {
  if (battle.partyHp <= 0) return true
  const leaving = battle.party[battle.activeIndex]
  if (leaving !== undefined && leaving.skillSealedStages > 0) leaving.skillSealedStages -= 1
  const next = nextLivingIndex(battle)
  if (next === undefined) return true
  battle.activeIndex = next.index
  if (next.wrapped) {
    battle.round += 1
    ageAmplifiers(battle)
  }
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
      skillSealedStages: 0,
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
  const partyMaxHp = party.reduce((sum, member) => sum + member.maxHp, 0)
  const battle: BattleState = {
    id: randomId('battle', now, random),
    encounterId: input.encounterId,
    wildCreatureId: wild.id,
    mode: input.mode,
    ...(input.towerFloor === undefined ? {} : { towerFloor: input.towerFloor }),
    bossSkillTier: input.bossSkillTier,
    board: createMatchBoard(random),
    party,
    partyHp: partyMaxHp,
    partyMaxHp,
    partyShield: 0,
    pendingPartyHealing: 0,
    pendingPartyShielding: 0,
    partyAmplifiers: [],
    turnOwner: 'player',
    activeIndex: 0,
    actionsRemaining: BASE_ACTIONS_PER_CREATURE,
    bossActionsRemaining: 0,
    bossActionsTaken: 0,
    bossEnergy: input.startingBossEnergy,
    bossAttackCharge: 0,
    pendingBossDamage: 0,
    bossDamageScale: 1000,
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
    pendingWildHealing: 0,
    pendingWildShielding: 0,
    bossAmplifiers: [],
    wildDefense: input.stats.defense,
    wildAttack: input.stats.attack,
    wildLevel: input.level,
    wildQuality: input.quality,
    enemyIntent: 'strike',
    enemyTargetScope: 'team',
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
    && battle.wildHp / battle.wildMaxHp <= CAPTURE_HEALTH_RATIO
}

function ageTileLocks(battle: BattleState): void {
  battle.board = battle.board.map(tile => {
    const lockedActions = Math.max(0, (tile.lockedActions ?? 0) - 1)
    const hazardActions = Math.max(0, (tile.hazardActions ?? 0) - 1)
    return {
      ecology: tile.ecology,
      special: tile.special,
      ...(lockedActions > 0 ? { lockedActions } : {}),
      ...(hazardActions > 0 ? { hazardActions } : {}),
    }
  })
}

function beginBossPhase(battle: BattleState, random: RandomSource): BattleOutcome {
  maybeApplyRuntimeThresholdMechanics(battle)
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
  battle.pendingBossDamage = 0
  battle.bossDamageScale = 930 + Math.floor(boundedRandom(random) * 141)
  battle.bossBonusActionsGranted = 0
  battle.lastBossMatch = 0
  return 'none'
}

interface BattleStageCompletion {
  outcome: BattleOutcome
  strike?: TraceWildBattleStrike
  recovery?: TraceWildBattleRecovery
}

function finishBossPhase(battle: BattleState, random: RandomSource): BattleStageCompletion {
  const targetHpBefore = battle.partyHp
  const defeated = performBossSettlement(battle, random)
  const recovery = settleWildRecovery(battle)
  const strike = battle.lastBossAttack > 0
    ? {
        actor: 'boss' as const,
        damage: battle.lastBossAttack,
        targetHpBefore,
        targetHpAfter: battle.partyHp,
        targetMaxHp: battle.partyMaxHp,
      }
    : undefined
  if (defeated) return {
    outcome: 'battle-lost',
    ...(strike === undefined ? {} : { strike }),
    ...(recovery === undefined ? {} : { recovery }),
  }
  battle.turnOwner = 'player'
  battle.bossActionsRemaining = 0
  battle.bossActionsTaken = 0
  battle.bossAttackCharge = 0
  battle.pendingBossDamage = 0
  battle.bossDamageScale = 1000
  battle.bossBonusActionsGranted = 0
  if (advanceBattleStage(battle)) return {
    outcome: 'battle-lost',
    ...(strike === undefined ? {} : { strike }),
    ...(recovery === undefined ? {} : { recovery }),
  }
  prepareBossIntent(battle, random)
  return {
    outcome: 'none',
    ...(strike === undefined ? {} : { strike }),
    ...(recovery === undefined ? {} : { recovery }),
  }
}

function completeBattleStage(
  battle: BattleState,
  random: RandomSource,
): BattleStageCompletion {
  const next = nextLivingIndex(battle)
  const wrapped = next?.wrapped === true
  if (wrapped) {
    const recovery = settlePartyRecovery(battle)
    const targetHpBefore = battle.wildHp
    const defeated = settleTeamStrike(battle)
    const strike = battle.lastTeamStrike > 0
      ? {
          actor: 'player' as const,
          damage: battle.lastTeamDamageApplied,
          targetHpBefore,
          targetHpAfter: battle.wildHp,
          targetMaxHp: battle.wildMaxHp,
        }
      : undefined
    if (defeated) return {
      outcome: 'wild-defeated',
      ...(strike === undefined ? {} : { strike }),
      ...(recovery === undefined ? {} : { recovery }),
    }
    if (isCaptureWindowAvailable(battle)) {
      battle.captureWindow = true
      return {
        outcome: 'none',
        ...(strike === undefined ? {} : { strike }),
        ...(recovery === undefined ? {} : { recovery }),
      }
    }
    const outcome = beginBossPhase(battle, random)
    return {
      outcome,
      ...(strike === undefined ? {} : { strike }),
      ...(recovery === undefined ? {} : { recovery }),
    }
  }
  return { outcome: advanceBattleStage(battle) ? 'battle-lost' : 'none' }
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
  const completion = battle.partyHp <= 0
    ? { outcome: 'battle-lost' as const }
    : battle.actionsRemaining === 0 ? completeBattleStage(battle, random) : { outcome: 'none' as const }
  if (completion.strike !== undefined) animation.strike = completion.strike
  if (completion.recovery !== undefined) animation.recovery = completion.recovery
  return { outcome: completion.outcome, animation }
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
  const beforeActions = battle.bossActionsRemaining
  const directMaxGroup = resolution.steps[0]?.maxGroup ?? 0
  const projectedActions = projectedBossActionsAfterSwap(battle, beforeActions, directMaxGroup)
  const futureSwapCapacity = Math.max(0, MAX_BOSS_SWAPS_PER_PHASE - battle.bossActionsTaken - 1)
  const expectedActionSlots = 1 + Math.min(projectedActions, futureSwapCapacity)
  const remainingPhaseBudget = Math.max(0, bossPhaseDamageCap(battle) - battle.pendingBossDamage)
  const actionBudget = Math.ceil(remainingPhaseBudget / Math.max(1, expectedActionSlots))
  const rawStepDamage = resolution.steps.map(step => (
    enemyDamageForStep(battle, wild.ecology, step.counts, step.chain)
  ))
  const allocatedStepDamage = allocateBossStepDamage(rawStepDamage.map(step => step.total), actionBudget)
  let matched = 0
  let ownColor = 0
  for (let index = 0; index < resolution.steps.length; index += 1) {
    const step = resolution.steps[index]!
    const count = TRACE_ECOLOGIES.reduce((sum, ecology) => sum + step.counts[ecology], 0)
    const combo = Math.min(2.4, 1 + 0.25 * (step.chain - 1))
    matched += count
    ownColor += step.counts[wild.ecology]
    const chargeGain = count / 3 * combo
    battle.bossAttackCharge = Math.min(32, battle.bossAttackCharge + chargeGain)
    const stepDamage = allocatedStepDamage[index] ?? 0
    battle.pendingBossDamage = Math.min(9_999_999, battle.pendingBossDamage + stepDamage)
    const frame = resolution.frames[index]
    if (frame !== undefined) {
      frame.damage = stepDamage
      frame.totalDamage = battle.pendingBossDamage
      frame.effectiveness = rawStepDamage[index]?.effectiveness ?? 'neutral'
      const rawDamage = rawStepDamage[index]
      const signalEffect = rawDamage?.signalEffect
      if (rawDamage !== undefined && signalEffect !== undefined) {
        const scaledEffect = signalEffect.kind === 'repair' || signalEffect.kind === 'guard'
          ? signalEffect
          : {
              ...signalEffect,
              amount: rawDamage.total <= 0 ? 0 : Math.round(signalEffect.amount * stepDamage / rawDamage.total),
            }
        frame.signalEffect = applyBossSignalEffect(battle, scaledEffect)
      }
    }
  }
  battle.lastBossMatch = matched
  const energyGain = Math.min(8, ownColor)
  if (energyGain > 0) {
    battle.bossEnergy = Math.min(BOSS_SKILL_ENERGY_LIMIT, battle.bossEnergy + energyGain)
    appendBattleLog(battle, { turn: battle.turn, kind: 'boss-energy', amount: energyGain, ecology: wild.ecology })
  }
  appendBattleLog(battle, { turn: battle.turn, kind: 'boss-match', amount: matched, ecology: wild.ecology })
  if (resolution.steps.length > 1) {
    appendBattleLog(battle, { turn: battle.turn, kind: 'boss-combo', amount: resolution.steps.length })
  }
  battle.bossActionsTaken += 1
  battle.bossActionsRemaining = projectedActions
  if (directMaxGroup >= 5 && battle.bossBonusActionsGranted < MAX_BOSS_BONUS_ACTIONS) {
    if (battle.bossActionsRemaining > beforeActions) battle.bossBonusActionsGranted += 1
    appendBattleLog(battle, {
      turn: battle.turn,
      kind: 'boss-action-bonus',
      amount: battle.bossActionsRemaining - beforeActions,
    })
  } else if (directMaxGroup >= 4) {
    appendBattleLog(battle, { turn: battle.turn, kind: 'boss-action-refund', amount: beforeActions })
  }
  if (battle.bossActionsTaken >= MAX_BOSS_SWAPS_PER_PHASE) battle.bossActionsRemaining = 0
  const completion = battle.bossActionsRemaining === 0
    ? finishBossPhase(battle, random)
    : { outcome: 'none' as const }
  return {
    outcome: completion.outcome,
    animation: {
      kind: 'match', battleId: battle.id, actor: 'boss', swap: { from: swap.from, to: swap.to }, frames: resolution.frames,
      ...(completion.strike === undefined ? {} : { strike: completion.strike }),
      ...(completion.recovery === undefined ? {} : { recovery: completion.recovery }),
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
  const completion = completeBattleStage(battle, random)
  return {
    outcome: completion.outcome,
    ...(completion.strike === undefined && completion.recovery === undefined
      ? {}
      : {
          animation: {
            kind: 'match', battleId: battle.id, actor: 'player', frames: [],
            ...(completion.strike === undefined ? {} : { strike: completion.strike }),
            ...(completion.recovery === undefined ? {} : { recovery: completion.recovery }),
          },
        }),
  }
}

function skipPlayerStage(battle: BattleState, random: RandomSource): BattleStageCompletion {
  const active = battle.party[battle.activeIndex]
  if (battle.turnOwner !== 'player' || battle.captureWindow
    || battle.actionsRemaining <= 0 || active === undefined || battle.partyHp <= 0) {
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

interface SkillMechanicContext {
  state: TraceWildState
  battle: BattleState
  member: BattlePartyMember
  random: RandomSource
  scale: number
  damage: number
  animationFrames: MatchCascadeFrame[]
}

function optionalMechanicNumber(binding: ContentMechanicBinding, key: string, fallback: number): number {
  const value = binding.params?.[key]
  if (value === undefined) return fallback
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new TraceWildRuleError('conflict')
  return value
}

function skillHpBasis(binding: ContentMechanicBinding, context: SkillMechanicContext): number {
  switch (mechanicString(binding, 'basis')) {
    case 'party-max-hp': return context.battle.partyMaxHp
    case 'member-max-hp': return context.member.maxHp
    case 'member-hp': return context.member.hp
    default: throw new TraceWildRuleError('conflict')
  }
}

function skillTargetEcology(binding: ContentMechanicBinding, context: SkillMechanicContext): TraceEcology {
  const target = mechanicString(binding, 'ecology')
  if (target !== 'counter') return mechanicEcology(binding)
  const wild = creatureById(battleEncounterCreatureId(context.battle))
  if (wild === undefined) throw new TraceWildRuleError('conflict')
  return ecologyThatCounters(wild.ecology)
}

function resolveSkillBoard(context: SkillMechanicContext): void {
  context.animationFrames.push(...resolveConvertedBoard(context.battle, context.random))
}

const SKILL_BEFORE_HANDLERS: Readonly<Record<string, MechanicHandler<SkillMechanicContext>>> = {
  'skill.consume-overflow': (binding, context) => {
    context.scale *= 1 + context.member.overcharge * mechanicNumber(binding, 'multiplierPerPoint')
    context.member.overcharge = 0
  },
}

const SKILL_CAST_HANDLERS: Readonly<Record<string, MechanicHandler<SkillMechanicContext>>> = {
  'damage.raw-hit': (binding, context) => {
    const hits = Math.max(1, Math.floor(optionalMechanicNumber(binding, 'hits', 1)))
    for (let hit = 0; hit < hits; hit += 1) {
      context.damage += applyRawHit(
        context.battle,
        context.member,
        mechanicNumber(binding, 'power') * context.scale,
      )
    }
  },
  'damage.replay': (binding, context) => {
    const minimum = mechanicString(binding, 'minimum')
    if (minimum !== 'member-attack') throw new TraceWildRuleError('conflict')
    context.damage += applyWildDamage(
      context.battle,
      Math.max(memberStats(context.member).attack, context.battle.lastPlayerDamage)
        * mechanicNumber(binding, 'factor') * context.scale,
    )
  },
  'mark.add': (binding, context) => {
    context.battle.enemyMarks = Math.min(
      mechanicNumber(binding, 'maximum'),
      context.battle.enemyMarks + mechanicNumber(binding, 'amount'),
    )
  },
  'tiles.convert': (binding, context) => {
    context.battle.board = convertRandomBattleTiles(
      context.battle.board,
      skillTargetEcology(binding, context),
      mechanicNumber(binding, 'count'),
      context.random,
    )
    if (mechanicBoolean(binding, 'resolve')) resolveSkillBoard(context)
  },
  'tiles.resolve': (_binding, context) => {
    resolveSkillBoard(context)
  },
  'heal.party': (binding, context) => {
    queuePartyHealing(
      context.battle,
      skillHpBasis(binding, context) * mechanicNumber(binding, 'ratio') * context.scale,
    )
  },
  'shield.party': (binding, context) => {
    queuePartyShielding(
      context.battle,
      skillHpBasis(binding, context) * mechanicNumber(binding, 'ratio') * context.scale,
    )
  },
  'affinity.floor': (binding, context) => {
    context.battle.affinityFloorActions = Math.max(
      context.battle.affinityFloorActions,
      mechanicNumber(binding, 'actions'),
    )
  },
  'counter.arm': (binding, context) => {
    context.member.counterPower = mechanicNumber(binding, 'power') * context.scale
  },
  'burn.add': (binding, context) => {
    const amount = mechanicNumber(binding, 'amount')
      * (mechanicBoolean(binding, 'scaled') ? context.scale : 1)
    context.battle.enemyBurn = Math.min(
      mechanicNumber(binding, 'maximum'),
      context.battle.enemyBurn + amount,
    )
  },
  'armor.break': (binding, context) => {
    context.battle.wildArmor = Math.max(
      0,
      context.battle.wildArmor - mechanicNumber(binding, 'amount'),
    )
  },
  'tiles.clear': (binding, context) => {
    const resolution = resolveForcedTiles(
      context.battle.board,
      selectedIndexes(
        context.battle.board,
        mechanicEcology(binding),
        mechanicNumber(binding, 'count'),
      ),
      context.random,
    )
    context.damage += applyResolution(context.battle, resolution, context.random, false)
    context.animationFrames.push(...resolution.frames)
  },
  'tiles.guaranteed-match': (binding, context) => {
    context.battle.board = createGuaranteedMatch(context.battle.board, mechanicEcology(binding))
    if (mechanicBoolean(binding, 'resolve')) resolveSkillBoard(context)
  },
  'tiles.reshuffle': (_binding, context) => {
    context.battle.board = reshuffleBattleBoard(context.battle.board, context.random)
  },
  'repeat.arm': (binding, context) => {
    const power = mechanicNumber(binding, 'power')
      * (mechanicBoolean(binding, 'scaled') ? context.scale : 1)
    context.battle.repeatPower = Math.max(
      context.battle.repeatPower,
      Math.min(mechanicNumber(binding, 'maximum'), power),
    )
  },
  'energy.party': (binding, context) => {
    const amount = mechanicNumber(binding, 'amount')
      * (mechanicBoolean(binding, 'scaled') ? context.scale : 1)
    for (const ally of livingMembers(context.battle)) grantEnergy(ally, Math.round(amount))
  },
  'enemy.delay': (binding, context) => {
    context.battle.enemyDelayed = Math.max(
      context.battle.enemyDelayed,
      mechanicNumber(binding, 'actions'),
    )
  },
  'board.lock': (binding, context) => {
    context.battle.boardLockActions = Math.max(
      context.battle.boardLockActions,
      mechanicNumber(binding, 'actions'),
    )
  },
  'shield.enemy-clear': (_binding, context) => {
    context.battle.wildShield = 0
  },
  'runtime.self-damage': (binding, context) => {
    const amount = Math.max(1, Math.round(skillHpBasis(binding, context) * mechanicNumber(binding, 'ratio')))
    context.battle.partyHp = Math.max(
      mechanicNumber(binding, 'minimumRemaining'),
      context.battle.partyHp - amount,
    )
    syncLegacyPartyHealth(context.battle)
  },
}

function castActiveSkill(state: TraceWildState, creatureInstanceId: string, random: RandomSource): MatchCascadeFrame[] {
  const battle = state.battle
  if (battle === undefined || battle.turnOwner !== 'player' || battle.captureWindow || battle.actionsRemaining <= 0) {
    throw new TraceWildRuleError('conflict')
  }
  const member = activeMember(battle)
  if (member.instanceId !== creatureInstanceId || member.skillUsedStage || member.skillSealedStages > 0) {
    throw new TraceWildRuleError('conflict')
  }
  const definition = skillByCreatureId(member.creatureId)
  if (definition === undefined || member.energy < definition.energyCost) throw new TraceWildRuleError('invalid-action')
  member.energy -= definition.energyCost
  member.skillUsedStage = true
  const context: SkillMechanicContext = {
    state,
    battle,
    member,
    random,
    scale: qualityMultiplier(member),
    damage: 0,
    animationFrames: [],
  }
  runMechanics(member.creatureId, 'skill:before', SKILL_BEFORE_HANDLERS, context)
  runMechanics(member.creatureId, 'skill:cast', SKILL_CAST_HANDLERS, context)
  battle.lastPlayerDamage = Math.max(battle.lastPlayerDamage, context.damage)
  appendBattleLog(battle, {
    turn: battle.turn,
    kind: 'skill',
    amount: context.damage,
    creatureId: member.creatureId,
  })
  return context.animationFrames
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
  if (battle === undefined || battle.mode !== 'wild' || !battle.captureWindow) {
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
  encounter.captureAttempts = Math.min(MAX_CAPTURE_ATTEMPTS, encounter.captureAttempts + 1)
  battle.captureAttempts = encounter.captureAttempts
  state.stats.failedCaptures += 1
  appendBattleLog(battle, { turn: battle.turn, kind: 'capture-failed' })
  const remainingCores = CAPTURE_CORE_QUALITIES.reduce((sum, current) => sum + state.cores[current], 0)
  if (remainingCores > 0) {
    // A failed throw stays inside the capture phase. The player may select a
    // different core, retry, or explicitly continue the battle.
    battle.captureWindow = true
    return 'capture-failed'
  }
  battle.captureWindow = false
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
  notice?: 'capture-success' | 'capture-failed' | 'battle-lost' | 'wild-defeated' | 'tower-cleared' | 'skill-cast' | 'material-used' | 'idle-claimed' | 'creature-released'
  animation?: TraceWildBattleAnimation
} {
  if (action.type === 'set-enabled') {
    if (current.enabled === action.enabled) return { state: current }
    const next = structuredClone(current)
    next.enabled = action.enabled
    // Disabled wall time never turns into an idle reward after re-enabling.
    next.idle.lastSettlementAt = now
    return { state: commit(next, now) }
  }
  if (!current.enabled) throw new TraceWildRuleError('conflict')
  const settled = settleTraceWildIdleRewards(current, now, random)
  const next = structuredClone(settled)
  purgeExpiredEncounters(next, now)
  let notice: 'capture-success' | 'capture-failed' | 'battle-lost' | 'wild-defeated' | 'tower-cleared' | 'skill-cast' | 'material-used' | 'idle-claimed' | 'creature-released' | undefined
  let animation: TraceWildBattleAnimation | undefined
  switch (action.type) {
    case 'choose-starter': {
      if (next.starterChosen || !currentEngineContent().starterCreatureIds.includes(action.creatureId)) {
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
      if (next.battle?.partyHp === 0) {
        logBattleDefeat(next, now, random)
        delete next.battle
        notice = 'battle-lost'
      } else {
        notice = 'skill-cast'
      }
      break
    }
    case 'battle-skip-stage': {
      if (next.battle === undefined) throw new TraceWildRuleError('conflict')
      const battleId = next.battle.id
      const result = skipPlayerStage(next.battle, random)
      if (result.strike !== undefined || result.recovery !== undefined) {
        animation = {
          kind: 'match', battleId, actor: 'player', frames: [],
          ...(result.strike === undefined ? {} : { strike: result.strike }),
          ...(result.recovery === undefined ? {} : { recovery: result.recovery }),
        }
      }
      if (result.outcome === 'battle-lost') {
        logBattleDefeat(next, now, random)
        delete next.battle
        notice = 'battle-lost'
      } else if (result.outcome === 'wild-defeated') {
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
    case 'release-creature': {
      if (next.battle !== undefined || next.creatures.length <= 1) throw new TraceWildRuleError('conflict')
      const creatureIndex = next.creatures.findIndex(row => row.instanceId === action.creatureInstanceId)
      const released = next.creatures[creatureIndex]
      if (creatureIndex < 0 || released === undefined || next.materials[released.quality] >= 9999) {
        throw new TraceWildRuleError('invalid-action')
      }
      next.creatures.splice(creatureIndex, 1)
      next.squad = next.squad.filter(id => id !== released.instanceId)
      if (next.squad.length === 0) next.squad = [next.creatures[0]!.instanceId]
      next.materials[released.quality] += 1
      next.stats.materialsEarned += 1
      logEntry(next, {
        at: now,
        kind: 'release',
        creatureId: released.creatureId,
        ecology: released.firstSignal,
        quality: released.quality,
      }, random)
      notice = 'creature-released'
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
