import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import { CAPTURE_CORE_QUALITIES } from '../../../content-sdk/src/types.ts'
import {
  CORE_CAPTURE_POWER,
  MATERIAL_XP,
  captureChance,
} from '../../../engine/src/balance.ts'
import { MATCH_BOARD_SIZE, areAdjacentTiles } from '../../../engine/src/match3.ts'
import type {
  BattleAmplifier,
  CaptureCoreQuality,
  CreatureDefinition,
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
import { BATTLE_MOTION, cascadeFallTime, tileFallTime } from '../battle-motion.ts'
import { CodekinMapView } from './CodekinMapView.tsx'
import { BattleStage } from './BattleStage.tsx'
import { CodekinDetailModal, CodekinView } from './CodekinRosterView.tsx'
import type { CreatureLook } from '../appearance-presentation.ts'
import {
  CORE_KEYS,
  CreatureSprite,
  ECOLOGY_KEYS,
  creatureName,
} from './creature-presentation.tsx'
import { useDialogAccessibility } from './dialog-accessibility.ts'
import { boardNeighbour, projectRelease, readUiPreferences, saveUiPreferences } from '../motion.ts'
import { useParticleField, useReducedMotion, useSpringAnimation } from './use-motion.ts'
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
  velocity: WindowPosition
  lastX: number
  lastY: number
  lastTime: number
}

function sampleDrag(drag: WindowDragState, event: ReactPointerEvent<HTMLElement>): void {
  const now = performance.now()
  const dt = Math.max(8, now - drag.lastTime) / 1000
  drag.velocity = {
    x: Math.max(-1500, Math.min(1500, (event.clientX - drag.lastX) / dt * 0.55 + drag.velocity.x * 0.45)),
    y: Math.max(-1500, Math.min(1500, (event.clientY - drag.lastY) / dt * 0.55 + drag.velocity.y * 0.45)),
  }
  drag.lastX = event.clientX
  drag.lastY = event.clientY
  drag.lastTime = now
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
  | { kind: 'creature'; creatureId: string; quality: CaptureCoreQuality; quantity: 1; captured?: CreatureLook }

type BattleTransitionKind = 'tower-cleared' | 'wild-defeated' | 'capture-success' | 'capture-failed' | 'battle-lost'

interface BattleTransition {
  key: number
  kind: BattleTransitionKind
}

type BattleActionPresenter = (response: TraceWildActionResponse) => Promise<void>

export type TraceWildOverlayProps = PropsRuntime<'shell.overlay'> & PropsLocale<'tracewild'>

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
      items.push({ kind: 'creature', creatureId: creature.creatureId, quality: creature.quality, quantity: 1, captured: creature })
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
      {creature !== undefined && <CreatureSprite creature={creature} captured={props.item.kind === 'creature' ? props.item.captured : undefined} size={props.compact ? 'tiny' : 'small'} />}
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
  const dialog = useDialogAccessibility(props.dismiss)
  return (
    <div
      className={css.rewardBackdrop}
      onClick={(event) => { if (event.target === event.currentTarget) props.dismiss() }}
    >
      <section
        ref={dialog.dialogRef}
        className={css.rewardModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tracewild-reward-title"
        tabIndex={-1}
        onKeyDown={dialog.onDialogKeyDown}
      >
        <span className={css.rewardHalo} aria-hidden="true" />
        <p>{props.t('rewardKicker')}</p>
        <h2 id="tracewild-reward-title">{props.t('rewardTitle')}</h2>
        <div className={css.rewardItems}>
          {props.items.map((item, index) => (
            <RewardItemTile key={`${item.kind}-${item.quality}-${item.kind === 'creature' ? item.creatureId : index}`} item={item} t={props.t} zh={props.zh} />
          ))}
        </div>
        <button type="button" className={css.rewardDismissButton} data-dialog-initial-focus onClick={props.dismiss}>
          {props.t('rewardDismiss')}
        </button>
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
  const dialog = useDialogAccessibility(props.dismiss, props.busy)
  return (
    <div
      className={css.modalBackdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !props.busy) props.dismiss()
      }}
    >
      <section
        ref={dialog.dialogRef}
        className={css.releaseModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="codekin-release-title"
        tabIndex={-1}
        onKeyDown={dialog.onDialogKeyDown}
        onMouseDown={(event) => { event.stopPropagation() }}
      >
        <header>
          <CreatureSprite creature={props.creature} captured={props.captured} size="medium" />
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
          <button type="button" data-dialog-initial-focus disabled={props.busy} onClick={props.dismiss}>{props.t('releaseCancel')}</button>
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
  const [windowPosition, setWindowPosition] = useState<WindowPosition>(() => readUiPreferences().windowPosition ?? { x: 0, y: 0 })
  const [draggingWindow, setDraggingWindow] = useState(false)
  const [launcherPosition, setLauncherPosition] = useState<WindowPosition | undefined>(() => readUiPreferences().launcherPosition)
  const [draggingLauncher, setDraggingLauncher] = useState(false)
  const [squadDraft, setSquadDraft] = useState<string[]>([])
  const [codekinDetail, setCodekinDetail] = useState<string>()
  const [rewardQueue, setRewardQueue] = useState<AcquiredItem[][]>([])
  const [releaseCandidate, setReleaseCandidate] = useState<string>()
  const [battleTransition, setBattleTransition] = useState<BattleTransition>()
  const [motionPreference, setMotionPreference] = useState(() => readUiPreferences().reducedMotion)
  const { reducedMotion, systemReducedMotion } = useReducedMotion(motionPreference)
  const windowSpring = useSpringAnimation(reducedMotion)
  const launcherSpring = useSpringAnimation(reducedMotion)
  const effects = useParticleField(reducedMotion, css.motionParticle!)
  const [squadEditing, setSquadEditing] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<Tab | 'close'>()
  const hasOpened = useRef(false)
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
  const rewardVisible = rewardQueue[0] !== undefined && snapshot?.state.starterChosen === true
    && snapshot.state.battle === undefined && codekinDetail === undefined
    && releaseCandidate === undefined && pendingNavigation === undefined

  const navigate = useCallback((target: Tab | 'close'): void => {
    setPendingNavigation(undefined)
    setSquadEditing(false)
    if (target === 'close') setOpen(false)
    else setTab(target)
  }, [])
  const requestNavigation = useCallback((target: Tab | 'close'): void => {
    if (target === tab) return
    if (squadEditing && squadDraft.join('|') !== latestSnapshot.current?.state.squad.join('|')) {
      setPendingNavigation(target)
    } else navigate(target)
  }, [navigate, squadDraft, squadEditing, tab])

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

  const receiveSnapshot = useCallback((value: TraceWildSnapshot, allowClockRefresh = false): void => {
    if (!actionInFlight.current) { adoptSnapshot(value, allowClockRefresh); return }
    // Both refreshes and subscriptions can see the committed turn before its
    // presentation finishes. Keep the newest snapshot behind that presentation.
    const pending = pendingSnapshot.current
    if (pending !== undefined) {
      const sameProfile = value.state.createdAt === pending.state.createdAt
      if (sameProfile && (value.state.revision < pending.state.revision
        || value.state.revision === pending.state.revision && value.serverTime <= pending.serverTime)) return
      if (!sameProfile && value.serverTime < pending.serverTime) return
    }
    pendingSnapshot.current = value
  }, [adoptSnapshot])

  const refresh = useCallback(async (signal?: AbortSignal) => {
    try {
      const [content, value] = await Promise.all([
        connection.loadContent(signal),
        connection.load(signal),
      ])
      activateCodekinContent(content)
      receiveSnapshot(value, true)
      setOnline(true)
    } catch {
      if (signal?.aborted !== true) setOnline(false)
    }
  }, [receiveSnapshot, connection])

  useEffect(() => {
    const controller = new AbortController()
    void refresh(controller.signal)
    return () => { controller.abort() }
  }, [refresh])

  useEffect(() => {
    if (snapshot?.state.enabled !== true) return
    const unsubscribe = connection.subscribe((value) => {
      receiveSnapshot(value)
    }, setOnline)
    return unsubscribe
  }, [receiveSnapshot, connection, snapshot?.state.enabled])

  useEffect(() => {
    const onSettingsChanged = (): void => { void refresh() }
    return subscribeTraceWildSettingsChanged(onSettingsChanged)
  }, [refresh])

  useEffect(() => () => {
    if (pulseTimer.current !== undefined) window.clearTimeout(pulseTimer.current)
  }, [])

  useEffect(() => {
    if (snapshot !== undefined && !squadEditing) setSquadDraft([...snapshot.state.squad])
  }, [snapshot?.state.revision, squadEditing])

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
    const timer = window.setTimeout(() => { setNotice(undefined) }, 4_500)
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
      if (event.key !== 'Escape' || event.defaultPrevented || busy
        || (event.target instanceof Element && event.target.closest('[role="dialog"]') !== null)) return
      if (rewardVisible) setRewardQueue(queue => queue.slice(1))
      else if (releaseCandidate !== undefined) setReleaseCandidate(undefined)
      else if (codekinDetail !== undefined) setCodekinDetail(undefined)
      else if (snapshot?.state.battle === undefined) requestNavigation('close')
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  }, [busy, codekinDetail, open, releaseCandidate, requestNavigation, rewardVisible, snapshot?.state.battle])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const rect = overlayElement.current?.getBoundingClientRect()
      if (open && rect !== undefined) {
        setWindowPosition(value => clampWindowPosition(value.x, value.y, rect.width, rect.height))
        // A child dialog owns initial focus when present.
        if (overlayElement.current?.querySelector('[role="dialog"]') === null) {
          overlayElement.current.querySelector<HTMLButtonElement>('nav button[aria-current="page"]')?.focus()
        }
        hasOpened.current = true
      } else if (!open) {
        const launcherRect = launcherElement.current?.getBoundingClientRect()
        if (launcherRect !== undefined) setLauncherPosition(value => value === undefined ? undefined
          : clampFloatingPosition(value.x, value.y, launcherRect.width, launcherRect.height))
        if (hasOpened.current) launcherElement.current?.focus()
      }
    })
    return () => { cancelAnimationFrame(frame) }
  }, [open])

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
    windowSpring.stop()
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    windowDrag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: pendingWindowPosition.current?.x ?? windowPosition.x,
      y: pendingWindowPosition.current?.y ?? windowPosition.y,
      width: rect.width,
      height: rect.height,
      velocity: { x: 0, y: 0 }, lastX: event.clientX, lastY: event.clientY, lastTime: performance.now(),
    }
    pendingWindowPosition.current = { x: windowDrag.current.x, y: windowDrag.current.y }
    setDraggingWindow(true)
  }

  const moveWindowDrag = (event: ReactPointerEvent<HTMLElement>): void => {
    const drag = windowDrag.current
    if (drag === undefined || drag.pointerId !== event.pointerId) return
    sampleDrag(drag, event)
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
    const drag = windowDrag.current
    windowDrag.current = undefined
    const next = pendingWindowPosition.current
    if (next !== undefined) {
      const velocity = event.type === 'pointercancel' || performance.now() - drag.lastTime > 90 ? { x: 0, y: 0 } : drag.velocity
      const projected = reducedMotion ? next : projectRelease(next, velocity)
      const target = clampWindowPosition(projected.x, projected.y, drag.width, drag.height)
      windowSpring.animate(next, target, velocity, point => {
        const bounded = clampWindowPosition(point.x, point.y, drag.width, drag.height)
        pendingWindowPosition.current = bounded
        overlayElement.current?.style.setProperty('--window-x', `${bounded.x}px`)
        overlayElement.current?.style.setProperty('--window-y', `${bounded.y}px`)
      }, point => {
        pendingWindowPosition.current = undefined
        setWindowPosition(point)
        saveUiPreferences({ windowPosition: point })
      })
    }
    setDraggingWindow(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const beginLauncherDrag = (event: ReactPointerEvent<HTMLButtonElement>): void => {
    if (event.button !== 0) return
    launcherSpring.stop()
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
      velocity: { x: 0, y: 0 }, lastX: event.clientX, lastY: event.clientY, lastTime: performance.now(),
    }
    pendingLauncherPosition.current = { x: rect.left, y: rect.top }
    setDraggingLauncher(true)
  }

  const moveLauncherDrag = (event: ReactPointerEvent<HTMLButtonElement>): void => {
    const drag = launcherDrag.current
    if (drag === undefined || drag.pointerId !== event.pointerId) return
    sampleDrag(drag, event)
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
    const drag = launcherDrag.current
    launcherDrag.current = undefined
    const next = pendingLauncherPosition.current
    pendingLauncherPosition.current = undefined
    if (next !== undefined && launcherWasDragged.current) {
      const velocity = event.type === 'pointercancel' || performance.now() - drag.lastTime > 90 ? { x: 0, y: 0 } : drag.velocity
      const projected = projectRelease(next, reducedMotion ? { x: 0, y: 0 } : velocity)
      const target = clampFloatingPosition(
        projected.x + drag.width / 2 < window.innerWidth / 2 ? 12 : window.innerWidth - drag.width - 12,
        projected.y, drag.width, drag.height,
      )
      launcherSpring.animate(next, target, velocity, point => {
        const element = launcherElement.current
        if (element !== null) { element.style.left = `${point.x}px`; element.style.top = `${point.y}px` }
      }, point => { setLauncherPosition(point); saveUiPreferences({ launcherPosition: point }) })
    }
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
          window.setTimeout(resolve, transitionKind === 'capture-failed' ? 900 : 1200)
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
          setNotice(action.type === 'set-creature-appearance' ? t('appearanceFailed') : action.type === 'claim-idle-reward'
            ? t('rewardUnavailable')
            : battleAction
              ? t('battleActionUnavailable')
              : t('invalidSwap'))
        }
      } else {
        setNotice(action.type === 'set-creature-appearance' ? t('appearanceFailed') : error instanceof TraceWildConnectionError && error.code === 'conflict'
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
      if (pending !== undefined) adoptSnapshot(pending, true)
      setBusy(false)
    }
    return undefined
  }, [adoptSnapshot, busy, connection, reducedMotion, refresh, t])

  const state = snapshot?.state
  const uncaught = state?.encounters.length ?? 0
  const pendingIdleReward = state?.idle.pendingReward
  const modalOpen = state !== undefined && (!state.starterChosen || state.battle !== undefined
    || rewardVisible || codekinDetail !== undefined || releaseCandidate !== undefined || pendingNavigation !== undefined)
  const inertBackground = (element: HTMLElement | null): void => { if (element !== null) element.inert = modalOpen }
  const claimIdleReward = (): void => {
    setOpen(true)
    void act({ type: 'claim-idle-reward' })
  }

  if (state?.enabled === false) return null

  const launcher = (
    <button
      ref={launcherElement}
      data-motion={reducedMotion ? 'reduce' : 'full'}
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
        data-codekin-ui="reload"
        data-motion={reducedMotion ? 'reduce' : 'full'}
        onPointerDownCapture={(event) => {
          if (event.button === 0 && event.target instanceof Element
            && event.target.closest('button:not(:disabled):not([role="gridcell"])') !== null) {
            effects.burst(event.clientX, event.clientY, '#7ef5ff', 5)
          }
        }}
        className={`${css.overlay} ${draggingWindow ? css.overlayDragging : ''} ${windowPosition.x > 140 ? css.overlayDockedRight : ''}`}
        style={{ '--window-x': `${windowPosition.x}px`, '--window-y': `${windowPosition.y}px` } as CSSProperties}
        aria-label={t('title')}
      >
        <div ref={inertBackground} className={css.windowTools}>
        {pendingIdleReward !== undefined && (
          <IdleRewardButton reward={pendingIdleReward} t={t} zh={zh} busy={busy} claim={claimIdleReward} />
        )}
        <button type="button" className={css.motionToggle} aria-pressed={reducedMotion}
          title={t(systemReducedMotion && motionPreference === undefined ? 'systemMotion' : 'reduceMotion')} aria-label={t('reduceMotion')}
          onClick={() => { setMotionPreference(!reducedMotion); saveUiPreferences({ reducedMotion: !reducedMotion }) }}>
          <span aria-hidden="true">{reducedMotion ? '◉' : '≈'}</span>
        </button>
        <button type="button" className={css.windowReset} title={t('resetWindow')} aria-label={t('resetWindow')}
          onClick={() => { windowSpring.stop(); pendingWindowPosition.current = undefined; setWindowPosition({ x: 0, y: 0 }); saveUiPreferences({ windowPosition: { x: 0, y: 0 } }) }}>↙</button>
        <button type="button" className={css.windowClose} onClick={() => { requestNavigation('close') }} title={t('close')} aria-label={t('close')}>
          <span aria-hidden="true">×</span>
        </button>
        </div>
        <header
          ref={inertBackground}
          className={css.header}
          title={t('dragWindow')}
          onDoubleClick={(event) => {
            if ((event.target as HTMLElement).closest('button') === null) {
              windowSpring.stop(); pendingWindowPosition.current = undefined
              setWindowPosition({ x: 0, y: 0 }); saveUiPreferences({ windowPosition: { x: 0, y: 0 } })
            }
          }}
          onPointerDown={beginWindowDrag}
          onPointerMove={moveWindowDrag}
          onPointerUp={finishWindowDrag}
          onPointerCancel={finishWindowDrag}
        >
          <div className={css.brand}>
            <span className={css.logoCore} aria-hidden="true" />
            <div>
              <h1><strong>CODEKIN</strong>{zh && <span>{t('title')}</span>}</h1>
              <p>YOUR SIGNAL. YOUR WORLD.</p>
            </div>
          </div>
          <span className={css.dragHandle} aria-hidden="true"><i /><i /><i /><i /><i /></span>
          <div className={css.headerStats}>
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
          ? <div className={css.centerMessage}><span className={css.loadingMark} aria-hidden="true">◌</span><p>{online ? t('loading') : t('disconnected')}</p>{!online && <button type="button" onClick={() => { void refresh() }}>{t('retry')}</button>}</div>
          : (
            <>
              {!state.starterChosen && (
                <StarterSelection t={t} zh={zh} busy={busy} choose={creatureId => act({ type: 'choose-starter', creatureId })} />
              )}
              <nav ref={inertBackground} className={css.tabs} aria-label={t('title')}>
                {(['map', 'tower', 'squad', 'dex', 'inventory'] as const).map((id, index) => (
                  <button
                    key={id}
                    type="button"
                    data-tab={id}
                    aria-current={tab === id ? 'page' : undefined}
                    aria-controls="codekin-page"
                    tabIndex={tab === id ? 0 : -1}
                    className={tab === id ? css.tabActive : ''}
                    onClick={() => { requestNavigation(id) }}
                    onKeyDown={event => {
                      const tabs = ['map', 'tower', 'squad', 'dex', 'inventory'] as const
                      const next = event.key === 'ArrowRight' ? (index + 1) % 5
                        : event.key === 'ArrowLeft' ? (index + 4) % 5 : event.key === 'Home' ? 0 : event.key === 'End' ? 4 : -1
                      if (next < 0) return
                      event.preventDefault()
                      requestNavigation(tabs[next]!)
                      event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`[data-tab="${tabs[next]}"]`)?.focus()
                    }}
                  >
                    <span aria-hidden="true">0{index + 1}<i>{TAB_ICONS[id]}</i></span>
                    <small>{id === 'tower' ? t('towerTitle') : t(id)}</small>
                  </button>
                ))}
              </nav>
              <main ref={inertBackground} key={tab} id="codekin-page" data-page={tab} className={css.content}>
                {!online && <div className={css.connectionBanner} role="status"><span>{t('disconnected')}</span><button type="button" onClick={() => { void refresh() }}>{t('retry')}</button></div>}
                {tab === 'map' && (
                  <CodekinMapView
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
                    onEditingChange={setSquadEditing}
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
              <footer ref={inertBackground} className={css.footer}><span>LOCAL / PRIVATE</span><small>{t('privacy')}</small></footer>
              {state.battle !== undefined && (
                <BattleView
                  state={state}
                  t={t}
                  zh={zh}
                  busy={busy}
                  act={act}
                  transition={battleTransition}
                  reducedMotion={reducedMotion}
                  minimize={() => { navigate('close') }}
                />
              )}
              {notice !== undefined && <div className={css.toast} role="status"><span>{notice}</span><button type="button" aria-label={t('dismissNotice')} onClick={() => { setNotice(undefined) }}>×</button></div>}
              {pendingNavigation !== undefined && <UnsavedSquadModal t={t} busy={busy}
                stay={() => { setPendingNavigation(undefined) }} discard={() => { navigate(pendingNavigation) }}
                save={() => { void act({ type: 'set-squad', instanceIds: squadDraft }).then(response => { if (response !== undefined) navigate(pendingNavigation) }) }} />}
              {rewardVisible && rewardQueue[0] !== undefined && (
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
                    key={captured.instanceId}
                    captured={captured}
                    creature={creature}
                    state={state}
                    t={t}
                    zh={zh}
                    busy={busy}
                    reducedMotion={reducedMotion}
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
        <div ref={effects.layer} className={css.particleLayer} aria-hidden="true" />
      </section>
  )
}

function UnsavedSquadModal(props: { t: TraceWildOverlayProps['t']; busy: boolean; stay: () => void; discard: () => void; save: () => void }) {
  const dialog = useDialogAccessibility(props.stay, props.busy)
  return <div className={css.modalBackdrop}>
    <section ref={dialog.dialogRef} className={css.confirmPanel} role="dialog" aria-modal="true"
      aria-labelledby="codekin-unsaved-title" tabIndex={-1} onKeyDown={dialog.onDialogKeyDown}>
      <span className={css.sectionKicker}>SQUAD / UNSAVED</span>
      <h2 id="codekin-unsaved-title">{props.t('unsavedSquad')}</h2><p>{props.t('unsavedSquadHint')}</p>
      <button type="button" data-dialog-initial-focus disabled={props.busy} onClick={props.stay}>{props.t('keepEditing')}</button>
      <button type="button" disabled={props.busy} onClick={props.save}>{props.t('saveAndLeave')}</button>
      <button type="button" className={css.discardButton} disabled={props.busy} onClick={props.discard}>{props.t('discardAndLeave')}</button>
    </section>
  </div>
}

function StarterSelection(props: {
  t: TraceWildOverlayProps['t']
  zh: boolean
  busy: boolean
  choose: (creatureId: string) => void
}) {
  const dialog = useDialogAccessibility<HTMLDivElement>()
  return (
    <div className={css.modalBackdrop}>
      <div
        ref={dialog.dialogRef}
        className={css.starterModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tracewild-starter-title"
        tabIndex={-1}
        onKeyDown={dialog.onDialogKeyDown}
      >
        <h2 id="tracewild-starter-title">{props.t('starterTitle')}</h2>
        <p>{props.t('starterBody')}</p>
        <div className={css.starterGrid}>
          {starterCreatureIds().map((id) => {
            const creature = creatureById(id)!
            return (
              <button key={id} type="button" data-dialog-initial-focus={id === starterCreatureIds()[0] ? true : undefined} disabled={props.busy} onClick={() => { props.choose(id) }}>
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
          <CreatureSprite creature={towerBoss} level={tower.level} size="large" eager />
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
  returning?: boolean
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

function BattleView(props: {
  state: TraceWildSnapshot['state']
  t: TraceWildOverlayProps['t']
  zh: boolean
  busy: boolean
  act: (action: TraceWildAction, present?: BattleActionPresenter) => Promise<TraceWildActionResponse | undefined>
  transition?: BattleTransition | undefined
  reducedMotion: boolean
  minimize: () => void
}) {
  const battle = props.state.battle!
  const dialog = useDialogAccessibility()
  const [selectedTile, setSelectedTile] = useState<number>()
  const [focusedTile, setFocusedTile] = useState(0)
  const boardElement = useRef<HTMLDivElement>(null)
  const boardHadFocus = useRef(false)
  const battleEffects = useParticleField(props.reducedMotion, css.motionParticle!)
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
  const [protocol, setProtocol] = useState<{ creature: CreatureDefinition; name: string; captured: CreatureLook }>()
  const mounted = useRef(true)
  const [handoff, setHandoff] = useState(false)
  const [pageVisible, setPageVisible] = useState(() => !document.hidden)
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
  const locked = props.busy || animating || handoff
  const boardLocked = locked || battle.turnOwner === 'boss' || battle.captureWindow || battle.actionsRemaining <= 0
  const keyboardTile = (visualBoard[focusedTile]?.lockedActions ?? 0) > 0
    ? visualBoard.findIndex(tile => (tile.lockedActions ?? 0) === 0) : focusedTile
  useEffect(() => {
    if (!boardLocked && boardHadFocus.current) boardElement.current?.querySelector<HTMLButtonElement>(`[data-cell="${keyboardTile}"]`)?.focus({ preventScroll: true })
  }, [boardLocked, keyboardTile])
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
    setAnimating(false)
    setSwapMotion(undefined)
    setClearingTiles(undefined)
    setFallRows(undefined)
    setActiveChain(undefined)
    setSignalReadout(undefined)
    setRecoveryReadout(undefined)
    setVisualBoard(battle.board.map(tile => ({ ...tile })))
    setAttackPresentation(undefined)
    setProtocol(undefined)
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
    if (previous.partyHp > battle.partyHp) setPartyHitKey(value => value + 1)
    previousBattle.current = { id: battle.id, wildHp: battle.wildHp, partyHp: battle.partyHp }
    if (animating || props.busy) return
    const actor = battle.turnOwner === 'boss' ? 'boss' : 'player'
    const total = actor === 'boss' ? battle.pendingBossDamage : battle.pendingTeamDamage
    setDamageReadout(current => total > 0
      ? { key: current?.actor === actor ? current.key : Date.now(), actor, total, settled: false }
      : undefined)
  }, [animating, props.busy, battle.id, battle.turnOwner, battle.pendingTeamDamage, battle.pendingBossDamage, battle.wildHp, battle.partyHp])

  useEffect(() => {
    const update = (): void => { setPageVisible(!document.hidden) }
    document.addEventListener('visibilitychange', update)
    return () => { document.removeEventListener('visibilitychange', update) }
  }, [])

  useEffect(() => {
    setHandoff(true)
    const timer = window.setTimeout(() => { setHandoff(false) }, BATTLE_MOTION.handoff)
    return () => { window.clearTimeout(timer) }
  }, [battle.activeIndex, battle.turnOwner])

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      animationEpoch.current += 1
      if (bossActionTimer.current !== undefined) window.clearTimeout(bossActionTimer.current)
      if (suppressClickTimer.current !== undefined) window.clearTimeout(suppressClickTimer.current)
      if (captureIntroTimer.current !== undefined) window.clearTimeout(captureIntroTimer.current)
      for (const [timer, resolve] of motionTimers.current) {
        window.clearTimeout(timer)
        resolve()
      }
      motionTimers.current.clear()
    }
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
    epoch: number,
  ): Promise<void> => {
    if (animation.battleId !== battle.id) return
    const reducedMotion = props.reducedMotion
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
      const colors: Record<TraceEcology, string> = { lumen: '#ffdc69', forge: '#ff897f', relay: '#72dcff', aegis: '#6cf0c1', glitch: '#d7a1ff' }
      for (const index of frame.removed.slice(0, 12)) {
        const rect = boardElement.current?.querySelector(`[data-cell="${index}"]`)?.getBoundingClientRect()
        if (rect !== undefined) battleEffects.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, colors[frame.before[index]!.ecology], 4)
      }
      await pause(reducedMotion ? 220 : BATTLE_MOTION.clear + 40)
      if (animationEpoch.current !== epoch) return
      setClearingTiles(undefined)
      setVisualBoard(frame.after.map(tile => ({ ...tile })))
      setFallRows(frame.fallRows)
      const fallDuration = cascadeFallTime(frame.fallRows, MATCH_BOARD_SIZE)
      await pause(reducedMotion ? 240 : fallDuration + 40)
      if (animationEpoch.current !== epoch) return
      setFallRows(undefined)
      await pause(BATTLE_MOTION.chainPause)
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
    const actor = finalBattle.turnOwner === 'boss' ? 'boss' : 'player'
    const total = actor === 'boss' ? finalBattle.pendingBossDamage : finalBattle.pendingTeamDamage
    setDamageReadout(total > 0 ? { key: Date.now(), actor, total, settled: false } : undefined)
  }

  const playStrike = async (
    strike: TraceWildBattleStrike,
    finalBattle: TraceWildSnapshot['state']['battle'],
    epoch: number,
  ): Promise<void> => {
    const reducedMotion = props.reducedMotion
    const key = Date.now()
    setAttackPresentation({ ...strike, key, phase: 'flight' })
    setDamageReadout({ key, actor: strike.actor, total: strike.damage, settled: false })
    await pause(reducedMotion ? 500 : BATTLE_MOTION.flight + 40)
    if (animationEpoch.current !== epoch) return
    setAttackPresentation({ ...strike, key, phase: 'impact' })
    const targetRect = dialog.dialogRef.current?.querySelector(`[data-strike-target="${strike.actor === 'player' ? 'boss' : 'player'}"]`)?.getBoundingClientRect()
    if (targetRect !== undefined) battleEffects.burst(targetRect.left + targetRect.width / 2,
      targetRect.top + targetRect.height / 2, strike.actor === 'player' ? '#7ef5ff' : '#ff7c92', 22)
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
    await pause(BATTLE_MOTION.impact + 40)
    if (animationEpoch.current !== epoch) return
    setAttackPresentation(undefined)
    setDamageReadout(undefined)
  }

  const playRecovery = async (recovery: TraceWildBattleRecovery, epoch: number): Promise<void> => {
    const reducedMotion = props.reducedMotion
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
    await pause(reducedMotion ? 300 : 400)
    if (animationEpoch.current !== epoch) return
    setRecoveryReadout(value => value?.key === key ? { ...value, settling: true } : value)
    if (recovery.actor === 'player') {
      showPartyHp(recovery.targetHpAfter)
      showPartyShield(recovery.targetShieldAfter)
    } else {
      showWildHp(recovery.targetHpAfter)
      showWildShield(recovery.targetShieldAfter)
    }
    await pause(650)
    if (animationEpoch.current !== epoch) return
    setRecoveryReadout(value => value?.key === key ? undefined : value)
  }

  const presentBattleResponse: BattleActionPresenter = async response => {
    const animation = response.animation
    if (!mounted.current || animation === undefined || animation.battleId !== battle.id) return
    const epoch = ++animationEpoch.current
    const finalBattle = response.state.battle?.id === battle.id ? response.state.battle : undefined
    const motion = animation.swap
    if (motion !== undefined && animation.actor === 'boss') {
      setSwapMotion(motion)
      await pause(props.reducedMotion ? 220 : BATTLE_MOTION.swap + 30)
      if (animationEpoch.current !== epoch) return
      setSwapMotion(undefined)
    } else {
      setSwapMotion(undefined)
    }
    await playCascade(animation, finalBattle, epoch)
    if (animationEpoch.current !== epoch) return
    if (animation.recovery !== undefined) await playRecovery(animation.recovery, epoch)
    if (animationEpoch.current !== epoch) return
    if (animation.strike !== undefined) await playStrike(animation.strike, finalBattle, epoch)
  }

  const runBossAction = (): void => {
    if (battle.turnOwner !== 'boss' || props.busy || animating || handoff || !pageVisible || bossActionInFlight.current) return
    bossActionInFlight.current = true
    setDamageReadout(current => current?.actor === 'boss'
      ? current
      : { key: Date.now(), actor: 'boss', total: 0, settled: false })
    setAnimating(true)
    void props.act({ type: 'battle-continue' }, presentBattleResponse).finally(() => {
      bossActionInFlight.current = false
      if (!mounted.current) return
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
    if (battle.turnOwner !== 'boss' || props.busy || animating || handoff || !pageVisible || bossActionInFlight.current) return
    bossActionTimer.current = window.setTimeout(() => {
      bossActionTimer.current = undefined
      runBossAction()
    }, BATTLE_MOTION.enemyPause)
    return () => {
      if (bossActionTimer.current !== undefined) window.clearTimeout(bossActionTimer.current)
      bossActionTimer.current = undefined
    }
  }, [battle.id, battle.turnOwner, battle.bossActionsRemaining, props.busy, animating, handoff, pageVisible])

  if ((battle.mode === 'wild' && encounter === undefined) || wild === undefined || active === undefined || activeDefinition === undefined) return null
  const availableCores = CAPTURE_CORE_QUALITIES.filter(quality => props.state.cores[quality] > 0)
  const captureReady = battle.mode === 'wild' && battle.captureWindow
  const bossStrikeLanded = attackPresentation?.actor === 'boss' && attackPresentation.phase === 'impact'
    || displayedPartyHp < battle.partyHp
  const bossDamageForecast = damageReadout?.actor === 'boss' && !damageReadout.settled
    ? Math.max(battle.pendingBossDamage, damageReadout.total)
    : battle.pendingBossDamage
  const predictedPartyHp = bossStrikeLanded
    ? displayedPartyHp
    : Math.max(0, displayedPartyHp - Math.max(0, bossDamageForecast - displayedPartyShield))
  const partyDamagePreview = Math.max(0, displayedPartyHp - predictedPartyHp)
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
    void (async () => {
      const epoch = animationEpoch.current
      await pause(props.reducedMotion ? 180 : BATTLE_MOTION.swap + 30)
      if (!mounted.current || animationEpoch.current !== epoch) return
      const response = await props.act({ type: 'battle-swap', from, to }, presentBattleResponse)
      if (!mounted.current) return
      if (response === undefined) {
        setSwapMotion({ from, to, returning: true })
        await pause(props.reducedMotion ? 180 : BATTLE_MOTION.return + 30)
        if (!mounted.current) return
      }
      setSwapMotion(undefined)
      setClearingTiles(undefined)
      setFallRows(undefined)
      setActiveChain(undefined)
      setSignalReadout(undefined)
      setRecoveryReadout(undefined)
      setAnimating(false)
    })()
  }

  const castSkill = (creatureInstanceId: string): void => {
    if (boardLocked) return
    setAnimating(true)
    void props.act({ type: 'battle-cast', creatureInstanceId }, async response => {
      const member = battle.party.find(value => value.instanceId === creatureInstanceId)
      const creature = member === undefined ? undefined : creatureById(member.creatureId)
      const skill = member === undefined ? undefined : skillByCreatureId(member.creatureId)
      const epoch = animationEpoch.current
      if (creature !== undefined && skill !== undefined && member !== undefined) {
        setProtocol({ creature, name: props.zh ? skill.activeNameZh : skill.activeNameEn, captured: props.state.creatures.find(value => value.instanceId === creatureInstanceId) ?? member })
        await pause(BATTLE_MOTION.protocol + 40)
        if (!mounted.current || animationEpoch.current !== epoch) return
        setProtocol(undefined)
      }
      await presentBattleResponse(response)
    }).finally(() => {
      if (!mounted.current) return
      setProtocol(undefined)
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
      <section
        ref={dialog.dialogRef}
        className={`${css.battlePanel} ${partyHitKey > 0 ? css.battleWasHit : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={battle.mode === 'tower' ? props.t('towerBattle') : props.t('battle')}
        tabIndex={-1}
        onKeyDown={dialog.onDialogKeyDown}
      >
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
          <div className={css.battleWindowActions}>
            <button type="button" className={css.flee} disabled={locked || battle.turnOwner === 'boss'} onClick={() => { void props.act({ type: 'flee' }) }}>{props.t('flee')}</button>
            <button type="button" className={css.flee} disabled={locked} onClick={props.minimize} aria-label={props.t('minimizeBattle')} title={props.t('minimizeBattle')}>−</button>
          </div>
        </header>

        <BattleStage battle={battle} creatures={props.state.creatures} t={props.t} zh={props.zh} locked={locked}
          reducedMotion={props.reducedMotion} onCast={castSkill}
          displayedWildHp={displayedWildHp} displayedWildShield={visibleWildShield}
          displayedPartyHp={displayedPartyHp} displayedPartyShield={visiblePartyShield}
          damage={damageReadout} attack={attackPresentation} />
        <div className={css.matchBattleLayout}>
          <div className={css.partyColumn}>
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
            <div className={`${css.turnSummary} ${battle.turnOwner === 'boss' ? css.turnSummaryBoss : ''}`} aria-live="polite">
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
              {protocol !== undefined && (
                <div className={css.protocolBanner} role="status" aria-live="polite">
                  <CreatureSprite creature={protocol.creature} captured={protocol.captured} size="medium" eager />
                  <div><small>{props.t('activeSkill')}</small><strong>{protocol.name}</strong><span>{creatureName(protocol.creature, props.zh)}</span></div>
                </div>
              )}
              <div
                ref={boardElement}
                className={css.matchBoard}
                role="grid"
                aria-label={props.t('boardHelp')}
                aria-description={props.t('keyboardBoard')}
                aria-rowcount={MATCH_BOARD_SIZE}
                aria-colcount={MATCH_BOARD_SIZE}
                aria-busy={boardLocked}
                onFocusCapture={() => { boardHadFocus.current = true }}
                onBlurCapture={event => { if (event.relatedTarget !== null && !event.currentTarget.contains(event.relatedTarget as Node)) boardHadFocus.current = false }}
              >
                {Array.from({ length: MATCH_BOARD_SIZE }, (_, row) => <div key={row} role="row" className={css.boardRow}>
                {visualBoard.slice(row * MATCH_BOARD_SIZE, (row + 1) * MATCH_BOARD_SIZE).map((tile, column) => {
                const index = row * MATCH_BOARD_SIZE + column
                const dragging = gesture?.index === index
                const fallDistance = fallRows?.[index] ?? 0
                const tileStyle = {
                  '--tile-row': Math.floor(index / MATCH_BOARD_SIZE),
                  '--drag-x': `${dragging ? gesture.offsetX : 0}px`,
                  '--drag-y': `${dragging ? gesture.offsetY : 0}px`,
                  '--fall-y': `calc(${-fallDistance} * (100% + var(--board-gap)))`,
                  '--fall-duration': `${tileFallTime(fallDistance)}ms`,
                  '--fall-delay': `${column * BATTLE_MOTION.fallStagger}ms`,
                  '--swap-duration': `${BATTLE_MOTION.swap}ms`,
                  '--return-duration': `${BATTLE_MOTION.return}ms`,
                  '--clear-duration': `${BATTLE_MOTION.clear}ms`,
                  '--swap-x': swapMotion === undefined ? '0px' : `calc(${((index === swapMotion.from ? swapMotion.to : swapMotion.from) % MATCH_BOARD_SIZE - column)} * (100% + var(--board-gap)))`,
                  '--swap-y': swapMotion === undefined ? '0px' : `calc(${(Math.floor((index === swapMotion.from ? swapMotion.to : swapMotion.from) / MATCH_BOARD_SIZE) - row)} * (100% + var(--board-gap)))`,
                } as CSSProperties
                return (
                  <button
                    key={index}
                    type="button"
                    role="gridcell"
                    data-cell={index}
                    tabIndex={keyboardTile === index ? 0 : -1}
                    aria-selected={selectedTile === index}
                    aria-rowindex={row + 1}
                    aria-colindex={column + 1}
                    onFocus={() => { setFocusedTile(index) }}
                    onKeyDown={event => {
                      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return
                      event.preventDefault()
                      event.stopPropagation()
                      let next = boardNeighbour(index, event.key)
                      for (let tries = 0; tries < MATCH_BOARD_SIZE && (visualBoard[next]?.lockedActions ?? 0) > 0; tries += 1) {
                        const candidate = boardNeighbour(next, event.key === 'Home' ? 'ArrowRight' : event.key === 'End' ? 'ArrowLeft' : event.key)
                        if (candidate === next) break
                        next = candidate
                      }
                      if ((visualBoard[next]?.lockedActions ?? 0) === 0) {
                        setFocusedTile(next)
                        boardElement.current?.querySelector<HTMLButtonElement>(`[data-cell="${next}"]`)?.focus({ preventScroll: true })
                      }
                    }}
                    draggable={false}
                    style={tileStyle}
                    className={`${css.matchTile} ${css[`tile_${tile.ecology}`]} ${selectedTile === index ? css.matchTileSelected : ''} ${dragging ? css.matchTileDragging : ''} ${clearingTiles?.has(index) === true ? css.matchTileClearing : ''} ${fallDistance > 0 ? css.matchTileFalling : ''} ${tile.special !== 'none' ? css.matchTileSpecial : ''} ${(tile.lockedActions ?? 0) > 0 ? css.matchTileLocked : ''} ${(tile.hazardActions ?? 0) > 0 ? css.matchTileHazard : ''} ${swapMotion !== undefined && (index === swapMotion.from || index === swapMotion.to) ? swapMotion.returning ? css.tileReturning : css.tileSwapping : ''}`}
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
                      if (event.button !== 0 || boardLocked || (tile.lockedActions ?? 0) > 0) return
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
                })}</div>)}
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
        <div ref={battleEffects.layer} className={css.particleLayer} aria-hidden="true" />
      </section>
    </div>
  )
}
