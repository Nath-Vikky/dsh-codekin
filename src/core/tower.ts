import { CREATURE_CATALOG } from './catalog.ts'
import { QUALITY_ORDER, wildStats } from './balance.ts'
import type {
  CreatureDefinition,
  CreatureStats,
  GrowthMaterialQuality,
  IndividualQuality,
} from './types.ts'

export const MAX_TOWER_FLOOR = 999_999

export type TowerSkillTier = 1 | 2 | 3 | 4 | 5

export interface TowerFloorProfile {
  floor: number
  creatureId: string
  level: number
  quality: IndividualQuality
  skillTier: TowerSkillTier
  startingBossEnergy: number
  armor: number
  baseMaterialDrops: number
  milestoneMaterial: boolean
}

function boundedTowerFloor(value: number): number {
  if (!Number.isSafeInteger(value) || value < 1 || value > MAX_TOWER_FLOOR) {
    throw new TypeError('invalid tower floor')
  }
  return value
}

export function towerSkillTierForFloor(floorValue: number): TowerSkillTier {
  const floor = boundedTowerFloor(floorValue)
  if (floor >= 80) return 5
  if (floor >= 50) return 4
  if (floor >= 25) return 3
  if (floor >= 10) return 2
  return 1
}

export function towerQualityForFloor(floorValue: number): IndividualQuality {
  return QUALITY_ORDER[towerSkillTierForFloor(floorValue) - 1]!
}

export function towerFloorProfile(floorValue: number): TowerFloorProfile {
  const floor = boundedTowerFloor(floorValue)
  const skillTier = towerSkillTierForFloor(floor)
  const creature = CREATURE_CATALOG[(floor - 1) % CREATURE_CATALOG.length]!
  return Object.freeze({
    floor,
    creatureId: creature.id,
    level: Math.min(9_999, floor + 1),
    quality: towerQualityForFloor(floor),
    skillTier,
    startingBossEnergy: (skillTier - 1) * 3,
    armor: skillTier - 1,
    baseMaterialDrops: Math.min(8, skillTier + Math.floor((floor - 1) / 100)),
    milestoneMaterial: floor % 10 === 0,
  })
}

function clampStat(value: number, maximum: number): number {
  return Math.min(maximum, Math.max(1, Math.round(value)))
}

/**
 * Player creatures remain capped at level 100. The tower keeps climbing by
 * applying a separate, bounded ascension curve after the normal wild formula.
 */
export function towerBossStats(
  definition: Readonly<CreatureDefinition>,
  profile: Readonly<TowerFloorProfile>,
  partySize: number,
  partyAverageLevel: number,
): CreatureStats {
  const base = wildStats(
    definition,
    Math.min(100, profile.level),
    profile.quality,
    partySize,
    partyAverageLevel,
  )
  const progress = profile.floor - 1
  const over = Math.max(0, profile.floor - 99)
  const hpScale = 1 + 0.025 * progress + 0.01 * Math.pow(over, 1.08)
  const attackScale = 1 + 0.012 * progress + 0.006 * Math.pow(over, 1.05)
  const defenseScale = 1 + 0.009 * progress + 0.004 * Math.pow(over, 1.04)
  return Object.freeze({
    hp: clampStat(base.hp * hpScale, 9_999_999),
    attack: clampStat(base.attack * attackScale, 999_999),
    defense: clampStat(base.defense * defenseScale, 999_999),
    speed: clampStat(base.speed * attackScale, 999_999),
  })
}

export function emptyTowerMaterialReward(): Record<GrowthMaterialQuality, number> {
  return { pebble: 0, pulse: 0, prism: 0, nova: 0, origin: 0 }
}
