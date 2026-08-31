import type { CaptureCoreQuality, RandomSource, TraceEcology, TraceWildAction, TraceWildBattleAnimation, TraceWildState } from './types.ts';
export { createInitialTraceWildState } from './state.ts';
export { applyTraceSignal, expireTraceWildEncounters, settleTraceWildIdleRewards } from './world.ts';
export { restoreTraceWildState } from './restore.ts';
export declare const ECOLOGY_ADVANTAGE: Readonly<Record<TraceEcology, TraceEcology>>;
export declare class TraceWildRuleError extends Error {
    readonly code: 'invalid-action' | 'conflict';
    constructor(code: 'invalid-action' | 'conflict');
}
export declare function captureChanceForBattle(state: TraceWildState, quality: CaptureCoreQuality): number;
export declare function applyTraceWildAction(current: TraceWildState, action: TraceWildAction, random: RandomSource, now?: number): {
    state: TraceWildState;
    notice?: 'capture-success' | 'capture-failed' | 'battle-lost' | 'wild-defeated' | 'tower-cleared' | 'skill-cast' | 'material-used' | 'idle-claimed' | 'creature-released';
    animation?: TraceWildBattleAnimation;
};
//# sourceMappingURL=engine.d.ts.map