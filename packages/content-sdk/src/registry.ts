import { assertContentPack, ContentPackValidationError } from './validation.ts'
import type {
  CodekinContentPack,
  ContentAssetDefinition,
  ContentCreatureDefinition,
  ContentEcologyDefinition,
  ContentQualityDefinition,
  ContentRegistry,
  ContentSkillDefinition,
  ContentValidationIssue,
} from './types.ts'

function duplicateIssues<T>(
  rows: readonly T[],
  category: string,
  key: (row: T) => string,
): ContentValidationIssue[] {
  const seen = new Set<string>()
  const issues: ContentValidationIssue[] = []
  for (const row of rows) {
    const id = key(row)
    if (seen.has(id)) issues.push({ path: `/${category}/${id}`, message: `duplicate ${category} id` })
    seen.add(id)
  }
  return issues
}

function resolveAlias(aliases: ReadonlyMap<string, string>, id: string): string {
  const seen = new Set<string>()
  let current = id
  while (aliases.has(current)) {
    if (seen.has(current)) throw new ContentPackValidationError([{
      path: `/aliases/${id}`,
      message: 'alias cycle',
    }])
    seen.add(current)
    current = aliases.get(current)!
  }
  return current
}

export function createContentRegistry(values: readonly unknown[]): ContentRegistry {
  const packs: CodekinContentPack[] = []
  for (const value of values) {
    assertContentPack(value)
    packs.push(value)
  }
  packs.sort((left, right) => left.manifest.id.localeCompare(right.manifest.id))

  const ecologies = packs.flatMap(pack => pack.ecologies)
  const qualities = packs.flatMap(pack => pack.qualities)
  const creatures = packs.flatMap(pack => pack.creatures)
  const skills = packs.flatMap(pack => pack.skills)
  const assets = packs.flatMap(pack => pack.assets)
  const issues: ContentValidationIssue[] = [
    ...duplicateIssues(packs, 'packs', row => row.manifest.id),
    ...duplicateIssues(ecologies, 'ecologies', row => row.id),
    ...duplicateIssues(qualities, 'qualities', row => row.id),
    ...duplicateIssues(creatures, 'creatures', row => row.id),
    ...duplicateIssues(creatures, 'creature-numbers', row => String(row.number)),
    ...duplicateIssues(skills, 'skills', row => row.creatureId),
    ...duplicateIssues(assets, 'assets', row => row.key),
  ]

  const ecologyIds = new Set(ecologies.map(row => row.id))
  const creatureIds = new Set(creatures.map(row => row.id))
  const assetKeys = new Set(assets.map(row => row.key))
  const skillIds = new Set(skills.map(row => row.creatureId))
  for (const creature of creatures) {
    if (!ecologyIds.has(creature.ecology)) issues.push({
      path: `/creatures/${creature.id}/ecology`, message: `unknown ecology ${creature.ecology}`,
    })
    if (!assetKeys.has(creature.sprite)) issues.push({
      path: `/creatures/${creature.id}/sprite`, message: `unknown asset ${creature.sprite}`,
    })
    if (!skillIds.has(creature.id)) issues.push({
      path: `/creatures/${creature.id}`, message: 'missing skill definition',
    })
  }
  for (const skill of skills) {
    if (!creatureIds.has(skill.creatureId)) issues.push({
      path: `/skills/${skill.creatureId}`, message: 'unknown creature',
    })
  }
  for (const pack of packs) {
    for (const starter of pack.starters) {
      if (!creatureIds.has(starter)) issues.push({
        path: `/packs/${pack.manifest.id}/starters`, message: `unknown creature ${starter}`,
      })
    }
    for (const creatureId of pack.tower.rotation) {
      if (!creatureIds.has(creatureId)) issues.push({
        path: `/packs/${pack.manifest.id}/tower/rotation`, message: `unknown creature ${creatureId}`,
      })
    }
  }

  const aliases = new Map<string, string>()
  for (const pack of packs) {
    for (const [from, to] of Object.entries(pack.aliases ?? {})) {
      if (aliases.has(from) || creatureIds.has(from)) issues.push({
        path: `/packs/${pack.manifest.id}/aliases/${from}`, message: 'duplicate alias',
      })
      aliases.set(from, to)
    }
  }
  for (const [from] of aliases) {
    try {
      const target = resolveAlias(aliases, from)
      if (!creatureIds.has(target)) issues.push({ path: `/aliases/${from}`, message: `unknown target ${target}` })
    } catch (error) {
      if (error instanceof ContentPackValidationError) issues.push(...error.issues)
      else throw error
    }
  }

  if (issues.length > 0) throw new ContentPackValidationError(issues)

  const creatureMap = new Map(creatures.map(row => [row.id, row]))
  const skillMap = new Map(skills.map(row => [row.creatureId, row]))
  const assetMap = new Map(assets.map(row => [row.key, row]))
  const registry: ContentRegistry = {
    packs: Object.freeze([...packs]),
    ecologies: Object.freeze([...ecologies]),
    qualities: Object.freeze([...qualities]),
    creatures: Object.freeze([...creatures]),
    skills: Object.freeze([...skills]),
    assets: Object.freeze([...assets]),
    resolveId: id => resolveAlias(aliases, id),
    creature: id => creatureMap.get(resolveAlias(aliases, id)),
    skill: id => skillMap.get(resolveAlias(aliases, id)),
    asset: key => assetMap.get(key),
  }
  return Object.freeze(registry)
}

export type {
  ContentAssetDefinition,
  ContentCreatureDefinition,
  ContentEcologyDefinition,
  ContentQualityDefinition,
  ContentSkillDefinition,
}
