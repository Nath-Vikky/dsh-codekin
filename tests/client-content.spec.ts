import { afterEach, describe, expect, it } from 'vitest'
import { CORE_CONTENT_VIEW } from '../src/core-runtime.ts'
import type { CodekinContentView } from '../packages/content-sdk/src/view.ts'
import {
  activateCodekinContent,
  contentAssetUrl,
  contentTowerFloorProfile,
  creatureCatalog,
  parseCodekinContentView,
  skillByCreatureId,
  starterCreatureIds,
} from '../packages/renderer-react/src/content.ts'

function minimalContentView(): CodekinContentView {
  const starterId = CORE_CONTENT_VIEW.starters[0]!
  const creature = CORE_CONTENT_VIEW.creatures.find(row => row.id === starterId)!
  const skill = CORE_CONTENT_VIEW.skills.find(row => row.creatureId === starterId)!
  const asset = CORE_CONTENT_VIEW.assets.find(row => row.key === creature.sprite)!
  return {
    contentApi: 1,
    id: '@example/minimal@1.0.0',
    packs: [{ id: '@example/minimal', version: '1.0.0' }],
    ecologies: CORE_CONTENT_VIEW.ecologies,
    qualities: CORE_CONTENT_VIEW.qualities,
    creatures: [creature],
    skills: [skill],
    starters: [starterId],
    towerRotation: [starterId],
    assets: [asset],
  }
}

afterEach(() => { activateCodekinContent(CORE_CONTENT_VIEW) })

describe('React content view', () => {
  it('renders from the activated host content instead of a compiled core catalog', () => {
    const view = minimalContentView()
    activateCodekinContent(view)

    expect(creatureCatalog().map(row => row.id)).toEqual(view.starters)
    expect(starterCreatureIds()).toEqual(view.starters)
    expect(skillByCreatureId(view.starters[0]!)?.activeNameEn).toBeTruthy()
    expect(contentTowerFloorProfile(999).creatureId).toBe(view.starters[0])
    expect(contentAssetUrl(view.creatures[0]!.sprite)).toBe(
      `/api/tracewild/assets/${view.assets[0]!.path}?content=%40example%2Fminimal%401.0.0`,
    )
  })

  it('accepts the complete core view while keeping server-only fields out of JSON', () => {
    const parsed = parseCodekinContentView(CORE_CONTENT_VIEW)
    expect(parsed.creatures).toHaveLength(25)
    const json = JSON.stringify(parsed)
    expect(json).not.toContain('mechanics')
    expect(json).not.toContain('aliases')
    expect(json).not.toContain('dependencies')
    expect(Object.isFrozen(parsed)).toBe(true)
    expect(Object.isFrozen(parsed.creatures)).toBe(true)
  })

  it('rejects unsupported, extended, unsafe, or dangling content views', () => {
    expect(() => parseCodekinContentView({ ...CORE_CONTENT_VIEW, contentApi: 2 }))
      .toThrow('unsupported content API')
    expect(() => parseCodekinContentView({ ...CORE_CONTENT_VIEW, mechanics: [] }))
      .toThrow('invalid content view')

    const unsafeAsset = structuredClone(CORE_CONTENT_VIEW)
    ;(unsafeAsset.assets[0] as { path: string }).path = '../outside.webp'
    expect(() => parseCodekinContentView(unsafeAsset)).toThrow('invalid content view')

    const missingSkill = {
      ...minimalContentView(),
      skills: [],
    }
    expect(() => parseCodekinContentView(missingSkill)).toThrow('invalid content view')

    const danglingSprite = structuredClone(minimalContentView())
    ;(danglingSprite.creatures[0] as { sprite: string }).sprite = 'creature:missing:sprite'
    expect(() => parseCodekinContentView(danglingSprite)).toThrow('invalid content view')
  })
})
