import { describe, expect, it } from 'vitest'
import { CORE_CREATURE_MECHANICS } from '../content-packs/core/src/mechanics.ts'
import {
  MechanicsContractError,
  assertMechanicsContract,
  mechanicsContractIssues,
} from '../packages/engine/src/mechanics-contract.ts'

describe('Codekin mechanics contract', () => {
  it('accepts every opcode and parameter used by the 0.3.2 core roster', () => {
    expect(mechanicsContractIssues(CORE_CREATURE_MECHANICS)).toEqual([])
    expect(() => assertMechanicsContract(CORE_CREATURE_MECHANICS)).not.toThrow()
  })

  it('reports unsupported opcodes as structured compatibility issues', () => {
    const invalid = [{
      creatureId: 'test-creature',
      bindings: [{ trigger: 'skill:cast' as const, opcode: 'script.execute-arbitrary' }],
    }]
    expect(() => assertMechanicsContract(invalid)).toThrowError(expect.objectContaining({
      name: 'MechanicsContractError',
      issues: [expect.objectContaining({
        path: '/mechanics/test-creature/bindings/0/opcode',
        message: 'unsupported opcode script.execute-arbitrary',
      })],
    }))
    expect(() => assertMechanicsContract(invalid)).toThrow(MechanicsContractError)
  })

  it('rejects wrong triggers, missing parameters, and undeclared parameters', () => {
    const issues = mechanicsContractIssues([{
      creatureId: 'test-creature',
      bindings: [{
        trigger: 'match:after',
        opcode: 'damage.raw-hit',
        params: { surprise: true },
      }],
    }])
    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: expect.stringMatching(/trigger$/), message: expect.stringContaining('requires trigger') }),
      expect.objectContaining({ path: expect.stringMatching(/power$/), message: 'missing required parameter' }),
      expect.objectContaining({ path: expect.stringMatching(/surprise$/), message: 'unknown parameter' }),
    ]))
  })
})
