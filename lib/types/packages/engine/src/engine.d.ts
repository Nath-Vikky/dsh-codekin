import type { CaptureCoreQuality, RandomSource, TraceEcology, TraceSignal, TraceWildAction, TraceWildBattleAnimation, TraceWildState } from './types.ts';
export declare const ECOLOGY_ADVANTAGE: Readonly<Record<TraceEcology, TraceEcology>>;
export declare class TraceWildRuleError extends Error {
    readonly code: 'invalid-action' | 'conflict';
    constructor(code: 'invalid-action' | 'conflict');
}
export declare function createInitialTraceWildState(now?: number): TraceWildState;
export declare function settleTraceWildIdleRewards(current: TraceWildState, now: number, random: RandomSource): TraceWildState;
/** Removes elapsed map encounters without disturbing an encounter in an active wild battle. */
export declare function expireTraceWildEncounters(current: TraceWildState, now: number): TraceWildState;
export declare function applyTraceSignal(current: TraceWildState, signal: TraceSignal, random: RandomSource): TraceWildState;
export declare function captureChanceForBattle(state: TraceWildState, quality: CaptureCoreQuality): number;
export declare function applyTraceWildAction(current: TraceWildState, action: TraceWildAction, random: RandomSource, now?: number): {
    state: TraceWildState;
    notice?: 'capture-success' | 'capture-failed' | 'battle-lost' | 'wild-defeated' | 'tower-cleared' | 'skill-cast' | 'material-used' | 'idle-claimed' | 'creature-released';
    animation?: TraceWildBattleAnimation;
};
/** Tolerant, bounded loader with schema-v1/v2 migration. Invalid or future data starts a fresh profile. */
export declare function restoreTraceWildState(value: unknown, now?: number): TraceWildState;
//# sourceMappingURL=engine.d.ts.map