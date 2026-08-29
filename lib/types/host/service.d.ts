import type { Context } from '@deepseek-ai/cordis';
import type { Session, SessionEvent } from '@deepseek-ai/dsh-session';
import type { RandomSource, TraceWildAction, TraceWildActionResponse, TraceWildSnapshot } from '../core/types.ts';
import { TraceWildPersistence } from './persistence.ts';
export interface TraceWildServiceOptions {
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
    constructor(ctx: Context, options?: TraceWildServiceOptions);
    snapshot(): TraceWildSnapshot;
    subscribe(listener: (snapshot: TraceWildSnapshot) => void): () => void;
    observe(session: Session, event: SessionEvent): void;
    private rootSession;
    disposeSession(session: Session): void;
    act(action: TraceWildAction): TraceWildActionResponse;
    private publish;
}
//# sourceMappingURL=service.d.ts.map