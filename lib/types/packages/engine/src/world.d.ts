import type { RandomSource, TraceSignal, TraceWildState } from './types.ts';
export declare function settleTraceWildIdleRewards(current: TraceWildState, now: number, random: RandomSource): TraceWildState;
/** Removes elapsed map encounters without disturbing an encounter in an active wild battle. */
export declare function expireTraceWildEncounters(current: TraceWildState, now: number): TraceWildState;
export declare function applyTraceSignal(current: TraceWildState, signal: TraceSignal, random: RandomSource): TraceWildState;
//# sourceMappingURL=world.d.ts.map