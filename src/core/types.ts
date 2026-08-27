export type TraceEcology = 'lumen' | 'forge' | 'relay' | 'aegis' | 'glitch'
export type TraceRarity = 'common' | 'uncommon' | 'rare' | 'apex'
export type CaptureCoreQuality = 'pebble' | 'pulse' | 'prism' | 'nova' | 'origin'

export interface CreatureStats {
  hp: number
  attack: number
  defense: number
  speed: number
}

export interface CreatureDefinition {
  number: number
  id: string
  nameZh: string
  nameEn: string
  ecology: TraceEcology
  rarity: TraceRarity
  combatRole: string
  baseCaptureRate: number
  signatureProtocol: string
  spriteIndex: number
  stats: CreatureStats
}

export interface CapturedCreature {
  instanceId: string
  creatureId: string
  quality: CaptureCoreQuality
  level: number
  xp: number
  wins: number
  caughtAt: number
  firstSignal: TraceEcology
}

export interface DexRecord {
  creatureId: string
  seen: number
  captured: number
  firstSeenAt: number
  lastSeenAt: number
}

export interface WildEncounter {
  id: string
  creatureId: string
  ecology: TraceEcology
  spawnedAt: number
  enhanced: boolean
  armor: number
  mapX: number
  mapY: number
}

export type TileSpecial = 'none' | 'row' | 'column' | 'burst' | 'origin'

export interface MatchTile {
  ecology: TraceEcology
  special: TileSpecial
}

export interface MatchCascadeFrame {
  chain: number
  before: MatchTile[]
  after: MatchTile[]
  removed: number[]
  fallRows: number[]
}

export interface TraceWildBattleAnimation {
  kind: 'match'
  battleId: string
  frames: MatchCascadeFrame[]
}

export interface BattlePartyMember {
  instanceId: string
  creatureId: string
  quality: CaptureCoreQuality
  level: number
  hp: number
  maxHp: number
  shield: number
  energy: number
  skillUsedStage: boolean
  passiveRound: number
  passiveStage: number
  passiveBattleUsed: boolean
  reviveUsed: boolean
  counterPower: number
  overcharge: number
}

export type EnemyIntent = 'strike' | 'guard' | 'disrupt' | 'corrupt' | 'mark'

export interface BattleLogEntry {
  turn: number
  kind:
    | 'start'
    | 'match'
    | 'combo'
    | 'armor-break'
    | 'skill'
    | 'heal'
    | 'shield'
    | 'enemy'
    | 'enemy-shield'
    | 'enemy-delay'
    | 'switch'
    | 'capture-failed'
    | 'defeat'
  amount?: number
  creatureId?: string
  ecology?: TraceEcology
  multiplier?: number
}

export interface BattleState {
  id: string
  encounterId: string
  wildCreatureId: string
  board: MatchTile[]
  party: BattlePartyMember[]
  activeIndex: number
  actionsRemaining: number
  stage: number
  round: number
  wildHp: number
  wildMaxHp: number
  wildArmor: number
  wildShield: number
  wildDefense: number
  enemyIntent: EnemyIntent
  enemyMarks: number
  enemyBurn: number
  enemyDelayed: number
  affinityFloorActions: number
  boardLockActions: number
  repeatPower: number
  lastPlayerDamage: number
  turn: number
  log: BattleLogEntry[]
}

export interface TraceWildStats {
  completedTurns: number
  failedTurns: number
  successfulCaptures: number
  failedCaptures: number
  battlesStarted: number
  currentSuccessStreak: number
  longestSuccessStreak: number
}

export interface TraceLogEntry {
  id: string
  at: number
  kind: 'core-drop' | 'encounter' | 'capture' | 'starter' | 'defeat'
  ecology?: TraceEcology
  creatureId?: string
  quality?: CaptureCoreQuality
}

export interface TraceWildState {
  schemaVersion: 2
  revision: number
  createdAt: number
  updatedAt: number
  starterChosen: boolean
  cores: Record<CaptureCoreQuality, number>
  creatures: CapturedCreature[]
  squad: string[]
  dex: DexRecord[]
  encounters: WildEncounter[]
  battle?: BattleState
  stats: TraceWildStats
  processedSignals: string[]
  log: TraceLogEntry[]
}

export interface TraceSignal {
  id: string
  at: number
  ecology: TraceEcology
  outcome: 'completed' | 'failed'
  intensity: number
  enhanced: boolean
  variant?: 'missing' | 'timeout' | 'stack' | 'crash' | 'overflow'
}

export type TraceWildAction =
  | { type: 'choose-starter'; creatureId: string }
  | { type: 'start-battle'; encounterId: string }
  | { type: 'battle-swap'; from: number; to: number }
  | { type: 'battle-cast'; creatureInstanceId: string }
  | { type: 'capture'; quality: CaptureCoreQuality }
  | { type: 'flee' }
  | { type: 'set-squad'; instanceIds: string[] }

export interface TraceWildSnapshot {
  schemaVersion: 2
  state: TraceWildState
  serverTime: number
}

export interface TraceWildActionResponse extends TraceWildSnapshot {
  ok: true
  notice?: 'capture-success' | 'capture-failed' | 'battle-lost' | 'skill-cast'
  animation?: TraceWildBattleAnimation
}

export interface TraceWildFailureResponse {
  ok: false
  error: 'invalid-action' | 'conflict' | 'unavailable'
}

export type RandomSource = () => number
