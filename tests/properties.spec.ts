import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { MAX_MAP_ENCOUNTERS } from '../packages/engine/src/balance.ts'
import { MAX_TOWER_FLOOR } from '../packages/engine/src/tower.ts'
import { CAPTURE_CORE_QUALITIES } from '../packages/content-sdk/src/types.ts'
import { CORE_CODEKIN_RUNTIME, CORE_CONTENT_REGISTRY } from '../src/core-runtime.ts'
import type { TraceWildState } from '../packages/engine/src/types.ts'

const corruptedSave = fc.record({
  schemaVersion: fc.constantFrom(1, 2, 3),
  enabled: fc.jsonValue(),
  revision: fc.jsonValue(),
  createdAt: fc.jsonValue(),
  updatedAt: fc.jsonValue(),
  cores: fc.jsonValue(),
  materials: fc.jsonValue(),
  creatures: fc.array(fc.jsonValue(), { maxLength: 280 }),
  squad: fc.array(fc.jsonValue(), { maxLength: 20 }),
  dex: fc.array(fc.jsonValue(), { maxLength: 80 }),
  encounters: fc.array(fc.jsonValue(), { maxLength: 30 }),
  battle: fc.jsonValue(),
  stats: fc.jsonValue(),
  rewardPity: fc.jsonValue(),
  idle: fc.jsonValue(),
  tower: fc.jsonValue(),
  processedSignals: fc.array(fc.jsonValue(), { maxLength: 300 }),
  log: fc.array(fc.jsonValue(), { maxLength: 100 }),
})

function expectRestoredStateInvariants(state: TraceWildState): void {
  expect(state.schemaVersion).toBe(3)
  expect(Number.isSafeInteger(state.revision)).toBe(true)
  expect(Number.isSafeInteger(state.createdAt)).toBe(true)
  expect(Number.isSafeInteger(state.updatedAt)).toBe(true)
  for (const quality of CAPTURE_CORE_QUALITIES) {
    expect(state.cores[quality]).toBeGreaterThanOrEqual(0)
    expect(state.cores[quality]).toBeLessThanOrEqual(9_999)
    expect(state.materials[quality]).toBeGreaterThanOrEqual(0)
    expect(state.materials[quality]).toBeLessThanOrEqual(9_999)
  }

  expect(state.creatures.length).toBeLessThanOrEqual(240)
  const instanceIds = new Set(state.creatures.map(creature => creature.instanceId))
  expect(instanceIds.size).toBe(state.creatures.length)
  for (const creature of state.creatures) {
    expect(CORE_CONTENT_REGISTRY.creature(creature.creatureId)).toBeDefined()
    expect(creature.level).toBeGreaterThanOrEqual(1)
    expect(creature.level).toBeLessThanOrEqual(100)
  }
  expect(state.squad.length).toBeLessThanOrEqual(3)
  expect(state.squad.every(id => instanceIds.has(id))).toBe(true)

  expect(state.dex.length).toBeLessThanOrEqual(CORE_CONTENT_REGISTRY.creatures.length)
  expect(new Set(state.dex.map(row => row.creatureId)).size).toBe(state.dex.length)
  expect(state.dex.every(row => CORE_CONTENT_REGISTRY.creature(row.creatureId) !== undefined)).toBe(true)
  expect(state.encounters.length).toBeLessThanOrEqual(MAX_MAP_ENCOUNTERS)
  expect(state.encounters.every(row => CORE_CONTENT_REGISTRY.creature(row.creatureId) !== undefined)).toBe(true)
  expect(state.processedSignals.length).toBeLessThanOrEqual(256)
  expect(state.processedSignals.every(id => /^[a-f0-9]{24}$/u.test(id))).toBe(true)
  expect(state.tower.highestClearedFloor).toBeLessThanOrEqual(MAX_TOWER_FLOOR)
  expect(() => JSON.stringify(state)).not.toThrow()
}

describe('engine properties', () => {
  it('restores arbitrary JSON and corrupted legacy saves into deterministic bounded states', () => {
    fc.assert(fc.property(
      fc.oneof(fc.jsonValue(), corruptedSave),
      fc.integer({ min: 0, max: 2_000_000_000_000 }),
      (value, now) => {
        const first = CORE_CODEKIN_RUNTIME.restoreTraceWildState(value, now)
        const second = CORE_CODEKIN_RUNTIME.restoreTraceWildState(value, now)
        expectRestoredStateInvariants(first)
        expect(second).toEqual(first)
      },
    ), { numRuns: 200 })
  })

  it('keeps every valid tower floor deterministic and inside registered content', () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: MAX_TOWER_FLOOR }),
      (floor) => {
        const first = CORE_CODEKIN_RUNTIME.towerFloorProfile(floor)
        const second = CORE_CODEKIN_RUNTIME.towerFloorProfile(floor)
        expect(second).toEqual(first)
        expect(first.floor).toBe(floor)
        expect(CORE_CONTENT_REGISTRY.creature(first.creatureId)).toBeDefined()
        expect(CAPTURE_CORE_QUALITIES).toContain(first.quality)
        expect(first.skillTier).toBeGreaterThanOrEqual(1)
        expect(first.skillTier).toBeLessThanOrEqual(5)
      },
    ), { numRuns: 500 })
  })
})
