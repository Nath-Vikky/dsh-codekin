import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import {
  CAPTURE_CORE_QUALITIES,
  CREATURE_CATALOG,
  STARTER_CREATURE_IDS,
  creatureById,
} from '../../core/catalog.ts'
import { areAdjacentTiles } from '../../core/match3.ts'
import { skillByCreatureId } from '../../core/skills.ts'
import type {
  BattleLogEntry,
  CaptureCoreQuality,
  CreatureDefinition,
  EnemyIntent,
  MatchTile,
  TraceEcology,
  TraceLogEntry,
  TraceWildAction,
  TraceWildSnapshot,
} from '../../core/types.ts'
import { TraceWildConnectionError, createTraceWildConnection } from '../bridge.ts'
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

function battleLogText(row: BattleLogEntry, t: TraceWildOverlayProps['t'], zh: boolean): string {
  const amount = row.amount ?? 0
  switch (row.kind) {
    case 'start': return t('battleStart')
    case 'match': return t('battleMatch', { amount })
    case 'combo': return t('battleCombo', { amount })
    case 'armor-break': return t('battleArmor')
    case 'skill': return t('battleSkill', { amount })
    case 'heal': return t('battleHeal', { amount })
    case 'shield': return t('battleShield', { amount })
    case 'enemy': return t('battleEnemy', { amount })
    case 'enemy-shield': return t('battleEnemyShield', { amount })
    case 'enemy-delay': return t('battleEnemyDelay')
    case 'switch': {
      const creature = row.creatureId === undefined ? undefined : creatureById(row.creatureId)
      return t('battleSwitch', { name: creature === undefined ? '—' : creatureName(creature, zh) })
    }
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
      if (response.notice === 'skill-cast') setNotice(t('skillReleased'))
    } catch (error) {
      if (error instanceof TraceWildConnectionError && error.code === 'invalid-action') {
        setNotice(t('invalidSwap'))
      } else {
        setNotice(error instanceof TraceWildConnectionError && error.code === 'conflict'
          ? t('invalidSwap')
          : t('disconnected'))
        await refresh()
      }
    } finally {
      setBusy(false)
    }
  }, [busy, connection, refresh, t])

  const state = snapshot?.state
  const uncaught = state?.encounters.length ?? 0

  const launcher = (
    <button
      type="button"
      className={`${css.launcher} ${open ? css.launcherOpen : ''} ${pulse ? css.launcherPulse : ''}`}
      onClick={() => { setOpen(value => !value); setPulse(false) }}
      title={open ? t('close') : t('open')}
      aria-label={open ? t('close') : t('open')}
      aria-expanded={open}
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
              <small>{props.t('level')} {captured.level} · {props.t('quality')} {props.t(CORE_KEYS[captured.quality])} · {props.t('wins')} {captured.wins}</small>
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

const TILE_SYMBOLS: Record<TraceEcology, string> = {
  lumen: '✦', forge: '◆', relay: '⇄', aegis: '⬢', glitch: '⌁',
}

const SPECIAL_KEYS = {
  row: 'specialRow', column: 'specialColumn', burst: 'specialBurst', origin: 'specialOrigin',
} as const

const INTENT_KEYS: Record<EnemyIntent, TraceWildLocaleKey> = {
  strike: 'intentStrike', guard: 'intentGuard', disrupt: 'intentDisrupt', corrupt: 'intentCorrupt', mark: 'intentMark',
}

function tileLabel(tile: MatchTile, index: number, t: TraceWildOverlayProps['t']): string {
  const ecology = t(ECOLOGY_KEYS[tile.ecology])
  const special = tile.special === 'none' ? '' : ` · ${t(SPECIAL_KEYS[tile.special])}`
  return `${ecology}${special} · ${Math.floor(index / 7) + 1},${index % 7 + 1}`
}

interface TileGesture {
  index: number
  pointerId: number
  startX: number
  startY: number
  offsetX: number
  offsetY: number
}

interface SwapMotion {
  from: number
  to: number
}

function swipeTarget(index: number, deltaX: number, deltaY: number): number | undefined {
  const row = Math.floor(index / 7)
  const column = index % 7
  if (Math.abs(deltaX) >= Math.abs(deltaY)) {
    if (deltaX > 0 && column < 6) return index + 1
    if (deltaX < 0 && column > 0) return index - 1
    return undefined
  }
  if (deltaY > 0 && row < 6) return index + 7
  if (deltaY < 0 && row > 0) return index - 7
  return undefined
}

function swapMotionClass(index: number, motion: SwapMotion | undefined): string {
  if (motion === undefined || (index !== motion.from && index !== motion.to)) return ''
  const delta = motion.to - motion.from
  if (index === motion.from) {
    return delta === 1
      ? css.tileSwapRight ?? ''
      : delta === -1
        ? css.tileSwapLeft ?? ''
        : delta === 7
          ? css.tileSwapDown ?? ''
          : css.tileSwapUp ?? ''
  }
  return delta === 1
    ? css.tileSwapLeft ?? ''
    : delta === -1
      ? css.tileSwapRight ?? ''
      : delta === 7
        ? css.tileSwapUp ?? ''
        : css.tileSwapDown ?? ''
}

function BattleView(props: {
  state: TraceWildSnapshot['state']
  t: TraceWildOverlayProps['t']
  zh: boolean
  busy: boolean
  act: (action: TraceWildAction) => Promise<void>
}) {
  const battle = props.state.battle!
  const [selectedTile, setSelectedTile] = useState<number>()
  const [gesture, setGesture] = useState<TileGesture>()
  const [swapMotion, setSwapMotion] = useState<SwapMotion>()
  const [animating, setAnimating] = useState(false)
  const [damageBurst, setDamageBurst] = useState<{ key: number; amount: number }>()
  const [partyHitKey, setPartyHitKey] = useState(0)
  const swapTimer = useRef<number>()
  const suppressClick = useRef(false)
  const previousBattle = useRef({ id: battle.id, wildHp: battle.wildHp, partyHp: battle.party.reduce((sum, row) => sum + row.hp, 0) })
  const encounter = props.state.encounters.find(row => row.id === battle.encounterId)
  const wild = creatureById(battle.wildCreatureId)
  const active = battle.party[battle.activeIndex]
  const activeDefinition = active === undefined ? undefined : creatureById(active.creatureId)
  const locked = props.busy || animating
  const partyHp = battle.party.reduce((sum, row) => sum + row.hp, 0)

  useEffect(() => {
    setSelectedTile(undefined)
    setGesture(undefined)
  }, [battle.id, battle.turn, battle.actionsRemaining, battle.activeIndex])

  useEffect(() => {
    const previous = previousBattle.current
    if (previous.id !== battle.id) {
      previousBattle.current = { id: battle.id, wildHp: battle.wildHp, partyHp }
      return
    }
    const wildDamage = previous.wildHp - battle.wildHp
    if (wildDamage > 0) setDamageBurst({ key: Date.now(), amount: wildDamage })
    if (previous.partyHp > partyHp) setPartyHitKey(value => value + 1)
    previousBattle.current = { id: battle.id, wildHp: battle.wildHp, partyHp }
  }, [battle.id, battle.wildHp, partyHp])

  useEffect(() => () => {
    if (swapTimer.current !== undefined) window.clearTimeout(swapTimer.current)
  }, [])

  if (encounter === undefined || wild === undefined || active === undefined || activeDefinition === undefined) return null
  const availableCores = CAPTURE_CORE_QUALITIES.filter(quality => props.state.cores[quality] > 0)
  const captureReady = battle.wildArmor === 0 && battle.wildHp / battle.wildMaxHp <= 0.3
  const latestLog = battle.log.slice(-2)
  const lastLog = battle.log.at(-1)

  const swap = (from: number, to: number): void => {
    if (locked || !areAdjacentTiles(from, to)) {
      setSelectedTile(to)
      return
    }
    setSelectedTile(undefined)
    setGesture(undefined)
    setSwapMotion({ from, to })
    setAnimating(true)
    swapTimer.current = window.setTimeout(() => {
      swapTimer.current = undefined
      void props.act({ type: 'battle-swap', from, to }).finally(() => {
        setSwapMotion(undefined)
        setAnimating(false)
      })
    }, 130)
  }

  const select = (index: number): void => {
    if (locked) return
    if (selectedTile === undefined) {
      setSelectedTile(index)
      return
    }
    if (selectedTile === index) {
      setSelectedTile(undefined)
      return
    }
    swap(selectedTile, index)
  }

  const moveGesture = (index: number, clientX: number, clientY: number, tileSize: number): void => {
    if (gesture === undefined || gesture.index !== index || locked) return
    const offsetX = clientX - gesture.startX
    const offsetY = clientY - gesture.startY
    const limit = tileSize * 0.42
    setGesture({ ...gesture, offsetX: Math.max(-limit, Math.min(limit, offsetX)), offsetY: Math.max(-limit, Math.min(limit, offsetY)) })
    const threshold = Math.max(15, tileSize * 0.28)
    if (Math.max(Math.abs(offsetX), Math.abs(offsetY)) < threshold) return
    const target = swipeTarget(index, offsetX, offsetY)
    if (target === undefined) return
    suppressClick.current = true
    window.setTimeout(() => { suppressClick.current = false }, 350)
    swap(index, target)
  }

  return (
    <div className={css.battleBackdrop}>
      <section className={`${css.battlePanel} ${partyHitKey > 0 ? css.battleWasHit : ''}`} role="dialog" aria-modal="true" aria-label={props.t('battle')}>
        <header className={css.battleHeader}>
          <div>
            <h2>{props.t('battle')}</h2>
            <span>{props.t('round')} {battle.round} · {props.t('movesRemaining')} {battle.actionsRemaining}/3</span>
          </div>
          <button type="button" className={css.flee} disabled={props.busy} onClick={() => { void props.act({ type: 'flee' }) }}>{props.t('flee')}</button>
        </header>

        <div className={`${css.wildBanner} ${encounter.enhanced ? css.fighterEnhanced : ''}`} key={`${battle.id}-${battle.wildHp}`}>
          <div className={css.enemyAura} aria-hidden="true" />
          <CreatureSprite creature={wild} size="medium" />
          <div className={css.wildVitals}>
            <div className={css.fighterName}>
              <strong>{creatureName(wild, props.zh)}</strong>
              <span>{props.t(ECOLOGY_KEYS[wild.ecology])} · {props.t(RARITY_KEYS[wild.rarity])}</span>
            </div>
            <div className={`${css.hpBar} ${css.hpWild}`}><i style={{ width: `${percent(battle.wildHp, battle.wildMaxHp)}%` }} /></div>
            <small>
              {props.t('health')} {battle.wildHp}/{battle.wildMaxHp} · {props.t('armor')} {battle.wildArmor}
              {battle.wildShield > 0 ? ` · ${props.t('shield')} ${battle.wildShield}` : ''}
            </small>
          </div>
          <div className={css.enemyIntent}>
            <span>{props.t('enemyIntent')}</span>
            <strong>{props.t(INTENT_KEYS[battle.enemyIntent])}</strong>
          </div>
          {damageBurst !== undefined && <strong key={damageBurst.key} className={css.damageBurst}>-{damageBurst.amount}</strong>}
          {lastLog?.kind === 'combo' && <strong className={css.comboBurst}>CHAIN ×{lastLog.amount ?? 1}</strong>}
        </div>

        <div className={css.matchBattleLayout}>
          <div className={css.partyColumn}>
            <div className={css.partyBattleList} key={`party-${partyHitKey}-${battle.activeIndex}`}>
              {battle.party.map((member, index) => {
                const creature = creatureById(member.creatureId)
                const skill = skillByCreatureId(member.creatureId)
                if (creature === undefined || skill === undefined) return null
                const isActive = index === battle.activeIndex
                const canCast = isActive && member.hp > 0 && member.energy >= skill.energyCost && !member.skillUsedStage
                return (
                  <article
                    key={member.instanceId}
                    className={`${css.partyCombatant} ${isActive ? css.partyCombatantActive : ''} ${member.hp <= 0 ? css.partyCombatantDown : ''}`}
                    title={`${props.t('passiveSkill')} · ${props.zh ? skill.passiveNameZh : skill.passiveNameEn}\n${props.zh ? skill.passiveDescriptionZh : skill.passiveDescriptionEn}`}
                  >
                    <span className={css.partySlot}>{index + 1}</span>
                    <CreatureSprite creature={creature} size="small" />
                    <div className={css.partyCombatantBody}>
                      <div className={css.fighterName}>
                        <strong>{creatureName(creature, props.zh)}</strong>
                        <span>{props.t(CORE_KEYS[member.quality])}</span>
                      </div>
                      <div className={css.hpBar}><i style={{ width: `${percent(member.hp, member.maxHp)}%` }} /></div>
                      <div className={css.energyBar}><i style={{ width: `${percent(member.energy, skill.energyCost)}%` }} /></div>
                      <small>{member.hp}/{member.maxHp} · {props.t('energy')} {member.energy}/{skill.energyCost}</small>
                      <button
                        type="button"
                        className={css.skillButton}
                        disabled={locked || !canCast}
                        onClick={() => { void props.act({ type: 'battle-cast', creatureInstanceId: member.instanceId }) }}
                        title={props.zh ? skill.activeDescriptionZh : skill.activeDescriptionEn}
                      >
                        {props.zh ? skill.activeNameZh : skill.activeNameEn}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <div className={css.boardColumn}>
            <div className={css.turnSummary}>
              <span className={`${css.ecologyPip} ${css[`pip_${activeDefinition.ecology}`]}`}>{TILE_SYMBOLS[activeDefinition.ecology]}</span>
              <strong>{creatureName(activeDefinition, props.zh)} · {props.t('activeTurn')}</strong>
              <span className={css.actionDots} aria-label={`${props.t('movesRemaining')} ${battle.actionsRemaining}`}>
                {[0, 1, 2].map(index => <i key={index} className={index < battle.actionsRemaining ? css.actionDotActive : ''} />)}
              </span>
            </div>
            <div
              key={`${battle.id}-${battle.turn}-${battle.actionsRemaining}-${battle.wildHp}-${battle.log.length}`}
              className={css.matchBoard}
              role="grid"
              aria-label={props.t('boardHelp')}
              aria-busy={locked}
            >
              {battle.board.map((tile, index) => {
                const dragging = gesture?.index === index
                const tileStyle = {
                  '--tile-row': Math.floor(index / 7),
                  '--drag-x': `${dragging ? gesture.offsetX : 0}px`,
                  '--drag-y': `${dragging ? gesture.offsetY : 0}px`,
                } as CSSProperties
                return (
                  <button
                    key={index}
                    type="button"
                    role="gridcell"
                    draggable={false}
                    style={tileStyle}
                    className={`${css.matchTile} ${css[`tile_${tile.ecology}`]} ${selectedTile === index ? css.matchTileSelected : ''} ${dragging ? css.matchTileDragging : ''} ${tile.special !== 'none' ? css.matchTileSpecial : ''} ${swapMotionClass(index, swapMotion)}`}
                    aria-label={tileLabel(tile, index, props.t)}
                    disabled={locked}
                    onClick={() => {
                      if (suppressClick.current) {
                        suppressClick.current = false
                        return
                      }
                      select(index)
                    }}
                    onDragStart={(event) => { event.preventDefault() }}
                    onPointerDown={(event) => {
                      if (locked) return
                      event.currentTarget.setPointerCapture(event.pointerId)
                      setGesture({ index, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, offsetX: 0, offsetY: 0 })
                    }}
                    onPointerMove={(event) => {
                      if (gesture?.pointerId !== event.pointerId) return
                      event.preventDefault()
                      moveGesture(index, event.clientX, event.clientY, event.currentTarget.clientWidth)
                    }}
                    onPointerUp={(event) => {
                      if (gesture?.pointerId !== event.pointerId) return
                      if (Math.max(Math.abs(gesture.offsetX), Math.abs(gesture.offsetY)) > 6) {
                        suppressClick.current = true
                        window.setTimeout(() => { suppressClick.current = false }, 250)
                      }
                      setGesture(undefined)
                    }}
                    onPointerCancel={() => { setGesture(undefined) }}
                  >
                    <span aria-hidden="true">{TILE_SYMBOLS[tile.ecology]}</span>
                    {tile.special !== 'none' && <b aria-hidden="true">{tile.special === 'origin' ? '◎' : tile.special === 'burst' ? '✣' : tile.special === 'row' ? '↔' : '↕'}</b>}
                  </button>
                )
              })}
            </div>
            <p className={css.boardHelp}>{props.t('boardHelp')}</p>
          </div>

          <div className={`${css.capturePanel} ${captureReady ? css.capturePanelReady : ''}`}>
            <div>
              <strong>{props.t('capture')}</strong>
              <span>{captureReady ? props.t('captureReady') : props.t('captureLocked')}</span>
            </div>
            {availableCores.length === 0 && <p>{props.t('noCores')}</p>}
            <div className={css.captureButtons}>
              {availableCores.map(quality => (
                <button
                  key={quality}
                  type="button"
                  className={css[`core_${quality}`]}
                  disabled={locked || !captureReady}
                  onClick={() => { void props.act({ type: 'capture', quality }) }}
                  aria-label={`${props.t(CORE_KEYS[quality])} · ${props.state.cores[quality]}`}
                >
                  <i /><span>{props.t(CORE_KEYS[quality])}</span><b>{props.state.cores[quality]}</b>
                </button>
              ))}
            </div>
          </div>

          <div className={css.battleFooterArea}>
            <p>{props.t('battleHint')}</p>
            <ol className={css.battleLog}>{latestLog.map((row, index) => (
              <li key={`${row.turn}-${row.kind}-${index}`}>{battleLogText(row, props.t, props.zh)}</li>
            ))}</ol>
          </div>
        </div>
      </section>
    </div>
  )
}
