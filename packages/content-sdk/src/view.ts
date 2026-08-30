import type {
  ContentAssetDefinition,
  ContentCreatureDefinition,
  ContentEcologyDefinition,
  ContentQualityDefinition,
  ContentRegistry,
  ContentSkillDefinition,
} from './types.ts'
import { CONTENT_API_VERSION } from './types.ts'

export interface ContentViewPack {
  id: string
  version: string
}

/** Client-safe content data. Mechanics, aliases, and dependency internals are intentionally omitted. */
export interface CodekinContentView {
  contentApi: typeof CONTENT_API_VERSION
  id: string
  packs: readonly ContentViewPack[]
  ecologies: readonly ContentEcologyDefinition[]
  qualities: readonly ContentQualityDefinition[]
  creatures: readonly ContentCreatureDefinition[]
  skills: readonly ContentSkillDefinition[]
  starters: readonly string[]
  towerRotation: readonly string[]
  assets: readonly ContentAssetDefinition[]
}

export function createContentView(registry: ContentRegistry): CodekinContentView {
  const packs = Object.freeze(registry.packs.map(pack => Object.freeze({
    id: pack.manifest.id,
    version: pack.manifest.version,
  })))
  return Object.freeze({
    contentApi: CONTENT_API_VERSION,
    id: packs.map(pack => `${pack.id}@${pack.version}`).join('+'),
    packs,
    ecologies: Object.freeze([...registry.ecologies]),
    qualities: Object.freeze([...registry.qualities]),
    creatures: Object.freeze([...registry.creatures]),
    skills: Object.freeze([...registry.skills]),
    starters: Object.freeze([...new Set(registry.packs.flatMap(pack => pack.starters))]),
    towerRotation: Object.freeze(registry.packs.flatMap(pack => pack.tower.rotation)),
    assets: Object.freeze([...registry.assets]),
  })
}
