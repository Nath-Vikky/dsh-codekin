import type { CaptureCoreQuality, CapturedCreature, CreatureDefinition, CreatureStats, GrowthMaterialQuality, IndividualQuality, TraceRarity } from './types.ts';
export declare const MAX_PLAYER_LEVEL = 100;
export declare const BASE_ACTIONS_PER_CREATURE = 3;
export declare const MAX_ACTIONS_PER_CREATURE = 5;
export declare const MAX_BONUS_ACTIONS_PER_STAGE = 2;
export declare const BASE_BOSS_ACTIONS = 3;
export declare const MAX_BOSS_ACTIONS = 5;
export declare const MAX_BOSS_BONUS_ACTIONS = 2;
export declare const MAX_BOSS_SWAPS_PER_PHASE = 7;
export declare const BOSS_SKILL_ENERGY_COST = 12;
export declare const BOSS_SKILL_ENERGY_LIMIT = 24;
export declare const CAPTURE_HEALTH_RATIO = 0.5;
export declare const MAX_CAPTURE_ATTEMPTS = 3;
export declare const MAX_MAP_ENCOUNTERS = 7;
export declare const QUALITY_ORDER: readonly ["pebble", "pulse", "prism", "nova", "origin"];
export declare const PLAYER_QUALITY_BASE_MULTIPLIERS: Readonly<Record<IndividualQuality, number>>;
export declare const PLAYER_QUALITY_GROWTH_BONUSES: Readonly<Record<IndividualQuality, number>>;
/** @deprecated Use PLAYER_QUALITY_BASE_MULTIPLIERS for new balance work. */
export declare const PLAYER_QUALITY_MULTIPLIERS: Readonly<Record<CaptureCoreQuality, number>>;
export declare const XP_QUALITY_MULTIPLIERS: Readonly<Record<IndividualQuality, number>>;
export declare const CORE_CAPTURE_POWER: Readonly<Record<CaptureCoreQuality, number>>;
export declare const WILD_QUALITY_RESISTANCE: Readonly<Record<IndividualQuality, number>>;
export declare const MATERIAL_XP: Readonly<Record<GrowthMaterialQuality, number>>;
export declare const MATERIAL_DROP_WEIGHTS: Readonly<Record<IndividualQuality, Readonly<Record<GrowthMaterialQuality, number>>>>;
export declare function qualityIndex(quality: IndividualQuality): number;
/**
 * Host-authoritative time for a wild encounter to remain on the map.
 * Level pressure reaches its cap at level 50 so genuinely threatening Nova
 * and Origin encounters settle near the requested 30-minute window, while
 * low-quality encounters remain available for many hours.
 */
export declare function encounterLifetimeMs(quality: IndividualQuality, levelValue: number): number;
export declare function activeMinuteBand(activeMinutes: number): number;
export declare function wildQualityWeights(activeMinutes: number): Readonly<Record<IndividualQuality, number>>;
export declare function coreQualityWeights(activeMinutes: number): Readonly<Record<CaptureCoreQuality, number>>;
export declare function idleRewardTier(elapsedMinutesValue: number): {
    materialCount: number;
    coreCount: 0 | 1;
    weights?: Readonly<Record<CaptureCoreQuality, number>>;
};
export declare function playerLevelFactor(levelValue: number, quality?: IndividualQuality): number;
export declare function playerStats(base: Readonly<CreatureStats>, level: number, quality: IndividualQuality): CreatureStats;
export declare function xpToNextLevel(levelValue: number, quality?: IndividualQuality): number;
export declare function totalXpForLevel(levelValue: number, quality?: IndividualQuality): number;
export declare function levelForXp(xpValue: number, quality?: IndividualQuality): number;
export declare function sessionLevel(activeMinutes: number): number;
export declare function effectivePartyLevel(party: readonly CapturedCreature[]): number;
export declare function wildLevelFor(partyLevelValue: number, activeMinutes: number, quality: IndividualQuality, jitterValue: number): number;
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
export declare function wildLevelForRoster(roster: readonly Pick<CapturedCreature, 'level'>[], activeMinutes: number, quality: IndividualQuality, rollValue: number): number;
export declare function wildStats(definition: Readonly<CreatureDefinition>, levelValue: number, quality: IndividualQuality, partySizeValue: number, partyAverageLevelValue?: number): CreatureStats;
export declare function threatPoints(level: number, quality: IndividualQuality): number;
export declare function captureChance(input: Readonly<{
    rarity: TraceRarity;
    baseCaptureRate: number;
    wildQuality: IndividualQuality;
    coreQuality: CaptureCoreQuality;
    healthRatio: number;
    partyAverageLevel: number;
    wildLevel: number;
    priorFailures: number;
}>): number;
//# sourceMappingURL=balance.d.ts.map