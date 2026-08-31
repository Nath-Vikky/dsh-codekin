import type { BattleLogEntry, BattleState, CaptureCoreQuality, RandomSource, TraceLogEntry, TraceWildState } from './types.ts';
export declare const MAX_CREATURES = 240;
export declare const MAX_PROCESSED_SIGNALS = 256;
export declare const MAX_LOG_ENTRIES = 40;
export declare const MAX_BATTLE_LOG_ENTRIES = 14;
export declare const ENERGY_LIMIT = 12;
export declare const MAX_IDLE_ELAPSED_MS: number;
export declare const MAX_AMPLIFIERS_PER_SIDE = 8;
export declare function emptyQualityCounts(): Record<CaptureCoreQuality, number>;
export declare function createInitialTraceWildState(now?: number): TraceWildState;
export declare function boundedRandom(random: RandomSource): number;
export declare function randomId(prefix: string, now: number, random: RandomSource): string;
export declare function chooseWeighted<T extends string>(weights: Readonly<Record<T, number>>, random: RandomSource): T;
export declare function logEntry(state: TraceWildState, entry: Omit<TraceLogEntry, 'id'>, random: RandomSource): void;
export declare function appendBattleLog(battle: BattleState, row: BattleLogEntry): void;
export declare function commit(state: TraceWildState, now: number): TraceWildState;
export declare function updateDex(state: TraceWildState, creatureId: string, at: number, captured: boolean): void;
export declare function purgeExpiredEncounters(state: TraceWildState, now: number): void;
//# sourceMappingURL=state.d.ts.map