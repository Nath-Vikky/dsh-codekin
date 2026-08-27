import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import {
  CAPTURE_CORE_QUALITIES,
  CREATURE_CATALOG,
  STARTER_CREATURE_IDS,
  creatureById,
} from '../../core/catalog.ts'
import type {
  BattleLogEntry,
  CaptureCoreQuality,
  CreatureDefinition,
  TraceEcology,
  TraceLogEntry,
  TraceWildAction,
  TraceWildSnapshot,
} from '../../core/types.ts'
import { createTraceWildConnection } from '../bridge.ts'
import type { TraceWildLocaleKey } from '../locales.ts'
import css from './tracewild.module.css'

type Tab = 'map' | 'squad' | 'dex' | 'inventory'

export type TraceWildOverlayProps = PropsRuntime<'shell.overlay'> & PropsLocale<'tracewild'>

const ECOLOGY_KEYS: Record<TraceEcology, TraceWildLocaleKey> = {
  lumen: 'ecologyLumen', forge: 'ecologyForge', relay: 'ecologyRelay',
  aegis: 'ecologyAegis', glitch: 'ecologyGlitch',
}

const CORE_KEYS: Record<CaptureCoreQuality, TraceWildLocaleKey> = {
  pebble: 'corePebble', pulse: 'corePulse', prism: 'corePrism', nova: 'coreNova', origin: 'coreOrigin',
}

const RARITY_KEYS = {
  common: 'rarityCommon', uncommon: 'rarityUncommon', rare: 'rarityRare', apex: 'rarityApex',
} as const

function CreatureSprite(props: {
  creature: CreatureDefinition
  size?: 'tiny' | 'small' | 'medium' | 'large'
  unknown?: boolean
}) {
  return (
    <img
      className={`${css.sprite} ${css[`sprite_${props.size ?? 'medium'}`]} ${props.unknown ? css.spriteUnknown : ''}`}
      src={`/api/tracewild/assets/sprites/${props.creature.id}.png`}
      alt=""
      draggable={false}
    />
  )
}

function creatureName(creature: CreatureDefinition, zh: boolean): string {
  return zh ? creature.nameZh : creature.nameEn
}

function percent(value: number, max: number): number {
  return max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100))
}

function logText(
  entry: TraceLogEntry,
  t: TraceWildOverlayProps['t'],
  zh: boolean,
): string {
  const key: TraceWildLocaleKey = entry.kind === 'core-drop'
    ? 'logCore'
    : entry.kind === 'encounter'
      ? 'logEncounter'
      : entry.kind === 'capture'
        ? 'logCapture'
        : entry.kind === 'starter'
          ? 'logStarter'
          : 'logDefeat'
  const creature = entry.creatureId === undefined ? undefined : creatureById(entry.creatureId)
  const suffix = creature === undefined ? '' : ` · ${creatureName(creature, zh)}`
  const quality = entry.quality === undefined ? '' : ` · ${t(CORE_KEYS[entry.quality])}`
  return `${t(key)}${suffix}${quality}`
}

function battleLogText(row: BattleLogEntry, t: TraceWildOverlayProps['t']): string {
  const amount = row.amount ?? 0
  switch (row.kind) {
    case 'start': return t('battleStart')
    case 'hit': return t('battleHit', { amount })
    case 'armor-break': return t('battleArmor')
    case 'scan': return t('battleScan', { amount })
    case 'guard': return t('battleGuard', { amount })
    case 'counter': return t('battleCounter', { amount })
    case 'capture-failed': return t('battleCaptureFail')
    case 'defeat': return t('battleLost')
  }
}

export function TraceWildOverlay({ t }: TraceWildOverlayProps) {
  const connection = useMemo(() => createTraceWildConnection(), [])
  const [snapshot, setSnapshot] = useState<TraceWildSnapshot>()
  const [online, setOnline] = useState(true)
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('map')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string>()
  const [pulse, setPulse] = useState(false)
  const [squadDraft, setSquadDraft] = useState<string[]>([])
  const previousEncounters = useRef(0)
  const zh = t('title') === '迹境荒野'

  const refresh = useCallback(async (signal?: AbortSignal) => {
    try {
      setSnapshot(await connection.load(signal))
      setOnline(true)
    } catch {
      if (signal?.aborted !== true) setOnline(false)
    }
  }, [connection])

  useEffect(() => {
    const controller = new AbortController()
    void refresh(controller.signal)
    const unsubscribe = connection.subscribe((value) => {
      setSnapshot(value)
      if (value.state.encounters.length > previousEncounters.current) {
        setPulse(true)
        window.setTimeout(() => { setPulse(false) }, 1800)
      }
      previousEncounters.current = value.state.encounters.length
    }, setOnline)
    return () => {
      controller.abort()
      unsubscribe()
    }
  }, [connection, refresh])

  useEffect(() => {
    if (snapshot !== undefined) setSquadDraft([...snapshot.state.squad])
  }, [snapshot?.state.revision])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && snapshot?.state.battle === undefined) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  }, [open, snapshot?.state.battle])

  const act = useCallback(async (action: TraceWildAction): Promise<void> => {
    if (busy) return
    setBusy(true)
    setNotice(undefined)
    try {
      const response = await connection.act(action)
      setSnapshot(response)
      setOnline(true)
      if (response.notice === 'capture-success') setNotice(t('captured'))
      if (response.notice === 'capture-failed') setNotice(t('captureFailed'))
      if (response.notice === 'battle-lost') setNotice(t('battleLost'))
    } catch {
      setNotice(t('disconnected'))
      await refresh()
    } finally {
      setBusy(false)
    }
  }, [busy, connection, refresh, t])

  const state = snapshot?.state
  const uncaught = state?.encounters.length ?? 0

  const launcher = (
    <button
      type="button"
      className={`${css.launcher} ${pulse ? css.launcherPulse : ''}`}
      onClick={() => { setOpen(true); setPulse(false) }}
      title={t('open')}
      aria-label={t('open')}
    >
      <span className={css.launcherCore} aria-hidden="true" />
      {uncaught > 0 && <span className={css.badge}>{uncaught > 99 ? '99+' : uncaught}</span>}
    </button>
  )

  if (!open) return launcher

  return (
    <>
      {launcher}
      <section className={css.overlay} aria-label={t('title')}>
        <header className={css.header}>
          <div className={css.brand}>
            <span className={css.logoCore} aria-hidden="true" />
            <div>
              <h1>{t('title')}</h1>
              <p>{t('subtitle')}</p>
            </div>
          </div>
          <div className={css.headerStats}>
            {CAPTURE_CORE_QUALITIES.map(quality => (
              <span key={quality} className={`${css.miniCore} ${css[`core_${quality}`]}`} title={t(CORE_KEYS[quality])}>
                {state?.cores[quality] ?? 0}
              </span>
            ))}
            <span className={online ? css.online : css.offline}>{online ? 'LIVE' : 'OFFLINE'}</span>
            <button type="button" className={css.close} onClick={() => { setOpen(false) }}>{t('close')}</button>
          </div>
        </header>

        {state === undefined
          ? <div className={css.centerMessage}>{online ? t('loading') : t('disconnected')}</div>
          : (
            <>
              {!state.starterChosen && (
                <StarterSelection t={t} zh={zh} busy={busy} choose={creatureId => act({ type: 'choose-starter', creatureId })} />
              )}
              <nav className={css.tabs} aria-label={t('title')}>
                {(['map', 'squad', 'dex', 'inventory'] as const).map(id => (
                  <button key={id} type="button" className={tab === id ? css.tabActive : ''} onClick={() => { setTab(id) }}>
                    {t(id)}
                  </button>
                ))}
              </nav>
              <main className={css.content}>
                {tab === 'map' && <MapView state={state} t={t} zh={zh} busy={busy} start={encounterId => act({ type: 'start-battle', encounterId })} />}
                {tab === 'squad' && (
                  <SquadView
                    state={state}
                    t={t}
                    zh={zh}
                    draft={squadDraft}
                    setDraft={setSquadDraft}
                    busy={busy}
                    save={() => act({ type: 'set-squad', instanceIds: squadDraft })}
                  />
                )}
                {tab === 'dex' && <DexView state={state} t={t} zh={zh} />}
                {tab === 'inventory' && <InventoryView state={state} t={t} zh={zh} />}
              </main>
              <footer className={css.footer}>{t('privacy')}</footer>
              {state.battle !== undefined && (
                <BattleView
                  state={state}
                  t={t}
                  zh={zh}
                  busy={busy}
                  act={act}
                />
              )}
              {notice !== undefined && <div className={css.toast} role="status">{notice}</div>}
            </>
          )}
      </section>
    </>
  )
}

function StarterSelection(props: {
  t: TraceWildOverlayProps['t']
  zh: boolean
  busy: boolean
  choose: (creatureId: string) => void
}) {
  return (
    <div className={css.modalBackdrop}>
      <div className={css.starterModal} role="dialog" aria-modal="true" aria-labelledby="tracewild-starter-title">
        <h2 id="tracewild-starter-title">{props.t('starterTitle')}</h2>
        <p>{props.t('starterBody')}</p>
        <div className={css.starterGrid}>
          {STARTER_CREATURE_IDS.map((id) => {
            const creature = creatureById(id)!
            return (
              <button key={id} type="button" disabled={props.busy} onClick={() => { props.choose(id) }}>
                <CreatureSprite creature={creature} size="large" />
                <strong>{creatureName(creature, props.zh)}</strong>
                <span>{props.t(ECOLOGY_KEYS[creature.ecology])}</span>
                <small>{creature.signatureProtocol}</small>
                <b>{props.t('choose')}</b>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function MapView(props: {
  state: TraceWildSnapshot['state']
  t: TraceWildOverlayProps['t']
  zh: boolean
  busy: boolean
  start: (encounterId: string) => void
}) {
  return (
    <div className={css.mapFrame}>
      <div className={css.worldMap}>
        {(Object.keys(ECOLOGY_KEYS) as TraceEcology[]).map(ecology => (
          <div key={ecology} className={`${css.regionLabel} ${css[`region_${ecology}`]}`}>
            {props.t(ECOLOGY_KEYS[ecology])}
          </div>
        ))}
        {props.state.encounters.map((encounter) => {
          const creature = creatureById(encounter.creatureId)
          if (creature === undefined) return null
          return (
            <button
              key={encounter.id}
              type="button"
              className={`${css.encounter} ${encounter.enhanced ? css.encounterEnhanced : ''}`}
              style={{ left: `${encounter.mapX}%`, top: `${encounter.mapY}%` }}
              disabled={props.busy || !props.state.starterChosen}
              onClick={() => { props.start(encounter.id) }}
              title={`${creatureName(creature, props.zh)} · ${props.t(RARITY_KEYS[creature.rarity])}`}
            >
              <CreatureSprite creature={creature} size="small" />
              <span>{creatureName(creature, props.zh)}</span>
              {encounter.enhanced && <b>{props.t('enhanced')}</b>}
            </button>
          )
        })}
        {props.state.encounters.length === 0 && <div className={css.mapEmpty}>{props.t('mapEmpty')}</div>}
      </div>
      <div className={css.mapLegend}>
        {(Object.keys(ECOLOGY_KEYS) as TraceEcology[]).map(ecology => (
          <span key={ecology} data-ecology={ecology}>{props.t(ECOLOGY_KEYS[ecology])}</span>
        ))}
      </div>
    </div>
  )
}

function SquadView(props: {
  state: TraceWildSnapshot['state']
  t: TraceWildOverlayProps['t']
  zh: boolean
  draft: string[]
  setDraft: (value: string[]) => void
  busy: boolean
  save: () => void
}) {
  const toggle = (instanceId: string): void => {
    if (props.draft.includes(instanceId)) {
      if (props.draft.length > 1) props.setDraft(props.draft.filter(id => id !== instanceId))
      return
    }
    if (props.draft.length < 3) props.setDraft([...props.draft, instanceId])
  }
  return (
    <div className={css.panelPage}>
      <div className={css.pageHeading}>
        <div><h2>{props.t('squad')}</h2><p>{props.t('squadHelp')}</p></div>
        <button type="button" disabled={props.busy || props.draft.length === 0} onClick={props.save}>{props.t('saveSquad')}</button>
      </div>
      <div className={css.creatureCards}>
        {props.state.creatures.map((captured) => {
          const creature = creatureById(captured.creatureId)
          if (creature === undefined) return null
          const position = props.draft.indexOf(captured.instanceId)
          return (
            <button
              key={captured.instanceId}
              type="button"
              className={`${css.creatureCard} ${position >= 0 ? css.creatureSelected : ''}`}
              onClick={() => { toggle(captured.instanceId) }}
            >
              {position >= 0 && <span className={css.partyIndex}>{position + 1}</span>}
              <CreatureSprite creature={creature} size="medium" />
              <strong>{creatureName(creature, props.zh)}</strong>
              <span>{props.t(ECOLOGY_KEYS[creature.ecology])} · {props.t(RARITY_KEYS[creature.rarity])}</span>
              <small>{props.t('level')} {captured.level} · {props.t('wins')} {captured.wins}</small>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function DexView(props: { state: TraceWildSnapshot['state']; t: TraceWildOverlayProps['t']; zh: boolean }) {
  const dex = new Map(props.state.dex.map(row => [row.creatureId, row]))
  return (
    <div className={css.panelPage}>
      <div className={css.pageHeading}>
        <div>
          <h2>{props.t('dex')}</h2>
          <p>{props.t('dexSeen')} {props.state.dex.length}/25 · {props.t('dexCaught')} {props.state.dex.filter(row => row.captured > 0).length}/25</p>
        </div>
      </div>
      <div className={css.dexGrid}>
        {CREATURE_CATALOG.map((creature) => {
          const record = dex.get(creature.id)
          const seen = record !== undefined
          const caught = (record?.captured ?? 0) > 0
          return (
            <div key={creature.id} className={`${css.dexCard} ${caught ? css.dexCaught : seen ? css.dexSeen : ''}`}>
              <span className={css.dexNumber}>#{String(creature.number).padStart(2, '0')}</span>
              <CreatureSprite creature={creature} size="small" unknown={!seen} />
              <strong>{seen ? creatureName(creature, props.zh) : props.t('undiscovered')}</strong>
              <small>{seen ? props.t(ECOLOGY_KEYS[creature.ecology]) : '???'}</small>
              {record !== undefined && <span>{props.t('dexSeen')} ×{record.seen} · {props.t('dexCaught')} ×{record.captured}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function InventoryView(props: { state: TraceWildSnapshot['state']; t: TraceWildOverlayProps['t']; zh: boolean }) {
  const stats = props.state.stats
  return (
    <div className={css.inventoryLayout}>
      <section className={css.inventoryPanel}>
        <h2>{props.t('inventory')}</h2>
        <div className={css.coreGrid}>
          {CAPTURE_CORE_QUALITIES.map(quality => (
            <div key={quality} className={css.coreCard}>
              <span className={`${css.bigCore} ${css[`core_${quality}`]}`} />
              <strong>{props.t(CORE_KEYS[quality])}</strong>
              <b>× {props.state.cores[quality]}</b>
            </div>
          ))}
        </div>
        <div className={css.statsGrid}>
          <span><b>{stats.completedTurns}</b>{props.t('totalTurns')}</span>
          <span><b>{stats.failedTurns}</b>{props.t('failures')}</span>
          <span><b>{stats.successfulCaptures}</b>{props.t('captureCount')}</span>
          <span><b>{stats.currentSuccessStreak}</b>{props.t('streak')}</span>
        </div>
      </section>
      <section className={css.logPanel}>
        <h2>{props.t('eventLog')}</h2>
        {props.state.log.length === 0
          ? <p>{props.t('emptyLog')}</p>
          : <ol>{props.state.log.map(entry => (
              <li key={entry.id}>
                <time>{new Date(entry.at).toLocaleTimeString()}</time>
                <span>{logText(entry, props.t, props.zh)}</span>
              </li>
            ))}</ol>}
      </section>
    </div>
  )
}

function BattleView(props: {
  state: TraceWildSnapshot['state']
  t: TraceWildOverlayProps['t']
  zh: boolean
  busy: boolean
  act: (action: TraceWildAction) => Promise<void>
}) {
  const battle = props.state.battle!
  const encounter = props.state.encounters.find(row => row.id === battle.encounterId)
  const player = props.state.creatures.find(row => row.instanceId === battle.playerInstanceId)
  const wild = encounter === undefined ? undefined : creatureById(encounter.creatureId)
  const own = player === undefined ? undefined : creatureById(player.creatureId)
  if (encounter === undefined || player === undefined || wild === undefined || own === undefined) return null
  const availableCores = CAPTURE_CORE_QUALITIES.filter(quality => props.state.cores[quality] > 0)
  return (
    <div className={css.battleBackdrop}>
      <section className={css.battlePanel} role="dialog" aria-modal="true" aria-label={props.t('battle')}>
        <header>
          <h2>{props.t('battle')}</h2>
          <span>{props.t(ECOLOGY_KEYS[own.ecology])} ⇄ {props.t(ECOLOGY_KEYS[wild.ecology])}</span>
        </header>
        <div className={css.arena}>
          <div className={css.fighter}>
            <div className={css.fighterName}><strong>{creatureName(own, props.zh)}</strong><span>Lv.{player.level}</span></div>
            <CreatureSprite creature={own} size="large" />
            <div className={css.hpBar}><i style={{ width: `${percent(battle.playerHp, battle.playerMaxHp)}%` }} /></div>
            <small>{props.t('health')} {battle.playerHp}/{battle.playerMaxHp} · {props.t('shield')} {battle.playerShield}</small>
          </div>
          <div className={css.battleVs}>VS</div>
          <div className={`${css.fighter} ${encounter.enhanced ? css.fighterEnhanced : ''}`}>
            <div className={css.fighterName}><strong>{creatureName(wild, props.zh)}</strong><span>{props.t(RARITY_KEYS[wild.rarity])}</span></div>
            <CreatureSprite creature={wild} size="large" />
            <div className={`${css.hpBar} ${css.hpWild}`}><i style={{ width: `${percent(battle.wildHp, battle.wildMaxHp)}%` }} /></div>
            <small>{props.t('health')} {battle.wildHp}/{battle.wildMaxHp} · {props.t('armor')} {battle.wildArmor} · {props.t('focus')} {battle.focus}</small>
          </div>
        </div>
        <div className={css.battleBottom}>
          <ol className={css.battleLog}>{battle.log.map((row, index) => <li key={`${row.turn}-${row.kind}-${index}`}>{battleLogText(row, props.t)}</li>)}</ol>
          <div className={css.battleControls}>
            <p>{props.t('battleHint')}</p>
            <div className={css.moveButtons}>
              <button type="button" disabled={props.busy} onClick={() => { void props.act({ type: 'battle-move', move: 'strike' }) }}>{props.t('strike')}</button>
              <button type="button" disabled={props.busy} onClick={() => { void props.act({ type: 'battle-move', move: 'scan' }) }}>{props.t('scan')}</button>
              <button type="button" disabled={props.busy} onClick={() => { void props.act({ type: 'battle-move', move: 'guard' }) }}>{props.t('guard')}</button>
              <button type="button" className={css.flee} disabled={props.busy} onClick={() => { void props.act({ type: 'flee' }) }}>{props.t('flee')}</button>
            </div>
            <div className={css.captureRow}>
              <strong>{props.t('capture')}</strong>
              {availableCores.length === 0 && <span>{props.t('noCores')}</span>}
              {availableCores.map(quality => (
                <button
                  key={quality}
                  type="button"
                  className={css[`core_${quality}`]}
                  disabled={props.busy || battle.wildArmor > 0}
                  onClick={() => { void props.act({ type: 'capture', quality }) }}
                  title={props.t(CORE_KEYS[quality])}
                  aria-label={`${props.t(CORE_KEYS[quality])} · ${props.state.cores[quality]}`}
                >
                  <i />
                  <span>{props.t(CORE_KEYS[quality])}</span>
                  <b>{props.state.cores[quality]}</b>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
