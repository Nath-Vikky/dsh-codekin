import { describe, expect, it } from 'vitest'
import { CORE_CONTENT_PACK } from '../content-packs/core/src/index.ts'
import { CODEKIN_ENGINE_VERSION } from '../packages/engine/src/content.ts'
import { lintContentPacks } from '../tools/content-pack-lint.ts'
import {
  parseReplayTranscript,
  runReplay,
} from '../tools/replay.ts'

const REPLAY = {
  format: 'codekin-replay-v1',
  random: 'lcg32-v1',
  seed: 0xc0de_3601,
  startedAt: 1_000,
  steps: [
    {
      kind: 'action', at: 1_001,
      action: { type: 'choose-starter', creatureId: 'lumen-indeximp' },
    },
    {
      kind: 'signal',
      signal: {
        id: 'tooling-signal', at: 1_010, ecology: 'forge', outcome: 'completed',
        intensity: 1, activeMinutes: 5, enhanced: false,
      },
    },
  ],
} as const

describe('governance tooling', () => {
  it('lints schema, registry, mechanics, and asset files through one report', async () => {
    const report = await lintContentPacks([{
      pack: CORE_CONTENT_PACK,
      source: 'core-test',
      assetRoot: new URL('../assets/creatures/', import.meta.url),
    }], { engineVersion: CODEKIN_ENGINE_VERSION })
    expect(report.ok).toBe(true)
    expect(report.issues).toEqual([])
    expect(report.packs).toEqual([expect.objectContaining({
      id: '@nath-vikky/codekin-core', creatures: 25, mechanics: 25, assets: 26,
    })])
    expect(report.packs[0]!.assetBytes).toBeGreaterThan(0)
  })

  it('reports unsupported mechanics independently from structural schema checks', async () => {
    const invalid = structuredClone(CORE_CONTENT_PACK)
    invalid.mechanics[0]!.bindings[0]!.opcode = 'damage.unreviewed'
    const report = await lintContentPacks([{
      pack: invalid,
      source: 'invalid-mechanics',
      assetRoot: new URL('../assets/creatures/', import.meta.url),
    }])
    expect(report.ok).toBe(false)
    expect(report.issues).toContainEqual(expect.objectContaining({
      source: 'invalid-mechanics',
      message: 'unsupported opcode damage.unreviewed',
    }))
  })

  it('replays a fixed transcript deterministically and enforces its digest', () => {
    const first = runReplay(REPLAY)
    const second = runReplay(parseReplayTranscript(REPLAY))
    expect(second.finalStateSha256).toBe(first.finalStateSha256)
    expect(second.randomDraws).toBe(first.randomDraws)
    expect(second.steps).toEqual(first.steps)
    expect(() => runReplay({
      ...REPLAY,
      expect: { finalStateSha256: '0'.repeat(64) },
    })).toThrow(/digest mismatch/)
  })
})
