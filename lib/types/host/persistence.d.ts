import type { TraceWildState } from '../core/types.ts';
export declare function traceWildHome(): string;
export declare function traceWildStatePath(): string;
export declare class TraceWildPersistence {
    readonly filename: string;
    constructor(filename?: string);
    load(now?: number): TraceWildState;
    save(state: TraceWildState): void;
}
//# sourceMappingURL=persistence.d.ts.map