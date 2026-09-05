import { describe, expect, it } from 'vitest'
import type { CaptureCoreQuality, CapturedCreature, CreatureDefinition, TraceEcology } from '../packages/engine/src/types.ts'
import {
  arrangeCodekinRoster,
  type CodekinRosterEntry,
} from '../packages/renderer-react/src/roster.ts'

function entry(
  instanceId: string,
  level: number,
  ecology: TraceEcology,
  quality: CaptureCoreQuality,
  sourceIndex: number,
): CodekinRosterEntry {
  const captured: CapturedCreature = {
    instanceId,
    creatureId: `creature-${instanceId}`,
    quality,
    level,
    xp: 0,
    wins: 0,
    caughtAt: sourceIndex + 1,
    firstSignal: ecology,
  }
  const creature: CreatureDefinition = {
    number: sourceIndex + 1,
    id: captured.creatureId,
    nameZh: instanceId,
    nameEn: instanceId,
    ecology,
    rarity: 'common',
    combatRole: 'test',
    baseCaptureRate: 0.5,
    signatureProtocol: 'test',
    spriteIndex: sourceIndex,
    stats: { hp: 1, attack: 1, defense: 1, speed: 1 },
  }
  return { captured, creature, sourceIndex }
}

const ROSTER = [
  entry('lumen-low', 3, 'lumen', 'pebble', 0),
  entry('forge-high', 18, 'forge', 'nova', 1),
  entry('lumen-high', 18, 'lumen', 'nova', 2),
  entry('relay-mid', 9, 'relay', 'prism', 3),
] as const

describe('Codekin roster projection', () => {
  it('searches names and numbers with whitespace, case and full-width normalization', () => {
    const criteria = { ecology: 'all', quality: 'all', sort: 'default' } as const
    expect(arrangeCodekinRoster(ROSTER, { ...criteria, query: ' ＦＯＲＧＥ ' }).map(row => row.captured.instanceId)).toEqual(['forge-high'])
    expect(arrangeCodekinRoster(ROSTER, { ...criteria, query: '#03' }).map(row => row.captured.instanceId)).toEqual(['lumen-high'])
    expect(arrangeCodekinRoster(ROSTER, { ...criteria, query: 'not found' })).toEqual([])
    const chinese = entry('索引团', 3, 'lumen', 'pebble', 0)
    expect(arrangeCodekinRoster([chinese], { ...criteria, query: '索引' })).toEqual([chinese])
  })
  it('filters by ecology and individual quality together', () => {
    expect(arrangeCodekinRoster(ROSTER, {
      ecology: 'lumen', quality: 'nova', sort: 'default',
    }).map(row => row.captured.instanceId)).toEqual(['lumen-high'])
  })

  it('sorts levels in both directions and keeps equal levels stable', () => {
    expect(arrangeCodekinRoster(ROSTER, {
      ecology: 'all', quality: 'all', sort: 'level-asc',
    }).map(row => row.captured.instanceId)).toEqual([
      'lumen-low', 'relay-mid', 'forge-high', 'lumen-high',
    ])
    expect(arrangeCodekinRoster(ROSTER, {
      ecology: 'all', quality: 'all', sort: 'level-desc',
    }).map(row => row.captured.instanceId)).toEqual([
      'forge-high', 'lumen-high', 'relay-mid', 'lumen-low',
    ])
  })

  it('does not mutate the authoritative roster order', () => {
    const before = ROSTER.map(row => row.captured.instanceId)
    arrangeCodekinRoster(ROSTER, { ecology: 'all', quality: 'all', sort: 'level-desc' })
    expect(ROSTER.map(row => row.captured.instanceId)).toEqual(before)
  })
})
