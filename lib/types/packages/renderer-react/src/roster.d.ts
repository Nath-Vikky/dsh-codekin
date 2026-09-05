import type { CaptureCoreQuality, CapturedCreature, CreatureDefinition, TraceEcology } from '../../engine/src/types.ts';
export type CodekinRosterEcology = TraceEcology | 'all';
export type CodekinRosterQuality = CaptureCoreQuality | 'all';
export type CodekinRosterSort = 'default' | 'level-asc' | 'level-desc';
export interface CodekinRosterEntry {
    captured: CapturedCreature;
    creature: CreatureDefinition;
    sourceIndex: number;
}
export interface CodekinRosterCriteria {
    ecology: CodekinRosterEcology;
    quality: CodekinRosterQuality;
    sort: CodekinRosterSort;
    query?: string;
}
/**
 * Produces a display-only roster projection without mutating authoritative
 * creature or squad order. Equal-level rows retain their capture order.
 */
export declare function arrangeCodekinRoster(entries: readonly CodekinRosterEntry[], criteria: CodekinRosterCriteria): CodekinRosterEntry[];
//# sourceMappingURL=roster.d.ts.map