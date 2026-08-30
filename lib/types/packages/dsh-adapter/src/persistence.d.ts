import type { CodekinRuntime } from '../../engine/src/runtime.ts';
import type { TraceWildState } from '../../engine/src/types.ts';
export declare function traceWildHome(): string;
export declare function codekinSaveStatePath(): string;
/** Kept as a source-compatible alias for internal consumers. */
export declare function traceWildStatePath(): string;
export declare function traceWildLegacyStatePath(): string;
export declare class TraceWildPersistence {
    readonly runtime: Pick<CodekinRuntime, 'createInitialTraceWildState' | 'restoreTraceWildState'>;
    readonly filename: string;
    readonly legacyFilename: string | undefined;
    constructor(runtime: Pick<CodekinRuntime, 'createInitialTraceWildState' | 'restoreTraceWildState'>, filename?: string, legacyFilename?: string | undefined);
    load(now?: number): TraceWildState;
    save(state: TraceWildState): void;
    clear(): void;
}
//# sourceMappingURL=persistence.d.ts.map