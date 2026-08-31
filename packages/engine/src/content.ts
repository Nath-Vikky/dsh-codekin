import {
  CAPTURE_CORE_QUALITIES,
  TRACE_ECOLOGIES,
} from '../../content-sdk/src/types.ts'
import type {
  CaptureCoreQuality,
  ContentPackIdentity,
  ContentCreatureMechanicsDefinition,
  ContentRegistry,
  CreatureDefinition,
  CreatureSkillDefinition,
  TraceEcology,
} from '../../content-sdk/src/types.ts'
import { assertMechanicsContract } from './mechanics-contract.ts'

export interface CodekinEngineContent {
  readonly id: string
  readonly packs: readonly ContentPackIdentity[]
  readonly creatures: readonly CreatureDefinition[]
  readonly skills: readonly CreatureSkillDefinition[]
  readonly mechanics: readonly ContentCreatureMechanicsDefinition[]
  readonly starterCreatureIds: readonly string[]
  readonly towerRotation: readonly string[]
  creature(id: string): CreatureDefinition | undefined
  creaturesInEcology(ecology: TraceEcology): readonly CreatureDefinition[]
  skill(creatureId: string): CreatureSkillDefinition | undefined
  creatureMechanics(creatureId: string): ContentCreatureMechanicsDefinition | undefined
  encounterVariantCreatureId(variant: string): string | undefined
}

export const CODEKIN_ENGINE_VERSION = '0.3.5-alpha.1' as const

export class EngineContentError extends TypeError {
  constructor(readonly issues: readonly string[]) {
    super(`incompatible Codekin engine content: ${issues.join('; ')}`)
    this.name = 'EngineContentError'
  }
}

export const QUALITY_SKILL_MULTIPLIERS: Readonly<Record<CaptureCoreQuality, number>> = Object.freeze({
  pebble: 0.86,
  pulse: 0.93,
  prism: 1,
  nova: 1.1,
  origin: 1.22,
})

function legacyCreature(row: ContentRegistry['creatures'][number]): CreatureDefinition {
  if (!TRACE_ECOLOGIES.includes(row.ecology as TraceEcology)) {
    throw new EngineContentError([`creature ${row.id} uses unsupported ecology ${row.ecology}`])
  }
  return Object.freeze({
    number: row.number,
    id: row.id,
    nameZh: row.name.zhCN,
    nameEn: row.name.en,
    ecology: row.ecology as TraceEcology,
    rarity: row.rarity,
    combatRole: row.combatRole,
    baseCaptureRate: row.baseCaptureRate,
    signatureProtocol: row.signatureProtocol,
    spriteIndex: (row.number - 1) % TRACE_ECOLOGIES.length,
    stats: Object.freeze({ ...row.stats }),
  })
}

function legacySkill(row: ContentRegistry['skills'][number]): CreatureSkillDefinition {
  return Object.freeze({
    creatureId: row.creatureId,
    energyCost: row.energyCost,
    passiveNameZh: row.passive.name.zhCN,
    passiveNameEn: row.passive.name.en,
    passiveDescriptionZh: row.passive.description.zhCN,
    passiveDescriptionEn: row.passive.description.en,
    activeNameZh: row.active.name.zhCN,
    activeNameEn: row.active.name.en,
    activeDescriptionZh: row.active.description.zhCN,
    activeDescriptionEn: row.active.description.en,
  })
}

export function createEngineContent(registry: ContentRegistry): CodekinEngineContent {
  const issues: string[] = []
  const ecologyIds = new Set(registry.ecologies.map(row => row.id))
  const qualityIds = new Set(registry.qualities.map(row => row.id))
  for (const ecology of TRACE_ECOLOGIES) {
    if (!ecologyIds.has(ecology)) issues.push(`missing engine ecology ${ecology}`)
  }
  for (const quality of CAPTURE_CORE_QUALITIES) {
    if (!qualityIds.has(quality)) issues.push(`missing engine quality ${quality}`)
  }
  for (const ecology of registry.ecologies) {
    if (!TRACE_ECOLOGIES.includes(ecology.id as TraceEcology)) {
      issues.push(`unsupported engine ecology ${ecology.id}`)
    }
  }
  for (const quality of registry.qualities) {
    if (!CAPTURE_CORE_QUALITIES.includes(quality.id as CaptureCoreQuality)) {
      issues.push(`unsupported engine quality ${quality.id}`)
    }
  }
  if (issues.length > 0) throw new EngineContentError(Object.freeze(issues))
  assertMechanicsContract(registry.mechanics)

  const creatures = Object.freeze(registry.creatures.map(legacyCreature))
  const skills = Object.freeze(registry.skills.map(legacySkill))
  const creatureMap = new Map(creatures.map(row => [row.id, row]))
  const skillMap = new Map(skills.map(row => [row.creatureId, row]))
  const mechanicsMap = new Map(registry.mechanics.map(row => [row.creatureId, row]))
  const byEcology = new Map(TRACE_ECOLOGIES.map(ecology => [
    ecology,
    Object.freeze(creatures.filter(creature => creature.ecology === ecology)),
  ]))
  const starterCreatureIds = Object.freeze([...new Set(registry.packs.flatMap(pack => pack.starters))])
  const towerRotation = Object.freeze(registry.packs.flatMap(pack => pack.tower.rotation))
  if (starterCreatureIds.length === 0) throw new EngineContentError(['at least one starter is required'])
  if (towerRotation.length === 0) throw new EngineContentError(['at least one tower creature is required'])
  const packs = Object.freeze(registry.packs.map(pack => Object.freeze({
    id: pack.manifest.id,
    version: pack.manifest.version,
  })))
  const id = packs.map(pack => `${pack.id}@${pack.version}`).join('+')

  return Object.freeze({
    id,
    packs,
    creatures,
    skills,
    mechanics: Object.freeze([...registry.mechanics]),
    starterCreatureIds,
    towerRotation,
    creature: (creatureId: string) => creatureMap.get(registry.resolveId(creatureId)),
    creaturesInEcology: (ecology: TraceEcology) => byEcology.get(ecology) ?? [],
    skill: (creatureId: string) => skillMap.get(registry.resolveId(creatureId)),
    creatureMechanics: (creatureId: string) => mechanicsMap.get(registry.resolveId(creatureId)),
    encounterVariantCreatureId: (variant: string) => registry.encounterCreature(variant)?.id,
  })
}

const CONTENT_STACK: CodekinEngineContent[] = []

export function currentEngineContent(): CodekinEngineContent {
  const content = CONTENT_STACK[CONTENT_STACK.length - 1]
  if (content === undefined) throw new EngineContentError(['no content is bound to this engine call'])
  return content
}

/** Runs one synchronous engine operation against an immutable content set. */
export function withEngineContent<Result>(content: CodekinEngineContent, operation: () => Result): Result {
  CONTENT_STACK.push(content)
  try {
    return operation()
  } finally {
    CONTENT_STACK.pop()
  }
}
