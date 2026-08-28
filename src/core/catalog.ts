import type {
  CaptureCoreQuality,
  CreatureDefinition,
  CreatureStats,
  TraceEcology,
  TraceRarity,
} from './types.ts'

export const TRACE_ECOLOGIES: readonly TraceEcology[] = Object.freeze([
  'lumen', 'forge', 'relay', 'aegis', 'glitch',
])

export const CAPTURE_CORE_QUALITIES: readonly CaptureCoreQuality[] = Object.freeze([
  'pebble', 'pulse', 'prism', 'nova', 'origin',
])

export const CORE_DROP_WEIGHTS: Readonly<Record<CaptureCoreQuality, number>> = Object.freeze({
  pebble: 55,
  pulse: 25,
  prism: 12,
  nova: 6,
  origin: 2,
})

export const CORE_CAPTURE_MULTIPLIERS: Readonly<Record<CaptureCoreQuality, number>> = Object.freeze({
  pebble: 0.85,
  pulse: 1.05,
  prism: 1.3,
  nova: 1.65,
  origin: 2.1,
})

const RARITY_STATS: Readonly<Record<TraceRarity, CreatureStats>> = Object.freeze({
  common: Object.freeze({ hp: 36, attack: 7, defense: 5, speed: 10 }),
  uncommon: Object.freeze({ hp: 39, attack: 8, defense: 6, speed: 11 }),
  rare: Object.freeze({ hp: 42, attack: 9, defense: 7, speed: 12 }),
  apex: Object.freeze({ hp: 46, attack: 10, defense: 8, speed: 13 }),
})

type CatalogRow = readonly [
  number: number,
  id: string,
  nameZh: string,
  nameEn: string,
  ecology: TraceEcology,
  rarity: TraceRarity,
  combatRole: string,
  baseCaptureRate: number,
  signatureProtocol: string,
]

const ROWS: readonly CatalogRow[] = Object.freeze([
  [1, 'lumen-indeximp', '索引团', 'Indeximp', 'lumen', 'common', 'marker', 0.55, 'index-flash'],
  [2, 'lumen-foliomoth', '页翼蛾', 'Foliomoth', 'lumen', 'common', 'support', 0.55, 'page-veil'],
  [3, 'lumen-lensel', '镜尾鼬', 'Lensel', 'lumen', 'uncommon', 'scout', 0.42, 'prism-trace'],
  [4, 'lumen-echocoil', '回声螺', 'Echocoil', 'lumen', 'rare', 'echo-support', 0.28, 'echo-archive'],
  [5, 'lumen-atlashart', '星图鹿', 'Atlashart', 'lumen', 'apex', 'lumen-leader', 0.16, 'atlas-field'],
  [6, 'forge-sparkmite', '火花螨', 'Sparkmite', 'forge', 'common', 'multi-hit', 0.55, 'spark-hop'],
  [7, 'forge-rivetclaw', '铆钉蟹', 'Rivetclaw', 'forge', 'common', 'counter-tank', 0.55, 'rivet-rebound'],
  [8, 'forge-solderling', '熔线蜥', 'Solderling', 'forge', 'uncommon', 'damage-link', 0.42, 'solder-bridge'],
  [9, 'forge-anvilback', '砧背兽', 'Anvilback', 'forge', 'rare', 'shield-breaker', 0.28, 'falling-anvil'],
  [10, 'forge-kiln-colossus', '炉心巨像', 'Kiln Colossus', 'forge', 'apex', 'forge-leader', 0.16, 'kiln-overload'],
  [11, 'relay-pingfly', '信标萤', 'Pingfly', 'relay', 'common', 'initiative', 0.55, 'beacon-handshake'],
  [12, 'relay-duplex-hare', '双相兔', 'Duplex Hare', 'relay', 'common', 'stance-switch', 0.55, 'duplex-switch'],
  [13, 'relay-routeray', '路由鳐', 'Routeray', 'relay', 'uncommon', 'position-control', 0.42, 'soft-route'],
  [14, 'relay-forktail', '分岔貂', 'Forktail', 'relay', 'rare', 'combo', 0.28, 'fork-return'],
  [15, 'relay-mesh-jelly', '群星水母', 'Mesh Jelly', 'relay', 'apex', 'relay-leader', 0.16, 'mesh-resonance'],
  [16, 'aegis-veribud', '校验芽', 'Veribud', 'aegis', 'common', 'cleanse-heal', 0.55, 'verify-dew'],
  [17, 'aegis-loop-tortoise', '环盾龟', 'Loop Tortoise', 'aegis', 'common', 'protector', 0.55, 'loop-guard'],
  [18, 'aegis-anchorbee', '定锚蜂', 'Anchorbee', 'aegis', 'uncommon', 'field-lock', 0.42, 'anchor-field'],
  [19, 'aegis-steady-ram', '稳态羊', 'Steady Ram', 'aegis', 'rare', 'debuff-converter', 0.28, 'steady-rebound'],
  [20, 'aegis-dawnguard', '曙光狮', 'Dawnguard', 'aegis', 'apex', 'aegis-leader', 0.16, 'dawn-restart'],
  [21, 'glitch-null-nibbler', '空值虫', 'Null Nibbler', 'glitch', 'common', 'buff-eater', 0.55, 'null-bite'],
  [22, 'glitch-stack-weaver', '栈裂蛛', 'Stack Weaver', 'glitch', 'common', 'corruption-control', 0.55, 'broken-stack-web'],
  [23, 'glitch-lagtoad', '超时蛙', 'Lagtoad', 'glitch', 'uncommon', 'delay-counter', 0.42, 'delayed-payback'],
  [24, 'glitch-crashfox', '红屏狐', 'Crashfox', 'glitch', 'rare', 'glass-cannon', 0.28, 'crash-flare'],
  [25, 'glitch-overflow-maw', '溢流巨兽', 'Overflow Maw', 'glitch', 'apex', 'glitch-leader', 0.16, 'boundary-overflow'],
])

export const CREATURE_CATALOG: readonly CreatureDefinition[] = Object.freeze(ROWS.map((row) => {
  const [number, id, nameZh, nameEn, ecology, rarity, combatRole, baseCaptureRate, signatureProtocol] = row
  const base = RARITY_STATS[rarity]
  const ecologyOffset = TRACE_ECOLOGIES.indexOf(ecology)
  return Object.freeze({
    number,
    id,
    nameZh,
    nameEn,
    ecology,
    rarity,
    combatRole,
    baseCaptureRate,
    signatureProtocol,
    spriteIndex: (number - 1) % 5,
    stats: Object.freeze({
      hp: base.hp + ecologyOffset * 2,
      attack: base.attack + (number % 3),
      defense: base.defense + (number % 2),
      speed: base.speed + ((number + 1) % 3),
    }),
  })
}))

const BY_ID = new Map(CREATURE_CATALOG.map(creature => [creature.id, creature]))

export function creatureById(id: string): CreatureDefinition | undefined {
  return BY_ID.get(id)
}

export function creaturesInEcology(ecology: TraceEcology): readonly CreatureDefinition[] {
  return CREATURE_CATALOG.filter(creature => creature.ecology === ecology)
}

export const STARTER_CREATURE_IDS = Object.freeze([
  'lumen-indeximp', 'forge-sparkmite', 'aegis-veribud',
] as const)
