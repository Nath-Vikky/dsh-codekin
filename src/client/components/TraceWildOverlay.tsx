import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import {
  CAPTURE_CORE_QUALITIES,
  CREATURE_CATALOG,
  STARTER_CREATURE_IDS,
  creatureById,
} from '../../core/catalog.ts'
import {
  CORE_CAPTURE_POWER,
  MATERIAL_XP,
  MAX_MAP_ENCOUNTERS,
  MAX_PLAYER_LEVEL,
  captureChance,
  playerStats,
  totalXpForLevel,
  xpToNextLevel,
} from '../../core/balance.ts'
import { areAdjacentTiles } from '../../core/match3.ts'
import { skillByCreatureId } from '../../core/skills.ts'
import { MAX_TOWER_FLOOR, towerFloorProfile } from '../../core/tower.ts'
import type {
  CaptureCoreQuality,
  CreatureDefinition,
  EnemyIntent,
  MatchDamageEffectiveness,
  MatchTile,
  TraceEcology,
  TraceLogEntry,
  TraceWildAction,
  TraceWildActionResponse,
  TraceWildSnapshot,
} from '../../core/types.ts'
import { TraceWildConnectionError, createTraceWildConnection } from '../bridge.ts'
import type { TraceWildLocaleKey } from '../locales.ts'
import css from './tracewild.module.css'

type Tab = 'map' | 'tower' | 'squad' | 'dex' | 'inventory'

interface WindowPosition {
  x: number
  y: number
}

interface WindowDragState extends WindowPosition {
  pointerId: number
  startX: number
  startY: number
  width: number
  height: number
}

const TAB_ICONS: Readonly<Record<Tab, string>> = {
  map: '◌',
  tower: '⌁',
  squad: '◇',
  dex: '⊞',
  inventory: '⋮',
}

function clampWindowPosition(x: number, y: number, width: number, height: number): WindowPosition {
  const margin = 8
  // A narrow DSH viewport may not have enough room for the whole portrait
  // window beside the conversation. Keep a generous title-bar strip visible
  // instead, so the game can be parked at either edge and always recovered.
  const visibleGrabStrip = Math.min(104, width)
  const horizontalTravel = Math.max(0, (window.innerWidth + width) / 2 - visibleGrabStrip - margin)
  const verticalTravel = Math.max(0, (window.innerHeight - height) / 2 - margin)
  return {
    x: Math.max(-horizontalTravel, Math.min(horizontalTravel, x)),
    y: Math.max(-verticalTravel, Math.min(verticalTravel, y)),
  }
}

function clampFloatingPosition(x: number, y: number, width: number, height: number): WindowPosition {
  const margin = 8
  return {
    x: Math.max(margin, Math.min(window.innerWidth - width - margin, x)),
    y: Math.max(margin, Math.min(window.innerHeight - height - margin, y)),
  }
}

type AcquiredItem =
  | { kind: 'core'; quality: CaptureCoreQuality; quantity: number }
  | { kind: 'material'; quality: CaptureCoreQuality; quantity: number }
  | { kind: 'creature'; creatureId: string; quality: CaptureCoreQuality; quantity: 1 }

type BattleTransitionKind = 'tower-cleared' | 'wild-defeated' | 'capture-success' | 'capture-failed' | 'battle-lost'

interface BattleTransition {
  key: number
  kind: BattleTransitionKind
}

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
      src={`/api/tracewild/assets/sprites/${props.creature.id}.webp?v=soft-chibi-v3`}
      alt=""
      draggable={false}
    />
  )
}

function creatureName(creature: CreatureDefinition, zh: boolean): string {
  return zh ? creature.nameZh : creature.nameEn
}

function encounterTimeLabel(t: TraceWildOverlayProps['t'], expiresAt: number, now: number): string {
  if (!Number.isFinite(expiresAt) || !Number.isFinite(now)) return t('encounterResident')
  const minutes = Math.max(0, Math.ceil((expiresAt - now) / 60_000))
  if (minutes <= 1) return t('encounterLeavingSoon')
  if (minutes < 60) return t('encounterLeavesMinutes', { count: minutes })
  const hours = Math.ceil(minutes / 60)
  if (hours < 24) return t('encounterLeavesHours', { count: hours })
  return t('encounterLeavesDays', { count: Math.ceil(hours / 24) })
}

function coreItemName(t: TraceWildOverlayProps['t'], quality: CaptureCoreQuality): string {
  return t('captureCoreItem', { quality: t(CORE_KEYS[quality]) })
}

function materialItemName(t: TraceWildOverlayProps['t'], quality: CaptureCoreQuality): string {
  return t('growthMaterialItem', { quality: t(CORE_KEYS[quality]) })
}

function acquiredItemsBetween(
  previous: TraceWildSnapshot['state'],
  current: TraceWildSnapshot['state'],
): AcquiredItem[] {
  const items: AcquiredItem[] = []
  for (const quality of CAPTURE_CORE_QUALITIES) {
    const cores = current.cores[quality] - previous.cores[quality]
    if (cores > 0) items.push({ kind: 'core', quality, quantity: cores })
    const materials = current.materials[quality] - previous.materials[quality]
    if (materials > 0) items.push({ kind: 'material', quality, quantity: materials })
  }
  const previousCreatures = new Set(previous.creatures.map(creature => creature.instanceId))
  for (const creature of current.creatures) {
    if (!previousCreatures.has(creature.instanceId)) {
      items.push({ kind: 'creature', creatureId: creature.creatureId, quality: creature.quality, quantity: 1 })
    }
  }
  return items
}

function idleRewardItems(reward: NonNullable<TraceWildSnapshot['state']['idle']['pendingReward']>): AcquiredItem[] {
  const items: AcquiredItem[] = []
  if (reward.coreQuality !== undefined) items.push({ kind: 'core', quality: reward.coreQuality, quantity: 1 })
  for (const quality of CAPTURE_CORE_QUALITIES) {
    const quantity = reward.materials[quality]
    if (quantity > 0) items.push({ kind: 'material', quality, quantity })
  }
  return items
}

function RewardItemTile(props: {
  item: AcquiredItem
  t: TraceWildOverlayProps['t']
  zh: boolean
  compact?: boolean
}) {
  const creature = props.item.kind === 'creature' ? creatureById(props.item.creatureId) : undefined
  const name = props.item.kind === 'core'
    ? coreItemName(props.t, props.item.quality)
    : props.item.kind === 'material'
      ? materialItemName(props.t, props.item.quality)
      : creature === undefined ? props.item.creatureId : creatureName(creature, props.zh)
  const description = props.item.kind === 'core'
    ? props.t('captureCoreDescription', { power: CORE_CAPTURE_POWER[props.item.quality].toFixed(2) })
    : props.item.kind === 'material'
      ? props.t('growthMaterialDescription', { xp: MATERIAL_XP[props.item.quality] })
      : props.t('creatureItemDescription', {
          quality: props.t(CORE_KEYS[props.item.quality]),
          ecology: creature === undefined ? '—' : props.t(ECOLOGY_KEYS[creature.ecology]),
        })
  return (
    <span
      className={`${css.rewardItem} ${props.compact ? css.rewardItemCompact : ''} ${css[`core_${props.item.quality}`]}`}
      {...(props.compact ? {} : { tabIndex: 0 })}
      aria-label={`${name} × ${props.item.quantity}. ${description}`}
    >
      {props.item.kind === 'core' && (
        <span className={`${css.bigCore} ${css[`core_${props.item.quality}`]}`} aria-hidden="true" />
      )}
      {props.item.kind === 'material' && <span className={css.materialShard} aria-hidden="true" />}
      {creature !== undefined && <CreatureSprite creature={creature} size={props.compact ? 'tiny' : 'small'} />}
      <strong>{name}</strong>
      <b>×{props.item.quantity}</b>
      {!props.compact && (
        <span className={css.itemTooltip} role="tooltip">
          <strong>{name}</strong>
          <small>{description}</small>
        </span>
      )}
    </span>
  )
}

function IdleRewardButton(props: {
  reward: NonNullable<TraceWildSnapshot['state']['idle']['pendingReward']>
  t: TraceWildOverlayProps['t']
  zh: boolean
  busy: boolean
  floating?: boolean
  claim: () => void
}) {
  return (
    <button
      type="button"
      className={`${css.idleClaimButton} ${props.floating ? css.idleClaimFloating : ''}`}
      disabled={props.busy}
      onClick={props.claim}
      aria-label={props.t('claimIdleReward')}
    >
      <span className={css.rewardCrate} aria-hidden="true" />
      <span className={css.idleClaimPulse} aria-hidden="true" />
      <span className={css.idleClaimTooltip} role="tooltip">
        <strong>{props.t('idleRewardReady')}</strong>
        <small>{props.t('idleRewardMinutes', { minutes: props.reward.elapsedMinutes })}</small>
        <span>
          {idleRewardItems(props.reward).map((item, index) => (
            <RewardItemTile key={`${item.kind}-${item.quality}-${index}`} item={item} t={props.t} zh={props.zh} compact />
          ))}
        </span>
      </span>
    </button>
  )
}

function AcquiredItemsModal(props: {
  items: readonly AcquiredItem[]
  t: TraceWildOverlayProps['t']
  zh: boolean
  dismiss: () => void
}) {
  return (
    <div
      className={css.rewardBackdrop}
      onClick={(event) => { if (event.target === event.currentTarget) props.dismiss() }}
    >
      <section className={css.rewardModal} role="dialog" aria-modal="true" aria-labelledby="tracewild-reward-title">
        <span className={css.rewardHalo} aria-hidden="true" />
        <p>{props.t('rewardKicker')}</p>
        <h2 id="tracewild-reward-title">{props.t('rewardTitle')}</h2>
        <div className={css.rewardItems}>
          {props.items.map((item, index) => (
            <RewardItemTile key={`${item.kind}-${item.quality}-${item.kind === 'creature' ? item.creatureId : index}`} item={item} t={props.t} zh={props.zh} />
          ))}
        </div>
        <small>{props.t('rewardDismiss')}</small>
      </section>
    </div>
  )
}

function ReleaseCreatureModal(props: {
  captured: TraceWildSnapshot['state']['creatures'][number]
  creature: CreatureDefinition
  t: TraceWildOverlayProps['t']
  zh: boolean
  busy: boolean
  dismiss: () => void
  confirm: () => void
}) {
  return (
    <div
      className={css.modalBackdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !props.busy) props.dismiss()
      }}
    >
      <section
        className={css.releaseModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="codekin-release-title"
        onMouseDown={(event) => { event.stopPropagation() }}
      >
        <header>
          <CreatureSprite creature={props.creature} size="medium" />
          <div>
            <p>RELEASE</p>
            <h2 id="codekin-release-title">{props.t('releaseConfirmTitle')}</h2>
            <strong>{creatureName(props.creature, props.zh)}</strong>
          </div>
        </header>
        <p>{props.t('releaseConfirmBody', { name: creatureName(props.creature, props.zh) })}</p>
        <div className={css.releaseReward}>
          <span>{props.t('releaseReward')}</span>
          <RewardItemTile
            item={{ kind: 'material', quality: props.captured.quality, quantity: 1 }}
            t={props.t}
            zh={props.zh}
            compact
          />
          <small>+{MATERIAL_XP[props.captured.quality]} EXP</small>
        </div>
        <div className={css.releaseActions}>
          <button type="button" disabled={props.busy} onClick={props.dismiss}>{props.t('releaseCancel')}</button>
          <button type="button" className={css.releaseDanger} disabled={props.busy} onClick={props.confirm}>
            {props.t('releaseConfirm')}
          </button>
        </div>
      </section>
    </div>
  )
}

function percent(value: number, max: number): number {
  return max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100))
}

function visibleCaptureChance(state: TraceWildSnapshot['state'], quality: CaptureCoreQuality): number {
  const battle = state.battle
  const encounter = battle === undefined ? undefined : state.encounters.find(row => row.id === battle.encounterId)
  const wild = encounter === undefined ? undefined : creatureById(encounter.creatureId)
  if (battle === undefined || encounter === undefined || wild === undefined) return 0
  const partyAverageLevel = battle.party.length === 0
    ? 1
    : battle.party.reduce((sum, member) => sum + member.level, 0) / battle.party.length
  return captureChance({
    rarity: wild.rarity,
    baseCaptureRate: wild.baseCaptureRate,
    wildQuality: encounter.quality,
    coreQuality: quality,
    healthRatio: battle.wildHp / battle.wildMaxHp,
    partyAverageLevel,
    wildLevel: encounter.level,
    priorFailures: encounter.captureAttempts,
  })
}

function logText(
  entry: TraceLogEntry,
  t: TraceWildOverlayProps['t'],
  zh: boolean,
): string {
  const key: TraceWildLocaleKey = entry.kind === 'core-drop'
    ? 'logCore'
    : entry.kind === 'material-drop'
      ? 'logMaterial'
      : entry.kind === 'idle-reward'
        ? 'logIdle'
    : entry.kind === 'encounter'
      ? 'logEncounter'
      : entry.kind === 'capture'
        ? 'logCapture'
      : entry.kind === 'starter'
        ? 'logStarter'
        : entry.kind === 'wild-defeat'
          ? 'wildDefeated'
          : entry.kind === 'tower-clear'
            ? 'towerLog'
        : entry.kind === 'release'
          ? 'logRelease'
          : 'logDefeat'
  const creature = entry.creatureId === undefined ? undefined : creatureById(entry.creatureId)
  const suffix = creature === undefined ? '' : ` · ${creatureName(creature, zh)}`
  const quality = entry.quality === undefined ? '' : ` · ${t(CORE_KEYS[entry.quality])}`
  return `${t(key)}${suffix}${quality}`
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
  const [windowPosition, setWindowPosition] = useState<WindowPosition>({ x: 0, y: 0 })
  const [draggingWindow, setDraggingWindow] = useState(false)
  const [launcherPosition, setLauncherPosition] = useState<WindowPosition>()
  const [draggingLauncher, setDraggingLauncher] = useState(false)
  const [squadDraft, setSquadDraft] = useState<string[]>([])
  const [growthTarget, setGrowthTarget] = useState<string>()
  const [rewardQueue, setRewardQueue] = useState<AcquiredItem[][]>([])
  const [releaseCandidate, setReleaseCandidate] = useState<string>()
  const [battleTransition, setBattleTransition] = useState<BattleTransition>()
  const latestSnapshot = useRef<TraceWildSnapshot>()
  const actionInFlight = useRef(false)
  const pendingSnapshot = useRef<TraceWildSnapshot>()
  const overlayElement = useRef<HTMLElement>(null)
  const windowDrag = useRef<WindowDragState>()
  const launcherElement = useRef<HTMLButtonElement>(null)
  const launcherDrag = useRef<WindowDragState>()
  const launcherWasDragged = useRef(false)
  const pulseTimer = useRef<number>()
  const zh = t('title') === '码灵'

  const adoptSnapshot = useCallback((value: TraceWildSnapshot): void => {
    const previous = latestSnapshot.current
    const sameProfile = previous !== undefined && value.state.createdAt === previous.state.createdAt
    if (sameProfile && value.state.revision < previous.state.revision) return
    if (previous !== undefined && !sameProfile) setRewardQueue([])
    if (sameProfile && value.state.revision > previous.state.revision) {
      const acquired = acquiredItemsBetween(previous.state, value.state)
      if (acquired.length > 0) setRewardQueue(queue => [...queue, acquired].slice(-8))
      if (value.state.encounters.length > previous.state.encounters.length) {
        setPulse(true)
        if (pulseTimer.current !== undefined) window.clearTimeout(pulseTimer.current)
        pulseTimer.current = window.setTimeout(() => {
          pulseTimer.current = undefined
          setPulse(false)
        }, 1800)
      }
    }
    latestSnapshot.current = value
    setSnapshot(value)
  }, [])

  const refresh = useCallback(async (signal?: AbortSignal) => {
    try {
      adoptSnapshot(await connection.load(signal))
      setOnline(true)
    } catch {
      if (signal?.aborted !== true) setOnline(false)
    }
  }, [adoptSnapshot, connection])

  useEffect(() => {
    const controller = new AbortController()
    void refresh(controller.signal)
    const unsubscribe = connection.subscribe((value) => {
      if (actionInFlight.current) {
        pendingSnapshot.current = value
        return
      }
      adoptSnapshot(value)
    }, setOnline)
    return () => {
      controller.abort()
      unsubscribe()
    }
  }, [adoptSnapshot, connection, refresh])

  useEffect(() => () => {
    if (pulseTimer.current !== undefined) window.clearTimeout(pulseTimer.current)
  }, [])

  useEffect(() => {
    if (snapshot !== undefined) setSquadDraft([...snapshot.state.squad])
  }, [snapshot?.state.revision])

  useEffect(() => {
    if (snapshot === undefined) return
    setGrowthTarget(current => snapshot.state.creatures.some(creature => creature.instanceId === current)
      ? current
      : snapshot.state.creatures[0]?.instanceId)
  }, [snapshot?.state.createdAt, snapshot?.state.revision])

  useEffect(() => {
    if (releaseCandidate === undefined) return
    if (snapshot?.state.creatures.some(creature => creature.instanceId === releaseCandidate) !== true) {
      setReleaseCandidate(undefined)
    }
  }, [releaseCandidate, snapshot?.state.revision])

  useEffect(() => {
    if (notice === undefined) return
    const timer = window.setTimeout(() => { setNotice(undefined) }, 2_800)
    return () => { window.clearTimeout(timer) }
  }, [notice])

  useEffect(() => {
    if (!open) return
    void refresh()
  }, [open, refresh])

  useEffect(() => {
    if (snapshot === undefined || snapshot.state.idle.pendingReward !== undefined) return
    const eligibleAt = snapshot.state.idle.lastSettlementAt + 60 * 60 * 1000
    const delay = Math.max(1_000, eligibleAt - snapshot.serverTime)
    const timer = window.setTimeout(() => { void refresh() }, delay)
    return () => { window.clearTimeout(timer) }
  }, [refresh, snapshot?.serverTime, snapshot?.state.idle.lastSettlementAt, snapshot?.state.idle.pendingReward])

  useEffect(() => {
    if (!open || snapshot === undefined) return
    const activeEncounterId = snapshot.state.battle?.mode === 'wild'
      ? snapshot.state.battle.encounterId
      : undefined
    const nextExpiry = snapshot.state.encounters
      .filter(encounter => encounter.id !== activeEncounterId)
      .reduce<number | undefined>((earliest, encounter) => (
        earliest === undefined ? encounter.expiresAt : Math.min(earliest, encounter.expiresAt)
      ), undefined)
    if (nextExpiry === undefined) return
    const delay = Math.max(250, nextExpiry - snapshot.serverTime + 100)
    const timer = window.setTimeout(() => { void refresh() }, delay)
    return () => { window.clearTimeout(timer) }
  }, [open, refresh, snapshot?.serverTime, snapshot?.state.revision])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return
      if (rewardQueue.length > 0) setRewardQueue(queue => queue.slice(1))
      else if (releaseCandidate !== undefined) setReleaseCandidate(undefined)
      else if (snapshot?.state.battle === undefined) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  }, [open, releaseCandidate, rewardQueue.length, snapshot?.state.battle])

  useEffect(() => {
    const clampCurrentPosition = (): void => {
      const rect = overlayElement.current?.getBoundingClientRect()
      if (rect !== undefined) {
        setWindowPosition(position => clampWindowPosition(position.x, position.y, rect.width, rect.height))
      }
      const launcherRect = launcherElement.current?.getBoundingClientRect()
      if (launcherRect !== undefined) {
        setLauncherPosition(position => position === undefined
          ? undefined
          : clampFloatingPosition(position.x, position.y, launcherRect.width, launcherRect.height))
      }
    }
    window.addEventListener('resize', clampCurrentPosition)
    return () => { window.removeEventListener('resize', clampCurrentPosition) }
  }, [])

  const beginWindowDrag = (event: ReactPointerEvent<HTMLElement>): void => {
    if (event.button !== 0 || (event.target as HTMLElement).closest('button') !== null) return
    const rect = overlayElement.current?.getBoundingClientRect()
    if (rect === undefined) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    windowDrag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: windowPosition.x,
      y: windowPosition.y,
      width: rect.width,
      height: rect.height,
    }
    setDraggingWindow(true)
  }

  const moveWindowDrag = (event: ReactPointerEvent<HTMLElement>): void => {
    const drag = windowDrag.current
    if (drag === undefined || drag.pointerId !== event.pointerId) return
    event.preventDefault()
    setWindowPosition(clampWindowPosition(
      drag.x + event.clientX - drag.startX,
      drag.y + event.clientY - drag.startY,
      drag.width,
      drag.height,
    ))
  }

  const finishWindowDrag = (event: ReactPointerEvent<HTMLElement>): void => {
    if (windowDrag.current?.pointerId !== event.pointerId) return
    windowDrag.current = undefined
    setDraggingWindow(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const beginLauncherDrag = (event: ReactPointerEvent<HTMLButtonElement>): void => {
    if (event.button !== 0) return
    const rect = event.currentTarget.getBoundingClientRect()
    launcherWasDragged.current = false
    event.currentTarget.setPointerCapture(event.pointerId)
    launcherDrag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    }
    setDraggingLauncher(true)
  }

  const moveLauncherDrag = (event: ReactPointerEvent<HTMLButtonElement>): void => {
    const drag = launcherDrag.current
    if (drag === undefined || drag.pointerId !== event.pointerId) return
    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY
    if (Math.hypot(deltaX, deltaY) > 4) launcherWasDragged.current = true
    if (!launcherWasDragged.current) return
    event.preventDefault()
    setLauncherPosition(clampFloatingPosition(
      drag.x + deltaX,
      drag.y + deltaY,
      drag.width,
      drag.height,
    ))
  }

  const finishLauncherDrag = (event: ReactPointerEvent<HTMLButtonElement>): void => {
    if (launcherDrag.current?.pointerId !== event.pointerId) return
    launcherDrag.current = undefined
    setDraggingLauncher(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const act = useCallback(async (action: TraceWildAction): Promise<TraceWildActionResponse | undefined> => {
    if (busy || actionInFlight.current) return undefined
    actionInFlight.current = true
    setBusy(true)
    setNotice(undefined)
    try {
      const response = await connection.act(action)
      const transitionKind = response.notice === 'tower-cleared'
        || response.notice === 'wild-defeated'
        || response.notice === 'capture-success'
        || response.notice === 'capture-failed'
        || response.notice === 'battle-lost'
        ? response.notice
        : undefined
      if (transitionKind !== undefined && latestSnapshot.current?.state.battle !== undefined) {
        setBattleTransition({ key: Date.now(), kind: transitionKind })
        await new Promise<void>(resolve => {
          window.setTimeout(resolve, transitionKind === 'capture-failed' ? 720 : 1_080)
        })
      }
      adoptSnapshot(response)
      setBattleTransition(undefined)
      setOnline(true)
      if (response.notice === 'capture-success') setNotice(t('captured'))
      if (response.notice === 'capture-failed') setNotice(t('captureFailed'))
      if (response.notice === 'battle-lost') setNotice(t('battleLost'))
      if (response.notice === 'wild-defeated') setNotice(t('wildDefeated'))
      if (response.notice === 'tower-cleared') setNotice(t('towerCleared'))
      if (response.notice === 'skill-cast') setNotice(t('skillReleased'))
      if (response.notice === 'material-used') setNotice(t('materialUsed'))
      if (response.notice === 'idle-claimed') setNotice(t('idleClaimed'))
      if (response.notice === 'creature-released') setNotice(t('released'))
      return response
    } catch (error) {
      setBattleTransition(undefined)
      if (error instanceof TraceWildConnectionError && error.code === 'invalid-action') {
        setNotice(action.type === 'claim-idle-reward' ? t('rewardUnavailable') : t('invalidSwap'))
      } else {
        setNotice(error instanceof TraceWildConnectionError && error.code === 'conflict'
          ? t('invalidSwap')
          : t('disconnected'))
        await refresh()
      }
    } finally {
      actionInFlight.current = false
      const pending = pendingSnapshot.current
      pendingSnapshot.current = undefined
      if (pending !== undefined) adoptSnapshot(pending)
      setBusy(false)
    }
    return undefined
  }, [adoptSnapshot, busy, connection, refresh, t])

  const state = snapshot?.state
  const uncaught = state?.encounters.length ?? 0
  const pendingIdleReward = state?.idle.pendingReward
  const claimIdleReward = (): void => {
    setOpen(true)
    void act({ type: 'claim-idle-reward' })
  }

  if (state?.enabled === false) return null

  const launcher = (
    <button
      ref={launcherElement}
      type="button"
      className={`${css.launcher} ${pendingIdleReward !== undefined ? css.launcherReward : ''} ${draggingLauncher ? css.launcherDragging : ''} ${pulse ? css.launcherPulse : ''}`}
      style={launcherPosition === undefined ? undefined : { left: launcherPosition.x, top: launcherPosition.y, right: 'auto', bottom: 'auto' }}
      onClick={() => {
        if (launcherWasDragged.current) {
          launcherWasDragged.current = false
          return
        }
        setOpen(true)
        setPulse(false)
      }}
      onDragStart={(event) => { event.preventDefault() }}
      onPointerDown={beginLauncherDrag}
      onPointerMove={moveLauncherDrag}
      onPointerUp={finishLauncherDrag}
      onPointerCancel={finishLauncherDrag}
      title={`${pendingIdleReward !== undefined ? t('idleRewardReady') : t('open')} · ${t('dragLauncher')}`}
      aria-label={pendingIdleReward !== undefined ? `${t('open')} · ${t('idleRewardReady')}` : t('open')}
      aria-expanded={false}
    >
      {pendingIdleReward === undefined
        ? <img
            className={css.launcherAvatar}
            src="/api/tracewild/assets/sprites/codekin-launcher-v1.webp"
            alt=""
            aria-hidden="true"
            draggable={false}
          />
        : <span className={css.launcherGift} aria-hidden="true"><i /></span>}
      {uncaught > 0 && <span className={css.badge}>{uncaught > 99 ? '99+' : uncaught}</span>}
    </button>
  )

  if (!open) {
    return launcher
  }

  return (
    <section
        ref={overlayElement}
        className={`${css.overlay} ${draggingWindow ? css.overlayDragging : ''} ${windowPosition.x > 140 ? css.overlayDockedRight : ''}`}
        style={{ '--window-x': `${windowPosition.x}px`, '--window-y': `${windowPosition.y}px` } as CSSProperties}
        aria-label={t('title')}
      >
        <button type="button" className={css.windowClose} onClick={() => { setOpen(false) }} title={t('close')} aria-label={t('close')}>
          <span aria-hidden="true">×</span>
        </button>
        <header
          className={css.header}
          title={t('dragWindow')}
          onDoubleClick={(event) => {
            if ((event.target as HTMLElement).closest('button') === null) setWindowPosition({ x: 0, y: 0 })
          }}
          onPointerDown={beginWindowDrag}
          onPointerMove={moveWindowDrag}
          onPointerUp={finishWindowDrag}
          onPointerCancel={finishWindowDrag}
        >
          <div className={css.brand}>
            <span className={css.logoCore} aria-hidden="true" />
            <div>
              <h1>{t('title')}</h1>
              <p>{t('subtitle')}</p>
            </div>
          </div>
          <span className={css.dragHandle} aria-hidden="true"><i /><i /><i /><i /><i /></span>
          <div className={css.headerStats}>
            {pendingIdleReward !== undefined && (
              <IdleRewardButton reward={pendingIdleReward} t={t} zh={zh} busy={busy} claim={claimIdleReward} />
            )}
            {CAPTURE_CORE_QUALITIES.map(quality => (
              <span
                key={quality}
                className={`${css.miniCore} ${css[`core_${quality}`]}`}
                title={`${coreItemName(t, quality)} · ${t('captureCoreDescription', { power: CORE_CAPTURE_POWER[quality].toFixed(2) })}`}
              >
                {state?.cores[quality] ?? 0}
              </span>
            ))}
            <span className={online ? css.online : css.offline}>{online ? 'LIVE' : 'OFFLINE'}</span>
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
                {(['map', 'tower', 'squad', 'dex', 'inventory'] as const).map(id => (
                  <button
                    key={id}
                    type="button"
                    data-tab={id}
                    className={tab === id ? css.tabActive : ''}
                    onClick={() => { setTab(id) }}
                  >
                    <span aria-hidden="true">{TAB_ICONS[id]}</span>
                    <small>{id === 'tower' ? t('towerTitle') : t(id)}</small>
                  </button>
                ))}
              </nav>
              <main className={css.content}>
                {tab === 'map' && (
                  <MapView
                    state={state}
                    serverTime={snapshot?.serverTime ?? state.updatedAt}
                    t={t}
                    zh={zh}
                    busy={busy}
                    start={encounterId => act({ type: 'start-battle', encounterId })}
                  />
                )}
                {tab === 'tower' && (
                  <TowerView
                    state={state}
                    t={t}
                    zh={zh}
                    busy={busy}
                    start={() => act({ type: 'start-tower' })}
                  />
                )}
                {tab === 'squad' && (
                  <SquadView
                    state={state}
                    t={t}
                    zh={zh}
                    draft={squadDraft}
                    setDraft={setSquadDraft}
                    busy={busy}
                    save={() => act({ type: 'set-squad', instanceIds: squadDraft })}
                    release={setReleaseCandidate}
                  />
                )}
                {tab === 'dex' && <DexView state={state} t={t} zh={zh} />}
                {tab === 'inventory' && (
                  <InventoryView
                    state={state}
                    t={t}
                    zh={zh}
                    busy={busy}
                    act={act}
                    growthTarget={growthTarget}
                    setGrowthTarget={setGrowthTarget}
                  />
                )}
              </main>
              <footer className={css.footer}>{t('privacy')}</footer>
              {state.battle !== undefined && (
                <BattleView
                  state={state}
                  t={t}
                  zh={zh}
                  busy={busy}
                  act={act}
                  transition={battleTransition}
                />
              )}
              {notice !== undefined && <div className={css.toast} role="status">{notice}</div>}
              {rewardQueue[0] !== undefined && (
                <AcquiredItemsModal
                  items={rewardQueue[0]}
                  t={t}
                  zh={zh}
                  dismiss={() => { setRewardQueue(queue => queue.slice(1)) }}
                />
              )}
              {releaseCandidate !== undefined && (() => {
                const captured = state.creatures.find(row => row.instanceId === releaseCandidate)
                const creature = captured === undefined ? undefined : creatureById(captured.creatureId)
                if (captured === undefined || creature === undefined) return null
                return (
                  <ReleaseCreatureModal
                    captured={captured}
                    creature={creature}
                    t={t}
                    zh={zh}
                    busy={busy}
                    dismiss={() => { setReleaseCandidate(undefined) }}
                    confirm={() => {
                      void act({ type: 'release-creature', creatureInstanceId: captured.instanceId }).then((response) => {
                        if (response !== undefined) setReleaseCandidate(undefined)
                      })
                    }}
                  />
                )
              })()}
            </>
          )}
      </section>
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
  serverTime: number
  t: TraceWildOverlayProps['t']
  zh: boolean
  busy: boolean
  start: (encounterId: string) => void
}) {
  const [clock, setClock] = useState(props.serverTime)
  useEffect(() => {
    const startedAt = Date.now()
    setClock(props.serverTime)
    const timer = window.setInterval(() => {
      setClock(props.serverTime + Math.max(0, Date.now() - startedAt))
    }, 30_000)
    return () => { window.clearInterval(timer) }
  }, [props.serverTime])

  return (
    <div className={css.mapFrame}>
      <header className={css.mapIntro}>
        <div>
          <span>{props.t('mapKicker')}</span>
          <h2>{props.t('map')}</h2>
          <p>{props.t('mapSignalCount', { count: props.state.encounters.length, max: MAX_MAP_ENCOUNTERS })}</p>
        </div>
        <div className={css.mapRadar} aria-hidden="true"><i /><i /><i /><b /></div>
      </header>
      <div className={css.worldMap}>
        <div className={css.mapAtmosphere} aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className={css.mapRoutes} aria-hidden="true"><i /><i /><i /><i /></div>
        {(Object.keys(ECOLOGY_KEYS) as TraceEcology[]).map(ecology => (
          <div key={ecology} className={`${css.regionLabel} ${css[`region_${ecology}`]}`}>
            {props.t(ECOLOGY_KEYS[ecology])}
          </div>
        ))}
        {props.state.encounters.map((encounter) => {
          const creature = creatureById(encounter.creatureId)
          if (creature === undefined) return null
          const special = encounter.enhanced
            || creature.rarity === 'rare'
            || creature.rarity === 'apex'
            || encounter.quality === 'nova'
            || encounter.quality === 'origin'
          const remaining = encounterTimeLabel(props.t, encounter.expiresAt, clock)
          return (
            <button
              key={encounter.id}
              type="button"
              className={`${css.encounter} ${encounter.enhanced ? css.encounterEnhanced : ''}`}
              style={{ left: `${encounter.mapX}%`, top: `${encounter.mapY}%` }}
              data-special={special ? 'true' : undefined}
              disabled={props.busy || !props.state.starterChosen}
              onClick={() => { props.start(encounter.id) }}
              title={`${creatureName(creature, props.zh)} · Lv.${encounter.level} · ${props.t(CORE_KEYS[encounter.quality])} · ${remaining}`}
            >
              <i className={css.encounterPulse} aria-hidden="true" />
              <span className={`${css.encounterAvatar} ${special ? css.encounterSpecial : ''} ${special ? css[`encounterRing_${encounter.quality}`] : ''}`}>
                <CreatureSprite creature={creature} size="small" />
              </span>
              <span className={css.encounterName}>{creatureName(creature, props.zh)}</span>
              <small className={css.encounterMeta}>Lv.{encounter.level} · {remaining}</small>
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

function TowerView(props: {
  state: TraceWildSnapshot['state']
  t: TraceWildOverlayProps['t']
  zh: boolean
  busy: boolean
  start: () => void
}) {
  const towerState = props.state.tower ?? { highestClearedFloor: 0, attempts: 0, clears: 0 }
  const towerComplete = towerState.highestClearedFloor >= MAX_TOWER_FLOOR
  const tower = towerFloorProfile(Math.min(MAX_TOWER_FLOOR, towerState.highestClearedFloor + 1))
  const towerBoss = creatureById(tower.creatureId)!
  const routeStart = Math.max(1, tower.floor - 2)
  const routeFloors = Array.from({ length: 5 }, (_, index) => Math.min(MAX_TOWER_FLOOR, routeStart + index))
    .filter((floor, index, rows) => rows.indexOf(floor) === index)
  return (
    <div className={`${css.panelPage} ${css.towerPage}`}>
      <header className={css.towerHeading}>
        <div>
          <span>{props.t('towerKicker')}</span>
          <h2>{props.t('towerTitle')}</h2>
          <p>{props.t('towerIntro')}</p>
        </div>
        <strong>{String(tower.floor).padStart(3, '0')}</strong>
      </header>

      <section className={css.towerHero}>
        <div className={css.towerMonument} aria-hidden="true">
          <i /><i /><i /><i /><i /><i /><b />
        </div>
        <div className={css.towerBossCard}>
          <span>{props.t('towerCurrentTarget')}</span>
          <CreatureSprite creature={towerBoss} size="large" />
          <div>
            <strong>{creatureName(towerBoss, props.zh)}</strong>
            <small>Lv.{tower.level} · {props.t(CORE_KEYS[tower.quality])}</small>
          </div>
        </div>
        <div className={css.towerBrief}>
          <div>
            <span>{props.t('towerSkillTier', { tier: tower.skillTier })}</span>
            <span>{props.t('towerRewardPreview', {
              count: tower.baseMaterialDrops,
              bonus: tower.milestoneMaterial ? props.t('towerMilestoneReady') : props.t('towerMilestoneHint'),
            })}</span>
          </div>
          <button
            type="button"
            disabled={towerComplete || props.busy || !props.state.starterChosen || props.state.battle !== undefined}
            onClick={props.start}
          >
            <span>{props.t('towerChallenge')}</span>
            <b>↗</b>
          </button>
        </div>
      </section>

      <section className={css.towerMetrics}>
        <article><span>{props.t('towerHighest')}</span><b>{towerState.highestClearedFloor}</b></article>
        <article><span>{props.t('towerAttempts')}</span><b>{towerState.attempts}</b></article>
        <article><span>{props.t('towerClears')}</span><b>{towerState.clears}</b></article>
      </section>

      <section className={css.towerRoute}>
        <header><span>{props.t('towerPath')}</span><small>TRACE / ASCENSION</small></header>
        <div>
          {routeFloors.map((floor) => {
            const profile = towerFloorProfile(floor)
            const cleared = floor <= towerState.highestClearedFloor
            const active = floor === tower.floor
            return (
              <article key={floor} className={`${cleared ? css.towerRouteCleared : ''} ${active ? css.towerRouteActive : ''}`}>
                <i aria-hidden="true" />
                <b>{String(floor).padStart(2, '0')}</b>
                <span>{props.t(CORE_KEYS[profile.quality])}</span>
              </article>
            )
          })}
        </div>
      </section>
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
  release: (instanceId: string) => void
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
          const stats = playerStats(creature.stats, captured.level, captured.quality)
          return (
            <article
              key={captured.instanceId}
              className={`${css.creatureCard} ${position >= 0 ? css.creatureSelected : ''}`}
            >
              {position >= 0 && <span className={css.partyIndex}>{position + 1}</span>}
              <button
                type="button"
                className={css.releaseButton}
                disabled={props.busy || props.state.creatures.length <= 1}
                title={props.state.creatures.length <= 1 ? props.t('releaseLastBlocked') : props.t('releaseCreature')}
                aria-label={`${props.t('releaseCreature')} · ${creatureName(creature, props.zh)}`}
                onClick={() => { props.release(captured.instanceId) }}
              >
                <span aria-hidden="true">↗</span>
              </button>
              <button
                type="button"
                className={css.creatureSelect}
                onClick={() => { toggle(captured.instanceId) }}
              >
                <CreatureSprite creature={creature} size="medium" />
                <strong>{creatureName(creature, props.zh)}</strong>
                <span>{props.t(ECOLOGY_KEYS[creature.ecology])} · {props.t(RARITY_KEYS[creature.rarity])}</span>
                <small>{props.t('level')} {captured.level} · {props.t('quality')} {props.t(CORE_KEYS[captured.quality])} · {props.t('wins')} {captured.wins}</small>
                <span className={css.creatureStats}>
                  <span><b>{stats.hp}</b>{props.t('statRuntime')}</span>
                  <span><b>{stats.attack}</b>{props.t('statCompute')}</span>
                  <span><b>{stats.defense}</b>{props.t('statGuard')}</span>
                  <span><b>{stats.speed}</b>{props.t('statResponse')}</span>
                </span>
              </button>
            </article>
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

function InventoryView(props: {
  state: TraceWildSnapshot['state']
  t: TraceWildOverlayProps['t']
  zh: boolean
  busy: boolean
  act: (action: TraceWildAction) => Promise<TraceWildActionResponse | undefined>
  growthTarget: string | undefined
  setGrowthTarget: (instanceId: string) => void
}) {
  const stats = props.state.stats
  const selectedCaptured = props.state.creatures.find(captured => captured.instanceId === props.growthTarget)
    ?? props.state.creatures[0]
  const selectedCreature = selectedCaptured === undefined ? undefined : creatureById(selectedCaptured.creatureId)
  const selectedLevelBaseXp = selectedCaptured === undefined
    ? 0
    : totalXpForLevel(selectedCaptured.level, selectedCaptured.quality)
  const selectedProgress = selectedCaptured === undefined ? 0 : Math.max(0, selectedCaptured.xp - selectedLevelBaseXp)
  const selectedNeeded = selectedCaptured === undefined || selectedCaptured.level >= MAX_PLAYER_LEVEL
    ? 0
    : xpToNextLevel(selectedCaptured.level, selectedCaptured.quality)
  const selectedProgressPercent = selectedNeeded <= 0 ? 100 : Math.min(100, Math.round(selectedProgress / selectedNeeded * 100))
  return (
    <div className={css.inventoryLayout}>
      <section className={css.inventoryPanel}>
        <h2>{props.t('coreInventory')}</h2>
        <div className={css.coreGrid}>
          {CAPTURE_CORE_QUALITIES.map(quality => (
            <div
              key={quality}
              className={`${css.coreCard} ${css.itemInspectable} ${css[`core_${quality}`]}`}
              tabIndex={0}
              aria-label={`${coreItemName(props.t, quality)}. ${props.t('captureCoreDescription', { power: CORE_CAPTURE_POWER[quality].toFixed(2) })}`}
            >
              <span className={`${css.bigCore} ${css[`core_${quality}`]}`} />
              <strong>{coreItemName(props.t, quality)}</strong>
              <b>× {props.state.cores[quality]}</b>
              <span className={css.itemTooltip} role="tooltip">
                <strong>{coreItemName(props.t, quality)}</strong>
                <small>{props.t('captureCoreDescription', { power: CORE_CAPTURE_POWER[quality].toFixed(2) })}</small>
              </span>
            </div>
          ))}
        </div>
        <h2>{props.t('materialInventory')}</h2>
        <div className={css.coreGrid}>
          {CAPTURE_CORE_QUALITIES.map(quality => (
            <div
              key={quality}
              className={`${css.coreCard} ${css.materialCard} ${css.itemInspectable} ${css[`core_${quality}`]}`}
              tabIndex={0}
              aria-label={`${materialItemName(props.t, quality)}. ${props.t('growthMaterialDescription', { xp: MATERIAL_XP[quality] })}`}
            >
              <span className={`${css.materialShard} ${css[`core_${quality}`]}`} />
              <strong>{materialItemName(props.t, quality)}</strong>
              <small className={css.materialXp}>+{MATERIAL_XP[quality]} EXP</small>
              <b>× {props.state.materials[quality]}</b>
              <span className={css.itemTooltip} role="tooltip">
                <strong>{materialItemName(props.t, quality)}</strong>
                <small>{props.t('growthMaterialDescription', { xp: MATERIAL_XP[quality] })}</small>
              </span>
            </div>
          ))}
        </div>
        <h2>{props.t('growth')}</h2>
        <div className={css.growthWorkbench}>
          <label className={css.growthSelector}>
            <span>{props.t('growthTarget')}</span>
            <select
              value={selectedCaptured?.instanceId ?? ''}
              disabled={props.busy || props.state.creatures.length === 0}
              onChange={(event) => { props.setGrowthTarget(event.currentTarget.value) }}
            >
              {props.state.creatures.map((captured) => {
                const creature = creatureById(captured.creatureId)
                if (creature === undefined) return null
                return (
                  <option key={captured.instanceId} value={captured.instanceId}>
                    {creatureName(creature, props.zh)} · Lv.{captured.level} · {props.t(CORE_KEYS[captured.quality])}
                  </option>
                )
              })}
            </select>
            <small>{props.t('growthTargetHint', { count: props.state.creatures.length })}</small>
          </label>
          {selectedCaptured !== undefined && selectedCreature !== undefined && (
            <article className={css.growthSelected}>
              <div className={css.growthSummary}>
                <CreatureSprite creature={selectedCreature} size="small" />
                <div>
                  <strong>{creatureName(selectedCreature, props.zh)}</strong>
                  <span>
                    {props.t(ECOLOGY_KEYS[selectedCreature.ecology])} · {props.t('quality')} {props.t(CORE_KEYS[selectedCaptured.quality])} · Lv.{selectedCaptured.level}
                  </span>
                  <small>
                    {selectedCaptured.level >= MAX_PLAYER_LEVEL
                      ? props.t('levelCap')
                      : `${props.t('xp')} ${selectedProgress}/${selectedNeeded}`}
                  </small>
                  <div className={css.growthXpTrack} aria-hidden="true">
                    <i style={{ width: `${selectedProgressPercent}%` }} />
                  </div>
                </div>
              </div>
              <div className={css.growthActions}>
                {CAPTURE_CORE_QUALITIES.map(quality => (
                  <button
                    key={quality}
                    type="button"
                    className={css[`core_${quality}`]}
                    disabled={props.busy || selectedCaptured.level >= MAX_PLAYER_LEVEL || props.state.materials[quality] <= 0}
                    onClick={() => { void props.act({ type: 'feed-material', creatureInstanceId: selectedCaptured.instanceId, quality, count: 1 }) }}
                    title={`${props.t('feed')} · ${materialItemName(props.t, quality)} · +${MATERIAL_XP[quality]} EXP`}
                    aria-label={`${props.t('feed')} ${materialItemName(props.t, quality)} · +${MATERIAL_XP[quality]} EXP`}
                  >
                    <i />
                    <span>+{MATERIAL_XP[quality]}</span>
                    <small>×{props.state.materials[quality]}</small>
                  </button>
                ))}
              </div>
            </article>
          )}
        </div>
        {props.state.idle.lastReward !== undefined && (
          <p className={css.idleReward}>
            {props.t('idleReward', { minutes: props.state.idle.lastReward.elapsedMinutes })}
          </p>
        )}
        <div className={css.statsGrid}>
          <span><b>{stats.completedTurns}</b>{props.t('totalTurns')}</span>
          <span><b>{stats.failedTurns}</b>{props.t('failures')}</span>
          <span><b>{stats.successfulCaptures}</b>{props.t('captureCount')}</span>
          <span><b>{stats.wildDefeats}</b>{props.t('defeatCount')}</span>
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
  strike: 'intentStrike', guard: 'intentGuard', disrupt: 'intentDisrupt',
  corrupt: 'intentCorrupt', mark: 'intentMark', lock: 'intentLock', freeze: 'intentFreeze',
}

function tileLabel(tile: MatchTile, index: number, t: TraceWildOverlayProps['t']): string {
  const ecology = t(ECOLOGY_KEYS[tile.ecology])
  const special = tile.special === 'none' ? '' : ` · ${t(SPECIAL_KEYS[tile.special])}`
  const locked = (tile.lockedActions ?? 0) > 0 ? ` · ${t('lockedTile', { actions: tile.lockedActions ?? 0 })}` : ''
  const hazard = (tile.hazardActions ?? 0) > 0 ? ` · ${t('hazardTile', { actions: tile.hazardActions ?? 0 })}` : ''
  return `${ecology}${special}${locked}${hazard} · ${Math.floor(index / 7) + 1},${index % 7 + 1}`
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

interface DamageReadout {
  key: number
  actor: 'player' | 'boss'
  total: number
  current?: number
  effectiveness?: MatchDamageEffectiveness
  settled: boolean
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
  act: (action: TraceWildAction) => Promise<TraceWildActionResponse | undefined>
  transition?: BattleTransition | undefined
}) {
  const battle = props.state.battle!
  const [selectedTile, setSelectedTile] = useState<number>()
  const [gesture, setGesture] = useState<TileGesture>()
  const [swapMotion, setSwapMotion] = useState<SwapMotion>()
  const [animating, setAnimating] = useState(false)
  const [visualBoard, setVisualBoard] = useState<MatchTile[]>(() => battle.board.map(tile => ({ ...tile })))
  const [clearingTiles, setClearingTiles] = useState<ReadonlySet<number>>()
  const [fallRows, setFallRows] = useState<readonly number[]>()
  const [activeChain, setActiveChain] = useState<number>()
  const [damageReadout, setDamageReadout] = useState<DamageReadout>()
  const [captureIntro, setCaptureIntro] = useState(false)
  const [partyHitKey, setPartyHitKey] = useState(0)
  const gestureRef = useRef<TileGesture>()
  const bossActionInFlight = useRef(false)
  const bossActionTimer = useRef<number>()
  const swapTimer = useRef<number>()
  const motionTimers = useRef(new Set<number>())
  const animationEpoch = useRef(0)
  const suppressClick = useRef(false)
  const suppressClickTimer = useRef<number>()
  const captureIntroTimer = useRef<number>()
  const previousCaptureWindow = useRef(false)
  const previousBattle = useRef({ id: battle.id, wildHp: battle.wildHp, partyHp: battle.partyHp })
  const encounter = props.state.encounters.find(row => row.id === battle.encounterId)
  const wild = creatureById(battle.wildCreatureId)
  const active = battle.party[battle.activeIndex]
  const activeDefinition = active === undefined ? undefined : creatureById(active.creatureId)
  const locked = props.busy || animating
  const boardLocked = locked || battle.turnOwner === 'boss' || battle.captureWindow || battle.actionsRemaining <= 0
  const partyHp = battle.partyHp

  useEffect(() => {
    setSelectedTile(undefined)
    gestureRef.current = undefined
    setGesture(undefined)
  }, [battle.id, battle.turn, battle.turnOwner, battle.actionsRemaining, battle.bossActionsRemaining, battle.activeIndex])

  useEffect(() => {
    const entered = battle.captureWindow && !previousCaptureWindow.current
    previousCaptureWindow.current = battle.captureWindow
    if (!entered) {
      if (!battle.captureWindow) setCaptureIntro(false)
      return
    }
    setCaptureIntro(true)
    if (captureIntroTimer.current !== undefined) window.clearTimeout(captureIntroTimer.current)
    captureIntroTimer.current = window.setTimeout(() => {
      captureIntroTimer.current = undefined
      setCaptureIntro(false)
    }, 760)
  }, [battle.captureWindow, battle.id])

  useEffect(() => {
    animationEpoch.current += 1
    setSwapMotion(undefined)
    setClearingTiles(undefined)
    setFallRows(undefined)
    setActiveChain(undefined)
    setVisualBoard(battle.board.map(tile => ({ ...tile })))
  }, [battle.id])

  useEffect(() => {
    if (!animating) setVisualBoard(battle.board.map(tile => ({ ...tile })))
  }, [animating, battle.board])

  useEffect(() => {
    const previous = previousBattle.current
    if (previous.id !== battle.id) {
      previousBattle.current = { id: battle.id, wildHp: battle.wildHp, partyHp }
      setDamageReadout(undefined)
      return
    }
    const wildDamage = previous.wildHp - battle.wildHp
    if (wildDamage > 0) {
      setDamageReadout({ key: Date.now(), actor: 'player', total: battle.lastTeamDamageApplied || wildDamage, settled: true })
    } else if (!animating && battle.pendingTeamDamage > 0) {
      setDamageReadout(current => ({
        key: current?.key ?? Date.now(),
        actor: 'player',
        total: battle.pendingTeamDamage,
        settled: false,
      }))
    }
    if (previous.partyHp > partyHp) setPartyHitKey(value => value + 1)
    previousBattle.current = { id: battle.id, wildHp: battle.wildHp, partyHp }
  }, [animating, battle.id, battle.lastTeamDamageApplied, battle.pendingTeamDamage, battle.wildHp, partyHp])

  useEffect(() => () => {
    animationEpoch.current += 1
    if (bossActionTimer.current !== undefined) window.clearTimeout(bossActionTimer.current)
    if (swapTimer.current !== undefined) window.clearTimeout(swapTimer.current)
    if (suppressClickTimer.current !== undefined) window.clearTimeout(suppressClickTimer.current)
    if (captureIntroTimer.current !== undefined) window.clearTimeout(captureIntroTimer.current)
    for (const timer of motionTimers.current) window.clearTimeout(timer)
    motionTimers.current.clear()
  }, [])

  const suppressNextClick = (duration: number): void => {
    suppressClick.current = true
    if (suppressClickTimer.current !== undefined) window.clearTimeout(suppressClickTimer.current)
    suppressClickTimer.current = window.setTimeout(() => {
      suppressClickTimer.current = undefined
      suppressClick.current = false
    }, duration)
  }

  const pause = (duration: number): Promise<void> => new Promise(resolve => {
    const timer = window.setTimeout(() => {
      motionTimers.current.delete(timer)
      resolve()
    }, duration)
    motionTimers.current.add(timer)
  })

  const playCascade = async (
    animation: NonNullable<TraceWildActionResponse['animation']>,
    finalBattle: NonNullable<TraceWildSnapshot['state']['battle']>,
  ): Promise<void> => {
    if (animation.battleId !== battle.id) return
    const epoch = ++animationEpoch.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    for (const frame of animation.frames) {
      if (animationEpoch.current !== epoch) return
      if (animation.actor !== 'boss' && frame.damage !== undefined && frame.totalDamage !== undefined) {
        setDamageReadout({
          key: Date.now() + frame.chain,
          actor: 'player',
          total: frame.totalDamage,
          current: frame.damage,
          effectiveness: frame.effectiveness ?? 'neutral',
          settled: false,
        })
      }
      setFallRows(undefined)
      setVisualBoard(frame.before.map(tile => ({ ...tile })))
      setClearingTiles(new Set(frame.removed))
      setActiveChain(frame.chain)
      await pause(reducedMotion ? 20 : 190)
      if (animationEpoch.current !== epoch) return
      setClearingTiles(undefined)
      setVisualBoard(frame.after.map(tile => ({ ...tile })))
      setFallRows(frame.fallRows)
      const longestFall = Math.max(...frame.fallRows)
      await pause(reducedMotion ? 20 : Math.min(540, 270 + longestFall * 34))
      if (animationEpoch.current !== epoch) return
      setFallRows(undefined)
      await pause(reducedMotion ? 0 : 45)
    }
    if (animationEpoch.current !== epoch) return
    setActiveChain(undefined)
    setVisualBoard(finalBattle.board.map(tile => ({ ...tile })))
    if (animation.actor !== 'boss') {
      const total = finalBattle.pendingTeamDamage > 0
        ? finalBattle.pendingTeamDamage
        : finalBattle.lastTeamDamageApplied
      setDamageReadout(total > 0
        ? { key: Date.now(), actor: 'player', total, settled: finalBattle.pendingTeamDamage === 0 }
        : undefined)
    } else if (finalBattle.turnOwner !== 'boss' && finalBattle.lastBossAttack > 0) {
      const key = Date.now()
      setDamageReadout({
        key,
        actor: 'boss',
        total: finalBattle.lastBossAttack,
        current: finalBattle.lastBossAttack,
        effectiveness: 'neutral',
        settled: false,
      })
      await pause(reducedMotion ? 40 : 440)
      if (animationEpoch.current !== epoch) return
      setDamageReadout({ key, actor: 'boss', total: finalBattle.lastBossAttack, settled: true })
    }
  }

  const runBossAction = (): void => {
    if (battle.turnOwner !== 'boss' || props.busy || animating || bossActionInFlight.current) return
    bossActionInFlight.current = true
    setDamageReadout(current => current?.actor === 'boss'
      ? current
      : { key: Date.now(), actor: 'boss', total: 0, settled: false })
    setAnimating(true)
    void props.act({ type: 'battle-continue' }).then(async (response) => {
      const finalBattle = response?.state.battle
      if (response?.animation !== undefined && finalBattle?.id === battle.id) {
        const motion = response.animation.swap
        if (motion !== undefined) {
          setSwapMotion(motion)
          await pause(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 20 : 150)
          setSwapMotion(undefined)
        }
        await playCascade(response.animation, finalBattle)
      }
    }).finally(() => {
      bossActionInFlight.current = false
      setSwapMotion(undefined)
      setClearingTiles(undefined)
      setFallRows(undefined)
      setActiveChain(undefined)
      setAnimating(false)
    })
  }

  useEffect(() => {
    if (battle.turnOwner !== 'boss' || props.busy || animating || bossActionInFlight.current) return
    bossActionTimer.current = window.setTimeout(() => {
      bossActionTimer.current = undefined
      runBossAction()
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 30 : 420)
    return () => {
      if (bossActionTimer.current !== undefined) window.clearTimeout(bossActionTimer.current)
      bossActionTimer.current = undefined
    }
  }, [battle.id, battle.turnOwner, battle.bossActionsRemaining, props.busy, animating])

  if ((battle.mode === 'wild' && encounter === undefined) || wild === undefined || active === undefined || activeDefinition === undefined) return null
  const availableCores = CAPTURE_CORE_QUALITIES.filter(quality => props.state.cores[quality] > 0)
  const captureReady = battle.mode === 'wild' && battle.captureWindow
  const predictedHp = Math.max(0, battle.wildHp - Math.max(0, battle.pendingTeamDamage - battle.wildShield))
  const enemyTarget = battle.enemyTargetScope === 'team'
    ? props.t('targetTeam')
    : battle.enemyTargetScope === 'self'
      ? props.t('targetSelf')
      : battle.enemyTargetScope === 'board'
        ? props.t('targetBoard')
      : (() => {
          const target = battle.party[battle.enemyTargetIndex ?? battle.activeIndex]
          const definition = target === undefined ? undefined : creatureById(target.creatureId)
          return definition === undefined ? props.t('targetMember') : creatureName(definition, props.zh)
        })()
  const lastLog = battle.log.at(-1)
  const transitionTitle = props.transition === undefined
    ? undefined
    : props.t(props.transition.kind === 'tower-cleared'
        ? 'transitionTowerCleared'
        : props.transition.kind === 'wild-defeated'
          ? 'transitionWildDefeated'
          : props.transition.kind === 'capture-success'
            ? 'transitionCaptureSuccess'
            : props.transition.kind === 'capture-failed'
              ? 'transitionCaptureFailed'
              : 'transitionBattleLost')

  const swap = (from: number, to: number): void => {
    if (boardLocked || (visualBoard[from]?.lockedActions ?? 0) > 0 || (visualBoard[to]?.lockedActions ?? 0) > 0
      || !areAdjacentTiles(from, to)) {
      setSelectedTile(to)
      return
    }
    setSelectedTile(undefined)
    gestureRef.current = undefined
    setGesture(undefined)
    setSwapMotion({ from, to })
    setAnimating(true)
    swapTimer.current = window.setTimeout(() => {
      swapTimer.current = undefined
      void props.act({ type: 'battle-swap', from, to }).then(async (response) => {
        setSwapMotion(undefined)
        const finalBattle = response?.state.battle
        if (response?.animation !== undefined && finalBattle?.id === battle.id) {
          await playCascade(response.animation, finalBattle)
        }
      }).finally(() => {
        setClearingTiles(undefined)
        setFallRows(undefined)
        setActiveChain(undefined)
        setAnimating(false)
      })
    }, 130)
  }

  const castSkill = (creatureInstanceId: string): void => {
    if (boardLocked) return
    setAnimating(true)
    void props.act({ type: 'battle-cast', creatureInstanceId }).then(async (response) => {
      const finalBattle = response?.state.battle
      if (response?.animation !== undefined && finalBattle?.id === battle.id) {
        await playCascade(response.animation, finalBattle)
      }
    }).finally(() => {
      setClearingTiles(undefined)
      setFallRows(undefined)
      setActiveChain(undefined)
      setAnimating(false)
    })
  }

  const select = (index: number): void => {
    if (boardLocked || (visualBoard[index]?.lockedActions ?? 0) > 0) return
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
    const currentGesture = gestureRef.current
    if (currentGesture === undefined || currentGesture.index !== index || boardLocked) return
    const offsetX = clientX - currentGesture.startX
    const offsetY = clientY - currentGesture.startY
    const limit = tileSize * 0.42
    const nextGesture = {
      ...currentGesture,
      offsetX: Math.max(-limit, Math.min(limit, offsetX)),
      offsetY: Math.max(-limit, Math.min(limit, offsetY)),
    }
    gestureRef.current = nextGesture
    setGesture(nextGesture)
    const threshold = Math.max(15, tileSize * 0.28)
    if (Math.max(Math.abs(offsetX), Math.abs(offsetY)) < threshold) return
    const target = swipeTarget(index, offsetX, offsetY)
    if (target === undefined) return
    gestureRef.current = undefined
    suppressNextClick(350)
    swap(index, target)
  }

  return (
    <div className={css.battleBackdrop}>
      <section className={`${css.battlePanel} ${partyHitKey > 0 ? css.battleWasHit : ''}`} role="dialog" aria-modal="true" aria-label={battle.mode === 'tower' ? props.t('towerBattle') : props.t('battle')}>
        <header className={css.battleHeader}>
          <div>
            <h2>{battle.mode === 'tower' ? props.t('towerBattle') : props.t('battle')}</h2>
            <span>
              {battle.mode === 'tower' && `${props.t('towerFloor', { floor: battle.towerFloor ?? 1 })} · `}
              {props.t('round')} {battle.round} · {battle.turnOwner === 'boss'
                ? `${props.t('bossMoves')} ${battle.bossActionsRemaining}/5`
                : `${props.t('movesRemaining')} ${battle.actionsRemaining}/5`}
            </span>
          </div>
          <button type="button" className={css.flee} disabled={locked || battle.turnOwner === 'boss'} onClick={() => { void props.act({ type: 'flee' }) }}>{props.t('flee')}</button>
        </header>

        <div className={`${css.wildBanner} ${encounter?.enhanced === true || battle.mode === 'tower' ? css.fighterEnhanced : ''}`} key={`${battle.id}-${battle.wildHp}`}>
          <div className={css.enemyAura} aria-hidden="true" />
          <CreatureSprite creature={wild} size="medium" />
          <div className={css.wildVitals}>
            <div className={css.fighterName}>
              <strong>{creatureName(wild, props.zh)}</strong>
              <span>Lv.{battle.wildLevel} · {props.t(CORE_KEYS[battle.wildQuality])} · {props.t(ECOLOGY_KEYS[wild.ecology])}{battle.mode === 'tower' ? ` · ${props.t('towerSkillTier', { tier: battle.bossSkillTier })}` : ''}</span>
            </div>
            <div className={`${css.hpBar} ${css.hpWild}`}>
              <em style={{ width: `${percent(predictedHp, battle.wildMaxHp)}%` }} />
              <i style={{ width: `${percent(battle.wildHp, battle.wildMaxHp)}%` }} />
            </div>
            <small>
              {props.t('health')} {battle.wildHp}/{battle.wildMaxHp} · {props.t('armor')} {battle.wildArmor}
              {battle.wildShield > 0 ? ` · ${props.t('shield')} ${battle.wildShield}` : ''}
              {battle.pendingTeamDamage > 0 ? ` · ${props.t('pendingDamage')} ${battle.pendingTeamDamage}` : ''}
            </small>
            <div className={css.energyBar}><i style={{ width: `${percent(battle.bossEnergy, 24)}%` }} /></div>
            <small>
              {props.t('bossEnergy')} {battle.bossEnergy}/24 · {battle.bossSkillArmed ? props.t('skillReady') : props.t('skillCharging')}
              {battle.turnOwner === 'boss' ? ` · ${props.t('bossCharge')} ${battle.bossAttackCharge.toFixed(1)}` : ''}
            </small>
          </div>
          <div className={css.enemyIntent}>
            <span>{props.t('enemyIntent')}</span>
            <strong>{props.t(INTENT_KEYS[battle.enemyIntent])}</strong>
            <small>{enemyTarget}</small>
          </div>
          {damageReadout !== undefined && (
            <div
              key={damageReadout.key}
              className={`${css.totalDamageHud} ${damageReadout.settled ? css.totalDamageSettled : ''}`}
              aria-live="polite"
            >
              <span>{props.t(damageReadout.actor === 'boss' ? 'enemyDamage' : 'totalDamage')}</span>
              <strong>{damageReadout.total.toLocaleString()}</strong>
              {damageReadout.current !== undefined && (
                <em className={css[`damage_${damageReadout.effectiveness ?? 'neutral'}`]}>
                  +{damageReadout.current.toLocaleString()}
                </em>
              )}
            </div>
          )}
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
                const skillReady = member.energy >= skill.energyCost && !member.skillUsedStage && member.skillSealedStages === 0
                const canCast = battle.turnOwner === 'player' && isActive && battle.partyHp > 0 && battle.actionsRemaining > 0
                  && !battle.captureWindow && skillReady
                const portraitStyle = {
                  '--energy-progress': `${percent(member.energy, skill.energyCost) * 3.6}deg`,
                } as CSSProperties
                return (
                  <article
                    key={member.instanceId}
                    className={`${css.partyCombatant} ${isActive ? css.partyCombatantActive : ''} ${skillReady ? css.partyCombatantReady : ''} ${member.skillSealedStages > 0 ? css.partyCombatantSealed : ''} ${battle.partyHp <= 0 ? css.partyCombatantDown : ''}`}
                    title={`${props.t('passiveSkill')} · ${props.zh ? skill.passiveNameZh : skill.passiveNameEn}\n${props.zh ? skill.passiveDescriptionZh : skill.passiveDescriptionEn}`}
                  >
                    <span className={css.partySlot}>{index + 1}</span>
                    <div className={css.partyPortrait} style={portraitStyle}>
                      <CreatureSprite creature={creature} size="small" />
                      <i className={css.partyEnergyRing} aria-hidden="true" />
                    </div>
                    <div className={css.partyCombatantBody}>
                      <div className={css.fighterName}>
                        <strong>{creatureName(creature, props.zh)}</strong>
                        <span>Lv.{member.level} · {props.t(CORE_KEYS[member.quality])}</span>
                      </div>
                      <div className={css.energyBar}><i style={{ width: `${percent(member.energy, skill.energyCost)}%` }} /></div>
                      <small>{props.t('energy')} {member.energy}/{skill.energyCost}</small>
                      {member.stageDamage > 0 && <small className={css.partyDamageBadge}>+{member.stageDamage}</small>}
                      {member.frozenStages > 0 && <strong className={css.frozenBadge}>{props.t('frozen')}</strong>}
                      {member.skillSealedStages > 0 && <strong className={css.sealedBadge}>{props.t('skillSealed')}</strong>}
                      <button
                        type="button"
                        className={css.skillButton}
                        disabled={locked || !canCast}
                        onClick={() => { castSkill(member.instanceId) }}
                        title={props.zh ? skill.activeDescriptionZh : skill.activeDescriptionEn}
                      >
                        {skillReady ? props.t('skillOk') : props.zh ? skill.activeNameZh : skill.activeNameEn}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
            <div className={css.sharedPartyVitals}>
              <div className={css.sharedHpHeader}>
                <span>{props.t('teamRuntime')}</span>
                <strong>{battle.partyHp.toLocaleString()} / {battle.partyMaxHp.toLocaleString()}</strong>
              </div>
              <div className={`${css.hpBar} ${css.hpTeam}`}>
                <i style={{ width: `${percent(battle.partyHp, battle.partyMaxHp)}%` }} />
              </div>
              {battle.partyShield > 0 && <small>{props.t('shield')} +{battle.partyShield}</small>}
            </div>
          </div>

          <div className={css.boardColumn}>
            <div className={`${css.turnSummary} ${battle.turnOwner === 'boss' ? css.turnSummaryBoss : ''}`}>
              <span className={`${css.ecologyPip} ${css[`pip_${battle.turnOwner === 'boss' ? wild.ecology : activeDefinition.ecology}`]}`}>
                {TILE_SYMBOLS[battle.turnOwner === 'boss' ? wild.ecology : activeDefinition.ecology]}
              </span>
              <strong>{battle.turnOwner === 'boss'
                ? `${creatureName(wild, props.zh)} · ${props.t('bossTurn')}`
                : `${creatureName(activeDefinition, props.zh)} · ${props.t('activeTurn')}`}</strong>
              <span className={css.actionDots} aria-label={`${battle.turnOwner === 'boss' ? props.t('bossMoves') : props.t('movesRemaining')} ${battle.turnOwner === 'boss' ? battle.bossActionsRemaining : battle.actionsRemaining}`}>
                {[0, 1, 2, 3, 4].map(index => <i key={index} className={index < (battle.turnOwner === 'boss' ? battle.bossActionsRemaining : battle.actionsRemaining) ? css.actionDotActive : ''} />)}
              </span>
              {activeChain !== undefined && <span className={css.cascadePill}>CHAIN {activeChain}</span>}
            </div>
            <div className={css.boardStage}>
              <div
                className={css.matchBoard}
                role="grid"
                aria-label={props.t('boardHelp')}
                aria-busy={boardLocked}
              >
                {visualBoard.map((tile, index) => {
                const dragging = gesture?.index === index
                const fallDistance = fallRows?.[index] ?? 0
                const tileStyle = {
                  '--tile-row': Math.floor(index / 7),
                  '--drag-x': `${dragging ? gesture.offsetX : 0}px`,
                  '--drag-y': `${dragging ? gesture.offsetY : 0}px`,
                  '--fall-y': `${fallDistance * -110}%`,
                  '--fall-duration': `${240 + fallDistance * 34}ms`,
                  '--fall-delay': `${(index % 7) * 9}ms`,
                } as CSSProperties
                return (
                  <button
                    key={index}
                    type="button"
                    role="gridcell"
                    draggable={false}
                    style={tileStyle}
                    className={`${css.matchTile} ${css[`tile_${tile.ecology}`]} ${selectedTile === index ? css.matchTileSelected : ''} ${dragging ? css.matchTileDragging : ''} ${clearingTiles?.has(index) === true ? css.matchTileClearing : ''} ${fallDistance > 0 ? css.matchTileFalling : ''} ${tile.special !== 'none' ? css.matchTileSpecial : ''} ${(tile.lockedActions ?? 0) > 0 ? css.matchTileLocked : ''} ${(tile.hazardActions ?? 0) > 0 ? css.matchTileHazard : ''} ${swapMotionClass(index, swapMotion)}`}
                    aria-label={tileLabel(tile, index, props.t)}
                    disabled={boardLocked || (tile.lockedActions ?? 0) > 0}
                    onClick={() => {
                      if (suppressClick.current) {
                        suppressClick.current = false
                        return
                      }
                      select(index)
                    }}
                    onDragStart={(event) => { event.preventDefault() }}
                    onPointerDown={(event) => {
                      if (boardLocked || (tile.lockedActions ?? 0) > 0) return
                      event.currentTarget.setPointerCapture(event.pointerId)
                      const nextGesture = { index, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, offsetX: 0, offsetY: 0 }
                      gestureRef.current = nextGesture
                      setGesture(nextGesture)
                    }}
                    onPointerMove={(event) => {
                      if (gestureRef.current?.pointerId !== event.pointerId) return
                      event.preventDefault()
                      moveGesture(index, event.clientX, event.clientY, event.currentTarget.clientWidth)
                    }}
                    onPointerUp={(event) => {
                      const currentGesture = gestureRef.current
                      if (currentGesture?.pointerId !== event.pointerId) return
                      const offsetX = event.clientX - currentGesture.startX
                      const offsetY = event.clientY - currentGesture.startY
                      const threshold = Math.max(15, event.currentTarget.clientWidth * 0.28)
                      const target = Math.max(Math.abs(offsetX), Math.abs(offsetY)) >= threshold
                        ? swipeTarget(index, offsetX, offsetY)
                        : undefined
                      if (Math.max(Math.abs(offsetX), Math.abs(offsetY)) > 6) {
                        suppressNextClick(250)
                      }
                      gestureRef.current = undefined
                      setGesture(undefined)
                      if (target !== undefined) swap(index, target)
                    }}
                    onPointerCancel={() => {
                      gestureRef.current = undefined
                      setGesture(undefined)
                    }}
                  >
                    <span aria-hidden="true">{TILE_SYMBOLS[tile.ecology]}</span>
                    {tile.special !== 'none' && <b aria-hidden="true">{tile.special === 'origin' ? '◎' : tile.special === 'burst' ? '✣' : tile.special === 'row' ? '↔' : '↕'}</b>}
                    {(tile.lockedActions ?? 0) > 0 && <em aria-hidden="true">⌁</em>}
                    {(tile.hazardActions ?? 0) > 0 && <small className={css.hazardMark} aria-hidden="true">!</small>}
                  </button>
                )
                })}
              </div>
              {captureReady && (
                <section className={`${css.captureBoardOverlay} ${captureIntro ? css.captureBoardIntro : ''}`} aria-live="polite">
                  <header>
                    <small>CAPTURE PHASE</small>
                    <strong>{props.t('capturePhaseTitle')}</strong>
                    <span>{props.t('capturePhaseHint')}</span>
                  </header>
                  {availableCores.length === 0 && <p>{props.t('noCores')}</p>}
                  <div className={css.captureCoreGrid}>
                    {availableCores.map(quality => (
                      <button
                        key={quality}
                        type="button"
                        className={css[`core_${quality}`]}
                        disabled={locked}
                        onClick={() => { void props.act({ type: 'capture', quality }) }}
                        aria-label={`${props.t(CORE_KEYS[quality])} · ${Math.round(visibleCaptureChance(props.state, quality) * 100)}% · ${props.state.cores[quality]}`}
                      >
                        <i aria-hidden="true" />
                        <span>{props.t(CORE_KEYS[quality])}</span>
                        <b>{Math.round(visibleCaptureChance(props.state, quality) * 100)}%</b>
                        <small>×{props.state.cores[quality]}</small>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={css.captureAbandon}
                    disabled={locked}
                    onClick={() => { void props.act({ type: 'battle-continue' }) }}
                  >
                    {props.t('abandonCapture')}
                  </button>
                </section>
              )}
            </div>
            <p className={css.boardHelp}>{props.t('boardHelp')}</p>
          </div>

          {battle.mode === 'wild' ? (
            <>
              {battle.turnOwner === 'player' && !battle.captureWindow && battle.actionsRemaining > 0 && (
                <button
                  type="button"
                  className={`${css.continueButton} ${css.skipStageButton} ${css.battleUtilityAction}`}
                  disabled={locked}
                  title={props.t('skipStageHint')}
                  onClick={() => { void props.act({ type: 'battle-skip-stage' }) }}
                >
                  {props.t('skipStage')}
                </button>
              )}
              {battle.turnOwner === 'player' && !battle.captureWindow && battle.actionsRemaining === 0 && (
                <button
                  type="button"
                  className={`${css.continueButton} ${css.battleUtilityAction}`}
                  disabled={locked}
                  onClick={() => { void props.act({ type: 'battle-continue' }) }}
                >
                  {props.t('skipFrozen')}
                </button>
              )}
            </>
          ) : (
            <div className={css.towerBattleStatus}>
              <span className={css.towerBattleMark} aria-hidden="true">▲</span>
              <div>
                <strong>{props.t('towerNoCapture')}</strong>
                <small>{props.t('towerBattleReward', { floor: battle.towerFloor ?? 1 })}</small>
              </div>
              <b>{props.t('towerSkillTier', { tier: battle.bossSkillTier })}</b>
              {battle.turnOwner === 'player' && battle.actionsRemaining === 0 && (
                <button
                  type="button"
                  className={css.continueButton}
                  disabled={locked}
                  onClick={() => { void props.act({ type: 'battle-continue' }) }}
                >
                  {props.t('skipFrozen')}
                </button>
              )}
            </div>
          )}

        </div>
        {props.transition !== undefined && transitionTitle !== undefined && (
          <div
            key={props.transition.key}
            className={`${css.battleTransition} ${props.transition.kind.startsWith('capture') ? css.battleTransitionCapture : ''} ${props.transition.kind === 'capture-failed' || props.transition.kind === 'battle-lost' ? css.battleTransitionFailed : ''}`}
            role="status"
            aria-live="assertive"
          >
            <span aria-hidden="true" />
            <small>{props.transition.kind.startsWith('capture') ? 'CAPTURE' : 'BATTLE RESULT'}</small>
            <strong>{transitionTitle}</strong>
          </div>
        )}
      </section>
    </div>
  )
}
