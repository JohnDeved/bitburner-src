import type { Board, PointState } from "../Types";
import { GoColor } from "@enums";
export declare const threeByThreePatterns: string[][];
/**
 * Searches the board for any point that matches the expanded pattern set
 */
export declare function findAnyMatchedPatterns(board: Board, player: GoColor, availableSpaces: PointState[], smart: boolean, rng: number): Promise<any>;
