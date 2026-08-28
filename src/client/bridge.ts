import type {
  MatchTile,
  TraceWildAction,
  TraceWildActionResponse,
  TraceWildBattleAnimation,
  TraceWildSnapshot,
} from '../core/types.ts'
import { TRACE_ECOLOGIES } from '../core/catalog.ts'
import { MATCH_BOARD_CELLS, MAX_MATCH_CASCADES } from '../core/match3.ts'

const API = '/api/tracewild'

export class TraceWildConnectionError extends Error {
  constructor(readonly code: 'invalid-action' | 'conflict' | 'unavailable') {
    super(code)
  }
}

const TILE_SPECIALS = ['none', 'row', 'column', 'burst', 'origin'] as const

function plainRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)
    || Object.getPrototypeOf(value) !== Object.prototype) throw new TypeError('invalid animation')
  return value as Record<string, unknown>
}

function matchTile(value: unknown): MatchTile {
  const row = plainRecord(value)
  const keys = Object.keys(row)
  if ((keys.length !== 2 && keys.length !== 3) || !('ecology' in row) || !('special' in row)
    || keys.some(key => key !== 'ecology' && key !== 'special' && key !== 'lockedActions')
    || !TRACE_ECOLOGIES.includes(row.ecology as never)
    || !TILE_SPECIALS.includes(row.special as never)) throw new TypeError('invalid animation')
  if (row.lockedActions !== undefined && (!Number.isSafeInteger(row.lockedActions)
    || (row.lockedActions as number) < 1 || (row.lockedActions as number) > 2)) throw new TypeError('invalid animation')
  return {
    ecology: row.ecology as MatchTile['ecology'],
    special: row.special as MatchTile['special'],
    ...(row.lockedActions === undefined ? {} : { lockedActions: row.lockedActions as number }),
  }
}

function matchBoard(value: unknown): MatchTile[] {
  if (!Array.isArray(value) || value.length !== MATCH_BOARD_CELLS) throw new TypeError('invalid animation')
  return value.map(matchTile)
}

function battleAnimation(value: unknown): TraceWildBattleAnimation {
  const row = plainRecord(value)
  if (row.kind !== 'match' || typeof row.battleId !== 'string' || row.battleId.length < 3 || row.battleId.length > 96
    || !Array.isArray(row.frames) || row.frames.length < 1 || row.frames.length > MAX_MATCH_CASCADES) {
    throw new TypeError('invalid animation')
  }
  const frames = row.frames.map((value, frameIndex) => {
    const frame = plainRecord(value)
    if (frame.chain !== frameIndex + 1 || !Array.isArray(frame.removed) || frame.removed.length < 1
      || frame.removed.length > MATCH_BOARD_CELLS || !Array.isArray(frame.fallRows)
      || frame.fallRows.length !== MATCH_BOARD_CELLS) throw new TypeError('invalid animation')
    const removed = frame.removed.map(index => {
      if (!Number.isSafeInteger(index) || (index as number) < 0 || (index as number) >= MATCH_BOARD_CELLS) {
        throw new TypeError('invalid animation')
      }
      return index as number
    })
    if (new Set(removed).size !== removed.length) throw new TypeError('invalid animation')
    const fallRows = frame.fallRows.map(distance => {
      if (!Number.isSafeInteger(distance) || (distance as number) < 0 || (distance as number) > 7) {
        throw new TypeError('invalid animation')
      }
      return distance as number
    })
    return {
      chain: frame.chain as number,
      before: matchBoard(frame.before),
      after: matchBoard(frame.after),
      removed,
      fallRows,
    }
  })
  return { kind: 'match', battleId: row.battleId, frames }
}

function snapshot(value: unknown): TraceWildSnapshot {
  if (typeof value !== 'object' || value === null) throw new TypeError('invalid snapshot')
  const row = value as Partial<TraceWildSnapshot>
  if (row.schemaVersion !== 3 || typeof row.serverTime !== 'number'
    || typeof row.state !== 'object' || row.state === null || row.state.schemaVersion !== 3
    || !Array.isArray(row.state.creatures) || !Array.isArray(row.state.encounters)
    || !Array.isArray(row.state.dex) || !Array.isArray(row.state.squad)) {
    throw new TypeError('invalid snapshot')
  }
  return structuredClone(row as TraceWildSnapshot)
}

export interface TraceWildConnection {
  load(signal?: AbortSignal): Promise<TraceWildSnapshot>
  act(action: TraceWildAction, signal?: AbortSignal): Promise<TraceWildActionResponse>
  subscribe(onSnapshot: (value: TraceWildSnapshot) => void, onStatus: (online: boolean) => void): () => void
}

export function createTraceWildConnection(): TraceWildConnection {
  return {
    async load(signal) {
      const response = await fetch(`${API}/state`, {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
        ...(signal === undefined ? {} : { signal }),
      })
      if (!response.ok) throw new TraceWildConnectionError('unavailable')
      return snapshot(await response.json())
    },

    async act(action, signal) {
      const response = await fetch(`${API}/action`, {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(action),
        ...(signal === undefined ? {} : { signal }),
      })
      if (!response.ok) {
        let code: 'invalid-action' | 'conflict' | 'unavailable' = response.status === 409
          ? 'conflict'
          : response.status >= 500
            ? 'unavailable'
            : 'invalid-action'
        try {
          const failure = await response.json() as { error?: unknown }
          if (failure.error === 'invalid-action' || failure.error === 'conflict' || failure.error === 'unavailable') {
            code = failure.error
          }
        } catch {
          // Status code remains the closed fallback.
        }
        throw new TraceWildConnectionError(code)
      }
      const raw = await response.json() as unknown
      const parsed = snapshot(raw)
      const row = raw as Partial<TraceWildActionResponse>
      if (row.ok !== true) throw new Error('action unavailable')
      return {
        ok: true,
        ...parsed,
        ...(row.notice === undefined ? {} : { notice: row.notice }),
        ...(row.animation === undefined ? {} : { animation: battleAnimation(row.animation) }),
      }
    },

    subscribe(onSnapshot, onStatus) {
      const source = new EventSource(`${API}/events`, { withCredentials: true })
      source.onopen = () => { onStatus(true) }
      source.onerror = () => { onStatus(false) }
      source.onmessage = (event) => {
        try {
          onSnapshot(snapshot(JSON.parse(event.data) as unknown))
          onStatus(true)
        } catch {
          onStatus(false)
        }
      }
      return () => { source.close() }
    },
  }
}
