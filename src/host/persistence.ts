import { mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import { createInitialTraceWildState, restoreTraceWildState } from '../core/engine.ts'
import type { TraceWildState } from '../core/types.ts'

const MAX_STATE_BYTES = 2 * 1024 * 1024

export function traceWildHome(): string {
  const configured = process.env.DSH_HOME
  if (configured === undefined || configured.trim() === '') return join(homedir(), '.dsh')
  const expanded = configured === '~'
    ? homedir()
    : configured.startsWith('~/') || configured.startsWith('~\\')
      ? join(homedir(), configured.slice(2))
      : configured
  return isAbsolute(expanded) ? resolve(expanded) : resolve(process.cwd(), expanded)
}

export function traceWildStatePath(): string {
  return join(traceWildHome(), 'tracewild', 'state.json')
}

export class TraceWildPersistence {
  constructor(readonly filename = traceWildStatePath()) {}

  load(now = Date.now()): TraceWildState {
    try {
      if (statSync(this.filename).size > MAX_STATE_BYTES) return createInitialTraceWildState(now)
      return restoreTraceWildState(JSON.parse(readFileSync(this.filename, 'utf8')) as unknown, now)
    } catch {
      return createInitialTraceWildState(now)
    }
  }

  save(state: TraceWildState): void {
    mkdirSync(dirname(this.filename), { recursive: true, mode: 0o700 })
    const temporary = `${this.filename}.tmp`
    const body = JSON.stringify(state)
    if (Buffer.byteLength(body, 'utf8') > MAX_STATE_BYTES) throw new Error('TraceWild state is too large')
    writeFileSync(temporary, body, { encoding: 'utf8', mode: 0o600 })
    renameSync(temporary, this.filename)
  }
}
