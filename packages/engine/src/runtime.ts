import type { CodekinEngineContent } from './content.ts'
import { withEngineContent } from './content.ts'
import {
  applyTraceSignal,
  applyTraceWildAction,
  captureChanceForBattle,
  createInitialTraceWildState,
  expireTraceWildEncounters,
  restoreTraceWildState,
  settleTraceWildIdleRewards,
} from './engine.ts'
import { towerFloorProfile } from './tower.ts'

export interface CodekinRuntime {
  readonly content: CodekinEngineContent
  readonly createInitialTraceWildState: typeof createInitialTraceWildState
  readonly settleTraceWildIdleRewards: typeof settleTraceWildIdleRewards
  readonly expireTraceWildEncounters: typeof expireTraceWildEncounters
  readonly applyTraceSignal: typeof applyTraceSignal
  readonly applyTraceWildAction: typeof applyTraceWildAction
  readonly captureChanceForBattle: typeof captureChanceForBattle
  readonly restoreTraceWildState: typeof restoreTraceWildState
  readonly towerFloorProfile: typeof towerFloorProfile
}

export function createCodekinRuntime(content: CodekinEngineContent): CodekinRuntime {
  const run = <Result>(operation: () => Result): Result => withEngineContent(content, operation)
  return Object.freeze({
    content,
    createInitialTraceWildState: (...args: Parameters<typeof createInitialTraceWildState>) => run(() => createInitialTraceWildState(...args)),
    settleTraceWildIdleRewards: (...args: Parameters<typeof settleTraceWildIdleRewards>) => run(() => settleTraceWildIdleRewards(...args)),
    expireTraceWildEncounters: (...args: Parameters<typeof expireTraceWildEncounters>) => run(() => expireTraceWildEncounters(...args)),
    applyTraceSignal: (...args: Parameters<typeof applyTraceSignal>) => run(() => applyTraceSignal(...args)),
    applyTraceWildAction: (...args: Parameters<typeof applyTraceWildAction>) => run(() => applyTraceWildAction(...args)),
    captureChanceForBattle: (...args: Parameters<typeof captureChanceForBattle>) => run(() => captureChanceForBattle(...args)),
    restoreTraceWildState: (...args: Parameters<typeof restoreTraceWildState>) => run(() => restoreTraceWildState(...args)),
    towerFloorProfile: (...args: Parameters<typeof towerFloorProfile>) => run(() => towerFloorProfile(...args)),
  })
}
