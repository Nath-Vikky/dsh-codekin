export type TraceEcology = 'lumen' | 'forge' | 'relay' | 'aegis' | 'glitch'
export type TraceRarity = 'common' | 'uncommon' | 'rare' | 'apex'
export type CaptureCoreQuality = 'pebble' | 'pulse' | 'prism' | 'nova' | 'origin'
export type IndividualQuality = CaptureCoreQuality
export type GrowthMaterialQuality = CaptureCoreQuality

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
  quality: IndividualQuality
  level: number
  captureAttempts: number
  spawnedAt: number
  expiresAt: number
  enhanced: boolean
  armor: number
  mapX: number
  mapY: number
}

export type TileSpecial = 'none' | 'row' | 'column' | 'burst' | 'origin'

export interface MatchTile {
  ecology: TraceEcology
  special: TileSpecial
  lockedActions?: number
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
  actor?: 'player' | 'boss'
  swap?: { from: number; to: number }
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
  stageDamage: number
  frozenStages: number
}

export type EnemyIntent = 'strike' | 'sweep' | 'guard' | 'disrupt' | 'corrupt' | 'mark' | 'lock' | 'freeze'
export type EnemyTargetScope = 'single' | 'all' | 'self'

export interface BattleContribution {
  instanceId: string
  amount: number
}

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
    | 'enemy-sweep'
    | 'enemy-shield'
    | 'enemy-delay'
    | 'enemy-lock'
    | 'enemy-freeze'
    | 'boss-match'
    | 'boss-combo'
    | 'boss-energy'
    | 'boss-action-refund'
    | 'boss-action-bonus'
    | 'boss-skill'
    | 'stage-skip'
    | 'frozen-skip'
    | 'phase-shift'
    | 'switch'
    | 'action-refund'
    | 'action-bonus'
    | 'team-strike'
    | 'capture-failed'
    | 'wild-defeated'
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
  mode: 'wild' | 'tower'
  towerFloor?: number
  bossSkillTier: 1 | 2 | 3 | 4 | 5
  board: MatchTile[]
  party: BattlePartyMember[]
  turnOwner: 'player' | 'boss'
  activeIndex: number
  actionsRemaining: number
  bossActionsRemaining: number
  bossActionsTaken: number
  bossEnergy: number
  bossAttackCharge: number
  bossBonusActionsGranted: number
  bossSkillArmed: boolean
  lastBossAttack: number
  lastBossMatch: number
  stage: number
  round: number
  wildHp: number
  wildMaxHp: number
  wildArmor: number
  wildShield: number
  wildDefense: number
  wildAttack: number
  wildLevel: number
  wildQuality: IndividualQuality
  enemyIntent: EnemyIntent
  enemyTargetScope: EnemyTargetScope
  enemyTargetIndex?: number
  enemyMarks: number
  enemyBurn: number
  enemyDelayed: number
  affinityFloorActions: number
  boardLockActions: number
  repeatPower: number
  lastPlayerDamage: number
  pendingTeamDamage: number
  lastTeamStrike: number
  lastTeamDamageApplied: number
  lastTeamContributions: BattleContribution[]
  bonusActionsGranted: number
  captureWindow: boolean
  captureAttempts: number
  enemyHardControlCooldown: number
  enemyPhase: number
  turn: number
  log: BattleLogEntry[]
}

export interface TraceWildStats {
  completedTurns: number
  failedTurns: number
  successfulCaptures: number
  failedCaptures: number
  battlesStarted: number
  wildDefeats: number
  materialsEarned: number
  currentSuccessStreak: number
  longestSuccessStreak: number
}

export interface TraceWildTowerReward {
  floor: number
  materials: Record<GrowthMaterialQuality, number>
  awardedAt: number
}

export interface TraceWildTowerState {
  highestClearedFloor: number
  attempts: number
  clears: number
  lastReward?: TraceWildTowerReward
}

export interface TraceLogEntry {
  id: string
  at: number
  kind: 'core-drop' | 'material-drop' | 'idle-reward' | 'encounter' | 'capture' | 'starter' | 'wild-defeat' | 'tower-clear' | 'defeat'
  ecology?: TraceEcology
  creatureId?: string
  quality?: CaptureCoreQuality
}

export interface TraceWildRewardPity {
  wildHighQualityMisses: number
  coreHighQualityMisses: number
}

export interface TraceWildIdleReward {
  settledAt: number
  elapsedMinutes: number
  coreQuality?: CaptureCoreQuality
  materials: Record<GrowthMaterialQuality, number>
}

export interface TraceWildIdleState {
  lastSettlementAt: number
  pendingReward?: TraceWildIdleReward
  lastReward?: TraceWildIdleReward
}

export interface TraceWildState {
  schemaVersion: 3
  revision: number
  createdAt: number
  updatedAt: number
  starterChosen: boolean
  cores: Record<CaptureCoreQuality, number>
  materials: Record<GrowthMaterialQuality, number>
  creatures: CapturedCreature[]
  squad: string[]
  dex: DexRecord[]
  encounters: WildEncounter[]
  battle?: BattleState
  stats: TraceWildStats
  rewardPity: TraceWildRewardPity
  idle: TraceWildIdleState
  tower: TraceWildTowerState
  processedSignals: string[]
  log: TraceLogEntry[]
}

export interface TraceSignal {
  id: string
  at: number
  ecology: TraceEcology
  outcome: 'completed' | 'failed'
  intensity: number
  activeMinutes: number
  enhanced: boolean
  variant?: 'missing' | 'timeout' | 'stack' | 'crash' | 'overflow'
}

export type TraceWildAction =
  | { type: 'choose-starter'; creatureId: string }
  | { type: 'start-battle'; encounterId: string }
  | { type: 'start-tower' }
  | { type: 'battle-swap'; from: number; to: number }
  | { type: 'battle-cast'; creatureInstanceId: string }
  | { type: 'battle-skip-stage' }
  | { type: 'battle-continue' }
  | { type: 'capture'; quality: CaptureCoreQuality }
  | { type: 'claim-idle-reward' }
  | { type: 'feed-material'; creatureInstanceId: string; quality: GrowthMaterialQuality; count: number }
  | { type: 'flee' }
  | { type: 'set-squad'; instanceIds: string[] }

export interface TraceWildSnapshot {
  schemaVersion: 3
  state: TraceWildState
  serverTime: number
}

export interface TraceWildActionResponse extends TraceWildSnapshot {
  ok: true
  notice?: 'capture-success' | 'capture-failed' | 'battle-lost' | 'wild-defeated' | 'tower-cleared' | 'skill-cast' | 'material-used' | 'idle-claimed'
  animation?: TraceWildBattleAnimation
}

export interface TraceWildFailureResponse {
  ok: false
  error: 'invalid-action' | 'conflict' | 'unavailable'
}

export type RandomSource = () => number
