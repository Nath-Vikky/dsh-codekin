/** Visual travel and reading time are separate: reduced motion keeps the latter. */
export const BATTLE_MOTION = {
  swap: 140,
  return: 200,
  clear: 300,
  fallBase: 220,
  fallPerRow: 54,
  fallStagger: 12,
  chainPause: 140,
  flight: 800,
  impact: 550,
  enemyPause: 1200,
  protocol: 1000,
  handoff: 600,
} as const

export function tileFallTime(distance: number, column = 0): number {
  return distance > 0 ? BATTLE_MOTION.fallBase + distance * BATTLE_MOTION.fallPerRow + column * BATTLE_MOTION.fallStagger : 0
}

export function cascadeFallTime(rows: readonly number[], boardSize: number): number {
  return Math.max(0, ...rows.map((distance, index) => tileFallTime(distance, index % boardSize)))
}
