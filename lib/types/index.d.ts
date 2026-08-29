import type { Context } from '@deepseek-ai/cordis';
import type { HostConnectionHandle } from '@deepseek-ai/dsh-client-connection';
import type { WebServer } from '@deepseek-ai/dsh-host-webserver';
import type { Session, SessionEvent, SessionStore } from '@deepseek-ai/dsh-session';
export * from './core/index.ts';
export { TraceWildService } from './host/service.ts';
export declare const name = "dsh-codekin";
export declare const inject: string[];
declare module '@deepseek-ai/cordis' {
    interface Context {
        webServer: WebServer;
        sessions: SessionStore;
        connection: HostConnectionHandle;
    }
    interface Events {
        'session/event'(session: Session, event: SessionEvent): void;
        'session/disposed'(session: Session): void;
    }
}
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map