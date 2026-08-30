import type { MatchCascadeFrame, MatchTile, RandomSource, TraceEcology } from './types.ts';
export declare const MATCH_BOARD_SIZE = 8;
export declare const MATCH_BOARD_CELLS: number;
export declare const MAX_MATCH_CASCADES = 12;
export interface MatchResolutionStep {
    chain: number;
    counts: Readonly<Record<TraceEcology, number>>;
    maxGroup: number;
    specialCount: number;
}
export interface MatchResolution {
    board: MatchTile[];
    steps: MatchResolutionStep[];
    frames: MatchCascadeFrame[];
}
export interface MatchSwap {
    from: number;
    to: number;
}
export declare function areAdjacentTiles(first: number, second: number): boolean;
export declare function findFirstLegalBattleSwap(board: readonly MatchTile[]): MatchSwap | undefined;
export declare function findBestBattleSwap(board: readonly MatchTile[], preferredEcology: TraceEcology): MatchSwap | undefined;
export declare function chooseBossBattleSwap(board: readonly MatchTile[], preferredEcology: TraceEcology, random: RandomSource): MatchSwap | undefined;
export declare function hasBattleMatches(board: readonly MatchTile[]): boolean;
export declare function createMatchBoard(random: RandomSource): MatchTile[];
export declare function resolveBattleSwap(boardValue: readonly MatchTile[], from: number, to: number, random: RandomSource): MatchResolution | undefined;
export declare function resolveForcedTiles(board: readonly MatchTile[], indexes: readonly number[], random: RandomSource): MatchResolution;
export declare function resolveExistingBattleMatches(board: readonly MatchTile[], random: RandomSource): MatchResolution;
export declare function convertRandomBattleTiles(boardValue: readonly MatchTile[], ecology: TraceEcology, count: number, random: RandomSource): MatchTile[];
export declare function reshuffleBattleBoard(boardValue: readonly MatchTile[], random: RandomSource): MatchTile[];
//# sourceMappingURL=match3.d.ts.map