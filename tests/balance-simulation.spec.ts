import { describe, expect, it } from 'vitest'
import {
  combatSimulationGateIssues,
  runCombatSimulation,
} from '../tools/simulation.ts'

describe('combat pacing matrix', () => {
  it('keeps ordinary fights multi-round and over-level elites dangerous', () => {
    const report = runCombatSimulation()
    console.table(report.rows)
    expect(report.rows).toHaveLength(7)
    expect(report.seedCount).toBe(24)
    expect(combatSimulationGateIssues(report)).toEqual([])
  })
})
