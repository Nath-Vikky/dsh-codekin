import type { CreatureDefinition, CreatureStats, GrowthMaterialQuality, IndividualQuality } from './types.ts';
export declare const MAX_TOWER_FLOOR = 999999;
export type TowerSkillTier = 1 | 2 | 3 | 4 | 5;
export interface TowerFloorProfile {
    floor: number;
    creatureId: string;
    level: number;
    quality: IndividualQuality;
    skillTier: TowerSkillTier;
    startingBossEnergy: number;
    armor: number;
    baseMaterialDrops: number;
    milestoneMaterial: boolean;
}
export declare function towerSkillTierForFloor(floorValue: number): TowerSkillTier;
export declare function towerQualityForFloor(floorValue: number): IndividualQuality;
export declare function towerFloorProfile(floorValue: number): TowerFloorProfile;
/**
 * Player creatures remain capped at level 100. The tower keeps climbing by
 * applying a separate, bounded ascension curve after the normal wild formula.
 */
export declare function towerBossStats(definition: Readonly<CreatureDefinition>, profile: Readonly<TowerFloorProfile>, partySize: number, partyAverageLevel: number): CreatureStats;
export declare function emptyTowerMaterialReward(): Record<GrowthMaterialQuality, number>;
//# sourceMappingURL=tower.d.ts.map