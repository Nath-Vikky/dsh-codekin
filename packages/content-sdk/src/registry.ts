import { assertContentPack, ContentPackValidationError } from './validation.ts'
import { satisfies, validRange } from 'semver'
import type {
  CodekinContentPack,
  ContentAssetDefinition,
  ContentCreatureDefinition,
  ContentCreatureMechanicsDefinition,
  ContentEcologyDefinition,
  ContentQualityDefinition,
  ContentRegistry,
  ContentSkillDefinition,
  ContentValidationIssue,
} from './types.ts'

export interface ContentRegistryOptions {
  engineVersion?: string
}

function deepFreeze<Value>(value: Value): Value {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) return value
  for (const child of Object.values(value)) deepFreeze(child)
  return Object.freeze(value)
}

function packOrder(
  packs: readonly CodekinContentPack[],
  issues: ContentValidationIssue[],
): CodekinContentPack[] {
  const byId = new Map<string, CodekinContentPack>()
  for (const pack of packs) if (!byId.has(pack.manifest.id)) byId.set(pack.manifest.id, pack)
  for (const pack of packs) {
    for (const conflict of pack.manifest.conflicts ?? []) {
      if (byId.has(conflict)) issues.push({
        path: `/packs/${pack.manifest.id}/conflicts`, message: `conflicts with loaded pack ${conflict}`,
      })
    }
    for (const [dependencyId, range] of Object.entries(pack.manifest.dependencies ?? {})) {
      const dependency = byId.get(dependencyId)
      if (dependency === undefined) {
        issues.push({
          path: `/packs/${pack.manifest.id}/dependencies/${dependencyId}`,
          message: 'missing dependency',
        })
      } else if (validRange(range) === null || !satisfies(dependency.manifest.version, range, { includePrerelease: true })) {
        issues.push({
          path: `/packs/${pack.manifest.id}/dependencies/${dependencyId}`,
          message: `version ${dependency.manifest.version} does not satisfy ${range}`,
        })
      }
    }
  }

  const compare = (left: CodekinContentPack, right: CodekinContentPack): number => (
    (left.manifest.priority ?? 0) - (right.manifest.priority ?? 0)
    || left.manifest.id.localeCompare(right.manifest.id)
  )
  const indegree = new Map([...byId.keys()].map(id => [id, 0]))
  const dependents = new Map<string, string[]>()
  for (const pack of byId.values()) {
    for (const dependencyId of Object.keys(pack.manifest.dependencies ?? {})) {
      if (!byId.has(dependencyId)) continue
      indegree.set(pack.manifest.id, (indegree.get(pack.manifest.id) ?? 0) + 1)
      const rows = dependents.get(dependencyId) ?? []
      rows.push(pack.manifest.id)
      dependents.set(dependencyId, rows)
    }
  }
  const ready = [...byId.values()].filter(pack => indegree.get(pack.manifest.id) === 0).sort(compare)
  const ordered: CodekinContentPack[] = []
  while (ready.length > 0) {
    const pack = ready.shift()!
    ordered.push(pack)
    for (const dependentId of (dependents.get(pack.manifest.id) ?? []).sort()) {
      const next = (indegree.get(dependentId) ?? 0) - 1
      indegree.set(dependentId, next)
      if (next === 0) {
        ready.push(byId.get(dependentId)!)
        ready.sort(compare)
      }
    }
  }
  if (ordered.length !== byId.size) {
    const cycle = [...byId.keys()].filter(id => !ordered.some(pack => pack.manifest.id === id)).sort()
    issues.push({ path: '/packs', message: `dependency cycle: ${cycle.join(', ')}` })
  }
  return ordered
}

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

export function createContentRegistry(
  values: readonly unknown[],
  options: ContentRegistryOptions = {},
): ContentRegistry {
  const inputPacks: CodekinContentPack[] = []
  for (const value of values) {
    assertContentPack(value)
    inputPacks.push(deepFreeze(structuredClone(value)))
  }
  const issues: ContentValidationIssue[] = [
    ...duplicateIssues(inputPacks, 'packs', row => row.manifest.id),
  ]
  if (options.engineVersion !== undefined) {
    for (const pack of inputPacks) {
      const range = pack.manifest.engine
      if (validRange(range) === null || !satisfies(options.engineVersion, range, { includePrerelease: true })) {
        issues.push({
          path: `/packs/${pack.manifest.id}/engine`,
          message: `engine ${options.engineVersion} does not satisfy ${range}`,
        })
      }
    }
  }
  const packs = packOrder(inputPacks, issues)

  const ecologies = packs.flatMap(pack => pack.ecologies)
  const qualities = packs.flatMap(pack => pack.qualities)
  const creatures = packs.flatMap(pack => pack.creatures)
  const skills = packs.flatMap(pack => pack.skills)
  const mechanics = packs.flatMap(pack => pack.mechanics)
  const encounterVariantRows = packs.flatMap(pack => Object.entries(pack.encounters.variants)
    .map(([variant, creatureId]) => ({ variant, creatureId })))
  const assets = packs.flatMap(pack => pack.assets)
  issues.push(
    ...duplicateIssues(ecologies, 'ecologies', row => row.id),
    ...duplicateIssues(qualities, 'qualities', row => row.id),
    ...duplicateIssues(creatures, 'creatures', row => row.id),
    ...duplicateIssues(creatures, 'creature-numbers', row => String(row.number)),
    ...duplicateIssues(skills, 'skills', row => row.creatureId),
    ...duplicateIssues(mechanics, 'mechanics', row => row.creatureId),
    ...duplicateIssues(encounterVariantRows, 'encounter-variants', row => row.variant),
    ...duplicateIssues(assets, 'assets', row => row.key),
  )

  const ecologyIds = new Set(ecologies.map(row => row.id))
  const creatureIds = new Set(creatures.map(row => row.id))
  const assetKeys = new Set(assets.map(row => row.key))
  const skillIds = new Set(skills.map(row => row.creatureId))
  const mechanicIds = new Set(mechanics.map(row => row.creatureId))
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
    if (!mechanicIds.has(creature.id)) issues.push({
      path: `/creatures/${creature.id}`, message: 'missing mechanics definition',
    })
  }
  for (const skill of skills) {
    if (!creatureIds.has(skill.creatureId)) issues.push({
      path: `/skills/${skill.creatureId}`, message: 'unknown creature',
    })
  }
  for (const definition of mechanics) {
    if (!creatureIds.has(definition.creatureId)) issues.push({
      path: `/mechanics/${definition.creatureId}`, message: 'unknown creature',
    })
  }
  for (const row of encounterVariantRows) {
    if (!creatureIds.has(row.creatureId)) issues.push({
      path: `/encounters/variants/${row.variant}`, message: `unknown creature ${row.creatureId}`,
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
  const mechanicsMap = new Map(mechanics.map(row => [row.creatureId, row]))
  const encounterVariantMap = new Map(encounterVariantRows.map(row => [row.variant, row.creatureId]))
  const assetMap = new Map(assets.map(row => [row.key, row]))
  const registry: ContentRegistry = {
    packs: Object.freeze([...packs]),
    ecologies: Object.freeze([...ecologies]),
    qualities: Object.freeze([...qualities]),
    creatures: Object.freeze([...creatures]),
    skills: Object.freeze([...skills]),
    mechanics: Object.freeze([...mechanics]),
    encounterVariants: Object.freeze(Object.fromEntries(encounterVariantMap)),
    assets: Object.freeze([...assets]),
    resolveId: id => resolveAlias(aliases, id),
    creature: id => creatureMap.get(resolveAlias(aliases, id)),
    skill: id => skillMap.get(resolveAlias(aliases, id)),
    creatureMechanics: id => mechanicsMap.get(resolveAlias(aliases, id)),
    encounterCreature: variant => {
      const id = encounterVariantMap.get(variant)
      return id === undefined ? undefined : creatureMap.get(resolveAlias(aliases, id))
    },
    asset: key => assetMap.get(key),
  }
  return Object.freeze(registry)
}

export type {
  ContentAssetDefinition,
  ContentCreatureDefinition,
  ContentCreatureMechanicsDefinition,
  ContentEcologyDefinition,
  ContentQualityDefinition,
  ContentSkillDefinition,
}
