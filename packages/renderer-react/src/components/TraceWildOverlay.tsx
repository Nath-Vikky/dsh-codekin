import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import { CAPTURE_CORE_QUALITIES } from '../../../content-sdk/src/types.ts'
import {
  CORE_CAPTURE_POWER,
  MATERIAL_XP,
  MAX_MAP_ENCOUNTERS,
  MAX_PLAYER_LEVEL,
  captureChance,
  playerStats,
  totalXpForLevel,
  xpToNextLevel,
} from '../../../engine/src/balance.ts'
import { MATCH_BOARD_SIZE, areAdjacentTiles } from '../../../engine/src/match3.ts'
import type {
  BattleAmplifier,
  CaptureCoreQuality,
  CapturedCreature,
  CreatureDefinition,
  EnemyIntent,
  MatchDamageEffectiveness,
  MatchSignalEffect,
  MatchTile,
  TraceEcology,
  TraceLogEntry,
  TraceWildAction,
  TraceWildActionResponse,
  TraceWildBattleRecovery,
  TraceWildBattleStrike,
  TraceWildSnapshot,
} from '../../../engine/src/types.ts'
import {
  TraceWildConnectionError,
  createTraceWildConnection,
  subscribeTraceWildSettingsChanged,
} from '../bridge.ts'
import {
  MAX_CONTENT_TOWER_FLOOR,
  activateCodekinContent,
  contentAssetUrl,
  contentTowerFloorProfile,
  creatureById,
  creatureCatalog,
  skillByCreatureId,
  starterCreatureIds,
} from '../content.ts'
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

type BattleActionPresenter = (response: TraceWildActionResponse) => Promise<void>

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

const BOSS_ACTION_PAUSE_MS = 860

const CreatureSprite = memo(function CreatureSprite(props: {
  creature: CreatureDefinition
  size?: 'tiny' | 'small' | 'medium' | 'large'
  unknown?: boolean
  eager?: boolean
}) {
  const className = `${css.sprite} ${css[`sprite_${props.size ?? 'medium'}`]} ${props.unknown ? css.spriteUnknown : ''}`
  if (props.unknown) {
    return <span className={`${className} ${css.spritePlaceholder}`} aria-hidden="true">?</span>
  }
  const source = contentAssetUrl(`creature:${props.creature.id}:sprite`)
  if (source === undefined) {
    return <span className={`${className} ${css.spritePlaceholder}`} aria-hidden="true">?</span>
  }
  return (
    <img
      className={className}
      src={source}
      alt=""
      width={384}
      height={384}
      loading={props.eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
    />
  )
})

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
  const [codekinDetail, setCodekinDetail] = useState<string>()
  const [rewardQueue, setRewardQueue] = useState<AcquiredItem[][]>([])
  const [releaseCandidate, setReleaseCandidate] = useState<string>()
  const [battleTransition, setBattleTransition] = useState<BattleTransition>()
  const latestSnapshot = useRef<TraceWildSnapshot>()
  const actionInFlight = useRef(false)
  const pendingSnapshot = useRef<TraceWildSnapshot>()
  const overlayElement = useRef<HTMLElement>(null)
  const windowDrag = useRef<WindowDragState>()
  const pendingWindowPosition = useRef<WindowPosition>()
  const launcherElement = useRef<HTMLButtonElement>(null)
  const launcherDrag = useRef<WindowDragState>()
  const pendingLauncherPosition = useRef<WindowPosition>()
  const launcherWasDragged = useRef(false)
  const pulseTimer = useRef<number>()
  const zh = t('title') === '码灵'

  const adoptSnapshot = useCallback((value: TraceWildSnapshot, allowClockRefresh = false): void => {
    const previous = latestSnapshot.current
    const sameProfile = previous !== undefined && value.state.createdAt === previous.state.createdAt
    if (sameProfile && value.state.revision < previous.state.revision) return
    if (sameProfile && value.state.revision === previous.state.revision) {
      if (!allowClockRefresh || value.serverTime <= previous.serverTime) return
      latestSnapshot.current = value
      setSnapshot(value)
      return
    }
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
      const [content, value] = await Promise.all([
        connection.loadContent(signal),
        connection.load(signal),
      ])
      activateCodekinContent(content)
      adoptSnapshot(value, true)
      setOnline(true)
    } catch {
      if (signal?.aborted !== true) setOnline(false)
    }
  }, [adoptSnapshot, connection])

  useEffect(() => {
    const controller = new AbortController()
    void refresh(controller.signal)
    return () => { controller.abort() }
  }, [refresh])

  useEffect(() => {
    if (snapshot?.state.enabled !== true) return
    const unsubscribe = connection.subscribe((value) => {
      if (actionInFlight.current) {
        pendingSnapshot.current = value
        return
      }
      adoptSnapshot(value)
    }, setOnline)
    return unsubscribe
  }, [adoptSnapshot, connection, snapshot?.state.enabled])

  useEffect(() => {
    const onSettingsChanged = (): void => { void refresh() }
    return subscribeTraceWildSettingsChanged(onSettingsChanged)
  }, [refresh])

  useEffect(() => () => {
    if (pulseTimer.current !== undefined) window.clearTimeout(pulseTimer.current)
  }, [])

  useEffect(() => {
    if (snapshot !== undefined) setSquadDraft([...snapshot.state.squad])
  }, [snapshot?.state.revision])

  useEffect(() => {
    if (codekinDetail === undefined) return
    if (snapshot?.state.creatures.some(creature => creature.instanceId === codekinDetail) !== true) {
      setCodekinDetail(undefined)
    }
  }, [codekinDetail, snapshot?.state.revision])

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
      else if (codekinDetail !== undefined) setCodekinDetail(undefined)
      else if (snapshot?.state.battle === undefined) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  }, [codekinDetail, open, releaseCandidate, rewardQueue.length, snapshot?.state.battle])

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
    pendingWindowPosition.current = windowPosition
    setDraggingWindow(true)
  }

  const moveWindowDrag = (event: ReactPointerEvent<HTMLElement>): void => {
    const drag = windowDrag.current
    if (drag === undefined || drag.pointerId !== event.pointerId) return
    event.preventDefault()
    const next = clampWindowPosition(
      drag.x + event.clientX - drag.startX,
      drag.y + event.clientY - drag.startY,
      drag.width,
      drag.height,
    )
    pendingWindowPosition.current = next
    overlayElement.current?.style.setProperty('--window-x', `${next.x}px`)
    overlayElement.current?.style.setProperty('--window-y', `${next.y}px`)
  }

  const finishWindowDrag = (event: ReactPointerEvent<HTMLElement>): void => {
    if (windowDrag.current?.pointerId !== event.pointerId) return
    windowDrag.current = undefined
    const next = pendingWindowPosition.current
    pendingWindowPosition.current = undefined
    if (next !== undefined) setWindowPosition(next)
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
    pendingLauncherPosition.current = { x: rect.left, y: rect.top }
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
    const next = clampFloatingPosition(
      drag.x + deltaX,
      drag.y + deltaY,
      drag.width,
      drag.height,
    )
    pendingLauncherPosition.current = next
    const element = launcherElement.current
    if (element !== null) {
      element.style.left = `${next.x}px`
      element.style.top = `${next.y}px`
      element.style.right = 'auto'
      element.style.bottom = 'auto'
    }
  }

  const finishLauncherDrag = (event: ReactPointerEvent<HTMLButtonElement>): void => {
    if (launcherDrag.current?.pointerId !== event.pointerId) return
    launcherDrag.current = undefined
    const next = pendingLauncherPosition.current
    pendingLauncherPosition.current = undefined
    if (next !== undefined && launcherWasDragged.current) setLauncherPosition(next)
    setDraggingLauncher(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const act = useCallback(async (
    action: TraceWildAction,
    present?: BattleActionPresenter,
  ): Promise<TraceWildActionResponse | undefined> => {
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
      if (present !== undefined) await present(response)
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
      const battleAction = action.type.startsWith('battle-') || action.type === 'capture'
        || action.type === 'flee' || action.type === 'start-battle' || action.type === 'start-tower'
      if (error instanceof TraceWildConnectionError && error.code === 'invalid-action') {
        // A legal adjacent swap that forms no match is ordinary board input:
        // the pieces spring back and the action is not consumed. Do not make
        // that feel like a stale Host/plugin error.
        if (action.type !== 'battle-swap') {
          setNotice(action.type === 'claim-idle-reward'
            ? t('rewardUnavailable')
            : battleAction
              ? t('battleActionUnavailable')
              : t('invalidSwap'))
        }
      } else {
        setNotice(error instanceof TraceWildConnectionError && error.code === 'conflict'
          ? battleAction
            ? t('battleActionUnavailable')
            : t('invalidSwap')
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
            src={contentAssetUrl('launcher:default') ?? '/api/tracewild/assets/sprites/codekin-launcher-v2.webp'}
            alt=""
            aria-hidden="true"
            width={384}
            height={384}
            loading="eager"
            decoding="async"
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
                  <CodekinView
                    state={state}
                    t={t}
                    zh={zh}
                    draft={squadDraft}
                    setDraft={setSquadDraft}
                    busy={busy}
                    save={async () => (await act({ type: 'set-squad', instanceIds: squadDraft })) !== undefined}
                    inspect={setCodekinDetail}
                  />
                )}
                {tab === 'dex' && <DexView state={state} t={t} zh={zh} />}
                {tab === 'inventory' && (
                  <InventoryView
                    state={state}
                    t={t}
                    zh={zh}
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
              {codekinDetail !== undefined && (() => {
                const captured = state.creatures.find(row => row.instanceId === codekinDetail)
                const creature = captured === undefined ? undefined : creatureById(captured.creatureId)
                if (captured === undefined || creature === undefined) return null
                return (
                  <CodekinDetailModal
                    captured={captured}
                    creature={creature}
                    state={state}
                    t={t}
                    zh={zh}
                    busy={busy}
                    act={act}
                    dismiss={() => { setCodekinDetail(undefined) }}
                    release={() => {
                      setCodekinDetail(undefined)
                      setReleaseCandidate(captured.instanceId)
                    }}
                  />
                )
              })()}
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
          {starterCreatureIds().map((id) => {
            const creature = creatureById(id)!
            return (
              <button key={id} type="button" disabled={props.busy} onClick={() => { props.choose(id) }}>
                <CreatureSprite creature={creature} size="large" eager />
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
  const towerComplete = towerState.highestClearedFloor >= MAX_CONTENT_TOWER_FLOOR
  const tower = contentTowerFloorProfile(Math.min(MAX_CONTENT_TOWER_FLOOR, towerState.highestClearedFloor + 1))
  const towerBoss = creatureById(tower.creatureId)!
  const routeStart = Math.max(1, tower.floor - 2)
  const routeFloors = Array.from({ length: 5 }, (_, index) => Math.min(MAX_CONTENT_TOWER_FLOOR, routeStart + index))
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
          <CreatureSprite creature={towerBoss} size="large" eager />
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
            const profile = contentTowerFloorProfile(floor)
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

function CodekinView(props: {
  state: TraceWildSnapshot['state']
  t: TraceWildOverlayProps['t']
  zh: boolean
  draft: string[]
  setDraft: (value: string[]) => void
  busy: boolean
  save: () => Promise<boolean>
  inspect: (instanceId: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const toggle = (instanceId: string): void => {
    if (props.draft.includes(instanceId)) {
      if (props.draft.length > 1) props.setDraft(props.draft.filter(id => id !== instanceId))
      return
    }
    if (props.draft.length < 3) props.setDraft([...props.draft, instanceId])
  }
  const beginEditing = (): void => {
    props.setDraft([...props.state.squad])
    setEditing(true)
  }
  const cancelEditing = (): void => {
    props.setDraft([...props.state.squad])
    setEditing(false)
  }
  const save = async (): Promise<void> => {
    if (await props.save()) setEditing(false)
  }
  return (
    <div className={`${css.panelPage} ${editing ? css.codekinEditMode : ''}`}>
      <div className={css.pageHeading}>
        <div>
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
            : <button type="button" disabled={props.busy} onClick={beginEditing}>{props.t('editSquad')}</button>}
        </div>
      </div>
      <div className={css.creatureCards}>
        {props.state.creatures.map((captured) => {
          const creature = creatureById(captured.creatureId)
          if (creature === undefined) return null
          const position = props.draft.indexOf(captured.instanceId)
          const selectionLocked = editing && position < 0 && props.draft.length >= 3
          return (
            <article
              key={captured.instanceId}
              className={`${css.creatureCard} ${css.codekinCard} ${editing && position >= 0 ? css.creatureSelected : ''} ${selectionLocked ? css.codekinSelectionLocked : ''}`}
            >
              <span className={css.codekinNumber}>#{String(creature.number).padStart(2, '0')}</span>
              {editing && position >= 0 && <span className={css.partyIndex}>{position + 1}</span>}
              <button
                type="button"
                className={css.creatureSelect}
                aria-pressed={editing ? position >= 0 : undefined}
                aria-label={editing
                  ? `${creatureName(creature, props.zh)} · ${props.t('squadSelection', { count: props.draft.length })}`
                  : `${creatureName(creature, props.zh)} · ${props.t('codekinDetail')}`}
                onClick={() => { editing ? toggle(captured.instanceId) : props.inspect(captured.instanceId) }}
              >
                <CreatureSprite creature={creature} size="medium" />
                <strong>{creatureName(creature, props.zh)}</strong>
                <span className={css.codekinAttribute}>{props.t(ECOLOGY_KEYS[creature.ecology])}</span>
                <small>{props.t(RARITY_KEYS[creature.rarity])} · {props.t(CORE_KEYS[captured.quality])}</small>
              </button>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function CodekinDetailModal(props: {
  captured: CapturedCreature
  creature: CreatureDefinition
  state: TraceWildSnapshot['state']
  t: TraceWildOverlayProps['t']
  zh: boolean
  busy: boolean
  act: (action: TraceWildAction) => Promise<TraceWildActionResponse | undefined>
  dismiss: () => void
  release: () => void
}) {
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
        className={css.codekinDetailModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="codekin-detail-title"
        onClick={(event) => { event.stopPropagation() }}
      >
        <button
          type="button"
          className={css.codekinDetailClose}
          disabled={props.busy}
          onClick={props.dismiss}
          title={props.t('closeCodekinDetail')}
          aria-label={props.t('closeCodekinDetail')}
          autoFocus
        >
          <span aria-hidden="true">×</span>
        </button>
        <header className={css.codekinDetailHero}>
          <CreatureSprite creature={props.creature} size="large" eager />
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
            <b>Lv.{props.captured.level}</b>
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
                disabled={props.busy || props.captured.level >= MAX_PLAYER_LEVEL || props.state.materials[quality] <= 0}
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
        {creatureCatalog().map((creature) => {
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
}) {
  const stats = props.state.stats
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

const INTENT_DETAIL_KEYS: Record<EnemyIntent, TraceWildLocaleKey> = {
  strike: 'intentDetailStrike', guard: 'intentDetailGuard', disrupt: 'intentDetailDisrupt',
  corrupt: 'intentDetailCorrupt', mark: 'intentDetailMark', lock: 'intentDetailLock', freeze: 'intentDetailFreeze',
}

const SIGNAL_EFFECT_KEYS: Record<MatchSignalEffect['kind'], TraceWildLocaleKey> = {
  repair: 'signalRepair', guard: 'signalGuard', sync: 'signalSync',
  overclock: 'signalOverclock', breach: 'signalBreach',
}

const SIGNAL_RULE_KEYS: Record<TraceEcology, TraceWildLocaleKey> = {
  lumen: 'signalRuleLumen', forge: 'signalRuleForge', relay: 'signalRuleRelay',
  aegis: 'signalRuleAegis', glitch: 'signalRuleGlitch',
}

function BattleHoverDetail(props: { title: string; meta: string; body: string }) {
  return (
    <span className={css.battleHoverDetail} role="tooltip">
      <b>{props.title}</b>
      <small>{props.meta}</small>
      <span>{props.body}</span>
    </span>
  )
}

function tileLabel(tile: MatchTile, index: number, t: TraceWildOverlayProps['t']): string {
  const ecology = t(ECOLOGY_KEYS[tile.ecology])
  const special = tile.special === 'none' ? '' : ` · ${t(SPECIAL_KEYS[tile.special])}`
  const locked = (tile.lockedActions ?? 0) > 0 ? ` · ${t('lockedTile', { actions: tile.lockedActions ?? 0 })}` : ''
  const hazard = (tile.hazardActions ?? 0) > 0 ? ` · ${t('hazardTile', { actions: tile.hazardActions ?? 0 })}` : ''
  return `${ecology}${special}${locked}${hazard} · ${Math.floor(index / MATCH_BOARD_SIZE) + 1},${index % MATCH_BOARD_SIZE + 1}`
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

interface SignalReadout extends MatchSignalEffect {
  key: number
  actor: 'player' | 'boss'
}

interface RecoveryReadout {
  key: number
  actor: 'player' | 'boss'
  from: number
  to: number
  shieldFrom: number
  shieldTo: number
  settling: boolean
}

interface AttackPresentation extends TraceWildBattleStrike {
  key: number
  phase: 'flight' | 'impact'
}

function swipeTarget(index: number, deltaX: number, deltaY: number): number | undefined {
  const row = Math.floor(index / MATCH_BOARD_SIZE)
  const column = index % MATCH_BOARD_SIZE
  if (Math.abs(deltaX) >= Math.abs(deltaY)) {
    if (deltaX > 0 && column < MATCH_BOARD_SIZE - 1) return index + 1
    if (deltaX < 0 && column > 0) return index - 1
    return undefined
  }
  if (deltaY > 0 && row < MATCH_BOARD_SIZE - 1) return index + MATCH_BOARD_SIZE
  if (deltaY < 0 && row > 0) return index - MATCH_BOARD_SIZE
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
        : delta === MATCH_BOARD_SIZE
          ? css.tileSwapDown ?? ''
          : css.tileSwapUp ?? ''
  }
  return delta === 1
    ? css.tileSwapLeft ?? ''
    : delta === -1
      ? css.tileSwapRight ?? ''
    : delta === MATCH_BOARD_SIZE
        ? css.tileSwapUp ?? ''
        : css.tileSwapDown ?? ''
}

function BattleView(props: {
  state: TraceWildSnapshot['state']
  t: TraceWildOverlayProps['t']
  zh: boolean
  busy: boolean
  act: (action: TraceWildAction, present?: BattleActionPresenter) => Promise<TraceWildActionResponse | undefined>
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
  const [signalReadout, setSignalReadout] = useState<SignalReadout>()
  const [recoveryReadout, setRecoveryReadout] = useState<RecoveryReadout>()
  const [captureIntro, setCaptureIntro] = useState(false)
  const [partyHitKey, setPartyHitKey] = useState(0)
  const [attackPresentation, setAttackPresentation] = useState<AttackPresentation>()
  const [displayedWildHp, setDisplayedWildHp] = useState(battle.wildHp)
  const [displayedPartyHp, setDisplayedPartyHp] = useState(battle.partyHp)
  const [displayedWildShield, setDisplayedWildShield] = useState(battle.wildShield)
  const [displayedPartyShield, setDisplayedPartyShield] = useState(battle.partyShield)
  const displayedWildHpRef = useRef(battle.wildHp)
  const displayedPartyHpRef = useRef(battle.partyHp)
  const displayedWildShieldRef = useRef(battle.wildShield)
  const displayedPartyShieldRef = useRef(battle.partyShield)
  const gestureRef = useRef<TileGesture>()
  const draggedTileElement = useRef<HTMLButtonElement>()
  const bossActionInFlight = useRef(false)
  const bossActionTimer = useRef<number>()
  const swapTimer = useRef<number>()
  const motionTimers = useRef(new Map<number, () => void>())
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
  const showWildHp = useCallback((value: number): void => {
    displayedWildHpRef.current = value
    setDisplayedWildHp(value)
  }, [])
  const showPartyHp = useCallback((value: number): void => {
    displayedPartyHpRef.current = value
    setDisplayedPartyHp(value)
  }, [])
  const showWildShield = useCallback((value: number): void => {
    displayedWildShieldRef.current = value
    setDisplayedWildShield(value)
  }, [])
  const showPartyShield = useCallback((value: number): void => {
    displayedPartyShieldRef.current = value
    setDisplayedPartyShield(value)
  }, [])
  const resetDraggedTile = useCallback((element = draggedTileElement.current): void => {
    element?.style.setProperty('--drag-x', '0px')
    element?.style.setProperty('--drag-y', '0px')
  }, [])

  useEffect(() => {
    if (gesture !== undefined || draggedTileElement.current === undefined) return
    const element = draggedTileElement.current
    resetDraggedTile(element)
    const frame = window.requestAnimationFrame(() => {
      resetDraggedTile(element)
      if (draggedTileElement.current === element) draggedTileElement.current = undefined
    })
    return () => { window.cancelAnimationFrame(frame) }
  }, [gesture, resetDraggedTile])

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
    setSignalReadout(undefined)
    setRecoveryReadout(undefined)
    setVisualBoard(battle.board.map(tile => ({ ...tile })))
    setAttackPresentation(undefined)
    showWildHp(battle.wildHp)
    showPartyHp(battle.partyHp)
    showWildShield(battle.wildShield)
    showPartyShield(battle.partyShield)
  }, [battle.id, showPartyHp, showPartyShield, showWildHp, showWildShield])

  useEffect(() => { showWildHp(battle.wildHp) }, [battle.id, battle.wildHp, showWildHp])
  useEffect(() => { showPartyHp(battle.partyHp) }, [battle.id, battle.partyHp, showPartyHp])
  useEffect(() => { showWildShield(battle.wildShield) }, [battle.id, battle.wildShield, showWildShield])
  useEffect(() => { showPartyShield(battle.partyShield) }, [battle.id, battle.partyShield, showPartyShield])

  useEffect(() => {
    if (!animating) setVisualBoard(battle.board.map(tile => ({ ...tile })))
  }, [animating, battle.board])

  useEffect(() => {
    const previous = previousBattle.current
    if (previous.id !== battle.id) {
      previousBattle.current = { id: battle.id, wildHp: battle.wildHp, partyHp: battle.partyHp }
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
    if (previous.partyHp > battle.partyHp) setPartyHitKey(value => value + 1)
    previousBattle.current = { id: battle.id, wildHp: battle.wildHp, partyHp: battle.partyHp }
  }, [animating, battle.id, battle.lastTeamDamageApplied, battle.pendingTeamDamage, battle.wildHp, battle.partyHp])

  useEffect(() => () => {
    animationEpoch.current += 1
    if (bossActionTimer.current !== undefined) window.clearTimeout(bossActionTimer.current)
    if (swapTimer.current !== undefined) window.clearTimeout(swapTimer.current)
    if (suppressClickTimer.current !== undefined) window.clearTimeout(suppressClickTimer.current)
    if (captureIntroTimer.current !== undefined) window.clearTimeout(captureIntroTimer.current)
    for (const [timer, resolve] of motionTimers.current) {
      window.clearTimeout(timer)
      resolve()
    }
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
    motionTimers.current.set(timer, resolve)
  })

  const playCascade = async (
    animation: NonNullable<TraceWildActionResponse['animation']>,
    finalBattle: TraceWildSnapshot['state']['battle'],
  ): Promise<void> => {
    if (animation.battleId !== battle.id) return
    const epoch = ++animationEpoch.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setSignalReadout(undefined)
    setRecoveryReadout(undefined)
    for (const frame of animation.frames) {
      if (animationEpoch.current !== epoch) return
      const signalKey = Date.now() + frame.chain
      const frameEffect = frame.signalEffect
      if (frame.damage !== undefined && frame.damage > 0 && frame.totalDamage !== undefined) {
        setDamageReadout({
          key: Date.now() + frame.chain,
          actor: animation.actor === 'boss' ? 'boss' : 'player',
          total: frame.totalDamage,
          current: frame.damage,
          effectiveness: frame.effectiveness ?? 'neutral',
          settled: false,
        })
      }
      setSignalReadout(frameEffect === undefined
        ? undefined
        : {
            ...frameEffect,
            key: signalKey,
            actor: animation.actor === 'boss' ? 'boss' : 'player',
          })
      setFallRows(undefined)
      setVisualBoard(frame.before.map(tile => ({ ...tile })))
      setClearingTiles(new Set(frame.removed))
      setActiveChain(frame.chain)
      await pause(reducedMotion ? 20 : animation.actor === 'boss' ? 230 : 190)
      if (animationEpoch.current !== epoch) return
      setClearingTiles(undefined)
      setVisualBoard(frame.after.map(tile => ({ ...tile })))
      setFallRows(frame.fallRows)
      const longestFall = Math.max(...frame.fallRows)
      await pause(reducedMotion ? 20 : animation.actor === 'boss'
        ? Math.min(600, 310 + longestFall * 38)
        : Math.min(540, 270 + longestFall * 34))
      if (animationEpoch.current !== epoch) return
      setFallRows(undefined)
      await pause(reducedMotion ? 0 : animation.actor === 'boss' ? 70 : 45)
    }
    if (animationEpoch.current !== epoch) return
    setActiveChain(undefined)
    setSignalReadout(undefined)
    setRecoveryReadout(undefined)
    const finalBoard = finalBattle?.board ?? animation.frames.at(-1)?.after ?? battle.board
    setVisualBoard(finalBoard.map(tile => ({ ...tile })))
    if (animation.strike !== undefined) {
      setDamageReadout({
        key: Date.now(),
        actor: animation.strike.actor,
        total: animation.strike.damage,
        settled: false,
      })
      return
    }
    if (finalBattle === undefined) return
    if (animation.actor !== 'boss') {
      const total = finalBattle.pendingTeamDamage > 0
        ? finalBattle.pendingTeamDamage
        : finalBattle.lastTeamDamageApplied
      setDamageReadout(total > 0
        ? { key: Date.now(), actor: 'player', total, settled: finalBattle.pendingTeamDamage === 0 }
        : undefined)
    } else {
      const total = finalBattle.turnOwner === 'boss'
        ? finalBattle.pendingBossDamage
        : finalBattle.lastBossAttack
      setDamageReadout({
        key: Date.now(),
        actor: 'boss',
        total,
        settled: finalBattle.turnOwner !== 'boss',
      })
    }
  }

  const playStrike = async (
    strike: TraceWildBattleStrike,
    finalBattle: TraceWildSnapshot['state']['battle'],
  ): Promise<void> => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const key = Date.now()
    setAttackPresentation({ ...strike, key, phase: 'flight' })
    setDamageReadout({ key, actor: strike.actor, total: strike.damage, settled: false })
    await pause(reducedMotion ? 40 : 540)
    setAttackPresentation({ ...strike, key, phase: 'impact' })
    if (strike.actor === 'player') {
      showWildHp(strike.targetHpAfter)
      showWildShield(finalBattle?.wildShield ?? 0)
    } else {
      showPartyHp(strike.targetHpAfter)
      showPartyShield(finalBattle?.partyShield ?? 0)
      setPartyHitKey(value => value + 1)
    }
    previousBattle.current = strike.actor === 'player'
      ? { ...previousBattle.current, wildHp: strike.targetHpAfter }
      : { ...previousBattle.current, partyHp: strike.targetHpAfter }
    setDamageReadout({ key: key + 1, actor: strike.actor, total: strike.damage, settled: true })
    await pause(reducedMotion ? 40 : 340)
    setAttackPresentation(undefined)
  }

  const playRecovery = async (recovery: TraceWildBattleRecovery): Promise<void> => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const key = Date.now()
    if (recovery.actor === 'player') {
      showPartyHp(recovery.targetHpBefore)
      showPartyShield(recovery.targetShieldBefore)
    } else {
      showWildHp(recovery.targetHpBefore)
      showWildShield(recovery.targetShieldBefore)
    }
    setRecoveryReadout({
      key,
      actor: recovery.actor,
      from: recovery.targetHpBefore,
      to: recovery.targetHpAfter,
      shieldFrom: recovery.targetShieldBefore,
      shieldTo: recovery.targetShieldAfter,
      settling: false,
    })
    await pause(reducedMotion ? 30 : 360)
    setRecoveryReadout(value => value?.key === key ? { ...value, settling: true } : value)
    if (recovery.actor === 'player') {
      showPartyHp(recovery.targetHpAfter)
      showPartyShield(recovery.targetShieldAfter)
    } else {
      showWildHp(recovery.targetHpAfter)
      showWildShield(recovery.targetShieldAfter)
    }
    await pause(reducedMotion ? 30 : 620)
    setRecoveryReadout(value => value?.key === key ? undefined : value)
  }

  const presentBattleResponse: BattleActionPresenter = async response => {
    const animation = response.animation
    if (animation === undefined || animation.battleId !== battle.id) return
    const finalBattle = response.state.battle?.id === battle.id ? response.state.battle : undefined
    const motion = animation.swap
    if (motion !== undefined && animation.actor === 'boss') {
      setSwapMotion(motion)
      await pause(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 20 : 220)
      setSwapMotion(undefined)
    } else {
      setSwapMotion(undefined)
    }
    await playCascade(animation, finalBattle)
    if (animation.recovery !== undefined) await playRecovery(animation.recovery)
    if (animation.strike !== undefined) await playStrike(animation.strike, finalBattle)
  }

  const runBossAction = (): void => {
    if (battle.turnOwner !== 'boss' || props.busy || animating || bossActionInFlight.current) return
    bossActionInFlight.current = true
    setDamageReadout(current => current?.actor === 'boss'
      ? current
      : { key: Date.now(), actor: 'boss', total: 0, settled: false })
    setAnimating(true)
    void props.act({ type: 'battle-continue' }, presentBattleResponse).finally(() => {
      bossActionInFlight.current = false
      setSwapMotion(undefined)
      setClearingTiles(undefined)
      setFallRows(undefined)
      setActiveChain(undefined)
      setSignalReadout(undefined)
      setRecoveryReadout(undefined)
      setAnimating(false)
    })
  }

  useEffect(() => {
    if (battle.turnOwner !== 'boss' || props.busy || animating || bossActionInFlight.current) return
    bossActionTimer.current = window.setTimeout(() => {
      bossActionTimer.current = undefined
      runBossAction()
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 30 : BOSS_ACTION_PAUSE_MS)
    return () => {
      if (bossActionTimer.current !== undefined) window.clearTimeout(bossActionTimer.current)
      bossActionTimer.current = undefined
    }
  }, [battle.id, battle.turnOwner, battle.bossActionsRemaining, props.busy, animating])

  if ((battle.mode === 'wild' && encounter === undefined) || wild === undefined || active === undefined || activeDefinition === undefined) return null
  const availableCores = CAPTURE_CORE_QUALITIES.filter(quality => props.state.cores[quality] > 0)
  const captureReady = battle.mode === 'wild' && battle.captureWindow
  const playerStrikeLanded = attackPresentation?.actor === 'player' && attackPresentation.phase === 'impact'
    || displayedWildHp < battle.wildHp
  const bossStrikeLanded = attackPresentation?.actor === 'boss' && attackPresentation.phase === 'impact'
    || displayedPartyHp < battle.partyHp
  const bossDamageForecast = damageReadout?.actor === 'boss' && !damageReadout.settled
    ? Math.max(battle.pendingBossDamage, damageReadout.total)
    : battle.pendingBossDamage
  const predictedHp = playerStrikeLanded
    ? displayedWildHp
    : Math.max(0, displayedWildHp - Math.max(0, battle.pendingTeamDamage - displayedWildShield))
  const predictedPartyHp = bossStrikeLanded
    ? displayedPartyHp
    : Math.max(0, displayedPartyHp - Math.max(0, bossDamageForecast - displayedPartyShield))
  const partyDamagePreview = Math.max(0, displayedPartyHp - predictedPartyHp)
  const wildPendingHealing = recoveryReadout?.actor === 'boss'
    ? Math.max(0, recoveryReadout.to - recoveryReadout.from)
    : battle.pendingWildHealing
  const wildHealingFrom = recoveryReadout?.actor === 'boss' ? recoveryReadout.from : displayedWildHp
  const partyPendingHealing = recoveryReadout?.actor === 'player'
    ? Math.max(0, recoveryReadout.to - recoveryReadout.from)
    : battle.pendingPartyHealing
  const partyHealingFrom = recoveryReadout?.actor === 'player' ? recoveryReadout.from : displayedPartyHp
  const visibleWildShield = recoveryReadout?.actor === 'boss'
    ? recoveryReadout.shieldTo
    : displayedWildShield + battle.pendingWildShielding
  const visiblePartyShield = recoveryReadout?.actor === 'player'
    ? recoveryReadout.shieldTo
    : displayedPartyShield + battle.pendingPartyShielding
  const amplifierTitle = (amplifier: BattleAmplifier, owner: 'player' | 'boss'): string => {
    const stat = amplifier.stat === 'attack'
      ? props.zh ? '攻击增幅' : 'Attack boost'
      : props.zh ? '防御穿透' : 'Defense penetration'
    const scope = amplifier.scope === 'team'
      ? props.zh ? '全队' : 'Whole squad'
      : amplifier.scope === 'member'
        ? (() => {
            const member = battle.party.find(value => value.instanceId === amplifier.targetInstanceId)
            const definition = member === undefined ? undefined : creatureById(member.creatureId)
            return definition === undefined ? props.zh ? '单体' : 'Single ally' : creatureName(definition, props.zh)
          })()
        : amplifier.scope === 'self'
          ? props.zh ? '自身' : 'Self'
          : props.zh ? '对手' : 'Opponent'
    const rounds = props.zh
      ? `剩余 ${amplifier.remainingRounds} 回合`
      : `${amplifier.remainingRounds} round${amplifier.remainingRounds === 1 ? '' : 's'} left`
    const value = `${amplifier.valuePermille / 10}%`
    const source = props.t(SIGNAL_EFFECT_KEYS[amplifier.signal])
    return owner === 'boss'
      ? `${source} · ${stat} · ${scope} · ${rounds}`
      : `${source} · ${stat} +${value} · ${scope} · ${rounds}`
  }
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
  const bossHazardLimit = Math.min(6, 2 + battle.bossSkillTier)
  const bossLockLimit = Math.min(5, Math.max(3, battle.bossSkillTier))
  const bossSkillTitle = props.t('towerSkillTier', { tier: battle.bossSkillTier })
  const bossSkillMeta = `${props.t('bossEnergy')} ${battle.bossEnergy}/24`
  const bossSkillBody = `${props.t('bossSkillTierDetail', {
    tier: battle.bossSkillTier,
    hazards: bossHazardLimit,
    locks: bossLockLimit,
  })} ${battle.bossSkillArmed
    ? props.t('bossSkillReadyDetail')
    : props.t('bossSkillChargingDetail', { remaining: Math.max(0, 24 - battle.bossEnergy) })}`
  const bossSkillLabel = `${bossSkillTitle}. ${bossSkillMeta}. ${bossSkillBody}`
  const enemyIntentTitle = props.t(INTENT_KEYS[battle.enemyIntent])
  const enemyIntentMeta = props.t('enemyIntentMeta', { target: enemyTarget })
  const enemyIntentBody = props.t(INTENT_DETAIL_KEYS[battle.enemyIntent], {
    count: battle.enemyIntent === 'corrupt' ? bossHazardLimit : bossLockLimit,
  })
  const enemyIntentLabel = `${enemyIntentTitle}. ${enemyIntentMeta}. ${enemyIntentBody}`
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
      void props.act({ type: 'battle-swap', from, to }, presentBattleResponse).finally(() => {
        setSwapMotion(undefined)
        setClearingTiles(undefined)
        setFallRows(undefined)
        setActiveChain(undefined)
        setSignalReadout(undefined)
        setRecoveryReadout(undefined)
        setAnimating(false)
      })
    }, 130)
  }

  const castSkill = (creatureInstanceId: string): void => {
    if (boardLocked) return
    setAnimating(true)
    void props.act({ type: 'battle-cast', creatureInstanceId }, presentBattleResponse).finally(() => {
      setClearingTiles(undefined)
      setFallRows(undefined)
      setActiveChain(undefined)
      setSignalReadout(undefined)
      setRecoveryReadout(undefined)
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

  const moveGesture = (
    index: number,
    clientX: number,
    clientY: number,
    tileSize: number,
    element: HTMLButtonElement,
  ): void => {
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
    element.style.setProperty('--drag-x', `${nextGesture.offsetX}px`)
    element.style.setProperty('--drag-y', `${nextGesture.offsetY}px`)
    const threshold = Math.max(15, tileSize * 0.28)
    if (Math.max(Math.abs(offsetX), Math.abs(offsetY)) < threshold) return
    const target = swipeTarget(index, offsetX, offsetY)
    if (target === undefined) return
    resetDraggedTile(element)
    gestureRef.current = undefined
    suppressNextClick(350)
    swap(index, target)
  }

  return (
    <div className={css.battleBackdrop}>
      <section className={`${css.battlePanel} ${partyHitKey > 0 ? css.battleWasHit : ''}`} role="dialog" aria-modal="true" aria-label={battle.mode === 'tower' ? props.t('towerBattle') : props.t('battle')}>
        {attackPresentation !== undefined && (
          <div
            key={attackPresentation.key}
            className={`${css.attackSequence} ${attackPresentation.actor === 'player' ? css.attackSequencePlayer : css.attackSequenceBoss} ${attackPresentation.phase === 'impact' ? css.attackSequenceImpact : ''}`}
            role="img"
            aria-label={`${props.t(attackPresentation.actor === 'boss' ? 'enemyDamage' : 'totalDamage')} ${attackPresentation.damage}`}
          >
            <i className={css.attackWave} aria-hidden="true" />
            <span className={css.attackImpact} aria-hidden="true" />
          </div>
        )}
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

        <div className={`${css.wildBanner} ${encounter?.enhanced === true || battle.mode === 'tower' ? css.fighterEnhanced : ''} ${playerStrikeLanded ? css.wildWasHit : ''}`} key={battle.id}>
          <div className={css.enemyAura} aria-hidden="true" />
          <CreatureSprite creature={wild} size="medium" eager />
          <div className={css.wildVitals}>
            <div className={css.fighterName}>
              <strong>{creatureName(wild, props.zh)}</strong>
              <span
                className={battle.mode === 'tower' ? css.battleHoverTrigger : undefined}
                {...(battle.mode === 'tower' ? { tabIndex: 0, 'aria-label': bossSkillLabel } : {})}
              >
                Lv.{battle.wildLevel} · {props.t(CORE_KEYS[battle.wildQuality])} · {props.t(ECOLOGY_KEYS[wild.ecology])}
                {battle.mode === 'tower' && (
                  <> · {bossSkillTitle}<BattleHoverDetail title={bossSkillTitle} meta={bossSkillMeta} body={bossSkillBody} /></>
                )}
              </span>
            </div>
            <div className={`${css.hpBar} ${css.hpWild}`}>
              <em style={{ width: `${percent(predictedHp, battle.wildMaxHp)}%` }} />
              <i style={{ width: `${percent(displayedWildHp, battle.wildMaxHp)}%` }} />
              {wildPendingHealing > 0 && (
                <span
                  key={recoveryReadout?.actor === 'boss' ? recoveryReadout.key : `wild-heal-${battle.turn}`}
                  className={`${css.hpHealingBudget} ${recoveryReadout?.actor === 'boss' && recoveryReadout.settling ? css.hpHealingSettling : ''}`}
                  style={{
                    left: `${percent(wildHealingFrom, battle.wildMaxHp)}%`,
                    width: `${percent(wildPendingHealing, battle.wildMaxHp)}%`,
                  }}
                />
              )}
              {visibleWildShield > 0 && (
                <b
                  className={`${css.hpShieldBar} ${signalReadout?.actor === 'boss' && signalReadout.kind === 'guard' ? css.hpShieldActive : ''}`}
                  style={{ width: `${percent(visibleWildShield, battle.wildMaxHp)}%` }}
                />
              )}
            </div>
            <div className={css.wildHpNumbers}>
              <div className={css.enemyModifierStrip}>
                {battle.bossAmplifiers.map(amplifier => (
                  <span
                    key={`${amplifier.signal}-${amplifier.stat}-${amplifier.scope}`}
                    className={`${css.combatModifierIcon} ${amplifier.stat === 'attack' ? css.modifierAttack : css.modifierPierce}`}
                    data-tooltip={amplifierTitle(amplifier, 'boss')}
                    aria-label={amplifierTitle(amplifier, 'boss')}
                    tabIndex={0}
                  >{amplifier.stat === 'attack' ? '⚔' : '◇'}</span>
                ))}
                {visibleWildShield > 0 && (
                  <span
                    className={`${css.combatModifierIcon} ${css.modifierDefense}`}
                    data-tooltip={`${props.t('shield')} · ${visibleWildShield.toLocaleString()}`}
                    aria-label={`${props.t('shield')} ${visibleWildShield.toLocaleString()}`}
                    tabIndex={0}
                  >⬢</span>
                )}
              </div>
              {wildPendingHealing > 0 && (
                <em className={css.hpHealingValue}>+{wildPendingHealing.toLocaleString()}</em>
              )}
              <strong>{props.t('health')} {displayedWildHp.toLocaleString()}/{battle.wildMaxHp.toLocaleString()}</strong>
            </div>
            <small>
              {props.t('armor')} {battle.wildArmor}
              {battle.pendingTeamDamage > 0 ? ` · ${props.t('pendingDamage')} ${battle.pendingTeamDamage.toLocaleString()}` : ''}
            </small>
            <div className={css.energyBar}><i style={{ width: `${percent(battle.bossEnergy, 24)}%` }} /></div>
            <small
              className={css.battleHoverTrigger}
              tabIndex={0}
              aria-label={bossSkillLabel}
            >
              {props.t('bossEnergy')} {battle.bossEnergy}/24 · {battle.bossSkillArmed ? props.t('skillReady') : props.t('skillCharging')}
              {battle.turnOwner === 'boss' ? ` · ${props.t('bossCharge')} ${battle.bossAttackCharge.toFixed(1)}` : ''}
              <BattleHoverDetail title={bossSkillTitle} meta={bossSkillMeta} body={bossSkillBody} />
            </small>
          </div>
          <div
            className={`${css.enemyIntent} ${css.battleHoverTrigger}`}
            tabIndex={0}
            aria-label={enemyIntentLabel}
          >
            <span>{props.t('enemyIntent')}</span>
            <strong>{enemyIntentTitle}</strong>
            <small>{enemyTarget}</small>
            <BattleHoverDetail title={enemyIntentTitle} meta={enemyIntentMeta} body={enemyIntentBody} />
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
                const isActive = battle.turnOwner === 'player' && index === battle.activeIndex
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
                      <CreatureSprite creature={creature} size="small" eager />
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
                <div className={css.sharedHpNumbers}>
                  {partyPendingHealing > 0 && (
                    <em className={css.hpHealingValue}>+{partyPendingHealing.toLocaleString()}</em>
                  )}
                  {visiblePartyShield > 0 && <small>{props.t('shield')} +{visiblePartyShield.toLocaleString()}</small>}
                  <strong>{displayedPartyHp.toLocaleString()} / {battle.partyMaxHp.toLocaleString()}</strong>
                </div>
              </div>
              <div className={`${css.hpBar} ${css.hpTeam}`}>
                <i style={{ width: `${percent(displayedPartyHp, battle.partyMaxHp)}%` }} />
                <em
                  style={{
                    left: `${percent(predictedPartyHp, battle.partyMaxHp)}%`,
                    width: `${percent(displayedPartyHp - predictedPartyHp, battle.partyMaxHp)}%`,
                  }}
                />
                {partyPendingHealing > 0 && (
                  <span
                    key={recoveryReadout?.actor === 'player' ? recoveryReadout.key : `party-heal-${battle.turn}`}
                    className={`${css.hpHealingBudget} ${recoveryReadout?.actor === 'player' && recoveryReadout.settling ? css.hpHealingSettling : ''}`}
                    style={{
                      left: `${percent(partyHealingFrom, battle.partyMaxHp)}%`,
                      width: `${percent(partyPendingHealing, battle.partyMaxHp)}%`,
                    }}
                  />
                )}
                {visiblePartyShield > 0 && (
                  <b
                    className={`${css.hpShieldBar} ${signalReadout?.actor === 'player' && signalReadout.kind === 'guard' ? css.hpShieldActive : ''}`}
                    style={{ width: `${percent(visiblePartyShield, battle.partyMaxHp)}%` }}
                  />
                )}
              </div>
              {partyDamagePreview > 0 && <small className={css.teamDamageForecast}>{props.t('pendingDamage')} -{partyDamagePreview.toLocaleString()}</small>}
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
              {battle.turnOwner === 'player' && battle.partyAmplifiers.length > 0 && (
                <div className={css.playerModifierStrip} aria-label={props.zh ? '队伍增幅' : 'Squad amplifiers'}>
                  {battle.partyAmplifiers.map(amplifier => (
                    <span
                      key={`${amplifier.signal}-${amplifier.stat}-${amplifier.scope}-${amplifier.targetInstanceId ?? 'all'}`}
                      className={`${css.combatModifierIcon} ${css.playerModifierIcon} ${amplifier.stat === 'attack' ? css.modifierAttack : css.modifierPierce}`}
                      data-tooltip={amplifierTitle(amplifier, 'player')}
                      aria-label={amplifierTitle(amplifier, 'player')}
                      tabIndex={0}
                    >
                      <b>{amplifier.valuePermille / 10}</b><small>%</small>
                    </span>
                  ))}
                </div>
              )}
              {battle.turnOwner === 'player' && (
                <button
                  type="button"
                  className={css.turnSkipButton}
                  disabled={locked}
                  title={battle.captureWindow ? props.t('abandonCapture') : props.t('skipStageHint')}
                  onClick={() => {
                    void props.act(battle.captureWindow || battle.actionsRemaining === 0
                      ? { type: 'battle-continue' }
                      : { type: 'battle-skip-stage' }, presentBattleResponse)
                  }}
                >
                  {props.t('skipTurn')}
                </button>
              )}
              <span className={css.actionDots} aria-label={`${battle.turnOwner === 'boss' ? props.t('bossMoves') : props.t('movesRemaining')} ${battle.turnOwner === 'boss' ? battle.bossActionsRemaining : battle.actionsRemaining}`}>
                {[0, 1, 2, 3, 4].map(index => <i key={index} className={index < (battle.turnOwner === 'boss' ? battle.bossActionsRemaining : battle.actionsRemaining) ? css.actionDotActive : ''} />)}
              </span>
              {activeChain !== undefined && <span className={css.cascadePill}>CHAIN {activeChain}</span>}
            </div>
            <div className={css.boardStage}>
              {battle.turnOwner === 'boss' && (
                <div className={css.enemyActionAlert} role="status" aria-live="polite">
                  <i aria-hidden="true" />
                  <strong>{props.t('enemyActing')}</strong>
                  <span>ENEMY TURN</span>
                </div>
              )}
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
                  '--tile-row': Math.floor(index / MATCH_BOARD_SIZE),
                  '--drag-x': `${dragging ? gesture.offsetX : 0}px`,
                  '--drag-y': `${dragging ? gesture.offsetY : 0}px`,
                  '--fall-y': `${fallDistance * -110}%`,
                  '--fall-duration': `${240 + fallDistance * 34}ms`,
                  '--fall-delay': `${(index % MATCH_BOARD_SIZE) * 8}ms`,
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
                      draggedTileElement.current = event.currentTarget
                      resetDraggedTile(event.currentTarget)
                      const nextGesture = { index, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, offsetX: 0, offsetY: 0 }
                      gestureRef.current = nextGesture
                      setGesture(nextGesture)
                    }}
                    onPointerMove={(event) => {
                      if (gestureRef.current?.pointerId !== event.pointerId) return
                      event.preventDefault()
                      moveGesture(index, event.clientX, event.clientY, event.currentTarget.clientWidth, event.currentTarget)
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
                      resetDraggedTile(event.currentTarget)
                      setGesture(undefined)
                      if (target !== undefined) swap(index, target)
                    }}
                    onPointerCancel={(event) => {
                      gestureRef.current = undefined
                      resetDraggedTile(event.currentTarget)
                      setGesture(undefined)
                    }}
                    onLostPointerCapture={(event) => {
                      if (gestureRef.current?.pointerId !== event.pointerId) return
                      gestureRef.current = undefined
                      resetDraggedTile(event.currentTarget)
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
                </section>
              )}
            </div>
            <p className={css.boardHelp}>{props.t('boardHelp')}</p>
            <p className={`${css.signalRule} ${css[`signalRule_${battle.turnOwner === 'boss' ? wild.ecology : activeDefinition.ecology}`]}`}>
              {props.t(SIGNAL_RULE_KEYS[battle.turnOwner === 'boss' ? wild.ecology : activeDefinition.ecology])}
              {battle.turnOwner === 'boss' ? ` ${props.t('signalBossRule')}` : ''}
            </p>
          </div>

          {battle.mode === 'tower' && (
            <div className={css.towerBattleStatus}>
              <span className={css.towerBattleMark} aria-hidden="true">▲</span>
              <div>
                <strong>{props.t('towerNoCapture')}</strong>
                <small>{props.t('towerBattleReward', { floor: battle.towerFloor ?? 1 })}</small>
              </div>
              <b
                className={css.battleHoverTrigger}
                tabIndex={0}
                aria-label={bossSkillLabel}
              >
                {bossSkillTitle}
                <BattleHoverDetail title={bossSkillTitle} meta={bossSkillMeta} body={bossSkillBody} />
              </b>
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
