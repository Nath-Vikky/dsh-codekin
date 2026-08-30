import type { CodekinContentPack, ContentRegistry } from '../packages/content-sdk/src/types.ts'
import type { CodekinContentView } from '../packages/content-sdk/src/view.ts'
import { createContentRegistry, createContentView } from '../packages/content-sdk/src/index.ts'
import type { CodekinEngineContent } from '../packages/engine/src/content.ts'
import { CODEKIN_ENGINE_VERSION, createEngineContent } from '../packages/engine/src/content.ts'
import type { CodekinRuntime } from '../packages/engine/src/runtime.ts'
import { createCodekinRuntime } from '../packages/engine/src/runtime.ts'

export interface CodekinComposition {
  readonly registry: ContentRegistry
  readonly view: CodekinContentView
  readonly engineContent: CodekinEngineContent
  readonly runtime: CodekinRuntime
}

/** Builds one immutable engine/content generation for a host adapter and its renderer. */
export function createCodekinComposition(
  packs: readonly CodekinContentPack[],
): CodekinComposition {
  const registry = createContentRegistry(packs, { engineVersion: CODEKIN_ENGINE_VERSION })
  const view = createContentView(registry)
  const engineContent = createEngineContent(registry)
  const runtime = createCodekinRuntime(engineContent)
  return Object.freeze({ registry, view, engineContent, runtime })
}
