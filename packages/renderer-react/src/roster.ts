import type {
  CaptureCoreQuality,
  CapturedCreature,
  CreatureDefinition,
  TraceEcology,
} from '../../engine/src/types.ts'

export type CodekinRosterEcology = TraceEcology | 'all'
export type CodekinRosterQuality = CaptureCoreQuality | 'all'
export type CodekinRosterSort = 'default' | 'level-asc' | 'level-desc'

export interface CodekinRosterEntry {
  captured: CapturedCreature
  creature: CreatureDefinition
  sourceIndex: number
}

export interface CodekinRosterCriteria {
  ecology: CodekinRosterEcology
  quality: CodekinRosterQuality
  sort: CodekinRosterSort
  query?: string
}

/**
 * Produces a display-only roster projection without mutating authoritative
 * creature or squad order. Equal-level rows retain their capture order.
 */
export function arrangeCodekinRoster(
  entries: readonly CodekinRosterEntry[],
  criteria: CodekinRosterCriteria,
): CodekinRosterEntry[] {
  const query = criteria.query?.trim().normalize('NFKC').toLocaleLowerCase().replace(/^#/, '') ?? ''
  const visible = entries.filter(entry => (
    (criteria.ecology === 'all' || entry.creature.ecology === criteria.ecology)
    && (criteria.quality === 'all' || entry.captured.quality === criteria.quality)
    && (query === '' || [entry.creature.nameZh, entry.creature.nameEn, entry.creature.id,
      String(entry.creature.number).padStart(2, '0')].some(value => value.normalize('NFKC').toLocaleLowerCase().includes(query)))
  ))
  if (criteria.sort === 'default') return visible
  const direction = criteria.sort === 'level-asc' ? 1 : -1
  return visible.sort((left, right) => (
    (left.captured.level - right.captured.level) * direction
    || left.sourceIndex - right.sourceIndex
  ))
}
