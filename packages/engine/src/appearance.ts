import type { CapturedCreature, CreatureAppearance } from './types.ts'

export const CREATURE_EVOLUTION_LEVEL = 30
export const CREATURE_ULTIMATE_LEVEL = 60

/** Appearance never participates in combat stats, growth, or rewards. */
export function resolveCreatureAppearance(
  creature: Pick<CapturedCreature, 'level' | 'appearance'>,
  ultimateAvailable = false,
): CreatureAppearance {
  if (creature.level < CREATURE_EVOLUTION_LEVEL || creature.appearance === 'original') return 'original'
  if (ultimateAvailable && creature.level >= CREATURE_ULTIMATE_LEVEL && creature.appearance !== 'evolved') return 'ultimate'
  return 'evolved'
}
