import { useCallback, useEffect, useRef, useState } from 'react'
import { stepSpring } from '../motion.ts'
import type { MotionPoint, SpringState } from '../motion.ts'

export function useReducedMotion(preference?: boolean): { reducedMotion: boolean; systemReducedMotion: boolean } {
  const [system, setSystem] = useState(() => typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = (): void => { setSystem(media.matches) }
    update()
    media.addEventListener('change', update)
    return () => { media.removeEventListener('change', update) }
  }, [])
  return { reducedMotion: preference ?? system, systemReducedMotion: system }
}

/** One finite spring per surface; idle surfaces schedule no animation frames. */
export function useSpringAnimation(reducedMotion: boolean) {
  const frame = useRef<number>()
  const finish = useRef<() => void>()
  const stop = useCallback((): void => {
    if (frame.current !== undefined) cancelAnimationFrame(frame.current)
    frame.current = undefined
    finish.current = undefined
  }, [])
  const animate = useCallback((
    from: MotionPoint,
    target: MotionPoint,
    velocity: MotionPoint,
    paint: (point: MotionPoint) => void,
    commit: (point: MotionPoint) => void,
  ): void => {
    stop()
    const complete = (): void => { stop(); paint(target); commit(target) }
    if (reducedMotion || document.hidden) { complete(); return }
    finish.current = complete
    let state: SpringState = { position: from, velocity }
    let last = performance.now()
    const started = last
    const tick = (now: number): void => {
      state = stepSpring(state, target, (now - last) / 1000)
      last = now
      paint(state.position)
      if (now - started >= 900 || Math.hypot(state.position.x - target.x, state.position.y - target.y) < 0.2
        && Math.hypot(state.velocity.x, state.velocity.y) < 3) { complete(); return }
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
  }, [reducedMotion, stop])
  useEffect(() => {
    const onVisibility = (): void => { if (document.hidden) finish.current?.() }
    document.addEventListener('visibilitychange', onVisibility)
    return () => { document.removeEventListener('visibilitychange', onVisibility); stop() }
  }, [stop])
  useEffect(() => { if (reducedMotion) finish.current?.() }, [reducedMotion])
  return { animate, stop }
}

/** Gravity-based fragments, owned by this layer and capped even during long cascades. */
export function useParticleField(reducedMotion: boolean, particleClass: string) {
  const layer = useRef<HTMLDivElement>(null)
  const animations = useRef(new Set<Animation>())
  const clear = useCallback((): void => {
    for (const animation of animations.current) animation.cancel()
    animations.current.clear()
    layer.current?.replaceChildren()
  }, [])
  useEffect(() => {
    const hide = (): void => { if (document.hidden) clear() }
    document.addEventListener('visibilitychange', hide)
    return () => { document.removeEventListener('visibilitychange', hide); clear() }
  }, [clear])
  useEffect(() => { if (reducedMotion) clear() }, [clear, reducedMotion])
  const burst = useCallback((clientX: number, clientY: number, color: string, count = 9): void => {
    const root = layer.current
    if (reducedMotion || document.hidden || root === null || typeof root.animate !== 'function') return
    const rect = root.getBoundingClientRect()
    const available = Math.max(0, 72 - animations.current.size)
    const total = Math.min(count, available)
    for (let index = 0; index < total; index += 1) {
      const angle = (index / Math.max(1, total)) * Math.PI * 2 - Math.PI / 2
      const speed = 55 + (index * 37 % 85)
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed - 45
      const duration = 440 + index % 4 * 45
      const particle = document.createElement('i')
      particle.className = particleClass
      particle.style.left = `${clientX - rect.left}px`
      particle.style.top = `${clientY - rect.top}px`
      particle.style.background = color
      root.appendChild(particle)
      const keyframes = Array.from({ length: 9 }, (_, step) => {
        const progress = step / 8
        const time = duration / 1000 * progress
        return {
          transform: `translate(${vx * time}px, ${vy * time + 210 * time * time}px) rotate(${progress * (index % 2 ? 210 : -180)}deg) scale(${1 - progress * 0.7})`,
          opacity: Math.min(1, (1 - progress) * 2.2),
        }
      })
      const animation = particle.animate(keyframes, { duration, easing: 'linear', fill: 'forwards' })
      animations.current.add(animation)
      const remove = (): void => { animations.current.delete(animation); particle.remove() }
      animation.onfinish = remove
      animation.oncancel = remove
    }
  }, [particleClass, reducedMotion])
  return { layer, burst }
}
