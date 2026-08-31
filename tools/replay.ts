import { createHash } from 'node:crypto'
import { readFile, stat, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { CORE_CODEKIN_RUNTIME } from '../src/core-runtime.ts'
import type {
  TraceSignal,
  TraceWildAction,
  TraceWildState,
} from '../packages/engine/src/types.ts'
import type { CodekinRuntime } from '../packages/engine/src/runtime.ts'
import { createSeededRandom, SEEDED_RANDOM_ALGORITHM } from './random.ts'

export const REPLAY_FORMAT = 'codekin-replay-v1' as const
const MAX_REPLAY_BYTES = 8 * 1024 * 1024
const MAX_REPLAY_STEPS = 100_000

export interface ReplayActionStep {
  kind: 'action'
  at: number
  action: TraceWildAction
}

export interface ReplaySignalStep {
  kind: 'signal'
  signal: TraceSignal
}

export type ReplayStep = ReplayActionStep | ReplaySignalStep

export interface ReplayExpectation {
  finalStateSha256?: string
  revision?: number
}

export interface ReplayTranscript {
  format: typeof REPLAY_FORMAT
  random: typeof SEEDED_RANDOM_ALGORITHM
  seed: number
  startedAt: number
  engineVersion?: string
  contentPacks?: readonly { id: string; version: string }[]
  initialState?: unknown
  steps: readonly ReplayStep[]
  expect?: ReplayExpectation
}

export interface ReplayStepResult {
  index: number
  kind: ReplayStep['kind']
  revision: number
  stateSha256: string
  notice?: string
}

export interface ReplayResult {
  format: typeof REPLAY_FORMAT
  engineVersion: string
  contentPacks: readonly { id: string; version: string }[]
  seed: number
  randomDraws: number
  initialStateSha256: string
  finalStateSha256: string
  finalRevision: number
  steps: readonly ReplayStepResult[]
  state: TraceWildState
}

function objectValue(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined
}

function unsignedInt(value: unknown, label: string, maximum = Number.MAX_SAFE_INTEGER): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0 || (value as number) > maximum) {
    throw new TypeError(`${label} must be an unsigned integer no greater than ${maximum}`)
  }
  return value as number
}

function parsePackIdentities(value: unknown): readonly { id: string; version: string }[] | undefined {
  if (value === undefined) return undefined
  if (!Array.isArray(value) || value.length > 128) throw new TypeError('contentPacks must be an array with at most 128 entries')
  return value.map((entry, index) => {
    const row = objectValue(entry)
    if (row === undefined || typeof row.id !== 'string' || typeof row.version !== 'string') {
      throw new TypeError(`contentPacks[${index}] must contain string id and version fields`)
    }
    return Object.freeze({ id: row.id, version: row.version })
  })
}

function parseExpectation(value: unknown): ReplayExpectation | undefined {
  if (value === undefined) return undefined
  const row = objectValue(value)
  if (row === undefined) throw new TypeError('expect must be an object')
  const finalStateSha256 = row.finalStateSha256
  if (finalStateSha256 !== undefined
    && (typeof finalStateSha256 !== 'string' || !/^[a-f0-9]{64}$/.test(finalStateSha256))) {
    throw new TypeError('expect.finalStateSha256 must be a lowercase SHA-256 digest')
  }
  const revision = row.revision === undefined ? undefined : unsignedInt(row.revision, 'expect.revision')
  return {
    ...(finalStateSha256 === undefined ? {} : { finalStateSha256 }),
    ...(revision === undefined ? {} : { revision }),
  }
}

function parseStep(value: unknown, index: number): ReplayStep {
  const row = objectValue(value)
  if (row === undefined) throw new TypeError(`steps[${index}] must be an object`)
  if (row.kind === 'signal') {
    const signal = objectValue(row.signal)
    if (signal === undefined || typeof signal.id !== 'string' || typeof signal.ecology !== 'string'
      || typeof signal.outcome !== 'string') {
      throw new TypeError(`steps[${index}].signal is malformed`)
    }
    unsignedInt(signal.at, `steps[${index}].signal.at`)
    return { kind: 'signal', signal: signal as unknown as TraceSignal }
  }
  if (row.kind === 'action') {
    const action = objectValue(row.action)
    if (action === undefined || typeof action.type !== 'string') {
      throw new TypeError(`steps[${index}].action is malformed`)
    }
    return {
      kind: 'action',
      at: unsignedInt(row.at, `steps[${index}].at`),
      action: action as unknown as TraceWildAction,
    }
  }
  throw new TypeError(`steps[${index}].kind must be action or signal`)
}

export function parseReplayTranscript(value: unknown): ReplayTranscript {
  const root = objectValue(value)
  if (root === undefined) throw new TypeError('replay transcript must be an object')
  if (root.format !== REPLAY_FORMAT) throw new TypeError(`format must be ${REPLAY_FORMAT}`)
  if (root.random !== SEEDED_RANDOM_ALGORITHM) throw new TypeError(`random must be ${SEEDED_RANDOM_ALGORITHM}`)
  if (!Array.isArray(root.steps) || root.steps.length > MAX_REPLAY_STEPS) {
    throw new TypeError(`steps must be an array with at most ${MAX_REPLAY_STEPS} entries`)
  }
  const engineVersion = root.engineVersion
  if (engineVersion !== undefined && typeof engineVersion !== 'string') {
    throw new TypeError('engineVersion must be a string')
  }
  const contentPacks = parsePackIdentities(root.contentPacks)
  const expectation = parseExpectation(root.expect)
  return Object.freeze({
    format: REPLAY_FORMAT,
    random: SEEDED_RANDOM_ALGORITHM,
    seed: unsignedInt(root.seed, 'seed', 0xffff_ffff),
    startedAt: unsignedInt(root.startedAt, 'startedAt'),
    ...(engineVersion === undefined ? {} : { engineVersion }),
    ...(contentPacks === undefined ? {} : { contentPacks }),
    ...(root.initialState === undefined ? {} : { initialState: root.initialState }),
    steps: Object.freeze(root.steps.map(parseStep)),
    ...(expectation === undefined ? {} : { expect: expectation }),
  })
}

function canonicalValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalValue)
  const row = objectValue(value)
  if (row === undefined) return value
  return Object.fromEntries(Object.keys(row).sort().flatMap(key => (
    row[key] === undefined ? [] : [[key, canonicalValue(row[key])]]
  )))
}

export function stateSha256(state: TraceWildState): string {
  return createHash('sha256').update(JSON.stringify(canonicalValue(state))).digest('hex')
}

function assertRuntimeIdentity(transcript: ReplayTranscript, runtime: CodekinRuntime): void {
  if (transcript.engineVersion !== undefined && transcript.engineVersion !== runtime.engineVersion) {
    throw new Error(`replay engine ${transcript.engineVersion} does not match runtime ${runtime.engineVersion}`)
  }
  if (transcript.contentPacks === undefined) return
  const actual = runtime.content.packs.map(pack => ({ id: pack.id, version: pack.version }))
  if (JSON.stringify(transcript.contentPacks) !== JSON.stringify(actual)) {
    throw new Error(`replay content set ${JSON.stringify(transcript.contentPacks)} does not match runtime ${JSON.stringify(actual)}`)
  }
}

export function runReplay(
  input: ReplayTranscript | unknown,
  runtime: CodekinRuntime = CORE_CODEKIN_RUNTIME,
): ReplayResult {
  const transcript = parseReplayTranscript(input)
  assertRuntimeIdentity(transcript, runtime)
  const random = createSeededRandom(transcript.seed)
  let state = transcript.initialState === undefined
    ? runtime.createInitialTraceWildState(transcript.startedAt)
    : runtime.restoreTraceWildState(transcript.initialState, transcript.startedAt)
  const initialStateSha256 = stateSha256(state)
  const steps: ReplayStepResult[] = []
  transcript.steps.forEach((step, index) => {
    let notice: string | undefined
    if (step.kind === 'signal') {
      state = runtime.applyTraceSignal(state, step.signal, random.next)
    } else {
      const response = runtime.applyTraceWildAction(state, step.action, random.next, step.at)
      state = response.state
      notice = response.notice
    }
    steps.push(Object.freeze({
      index,
      kind: step.kind,
      revision: state.revision,
      stateSha256: stateSha256(state),
      ...(notice === undefined ? {} : { notice }),
    }))
  })
  const finalStateSha256 = stateSha256(state)
  if (transcript.expect?.finalStateSha256 !== undefined
    && transcript.expect.finalStateSha256 !== finalStateSha256) {
    throw new Error(`replay digest mismatch: expected ${transcript.expect.finalStateSha256}, received ${finalStateSha256}`)
  }
  if (transcript.expect?.revision !== undefined && transcript.expect.revision !== state.revision) {
    throw new Error(`replay revision mismatch: expected ${transcript.expect.revision}, received ${state.revision}`)
  }
  return Object.freeze({
    format: REPLAY_FORMAT,
    engineVersion: runtime.engineVersion,
    contentPacks: Object.freeze(runtime.content.packs.map(pack => Object.freeze({
      id: pack.id,
      version: pack.version,
    }))),
    seed: transcript.seed,
    randomDraws: random.draws,
    initialStateSha256,
    finalStateSha256,
    finalRevision: state.revision,
    steps: Object.freeze(steps),
    state,
  })
}

function replaySummary(result: ReplayResult): Omit<ReplayResult, 'state'> {
  const { state: _state, ...summary } = result
  return summary
}

export async function replayCli(argv: readonly string[]): Promise<number> {
  let json = false
  let stateOutput: string | undefined
  let inputPath: string | undefined
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]!
    if (argument === '--json') json = true
    else if (argument === '--state-out') stateOutput = argv[++index]
    else if (argument === '--help' || argument === '-h') {
      console.log('Usage: node tools/replay.ts <transcript.json> [--json] [--state-out <path>]')
      return 0
    } else if (argument.startsWith('-')) throw new TypeError(`unknown option ${argument}`)
    else if (inputPath === undefined) inputPath = argument
    else throw new TypeError(`unexpected argument ${argument}`)
  }
  if (inputPath === undefined) throw new TypeError('a replay transcript path is required')
  const absoluteInput = resolve(inputPath)
  const inputStat = await stat(absoluteInput)
  if (!inputStat.isFile() || inputStat.size > MAX_REPLAY_BYTES) {
    throw new RangeError(`replay must be a file no larger than ${MAX_REPLAY_BYTES} bytes`)
  }
  const parsed: unknown = JSON.parse(await readFile(absoluteInput, 'utf8'))
  const result = runReplay(parsed)
  if (stateOutput !== undefined) {
    await writeFile(resolve(stateOutput), `${JSON.stringify(result.state, null, 2)}\n`, 'utf8')
  }
  if (json) console.log(JSON.stringify(replaySummary(result), null, 2))
  else console.log(`Replay OK: ${result.steps.length} steps, revision ${result.finalRevision}, ${result.randomDraws} random draws, sha256 ${result.finalStateSha256}`)
  return 0
}

const isMain = process.argv[1] !== undefined && pathToFileURL(resolve(process.argv[1])).href === import.meta.url
if (isMain) {
  replayCli(process.argv.slice(2)).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
