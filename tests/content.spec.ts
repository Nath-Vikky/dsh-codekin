import { describe, expect, it } from 'vitest'
import { CORE_CONTENT_PACK } from '../content-packs/core/src/index.ts'
import {
  ContentPackValidationError,
  contentPackIssues,
  createContentRegistry,
} from '../packages/content-sdk/src/index.ts'

describe('Codekin content packs', () => {
  it('validates and indexes the complete 0.3.2 core pack', () => {
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
})
