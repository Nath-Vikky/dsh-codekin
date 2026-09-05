/** Visual travel and reading time are separate: reduced motion keeps the latter. */
export declare const BATTLE_MOTION: {
    readonly swap: 140;
    readonly return: 200;
    readonly clear: 300;
    readonly fallBase: 220;
    readonly fallPerRow: 54;
    readonly fallStagger: 12;
    readonly chainPause: 140;
    readonly flight: 800;
    readonly impact: 550;
    readonly enemyPause: 1200;
    readonly protocol: 1000;
    readonly handoff: 600;
};
export declare function tileFallTime(distance: number, column?: number): number;
export declare function cascadeFallTime(rows: readonly number[], boardSize: number): number;
//# sourceMappingURL=battle-motion.d.ts.map