import type {
  ContentCreatureMechanicsDefinition,
  ContentMechanicParameter,
  ContentMechanicTrigger,
  ContentValidationIssue,
} from '../../content-sdk/src/types.ts'

type ParameterKind = 'string' | 'number' | 'boolean'

interface OpcodeContract {
  trigger: ContentMechanicTrigger
  required: Readonly<Record<string, ParameterKind>>
  optional: Readonly<Record<string, ParameterKind>>
}

function contract(
  trigger: ContentMechanicTrigger,
  required: Readonly<Record<string, ParameterKind>> = {},
  optional: Readonly<Record<string, ParameterKind>> = {},
): OpcodeContract {
  return { trigger, required, optional }
}

export const CODEKIN_MECHANIC_CONTRACTS: Readonly<Record<string, OpcodeContract>> = Object.freeze({
  'energy.store-overflow': contract('energy:overflow', { maximum: 'number' }),
  'damage.combo-per-cascade': contract('damage:modify', { amount: 'number' }),
  'damage.first-match-floor': contract('damage:modify', { minimum: 'number', chain: 'number', once: 'string' }),
  'damage.low-runtime-multiplier': contract('damage:modify', { belowRatio: 'number', multiplier: 'number' }),
  'damage.round-parity-multiplier': contract('damage:modify', { parity: 'string', multiplier: 'number' }),
  'match.add-mark': contract('match:after', { ecology: 'string', minCount: 'number', once: 'string', amount: 'number', maximum: 'number' }),
  'match.heal': contract('match:after', { ecology: 'string', minCount: 'number', basis: 'string', ratio: 'number' }, { once: 'string' }),
  'match.grant-energy-on-cascade': contract('match:after', { minChain: 'number', amount: 'number', once: 'string' }),
  'match.echo-damage': contract('match:after', { minChain: 'number', factor: 'number', once: 'string' }),
  'match.consume-first-match': contract('match:after', { chain: 'number', once: 'string' }),
  'match.raw-hit': contract('match:after', { ecology: 'string', minCount: 'number', power: 'number' }),
  'match.consume-counter': contract('match:after', { ecology: 'string' }),
  'match.add-burn-mixed': contract('match:after', { ecology: 'string', maximum: 'number' }),
  'match.break-armor': contract('match:after', { ecology: 'string', minCount: 'number', amount: 'number' }),
  'match.add-burn-cascade': contract('match:after', { ecology: 'string', minChain: 'number', amount: 'number', maximum: 'number' }),
  'match.grant-energy-round-parity': contract('match:after', { ecology: 'string', parity: 'string', amount: 'number' }),
  'match.convert-one': contract('match:after', { ecology: 'string' }, { minCount: 'number', minChain: 'number', once: 'string' }),
  'match.shield-on-special': contract('match:after', { basis: 'string', ratio: 'number' }),
  'match.shield-on-resisted': contract('match:after', { ratio: 'number' }),
  'match.erode-protection': contract('match:after', { ecology: 'string', armor: 'number', shieldAttackRatio: 'number' }),
  'energy.share': contract('energy:after-distribute', { ecology: 'string', ratio: 'number', maximumSource: 'number', excludeEcology: 'boolean' }),
  'stage.grant-energy': contract('stage:enter', { amount: 'number' }),
  'stage.shield': contract('stage:enter', { basis: 'string', ratio: 'number' }),
  'defeat.prevent': contract('defeat:before', { hp: 'number', shieldRatio: 'number', once: 'string' }),
  'runtime.delay-enemy': contract('runtime:threshold', { belowRatio: 'number', actions: 'number', once: 'string' }),
  'damage.arm-counter': contract('damage:taken', { power: 'number' }),
  'skill.consume-overflow': contract('skill:before', { multiplierPerPoint: 'number' }),
  'damage.raw-hit': contract('skill:cast', { power: 'number' }, { hits: 'number' }),
  'damage.replay': contract('skill:cast', { factor: 'number', minimum: 'string' }),
  'mark.add': contract('skill:cast', { amount: 'number', maximum: 'number' }),
  'tiles.convert': contract('skill:cast', { ecology: 'string', count: 'number', resolve: 'boolean' }),
  'tiles.resolve': contract('skill:cast'),
  'heal.party': contract('skill:cast', { basis: 'string', ratio: 'number' }),
  'shield.party': contract('skill:cast', { basis: 'string', ratio: 'number' }),
  'affinity.floor': contract('skill:cast', { actions: 'number' }),
  'counter.arm': contract('skill:cast', { power: 'number' }),
  'burn.add': contract('skill:cast', { amount: 'number', scaled: 'boolean', maximum: 'number' }),
  'armor.break': contract('skill:cast', { amount: 'number' }),
  'tiles.clear': contract('skill:cast', { ecology: 'string', count: 'number', resolve: 'boolean' }),
  'tiles.guaranteed-match': contract('skill:cast', { ecology: 'string', resolve: 'boolean' }),
  'tiles.reshuffle': contract('skill:cast'),
  'repeat.arm': contract('skill:cast', { power: 'number', scaled: 'boolean', maximum: 'number' }),
  'energy.party': contract('skill:cast', { amount: 'number', scaled: 'boolean' }),
  'enemy.delay': contract('skill:cast', { actions: 'number' }),
  'board.lock': contract('skill:cast', { actions: 'number' }),
  'shield.enemy-clear': contract('skill:cast'),
  'runtime.self-damage': contract('skill:cast', { basis: 'string', ratio: 'number', minimumRemaining: 'number' }),
})

export const CODEKIN_MECHANIC_OPCODES = Object.freeze(Object.keys(CODEKIN_MECHANIC_CONTRACTS))

function parameterKind(value: ContentMechanicParameter): ParameterKind {
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return 'number'
  return 'boolean'
}

export function mechanicsContractIssues(
  definitions: readonly ContentCreatureMechanicsDefinition[],
): readonly ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = []
  for (const definition of definitions) {
    definition.bindings.forEach((binding, index) => {
      const path = `/mechanics/${definition.creatureId}/bindings/${index}`
      const opcodeContract = CODEKIN_MECHANIC_CONTRACTS[binding.opcode]
      if (opcodeContract === undefined) {
        issues.push({ path: `${path}/opcode`, message: `unsupported opcode ${binding.opcode}` })
        return
      }
      if (binding.trigger !== opcodeContract.trigger) issues.push({
        path: `${path}/trigger`,
        message: `opcode ${binding.opcode} requires trigger ${opcodeContract.trigger}`,
      })
      const params = binding.params ?? {}
      for (const [key, kind] of Object.entries(opcodeContract.required)) {
        const value = params[key]
        if (value === undefined) issues.push({ path: `${path}/params/${key}`, message: 'missing required parameter' })
        else if (parameterKind(value) !== kind) issues.push({
          path: `${path}/params/${key}`, message: `expected ${kind}`,
        })
      }
      for (const [key, value] of Object.entries(params)) {
        const kind = opcodeContract.required[key] ?? opcodeContract.optional[key]
        if (kind === undefined) issues.push({ path: `${path}/params/${key}`, message: 'unknown parameter' })
        else if (parameterKind(value) !== kind) issues.push({ path: `${path}/params/${key}`, message: `expected ${kind}` })
      }
      if (binding.opcode === 'match.convert-one'
        && params.minCount === undefined && params.minChain === undefined) {
        issues.push({ path: `${path}/params`, message: 'minCount or minChain is required' })
      }
    })
  }
  return Object.freeze(issues)
}

export class MechanicsContractError extends TypeError {
  readonly issues: readonly ContentValidationIssue[]

  constructor(issues: readonly ContentValidationIssue[]) {
    super(`incompatible Codekin mechanics: ${issues.map(issue => `${issue.path} ${issue.message}`).join('; ')}`)
    this.name = 'MechanicsContractError'
    this.issues = Object.freeze([...issues])
  }
}

export function assertMechanicsContract(
  definitions: readonly ContentCreatureMechanicsDefinition[],
): void {
  const issues = mechanicsContractIssues(definitions)
  if (issues.length > 0) throw new MechanicsContractError(issues)
}
