import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { CORE_CONTENT_PACK } from '../content-packs/core/src/index.ts'
import {
  ContentPackValidationError,
  contentPackIssues,
  createContentRegistry,
  defineContentPack,
} from '../packages/content-sdk/src/index.ts'
import { createCodekinComposition } from '../src/composition.ts'

const ADDON_CONTENT_PACK = defineContentPack({
  manifest: {
    id: '@example/codekin-addon',
    version: '1.0.0',
    engine: '>=0.3.2 <0.4.0',
    contentApi: 1,
    dependencies: { '@nath-vikky/codekin-core': '>=0.3.2 <0.4.0' },
  },
  ecologies: [],
  qualities: [],
  creatures: [{
    number: 1001,
    id: 'addon-pulsebeetle',
    name: { zhCN: '脉冲甲', en: 'Pulsebeetle' },
    ecology: 'lumen',
    rarity: 'common',
    combatRole: 'burst',
    baseCaptureRate: 0.42,
    signatureProtocol: 'pulse-burst',
    sprite: 'creature:addon-pulsebeetle:sprite',
    stats: { hp: 90, attack: 28, defense: 18, speed: 30 },
  }],
  skills: [{
    creatureId: 'addon-pulsebeetle',
    energyCost: 4,
    passive: {
      name: { zhCN: '脉冲蓄能', en: 'Pulse Charge' },
      description: { zhCN: '积蓄一次稳定脉冲。', en: 'Stores one stable pulse.' },
    },
    active: {
      name: { zhCN: '原始脉冲', en: 'Raw Pulse' },
      description: { zhCN: '造成一次固定倍率攻击。', en: 'Deals one fixed-power hit.' },
    },
  }],
  mechanics: [{
    creatureId: 'addon-pulsebeetle',
    bindings: [{ trigger: 'skill:cast', opcode: 'damage.raw-hit', params: { power: 1 } }],
  }],
  encounters: { variants: {} },
  starters: ['addon-pulsebeetle'],
  tower: { rotation: ['addon-pulsebeetle'] },
  assets: [{
    key: 'creature:addon-pulsebeetle:sprite',
    path: 'sprites/addon-pulsebeetle.webp',
    mime: 'image/webp',
    kind: 'creature',
  }],
})

function emptyPack(
  id: string,
  dependencies: Readonly<Record<string, string>> = {},
  conflicts: readonly string[] = [],
) {
  return defineContentPack({
    manifest: {
      id,
      version: '1.0.0',
      engine: '>=0.3.2 <0.4.0',
      contentApi: 1,
      dependencies,
      conflicts,
    },
    ecologies: [],
    qualities: [],
    creatures: [],
    skills: [],
    mechanics: [],
    encounters: { variants: {} },
    starters: [],
    tower: { rotation: [] },
    assets: [],
  })
}

describe('Codekin content packs', () => {
  it('validates and indexes the complete current core pack', () => {
    const registry = createContentRegistry([CORE_CONTENT_PACK])
    expect(registry.packs).toHaveLength(1)
    expect(registry.ecologies).toHaveLength(5)
    expect(registry.qualities).toHaveLength(5)
    expect(registry.creatures).toHaveLength(25)
    expect(registry.skills).toHaveLength(25)
    expect(registry.mechanics).toHaveLength(25)
    expect(registry.assets).toHaveLength(26)
    expect(registry.creature('forge-rivetclaw')).toMatchObject({
      name: { zhCN: '铆钉蟹', en: 'Rivetclaw' },
      sprite: 'creature:forge-rivetclaw:sprite',
    })
    expect(registry.skill('forge-rivetclaw')?.active.name.en).toBe('Rivet Rebound')
    expect(registry.creatureMechanics('forge-rivetclaw')?.bindings).toContainEqual(
      expect.objectContaining({ trigger: 'damage:taken', opcode: 'damage.arm-counter' }),
    )
    expect(registry.encounterCreature('overflow')?.id).toBe('glitch-overflow-maw')
    expect(registry.asset('creature:forge-rivetclaw:sprite')?.path).toBe(
      'sprites/forge-rivetclaw.webp',
    )
    const assetRoot = new URL('../assets/creatures/', import.meta.url)
    expect(registry.assets.filter(asset => (
      !existsSync(fileURLToPath(new URL(asset.path, assetRoot)))
    ))).toEqual([])
  })

  it('rejects malformed manifests before registry construction', () => {
    const invalid = {
      ...CORE_CONTENT_PACK,
      manifest: { ...CORE_CONTENT_PACK.manifest, version: 'not-semver' },
    }
    expect(contentPackIssues(invalid)).toContainEqual(expect.objectContaining({
      path: '/manifest/version',
    }))
    expect(() => createContentRegistry([invalid])).toThrow(ContentPackValidationError)
  })

  it('rejects missing assets, duplicate ids, and dangling references', () => {
    const first = CORE_CONTENT_PACK.creatures[0]!
    const invalid = {
      ...CORE_CONTENT_PACK,
      creatures: [
        { ...first, sprite: 'creature:missing:sprite' },
        { ...first, number: first.number + 1000 },
        ...CORE_CONTENT_PACK.creatures.slice(1),
      ],
      starters: ['missing-creature'],
    }
    expect(() => createContentRegistry([invalid])).toThrowError(expect.objectContaining({
      issues: expect.arrayContaining([
        expect.objectContaining({ message: 'duplicate creatures id' }),
        expect.objectContaining({ message: 'unknown asset creature:missing:sprite' }),
        expect.objectContaining({ message: 'unknown creature missing-creature' }),
      ]),
    }))
  })

  it('resolves explicit legacy aliases without changing canonical definitions', () => {
    const pack = {
      ...CORE_CONTENT_PACK,
      aliases: { 'legacy-indeximp': 'lumen-indeximp' },
    }
    const registry = createContentRegistry([pack])
    expect(registry.resolveId('legacy-indeximp')).toBe('lumen-indeximp')
    expect(registry.creature('legacy-indeximp')).toBe(registry.creature('lumen-indeximp'))
    expect(registry.creature('lumen-indeximp')?.id).toBe('lumen-indeximp')
  })

  it('composes a dependency-ordered extension pack into the engine and client view', () => {
    const composition = createCodekinComposition([ADDON_CONTENT_PACK, CORE_CONTENT_PACK])
    const { registry } = composition
    expect(registry.packs.map(pack => pack.manifest.id)).toEqual([
      '@nath-vikky/codekin-core',
      '@example/codekin-addon',
    ])
    expect(registry.creatures).toHaveLength(26)

    const { view } = composition
    expect(view.creatures.at(-1)?.id).toBe('addon-pulsebeetle')
    expect(view.towerRotation.at(-1)).toBe('addon-pulsebeetle')
    expect(JSON.stringify(view)).not.toContain('mechanics')

    const { runtime } = composition
    const initial = runtime.createInitialTraceWildState(1_000)
    const result = runtime.applyTraceWildAction(
      initial,
      { type: 'choose-starter', creatureId: 'addon-pulsebeetle' },
      () => 0,
      1_001,
    )
    expect(result.state.creatures[0]?.creatureId).toBe('addon-pulsebeetle')
  })

  it('rejects incompatible engines, dependency versions, conflicts, and cycles', () => {
    expect(() => createContentRegistry(
      [CORE_CONTENT_PACK],
      { engineVersion: '0.4.0' },
    )).toThrowError(expect.objectContaining({
      issues: expect.arrayContaining([
        expect.objectContaining({ message: expect.stringContaining('engine 0.4.0') }),
      ]),
    }))

    const incompatibleDependency = {
      ...ADDON_CONTENT_PACK,
      manifest: {
        ...ADDON_CONTENT_PACK.manifest,
        dependencies: { '@nath-vikky/codekin-core': '^9.0.0' },
      },
    }
    expect(() => createContentRegistry([CORE_CONTENT_PACK, incompatibleDependency]))
      .toThrowError(expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({ message: 'version 0.3.6-alpha.1 does not satisfy ^9.0.0' }),
        ]),
      }))

    const conflicting = emptyPack('@example/conflicting', {}, ['@nath-vikky/codekin-core'])
    expect(() => createContentRegistry([CORE_CONTENT_PACK, conflicting]))
      .toThrowError(expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({ message: 'conflicts with loaded pack @nath-vikky/codekin-core' }),
        ]),
      }))

    const cycleA = emptyPack('@example/cycle-a', { '@example/cycle-b': '1.0.0' })
    const cycleB = emptyPack('@example/cycle-b', { '@example/cycle-a': '1.0.0' })
    expect(() => createContentRegistry([cycleA, cycleB]))
      .toThrowError(expect.objectContaining({
        issues: expect.arrayContaining([
          expect.objectContaining({ message: 'dependency cycle: @example/cycle-a, @example/cycle-b' }),
        ]),
      }))
  })
})
