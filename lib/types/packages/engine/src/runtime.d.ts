import type { CodekinEngineContent } from './content.ts';
import { applyTraceSignal, applyTraceWildAction, captureChanceForBattle, createInitialTraceWildState, expireTraceWildEncounters, restoreTraceWildState, settleTraceWildIdleRewards } from './engine.ts';
import { towerFloorProfile } from './tower.ts';
export interface CodekinRuntime {
    readonly content: CodekinEngineContent;
    readonly createInitialTraceWildState: typeof createInitialTraceWildState;
    readonly settleTraceWildIdleRewards: typeof settleTraceWildIdleRewards;
    readonly expireTraceWildEncounters: typeof expireTraceWildEncounters;
    readonly applyTraceSignal: typeof applyTraceSignal;
    readonly applyTraceWildAction: typeof applyTraceWildAction;
    readonly captureChanceForBattle: typeof captureChanceForBattle;
    readonly restoreTraceWildState: typeof restoreTraceWildState;
    readonly towerFloorProfile: typeof towerFloorProfile;
}
export declare function createCodekinRuntime(content: CodekinEngineContent): CodekinRuntime;
//# sourceMappingURL=runtime.d.ts.map