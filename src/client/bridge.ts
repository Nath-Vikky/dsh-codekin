import type {
  MatchTile,
  MatchDamageEffectiveness,
  MatchSignalEffect,
  TraceWildAction,
  TraceWildActionResponse,
  TraceWildBattleAnimation,
  TraceWildSnapshot,
} from '../core/types.ts'
import { TRACE_ECOLOGIES } from '../core/catalog.ts'
import { MATCH_BOARD_CELLS, MATCH_BOARD_SIZE, MAX_MATCH_CASCADES, areAdjacentTiles } from '../core/match3.ts'

const API = '/api/tracewild'
const TRACEWILD_SETTINGS_CHANGED_EVENT = 'dsh-codekin:settings-changed'
const TRACEWILD_SETTINGS_CHANNEL = 'dsh-codekin-settings-v1'

export function notifyTraceWildSettingsChanged(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(TRACEWILD_SETTINGS_CHANGED_EVENT))
  if (typeof BroadcastChannel === 'undefined') return
  const channel = new BroadcastChannel(TRACEWILD_SETTINGS_CHANNEL)
  channel.postMessage(null)
  channel.close()
}

export function subscribeTraceWildSettingsChanged(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(TRACEWILD_SETTINGS_CHANGED_EVENT, listener)
  const channel = typeof BroadcastChannel === 'undefined'
    ? undefined
    : new BroadcastChannel(TRACEWILD_SETTINGS_CHANNEL)
  channel?.addEventListener('message', listener)
  return () => {
    window.removeEventListener(TRACEWILD_SETTINGS_CHANGED_EVENT, listener)
    channel?.removeEventListener('message', listener)
    channel?.close()
  }
}

export class TraceWildConnectionError extends Error {
  constructor(readonly code: 'invalid-action' | 'conflict' | 'unavailable') {
    super(code)
  }
}

const TILE_SPECIALS = ['none', 'row', 'column', 'burst', 'origin'] as const
const MATCH_SIGNAL_EFFECTS = ['repair', 'guard', 'sync', 'overclock', 'breach'] as const

function plainRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)
    || Object.getPrototypeOf(value) !== Object.prototype) throw new TypeError('invalid animation')
  return value as Record<string, unknown>
}

function matchTile(value: unknown): MatchTile {
  const row = plainRecord(value)
  const keys = Object.keys(row)
  if (keys.length < 2 || keys.length > 4 || !('ecology' in row) || !('special' in row)
    || keys.some(key => key !== 'ecology' && key !== 'special' && key !== 'lockedActions' && key !== 'hazardActions')
    || !TRACE_ECOLOGIES.includes(row.ecology as never)
    || !TILE_SPECIALS.includes(row.special as never)) throw new TypeError('invalid animation')
  if (row.lockedActions !== undefined && (!Number.isSafeInteger(row.lockedActions)
    || (row.lockedActions as number) < 1 || (row.lockedActions as number) > 2)) throw new TypeError('invalid animation')
  if (row.hazardActions !== undefined && (!Number.isSafeInteger(row.hazardActions)
    || (row.hazardActions as number) < 1 || (row.hazardActions as number) > 3)) throw new TypeError('invalid animation')
  return {
    ecology: row.ecology as MatchTile['ecology'],
    special: row.special as MatchTile['special'],
    ...(row.lockedActions === undefined ? {} : { lockedActions: row.lockedActions as number }),
    ...(row.hazardActions === undefined ? {} : { hazardActions: row.hazardActions as number }),
  }
}

function matchBoard(value: unknown): MatchTile[] {
  if (!Array.isArray(value) || value.length !== MATCH_BOARD_CELLS) throw new TypeError('invalid animation')
  return value.map(matchTile)
}

function battleAnimation(value: unknown): TraceWildBattleAnimation {
  const row = plainRecord(value)
  if (row.kind !== 'match' || typeof row.battleId !== 'string' || row.battleId.length < 3 || row.battleId.length > 96
    || !Array.isArray(row.frames) || row.frames.length > MAX_MATCH_CASCADES
    || row.frames.length === 0 && row.strike === undefined) {
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
      if (!Number.isSafeInteger(distance) || (distance as number) < 0 || (distance as number) > MATCH_BOARD_SIZE) {
        throw new TypeError('invalid animation')
      }
      return distance as number
    })
    const hasDamage = frame.damage !== undefined || frame.totalDamage !== undefined || frame.effectiveness !== undefined
    if (hasDamage && (!Number.isSafeInteger(frame.damage) || (frame.damage as number) < 0 || (frame.damage as number) > 9_999_999
      || !Number.isSafeInteger(frame.totalDamage) || (frame.totalDamage as number) < 0 || (frame.totalDamage as number) > 9_999_999
      || frame.effectiveness !== 'advantage' && frame.effectiveness !== 'neutral' && frame.effectiveness !== 'resisted')) {
      throw new TypeError('invalid animation')
    }
    if (frame.hazardDamage !== undefined && (!Number.isSafeInteger(frame.hazardDamage)
      || (frame.hazardDamage as number) < 1 || (frame.hazardDamage as number) > 9_999_999)) {
      throw new TypeError('invalid animation')
    }
    let signalEffect: MatchSignalEffect | undefined
    if (frame.signalEffect !== undefined) {
      const rawEffect = plainRecord(frame.signalEffect)
      const effectKeys = Object.keys(rawEffect)
      if (effectKeys.length !== 3
        || effectKeys.some(key => key !== 'kind' && key !== 'ecology' && key !== 'amount')
        || !MATCH_SIGNAL_EFFECTS.includes(rawEffect.kind as never)
        || !TRACE_ECOLOGIES.includes(rawEffect.ecology as never)
        || !Number.isSafeInteger(rawEffect.amount) || (rawEffect.amount as number) < 0
        || (rawEffect.amount as number) > 9_999_999) throw new TypeError('invalid animation')
      signalEffect = {
        kind: rawEffect.kind as MatchSignalEffect['kind'],
        ecology: rawEffect.ecology as MatchSignalEffect['ecology'],
        amount: rawEffect.amount as number,
      }
    }
    return {
      chain: frame.chain as number,
      before: matchBoard(frame.before),
      after: matchBoard(frame.after),
      removed,
      fallRows,
      ...(hasDamage ? {
        damage: frame.damage as number,
        totalDamage: frame.totalDamage as number,
        effectiveness: frame.effectiveness as MatchDamageEffectiveness,
      } : {}),
      ...(signalEffect === undefined ? {} : { signalEffect }),
      ...(frame.hazardDamage === undefined ? {} : { hazardDamage: frame.hazardDamage as number }),
    }
  })
  if (row.actor !== undefined && row.actor !== 'player' && row.actor !== 'boss') throw new TypeError('invalid animation')
  let strike: TraceWildBattleAnimation['strike']
  if (row.strike !== undefined) {
    const rawStrike = plainRecord(row.strike)
    const strikeKeys = Object.keys(rawStrike)
    if (strikeKeys.length !== 5
      || strikeKeys.some(key => key !== 'actor' && key !== 'damage' && key !== 'targetHpBefore'
        && key !== 'targetHpAfter' && key !== 'targetMaxHp')
      || rawStrike.actor !== 'player' && rawStrike.actor !== 'boss'
      || row.actor !== undefined && rawStrike.actor !== row.actor
      || !Number.isSafeInteger(rawStrike.damage) || (rawStrike.damage as number) < 1 || (rawStrike.damage as number) > 9_999_999
      || !Number.isSafeInteger(rawStrike.targetMaxHp) || (rawStrike.targetMaxHp as number) < 1 || (rawStrike.targetMaxHp as number) > 9_999_999
      || !Number.isSafeInteger(rawStrike.targetHpBefore) || (rawStrike.targetHpBefore as number) < 0
      || (rawStrike.targetHpBefore as number) > (rawStrike.targetMaxHp as number)
      || !Number.isSafeInteger(rawStrike.targetHpAfter) || (rawStrike.targetHpAfter as number) < 0
      || (rawStrike.targetHpAfter as number) > (rawStrike.targetHpBefore as number)) {
      throw new TypeError('invalid animation')
    }
    strike = {
      actor: rawStrike.actor,
      damage: rawStrike.damage as number,
      targetHpBefore: rawStrike.targetHpBefore as number,
      targetHpAfter: rawStrike.targetHpAfter as number,
      targetMaxHp: rawStrike.targetMaxHp as number,
    }
  }
  let swap: TraceWildBattleAnimation['swap']
  if (row.swap !== undefined) {
    const rawSwap = plainRecord(row.swap)
    if (!Number.isSafeInteger(rawSwap.from) || !Number.isSafeInteger(rawSwap.to)
      || !areAdjacentTiles(rawSwap.from as number, rawSwap.to as number)) throw new TypeError('invalid animation')
    swap = { from: rawSwap.from as number, to: rawSwap.to as number }
  }
  return {
    kind: 'match', battleId: row.battleId, frames,
    ...(row.actor === undefined ? {} : { actor: row.actor }),
    ...(swap === undefined ? {} : { swap }),
    ...(strike === undefined ? {} : { strike }),
  }
}

function snapshot(value: unknown): TraceWildSnapshot {
  if (typeof value !== 'object' || value === null) throw new TypeError('invalid snapshot')
  const row = value as Partial<TraceWildSnapshot>
  if (row.schemaVersion !== 3 || typeof row.serverTime !== 'number'
    || typeof row.state !== 'object' || row.state === null || row.state.schemaVersion !== 3
    || typeof row.state.enabled !== 'boolean'
    || !Array.isArray(row.state.creatures) || !Array.isArray(row.state.encounters)
    || !Array.isArray(row.state.dex) || !Array.isArray(row.state.squad)) {
    throw new TypeError('invalid snapshot')
  }
  // Host and Client can briefly straddle different plugin builds during a
  // linked-package refresh. Never let a new 8×8 Client reinterpret a persisted
  // 7×7 battle: its coordinates would render incorrectly and actions would be
  // sent against a different topology. A restarted current Host safely drops
  // the incompatible in-progress battle while preserving the profile.
  if (row.state.battle !== undefined) matchBoard(row.state.battle.board)
  return structuredClone(row as TraceWildSnapshot)
}

export interface TraceWildConnection {
  load(signal?: AbortSignal): Promise<TraceWildSnapshot>
  act(action: TraceWildAction, signal?: AbortSignal): Promise<TraceWildActionResponse>
  clearLocalData(signal?: AbortSignal): Promise<TraceWildActionResponse>
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

    async clearLocalData(signal) {
      const response = await fetch(`${API}/save`, {
        method: 'DELETE',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ confirmation: 'delete-codekin-save' }),
        ...(signal === undefined ? {} : { signal }),
      })
      if (!response.ok) throw new TraceWildConnectionError(response.status >= 500 ? 'unavailable' : 'invalid-action')
      const raw = await response.json() as unknown
      const parsed = snapshot(raw)
      const row = raw as Partial<TraceWildActionResponse>
      if (row.ok !== true) throw new TraceWildConnectionError('unavailable')
      return { ok: true, ...parsed }
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
