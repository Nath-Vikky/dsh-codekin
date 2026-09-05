import { afterEach, describe, expect, it, vi } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { boardNeighbour, projectRelease, readUiPreferences, saveUiPreferences, stepSpring } from '../packages/renderer-react/src/motion.ts'
import { useReducedMotion } from '../packages/renderer-react/src/components/use-motion.ts'

afterEach(() => { vi.unstubAllGlobals() })

describe('display physics and keyboard navigation', () => {
  it('settles at the same destination at 30, 60 and 144 fps without changing the input', () => {
    const initial = { position: { x: 0, y: 300 }, velocity: { x: 1400, y: -600 } }
    const before = structuredClone(initial)
    const target = { x: 120, y: 75 }
    for (const fps of [30, 60, 144]) {
      let state = initial
      for (let frame = 0; frame < fps; frame++) state = stepSpring(state, target, 1 / fps)
      expect(state.position.x).toBeCloseTo(target.x, 1)
      expect(state.position.y).toBeCloseTo(target.y, 1)
      expect(Math.hypot(state.velocity.x, state.velocity.y)).toBeLessThan(0.1)
    }
    expect(initial).toEqual(before)
  })

  it('bounds release momentum and survives a suspended animation frame', () => {
    expect(projectRelease({ x: 10, y: 20 }, { x: 10000, y: -10000 })).toEqual({ x: 86, y: -56 })
    const state = { position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } }
    expect(stepSpring(state, { x: 100, y: 100 }, 120)).toEqual(stepSpring(state, { x: 100, y: 100 }, 0.05))
    expect(stepSpring(state, { x: 100, y: 100 }, -1)).toEqual(state)
  })

  it('keeps arrow navigation inside board edges and Home/End in the current row', () => {
    expect(boardNeighbour(8, 'ArrowLeft')).toBe(8)
    expect(boardNeighbour(7, 'ArrowRight')).toBe(7)
    expect(boardNeighbour(0, 'ArrowUp')).toBe(0)
    expect(boardNeighbour(63, 'ArrowDown')).toBe(63)
    expect(boardNeighbour(26, 'Home')).toBe(24)
    expect(boardNeighbour(26, 'End')).toBe(31)
    expect(boardNeighbour(26, 'ArrowDown')).toBe(34)
    expect(boardNeighbour(26, 'Enter')).toBe(26)
  })

  it('ignores malformed storage and preserves independent preferences', () => {
    let value = 'invalid JSON'
    vi.stubGlobal('localStorage', { getItem: () => value, setItem: (_key: string, next: string) => { value = next } })
    expect(readUiPreferences()).toEqual({})
    value = JSON.stringify({ windowPosition: { x: '10', y: 20 }, launcherPosition: { x: 200000, y: 20 } })
    expect(readUiPreferences().windowPosition).toBeUndefined()
    expect(readUiPreferences().launcherPosition).toBeUndefined()
    saveUiPreferences({ reducedMotion: true })
    saveUiPreferences({ windowPosition: { x: 10, y: -20 } })
    expect(readUiPreferences()).toEqual({ reducedMotion: true, windowPosition: { x: 10, y: -20 } })
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('disabled') }, setItem: () => { throw new Error('disabled') } })
    expect(readUiPreferences()).toEqual({})
    expect(() => { saveUiPreferences({ reducedMotion: false }) }).not.toThrow()
  })

  it('keeps missing or invalid motion preferences unset so the system remains the default', () => {
    let value: string | null = null
    vi.stubGlobal('localStorage', { getItem: () => value, setItem: (_key: string, next: string) => { value = next } })
    for (const stored of [null, '{}', '{"reducedMotion":null}', '{"reducedMotion":"false"}', '{"reducedMotion":0}']) {
      value = stored
      expect(readUiPreferences()).not.toHaveProperty('reducedMotion')
      saveUiPreferences({ windowPosition: { x: 15, y: 20 } })
      expect(JSON.parse(value!)).toEqual({ windowPosition: { x: 15, y: 20 } })
    }
  })

  it('preserves an explicit full-motion choice when other preferences are saved', () => {
    let value = '{}'
    vi.stubGlobal('localStorage', { getItem: () => value, setItem: (_key: string, next: string) => { value = next } })
    saveUiPreferences({ reducedMotion: false })
    saveUiPreferences({ launcherPosition: { x: 12, y: 240 } })
    expect(readUiPreferences()).toEqual({ reducedMotion: false, launcherPosition: { x: 12, y: 240 } })
  })

  it.each([
    [undefined, false, false],
    [undefined, true, true],
    [false, false, false],
    [false, true, false],
    [true, false, true],
    [true, true, true],
  ] as const)('resolves preference %s with system %s to reduced motion %s', (preference: boolean | undefined, system: boolean, expected: boolean) => {
    vi.stubGlobal('window', { matchMedia: () => ({ matches: system }) })
    let actual: ReturnType<typeof useReducedMotion> | undefined
    function MotionProbe() {
      actual = useReducedMotion(preference)
      return null
    }
    renderToStaticMarkup(createElement(MotionProbe))
    expect(actual).toEqual({ reducedMotion: expected, systemReducedMotion: system })
  })
})
