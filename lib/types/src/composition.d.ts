import type { CodekinContentPack, ContentRegistry } from '../packages/content-sdk/src/types.ts';
import type { CodekinContentView } from '../packages/content-sdk/src/view.ts';
import type { CodekinEngineContent } from '../packages/engine/src/content.ts';
import type { CodekinRuntime } from '../packages/engine/src/runtime.ts';
export interface CodekinComposition {
    readonly registry: ContentRegistry;
    readonly view: CodekinContentView;
    readonly engineContent: CodekinEngineContent;
    readonly runtime: CodekinRuntime;
}
/** Builds one immutable engine/content generation for a host adapter and its renderer. */
export declare function createCodekinComposition(packs: readonly CodekinContentPack[]): CodekinComposition;
//# sourceMappingURL=composition.d.ts.map