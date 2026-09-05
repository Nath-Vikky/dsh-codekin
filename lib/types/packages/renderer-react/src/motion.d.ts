/** Display-only physics. These values never enter the authoritative game state. */
export interface MotionPoint {
    x: number;
    y: number;
}
export interface SpringState {
    position: MotionPoint;
    velocity: MotionPoint;
}
export declare function stepSpring(state: SpringState, target: MotionPoint, elapsed: number): SpringState;
export declare function projectRelease(position: MotionPoint, velocity: MotionPoint): MotionPoint;
export declare function boardNeighbour(index: number, key: string, size?: number): number;
export interface UiPreferences {
    reducedMotion?: boolean;
    windowPosition?: MotionPoint;
    launcherPosition?: MotionPoint;
}
export declare function readUiPreferences(): UiPreferences;
export declare function saveUiPreferences(update: UiPreferences): void;
//# sourceMappingURL=motion.d.ts.map