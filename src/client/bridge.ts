import type {
  TraceWildAction,
  TraceWildActionResponse,
  TraceWildSnapshot,
} from '../core/types.ts'

const API = '/api/tracewild'

export class TraceWildConnectionError extends Error {
  constructor(readonly code: 'invalid-action' | 'conflict' | 'unavailable') {
    super(code)
  }
}

function snapshot(value: unknown): TraceWildSnapshot {
  if (typeof value !== 'object' || value === null) throw new TypeError('invalid snapshot')
  const row = value as Partial<TraceWildSnapshot>
  if (row.schemaVersion !== 2 || typeof row.serverTime !== 'number'
    || typeof row.state !== 'object' || row.state === null || row.state.schemaVersion !== 2
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
