import type { Context } from '@deepseek-ai/cordis';
import type { Session, SessionEvent, SessionStore } from '@deepseek-ai/dsh-session';
import type { CodekinRuntime } from '../../engine/src/runtime.ts';
import type { RandomSource, TraceWildAction, TraceWildActionResponse, TraceWildSnapshot } from '../../engine/src/types.ts';
import { TraceWildPersistence } from './persistence.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        sessions: SessionStore;
    }
}
export interface TraceWildServiceOptions {
    runtime: CodekinRuntime;
    persistence?: TraceWildPersistence;
    random?: RandomSource;
    now?: () => number;
}
export declare class TraceWildService {
    private readonly ctx;
    private stateValue;
    private readonly listeners;
    private classifier;
    private readonly persistence;
    private readonly random;
    private readonly now;
    private readonly runtime;
    constructor(ctx: Context, options: TraceWildServiceOptions);
    snapshot(): TraceWildSnapshot;
    subscribe(listener: (snapshot: TraceWildSnapshot) => void): () => void;
    observe(session: Session, event: SessionEvent): void;
    private rootSession;
    disposeSession(session: Session): void;
    act(action: TraceWildAction): TraceWildActionResponse;
    clearLocalData(): TraceWildActionResponse;
    private publish;
}
//# sourceMappingURL=service.d.ts.map