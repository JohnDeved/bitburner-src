import type { Board, BoardState } from "../Types";
export declare function addObstacles(boardState: BoardState): void;
export declare function resetCoordinates(board: Board): Board;
/**
 * Removes all tiny islands of empty points (2 or fewer) from the board
 * @param board
 */
export declare function removeIslands(board: Board): Board;
export declare function rotate90Degrees(board: Board): Board;
