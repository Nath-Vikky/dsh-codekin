import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import { playerStats } from '../../../engine/src/balance.ts'
import { CREATURE_EVOLUTION_LEVEL } from '../../../engine/src/appearance.ts'
import type { BattlePartyMember, BattleState, CapturedCreature, EnemyIntent } from '../../../engine/src/types.ts'
import type { CreatureLook } from '../appearance-presentation.ts'
import { creatureById, skillByCreatureId } from '../content.ts'
import { BATTLE_MOTION } from '../battle-motion.ts'
import type { TraceWildLocaleKey } from '../locales.ts'
import { CORE_KEYS, CreatureSprite, ECOLOGY_KEYS, creatureName } from './creature-presentation.tsx'
import css, { styleText } from './battle-stage.module.css'

export interface BattleStageDamage {
  actor: 'player' | 'boss'
  total: number
  current?: number
  settled: boolean
  key: number
}

export interface BattleStageProps {
  battle: BattleState
  creatures?: readonly CapturedCreature[]
  t: PropsLocale<'tracewild'>['t']
  zh: boolean
  locked: boolean
  onCast: (instanceId: string) => void
  displayedWildHp: number
  displayedWildShield: number
  displayedPartyHp: number
  displayedPartyShield: number
  damage?: BattleStageDamage | undefined
  attack?: { actor: 'player' | 'boss'; phase: 'flight' | 'impact'; key: number } | undefined
  reducedMotion: boolean
}

const intentKeys: Record<EnemyIntent, TraceWildLocaleKey> = {
  strike: 'intentStrike', guard: 'intentGuard', disrupt: 'intentDisrupt', corrupt: 'intentCorrupt',
  mark: 'intentMark', lock: 'intentLock', freeze: 'intentFreeze',
}
const intentDetails: Record<EnemyIntent, TraceWildLocaleKey> = {
  strike: 'intentDetailStrike', guard: 'intentDetailGuard', disrupt: 'intentDetailDisrupt', corrupt: 'intentDetailCorrupt',
  mark: 'intentDetailMark', lock: 'intentDetailLock', freeze: 'intentDetailFreeze',
}
const ratio = (value: number, max: number) => Math.max(0, Math.min(1, value / Math.max(1, max)))

/** Retain the departing portrait until its crossfade finishes, without remounting controls. */
function Portrait(props: { creatureId: string; look: CreatureLook; reducedMotion: boolean }) {
  const key = `${props.look.instanceId ?? props.creatureId}:${props.look.appearance ?? 'auto'}:${props.look.level >= CREATURE_EVOLUTION_LEVEL}`
  const last = useRef({ key, creatureId: props.creatureId, look: props.look })
  const [departing, setDeparting] = useState<typeof last.current>()
  useEffect(() => {
    if (props.reducedMotion) setDeparting(undefined)
    if (last.current.key === key) return
    const previous = last.current
    last.current = { key, creatureId: props.creatureId, look: props.look }
    if (props.reducedMotion) return
    setDeparting(previous)
    const timer = window.setTimeout(() => { setDeparting(undefined) }, BATTLE_MOTION.handoff + 20)
    return () => { window.clearTimeout(timer) }
  }, [key, props.creatureId, props.reducedMotion])
  const current = creatureById(props.creatureId)
  const previous = departing === undefined ? undefined : creatureById(departing.creatureId)
  return <span className={css.portraitLayers} aria-hidden="true">
    {previous !== undefined && <span key={`out-${departing?.key}`} className={css.departing}><CreatureSprite creature={previous} captured={departing?.look} eager /></span>}
    {current !== undefined && <span key={key} className={css.arriving}><CreatureSprite creature={current} captured={props.look} eager /></span>}
  </span>
}

export function BattleStage(props: BattleStageProps) {
  const { battle, t, zh } = props
  const [pinnedDetail, setPinnedDetail] = useState<string>()
  const [hoveredDetail, setHoveredDetail] = useState<string>()
  const detailTimer = useRef<number>()
  const stageRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    window.clearTimeout(detailTimer.current)
    setPinnedDetail(undefined); setHoveredDetail(undefined)
  }, [battle.id])
  useEffect(() => () => { window.clearTimeout(detailTimer.current) }, [])
  const openDetail = (id: string) => {
    window.clearTimeout(detailTimer.current)
    setHoveredDetail(id)
  }
  useEffect(() => {
    if (pinnedDetail === undefined) return
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !stageRef.current?.contains(event.target)) {
        setPinnedDetail(undefined)
        setHoveredDetail(undefined)
      }
    }
    document.addEventListener('pointerdown', outside)
    return () => { document.removeEventListener('pointerdown', outside) }
  }, [pinnedDetail])
  const wild = creatureById(battle.wildCreatureId)
  const active = battle.party[battle.activeIndex]
  const activeSkill = active === undefined ? undefined : skillByCreatureId(active.creatureId)
  const activeReady = active !== undefined && activeSkill !== undefined && active.energy >= activeSkill.energyCost
    && !active.skillUsedStage && active.skillSealedStages === 0
  const canCast = !props.locked && activeReady && battle.turnOwner === 'player'
    && battle.partyHp > 0 && battle.actionsRemaining > 0 && !battle.captureWindow
  const targetMember = battle.party[battle.enemyTargetIndex ?? battle.activeIndex]
  const targetCreature = targetMember === undefined ? undefined : creatureById(targetMember.creatureId)
  const target = battle.enemyTargetScope === 'team' ? t('targetTeam')
    : battle.enemyTargetScope === 'self' ? t('targetSelf')
      : battle.enemyTargetScope === 'board' ? t('targetBoard')
        : targetCreature === undefined ? t('targetMember') : creatureName(targetCreature, zh)

  const fighter = (member?: BattlePartyMember, small = false) => {
    const enemy = member === undefined
    const creature = enemy ? wild : creatureById(member.creatureId)
    if (creature === undefined) return null
    const skill = skillByCreatureId(creature.id)
    const id = enemy ? 'enemy' : member.instanceId
    const detailId = `combat-${battle.id}-${id}`
    const stats = enemy ? undefined : playerStats(creature.stats, member.level, member.quality)
    const energy = enemy ? battle.bossEnergy : member.energy
    const maxEnergy = enemy ? 24 : skill?.energyCost ?? 12
    const ready = enemy ? battle.bossSkillArmed : energy >= maxEnergy && !member.skillUsedStage && member.skillSealedStages === 0
    const hp = enemy ? props.displayedWildHp : props.displayedPartyHp
    const maxHp = enemy ? battle.wildMaxHp : battle.partyMaxHp
    const shield = enemy ? props.displayedWildShield : props.displayedPartyShield
    const modifiers = enemy ? battle.bossAmplifiers : battle.partyAmplifiers.filter(value => value.targetInstanceId === undefined || value.targetInstanceId === id)
    const detailOpen = (pinnedDetail ?? hoveredDetail) === id
    const portraitCanCast = !enemy && !small && canCast && member.instanceId === active?.instanceId
    const portraitAction = portraitCanCast
      ? `${t('castSkill')} · ${zh ? skill?.activeNameZh : skill?.activeNameEn}`
      : zh ? '战斗详情' : 'Battle details'
    return <div className={`${css.fighter} ${enemy ? css.enemy : small ? css.teammate : css.active} ${ready ? css.ready : ''}`} data-detail-open={detailOpen || undefined}
      onPointerEnter={event => { if (event.pointerType !== 'touch') openDetail(id) }}
      onPointerLeave={event => {
        if (event.currentTarget.contains(document.activeElement)) return
        window.clearTimeout(detailTimer.current)
        detailTimer.current = window.setTimeout(() => { setHoveredDetail(undefined) }, 160)
      }}
      onFocusCapture={() => { openDetail(id) }}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) { setPinnedDetail(undefined); setHoveredDetail(undefined) }
      }}
      onKeyDown={event => {
        if (event.key === 'Escape') {
          event.stopPropagation()
          event.currentTarget.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true })
          setPinnedDetail(undefined); setHoveredDetail(undefined)
        }
      }}>
      <button type="button" className={css.portraitButton} data-strike-target={enemy ? 'boss' : small ? undefined : 'player'}
        data-can-cast={portraitCanCast || undefined}
        aria-label={`${creatureName(creature, zh)} · ${portraitAction}`} title={portraitAction}
        aria-describedby={detailId} aria-expanded={detailOpen}
        onClick={() => {
          if (portraitCanCast) {
            window.clearTimeout(detailTimer.current)
            setPinnedDetail(undefined); setHoveredDetail(undefined)
            props.onCast(member.instanceId)
          } else {
            setPinnedDetail(value => value === id ? undefined : id); setHoveredDetail(undefined)
          }
        }}>
        <Portrait creatureId={creature.id} look={enemy ? { level: battle.wildLevel } : props.creatures?.find(value => value.instanceId === member.instanceId) ?? member} reducedMotion={props.reducedMotion} />
        {!enemy && <svg className={css.halo} viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" /><circle cx="50" cy="50" r="46" strokeDasharray="289.03" strokeDashoffset={289.03 * (1 - ratio(energy, maxEnergy))} /></svg>}
      </button>
      {enemy ? <div className={css.enemyMeters}>
        <div className={css.hp} role="meter" aria-label={t('health')} aria-valuenow={hp} aria-valuemin={0} aria-valuemax={maxHp}><i style={{ width: `${ratio(hp, maxHp) * 100}%` }} /><span>{hp.toLocaleString()} / {maxHp.toLocaleString()}</span></div>
        <div className={css.energy} role="meter" aria-label={t('bossEnergy')} aria-valuenow={energy} aria-valuemin={0} aria-valuemax={maxEnergy}><i style={{ width: `${ratio(energy, maxEnergy) * 100}%` }} /></div>
      </div> : <strong className={css.portraitName}>{creatureName(creature, zh)}</strong>}
      <div id={detailId} role="tooltip" tabIndex={detailOpen ? 0 : -1} className={css.detail}>
        <strong>{creatureName(creature, zh)}</strong>
        <small>Lv.{enemy ? battle.wildLevel : member.level} · {t(CORE_KEYS[enemy ? battle.wildQuality : member.quality])} · {t(ECOLOGY_KEYS[creature.ecology])}</small>
        <dl><div><dt>{enemy ? t('health') : t('teamRuntime')}</dt><dd>{hp.toLocaleString()} / {maxHp.toLocaleString()}</dd></div>
          <div><dt>{t('energy')}</dt><dd>{energy} / {maxEnergy}</dd></div>
          <div><dt>{t('statCompute')}</dt><dd>{enemy ? battle.wildAttack : stats?.attack}</dd></div>
          <div><dt>{t('statGuard')}</dt><dd>{enemy ? battle.wildDefense : stats?.defense}</dd></div>
          <div><dt>{t('shield')}</dt><dd>{shield.toLocaleString()}</dd></div>
          {enemy ? <div><dt>{t('armor')}</dt><dd>{battle.wildArmor}</dd></div> : <div><dt>{t('statResponse')}</dt><dd>{stats?.speed}</dd></div>}
        </dl>
        {!enemy && <small>{member.frozenStages > 0 ? `${t('frozen')} · ` : ''}{member.skillSealedStages > 0 ? t('skillSealed') : member.skillUsedStage ? t('skillSpent') : ready ? t('skillReady') : t('skillCharging')}</small>}
        {skill !== undefined && <><p><b>{t('passiveSkill')} · {zh ? skill.passiveNameZh : skill.passiveNameEn}</b>{zh ? skill.passiveDescriptionZh : skill.passiveDescriptionEn}</p><p><b>{t('activeSkill')} · {zh ? skill.activeNameZh : skill.activeNameEn}</b>{zh ? skill.activeDescriptionZh : skill.activeDescriptionEn}</p></>}
        {enemy && <><p><b>{t('enemyIntent')} · {t(intentKeys[battle.enemyIntent])}</b>{t('enemyIntentMeta', { target })}<br />{t(intentDetails[battle.enemyIntent], { count: battle.enemyIntent === 'corrupt' ? Math.min(6, 2 + battle.bossSkillTier) : Math.min(5, Math.max(3, battle.bossSkillTier)) })}</p>
          <p><b>{t('towerSkillTier', { tier: battle.bossSkillTier })} · {battle.bossSkillArmed ? t('skillReady') : t('skillCharging')}</b>{t('bossSkillTierDetail', { tier: battle.bossSkillTier, hazards: Math.min(6, 2 + battle.bossSkillTier), locks: Math.min(5, Math.max(3, battle.bossSkillTier)) })}</p></>}
        {modifiers.map(value => <small key={`${value.signal}-${value.stat}-${value.scope}`}>{zh ? value.stat === 'attack' ? '算力增幅' : '防御穿透' : value.stat === 'attack' ? 'Attack boost' : 'Defense penetration'} +{value.valuePermille / 10}% · {value.remainingRounds} {zh ? '回合' : 'rounds'}</small>)}
      </div>
    </div>
  }

  return <div ref={stageRef} className={css.stage} data-battle-stage="diagonal" data-reduced={props.reducedMotion || undefined}
    style={{ '--strike-flight': `${BATTLE_MOTION.flight}ms`, '--strike-impact': `${BATTLE_MOTION.impact}ms`, '--portrait-duration': `${BATTLE_MOTION.handoff}ms` } as CSSProperties}>
    <style data-plugin-css="codekin-battle-stage">{styleText}</style>
    <div className={css.floor} aria-hidden="true" /><span className={css.stageLabel} aria-hidden="true">{battle.turnOwner === 'boss' ? 'ENEMY PHASE' : 'YOUR MOVE'}<i>◆ CODEKIN</i></span>
    {fighter()}
    {active !== undefined && fighter(active)}
    <div className={css.damageLane} data-damage-lane aria-live="polite" aria-atomic="true">
      {props.damage !== undefined && <div className={css.damage} data-actor={props.damage.actor} data-settled={props.damage.settled || undefined}>
        <small>{t(props.damage.actor === 'player' ? 'totalDamage' : 'enemyDamage')}</small>
        <strong key={props.damage.key} title={props.damage.total.toLocaleString()}>{props.damage.total.toLocaleString()}</strong>
        {props.damage.current !== undefined && !props.damage.settled && <em>+{props.damage.current.toLocaleString()}</em>}
      </div>}
    </div>
    <div className={css.tray} data-party-tray>
      <button type="button" className={css.skill} disabled={!canCast} onClick={() => { if (active !== undefined) props.onCast(active.instanceId) }}
        title={activeSkill === undefined ? '' : zh ? activeSkill.activeDescriptionZh : activeSkill.activeDescriptionEn}>
        <small>{t(activeReady ? 'castSkill' : 'energy')} <span>{active?.energy ?? 0}/{activeSkill?.energyCost ?? 12}</span></small>
        <strong>{activeSkill === undefined ? '—' : zh ? activeSkill.activeNameZh : activeSkill.activeNameEn}</strong>
        <span className={css.skillMeter}><i style={{ width: `${ratio(active?.energy ?? 0, activeSkill?.energyCost ?? 12) * 100}%` }} /></span>
      </button>
      {[0, 1].map(index => {
        const member = battle.party.filter(value => value.instanceId !== active?.instanceId)[index]
        return <div key={index} className={css.teammateSlot}>{member === undefined ? <span className={css.emptySlot}>◇</span> : fighter(member, true)}</div>
      })}
    </div>
    {props.attack !== undefined && <div key={props.attack.key} className={css.strike} data-actor={props.attack.actor} data-phase={props.attack.phase} aria-hidden="true"
      style={{ '--source-x': props.attack.actor === 'player' ? '14%' : '79%', '--source-y': props.attack.actor === 'player' ? '71%' : '22%', '--target-x': props.attack.actor === 'player' ? '79%' : '14%', '--target-y': props.attack.actor === 'player' ? '22%' : '71%' } as CSSProperties}>
      <i className={css.wave} /><i className={css.impact} />
    </div>}
  </div>
}
