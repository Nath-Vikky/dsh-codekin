import { randomInt } from 'node:crypto'
import type { Context } from '@deepseek-ai/cordis'
import type { Session, SessionEvent } from '@deepseek-ai/dsh-session'
import {
  applyTraceSignal,
  applyTraceWildAction,
  createInitialTraceWildState,
  expireTraceWildEncounters,
  settleTraceWildIdleRewards,
} from '../../packages/engine/src/engine.ts'
import type {
  RandomSource,
  TraceWildAction,
  TraceWildActionResponse,
  TraceWildSnapshot,
  TraceWildState,
} from '../../packages/engine/src/types.ts'
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
  private classifier = new TraceWildEventClassifier()
  private readonly persistence: TraceWildPersistence
  private readonly random: RandomSource
  private readonly now: () => number

  constructor(private readonly ctx: Context, options: TraceWildServiceOptions = {}) {
    this.persistence = options.persistence ?? new TraceWildPersistence()
    this.random = options.random ?? cryptoRandom
    this.now = options.now ?? Date.now
    this.stateValue = this.persistence.load(this.now())
    const settled = settleTraceWildIdleRewards(this.stateValue, this.now(), this.random)
    if (settled !== this.stateValue) {
      this.persistence.save(settled)
      this.stateValue = settled
    }
  }

  snapshot(): TraceWildSnapshot {
    const serverTime = this.now()
    const expired = expireTraceWildEncounters(this.stateValue, serverTime)
    const settled = settleTraceWildIdleRewards(expired, serverTime, this.random)
    if (settled !== this.stateValue) {
      this.persistence.save(settled)
      this.stateValue = settled
    }
    return { schemaVersion: 3, state: structuredClone(this.stateValue), serverTime }
  }

  subscribe(listener: (snapshot: TraceWildSnapshot) => void): () => void {
    this.listeners.add(listener)
    listener(this.snapshot())
    return () => { this.listeners.delete(listener) }
  }

  observe(session: Session, event: SessionEvent): void {
    if (!this.stateValue.enabled) return
    if (session.header.parentSession !== undefined || session.header.origin === 'subagent') {
      const root = this.rootSession(session)
      if (root !== undefined) this.classifier.observeRelatedActivity(root, event)
      return
    }
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

  private rootSession(session: Session): Session | undefined {
    let current = session
    const visited = new Set<string>()
    for (let depth = 0; depth < 16 && current.header.parentSession !== undefined; depth += 1) {
      const id = String(current.id)
      if (visited.has(id)) return undefined
      visited.add(id)
      const parent = this.ctx.sessions.get(current.header.parentSession)
      if (parent === undefined) return undefined
      current = parent
    }
    return current.header.parentSession === undefined && current.header.origin !== 'subagent' ? current : undefined
  }

  disposeSession(session: Session): void {
    this.classifier.disposeSession(session)
  }

  act(action: TraceWildAction): TraceWildActionResponse {
    const previousEnabled = this.stateValue.enabled
    const result = applyTraceWildAction(this.stateValue, action, this.random, this.now())
    this.persistence.save(result.state)
    this.stateValue = result.state
    if (result.state.enabled !== previousEnabled) this.classifier = new TraceWildEventClassifier()
    const snapshot = this.snapshot()
    this.publish(snapshot)
    return {
      ok: true,
      ...snapshot,
      ...(result.notice === undefined ? {} : { notice: result.notice }),
      ...(result.animation === undefined ? {} : { animation: result.animation }),
    }
  }

  clearLocalData(): TraceWildActionResponse {
    const now = this.now()
    const next = createInitialTraceWildState(now)
    // A cleared profile stays paused so an event cannot recreate the save
    // between this explicit cleanup and a subsequent plugin uninstall.
    next.enabled = false
    this.persistence.clear()
    this.stateValue = next
    this.classifier = new TraceWildEventClassifier()
    const snapshot = this.snapshot()
    this.publish(snapshot)
    return { ok: true, ...snapshot }
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
