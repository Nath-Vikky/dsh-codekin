import { memo, useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import { MAX_MAP_ENCOUNTERS } from '../../../engine/src/balance.ts'
import type { TraceEcology, TraceWildSnapshot } from '../../../engine/src/types.ts'
import { creatureById } from '../content.ts'
import { CORE_KEYS, CreatureSprite, ECOLOGY_KEYS, creatureName } from './creature-presentation.tsx'
import css, { styleText } from './codekin-map.module.css'

type Translate = PropsLocale<'tracewild'>['t']
type Point = readonly [number, number]
const WIDTH = 600
const HEIGHT = 620
const ecologyColors: Record<TraceEcology, string> = {
  lumen: '#9bfbff', forge: '#ffd18a', relay: '#cdb9ff', aegis: '#a2ffd0', glitch: '#ffaae1',
}

// The ground and its markers share one projection. Labels use seven separated
// berths with leader lines, so even seven signals in one district remain usable.
const project = (x: number, y: number, z = 0): Point => [300 + (x - y) * 0.84, 145 + (x + y) * 0.64 - z]
const points = (vertices: readonly Point[]) => vertices.map(point => point.map(value => Math.round(value * 10) / 10).join(',')).join(' ')
const ground = (vertices: readonly Point[], z = 0) => points(vertices.map(([x, y]) => project(x, y, z)))
const BERTHS: readonly Point[] = [[161, 151], [389, 161], [86, 331], [294, 338], [510, 336], [187, 510], [420, 514]]
const COAST: readonly Point[] = [[-25, 28], [28, -25], [215, -25], [292, 26], [310, 157], [283, 290], [139, 321], [0, 259], [-25, 149]]

function markerBerths(anchors: readonly Point[]): number[] {
  // Minimum-distance assignment of at most seven markers; deterministic and
  // memoized on the encounter list, never recalculated by the clock animation.
  const memo = new Map<string, { cost: number; slots: number[] }>()
  function solve(index: number, mask: number): { cost: number; slots: number[] } {
    if (index === anchors.length) return { cost: 0, slots: [] }
    const key = `${index}:${mask}`
    const cached = memo.get(key)
    if (cached !== undefined) return cached
    let best = { cost: Infinity, slots: [] as number[] }
    BERTHS.forEach(([x, y], slot) => {
      if ((mask & (1 << slot)) !== 0) return
      const next = solve(index + 1, mask | (1 << slot))
      const anchor = anchors[index]!
      const cost = (x - anchor[0]) ** 2 + (y - anchor[1]) ** 2 + next.cost
      if (cost < best.cost) best = { cost, slots: [slot, ...next.slots] }
    })
    memo.set(key, best)
    return best
  }
  return solve(0, 0).slots
}

function timeLabel(t: Translate, expiresAt: number, now: number): string {
  if (!Number.isFinite(expiresAt) || !Number.isFinite(now)) return t('encounterResident')
  const minutes = Math.max(0, Math.ceil((expiresAt - now) / 60_000))
  if (minutes <= 1) return t('encounterLeavingSoon')
  if (minutes < 60) return t('encounterLeavesMinutes', { count: minutes })
  const hours = Math.ceil(minutes / 60)
  return hours < 24 ? t('encounterLeavesHours', { count: hours }) : t('encounterLeavesDays', { count: Math.ceil(hours / 24) })
}

interface Block { x: number; y: number; w: number; d: number; h: number; color: number }
const PALETTES = [
  ['#d9edfc', '#8baecd', '#4e779f'],
  ['#9de4ed', '#579fab', '#357184'],
  ['#fff0dc', '#d7b89e', '#966f6b'],
  ['#c4cffa', '#889bc7', '#525f95'],
]
const BLOCKS: Block[] = []
for (let row = 0; row < 8; row++) {
  for (let column = 0; column < 8; column++) {
    // Broad green campus and a clear central plaza break up the urban grid.
    if ((column < 3 && row > 4) || (column > 2 && column < 5 && row > 2 && row < 5)) continue
    const seed = (row * 43 + column * 71) % 97
    BLOCKS.push({ x: column * 35 + 7, y: row * 35 + 7, w: 17 + seed % 8, d: 17 + seed % 6, h: 12 + seed % 41, color: seed % 4 })
    if (seed % 3 === 0) BLOCKS.push({ x: column * 35 + 9, y: row * 35 + 24, w: 10, d: 8, h: 8 + seed % 14, color: (seed + 1) % 4 })
  }
}
BLOCKS.sort((a, b) => a.x + a.y - b.x - b.y)

function Building({ block }: { block: Block }) {
  const { x, y, w, d, h, color } = block
  const palette = PALETTES[color]!
  const a = project(x, y, h), b = project(x + w, y, h), c = project(x + w, y + d, h), e = project(x, y + d, h)
  const baseB = project(x + w, y), baseC = project(x + w, y + d), baseE = project(x, y + d)
  return <g>
    <polygon points={ground([[x, y + d], [x + w, y + d], [x + w + h * 0.65, y + d + h * 0.28], [x + h * 0.65, y + d + h * 0.28]])} fill="#06275b" opacity=".24" />
    <polygon points={points([e, c, baseC, baseE])} fill={palette[1]} />
    <polygon points={points([b, c, baseC, baseB])} fill={palette[2]} />
    <polygon points={points([a, b, c, e])} fill={palette[0]} stroke="#f1faff" strokeWidth=".6" />
    {h > 30 && <>
      <polyline points={points([project(x + 2, y + d, h * 0.66), project(x + w, y + d, h * 0.66), project(x + w, y + 2, h * 0.66)])} stroke="#deffff" strokeWidth="1.4" fill="none" opacity=".65" />
      <polyline points={points([project(x + 2, y + d, h * 0.35), project(x + w, y + d, h * 0.35), project(x + w, y + 2, h * 0.35)])} stroke="#deffff" strokeWidth="1.2" fill="none" opacity=".45" />
      <polygon points={ground([[x + 4, y + 4], [x + 10, y + 4], [x + 10, y + 9], [x + 4, y + 9]], h + 1)} fill={palette[2]} opacity=".6" />
    </>}
  </g>
}

const City = memo(function City() {
  const tower = project(134, 131)
  return <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={css.city} aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="codekin-sea" x2=".8" y2="1"><stop stopColor="#087eae" /><stop offset="1" stopColor="#071f61" /></linearGradient>
      <pattern id="codekin-water" width="43" height="31" patternUnits="userSpaceOnUse"><path d="M3 16l18-4m6 10 12-3" stroke="#adfaff" strokeWidth=".7" opacity=".23" /></pattern>
      <linearGradient id="codekin-beacon" x2="0" y2="1"><stop stopColor="#bcffff" stopOpacity="0" /><stop offset="1" stopColor="#bbffff" stopOpacity=".4" /></linearGradient>
    </defs>
    <rect width={WIDTH} height={HEIGHT} fill="url(#codekin-sea)" />
    <rect width={WIDTH} height={HEIGHT} fill="url(#codekin-water)" />
    <path d="M-50 380Q270 245 652 428M-20 568Q320 429 640 557M-30 87Q273 12 661 117" fill="none" stroke="#66e2e9" strokeWidth="1" opacity=".21" />
    <polygon points={ground(COAST, -22)} fill="#12335a" stroke="#4fbbcf" strokeWidth="12" strokeLinejoin="round" />
    <polygon points={ground(COAST, -10)} fill="#668ba4" stroke="#a5dddb" strokeWidth="5" strokeLinejoin="round" />
    <polygon points={ground(COAST)} fill="#7196a8" stroke="#d5eee1" strokeWidth="3" strokeLinejoin="round" />
    <polygon points={ground([[0, 166], [97, 166], [97, 275], [0, 259]])} fill="#469d91" />
    <polygon points={ground([[99, 99], [168, 99], [168, 171], [99, 171]])} fill="#d1dcca" />
    <polygon points={ground([[214, 214], [279, 214], [279, 276], [214, 276]])} fill="#bca8ae" />
    {[0, 35, 70, 105, 140, 175, 210, 245, 280].map(axis => <g key={axis}>
      <polyline points={ground([[axis, 0], [axis, 280]])} fill="none" stroke="#244f72" strokeWidth="5.5" />
      <polyline points={ground([[0, axis], [280, axis]])} fill="none" stroke="#244f72" strokeWidth="5.5" />
      <polyline points={ground([[axis, 0], [axis, 280]])} fill="none" stroke="#bfd6d0" strokeWidth=".55" strokeDasharray="4 5" />
      <polyline points={ground([[0, axis], [280, axis]])} fill="none" stroke="#bfd6d0" strokeWidth=".55" strokeDasharray="4 5" />
    </g>)}
    <polyline points={ground([[14, -27], [14, -95], [85, -142]])} fill="none" stroke="#99c4cc" strokeWidth="15" />
    <polyline points={ground([[14, -27], [14, -95], [85, -142]])} fill="none" stroke="#2e5571" strokeWidth="9" />
    <polyline points={ground([[14, -27], [14, -95], [85, -142]])} fill="none" stroke="#f2e9bb" strokeWidth="1" strokeDasharray="5 6" />
    {[90, 125, 160].map(axis => <polygon key={axis} points={ground([[axis, 305], [axis + 12, 305], [axis + 12, 343], [axis, 343]], -5)} fill="#9cb1b8" stroke="#d4d8c5" strokeWidth="2" />)}
    <ellipse cx={tower[0]} cy={tower[1]} rx="38" ry="21" fill="#32647e" stroke="#c5ffff" strokeWidth="2" />
    <ellipse cx={tower[0]} cy={tower[1]} rx="27" ry="15" fill="none" stroke="#aad2d3" strokeWidth="1" />
    {BLOCKS.map((block, index) => <Building key={index} block={block} />)}
    {Array.from({ length: 17 }, (_, index) => {
      const x = 13 + (index * 29 % 74), y = 183 + (index * 19 % 73)
      const [px, py] = project(x, y)
      return <g key={index}><ellipse cx={px + 3} cy={py + 2} rx="7" ry="3" fill="#174c67" opacity=".5" /><path d={`M${px} ${py}v-12`} stroke="#507d74" strokeWidth="2" /><ellipse cx={px} cy={py - 10} rx="5" ry="7" fill={index % 2 ? '#8ce8b5' : '#62c9b2'} /></g>
    })}
    <g className={css.landmark}>
      <path d={`M${tower[0] - 22} ${tower[1] - 36}l6-178h32l6 178Z`} fill="url(#codekin-beacon)" />
      <Building block={{ x: 122, y: 119, w: 26, d: 26, h: 58, color: 3 }} />
      <Building block={{ x: 126, y: 123, w: 18, d: 18, h: 85, color: 0 }} />
      <path d={`M${tower[0]} ${tower[1] - 91}v-32`} stroke="#c8ffff" strokeWidth="2" />
      <circle cx={tower[0]} cy={tower[1] - 126} r="4" fill="#b7ffff" />
      <ellipse cx={tower[0]} cy={tower[1] - 93} rx="20" ry="7" fill="none" stroke="#b7ffff" strokeWidth="1.5" />
    </g>
    <g className={css.ferry}><path d="m92 534 36-8 18 8-35 9Z" fill="#e8faff" /><path d="m104 526 17-3 8 5-16 4Z" fill="#74c6df" /><path d="m65 542 19-5m-28 11 18-5" stroke="#9cefff" opacity=".5" /></g>
    <g transform="translate(545 554)" fill="#b7ecff"><path d="m0-18 6 23-6-5-6 5Z" /><text y="-26" textAnchor="middle" fontSize="12" fontFamily="monospace">N</text></g>
  </svg>
})

export function CodekinMapView(props: {
  state: TraceWildSnapshot['state']
  serverTime: number
  t: Translate
  zh: boolean
  busy: boolean
  start: (encounterId: string) => void
}) {
  const [clock, setClock] = useState(props.serverTime)
  useEffect(() => {
    const startedAt = Date.now()
    setClock(props.serverTime)
    const timer = window.setInterval(() => setClock(props.serverTime + Math.max(0, Date.now() - startedAt)), 30_000)
    return () => window.clearInterval(timer)
  }, [props.serverTime])
  const markers = useMemo(() => {
    const encounters = props.state.encounters.slice(0, MAX_MAP_ENCOUNTERS)
    const anchors = encounters.map(encounter => project(encounter.mapX * 2.8, encounter.mapY * 2.8))
    const berths = markerBerths(anchors)
    return encounters.map((encounter, index) => ({ encounter, anchor: anchors[index]!, berth: BERTHS[berths[index]!]! }))
  }, [props.state.encounters])
  return <section className={css.map} aria-labelledby="codekin-map-title">
    <style data-plugin-css="codekin-city-map" dangerouslySetInnerHTML={{ __html: styleText }} />
    <header className={css.heading}>
      <div><span>CODEKIN / SIGNAL CITY</span><h2 id="codekin-map-title">{props.t('map')}</h2></div>
      <p><b>{String(props.state.encounters.length).padStart(2, '0')}</b><span>/ {MAX_MAP_ENCOUNTERS}<br />{props.zh ? '驻留信号' : 'SIGNALS'}</span></p>
    </header>
    <div className={css.scene}>
      <City />
      <div className={css.coordinate} aria-hidden="true">SECTOR 01 <i /> LIVE SIGNAL</div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={css.leaders} aria-hidden="true" focusable="false">
        {markers.map(({ encounter, anchor, berth }) => <g key={encounter.id} stroke={ecologyColors[creatureById(encounter.creatureId)?.ecology ?? 'relay']}>
          <path d={`M${berth[0]} ${berth[1] + 38} L${anchor[0]} ${anchor[1]}`} fill="none" strokeWidth="1.7" strokeDasharray="3 3" opacity=".8" />
          <ellipse cx={anchor[0]} cy={anchor[1]} rx="12" ry="6" fill="#092557" strokeWidth="2" />
          <ellipse cx={anchor[0]} cy={anchor[1]} rx="5" ry="2.5" fill="currentColor" strokeWidth="0" />
        </g>)}
      </svg>
      {markers.map(({ encounter, berth }, index) => {
        const creature = creatureById(encounter.creatureId)
        if (creature === undefined) return null
        const name = creatureName(creature, props.zh)
        const remaining = timeLabel(props.t, encounter.expiresAt, clock)
        const special = encounter.enhanced || creature.rarity === 'rare' || creature.rarity === 'apex' || encounter.quality === 'nova' || encounter.quality === 'origin'
        return <button key={encounter.id} type="button" className={css.marker}
          style={{ left: `${berth[0] / WIDTH * 100}%`, top: `${berth[1] / HEIGHT * 100}%`, '--signal': ecologyColors[creature.ecology], '--delay': `${index * -0.6}s` } as CSSProperties}
          data-special={special || undefined} data-quality={encounter.quality} disabled={props.busy || !props.state.starterChosen}
          aria-label={`${name} · Lv.${encounter.level} · ${props.t(CORE_KEYS[encounter.quality])} · ${remaining}${encounter.enhanced ? ` · ${props.t('enhanced')}` : ''}`}
          title={`${name} · ${props.t(ECOLOGY_KEYS[creature.ecology])} · ${props.t(CORE_KEYS[encounter.quality])} · ${remaining}`}
          onClick={() => props.start(encounter.id)}>
          <span className={css.portrait}><CreatureSprite creature={creature} level={encounter.level} size="small" /><i aria-hidden="true" />{special && <b aria-hidden="true">✦</b>}</span>
          <strong>{name}</strong><small>Lv.{encounter.level} · {remaining}</small>
        </button>
      })}
      {props.state.encounters.length === 0 && <div className={css.empty}><span aria-hidden="true">◎</span><p>{props.t('mapEmpty')}</p></div>}
    </div>
    <div className={css.legend}>{(Object.keys(ECOLOGY_KEYS) as TraceEcology[]).map(ecology => <span key={ecology} style={{ '--signal': ecologyColors[ecology] } as CSSProperties}><i />{props.t(ECOLOGY_KEYS[ecology])}</span>)}</div>
    <p className={css.hint}>{props.zh ? '选择头像，前往信号所在的街区。' : 'Select a portrait to meet its signal.'}</p>
  </section>
}
