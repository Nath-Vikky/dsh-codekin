import type { CSSProperties } from 'react'

type Crop = readonly [left: number, top: number, width: number, height: number]
interface PortraitFraming {
  width: number
  height: number
  body: Crop
  face: Crop
}

// Crops use the approved artwork's native coordinates. Height drives the zoom;
// narrow battle layouts retain the same face position without stretching the art.
const ULTIMATE_FRAMING: Readonly<Record<string, PortraitFraming>> = {
  'lumen-atlashart': { width: 1086, height: 1448, body: [210, 125, 620, 840], face: [360, 150, 310, 310] },
  'forge-kiln-colossus': { width: 1086, height: 1448, body: [185, 215, 650, 880], face: [322, 265, 330, 330] },
  'relay-mesh-jelly': { width: 1024, height: 1536, body: [260, 190, 520, 710], face: [400, 280, 285, 285] },
  'aegis-dawnguard': { width: 1086, height: 1448, body: [245, 180, 620, 845], face: [420, 210, 300, 300] },
  'glitch-overflow-maw': { width: 1086, height: 1448, body: [150, 100, 620, 880], face: [285, 120, 330, 330] },
}

export function battlePortraitFraming(creatureId: string, frame: 'body' | 'face'): CSSProperties | undefined {
  const artwork = ULTIMATE_FRAMING[creatureId]
  if (artwork === undefined) return undefined
  const [left, top, width, height] = artwork[frame]
  return {
    '--portrait-height': `${artwork.height / height * 100}%`,
    '--portrait-top': `${-top / height * 100}%`,
    '--portrait-anchor': `${-(left + width / 2) / artwork.width * 100}%`,
  } as CSSProperties
}
