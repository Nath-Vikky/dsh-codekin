import type { CapturedCreature, CreatureAppearance } from './types.ts';
export declare const CREATURE_EVOLUTION_LEVEL = 30;
/** Appearance never participates in combat stats, growth, or rewards. */
export declare function resolveCreatureAppearance(creature: Pick<CapturedCreature, 'level' | 'appearance'>): CreatureAppearance;
//# sourceMappingURL=appearance.d.ts.map