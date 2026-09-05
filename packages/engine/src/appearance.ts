import type { CapturedCreature, CreatureAppearance } from './types.ts'

export const CREATURE_EVOLUTION_LEVEL = 30

/** Appearance never participates in combat stats, growth, or rewards. */
export function resolveCreatureAppearance(
  creature: Pick<CapturedCreature, 'level' | 'appearance'>,
): CreatureAppearance {
  return creature.level >= CREATURE_EVOLUTION_LEVEL && creature.appearance !== 'original'
    ? 'evolved'
    : 'original'
}
