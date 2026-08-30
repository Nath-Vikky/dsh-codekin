import {
  constants as fsConstants,
  copyFileSync,
  mkdirSync,
  readFileSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { homedir } from 'node:os'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import type { CodekinRuntime } from '../../engine/src/runtime.ts'
import type { TraceWildState } from '../../engine/src/types.ts'

const MAX_SAVE_BYTES = 2 * 1024 * 1024
export const CODEKIN_SAVE_FORMAT = 'codekin.save' as const
export const CODEKIN_SAVE_VERSION = 1 as const

type PersistenceRuntime = Pick<
  CodekinRuntime,
  'engineVersion' | 'content' | 'createInitialTraceWildState' | 'restoreTraceWildState'
>

export interface CodekinSaveEnvelopeV1 {
  format: typeof CODEKIN_SAVE_FORMAT
  version: typeof CODEKIN_SAVE_VERSION
  engineVersion: string
  content: {
    id: string
    packs: readonly { id: string; version: string }[]
  }
  state: TraceWildState
}

interface ReadStateResult {
  state: TraceWildState
  shouldRewrite: boolean
}

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

function existingFile(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'EEXIST'
}

function record(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined
}

function validStateVersion(value: unknown): boolean {
  const version = record(value)?.schemaVersion
  return version === 1 || version === 2 || version === 3
}

function envelopeMatchesRuntime(root: Record<string, unknown>, runtime: PersistenceRuntime): boolean {
  if (root.engineVersion !== runtime.engineVersion) return false
  const content = record(root.content)
  if (content?.id !== runtime.content.id || !Array.isArray(content.packs)) return false
  return content.packs.length === runtime.content.packs.length
    && content.packs.every((value, index) => {
      const pack = record(value)
      const expected = runtime.content.packs[index]
      return expected !== undefined && pack?.id === expected.id && pack.version === expected.version
    })
}

export function createCodekinSaveEnvelope(
  runtime: PersistenceRuntime,
  state: TraceWildState,
): CodekinSaveEnvelopeV1 {
  return {
    format: CODEKIN_SAVE_FORMAT,
    version: CODEKIN_SAVE_VERSION,
    engineVersion: runtime.engineVersion,
    content: {
      id: runtime.content.id,
      packs: runtime.content.packs.map(pack => ({ id: pack.id, version: pack.version })),
    },
    state,
  }
}

function readState(
  runtime: PersistenceRuntime,
  filename: string,
  now: number,
): ReadStateResult | undefined {
  try {
    if (statSync(filename).size > MAX_SAVE_BYTES) return undefined
    const parsed = JSON.parse(readFileSync(filename, 'utf8')) as unknown
    const root = record(parsed)
    if (root?.format === CODEKIN_SAVE_FORMAT) {
      if (root.version !== CODEKIN_SAVE_VERSION || !validStateVersion(root.state)) return undefined
      return {
        state: runtime.restoreTraceWildState(root.state, now),
        shouldRewrite: !envelopeMatchesRuntime(root, runtime),
      }
    }
    return {
      state: runtime.restoreTraceWildState(parsed, now),
      shouldRewrite: validStateVersion(parsed),
    }
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
  private pendingMigrationBackup: string | undefined

  constructor(
    readonly runtime: PersistenceRuntime,
    readonly filename = codekinSaveStatePath(),
    readonly legacyFilename: string | undefined = filename === codekinSaveStatePath()
      ? traceWildLegacyStatePath()
      : undefined,
  ) {}

  load(now = Date.now()): TraceWildState {
    try {
      statSync(this.filename)
      const loaded = readState(this.runtime, this.filename, now)
      if (loaded === undefined) {
        // Preserve an unreadable or future-format file before a later action
        // commits a fresh current-format save over it.
        this.pendingMigrationBackup = this.filename
        return this.runtime.createInitialTraceWildState(now)
      }
      if (loaded.shouldRewrite) {
        this.pendingMigrationBackup = this.filename
        try {
          this.save(loaded.state)
        } catch {
          // The recovered in-memory state remains usable; retry on next save.
        }
      }
      return loaded.state
    } catch (error) {
      if (!missingFile(error)) return this.runtime.createInitialTraceWildState(now)
    }

    if (this.legacyFilename !== undefined) {
      const migrated = readState(this.runtime, this.legacyFilename, now)
      if (migrated !== undefined) {
        this.pendingMigrationBackup = this.legacyFilename
        try {
          this.save(migrated.state)
          removeFile(this.legacyFilename)
          removeFile(`${this.legacyFilename}.tmp`)
        } catch {
          // Keep serving the recovered state. The intact legacy file remains a
          // fallback when the new destination cannot be committed yet.
        }
        return migrated.state
      }
    }
    return this.runtime.createInitialTraceWildState(now)
  }

  save(state: TraceWildState): void {
    mkdirSync(dirname(this.filename), { recursive: true, mode: 0o700 })
    if (this.pendingMigrationBackup !== undefined) {
      try {
        copyFileSync(
          this.pendingMigrationBackup,
          `${this.filename}.migration-backup`,
          fsConstants.COPYFILE_EXCL,
        )
      } catch (error) {
        if (!existingFile(error)) throw error
      }
      this.pendingMigrationBackup = undefined
    }
    const temporary = `${this.filename}.tmp`
    const body = JSON.stringify(createCodekinSaveEnvelope(this.runtime, state))
    if (Buffer.byteLength(body, 'utf8') > MAX_SAVE_BYTES) throw new Error('Codekin save is too large')
    writeFileSync(temporary, body, { encoding: 'utf8', mode: 0o600 })
    renameSync(temporary, this.filename)
  }

  clear(): void {
    this.pendingMigrationBackup = undefined
    removeFile(this.filename)
    removeFile(`${this.filename}.tmp`)
    removeFile(`${this.filename}.migration-backup`)
    if (this.legacyFilename !== undefined && this.legacyFilename !== this.filename) {
      removeFile(this.legacyFilename)
      removeFile(`${this.legacyFilename}.tmp`)
    }
  }
}
