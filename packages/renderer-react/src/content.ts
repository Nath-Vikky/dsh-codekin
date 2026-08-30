import {
  CAPTURE_CORE_QUALITIES,
  TRACE_ECOLOGIES,
} from '../../content-sdk/src/types.ts'
import type {
  CaptureCoreQuality,
  CreatureDefinition,
  CreatureSkillDefinition,
  TraceEcology,
  TraceRarity,
} from '../../content-sdk/src/types.ts'
import type { CodekinContentView } from '../../content-sdk/src/view.ts'

const CONTENT_API_PREFIX = '/api/tracewild'
const SAFE_ASSET_PATH = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9._/-]+$/u
const CONTENT_VIEW_FIELDS = Object.freeze([
  'contentApi', 'id', 'packs', 'ecologies', 'qualities', 'creatures',
  'skills', 'starters', 'towerRotation', 'assets',
])

function record(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)
    || Object.getPrototypeOf(value) !== Object.prototype) throw new TypeError('invalid content view')
  return value as Record<string, unknown>
}

function text(value: unknown, maximum = 160): string {
  if (typeof value !== 'string' || value.length < 1 || value.length > maximum) {
    throw new TypeError('invalid content view')
  }
  return value
}

function rows(value: unknown, maximum: number): unknown[] {
  if (!Array.isArray(value) || value.length > maximum) throw new TypeError('invalid content view')
  return value
}

function exactFields(value: Record<string, unknown>, fields: readonly string[]): void {
  if (Object.keys(value).length !== fields.length || fields.some(field => !(field in value))) {
    throw new TypeError('invalid content view')
  }
}

function deepFreeze<Value>(value: Value): Value {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) return value
  for (const child of Object.values(value)) deepFreeze(child)
  return Object.freeze(value)
}

/** Treats Host content as untrusted JSON before it reaches React or asset URLs. */
export function parseCodekinContentView(value: unknown): CodekinContentView {
  const root = record(value)
  exactFields(root, CONTENT_VIEW_FIELDS)
  if (root.contentApi !== 1) throw new TypeError('unsupported content API')
  text(root.id, 512)
  const packs = rows(root.packs, 64)
  const ecologies = rows(root.ecologies, 32)
  const qualities = rows(root.qualities, 32)
  const creatures = rows(root.creatures, 2048)
  const skills = rows(root.skills, 2048)
  const starters = rows(root.starters, 64)
  const towerRotation = rows(root.towerRotation, 4096)
  const assets = rows(root.assets, 4096)
  const ecologyIds = new Set<string>()
  const qualityIds = new Set<string>()
  const creatureIds = new Set<string>()
  const packIds = new Set<string>()
  const creatureSprites = new Map<string, string>()

  for (const valuePack of packs) {
    const pack = record(valuePack)
    const id = text(pack.id, 128)
    if (packIds.has(id)) throw new TypeError('invalid content view')
    packIds.add(id)
    text(pack.version, 80)
  }
  for (const valueEcology of ecologies) {
    const ecology = record(valueEcology)
    const id = text(ecology.id, 128)
    if (!TRACE_ECOLOGIES.includes(id as TraceEcology) || ecologyIds.has(id)) throw new TypeError('invalid content view')
    ecologyIds.add(id)
    const name = record(ecology.name)
    text(name.zhCN)
    text(name.en)
    if (!Number.isSafeInteger(ecology.order) || !['sync', 'overclock', 'guard', 'repair', 'breach'].includes(String(ecology.tileRole))) {
      throw new TypeError('invalid content view')
    }
  }
  for (const valueQuality of qualities) {
    const quality = record(valueQuality)
    const id = text(quality.id, 128)
    if (!CAPTURE_CORE_QUALITIES.includes(id as CaptureCoreQuality) || qualityIds.has(id)) {
      throw new TypeError('invalid content view')
    }
    qualityIds.add(id)
    const name = record(quality.name)
    text(name.zhCN)
    text(name.en)
    if (!Number.isSafeInteger(quality.order)) throw new TypeError('invalid content view')
  }
  for (const valueCreature of creatures) {
    const creature = record(valueCreature)
    const id = text(creature.id, 128)
    if (creatureIds.has(id) || !Number.isSafeInteger(creature.number)) throw new TypeError('invalid content view')
    creatureIds.add(id)
    const name = record(creature.name)
    text(name.zhCN)
    text(name.en)
    if (!ecologyIds.has(String(creature.ecology))
      || !['common', 'uncommon', 'rare', 'apex'].includes(String(creature.rarity))) {
      throw new TypeError('invalid content view')
    }
    text(creature.combatRole, 80)
    text(creature.signatureProtocol, 128)
    creatureSprites.set(id, text(creature.sprite, 128))
    if (typeof creature.baseCaptureRate !== 'number' || creature.baseCaptureRate <= 0 || creature.baseCaptureRate > 1) {
      throw new TypeError('invalid content view')
    }
    const stats = record(creature.stats)
    for (const key of ['hp', 'attack', 'defense', 'speed']) {
      if (!Number.isSafeInteger(stats[key]) || (stats[key] as number) < 1 || (stats[key] as number) > 999_999_999) {
        throw new TypeError('invalid content view')
      }
    }
  }
  const skillIds = new Set<string>()
  for (const valueSkill of skills) {
    const skill = record(valueSkill)
    const creatureId = text(skill.creatureId, 128)
    if (!creatureIds.has(creatureId) || skillIds.has(creatureId)
      || !Number.isSafeInteger(skill.energyCost) || (skill.energyCost as number) < 0) {
      throw new TypeError('invalid content view')
    }
    skillIds.add(creatureId)
    for (const side of [record(skill.passive), record(skill.active)]) {
      for (const field of [record(side.name), record(side.description)]) {
        text(field.zhCN)
        text(field.en)
      }
    }
  }
  if ([...creatureIds].some(id => !skillIds.has(id))) throw new TypeError('invalid content view')
  for (const id of [...starters, ...towerRotation]) {
    if (typeof id !== 'string' || !creatureIds.has(id)) throw new TypeError('invalid content view')
  }
  const assetKeys = new Set<string>()
  const assetKinds = new Map<string, string>()
  for (const valueAsset of assets) {
    const asset = record(valueAsset)
    const key = text(asset.key, 128)
    const path = text(asset.path, 240)
    if (assetKeys.has(key) || !SAFE_ASSET_PATH.test(path)
      || asset.mime !== 'image/png' && asset.mime !== 'image/webp'
      || asset.kind !== 'launcher' && asset.kind !== 'creature') {
      throw new TypeError('invalid content view')
    }
    assetKeys.add(key)
    assetKinds.set(key, String(asset.kind))
  }
  for (const sprite of creatureSprites.values()) {
    if (assetKinds.get(sprite) !== 'creature') throw new TypeError('invalid content view')
  }
  return deepFreeze(structuredClone(root)) as unknown as CodekinContentView
}

let activeView: CodekinContentView | undefined
let activeCreatures: readonly CreatureDefinition[] = []
let activeCreatureMap = new Map<string, CreatureDefinition>()
let activeSkillMap = new Map<string, CreatureSkillDefinition>()
let activeAssetMap = new Map<string, string>()

export function activateCodekinContent(value: CodekinContentView): void {
  const view = parseCodekinContentView(value)
  const creatures = view.creatures.map(row => Object.freeze({
    number: row.number,
    id: row.id,
    nameZh: row.name.zhCN,
    nameEn: row.name.en,
    ecology: row.ecology as TraceEcology,
    rarity: row.rarity as TraceRarity,
    combatRole: row.combatRole,
    baseCaptureRate: row.baseCaptureRate,
    signatureProtocol: row.signatureProtocol,
    spriteIndex: (row.number - 1) % TRACE_ECOLOGIES.length,
    stats: Object.freeze({ ...row.stats }),
  }))
  const skills = view.skills.map(row => Object.freeze({
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
  }))
  activeView = view
  activeCreatures = Object.freeze(creatures)
  activeCreatureMap = new Map(creatures.map(row => [row.id, row]))
  activeSkillMap = new Map(skills.map(row => [row.creatureId, row]))
  activeAssetMap = new Map(view.assets.map(asset => [
    asset.key,
    `${CONTENT_API_PREFIX}/assets/${asset.path.split('/').map(encodeURIComponent).join('/')}?content=${encodeURIComponent(view.id)}`,
  ]))
}

export function creatureCatalog(): readonly CreatureDefinition[] {
  return activeCreatures
}

export function creatureById(id: string): CreatureDefinition | undefined {
  return activeCreatureMap.get(id)
}

export function skillByCreatureId(id: string): CreatureSkillDefinition | undefined {
  return activeSkillMap.get(id)
}

export function starterCreatureIds(): readonly string[] {
  return activeView?.starters ?? []
}

export function contentAssetUrl(key: string): string | undefined {
  return activeAssetMap.get(key)
}

export const MAX_CONTENT_TOWER_FLOOR = 999_999

export function contentTowerFloorProfile(floorValue: number): {
  floor: number
  creatureId: string
  level: number
  quality: CaptureCoreQuality
  skillTier: 1 | 2 | 3 | 4 | 5
  baseMaterialDrops: number
  milestoneMaterial: boolean
} {
  if (!Number.isSafeInteger(floorValue) || floorValue < 1 || floorValue > MAX_CONTENT_TOWER_FLOOR) {
    throw new TypeError('invalid tower floor')
  }
  const rotation = activeView?.towerRotation ?? []
  const creatureId = rotation[(floorValue - 1) % rotation.length]
  if (creatureId === undefined) throw new TypeError('content unavailable')
  const skillTier = floorValue >= 80 ? 5 : floorValue >= 50 ? 4 : floorValue >= 25 ? 3 : floorValue >= 10 ? 2 : 1
  return {
    floor: floorValue,
    creatureId,
    level: Math.min(9_999, floorValue + 1),
    quality: CAPTURE_CORE_QUALITIES[skillTier - 1]!,
    skillTier,
    baseMaterialDrops: Math.min(8, skillTier + Math.floor((floorValue - 1) / 100)),
    milestoneMaterial: floorValue % 10 === 0,
  }
}
