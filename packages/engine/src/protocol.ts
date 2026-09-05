import { CAPTURE_CORE_QUALITIES } from '../../content-sdk/src/types.ts'
import { MATCH_BOARD_CELLS } from './match3.ts'
import type { CaptureCoreQuality, TraceWildAction } from './types.ts'

function plainRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)
    || Object.getPrototypeOf(value) !== Object.prototype) throw new TypeError('invalid action')
  return value as Record<string, unknown>
}

function exactKeys(record: Record<string, unknown>, keys: readonly string[]): void {
  const actual = Object.keys(record)
  if (actual.length !== keys.length || actual.some(key => !keys.includes(key))) throw new TypeError('invalid action')
}

function safeId(value: unknown, prefix?: string): string {
  if (typeof value !== 'string' || value.length < 3 || value.length > 96
    || !/^[a-z0-9_-]+$/.test(value) || (prefix !== undefined && !value.startsWith(prefix))) {
    throw new TypeError('invalid action')
  }
  return value
}

function boardIndex(value: unknown): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0 || (value as number) >= MATCH_BOARD_CELLS) {
    throw new TypeError('invalid action')
  }
  return value as number
}

export function normalizeTraceWildAction(value: unknown): TraceWildAction {
  const row = plainRecord(value)
  switch (row.type) {
    case 'choose-starter':
      exactKeys(row, ['type', 'creatureId'])
      return { type: 'choose-starter', creatureId: safeId(row.creatureId) }
    case 'start-battle':
      exactKeys(row, ['type', 'encounterId'])
      return { type: 'start-battle', encounterId: safeId(row.encounterId, 'wild_') }
    case 'start-tower':
      exactKeys(row, ['type'])
      return { type: 'start-tower' }
    case 'battle-swap':
      exactKeys(row, ['type', 'from', 'to'])
      return { type: 'battle-swap', from: boardIndex(row.from), to: boardIndex(row.to) }
    case 'battle-cast':
      exactKeys(row, ['type', 'creatureInstanceId'])
      return { type: 'battle-cast', creatureInstanceId: safeId(row.creatureInstanceId, 'pet_') }
    case 'battle-skip-stage':
      exactKeys(row, ['type'])
      return { type: 'battle-skip-stage' }
    case 'battle-continue':
      exactKeys(row, ['type'])
      return { type: 'battle-continue' }
    case 'capture':
      exactKeys(row, ['type', 'quality'])
      if (!CAPTURE_CORE_QUALITIES.includes(row.quality as never)) throw new TypeError('invalid action')
      return { type: 'capture', quality: row.quality as CaptureCoreQuality }
    case 'claim-idle-reward':
      exactKeys(row, ['type'])
      return { type: 'claim-idle-reward' }
    case 'feed-material':
      exactKeys(row, ['type', 'creatureInstanceId', 'quality', 'count'])
      if (!CAPTURE_CORE_QUALITIES.includes(row.quality as never)
        || !Number.isSafeInteger(row.count) || (row.count as number) < 1 || (row.count as number) > 99) {
        throw new TypeError('invalid action')
      }
      return {
        type: 'feed-material',
        creatureInstanceId: safeId(row.creatureInstanceId, 'pet_'),
        quality: row.quality as CaptureCoreQuality,
        count: row.count as number,
      }
    case 'release-creature':
      exactKeys(row, ['type', 'creatureInstanceId'])
      return { type: 'release-creature', creatureInstanceId: safeId(row.creatureInstanceId, 'pet_') }
    case 'set-creature-appearance':
      exactKeys(row, ['type', 'creatureInstanceId', 'appearance'])
      if (row.appearance !== 'original' && row.appearance !== 'evolved') throw new TypeError('invalid action')
      return {
        type: 'set-creature-appearance',
        creatureInstanceId: safeId(row.creatureInstanceId, 'pet_'),
        appearance: row.appearance,
      }
    case 'flee':
      exactKeys(row, ['type'])
      return { type: 'flee' }
    case 'set-squad': {
      exactKeys(row, ['type', 'instanceIds'])
      if (!Array.isArray(row.instanceIds) || row.instanceIds.length < 1 || row.instanceIds.length > 3) {
        throw new TypeError('invalid action')
      }
      return { type: 'set-squad', instanceIds: row.instanceIds.map(id => safeId(id, 'pet_')) }
    }
    case 'set-enabled':
      exactKeys(row, ['type', 'enabled'])
      if (typeof row.enabled !== 'boolean') throw new TypeError('invalid action')
      return { type: 'set-enabled', enabled: row.enabled }
    default:
      throw new TypeError('invalid action')
  }
}
