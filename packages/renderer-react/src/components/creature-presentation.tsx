import { memo, useState } from 'react'
import type {
  CaptureCoreQuality,
  CreatureDefinition,
  CreatureAppearance,
  TraceEcology,
} from '../../../engine/src/types.ts'
import { resolveCreatureSprite, type CreatureLook } from '../appearance-presentation.ts'
import type { TraceWildLocaleKey } from '../locales.ts'
import css from './tracewild.module.css'

export const ECOLOGY_KEYS: Record<TraceEcology, TraceWildLocaleKey> = {
  lumen: 'ecologyLumen', forge: 'ecologyForge', relay: 'ecologyRelay',
  aegis: 'ecologyAegis', glitch: 'ecologyGlitch',
}

export const CORE_KEYS: Record<CaptureCoreQuality, TraceWildLocaleKey> = {
  pebble: 'corePebble', pulse: 'corePulse', prism: 'corePrism', nova: 'coreNova', origin: 'coreOrigin',
}

export const RARITY_KEYS = {
  common: 'rarityCommon', uncommon: 'rarityUncommon', rare: 'rarityRare', apex: 'rarityApex',
} as const

export const CreatureSprite = memo(function CreatureSprite(props: {
  creature: CreatureDefinition
  size?: 'tiny' | 'small' | 'medium' | 'large'
  unknown?: boolean
  eager?: boolean
  captured?: CreatureLook | undefined
  level?: number | undefined
  appearance?: CreatureAppearance | undefined
}) {
  const [failedSources, setFailedSources] = useState<ReadonlySet<string>>(() => new Set())
  const look = props.captured ?? { level: props.level ?? 1, ...(props.appearance === undefined ? {} : { appearance: props.appearance }) }
  const resolved = resolveCreatureSprite(props.creature.id, look)
  const source = resolved.source !== undefined && !failedSources.has(resolved.source) ? resolved.source
    : resolved.fallback !== undefined && !failedSources.has(resolved.fallback) ? resolved.fallback : undefined
  const className = `${css.sprite} ${css[`sprite_${props.size ?? 'medium'}`]} ${props.unknown ? css.spriteUnknown : ''}`
  if (props.unknown) {
    return <span className={`${className} ${css.spritePlaceholder}`} aria-hidden="true">?</span>
  }
  if (source === undefined) {
    return <span className={`${className} ${css.spritePlaceholder}`} aria-hidden="true">?</span>
  }
  return (
    <img
      className={className}
      src={source}
      data-creature-id={props.creature.id}
      data-creature-instance={look.instanceId}
      data-creature-appearance={source === resolved.source ? resolved.appearance : 'original'}
      data-creature-level={look.level}
      alt=""
      width={384}
      height={384}
      loading={props.eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onError={() => { setFailedSources(previous => new Set([...previous, source])) }}
    />
  )
})

export function creatureName(creature: CreatureDefinition, zh: boolean): string {
  return zh ? creature.nameZh : creature.nameEn
}
