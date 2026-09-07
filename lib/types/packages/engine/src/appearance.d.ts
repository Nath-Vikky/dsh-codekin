import type { CapturedCreature, CreatureAppearance } from './types.ts';
export declare const CREATURE_EVOLUTION_LEVEL = 30;
export declare const CREATURE_ULTIMATE_LEVEL = 60;
/** Appearance never participates in combat stats, growth, or rewards. */
export declare function resolveCreatureAppearance(creature: Pick<CapturedCreature, 'level' | 'appearance'>, ultimateAvailable?: boolean): CreatureAppearance;
//# sourceMappingURL=appearance.d.ts.map