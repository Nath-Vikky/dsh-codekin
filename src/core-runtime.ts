import { CORE_CONTENT_PACK } from '../content-packs/core/src/index.ts'
import { createContentRegistry, createContentView } from '../packages/content-sdk/src/index.ts'
import { CODEKIN_ENGINE_VERSION, createEngineContent } from '../packages/engine/src/content.ts'
import { createCodekinRuntime } from '../packages/engine/src/runtime.ts'

export * from '../packages/engine/src/index.ts'
export * from '../content-packs/core/src/catalog.ts'
export {
  CREATURE_SKILLS,
  skillByCreatureId,
} from '../content-packs/core/src/skills.ts'
export * from '../content-packs/core/src/mechanics.ts'

export const CORE_CONTENT_REGISTRY = createContentRegistry(
  [CORE_CONTENT_PACK],
  { engineVersion: CODEKIN_ENGINE_VERSION },
)
export const CORE_CONTENT_VIEW = createContentView(CORE_CONTENT_REGISTRY)
export const CORE_ENGINE_CONTENT = createEngineContent(CORE_CONTENT_REGISTRY)
export const CORE_CODEKIN_RUNTIME = createCodekinRuntime(CORE_ENGINE_CONTENT)

export const createInitialTraceWildState = CORE_CODEKIN_RUNTIME.createInitialTraceWildState
export const settleTraceWildIdleRewards = CORE_CODEKIN_RUNTIME.settleTraceWildIdleRewards
export const expireTraceWildEncounters = CORE_CODEKIN_RUNTIME.expireTraceWildEncounters
export const applyTraceSignal = CORE_CODEKIN_RUNTIME.applyTraceSignal
export const applyTraceWildAction = CORE_CODEKIN_RUNTIME.applyTraceWildAction
export const captureChanceForBattle = CORE_CODEKIN_RUNTIME.captureChanceForBattle
export const restoreTraceWildState = CORE_CODEKIN_RUNTIME.restoreTraceWildState
export const towerFloorProfile = CORE_CODEKIN_RUNTIME.towerFloorProfile
