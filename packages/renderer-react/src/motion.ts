/** Display-only physics. These values never enter the authoritative game state. */
export interface MotionPoint { x: number; y: number }
export interface SpringState { position: MotionPoint; velocity: MotionPoint }

export function stepSpring(state: SpringState, target: MotionPoint, elapsed: number): SpringState {
  const position = { ...state.position }
  const velocity = { ...state.velocity }
  let remaining = Math.min(0.05, Math.max(0, elapsed))
  while (remaining > 0) {
    const dt = Math.min(remaining, 1 / 120)
    for (const axis of ['x', 'y'] as const) {
      velocity[axis] += ((target[axis] - position[axis]) * 320 - velocity[axis] * 29) * dt
      position[axis] += velocity[axis] * dt
    }
    remaining -= dt
  }
  return { position, velocity }
}

export function projectRelease(position: MotionPoint, velocity: MotionPoint): MotionPoint {
  return {
    x: position.x + Math.max(-76, Math.min(76, velocity.x * 0.11)),
    y: position.y + Math.max(-76, Math.min(76, velocity.y * 0.11)),
  }
}

export function boardNeighbour(index: number, key: string, size = 8): number {
  const row = Math.floor(index / size)
  const column = index % size
  if (key === 'ArrowLeft') return row * size + Math.max(0, column - 1)
  if (key === 'ArrowRight') return row * size + Math.min(size - 1, column + 1)
  if (key === 'ArrowUp') return Math.max(0, row - 1) * size + column
  if (key === 'ArrowDown') return Math.min(size - 1, row + 1) * size + column
  if (key === 'Home') return row * size
  if (key === 'End') return row * size + size - 1
  return index
}

export interface UiPreferences {
  reducedMotion?: boolean
  windowPosition?: MotionPoint
  launcherPosition?: MotionPoint
}

const PREFERENCES_KEY = 'codekin.ui.v1'

export function readUiPreferences(): UiPreferences {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(PREFERENCES_KEY) ?? '{}')
    if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return {}
    const row = raw as Record<string, unknown>
    const point = (value: unknown): MotionPoint | undefined => {
      if (value === null || typeof value !== 'object') return undefined
      const item = value as Record<string, unknown>
      return typeof item.x === 'number' && typeof item.y === 'number'
        && Number.isFinite(item.x) && Number.isFinite(item.y)
        && Math.abs(item.x) < 100_000 && Math.abs(item.y) < 100_000
        ? { x: item.x, y: item.y } : undefined
    }
    return {
      ...(typeof row.reducedMotion === 'boolean' ? { reducedMotion: row.reducedMotion } : {}),
      ...(point(row.windowPosition) === undefined ? {} : { windowPosition: point(row.windowPosition)! }),
      ...(point(row.launcherPosition) === undefined ? {} : { launcherPosition: point(row.launcherPosition)! }),
    }
  } catch { return {} }
}

export function saveUiPreferences(update: UiPreferences): void {
  try { localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ ...readUiPreferences(), ...update })) } catch { /* Storage can be unavailable in private contexts. */ }
}
