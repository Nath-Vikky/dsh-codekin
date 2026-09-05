import { renderToStaticMarkup } from 'react-dom/server'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CORE_CODEKIN_RUNTIME, CORE_CONTENT_VIEW } from '../src/core-runtime.ts'
import { APPEARANCE_MOTION, appearanceTransition, decodeCreatureImage, resolveCreatureSprite } from '../packages/renderer-react/src/appearance-presentation.ts'
import { activateCodekinContent } from '../packages/renderer-react/src/content.ts'
import { CreatureSprite } from '../packages/renderer-react/src/components/creature-presentation.tsx'
import { CreatureAppearancePicker, CreatureAppearancePortrait } from '../packages/renderer-react/src/components/CreatureAppearance.tsx'
import { BattleStage } from '../packages/renderer-react/src/components/BattleStage.tsx'
import { zh } from '../packages/renderer-react/src/locales.ts'

const t = ((key: keyof typeof zh, params?: Record<string, unknown>) => {
  let value: string = zh[key]
  for (const [key, replacement] of Object.entries(params ?? {})) value = value.replaceAll(`{${key}}`, String(replacement))
  return value
}) as PropsLocale<'tracewild'>['t']
function fixture() {
  const state = CORE_CODEKIN_RUNTIME.applyTraceWildAction(CORE_CODEKIN_RUNTIME.createInitialTraceWildState(1),
    { type: 'choose-starter', creatureId: 'lumen-indeximp' }, () => 0, 2).state
  const captured = state.creatures[0]!
  const creature = CORE_CODEKIN_RUNTIME.content.creature(captured.creatureId)!
  const original = CORE_CONTENT_VIEW.assets.find(asset => asset.key === `creature:${creature.id}:sprite`)!
  const evolved = { ...original, key: `creature:${creature.id}:evolved`, path: 'assets/creatures/evolved/test.webp' }
  activateCodekinContent({ ...CORE_CONTENT_VIEW, assets: [...CORE_CONTENT_VIEW.assets.filter(asset => asset.key !== evolved.key), evolved] })
  return { state, captured, creature }
}
afterEach(() => { activateCodekinContent(CORE_CONTENT_VIEW); vi.unstubAllGlobals() })

describe('Codekin appearance presentation', () => {
  it('renders each owned instance preference independently and uses level for wild portraits', () => {
    const { captured, creature } = fixture()
    const markup = renderToStaticMarkup(<>
      <CreatureSprite creature={creature} captured={{ ...captured, instanceId: 'old-form', level: 30, appearance: 'original' }} />
      <CreatureSprite creature={creature} captured={{ ...captured, instanceId: 'new-form', level: 30, appearance: 'evolved' }} />
      <CreatureSprite creature={creature} level={30} />
      <CreatureSprite creature={creature} captured={{ ...captured, level: 29, appearance: 'evolved' }} />
    </>)
    expect(markup.match(/data-creature-appearance="evolved"/g)).toHaveLength(2)
    expect(markup.match(/data-creature-appearance="original"/g)).toHaveLength(2)
    expect(markup).toMatch(/data-creature-instance="old-form" data-creature-appearance="original"/)
    expect(markup).toMatch(/data-creature-instance="new-form" data-creature-appearance="evolved"/)
  })

  it('falls back to the original sprite when a content pack has no evolved art', () => {
    const { creature } = fixture()
    activateCodekinContent({ ...CORE_CONTENT_VIEW, assets: CORE_CONTENT_VIEW.assets.filter(asset => !asset.key.endsWith(':evolved')) })
    const resolved = resolveCreatureSprite(creature.id, { level: 99, appearance: 'evolved' })
    expect(resolved.appearance).toBe('original')
    expect(resolved.source).toBe(resolved.fallback)
    expect(renderToStaticMarkup(<CreatureSprite creature={creature} level={99} />)).toContain('data-creature-appearance="original"')
  })

  it('uses different appearances for duplicate species in battle and a level-based enemy', () => {
    const { state, captured } = fixture()
    state.creatures = [
      { ...captured, instanceId: 'same-species-a', level: 30, appearance: 'original' },
      { ...captured, instanceId: 'same-species-b', level: 30, appearance: 'evolved' },
    ]
    state.squad = state.creatures.map(value => value.instanceId)
    const started = CORE_CODEKIN_RUNTIME.applyTraceWildAction(state, { type: 'start-tower' }, () => 0.2, 3).state
    const battle = { ...started.battle!, wildCreatureId: captured.creatureId, wildLevel: 30 }
    const markup = renderToStaticMarkup(<BattleStage battle={battle} creatures={state.creatures} t={t} zh
      locked={false} reducedMotion={false} onCast={() => undefined}
      displayedWildHp={battle.wildHp} displayedWildShield={0} displayedPartyHp={battle.partyHp} displayedPartyShield={0} />)
    expect(markup).toMatch(/data-creature-instance="same-species-a" data-creature-appearance="original"/)
    expect(markup).toMatch(/data-creature-instance="same-species-b" data-creature-appearance="evolved"/)
    expect(markup.match(/data-creature-appearance="evolved"/g)).toHaveLength(2)
  })

  it('shows a disabled Lv.30 evolved option before unlock and never selects it', () => {
    const { captured, creature } = fixture()
    const markup = renderToStaticMarkup(<CreatureAppearancePicker captured={{ ...captured, level: 29 }} creature={creature}
      t={t} busy={false} battleActive={false} onSelect={() => undefined} onClose={() => undefined} />)
    expect(markup).toMatch(/<button[^>]*aria-pressed="false"[^>]*data-appearance-option="evolved"[^>]*disabled=""/)
    expect(markup).toContain('Lv.30 解锁')
    expect(markup).toContain('aria-pressed="true" data-appearance-option="original"')
  })

  it('locks both appearance controls during battle while preserving the selected preview', () => {
    const { captured, creature } = fixture()
    const markup = renderToStaticMarkup(<CreatureAppearancePicker captured={{ ...captured, level: 30, appearance: 'original' }} creature={creature}
      t={t} busy={false} battleActive onSelect={() => undefined} onClose={() => undefined} />)
    expect(markup.match(/data-appearance-option="(?:original|evolved)" disabled=""/g)).toHaveLength(2)
    expect(markup).toContain('战斗结束后可以更换外观。')
  })

  it('celebrates a live level crossing once, but never a reload or an instance switch', () => {
    const original = { identity: 'one', level: 29, source: 'original.webp', appearance: 'original' as const }
    const evolved = { ...original, level: 30, source: 'evolved.webp', appearance: 'evolved' as const }
    expect(appearanceTransition(original, evolved)).toBe('evolution')
    expect(appearanceTransition(evolved, evolved)).toBe('none')
    expect(appearanceTransition(evolved, { ...evolved, level: 31 })).toBe('none')
    expect(appearanceTransition(original, { ...evolved, identity: 'other' })).toBe('none')
    expect(appearanceTransition(evolved, { ...original, level: 30 })).toBe('change')
    expect(APPEARANCE_MOTION.evolution).toBeGreaterThanOrEqual(1200)
    expect(APPEARANCE_MOTION.evolution).toBeLessThanOrEqual(1600)
    const { captured, creature } = fixture()
    const markup = renderToStaticMarkup(<CreatureAppearancePortrait captured={{ ...captured, level: 30 }} creature={creature}
      t={t} reducedMotion={false} onChanging={() => undefined} />)
    expect(markup).toContain('data-appearance-transition="none"')
    expect(markup).not.toContain('进化形解锁')
  })

  it('waits for image decoding and reports failed assets before replacing a visible image', async () => {
    let finish: (() => void) | undefined
    class DeferredImage {
      decoding = ''
      src = ''
      decode() { return new Promise<void>(resolve => { finish = resolve }) }
    }
    vi.stubGlobal('Image', DeferredImage)
    let done = false
    const loading = decodeCreatureImage('new.webp').then(value => { done = true; return value })
    await Promise.resolve()
    expect(done).toBe(false)
    finish!()
    expect(await loading).toBe(true)
    vi.stubGlobal('Image', class { decode() { return Promise.reject(new Error('missing image')) } })
    expect(await decodeCreatureImage('missing.webp')).toBe(false)
  })
})
