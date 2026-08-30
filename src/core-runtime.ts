import { CORE_CONTENT_PACK } from '../content-packs/core/src/index.ts'
import { createCodekinComposition } from './composition.ts'

export * from '../packages/engine/src/index.ts'
export * from './composition.ts'
export * from '../content-packs/core/src/catalog.ts'
export {
  CREATURE_SKILLS,
  skillByCreatureId,
} from '../content-packs/core/src/skills.ts'
export * from '../content-packs/core/src/mechanics.ts'

export const CORE_CODEKIN_COMPOSITION = createCodekinComposition([CORE_CONTENT_PACK])
export const CORE_CONTENT_REGISTRY = CORE_CODEKIN_COMPOSITION.registry
export const CORE_CONTENT_VIEW = CORE_CODEKIN_COMPOSITION.view
export const CORE_ENGINE_CONTENT = CORE_CODEKIN_COMPOSITION.engineContent
export const CORE_CODEKIN_RUNTIME = CORE_CODEKIN_COMPOSITION.runtime

export const createInitialTraceWildState = CORE_CODEKIN_RUNTIME.createInitialTraceWildState
export const settleTraceWildIdleRewards = CORE_CODEKIN_RUNTIME.settleTraceWildIdleRewards
export const expireTraceWildEncounters = CORE_CODEKIN_RUNTIME.expireTraceWildEncounters
export const applyTraceSignal = CORE_CODEKIN_RUNTIME.applyTraceSignal
export const applyTraceWildAction = CORE_CODEKIN_RUNTIME.applyTraceWildAction
export const captureChanceForBattle = CORE_CODEKIN_RUNTIME.captureChanceForBattle
export const restoreTraceWildState = CORE_CODEKIN_RUNTIME.restoreTraceWildState
export const towerFloorProfile = CORE_CODEKIN_RUNTIME.towerFloorProfile
