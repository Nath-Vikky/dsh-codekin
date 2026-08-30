import type { CodekinRuntime } from '../../engine/src/runtime.ts';
import type { TraceWildState } from '../../engine/src/types.ts';
export declare const CODEKIN_SAVE_FORMAT: "codekin.save";
export declare const CODEKIN_SAVE_VERSION: 1;
type PersistenceRuntime = Pick<CodekinRuntime, 'engineVersion' | 'content' | 'createInitialTraceWildState' | 'restoreTraceWildState'>;
export interface CodekinSaveEnvelopeV1 {
    format: typeof CODEKIN_SAVE_FORMAT;
    version: typeof CODEKIN_SAVE_VERSION;
    engineVersion: string;
    content: {
        id: string;
        packs: readonly {
            id: string;
            version: string;
        }[];
    };
    state: TraceWildState;
}
export declare function traceWildHome(): string;
export declare function codekinSaveStatePath(): string;
/** Kept as a source-compatible alias for internal consumers. */
export declare function traceWildStatePath(): string;
export declare function traceWildLegacyStatePath(): string;
export declare function createCodekinSaveEnvelope(runtime: PersistenceRuntime, state: TraceWildState): CodekinSaveEnvelopeV1;
export declare class TraceWildPersistence {
    readonly runtime: PersistenceRuntime;
    readonly filename: string;
    readonly legacyFilename: string | undefined;
    private pendingMigrationBackup;
    constructor(runtime: PersistenceRuntime, filename?: string, legacyFilename?: string | undefined);
    load(now?: number): TraceWildState;
    save(state: TraceWildState): void;
    clear(): void;
}
export {};
//# sourceMappingURL=persistence.d.ts.map