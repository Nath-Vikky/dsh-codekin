import type { CaptureCoreQuality } from './types.ts';
export interface CreatureSkillDefinition {
    creatureId: string;
    energyCost: number;
    passiveNameZh: string;
    passiveNameEn: string;
    passiveDescriptionZh: string;
    passiveDescriptionEn: string;
    activeNameZh: string;
    activeNameEn: string;
    activeDescriptionZh: string;
    activeDescriptionEn: string;
}
export declare const QUALITY_SKILL_MULTIPLIERS: Readonly<Record<CaptureCoreQuality, number>>;
export declare const CREATURE_SKILLS: readonly CreatureSkillDefinition[];
export declare function skillByCreatureId(creatureId: string): CreatureSkillDefinition | undefined;
//# sourceMappingURL=skills.d.ts.map