import type {
  CaptureCoreQuality,
  CapturedCreature,
  CreatureDefinition,
  CreatureStats,
  GrowthMaterialQuality,
  IndividualQuality,
  TraceRarity,
} from './types.ts'

export const MAX_PLAYER_LEVEL = 100
export const BASE_ACTIONS_PER_CREATURE = 3
export const MAX_ACTIONS_PER_CREATURE = 5
export const MAX_BONUS_ACTIONS_PER_STAGE = 2
export const BASE_BOSS_ACTIONS = 3
export const MAX_BOSS_ACTIONS = 5
export const MAX_BOSS_BONUS_ACTIONS = 2
export const MAX_BOSS_SWAPS_PER_PHASE = 7
export const BOSS_SKILL_ENERGY_COST = 12
export const BOSS_SKILL_ENERGY_LIMIT = 24
export const CAPTURE_HEALTH_RATIO = 0.50
// Capture is now an explicit phase rather than a fixed three-roll prompt.
// Keep only a generous persistence/mercy-history bound; gameplay ends the
// phase when the player abandons it or has no capture cores left.
export const MAX_CAPTURE_ATTEMPTS = 999_999
export const MAX_MAP_ENCOUNTERS = 7

const MINUTE_MS = 60 * 1000

const ENCOUNTER_LIFETIME_MINUTES: Readonly<Record<
  IndividualQuality,
  Readonly<{ lowLevel: number; highLevel: number }>
>> = Object.freeze({
  // Common finds are deliberately forgiving: a player can return the next day
  // without the whole map having silently reset.
  pebble: Object.freeze({ lowLevel: 24 * 60, highLevel: 12 * 60 }),
  pulse: Object.freeze({ lowLevel: 12 * 60, highLevel: 6 * 60 }),
  prism: Object.freeze({ lowLevel: 6 * 60, highLevel: 2 * 60 }),
  nova: Object.freeze({ lowLevel: 90, highLevel: 40 }),
  origin: Object.freeze({ lowLevel: 60, highLevel: 30 }),
})

export const QUALITY_ORDER = Object.freeze([
  'pebble', 'pulse', 'prism', 'nova', 'origin',
] as const satisfies readonly IndividualQuality[])

export const PLAYER_QUALITY_BASE_MULTIPLIERS: Readonly<Record<IndividualQuality, number>> = Object.freeze({
  pebble: 0.82,
  pulse: 0.91,
  prism: 1,
  nova: 1.11,
  origin: 1.24,
})

export const PLAYER_QUALITY_GROWTH_BONUSES: Readonly<Record<IndividualQuality, number>> = Object.freeze({
  pebble: 0.72,
  pulse: 0.86,
  prism: 1.02,
  nova: 1.2,
  origin: 1.42,
})

/** @deprecated Use PLAYER_QUALITY_BASE_MULTIPLIERS for new balance work. */
export const PLAYER_QUALITY_MULTIPLIERS = PLAYER_QUALITY_BASE_MULTIPLIERS

export const XP_QUALITY_MULTIPLIERS: Readonly<Record<IndividualQuality, number>> = Object.freeze({
  pebble: 0.72,
  pulse: 0.86,
  prism: 1,
  nova: 1.28,
  origin: 1.65,
})

export const CORE_CAPTURE_POWER: Readonly<Record<CaptureCoreQuality, number>> = Object.freeze({
  pebble: 0.72,
  pulse: 1,
  prism: 1.38,
  nova: 1.9,
  origin: 2.6,
})

export const WILD_QUALITY_RESISTANCE: Readonly<Record<IndividualQuality, number>> = Object.freeze({
  pebble: 1,
  pulse: 0.92,
  prism: 0.82,
  nova: 0.7,
  origin: 0.56,
})

export const MATERIAL_XP: Readonly<Record<GrowthMaterialQuality, number>> = Object.freeze({
  pebble: 40,
  pulse: 100,
  prism: 250,
  nova: 650,
  origin: 1600,
})

const WILD_QUALITY_WEIGHTS = Object.freeze([
  Object.freeze({ pebble: 78, pulse: 19, prism: 3, nova: 0, origin: 0 }),
  Object.freeze({ pebble: 64, pulse: 27, prism: 8, nova: 1, origin: 0 }),
  Object.freeze({ pebble: 50, pulse: 32, prism: 14, nova: 4, origin: 0 }),
  Object.freeze({ pebble: 38, pulse: 34, prism: 20, nova: 7, origin: 1 }),
  Object.freeze({ pebble: 28, pulse: 32, prism: 25, nova: 12, origin: 3 }),
  Object.freeze({ pebble: 20, pulse: 29, prism: 29, nova: 17, origin: 5 }),
] satisfies readonly Readonly<Record<IndividualQuality, number>>[])

const CORE_QUALITY_WEIGHTS = Object.freeze([
  Object.freeze({ pebble: 70, pulse: 23, prism: 6, nova: 1, origin: 0 }),
  Object.freeze({ pebble: 58, pulse: 28, prism: 11, nova: 3, origin: 0 }),
  Object.freeze({ pebble: 46, pulse: 31, prism: 17, nova: 5, origin: 1 }),
  Object.freeze({ pebble: 35, pulse: 32, prism: 23, nova: 8, origin: 2 }),
  Object.freeze({ pebble: 27, pulse: 31, prism: 27, nova: 12, origin: 3 }),
  Object.freeze({ pebble: 22, pulse: 29, prism: 28, nova: 16, origin: 5 }),
] satisfies readonly Readonly<Record<CaptureCoreQuality, number>>[])

export const MATERIAL_DROP_WEIGHTS: Readonly<Record<IndividualQuality, Readonly<Record<GrowthMaterialQuality, number>>>> = Object.freeze({
  pebble: Object.freeze({ pebble: 82, pulse: 17, prism: 1, nova: 0, origin: 0 }),
  pulse: Object.freeze({ pebble: 30, pulse: 60, prism: 10, nova: 0, origin: 0 }),
  prism: Object.freeze({ pebble: 8, pulse: 27, prism: 58, nova: 7, origin: 0 }),
  nova: Object.freeze({ pebble: 2, pulse: 8, prism: 28, nova: 57, origin: 5 }),
  origin: Object.freeze({ pebble: 0, pulse: 3, prism: 12, nova: 35, origin: 50 }),
})

const IDLE_QUALITY_WEIGHTS = Object.freeze([
  Object.freeze({ pebble: 80, pulse: 18, prism: 2, nova: 0, origin: 0 }),
  Object.freeze({ pebble: 65, pulse: 27, prism: 7, nova: 1, origin: 0 }),
  Object.freeze({ pebble: 50, pulse: 31, prism: 15, nova: 4, origin: 0 }),
  Object.freeze({ pebble: 45, pulse: 31, prism: 18, nova: 6, origin: 0 }),
] satisfies readonly Readonly<Record<CaptureCoreQuality, number>>[])

const WILD_HP_QUALITY: Readonly<Record<IndividualQuality, number>> = Object.freeze({
  pebble: 1,
  pulse: 1.12,
  prism: 1.28,
  nova: 1.48,
  origin: 1.75,
})

const WILD_ATTACK_QUALITY: Readonly<Record<IndividualQuality, number>> = Object.freeze({
  pebble: 1,
  pulse: 1.04,
  prism: 1.09,
  nova: 1.15,
  origin: 1.23,
})

const WILD_DEFENSE_QUALITY: Readonly<Record<IndividualQuality, number>> = Object.freeze({
  pebble: 1,
  pulse: 1.04,
  prism: 1.09,
  nova: 1.15,
  origin: 1.23,
})

const SPECIES_CAPTURE_CAP: Readonly<Record<TraceRarity, number>> = Object.freeze({
  common: 0.95,
  uncommon: 0.9,
  rare: 0.82,
  apex: 0.72,
})

const QUALITY_LEVEL_BONUS = Object.freeze([0, 1, 3, 6, 10] as const)
const QUALITY_LEVEL_CAP = Object.freeze([6, 8, 11, 14, 18] as const)

function boundedMinutes(value: number): number {
  return Number.isFinite(value) ? Math.min(180, Math.max(0, value)) : 0
}

export function qualityIndex(quality: IndividualQuality): number {
  return QUALITY_ORDER.indexOf(quality)
}

/**
 * Host-authoritative time for a wild encounter to remain on the map.
 * Level pressure reaches its cap at level 50 so genuinely threatening Nova
 * and Origin encounters settle near the requested 30-minute window, while
 * low-quality encounters remain available for many hours.
 */
export function encounterLifetimeMs(quality: IndividualQuality, levelValue: number): number {
  const level = Number.isFinite(levelValue) ? Math.min(MAX_PLAYER_LEVEL, Math.max(1, Math.round(levelValue))) : 1
  const pressure = Math.min(1, (level - 1) / 49)
  const profile = ENCOUNTER_LIFETIME_MINUTES[quality]
  const minutes = Math.round(profile.lowLevel + (profile.highLevel - profile.lowLevel) * pressure)
  return minutes * MINUTE_MS
}

export function activeMinuteBand(activeMinutes: number): number {
  const minutes = boundedMinutes(activeMinutes)
  if (minutes < 5) return 0
  if (minutes < 15) return 1
  if (minutes < 30) return 2
  if (minutes < 60) return 3
  if (minutes < 120) return 4
  return 5
}

export function wildQualityWeights(activeMinutes: number): Readonly<Record<IndividualQuality, number>> {
  return WILD_QUALITY_WEIGHTS[activeMinuteBand(activeMinutes)]!
}

export function coreQualityWeights(activeMinutes: number): Readonly<Record<CaptureCoreQuality, number>> {
  return CORE_QUALITY_WEIGHTS[activeMinuteBand(activeMinutes)]!
}

export function idleRewardTier(elapsedMinutesValue: number): {
  materialCount: number
  coreCount: 0 | 1
  weights?: Readonly<Record<CaptureCoreQuality, number>>
} {
  const elapsedMinutes = Number.isFinite(elapsedMinutesValue) ? Math.max(0, elapsedMinutesValue) : 0
  if (elapsedMinutes < 60) return { materialCount: 0, coreCount: 0 }
  if (elapsedMinutes < 180) return { materialCount: 1, coreCount: 1, weights: IDLE_QUALITY_WEIGHTS[0]! }
  if (elapsedMinutes < 360) return { materialCount: 2, coreCount: 1, weights: IDLE_QUALITY_WEIGHTS[1]! }
  if (elapsedMinutes < 720) return { materialCount: 3, coreCount: 1, weights: IDLE_QUALITY_WEIGHTS[2]! }
  return { materialCount: 4, coreCount: 1, weights: IDLE_QUALITY_WEIGHTS[3]! }
}

const PLAYER_STAT_REFERENCES: Readonly<CreatureStats> = Object.freeze({
  hp: 1_380,
  attack: 192,
  defense: 124,
  speed: 112,
})

function playerLevelProgress(levelValue: number): number {
  const level = Math.min(MAX_PLAYER_LEVEL, Math.max(1, Math.round(levelValue)))
  return Math.pow((level - 1) / (MAX_PLAYER_LEVEL - 1), 0.86)
}

function playerStatAptitude(baseValue: number, referenceValue: number): number {
  const ratio = Math.max(0.1, baseValue) / referenceValue
  return Math.min(1.18, Math.max(0.82, 1 + 0.38 * (ratio - 1)))
}

export function playerLevelFactor(levelValue: number, quality: IndividualQuality = 'prism'): number {
  return 1 + PLAYER_QUALITY_GROWTH_BONUSES[quality] * playerLevelProgress(levelValue)
}

function scaledPlayerStat(
  baseValue: number,
  referenceValue: number,
  level: number,
  quality: IndividualQuality,
): number {
  const baseFactor = PLAYER_QUALITY_BASE_MULTIPLIERS[quality]
  const growth = PLAYER_QUALITY_GROWTH_BONUSES[quality]
    * playerLevelProgress(level)
    * playerStatAptitude(baseValue, referenceValue)
  return Math.max(1, Math.round(baseValue * baseFactor * (1 + growth)))
}

export function playerStats(
  base: Readonly<CreatureStats>,
  level: number,
  quality: IndividualQuality,
): CreatureStats {
  return {
    hp: scaledPlayerStat(base.hp, PLAYER_STAT_REFERENCES.hp, level, quality),
    attack: scaledPlayerStat(base.attack, PLAYER_STAT_REFERENCES.attack, level, quality),
    defense: scaledPlayerStat(base.defense, PLAYER_STAT_REFERENCES.defense, level, quality),
    speed: scaledPlayerStat(base.speed, PLAYER_STAT_REFERENCES.speed, level, quality),
  }
}

export function xpToNextLevel(levelValue: number, quality: IndividualQuality = 'prism'): number {
  const level = Math.min(MAX_PLAYER_LEVEL - 1, Math.max(1, Math.round(levelValue)))
  return Math.max(1, Math.round((16 + 3 * level + 0.09 * level * level) * XP_QUALITY_MULTIPLIERS[quality]))
}

export function totalXpForLevel(levelValue: number, quality: IndividualQuality = 'prism'): number {
  const target = Math.min(MAX_PLAYER_LEVEL, Math.max(1, Math.round(levelValue)))
  let total = 0
  for (let level = 1; level < target; level += 1) total += xpToNextLevel(level, quality)
  return total
}

export function levelForXp(xpValue: number, quality: IndividualQuality = 'prism'): number {
  const xp = Number.isSafeInteger(xpValue) ? Math.max(0, xpValue) : 0
  let level = 1
  let threshold = 0
  while (level < MAX_PLAYER_LEVEL) {
    const next = xpToNextLevel(level, quality)
    if (threshold + next > xp) break
    threshold += next
    level += 1
  }
  return level
}

export function sessionLevel(activeMinutes: number): number {
  return Math.round(1 + 99 * (1 - Math.exp(-boundedMinutes(activeMinutes) / 90)))
}

export function effectivePartyLevel(party: readonly CapturedCreature[]): number {
  if (party.length === 0) return 1
  const total = party.reduce((sum, creature) => (
    sum + creature.level + QUALITY_LEVEL_BONUS[qualityIndex(creature.quality)]!
  ), 0)
  return Math.min(100, Math.max(1, Math.round(total / party.length)))
}

export function wildLevelFor(
  partyLevelValue: number,
  activeMinutes: number,
  quality: IndividualQuality,
  jitterValue: number,
): number {
  const partyLevel = Math.min(100, Math.max(1, Math.round(partyLevelValue)))
  const index = qualityIndex(quality)
  const jitter = Math.min(2, Math.max(-2, Math.round(jitterValue)))
  const raw = Math.round(0.65 * partyLevel + 0.35 * sessionLevel(activeMinutes) + QUALITY_LEVEL_BONUS[index]! + jitter)
  const minimum = Math.max(1, partyLevel - 5)
  const maximum = Math.min(100, partyLevel + QUALITY_LEVEL_CAP[index]!)
  return Math.min(maximum, Math.max(minimum, raw))
}

/**
 * Chooses a wild level from the complete captured roster rather than only the
 * active squad. Ordinary qualities stay inside the roster's observed level
 * range. Their center is the arithmetic mean, so owning more high-level
 * Codekin naturally pulls new encounters toward the roster maximum.
 *
 * Nova and Origin are exceptional encounters. They are always above the
 * roster maximum while the level cap leaves room, with effective session time
 * increasing the extra threat.
 */
export function wildLevelForRoster(
  roster: readonly Pick<CapturedCreature, 'level'>[],
  activeMinutes: number,
  quality: IndividualQuality,
  rollValue: number,
): number {
  const levels = roster
    .map(creature => Math.min(MAX_PLAYER_LEVEL, Math.max(1, Math.round(creature.level))))
  if (levels.length === 0) return 1
  const minimum = Math.min(...levels)
  const maximum = Math.max(...levels)
  const roll = Number.isFinite(rollValue) ? Math.min(0.999_999, Math.max(0, rollValue)) : 0.5

  if (quality === 'nova' || quality === 'origin') {
    if (maximum >= MAX_PLAYER_LEVEL) return MAX_PLAYER_LEVEL
    const activityLevel = sessionLevel(activeMinutes)
    const baseBonus = quality === 'nova' ? 2 : 4
    const activityBonus = quality === 'nova'
      ? Math.floor(activityLevel / 25)
      : Math.floor(activityLevel / 17)
    const randomBonus = Math.floor(roll * 3)
    return Math.min(MAX_PLAYER_LEVEL, maximum + baseBonus + activityBonus + randomBonus)
  }

  if (minimum === maximum) return minimum
  const average = levels.reduce((sum, level) => sum + level, 0) / levels.length
  const span = maximum - minimum
  const qualityShift = quality === 'pebble' ? -0.06 * span : quality === 'prism' ? 0.06 * span : 0
  const jitter = (roll - 0.5) * 0.16 * span
  return Math.min(maximum, Math.max(minimum, Math.round(average + qualityShift + jitter)))
}

export function wildStats(
  definition: Readonly<CreatureDefinition>,
  levelValue: number,
  quality: IndividualQuality,
  partySizeValue: number,
  partyAverageLevelValue: number = levelValue,
): CreatureStats {
  const level = Math.min(100, Math.max(1, Math.round(levelValue)))
  const growth = level - 1
  const partySize = Math.min(3, Math.max(1, Math.round(partySizeValue)))
  const partyAverageLevel = Math.min(100, Math.max(1, Math.round(partyAverageLevelValue)))
  const levelGap = Math.max(0, level - partyAverageLevel)
  const progress = growth / (MAX_PLAYER_LEVEL - 1)
  // V3 pacing is built from target rounds rather than stacked threat bonuses.
  // A full squad contributes three action stages, so boss durability grows
  // almost linearly with party size; solo encounters get a small mercy cut.
  const partyBossFactor = 0.95 + 0.95 * (partySize - 1)
  const hpLevelFactor = 1 + 1.45 * progress + 0.45 * progress * progress
  const attackLevelFactor = 1 + 1.05 * progress + 0.25 * progress * progress
  const defenseLevelFactor = 1 + 0.9 * progress + 0.2 * progress * progress
  // The level itself already raises every stat. This small relative-pressure
  // term makes deliberate over-level encounters threatening without applying
  // the old level gap two or three times across the damage pipeline.
  const hpGapPressure = 1 + Math.min(0.18, levelGap * 0.006)
  const attackGapPressure = 1 + Math.min(0.1, levelGap * 0.003)
  const defenseGapPressure = 1 + Math.min(0.1, levelGap * 0.003)
  return {
    hp: Math.max(1, Math.round(
      definition.stats.hp * 1.55 * hpLevelFactor * WILD_HP_QUALITY[quality] * partyBossFactor * hpGapPressure,
    )),
    attack: Math.max(1, Math.round(
      definition.stats.attack * 0.45 * attackLevelFactor * WILD_ATTACK_QUALITY[quality] * attackGapPressure,
    )),
    defense: Math.max(1, Math.round(
      definition.stats.defense * defenseLevelFactor * WILD_DEFENSE_QUALITY[quality] * defenseGapPressure,
    )),
    speed: Math.max(1, Math.round(definition.stats.speed * attackLevelFactor)),
  }
}

export function threatPoints(level: number, quality: IndividualQuality): number {
  return Math.min(160, Math.max(1, Math.round(level))) + qualityIndex(quality) * 15
}

export function captureChance(input: Readonly<{
  rarity: TraceRarity
  baseCaptureRate: number
  wildQuality: IndividualQuality
  coreQuality: CaptureCoreQuality
  healthRatio: number
  partyAverageLevel: number
  wildLevel: number
  priorFailures: number
}>): number {
  const ratio = Number.isFinite(input.healthRatio) ? Math.min(1, Math.max(0, input.healthRatio)) : 1
  const hpPressure = 0.3 + 1.7 * Math.pow(1 - ratio, 1.65)
  const delta = Math.min(100, Math.max(-100, input.partyAverageLevel - input.wildLevel))
  const levelBalance = Math.min(1.15, Math.max(0.72, Math.exp(delta / 65)))
  const mercy = Math.min(1.24, 1 + 0.12 * Math.min(2, Math.max(0, Math.floor(input.priorFailures))))
  const score = Math.max(0, input.baseCaptureRate)
    * hpPressure
    * CORE_CAPTURE_POWER[input.coreQuality]
    * WILD_QUALITY_RESISTANCE[input.wildQuality]
    * levelBalance
    * mercy
  return Math.min(SPECIES_CAPTURE_CAP[input.rarity], Math.max(0.02, 1 - Math.exp(-score)))
}
