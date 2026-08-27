/** TraceWild Host plugin. */
import { fileURLToPath } from 'node:url'
import type { Context } from '@deepseek-ai/cordis'
import type { WebServer } from '@deepseek-ai/dsh-host-webserver'
import type { Session, SessionEvent } from '@deepseek-ai/dsh-session'
import { createTraceWildRoutes } from './host/routes.ts'
import { TraceWildService } from './host/service.ts'

export * from './core/index.ts'
export { TraceWildService } from './host/service.ts'

export const name = 'dsh-tracewild'
export const inject = ['sessions', 'webServer']

// Local declarations keep development links and a normally installed package
// on the same public Cordis contract. The official service packages declare
// identical members when they resolve through one dependency tree.
declare module '@deepseek-ai/cordis' {
  interface Context {
    webServer: WebServer
  }
  interface Events {
    'session/event'(session: Session, event: SessionEvent): void
    'session/disposed'(session: Session): void
  }
}

export function apply(ctx: Context): void {
  const service = new TraceWildService(ctx)
  const assetDirectory = fileURLToPath(new URL('../assets/creatures/', import.meta.url))

  ctx.effect(() => {
    const disposers: (() => void)[] = []
    try {
      for (const route of createTraceWildRoutes(service, assetDirectory)) {
        disposers.push(ctx.webServer.register(route))
      }
      disposers.push(ctx.on('session/event', (session: Session, event: SessionEvent) => {
        service.observe(session, event)
      }))
      disposers.push(ctx.on('session/disposed', (session: Session) => {
        service.disposeSession(session)
      }))
    } catch (error) {
      for (const dispose of disposers.reverse()) {
        try { dispose() } catch { /* best-effort startup rollback */ }
      }
      throw error
    }
    return () => {
      for (const dispose of disposers.reverse()) {
        try { dispose() } catch { /* best-effort plugin teardown */ }
      }
    }
  }, 'tracewild: events and web routes')
}
