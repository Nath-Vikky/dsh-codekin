import type { TraceWildAction, TraceWildActionResponse, TraceWildSnapshot } from '../core/types.ts';
export declare class TraceWildConnectionError extends Error {
    readonly code: 'invalid-action' | 'conflict' | 'unavailable';
    constructor(code: 'invalid-action' | 'conflict' | 'unavailable');
}
export interface TraceWildConnection {
    load(signal?: AbortSignal): Promise<TraceWildSnapshot>;
    act(action: TraceWildAction, signal?: AbortSignal): Promise<TraceWildActionResponse>;
    subscribe(onSnapshot: (value: TraceWildSnapshot) => void, onStatus: (online: boolean) => void): () => void;
}
export declare function createTraceWildConnection(): TraceWildConnection;
//# sourceMappingURL=bridge.d.ts.map