import type { Board, BoardState, Move, Play, PointState } from "../Types";
import { GoColor, GoOpponent, GoPlayType } from "@enums";
export declare function getNextTurn(color: GoColor.black | GoColor.white): Promise<Play>;
export declare function resetGoPromises(): void;
/**
 * Does common processing in response to a move being made.
 *
 * Due to asynchronous and/or timer-based functions, this function might be
 * called multiple times per turn. Therefore, it is (and must be) idempotent.
 * It is also used to handle the first turn of the game, and post-load
 * processing.
 * On the AI's turn, it starts AI processing. On all turns, it does promise
 * handling and dispatches common events.
 * @returns the nextTurn promise for the player who just moved
 */
export declare function handleNextTurn(boardState?: BoardState, useOfflineCycles?: boolean): Promise<Play>;
/**
 * Reset the promises for white and black turns.
 * This will notify scripts waiting on the old promises with gameOver,
 * potentially even when it is not their turn.
 * If the game has already ended, it won't re-notify (that was handled in
 * endGoGame()), which is why it is important to call this *before* resetting
 * the board state.
 */
export declare function resetAI(endOfGame?: boolean): void;
/**
 * Finds an array of potential moves based on the current board state, then chooses one
 * based on the given opponent's personality and preferences. If no preference is given by the AI,
 * will choose one from the reasonable moves at random.
 *
 * @returns a promise that will resolve with a move (or pass) from the designated AI opponent.
 */
export declare function getMove(boardState: BoardState, player: GoColor, opponent: GoOpponent, useOfflineCycles?: boolean, rngOverride?: number): Promise<Play & {
    type: GoPlayType.move | GoPlayType.pass;
}>;
/**
 * Finds a move in an open area to expand influence and later build on
 */
export declare function getExpansionMoveArray(board: Board, availableSpaces: PointState[]): Move[];
/**
 * Gets the starting score for white.
 */
export declare function getKomi(state: BoardState): number;
/**
 * Allows time to pass
 */
export declare function sleep(ms: number): Promise<void>;
export declare function showWorldDemon(): any;
