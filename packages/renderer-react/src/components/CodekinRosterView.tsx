import { useEffect, useMemo, useRef, useState } from 'react'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import { CAPTURE_CORE_QUALITIES, TRACE_ECOLOGIES } from '../../../content-sdk/src/types.ts'
import {
  MATERIAL_XP,
  MAX_PLAYER_LEVEL,
  playerStats,
  totalXpForLevel,
  xpToNextLevel,
} from '../../../engine/src/balance.ts'
import type {
  CaptureCoreQuality,
  CapturedCreature,
  CreatureDefinition,
  TraceWildAction,
  TraceWildActionResponse,
  TraceWildSnapshot,
} from '../../../engine/src/types.ts'
import { creatureById, skillByCreatureId } from '../content.ts'
import type { TraceWildLocaleKey } from '../locales.ts'
import {
  arrangeCodekinRoster,
  type CodekinRosterEcology,
  type CodekinRosterEntry,
  type CodekinRosterQuality,
  type CodekinRosterSort,
} from '../roster.ts'
import {
  CORE_KEYS,
  CreatureSprite,
  ECOLOGY_KEYS,
  RARITY_KEYS,
  creatureName,
} from './creature-presentation.tsx'
import { useDialogAccessibility } from './dialog-accessibility.ts'
import { CreatureAppearancePicker, CreatureAppearancePortrait } from './CreatureAppearance.tsx'
import appearanceCss from './creature-appearance.module.css'
import css from './tracewild.module.css'

type TraceWildTranslate = PropsLocale<'tracewild'>['t']

const ROSTER_SORT_KEYS: Record<CodekinRosterSort, TraceWildLocaleKey> = {
  default: 'rosterSortDefault',
  'level-asc': 'rosterSortLevelAsc',
  'level-desc': 'rosterSortLevelDesc',
}

const ROSTER_ECOLOGY_FILTERS: readonly CodekinRosterEcology[] = ['all', ...TRACE_ECOLOGIES]
const ROSTER_QUALITY_FILTERS: readonly CodekinRosterQuality[] = ['all', ...CAPTURE_CORE_QUALITIES]
const ROSTER_SORT_OPTIONS: readonly CodekinRosterSort[] = ['default', 'level-asc', 'level-desc']

function materialItemName(t: TraceWildTranslate, quality: CaptureCoreQuality): string {
  return t('growthMaterialItem', { quality: t(CORE_KEYS[quality]) })
}

export function CodekinView(props: {
  state: TraceWildSnapshot['state']
  t: TraceWildTranslate
  zh: boolean
  draft: string[]
  setDraft: (value: string[]) => void
  busy: boolean
  save: () => Promise<boolean>
  inspect: (instanceId: string) => void
  onEditingChange?: (editing: boolean) => void
}) {
  const [editing, setEditing] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [ecologyFilter, setEcologyFilter] = useState<CodekinRosterEcology>('all')
  const [qualityFilter, setQualityFilter] = useState<CodekinRosterQuality>('all')
  const [rosterSort, setRosterSort] = useState<CodekinRosterSort>('default')
  const [query, setQuery] = useState('')
  useEffect(() => { props.onEditingChange?.(editing) }, [editing, props.onEditingChange])
  const roster = useMemo<CodekinRosterEntry[]>(() => {
    const entries: CodekinRosterEntry[] = []
    props.state.creatures.forEach((captured, sourceIndex) => {
      const creature = creatureById(captured.creatureId)
      if (creature !== undefined) entries.push({ captured, creature, sourceIndex })
    })
    return entries
  }, [props.state.creatures])
  const visibleRoster = useMemo(() => editing
    ? roster
    : arrangeCodekinRoster(roster, {
        ecology: ecologyFilter,
        quality: qualityFilter,
        sort: rosterSort,
        query,
      }), [editing, ecologyFilter, qualityFilter, query, roster, rosterSort])
  const activeFilterCount = Number(ecologyFilter !== 'all')
    + Number(qualityFilter !== 'all')
    + Number(rosterSort !== 'default')
    + Number(query.trim().length > 0)
  const toggle = (instanceId: string): void => {
    if (props.draft.includes(instanceId)) {
      if (props.draft.length > 1) props.setDraft(props.draft.filter(id => id !== instanceId))
      return
    }
    if (props.draft.length < 3) props.setDraft([...props.draft, instanceId])
  }
  const beginEditing = (): void => {
    props.setDraft([...props.state.squad])
    setFiltersOpen(false)
    setEditing(true)
  }
  const cancelEditing = (): void => {
    props.setDraft([...props.state.squad])
    setEditing(false)
  }
  const save = async (): Promise<void> => {
    if (await props.save()) setEditing(false)
  }
  const resetFilters = (): void => {
    setEcologyFilter('all')
    setQualityFilter('all')
    setRosterSort('default')
    setQuery('')
  }
  return (
    <div className={`${css.panelPage} ${editing ? css.codekinEditMode : ''}`}>
      <div className={css.pageHeading}>
        <div>
          <span className={css.sectionKicker}>YOUR COLLECTION</span>
          <h2>{props.t('squad')}</h2>
          <p>{props.t(editing ? 'squadEditHelp' : 'squadHelp')}</p>
        </div>
        <div className={css.squadActions}>
          {editing
            ? <>
                <span>{props.t('squadSelection', { count: props.draft.length })}</span>
                <button type="button" className={css.squadCancel} disabled={props.busy} onClick={cancelEditing}>{props.t('cancelSquad')}</button>
                <button type="button" disabled={props.busy || props.draft.length === 0} onClick={() => { void save() }}>{props.t('saveSquad')}</button>
              </>
            : <>
                <button
                  type="button"
                  className={`${css.squadFilterToggle} ${activeFilterCount > 0 ? css.squadFilterActive : ''}`}
                  disabled={props.busy}
                  aria-expanded={filtersOpen}
                  aria-controls="codekin-roster-controls"
                  onClick={() => { setFiltersOpen(value => !value) }}
                >
                  <span aria-hidden="true">≡</span>
                  {props.t('rosterClassify')}
                  {activeFilterCount > 0 && <b>{activeFilterCount}</b>}
                </button>
                <button type="button" disabled={props.busy} onClick={beginEditing}>{props.t('editSquad')}</button>
              </>}
        </div>
      </div>
      {editing ? <div className={css.squadSlots} aria-label={props.t('squadSelection', { count: props.draft.length })}>
        {[0, 1, 2].map(index => {
          const entry = roster.find(row => row.captured.instanceId === props.draft[index])
          return <button key={index} type="button" disabled={props.busy || entry === undefined || props.draft.length <= 1}
            aria-label={props.t('squadSlot', { slot: index + 1, name: entry === undefined ? props.t('emptySlot') : creatureName(entry.creature, props.zh) })}
            onClick={() => { if (entry !== undefined) toggle(entry.captured.instanceId) }}>
            <b>0{index + 1}</b>{entry === undefined ? <span>＋</span> : <CreatureSprite creature={entry.creature} captured={entry.captured} size="small" />}
            <small>{entry === undefined ? props.t('emptySlot') : creatureName(entry.creature, props.zh)}</small>
          </button>
        })}
      </div> : <div className={css.rosterSearch}>
        <span aria-hidden="true">⌕</span>
        <input type="search" maxLength={80} value={query} aria-label={props.t('searchCodekin')}
          placeholder={props.t('searchCodekin')} onChange={event => { setQuery(event.target.value) }} />
        <small aria-live="polite">{visibleRoster.length} / {roster.length}</small>
      </div>}
      {!editing && filtersOpen && (
        <section id="codekin-roster-controls" className={css.rosterControls} aria-label={props.t('rosterControls')}>
          <div className={css.rosterControlRow}>
            <strong>{props.t('rosterAttribute')}</strong>
            <div className={css.rosterControlOptions} role="group" aria-label={props.t('rosterAttribute')}>
              {ROSTER_ECOLOGY_FILTERS.map(ecology => (
                <button
                  key={ecology}
                  type="button"
                  aria-pressed={ecologyFilter === ecology}
                  onClick={() => { setEcologyFilter(ecology) }}
                >
                  {ecology === 'all' ? props.t('rosterAll') : props.t(ECOLOGY_KEYS[ecology])}
                </button>
              ))}
            </div>
          </div>
          <div className={css.rosterControlRow}>
            <strong>{props.t('quality')}</strong>
            <div className={css.rosterControlOptions} role="group" aria-label={props.t('quality')}>
              {ROSTER_QUALITY_FILTERS.map(quality => (
                <button
                  key={quality}
                  type="button"
                  className={quality === 'all' ? undefined : css[`core_${quality}`]}
                  aria-pressed={qualityFilter === quality}
                  onClick={() => { setQualityFilter(quality) }}
                >
                  {quality === 'all' ? props.t('rosterAll') : props.t(CORE_KEYS[quality])}
                </button>
              ))}
            </div>
          </div>
          <div className={css.rosterControlRow}>
            <strong>{props.t('rosterSort')}</strong>
            <div className={css.rosterControlOptions} role="group" aria-label={props.t('rosterSort')}>
              {ROSTER_SORT_OPTIONS.map(sort => (
                <button
                  key={sort}
                  type="button"
                  aria-pressed={rosterSort === sort}
                  onClick={() => { setRosterSort(sort) }}
                >
                  {props.t(ROSTER_SORT_KEYS[sort])}
                </button>
              ))}
            </div>
          </div>
          <footer className={css.rosterControlSummary}>
            <span>{props.t('rosterResults', { count: visibleRoster.length })}</span>
            <button type="button" disabled={activeFilterCount === 0} onClick={resetFilters}>{props.t('rosterReset')}</button>
          </footer>
        </section>
      )}
      <div className={css.creatureCards}>
        {visibleRoster.map(({ captured, creature }) => {
          const draftPosition = props.draft.indexOf(captured.instanceId)
          const squadPosition = props.state.squad.indexOf(captured.instanceId)
          const deployed = squadPosition >= 0
          const selectionLocked = editing && draftPosition < 0 && props.draft.length >= 3
          return (
            <article
              key={captured.instanceId}
              className={`${css.creatureCard} ${css.codekinCard} ${css[`core_${captured.quality}`]} ${deployed ? css.codekinDeployed : ''} ${editing && draftPosition >= 0 ? css.creatureSelected : ''} ${selectionLocked ? css.codekinSelectionLocked : ''}`}
              data-quality={captured.quality}
              data-deployed={deployed ? 'true' : undefined}
              onPointerMove={event => {
                if (event.pointerType !== 'mouse' || event.currentTarget.closest('[data-motion="reduce"]') !== null) return
                const rect = event.currentTarget.getBoundingClientRect()
                event.currentTarget.style.setProperty('--tilt-x', `${(0.5 - (event.clientY - rect.top) / rect.height) * 5}deg`)
                event.currentTarget.style.setProperty('--tilt-y', `${((event.clientX - rect.left) / rect.width - 0.5) * 6}deg`)
              }}
              onPointerLeave={event => {
                event.currentTarget.style.setProperty('--tilt-x', '0deg')
                event.currentTarget.style.setProperty('--tilt-y', '0deg')
              }}
            >
              <span className={css.codekinNumber}>#{String(creature.number).padStart(2, '0')}</span>
              {editing && draftPosition >= 0 && <span className={css.partyIndex}>{draftPosition + 1}</span>}
              {!editing && deployed && (
                <span className={css.codekinDeployment}>
                  <i aria-hidden="true" />
                  {props.t('rosterDeployed')}
                  <b>{squadPosition + 1}</b>
                </span>
              )}
              <button
                type="button"
                className={css.creatureSelect}
                disabled={props.busy || selectionLocked || (editing && draftPosition >= 0 && props.draft.length === 1)}
                aria-pressed={editing ? draftPosition >= 0 : undefined}
                aria-label={editing
                  ? `${creatureName(creature, props.zh)} · ${props.t('squadSelection', { count: props.draft.length })}`
                  : `${creatureName(creature, props.zh)} · ${props.t('level')} ${captured.level} · ${props.t(ECOLOGY_KEYS[creature.ecology])} · ${props.t(CORE_KEYS[captured.quality])}${deployed ? ` · ${props.t('rosterDeployed')} ${squadPosition + 1}` : ''} · ${props.t('codekinDetail')}`}
                onClick={() => { editing ? toggle(captured.instanceId) : props.inspect(captured.instanceId) }}
              >
                <CreatureSprite creature={creature} captured={captured} size="medium" />
                <strong>{creatureName(creature, props.zh)}</strong>
                <span className={css.codekinBasics}>
                  <b>Lv.{captured.level}</b>
                  <i aria-hidden="true" />
                  <span>{props.t(ECOLOGY_KEYS[creature.ecology])}</span>
                </span>
                <small>{props.t(CORE_KEYS[captured.quality])} · {props.t(RARITY_KEYS[creature.rarity])}</small>
              </button>
            </article>
          )
        })}
      </div>
      {!editing && visibleRoster.length === 0 && (
        <div className={css.rosterEmpty}>
          <strong>{props.t('rosterNoMatches')}</strong>
          <button type="button" onClick={resetFilters}>{props.t('rosterReset')}</button>
        </div>
      )}
    </div>
  )
}

export function CodekinDetailModal(props: {
  captured: CapturedCreature
  creature: CreatureDefinition
  state: TraceWildSnapshot['state']
  t: TraceWildTranslate
  zh: boolean
  busy: boolean
  reducedMotion?: boolean
  act: (action: TraceWildAction) => Promise<TraceWildActionResponse | undefined>
  dismiss: () => void
  release: () => void
}) {
  const [appearanceOpen, setAppearanceOpen] = useState(false)
  const [appearanceChanging, setAppearanceChanging] = useState(false)
  const hanger = useRef<HTMLButtonElement>(null)
  const closeAppearance = () => { setAppearanceOpen(false); hanger.current?.focus({ preventScroll: true }) }
  const dialog = useDialogAccessibility(props.dismiss, props.busy)
  const stats = playerStats(props.creature.stats, props.captured.level, props.captured.quality)
  const skill = skillByCreatureId(props.creature.id)
  const levelBaseXp = totalXpForLevel(props.captured.level, props.captured.quality)
  const progress = Math.max(0, props.captured.xp - levelBaseXp)
  const needed = props.captured.level >= MAX_PLAYER_LEVEL
    ? 0
    : xpToNextLevel(props.captured.level, props.captured.quality)
  const progressPercent = needed <= 0 ? 100 : Math.min(100, Math.round(progress / needed * 100))
  return (
    <div
      className={`${css.modalBackdrop} ${css.codekinDetailBackdrop}`}
      onClick={(event) => {
        if (event.target === event.currentTarget && !props.busy) props.dismiss()
      }}
    >
      <section
        ref={dialog.dialogRef}
        className={css.codekinDetailModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="codekin-detail-title"
        tabIndex={-1}
        onKeyDown={event => {
          if (appearanceOpen && event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeAppearance() }
          else dialog.onDialogKeyDown(event)
        }}
        onClick={(event) => { event.stopPropagation() }}
      >
        <button ref={hanger} type="button" className={appearanceCss.hanger} disabled={props.busy}
          aria-label={props.t('appearanceTitle')} title={props.t('appearanceTitle')}
          aria-expanded={appearanceOpen} aria-controls="codekin-appearance-picker"
          onClick={() => { setAppearanceOpen(value => !value) }}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6a3 3 0 1 1 4.5 2.6c-1 .5-1.5 1-1.5 2.4v1M12 12 3 18v2h18v-2l-9-6Z" /></svg>
        </button>
        <button
          type="button"
          className={css.codekinDetailClose}
          disabled={props.busy}
          onClick={props.dismiss}
          title={props.t('closeCodekinDetail')}
          aria-label={props.t('closeCodekinDetail')}
          data-dialog-initial-focus
          autoFocus
        >
          <span aria-hidden="true">×</span>
        </button>
        <header className={`${css.codekinDetailHero} ${appearanceCss.hero}`}>
          <CreatureAppearancePortrait captured={props.captured} creature={props.creature} t={props.t}
            reducedMotion={props.reducedMotion ?? false} onChanging={setAppearanceChanging} />
          <div>
            <p>CODEKIN #{String(props.creature.number).padStart(2, '0')}</p>
            <h2 id="codekin-detail-title">{creatureName(props.creature, props.zh)}</h2>
            <div className={css.codekinDetailTags}>
              <span>{props.t(ECOLOGY_KEYS[props.creature.ecology])}</span>
              <span>{props.t(RARITY_KEYS[props.creature.rarity])}</span>
              <span>{props.t(CORE_KEYS[props.captured.quality])}</span>
            </div>
            <small>{props.t('level')} {props.captured.level} · {props.t('wins')} {props.captured.wins}</small>
          </div>
        </header>

        {appearanceOpen && <CreatureAppearancePicker captured={props.captured} creature={props.creature} t={props.t}
          busy={props.busy || appearanceChanging} battleActive={props.state.battle !== undefined} onClose={closeAppearance}
          onSelect={appearance => {
            if (props.busy || appearanceChanging || props.state.battle !== undefined) return
            void props.act({ type: 'set-creature-appearance', creatureInstanceId: props.captured.instanceId, appearance })
              .then(response => { if (response !== undefined) closeAppearance() })
          }} />}

        <section className={css.codekinDetailSection}>
          <h3>{props.t('codekinStats')}</h3>
          <div className={css.codekinDetailStats}>
            <span><b>{stats.hp.toLocaleString()}</b>{props.t('statRuntime')}</span>
            <span><b>{stats.attack.toLocaleString()}</b>{props.t('statCompute')}</span>
            <span><b>{stats.defense.toLocaleString()}</b>{props.t('statGuard')}</span>
            <span><b>{stats.speed.toLocaleString()}</b>{props.t('statResponse')}</span>
          </div>
        </section>

        {skill !== undefined && (
          <section className={css.codekinDetailSection}>
            <h3>{props.t('codekinProtocols')}</h3>
            <div className={css.codekinProtocols}>
              <article>
                <span>{props.t('passiveSkill')}</span>
                <strong>{props.zh ? skill.passiveNameZh : skill.passiveNameEn}</strong>
                <p>{props.zh ? skill.passiveDescriptionZh : skill.passiveDescriptionEn}</p>
              </article>
              <article>
                <span>{props.t('activeSkill')} · {skill.energyCost} {props.t('energy')}</span>
                <strong>{props.zh ? skill.activeNameZh : skill.activeNameEn}</strong>
                <p>{props.zh ? skill.activeDescriptionZh : skill.activeDescriptionEn}</p>
              </article>
            </div>
          </section>
        )}

        <section className={`${css.codekinDetailSection} ${css.codekinGrowth}`}>
          <header>
            <div>
              <h3>{props.t('growth')}</h3>
              <small>
                {props.captured.level >= MAX_PLAYER_LEVEL
                  ? props.t('levelCap')
                  : `${props.t('xp')} ${progress}/${needed}`}
              </small>
            </div>
            <b key={props.captured.level} className={css.levelPulse}>Lv.{props.captured.level}</b>
          </header>
          <div className={css.growthXpTrack} aria-hidden="true">
            <i style={{ width: `${progressPercent}%` }} />
          </div>
          <p>{props.t('growthMaterialChoice')}</p>
          <div className={css.codekinGrowthActions}>
            {CAPTURE_CORE_QUALITIES.map(quality => (
              <button
                key={quality}
                type="button"
                className={css[`core_${quality}`]}
                disabled={props.busy || appearanceChanging || props.captured.level >= MAX_PLAYER_LEVEL || props.state.materials[quality] <= 0}
                onClick={() => { void props.act({ type: 'feed-material', creatureInstanceId: props.captured.instanceId, quality, count: 1 }) }}
                title={`${props.t('feed')} · ${materialItemName(props.t, quality)} · +${MATERIAL_XP[quality]} EXP`}
                aria-label={`${props.t('feed')} ${materialItemName(props.t, quality)} · +${MATERIAL_XP[quality]} EXP`}
              >
                <i className={css.materialShard} />
                <strong>{props.t(CORE_KEYS[quality])}</strong>
                <span>+{MATERIAL_XP[quality]}</span>
                <small>×{props.state.materials[quality]}</small>
              </button>
            ))}
          </div>
        </section>

        <footer className={css.codekinDetailFooter}>
          <button
            type="button"
            className={css.codekinReleaseFromDetail}
            disabled={props.busy || props.state.creatures.length <= 1}
            title={props.state.creatures.length <= 1 ? props.t('releaseLastBlocked') : props.t('releaseCreature')}
            onClick={props.release}
          >
            {props.t('releaseCreature')}
          </button>
        </footer>
      </section>
    </div>
  )
}
