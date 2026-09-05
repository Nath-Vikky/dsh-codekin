import {
  CAPTURE_CORE_QUALITIES,
  TRACE_ECOLOGIES,
} from '../../content-sdk/src/types.ts'
import {
  BASE_ACTIONS_PER_CREATURE,
  BASE_BOSS_ACTIONS,
  BOSS_SKILL_ENERGY_LIMIT,
  MAX_ACTIONS_PER_CREATURE,
  MAX_BOSS_ACTIONS,
  MAX_BOSS_BONUS_ACTIONS,
  MAX_BOSS_SWAPS_PER_PHASE,
  MAX_BONUS_ACTIONS_PER_STAGE,
  MAX_CAPTURE_ATTEMPTS,
  MAX_MAP_ENCOUNTERS,
  MAX_PLAYER_LEVEL,
  effectivePartyLevel,
  encounterLifetimeMs,
  levelForXp,
  playerStats,
  threatPoints,
  totalXpForLevel,
  wildStats,
} from './balance.ts'
import { currentEngineContent } from './content.ts'
import { CREATURE_EVOLUTION_LEVEL } from './appearance.ts'
import { MATCH_BOARD_CELLS, findFirstLegalBattleSwap } from './match3.ts'
import {
  ENERGY_LIMIT,
  MAX_AMPLIFIERS_PER_SIDE,
  MAX_CREATURES,
  MAX_IDLE_ELAPSED_MS,
  MAX_PROCESSED_SIGNALS,
  createInitialTraceWildState,
  emptyQualityCounts,
  purgeExpiredEncounters,
} from './state.ts'
import {
  MAX_TOWER_FLOOR,
  emptyTowerMaterialReward,
  towerBossStats,
  towerFloorProfile,
} from './tower.ts'
import type {
  BattleAmplifier,
  BattlePartyMember,
  BattleState,
  CaptureCoreQuality,
  CapturedCreature,
  CreatureStats,
  EnemyIntent,
  MatchTile,
  TileSpecial,
  TraceEcology,
  TraceWildIdleReward,
  TraceWildState,
} from './types.ts'

const creatureById = (id: string) => currentEngineContent().creature(id)

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
  const materials = emptyQualityCounts()
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
    const hazardActions = safeInt(row.hazardActions, 0, 3)
    board.push({
      ecology: row.ecology,
      special: row.special,
      ...(lockedActions > 0 ? { lockedActions } : {}),
      ...(hazardActions > 0 ? { hazardActions } : {}),
    })
  }
  return findFirstLegalBattleSwap(board) === undefined ? undefined : board
}

function sameAmplifier(left: BattleAmplifier, right: BattleAmplifier): boolean {
  return left.signal === right.signal && left.stat === right.stat && left.scope === right.scope
    && left.targetInstanceId === right.targetInstanceId
}

function restoreAmplifiers(
  value: unknown,
  side: 'player' | 'boss',
  party: readonly BattlePartyMember[],
): BattleAmplifier[] {
  if (!Array.isArray(value)) return []
  const restored: BattleAmplifier[] = []
  for (const raw of value.slice(0, MAX_AMPLIFIERS_PER_SIDE)) {
    const row = record(raw)
    if (row === undefined
      || row.signal !== 'sync' && row.signal !== 'overclock' && row.signal !== 'breach'
      || !isEcology(row.ecology)
      || row.stat !== 'attack' && row.stat !== 'penetration'
      || row.scope !== 'team' && row.scope !== 'member' && row.scope !== 'self' && row.scope !== 'opponent') continue
    if (side === 'player' && row.scope !== 'team' && row.scope !== 'member' && row.scope !== 'opponent') continue
    if (side === 'boss' && row.scope !== 'self' && row.scope !== 'opponent') continue
    const targetInstanceId = typeof row.targetInstanceId === 'string' ? row.targetInstanceId : undefined
    if (row.scope === 'member' && (targetInstanceId === undefined
      || !party.some(member => member.instanceId === targetInstanceId))) continue
    if (row.scope !== 'member' && targetInstanceId !== undefined) continue
    const amplifier: BattleAmplifier = {
      signal: row.signal,
      ecology: row.ecology,
      stat: row.stat,
      scope: row.scope,
      valuePermille: Math.max(10, safeInt(row.valuePermille, 10, 500)),
      remainingRounds: Math.max(1, safeInt(row.remainingRounds, 1, 3)),
      ...(targetInstanceId === undefined ? {} : { targetInstanceId }),
    }
    if (!restored.some(value => sameAmplifier(value, amplifier))) restored.push(amplifier)
  }
  return restored
}

function capturedStats(creature: CapturedCreature): CreatureStats | undefined {
  const definition = creatureById(creature.creatureId)
  return definition === undefined ? undefined : playerStats(definition.stats, creature.level, creature.quality)
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

function syncLegacyPartyHealth(battle: BattleState): void {
  const ratio = battle.partyMaxHp <= 0 ? 0 : battle.partyHp / battle.partyMaxHp
  for (const member of battle.party) {
    member.hp = battle.partyHp <= 0 ? 0 : Math.max(1, Math.min(member.maxHp, Math.round(member.maxHp * ratio)))
    member.shield = 0
  }
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
    const stats = capturedStats(captured)
    if (stats === undefined) return undefined
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
      skillSealedStages: safeInt(row.skillSealedStages, 0, 1),
    })
  }
  const activeIndex = safeInt(raw.activeIndex, 0, party.length - 1)
  const partyMaxHp = party.reduce((sum, member) => sum + member.maxHp, 0)
  const legacyPartyHp = party.reduce((sum, member) => sum + member.hp, 0)
  const partyHp = Math.min(partyMaxHp, safeInt(raw.partyHp, legacyPartyHp, partyMaxHp))
  if (partyHp <= 0) return undefined
  const id = typeof raw.id === 'string' && /^battle_[a-z0-9_]{8,64}$/.test(raw.id) ? raw.id : ''
  if (id === '') return undefined
  const rawEnemyIntent = raw.enemyIntent === 'sweep' ? 'strike' : raw.enemyIntent
  if (rawEnemyIntent !== 'strike' && rawEnemyIntent !== 'guard' && rawEnemyIntent !== 'disrupt'
    && rawEnemyIntent !== 'corrupt' && rawEnemyIntent !== 'mark'
    && rawEnemyIntent !== 'lock' && rawEnemyIntent !== 'freeze') return undefined
  const enemyIntent: EnemyIntent = rawEnemyIntent
  const partyAverageLevel = party.reduce((sum, member) => sum + member.level, 0) / party.length
  const battleLevel = encounter?.level ?? towerProfile!.level
  const battleQuality = encounter?.quality ?? towerProfile!.quality
  const fallbackWildStats = towerProfile === undefined
    ? wildStats(wild, battleLevel, battleQuality, party.length, partyAverageLevel)
    : towerBossStats(wild, towerProfile, party.length, partyAverageLevel)
  const wildMaxHp = towerProfile === undefined
    ? Math.max(1, safeInt(raw.wildMaxHp, fallbackWildStats.hp, 9_999_999))
    : fallbackWildStats.hp
  const defaultTarget = enemyTargetFor({ activeIndex }, enemyIntent)
  const persistedTargetIndex = Number.isSafeInteger(raw.enemyTargetIndex)
    && (raw.enemyTargetIndex as number) >= 0 && (raw.enemyTargetIndex as number) < party.length
    ? raw.enemyTargetIndex as number
    : undefined
  const restoredTarget = defaultTarget.scope === 'member' && persistedTargetIndex !== undefined
    ? { scope: defaultTarget.scope, index: persistedTargetIndex }
    : defaultTarget
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
  const restored: BattleState = {
    id,
    encounterId,
    wildCreatureId: wild.id,
    mode,
    ...(towerProfile === undefined ? {} : { towerFloor: towerProfile.floor }),
    bossSkillTier: towerProfile?.skillTier
      ?? bossSkillTierForThreat(threatPoints(battleLevel, battleQuality)),
    board,
    party,
    partyHp,
    partyMaxHp,
    partyShield: safeInt(
      raw.partyShield,
      party.reduce((sum, member) => sum + member.shield, 0),
      partyMaxHp,
    ),
    pendingPartyHealing: turnOwner === 'player'
      ? safeInt(raw.pendingPartyHealing, 0, partyMaxHp - partyHp)
      : 0,
    pendingPartyShielding: turnOwner === 'player'
      ? safeInt(raw.pendingPartyShielding, 0, partyMaxHp)
      : 0,
    partyAmplifiers: restoreAmplifiers(raw.partyAmplifiers, 'player', party),
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
    pendingBossDamage: 0,
    bossDamageScale: Math.max(900, safeInt(raw.bossDamageScale, 1000, 1100)),
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
    pendingWildHealing: turnOwner === 'boss'
      ? safeInt(raw.pendingWildHealing, 0, wildMaxHp)
      : 0,
    pendingWildShielding: turnOwner === 'boss'
      ? safeInt(raw.pendingWildShielding, 0, wildMaxHp)
      : 0,
    bossAmplifiers: restoreAmplifiers(raw.bossAmplifiers, 'boss', party),
    wildDefense: towerProfile === undefined
      ? safeInt(raw.wildDefense, fallbackWildStats.defense, 999_999)
      : fallbackWildStats.defense,
    wildAttack: towerProfile === undefined
      ? safeInt(raw.wildAttack, fallbackWildStats.attack, 999_999)
      : fallbackWildStats.attack,
    wildLevel: battleLevel,
    wildQuality: battleQuality,
    enemyIntent,
    enemyTargetScope: restoredTarget.scope,
    ...(restoredTarget.index === undefined ? {} : { enemyTargetIndex: restoredTarget.index }),
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
  restored.pendingBossDamage = turnOwner === 'boss'
    ? safeInt(raw.pendingBossDamage, 0, partyHp + restored.partyShield)
    : 0
  restored.pendingPartyHealing = Math.min(
    restored.pendingPartyHealing,
    Math.max(0, restored.partyMaxHp - restored.partyHp),
  )
  restored.pendingPartyShielding = Math.min(
    restored.pendingPartyShielding,
    Math.max(0, Math.round(restored.partyMaxHp * 0.6) - restored.partyShield),
  )
  restored.pendingWildHealing = Math.min(
    restored.pendingWildHealing,
    Math.max(0, restored.wildMaxHp - restored.wildHp),
  )
  restored.pendingWildShielding = Math.min(
    restored.pendingWildShielding,
    Math.max(0, Math.round(restored.wildMaxHp * 0.4) - restored.wildShield),
  )
  syncLegacyPartyHealth(restored)
  return restored
}

/** Tolerant, bounded loader with schema-v1/v2 migration. Invalid or future data starts a fresh profile. */
export function restoreTraceWildState(value: unknown, now = Date.now()): TraceWildState {
  const root = record(value)
  if (root?.schemaVersion !== 1 && root?.schemaVersion !== 2 && root?.schemaVersion !== 3) return createInitialTraceWildState(now)
  const next = createInitialTraceWildState(now)
  next.enabled = root.enabled !== false
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
    const level = levelForXp(savedXp, quality)
    const appearance = savedLevel < CREATURE_EVOLUTION_LEVEL && level >= CREATURE_EVOLUTION_LEVEL
      ? 'evolved'
      : row.appearance === 'original' || (row.appearance === 'evolved' && level >= CREATURE_EVOLUTION_LEVEL)
        ? row.appearance
        : undefined
    next.creatures.push({
      instanceId,
      creatureId,
      quality,
      level,
      ...(appearance === undefined ? {} : { appearance }),
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

  const rawDex = Array.isArray(root.dex)
    ? root.dex.slice(0, currentEngineContent().creatures.length)
    : []
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
