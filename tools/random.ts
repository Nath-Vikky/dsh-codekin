import type { RandomSource } from '../packages/engine/src/types.ts'

export const SEEDED_RANDOM_ALGORITHM = 'lcg32-v1' as const

export interface SeededRandom {
  readonly algorithm: typeof SEEDED_RANDOM_ALGORITHM
  readonly seed: number
  readonly draws: number
  readonly next: RandomSource
}

export function createSeededRandom(seedValue: number): SeededRandom {
  if (!Number.isSafeInteger(seedValue) || seedValue < 0 || seedValue > 0xffff_ffff) {
    throw new RangeError('seed must be an unsigned 32-bit integer')
  }
  let state = seedValue >>> 0
  let draws = 0
  const source: SeededRandom = {
    algorithm: SEEDED_RANDOM_ALGORITHM,
    seed: state,
    get draws() {
      return draws
    },
    next: () => {
      state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0
      draws += 1
      return state / 0x1_0000_0000
    },
  }
  return Object.freeze(source)
}
