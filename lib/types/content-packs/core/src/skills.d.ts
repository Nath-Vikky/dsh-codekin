import type { CaptureCoreQuality, CreatureSkillDefinition } from '../../../packages/content-sdk/src/types.ts';
export type { CreatureSkillDefinition } from '../../../packages/content-sdk/src/types.ts';
export declare const QUALITY_SKILL_MULTIPLIERS: Readonly<Record<CaptureCoreQuality, number>>;
export declare const CREATURE_SKILLS: readonly CreatureSkillDefinition[];
export declare function skillByCreatureId(creatureId: string): CreatureSkillDefinition | undefined;
//# sourceMappingURL=skills.d.ts.map