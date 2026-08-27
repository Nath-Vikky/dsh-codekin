import {
  CAPTURE_CORE_QUALITIES,
  CORE_CAPTURE_MULTIPLIERS,
  CORE_DROP_WEIGHTS,
  STARTER_CREATURE_IDS,
  creatureById,
  creaturesInEcology,
} from './catalog.ts'
import type {
  BattleLogEntry,
  BattleState,
  CaptureCoreQuality,
  CapturedCreature,
  RandomSource,
  TraceEcology,
  TraceLogEntry,
  TraceSignal,
  TraceWildAction,
  TraceWildState,
  WildEncounter,
} from './types.ts'

const MAX_ENCOUNTERS = 12
const MAX_CREATURES = 240
const MAX_PROCESSED_SIGNALS = 256
const MAX_LOG_ENTRIES = 40
const ENCOUNTER_LIFETIME_MS = 72 * 60 * 60 * 1000

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
    schemaVersion: 1,
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

function logEntry(
  state: TraceWildState,
  entry: Omit<TraceLogEntry, 'id'>,
  random: RandomSource,
): void {
  state.log.unshift({ ...entry, id: randomId('log', entry.at, random) })
  state.log = state.log.slice(0, MAX_LOG_ENTRIES)
}

function commit(state: TraceWildState, now: number): TraceWildState {
  state.revision += 1
  state.updatedAt = now
  return state
}

function updateDex(
  state: TraceWildState,
  creatureId: string,
  at: number,
  captured: boolean,
): void {
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
    lumen: [19, 27],
    forge: [80, 27],
    relay: [50, 16],
    aegis: [25, 76],
    glitch: [76, 76],
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
      missing: 'glitch-null-nibbler',
      stack: 'glitch-stack-weaver',
      timeout: 'glitch-lagtoad',
      crash: 'glitch-crashfox',
      overflow: 'glitch-overflow-maw',
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
  if (activeEncounter !== undefined && !state.encounters.some(row => row.id === activeEncounter)) {
    delete state.battle
  }
}

export function applyTraceSignal(
  current: TraceWildState,
  signal: TraceSignal,
  random: RandomSource,
): TraceWildState {
  if (current.processedSignals.includes(signal.id)) return current
  const next = structuredClone(current)
  purgeExpiredEncounters(next, signal.at)
  next.processedSignals.push(signal.id)
  next.processedSignals = next.processedSignals.slice(-MAX_PROCESSED_SIGNALS)

  if (signal.outcome === 'completed') {
    next.stats.completedTurns += 1
    next.stats.currentSuccessStreak += 1
    next.stats.longestSuccessStreak = Math.max(
      next.stats.longestSuccessStreak,
      next.stats.currentSuccessStreak,
    )
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
    const encounter: WildEncounter = {
      id: randomId('wild', signal.at, random),
      creatureId,
      ecology: signal.ecology,
      spawnedAt: signal.at,
      enhanced: signal.enhanced,
      armor: signal.enhanced ? 2 : 0,
      ...point,
    }
    next.encounters.push(encounter)
    updateDex(next, creatureId, signal.at, false)
    logEntry(next, {
      at: signal.at,
      kind: 'encounter',
      creatureId,
      ecology: signal.ecology,
    }, random)
  }

  return commit(next, signal.at)
}

function levelStats(creature: CapturedCreature): { hp: number; attack: number; defense: number; speed: number } {
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

const ADVANTAGE: Readonly<Record<TraceEcology, TraceEcology>> = Object.freeze({
  lumen: 'glitch',
  glitch: 'relay',
  relay: 'forge',
  forge: 'aegis',
  aegis: 'lumen',
})

function affinity(attacker: TraceEcology, defender: TraceEcology): number {
  if (ADVANTAGE[attacker] === defender) return 1.22
  if (ADVANTAGE[defender] === attacker) return 0.84
  return 1
}

function appendBattleLog(battle: BattleState, row: BattleLogEntry): void {
  battle.log.push(row)
  battle.log = battle.log.slice(-8)
}

function counterAttack(
  state: TraceWildState,
  battle: BattleState,
  random: RandomSource,
  power = 1,
): boolean {
  const encounter = state.encounters.find(row => row.id === battle.encounterId)
  const player = state.creatures.find(row => row.instanceId === battle.playerInstanceId)
  const wild = encounter === undefined ? undefined : creatureById(encounter.creatureId)
  const playerDefinition = player === undefined ? undefined : creatureById(player.creatureId)
  if (encounter === undefined || player === undefined || wild === undefined || playerDefinition === undefined) {
    throw new TraceWildRuleError('conflict')
  }
  const playerStats = levelStats(player)
  const rolled = wild.stats.attack * power * (0.82 + boundedRandom(random) * 0.3)
    * affinity(wild.ecology, playerDefinition.ecology)
  let damage = Math.max(2, Math.round(rolled - playerStats.defense * 0.38))
  const absorbed = Math.min(battle.playerShield, damage)
  battle.playerShield -= absorbed
  damage -= absorbed
  battle.playerHp = Math.max(0, battle.playerHp - damage)
  appendBattleLog(battle, { turn: battle.turn, kind: 'counter', amount: damage })
  return battle.playerHp === 0
}

function startBattle(
  state: TraceWildState,
  encounterId: string,
  now: number,
  random: RandomSource,
): void {
  if (!state.starterChosen || state.battle !== undefined) throw new TraceWildRuleError('conflict')
  const encounter = state.encounters.find(row => row.id === encounterId)
  if (encounter === undefined) throw new TraceWildRuleError('invalid-action')
  const player = state.squad
    .map(id => state.creatures.find(row => row.instanceId === id))
    .find(row => row !== undefined) ?? state.creatures[0]
  const wild = creatureById(encounter.creatureId)
  if (player === undefined || wild === undefined) throw new TraceWildRuleError('conflict')
  const playerStats = levelStats(player)
  const enhancedHp = wild.stats.hp + (encounter.enhanced ? 18 : 0)
  state.battle = {
    id: randomId('battle', now, random),
    encounterId,
    playerInstanceId: player.instanceId,
    wildHp: enhancedHp,
    wildMaxHp: enhancedHp,
    wildArmor: encounter.armor,
    playerHp: playerStats.hp,
    playerMaxHp: playerStats.hp,
    playerShield: 0,
    focus: 0,
    turn: 1,
    log: [{ turn: 0, kind: 'start' }],
  }
  state.stats.battlesStarted += 1
}

function performMove(state: TraceWildState, move: 'strike' | 'scan' | 'guard', random: RandomSource): boolean {
  const battle = state.battle
  if (battle === undefined) throw new TraceWildRuleError('conflict')
  const encounter = state.encounters.find(row => row.id === battle.encounterId)
  const player = state.creatures.find(row => row.instanceId === battle.playerInstanceId)
  const wild = encounter === undefined ? undefined : creatureById(encounter.creatureId)
  const playerDefinition = player === undefined ? undefined : creatureById(player.creatureId)
  if (encounter === undefined || player === undefined || wild === undefined || playerDefinition === undefined) {
    throw new TraceWildRuleError('conflict')
  }
  const playerStats = levelStats(player)
  if (move === 'guard') {
    battle.playerShield = Math.min(
      Math.round(battle.playerMaxHp * 0.55),
      battle.playerShield + Math.round(playerStats.defense * 0.9 + 5),
    )
    appendBattleLog(battle, { turn: battle.turn, kind: 'guard', amount: battle.playerShield })
  } else if (battle.wildArmor > 0) {
    battle.wildArmor -= 1
    appendBattleLog(battle, { turn: battle.turn, kind: 'armor-break', amount: battle.wildArmor })
    if (move === 'scan') battle.focus = Math.min(3, battle.focus + 1)
  } else {
    const movePower = move === 'scan' ? 0.55 : 1
    const rolled = playerStats.attack * movePower * (0.85 + boundedRandom(random) * 0.28)
      * affinity(playerDefinition.ecology, wild.ecology)
    const damage = Math.max(2, Math.round(rolled - wild.stats.defense * 0.42))
    battle.wildHp = Math.max(1, battle.wildHp - damage)
    if (move === 'scan') {
      battle.focus = Math.min(3, battle.focus + 1)
      appendBattleLog(battle, { turn: battle.turn, kind: 'scan', amount: damage })
    } else {
      appendBattleLog(battle, { turn: battle.turn, kind: 'hit', amount: damage })
    }
  }

  const defeated = counterAttack(state, battle, random, move === 'guard' ? 0.62 : 1)
  battle.turn += 1
  return defeated
}

function addCapturedCreature(
  state: TraceWildState,
  creatureId: string,
  ecology: TraceEcology,
  now: number,
  random: RandomSource,
): CapturedCreature {
  if (state.creatures.length >= MAX_CREATURES) throw new TraceWildRuleError('conflict')
  const captured: CapturedCreature = {
    instanceId: randomId('pet', now, random),
    creatureId,
    level: 1,
    xp: 0,
    wins: 0,
    caughtAt: now,
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
  if (battle.wildArmor > 0) throw new TraceWildRuleError('conflict')
  if (state.cores[quality] <= 0) throw new TraceWildRuleError('invalid-action')
  const encounter = state.encounters.find(row => row.id === battle.encounterId)
  const wild = encounter === undefined ? undefined : creatureById(encounter.creatureId)
  if (encounter === undefined || wild === undefined) throw new TraceWildRuleError('conflict')
  state.cores[quality] -= 1
  const healthRatio = battle.wildHp / battle.wildMaxHp
  const healthFactor = 0.72 + (1 - healthRatio) * 1.28
  const focusFactor = 1 + battle.focus * 0.1
  const enhancedPenalty = encounter.enhanced ? 0.82 : 1
  const chance = Math.min(
    0.98,
    wild.baseCaptureRate * CORE_CAPTURE_MULTIPLIERS[quality] * healthFactor * focusFactor * enhancedPenalty,
  )
  if (boundedRandom(random) < chance) {
    addCapturedCreature(state, wild.id, encounter.ecology, now, random)
    state.encounters = state.encounters.filter(row => row.id !== encounter.id)
    state.stats.successfulCaptures += 1
    const player = state.creatures.find(row => row.instanceId === battle.playerInstanceId)
    if (player !== undefined) {
      player.wins += 1
      player.xp += 1
      player.level = Math.min(30, 1 + Math.floor(player.xp / 3))
    }
    logEntry(state, { at: now, kind: 'capture', creatureId: wild.id, ecology: wild.ecology }, random)
    delete state.battle
    return 'capture-success'
  }
  state.stats.failedCaptures += 1
  appendBattleLog(battle, { turn: battle.turn, kind: 'capture-failed' })
  const defeated = counterAttack(state, battle, random, 1.08)
  battle.turn += 1
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
): { state: TraceWildState; notice?: 'capture-success' | 'capture-failed' | 'battle-lost' } {
  const next = structuredClone(current)
  purgeExpiredEncounters(next, now)
  let notice: 'capture-success' | 'capture-failed' | 'battle-lost' | undefined
  switch (action.type) {
    case 'choose-starter': {
      if (next.starterChosen || !STARTER_CREATURE_IDS.includes(action.creatureId as typeof STARTER_CREATURE_IDS[number])) {
        throw new TraceWildRuleError('conflict')
      }
      const definition = creatureById(action.creatureId)
      if (definition === undefined) throw new TraceWildRuleError('invalid-action')
      addCapturedCreature(next, definition.id, definition.ecology, now, random)
      next.starterChosen = true
      next.cores.pebble += 2
      logEntry(next, { at: now, kind: 'starter', creatureId: definition.id, ecology: definition.ecology }, random)
      break
    }
    case 'start-battle':
      startBattle(next, action.encounterId, now, random)
      break
    case 'battle-move': {
      const defeated = performMove(next, action.move, random)
      if (defeated) {
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
    case 'capture':
      notice = attemptCapture(next, action.quality, now, random)
      break
    case 'flee':
      if (next.battle === undefined) throw new TraceWildRuleError('conflict')
      delete next.battle
      break
    case 'set-squad': {
      if (action.instanceIds.length === 0 || action.instanceIds.length > 3) {
        throw new TraceWildRuleError('invalid-action')
      }
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
  return notice === undefined ? { state } : { state, notice }
}

function record(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined
}

function safeInt(value: unknown, fallback: number, max = Number.MAX_SAFE_INTEGER): number {
  return Number.isSafeInteger(value) && (value as number) >= 0
    ? Math.min(value as number, max)
    : fallback
}

/** Tolerant, bounded restart loader. Invalid or future data falls back to a fresh profile. */
export function restoreTraceWildState(value: unknown, now = Date.now()): TraceWildState {
  const root = record(value)
  if (root?.schemaVersion !== 1) return createInitialTraceWildState(now)
  const next = createInitialTraceWildState(now)
  next.revision = safeInt(root.revision, 0)
  next.createdAt = safeInt(root.createdAt, now)
  next.updatedAt = safeInt(root.updatedAt, next.createdAt)

  const cores = record(root.cores)
  for (const quality of CAPTURE_CORE_QUALITIES) {
    next.cores[quality] = safeInt(cores?.[quality], 0, 9999)
  }

  const rawCreatures = Array.isArray(root.creatures) ? root.creatures.slice(0, MAX_CREATURES) : []
  const instanceIds = new Set<string>()
  for (const raw of rawCreatures) {
    const row = record(raw)
    if (row === undefined) continue
    const instanceId = typeof row.instanceId === 'string' ? row.instanceId : ''
    const creatureId = typeof row.creatureId === 'string' ? row.creatureId : ''
    if (!/^pet_[a-z0-9_]{8,64}$/.test(instanceId) || instanceIds.has(instanceId)
      || creatureById(creatureId) === undefined) continue
    instanceIds.add(instanceId)
    next.creatures.push({
      instanceId,
      creatureId,
      level: Math.max(1, safeInt(row.level, 1, 30)),
      xp: safeInt(row.xp, 0, 999999),
      wins: safeInt(row.wins, 0, 999999),
      caughtAt: safeInt(row.caughtAt, next.createdAt),
      firstSignal: creatureById(creatureId)!.ecology,
    })
  }
  next.starterChosen = root.starterChosen === true && next.creatures.length > 0
  const rawSquad = Array.isArray(root.squad) ? root.squad : []
  next.squad = [...new Set(rawSquad.filter((id): id is string => (
    typeof id === 'string' && instanceIds.has(id)
  )))].slice(0, 3)
  if (next.squad.length === 0 && next.creatures[0] !== undefined) {
    next.squad = [next.creatures[0].instanceId]
  }

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
        creatureId: creature.creatureId,
        seen: 1,
        captured: 1,
        firstSeenAt: creature.caughtAt,
        lastSeenAt: creature.caughtAt,
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
  // The event log is deliberately cosmetic; restart with a clean log if it cannot be trusted.
  next.log = []
  return next
}
