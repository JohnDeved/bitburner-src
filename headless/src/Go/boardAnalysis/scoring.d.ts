import type { BoardState } from "../Types";
import { GoOpponent, GoColor } from "@enums";
/**
 * Returns the score of the current board.
 * Each player gets one point for each piece on the board, and one point for any empty node
 *  fully surrounded by their pieces
 */
export declare function getScore(boardState: BoardState): {
    [GoColor.white]: {
        pieces: number;
        territory: number;
        komi: number;
        sum: number;
    };
    [GoColor.black]: {
        pieces: number;
        territory: number;
        komi: number;
        sum: number;
    };
};
/**
 * Handles ending the game. Sets the previous player to null to prevent further moves, calculates score, and updates
 * player node count and power, and game history
 */
export declare function endGoGame(boardState: BoardState): void;
/**
 * Forcefully ends the game, resetting the winstreak (if any) and ending the game without applying node power bonuses.
 * Used for critically failing a cheat attempt.
 * @param boardState - the boardstate to reset
 */
export declare function forceEndGoGame(boardState: BoardState): void;
/**
 * Sets the winstreak to zero for the given opponent, and adds a loss
 */
export declare function resetWinstreak(opponent: GoOpponent, gameComplete: boolean): void;
/**
 * prints the board state to the console
 */
export declare function logBoard(boardState: BoardState): void;
export declare function getOpponentStats(opponent: GoOpponent): import("../Types").OpponentStats;
