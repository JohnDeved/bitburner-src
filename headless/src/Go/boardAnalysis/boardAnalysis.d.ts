import type { Board, BoardState, Neighbor, Play, PointState, SimpleBoard } from "../Types";
import { GoColor } from "@enums";
/**
 * Determines if the given player can legally make a move at the specified coordinates.
 *
 * You cannot repeat previous board states, to prevent endless loops (superko rule)
 *
 * You cannot make a move that would remove all liberties of your own piece(s) unless it captures opponent's pieces
 *
 * You cannot make a move in an occupied space
 *
 * You cannot make a move if it is not your turn, or if the game is over
 *
 * @returns a validity explanation for if the move is legal or not
 */
export declare function evaluateIfMoveIsValid(boardState: BoardState, x: number, y: number, player: GoColor, shortcut?: boolean): any;
/**
 * Create a new evaluation board and play out the results of the given move on the new board
 * @returns the evaluation board
 */
export declare function evaluateMoveResult(board: Board, x: number, y: number, player: GoColor, resetChains?: boolean): Board;
export declare function getControlledSpace(board: Board): any[][];
/**
 * For a potential move, determine what the liberty of the point would be if played, by looking at adjacent empty nodes
 * as well as the remaining liberties of neighboring friendly chains
 */
export declare function findEffectiveLibertiesOfNewMove(board: Board, x: number, y: number, player: GoColor): PointState[];
/**
 * Find the number of open spaces that are connected to chains adjacent to a given point, and return the maximum
 */
export declare function findMaxLibertyCountOfAdjacentChains(boardState: BoardState, x: number, y: number, player: GoColor): number;
/**
 * Find the number of open spaces that are connected to chains adjacent to a given point, and return the minimum
 */
export declare function findMinLibertyCountOfAdjacentChains(board: Board, x: number, y: number, player: GoColor): number;
export declare function findEnemyNeighborChainWithFewestLiberties(board: Board, x: number, y: number, player: GoColor): PointState[];
/**
 * Returns a list of points that are valid moves for the given player
 */
export declare function getAllValidMoves(boardState: BoardState, player: GoColor): PointState[];
/**
  Find all empty point groups where either:
  * all of its immediate surrounding player-controlled points are in the same continuous chain, or
  * it is completely surrounded by some single larger chain and the edge of the board

  Eyes are important, because a chain of pieces cannot be captured if it fully surrounds two or more eyes.
 */
export declare function getAllEyesByChainId(board: Board, player: GoColor): {
    [s: string]: PointState[][];
};
/**
 * Get a list of all eyes, grouped by the chain they are adjacent to
 */
export declare function getAllEyes(board: Board, player: GoColor, eyesObject?: {
    [s: string]: PointState[][];
}): PointState[][][];
/**
  Find all empty spaces completely surrounded by a single player color.
  For each player chain number, add any empty space chains that are completely surrounded by a single player's color to
   an array at that chain number's index.
 */
export declare function getAllPotentialEyes(board: Board, allChains: PointState[][], player: GoColor, _maxSize?: number): {
    neighbors: PointState[][];
    chain: PointState[];
    id: string;
}[];
/**
 * Get all player chains that are adjacent / touching the current chain
 */
export declare function getAllNeighboringChains(board: Board, chain: PointState[], allChains: PointState[][]): PointState[][];
/**
 * Gets all points that have player pieces adjacent to the given point
 */
export declare function getPlayerNeighbors(board: Board, chain: PointState[]): PointState[];
/**
 * Gets all points adjacent to the given point
 */
export declare function getAllNeighbors(board: Board, chain: PointState[]): PointState[];
/**
 * Determines if chain has a point that matches the given coordinates
 */
export declare function isPointInChain(point: PointState, chain: PointState[]): boolean;
/**
 * Finds all groups of connected pieces, or empty space groups
 */
export declare function getAllChains(board: Board): PointState[][];
/**
 * Find any group of stones with no liberties (who therefore are to be removed from the board)
 */
export declare function findAllCapturedChains(chainList: PointState[][], playerWhoMoved: GoColor): PointState[][];
/**
 * Find all empty points adjacent to any piece in a given chain
 */
export declare function findLibertiesForChain(board: Board, chain: PointState[]): PointState[];
/**
 * Find all empty points adjacent to any piece in the chain that a given point belongs to
 */
export declare function findChainLibertiesForPoint(board: Board, x: number, y: number): PointState[];
/**
 * Returns an object that includes which of the cardinal neighbors are empty
 * (adjacent 'liberties' of the current piece )
 */
export declare function findAdjacentLibertiesForPoint(board: Board, x: number, y: number): Neighbor;
/**
 * Returns an object that includes which of the cardinal neighbors are either empty or contain the
 * current player's pieces. Used for making the connection map on the board
 */
export declare function findAdjacentLibertiesAndAlliesForPoint(board: Board, x: number, y: number, _player?: GoColor): Neighbor;
/**
 * Retrieves a simplified version of the board state.
 * "X" represents black pieces, "O" white, "." empty points, and "#" offline nodes.
 *
 * For example, a 5x5 board might look like this:
 * ```
 * [
 *   "XX.O.",
 *   "X..OO",
 *   ".XO..",
 *   "XXO..",
 *   ".XOO.",
 * ]
 * ```
 *
 * Each string represents a vertical column on the board, and each character in the string represents a point.
 *
 * Traditional notation for Go is e.g. "B,1" referring to second ("B") column, first rank. This is the equivalent of
 * index (1 * N) + 0 , where N is the size of the board.
 *
 * Note that index 0 (the [0][0] point) is shown on the bottom-left on the visual board (as is traditional), and each
 * string represents a vertical column on the board. In other words, the printed example above can be understood to
 * be rotated 90 degrees clockwise compared to the board UI as shown in the IPvGO game.
 *
 */
export declare function simpleBoardFromBoard(board: Board): SimpleBoard;
/**
 * Returns a string representation of the given board.
 * The string representation is the same as simpleBoardFromBoard() but concatenated into a single string
 *
 * For example, a 5x5 board might look like this:
 * ```
 *   "XX.O.X..OO.XO..XXO...XOO."
 * ```
 */
export declare function boardStringFromBoard(board: Board): string;
/**
 * Returns a full board object from a string representation of the board.
 * The string representation is the same as simpleBoardFromBoard() but concatenated into a single string
 *
 * For example, a 5x5 board might look like this:
 * ```
 *   "XX.O.X..OO.XO..XXO...XOO."
 * ```
 */
export declare function boardFromBoardString(boardString: string): Board;
/**
 * Slices a string representation of a board into an array of strings representing the rows on the board
 */
export declare function simpleBoardFromBoardString(boardString: string): SimpleBoard;
/** Creates a board object from a simple board. The resulting board has no analytics (liberties/chains) */
export declare function boardFromSimpleBoard(simpleBoard: SimpleBoard): Board;
/**
 * Creates a Board object from the given simpleBoard string array
 * Also updates the board object with the analytics (liberties/chains) from the simple board
 */
export declare const updatedBoardFromSimpleBoard: (simpleBoard: SimpleBoard) => Board;
export declare function boardStateFromSimpleBoard(simpleBoard: SimpleBoard, ai?: any, lastPlayer?: any): BoardState;
export declare function blankPointState(color: GoColor, x: number, y: number): PointState;
export declare function areSimpleBoardsIdentical(simpleBoard1: SimpleBoard, simpleBoard2: SimpleBoard): boolean;
export declare function getColorOnBoardString(boardString: string, x: number, y: number): GoColor | null;
/** Find a move made by the previous player, if present. */
export declare function getPreviousMove(): [number, number] | null;
/**
 * Gets the last move, if it was made by the specified color and is present
 */
export declare function getPreviousMoveDetails(): Play;
export declare function addPointHighlight(board: BoardState, x: number, y: number, color: string, text: string): void;
export declare function clearPointHighlight(board: BoardState, x: number, y: number): void;
export declare function clearAllPointHighlights(board: BoardState): void;
