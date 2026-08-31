import { memo } from 'react'
import type {
  CaptureCoreQuality,
  CreatureDefinition,
  TraceEcology,
} from '../../../engine/src/types.ts'
import { contentAssetUrl } from '../content.ts'
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

export function creatureName(creature: CreatureDefinition, zh: boolean): string {
  return zh ? creature.nameZh : creature.nameEn
}
