import { randomInt } from 'node:crypto'
import type { Context } from '@deepseek-ai/cordis'
import type { Session, SessionEvent } from '@deepseek-ai/dsh-session'
import { applyTraceSignal, applyTraceWildAction } from '../core/engine.ts'
import type {
  RandomSource,
  TraceWildAction,
  TraceWildActionResponse,
  TraceWildSnapshot,
  TraceWildState,
} from '../core/types.ts'
import { TraceWildEventClassifier } from './classifier.ts'
import { TraceWildPersistence } from './persistence.ts'

const cryptoRandom: RandomSource = () => randomInt(0, 0x1_0000_0000) / 0x1_0000_0000

export interface TraceWildServiceOptions {
  persistence?: TraceWildPersistence
  random?: RandomSource
  now?: () => number
}

export class TraceWildService {
  private stateValue: TraceWildState
  private readonly listeners = new Set<(snapshot: TraceWildSnapshot) => void>()
  private readonly classifier = new TraceWildEventClassifier()
  private readonly persistence: TraceWildPersistence
  private readonly random: RandomSource
  private readonly now: () => number

  constructor(private readonly ctx: Context, options: TraceWildServiceOptions = {}) {
    this.persistence = options.persistence ?? new TraceWildPersistence()
    this.random = options.random ?? cryptoRandom
    this.now = options.now ?? Date.now
    this.stateValue = this.persistence.load(this.now())
  }

  snapshot(): TraceWildSnapshot {
    return { schemaVersion: 1, state: structuredClone(this.stateValue), serverTime: this.now() }
  }

  subscribe(listener: (snapshot: TraceWildSnapshot) => void): () => void {
    this.listeners.add(listener)
    listener(this.snapshot())
    return () => { this.listeners.delete(listener) }
  }

  observe(session: Session, event: SessionEvent): void {
    const signal = this.classifier.observe(session, event)
    if (signal === undefined) return
    try {
      const next = applyTraceSignal(this.stateValue, signal, this.random)
      if (next === this.stateValue) return
      this.persistence.save(next)
      this.stateValue = next
      this.publish()
    } catch (error) {
      this.ctx.logger.warn('tracewild: event reward could not be committed')
      this.ctx.logger.warn(error)
    }
  }

  disposeSession(session: Session): void {
    this.classifier.disposeSession(session)
  }

  act(action: TraceWildAction): TraceWildActionResponse {
    const result = applyTraceWildAction(this.stateValue, action, this.random, this.now())
    this.persistence.save(result.state)
    this.stateValue = result.state
    const snapshot = this.snapshot()
    this.publish(snapshot)
    return result.notice === undefined
      ? { ok: true, ...snapshot }
      : { ok: true, ...snapshot, notice: result.notice }
  }

  private publish(snapshot = this.snapshot()): void {
    for (const listener of [...this.listeners]) {
      try {
        listener(snapshot)
      } catch {
        // A disconnected browser must not affect Host gameplay state.
      }
    }
  }
}
