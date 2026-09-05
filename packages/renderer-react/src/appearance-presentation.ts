import { CREATURE_EVOLUTION_LEVEL, resolveCreatureAppearance } from '../../engine/src/appearance.ts'
import type { CapturedCreature, CreatureAppearance } from '../../engine/src/types.ts'
import { contentAssetUrl } from './content.ts'

export type CreatureLook = Pick<CapturedCreature, 'level' | 'appearance'> & { instanceId?: string | undefined }
export const APPEARANCE_MOTION = { evolution: 1400, change: 380 } as const

export function resolveCreatureSprite(creatureId: string, look: CreatureLook = { level: 1 }) {
  const original = contentAssetUrl(`creature:${creatureId}:sprite`)
  const appearance = resolveCreatureAppearance(look)
  const evolved = appearance === 'evolved' ? contentAssetUrl(`creature:${creatureId}:evolved`) : undefined
  return { source: evolved ?? original, fallback: original, appearance: evolved === undefined ? 'original' as const : appearance }
}

export interface PresentedAppearance {
  identity: string
  level: number
  source: string | undefined
  appearance: CreatureAppearance
}

export function appearanceTransition(previous: PresentedAppearance, next: PresentedAppearance): 'none' | 'change' | 'evolution' {
  if (previous.identity !== next.identity || previous.source === next.source) return 'none'
  return previous.level < CREATURE_EVOLUTION_LEVEL && next.level >= CREATURE_EVOLUTION_LEVEL && next.appearance === 'evolved'
    ? 'evolution' : 'change'
}

/** Decode before swapping a visible portrait, retaining the old image on failure. */
export async function decodeCreatureImage(source: string): Promise<boolean> {
  const picture = new Image()
  picture.decoding = 'async'
  const loaded = new Promise<boolean>(resolve => {
    picture.onload = () => { resolve(true) }
    picture.onerror = () => { resolve(false) }
  })
  picture.src = source
  if (typeof picture.decode === 'function') {
    try { await picture.decode(); return true } catch { return false }
  }
  return loaded
}
