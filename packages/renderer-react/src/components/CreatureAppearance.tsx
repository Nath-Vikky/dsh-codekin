import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import { CREATURE_EVOLUTION_LEVEL, CREATURE_ULTIMATE_LEVEL } from '../../../engine/src/appearance.ts'
import type { CapturedCreature, CreatureAppearance, CreatureDefinition } from '../../../engine/src/types.ts'
import { APPEARANCE_MOTION, appearanceTransition, decodeCreatureImage, resolveCreatureSprite, type PresentedAppearance } from '../appearance-presentation.ts'
import { contentAssetUrl } from '../content.ts'
import { CreatureSprite } from './creature-presentation.tsx'
import css from './creature-appearance.module.css'

type Translate = PropsLocale<'tracewild'>['t']

export function CreatureAppearancePortrait(props: {
  captured: CapturedCreature
  creature: CreatureDefinition
  reducedMotion: boolean
  t: Translate
  onChanging: (changing: boolean) => void
}) {
  const resolved = resolveCreatureSprite(props.creature.id, props.captured)
  const next: PresentedAppearance = { identity: props.captured.instanceId, level: props.captured.level, source: resolved.source, appearance: resolved.appearance }
  const [visible, setVisible] = useState(next)
  const visibleRef = useRef(visible)
  const previous = useRef(next)
  const [departing, setDeparting] = useState<PresentedAppearance>()
  const [phase, setPhase] = useState<'none' | 'loading' | 'change' | 'evolution'>('none')
  const evolutionEligible = next.level >= CREATURE_EVOLUTION_LEVEL
  const ultimateEligible = next.level >= CREATURE_ULTIMATE_LEVEL
  useEffect(() => {
    let canceled = false
    let timer: number | undefined
    const observed = previous.current
    previous.current = next
    const mode = appearanceTransition({ ...observed, source: visibleRef.current.source }, next)
    const show = (appearance: PresentedAppearance) => { visibleRef.current = appearance; setVisible(appearance) }
    if (mode === 'none') {
      show(next); setDeparting(undefined); setPhase('none'); props.onChanging(false)
      return
    }
    setPhase('loading'); props.onChanging(true)
    void (async () => {
      let result = next
      if (result.source !== undefined && !await decodeCreatureImage(result.source)) {
        result = { ...next, source: resolved.fallback, appearance: 'original' }
        if (result.source !== undefined && !await decodeCreatureImage(result.source)) result = { ...result, source: undefined }
      }
      if (canceled) return
      const old = visibleRef.current
      show(result)
      if (props.reducedMotion || old.source === result.source) {
        setDeparting(undefined); setPhase('none'); props.onChanging(false)
        return
      }
      setDeparting(old); setPhase(mode)
      timer = window.setTimeout(() => {
        setDeparting(undefined); setPhase('none'); props.onChanging(false)
      }, APPEARANCE_MOTION[mode] + 30)
    })()
    return () => { canceled = true; window.clearTimeout(timer); props.onChanging(false) }
  // Identity and source changes are intentional; ordinary stat renders must not restart a transition.
  }, [next.identity, evolutionEligible, ultimateEligible, next.source, next.appearance, resolved.fallback, props.reducedMotion, props.onChanging])

  return <div className={css.portrait} data-appearance-transition={phase} data-portrait-appearance={visible.appearance} data-creature-instance={props.captured.instanceId}
    style={{ '--appearance-change': `${APPEARANCE_MOTION.change}ms`, '--appearance-evolution': `${APPEARANCE_MOTION.evolution}ms` } as CSSProperties}
    aria-busy={phase === 'loading'}>
    {departing?.source !== undefined && <img className={css.departing} src={departing.source} alt="" draggable={false} />}
    {visible.source === undefined ? <span className={css.placeholder} aria-hidden="true">?</span>
      : <img key={`${visible.identity}-${visible.source}`} className={css.current} src={visible.source} alt=""
          data-creature-id={props.creature.id} data-creature-level={props.captured.level} data-creature-appearance={visible.appearance}
          decoding="async" draggable={false} onError={() => {
            const source = visible.source === resolved.fallback ? undefined : resolved.fallback
            const fallback = { ...visible, source, appearance: 'original' as const }
            visibleRef.current = fallback; setVisible(fallback)
          }} />}
    {phase === 'evolution' && <><i className={css.evolutionGlow} aria-hidden="true" /><span className={css.evolutionLabel} role="status">{props.t(visible.appearance === 'ultimate' ? 'ultimateUnlocked' : 'evolutionUnlocked')}</span></>}
  </div>
}

export function CreatureAppearancePicker(props: {
  captured: CapturedCreature
  creature: CreatureDefinition
  t: Translate
  busy: boolean
  battleActive: boolean
  onSelect: (appearance: CreatureAppearance) => void
  onClose: () => void
}) {
  const selected = resolveCreatureSprite(props.creature.id, props.captured).appearance
  const selection = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    selection.current?.focus({ preventScroll: true })
    selection.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [])
  const evolvedAvailable = contentAssetUrl(`creature:${props.creature.id}:evolved`) !== undefined
  const ultimateAvailable = props.creature.rarity === 'apex' && contentAssetUrl(`creature:${props.creature.id}:ultimate`) !== undefined
  const appearances: CreatureAppearance[] = ultimateAvailable ? ['original', 'evolved', 'ultimate'] : ['original', 'evolved']
  return <section className={css.picker} id="codekin-appearance-picker" role="region" aria-label={props.t('appearanceTitle')}
    onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); props.onClose() } }}>
    <header><div><strong>{props.t('appearanceTitle')}</strong><small>{props.t(props.battleActive ? 'appearanceBattleLocked' : 'appearanceHint')}</small></div>
      <button type="button" onClick={props.onClose} aria-label={props.t('appearanceClose')}>×</button></header>
    <div className={css.options} data-option-count={appearances.length}>
      {appearances.map(appearance => {
        const unlockLevel = appearance === 'ultimate' ? CREATURE_ULTIMATE_LEVEL : CREATURE_EVOLUTION_LEVEL
        const levelLocked = appearance !== 'original' && props.captured.level < unlockLevel
        const missing = appearance === 'evolved' && !evolvedAvailable
        const chosen = selected === appearance
        return <button key={appearance} ref={chosen ? selection : undefined} type="button"
          aria-pressed={chosen} data-appearance-option={appearance}
          disabled={props.busy || props.battleActive || levelLocked || missing}
          onClick={() => { if (!chosen && !levelLocked && !missing && !props.busy && !props.battleActive) props.onSelect(appearance) }}>
          <CreatureSprite creature={props.creature} level={unlockLevel} appearance={appearance} size="large" eager />
          <strong>{props.t(appearance === 'original' ? 'appearanceOriginal' : appearance === 'ultimate' ? 'appearanceUltimate' : 'appearanceEvolved')}</strong>
          <small>{levelLocked ? props.t('appearanceUnlockLevel', { level: unlockLevel }) : missing ? props.t('appearanceUnavailable') : chosen ? props.t('appearanceSelected') : props.t('appearanceChoose')}</small>
        </button>
      })}
    </div>
  </section>
}
