import { Board, BoardState, Play, SimpleBoard, SimpleOpponentStats } from "../Types";
import { GoOpponent } from "@enums";
import type { NetscriptContext } from "../../Netscript/APIWrapper";
/**
 * Check the move based on the current settings
 */
export declare function validateMove(ctx: NetscriptContext, x: number, y: number, methodName?: string, settings?: {}): void;
/**
 * Pass player's turn and await the opponent's response (or logs the end of the game if both players pass)
 */
export declare function handlePassTurn(ctx: NetscriptContext, passAsWhite?: boolean): Promise<Play>;
/**
 * Validates and applies the player's router placement
 */
export declare function makePlayerMove(ctx: NetscriptContext, x: number, y: number, playAsWhite?: boolean): Promise<Play>;
/**
  Returns the promise that provides the opponent's move, once it finishes thinking.
 */
export declare function getOpponentNextMove(ctx: NetscriptContext, logOpponentMove?: boolean, playAsWhite?: boolean): Promise<Play>;
/**
 * Returns a grid of booleans indicating if the coordinates at that location are a valid move for the player
 */
export declare function getValidMoves(_boardState?: BoardState, playAsWhite?: boolean): boolean[][];
/**
 * Returns a grid with an ID for each contiguous chain of same-state nodes (excluding dead/offline nodes)
 */
export declare function getChains(_board?: Board): number[][];
/**
 * Returns a grid of numbers representing the number of open-node connections each player-owned chain has.
 */
export declare function getLiberties(_board?: Board): number[][];
/**
 * Returns a grid indicating which player, if any, controls the empty nodes by fully encircling it with their routers
 */
export declare function getControlledEmptyNodes(_board?: Board): any[];
/**
 * Resets the active game to be a new board with "No AI" as the opponent. Applies the specified board state and komi to the new game.
 * Used for testing scenarios.
 */
export declare function setTestingBoardState(ctx: NetscriptContext, board: Board, komi?: number): void;
/**
 * Returns all previous board states as SimpleBoards
 */
export declare function getHistory(): string[][];
/**
 * Gets the status of the current game.
 * Shows the current player, current score, and the previous move coordinates.
 * Previous move will be null for a pass, or if there are no prior moves.
 *
 * Also provides the white player's komi (bonus starting score), and the amount of bonus cycles from offline time remaining
 */
export declare function getGameState(): {
    currentPlayer: "White" | "Black" | "None";
    whiteScore: number;
    blackScore: number;
    previousMove: [number, number];
    komi: number;
    bonusCycles: number;
};
export declare function getMoveHistory(): SimpleBoard[];
/**
 * Returns 'None' if the game is over, otherwise returns the color of the current player's turn
 */
export declare function getCurrentPlayer(): "None" | "White" | "Black";
/**
 * Clears the board, resets winstreak if applicable
 */
export declare function resetBoardState(ctx: NetscriptContext, opponent: GoOpponent, boardSize: number): SimpleBoard;
/**
 * Retrieve and clean up stats for each opponent played against
 */
export declare function getStats(): Partial<Record<GoOpponent, SimpleOpponentStats>>;
/**
 * Reset all win/loss numbers for the No AI opponent.
 * @param resetAll if true, reset win/loss records for all opponents. This leaves node power and bonuses unchanged.
 */
export declare function resetStats(resetAll?: boolean): void;
/**
 * Validate the given SimpleBoard and prior board state (if present) and turn it into a full BoardState with updated analytics
 */
export declare function validateBoardState(ctx: NetscriptContext, _boardState?: unknown, _priorBoardState?: unknown, playAsWhite?: boolean): BoardState | undefined;
/** Validate singularity access by throwing an error if the player does not have access. */
export declare function checkCheatApiAccess(ctx: NetscriptContext): void;
/**
 * Determines if the attempted cheat move is successful. If so, applies the cheat via the callback, and gets the opponent's response.
 *
 * If it fails, determines if the player's turn is skipped, or if the player is ejected from the subnet.
 */
export declare function determineCheatSuccess(ctx: NetscriptContext, callback: () => void, successRngOverride?: number, ejectRngOverride?: number, playAsWhite?: boolean): Promise<Play>;
/**
 * Cheating success rate scales with player's crime success rate, and decreases with prior cheat attempts.
 *
 * The source file bonus is additive success chance on top of the other multipliers.
 *
 * Cheat success chance required for N cheats with 100% success rate in a game:
 *
 * 1 100% success rate cheat requires +66% increased crime success rate
 * 2 100% success cheats: +145% increased crime success rate
 * 3: +282%
 * 4: +535%
 * 5: +1027%
 * 7: +4278%
 * 10: +59,854%
 * 12: +534,704%
 * 15: +31,358,645%
 */
export declare function cheatSuccessChance(cheatCountOverride: number, playAsWhite?: boolean): number;
/**
 * Attempts to remove an existing router from the board. Can fail. If failed, can immediately end the game
 */
export declare function cheatRemoveRouter(ctx: NetscriptContext, x: number, y: number, successRngOverride?: number, ejectRngOverride?: number, playAsWhite?: boolean): Promise<Play>;
/**
 * Attempts play two moves at once. Can fail. If failed, can immediately end the game
 */
export declare function cheatPlayTwoMoves(ctx: NetscriptContext, x1: number, y1: number, x2: number, y2: number, successRngOverride?: number, ejectRngOverride?: number, playAsWhite?: boolean): Promise<Play>;
export declare function cheatRepairOfflineNode(ctx: NetscriptContext, x: number, y: number, successRngOverride?: number, ejectRngOverride?: number, playAsWhite?: boolean): Promise<Play>;
export declare function cheatDestroyNode(ctx: NetscriptContext, x: number, y: number, successRngOverride?: number, ejectRngOverride?: number, playAsWhite?: boolean): Promise<Play>;
