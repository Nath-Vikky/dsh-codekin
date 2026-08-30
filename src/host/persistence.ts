import { mkdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import { createInitialTraceWildState, restoreTraceWildState } from '../../packages/engine/src/engine.ts'
import type { TraceWildState } from '../../packages/engine/src/types.ts'

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

export function codekinSaveStatePath(): string {
  return join(traceWildHome(), 'codekinsave', 'state.json')
}

/** Kept as a source-compatible alias for internal consumers. */
export function traceWildStatePath(): string {
  return codekinSaveStatePath()
}

export function traceWildLegacyStatePath(): string {
  return join(traceWildHome(), 'tracewild', 'state.json')
}

function missingFile(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT'
}

function readState(filename: string, now: number): TraceWildState | undefined {
  try {
    if (statSync(filename).size > MAX_STATE_BYTES) return undefined
    return restoreTraceWildState(JSON.parse(readFileSync(filename, 'utf8')) as unknown, now)
  } catch {
    return undefined
  }
}

function removeFile(filename: string): void {
  try {
    unlinkSync(filename)
  } catch (error) {
    if (!missingFile(error)) throw error
  }
}

export class TraceWildPersistence {
  constructor(
    readonly filename = codekinSaveStatePath(),
    readonly legacyFilename: string | undefined = filename === codekinSaveStatePath()
      ? traceWildLegacyStatePath()
      : undefined,
  ) {}

  load(now = Date.now()): TraceWildState {
    try {
      statSync(this.filename)
      return readState(this.filename, now) ?? createInitialTraceWildState(now)
    } catch (error) {
      if (!missingFile(error)) return createInitialTraceWildState(now)
    }

    if (this.legacyFilename !== undefined) {
      const migrated = readState(this.legacyFilename, now)
      if (migrated !== undefined) {
        try {
          this.save(migrated)
          removeFile(this.legacyFilename)
          removeFile(`${this.legacyFilename}.tmp`)
        } catch {
          // Keep serving the recovered state. The intact legacy file remains a
          // fallback when the new destination cannot be committed yet.
        }
        return migrated
      }
    }
    return createInitialTraceWildState(now)
  }

  save(state: TraceWildState): void {
    mkdirSync(dirname(this.filename), { recursive: true, mode: 0o700 })
    const temporary = `${this.filename}.tmp`
    const body = JSON.stringify(state)
    if (Buffer.byteLength(body, 'utf8') > MAX_STATE_BYTES) throw new Error('TraceWild state is too large')
    writeFileSync(temporary, body, { encoding: 'utf8', mode: 0o600 })
    renameSync(temporary, this.filename)
  }

  clear(): void {
    removeFile(this.filename)
    removeFile(`${this.filename}.tmp`)
    if (this.legacyFilename !== undefined && this.legacyFilename !== this.filename) {
      removeFile(this.legacyFilename)
      removeFile(`${this.legacyFilename}.tmp`)
    }
  }
}
