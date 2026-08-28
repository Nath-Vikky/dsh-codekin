import { createHash } from 'node:crypto'
import type { Session, SessionEvent } from '@deepseek-ai/dsh-session'
import type { TraceEcology, TraceSignal } from '../core/types.ts'

interface TurnTrace {
  turn: number
  lumen: number
  forge: number
  relay: number
  failedTools: number
  toolCount: number
  callEcology: Map<string, TraceEcology>
}

interface SessionActivityClock {
  lastEventAt: number
  activeMs: number
}

function fresh(turn: number): TurnTrace {
  return { turn, lumen: 0, forge: 0, relay: 0, failedTools: 0, toolCount: 0, callEcology: new Map() }
}

function classifyTool(name: string): TraceEcology {
  const value = name.toLowerCase()
  if (/(subagent|agent|delegate|send.message|followup|fork|handoff|interrupt)/.test(value)) return 'relay'
  if (/(read|search|grep|glob|find|list|web|browser|resource|inspect|query)/.test(value)) return 'lumen'
  if (/(exec|command|bash|pwsh|terminal|write|edit|patch|build|test|run|apply|create|delete|move|copy)/.test(value)) return 'forge'
  return 'aegis'
}

function signalId(session: Session, event: SessionEvent<'turn/end'>): string {
  return createHash('sha256')
    .update(`${String(session.id)}\0${String(event.data.turn)}\0${String(event.seq)}`)
    .digest('hex')
    .slice(0, 24)
}

function failureVariant(reason: SessionEvent<'turn/end'>['data']['reason']): TraceSignal['variant'] {
  if (reason.kind === 'max-tokens') return 'overflow'
  if (reason.kind === 'interrupted') return 'crash'
  if (reason.kind === 'blocked') return 'stack'
  if (reason.kind !== 'error') return undefined
  const code = reason.error.code.toUpperCase()
  if (/(ENOENT|NOT.?FOUND|MISSING)/.test(code)) return 'missing'
  if (/(TIMEOUT|TIMEDOUT|DEADLINE)/.test(code)) return 'timeout'
  if (/(STACK|RECURS|LOOP)/.test(code)) return 'stack'
  if (/(ENOSPC|OOM|MEMORY|OVERFLOW|LIMIT)/.test(code)) return 'overflow'
  return 'crash'
}

export class TraceWildEventClassifier {
  private readonly traces = new WeakMap<Session, TurnTrace>()
  private readonly activity = new WeakMap<Session, SessionActivityClock>()

  observe(session: Session, event: SessionEvent): TraceSignal | undefined {
    const activeMinutes = this.observeActivity(session, event.time)
    switch (event.type) {
      case 'turn/start':
        this.traces.set(session, fresh(event.data.turn))
        return undefined
      case 'tool/call': {
        const trace = this.trace(session, event.data.turn)
        const ecology = classifyTool(event.data.name)
        trace.callEcology.set(String(event.data.callId), ecology)
        trace.toolCount += 1
        if (ecology === 'lumen') trace.lumen += 1
        if (ecology === 'forge') trace.forge += 1
        if (ecology === 'relay') trace.relay += 1
        return undefined
      }
      case 'tool/result': {
        const trace = this.trace(session, event.data.turn)
        const firstBlock = event.data.message.content[0]
        if (event.data.error !== undefined || firstBlock?.isError === true) trace.failedTools += 1
        return undefined
      }
      case 'turn/end': {
        const trace = this.trace(session, event.data.turn)
        this.traces.delete(session)
        if (event.data.reason.kind === 'aborted') return undefined
        if (event.data.reason.kind !== 'completed') {
          const variant = failureVariant(event.data.reason)
          return {
            id: signalId(session, event),
            at: event.time,
            ecology: 'glitch',
            outcome: 'failed',
            intensity: Math.min(5, 1 + Math.floor(trace.toolCount / 2) + trace.failedTools),
            activeMinutes,
            enhanced: true,
            ...(variant === undefined ? {} : { variant }),
          }
        }
        const ecology = this.completedEcology(trace)
        return {
          id: signalId(session, event),
          at: event.time,
          ecology,
          outcome: 'completed',
          intensity: Math.min(5, 1 + Math.floor(trace.toolCount / 3) + (trace.failedTools > 0 ? 2 : 0)),
          activeMinutes,
          enhanced: false,
        }
      }
      default:
        return undefined
    }
  }

  /** Fold child activity into its live top-level turn without ever minting a child reward. */
  observeRelatedActivity(session: Session, event: SessionEvent): void {
    this.observeActivity(session, event.time)
    const trace = this.traces.get(session)
    if (trace === undefined) return
    if (event.type === 'tool/call') {
      const ecology = classifyTool(event.data.name)
      trace.callEcology.set(String(event.data.callId), ecology)
      trace.toolCount += 1
      if (ecology === 'lumen') trace.lumen += 1
      if (ecology === 'forge') trace.forge += 1
      if (ecology === 'relay') trace.relay += 1
      return
    }
    if (event.type === 'tool/result') {
      const firstBlock = event.data.message.content[0]
      if (event.data.error !== undefined || firstBlock?.isError === true) trace.failedTools += 1
    }
  }

  disposeSession(session: Session): void {
    this.traces.delete(session)
    this.activity.delete(session)
  }

  private observeActivity(session: Session, at: number): number {
    const current = this.activity.get(session)
    if (current === undefined || !Number.isFinite(at) || at < current.lastEventAt) {
      this.activity.set(session, { lastEventAt: Number.isFinite(at) ? at : 0, activeMs: 0 })
      return 0
    }
    const gap = at - current.lastEventAt
    if (gap > 0 && gap <= 2 * 60_000) current.activeMs = Math.min(180 * 60_000, current.activeMs + gap)
    current.lastEventAt = at
    return current.activeMs / 60_000
  }

  private trace(session: Session, turn: number): TurnTrace {
    const current = this.traces.get(session)
    if (current !== undefined && current.turn === turn) return current
    const next = fresh(turn)
    this.traces.set(session, next)
    return next
  }

  private completedEcology(trace: TurnTrace): TraceEcology {
    if (trace.failedTools > 0) return 'aegis'
    if (trace.relay > 0 && trace.relay >= trace.forge && trace.relay >= trace.lumen) return 'relay'
    if (trace.forge > 0 && trace.forge >= trace.lumen) return 'forge'
    if (trace.lumen > 0) return 'lumen'
    return 'aegis'
  }
}
