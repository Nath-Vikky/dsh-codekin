import type { MotionPoint } from '../motion.ts';
export declare function useReducedMotion(preference?: boolean): {
    reducedMotion: boolean;
    systemReducedMotion: boolean;
};
/** One finite spring per surface; idle surfaces schedule no animation frames. */
export declare function useSpringAnimation(reducedMotion: boolean): {
    animate: (from: MotionPoint, target: MotionPoint, velocity: MotionPoint, paint: (point: MotionPoint) => void, commit: (point: MotionPoint) => void) => void;
    stop: () => void;
};
/** Gravity-based fragments, owned by this layer and capped even during long cascades. */
export declare function useParticleField(reducedMotion: boolean, particleClass: string): {
    layer: import("react").RefObject<HTMLDivElement>;
    burst: (clientX: number, clientY: number, color: string, count?: number) => void;
};
//# sourceMappingURL=use-motion.d.ts.map