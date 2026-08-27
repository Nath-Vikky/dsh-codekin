import type {
  TraceWildAction,
  TraceWildActionResponse,
  TraceWildSnapshot,
} from '../core/types.ts'

const API = '/api/tracewild'

function snapshot(value: unknown): TraceWildSnapshot {
  if (typeof value !== 'object' || value === null) throw new TypeError('invalid snapshot')
  const row = value as Partial<TraceWildSnapshot>
  if (row.schemaVersion !== 1 || typeof row.serverTime !== 'number'
    || typeof row.state !== 'object' || row.state === null || row.state.schemaVersion !== 1
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
      if (!response.ok) throw new Error('state unavailable')
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
      if (!response.ok) throw new Error(response.status === 409 ? 'conflict' : 'action unavailable')
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
