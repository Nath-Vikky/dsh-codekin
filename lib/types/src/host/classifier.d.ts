import type { Session, SessionEvent } from '@deepseek-ai/dsh-session';
import type { TraceSignal } from '../../packages/engine/src/types.ts';
export declare class TraceWildEventClassifier {
    private readonly traces;
    private readonly activity;
    observe(session: Session, event: SessionEvent): TraceSignal | undefined;
    /** Fold child activity into its live top-level turn without ever minting a child reward. */
    observeRelatedActivity(session: Session, event: SessionEvent): void;
    disposeSession(session: Session): void;
    private observeActivity;
    private trace;
    private completedEcology;
    private completedEcologyCandidates;
}
//# sourceMappingURL=classifier.d.ts.map