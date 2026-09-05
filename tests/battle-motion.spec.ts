import { describe, expect, it } from 'vitest'
import { cascadeFallTime, tileFallTime } from '../packages/renderer-react/src/battle-motion.ts'

describe('cascade presentation completion', () => {
  it('waits for the last column as well as the longest fall before releasing the board', () => {
    const rows = Array<number>(64).fill(0)
    rows[0] = 8
    rows[63] = 8
    const completion = cascadeFallTime(rows, 8)
    expect(completion).toBeGreaterThan(tileFallTime(8))
    for (let index = 0; index < rows.length; index++) {
      expect(completion).toBeGreaterThanOrEqual(tileFallTime(rows[index]!, index % 8))
    }
    expect(cascadeFallTime([], 8)).toBe(0)
    expect(cascadeFallTime(Array<number>(64).fill(0), 8)).toBe(0)
  })
})
