import { Board, BoardState, Neighbor, PointState, SimpleBoard } from "../Types";
import { GoColor, GoOpponent } from "@enums";
/** Generates a new BoardState object with the given opponent and size. Optionally use an existing board. */
export declare function getNewBoardState(boardSize: number, ai?: any, applyObstacles?: boolean, boardToCopy?: Board): BoardState;
/**
 * Generates a new BoardState object from a given SimpleBoard string array, and an optional prior move board state
 */
export declare function getNewBoardStateFromSimpleBoard(simpleBoard: SimpleBoard, priorSimpleBoard?: SimpleBoard, ai?: GoOpponent, priorColor?: GoColor | undefined): BoardState;
/**
 * Determines how many starting pieces the opponent has on the board
 */
export declare function getHandicap(boardSize: number, opponent: GoOpponent): number;
/**
 * Make a new move on the given board, and update the board state accordingly
 * Modifies the board state in place
 * @returns a boolean representing whether the move was successful
 */
export declare function makeMove(boardState: BoardState, x: number, y: number, player: GoColor): boolean;
/**
 * Pass the current player's turn without making a move.
 * Ends the game if this is the second pass in a row.
 */
export declare function passTurn(boardState: BoardState, player: GoColor, allowEndGame?: boolean): void;
/**
 * Makes a number of random moves on the board before the game starts, to give one player an edge.
 * Modifies the board in place.
 */
export declare function applyHandicap(board: Board, handicap: number): void;
/**
 * Finds all groups of connected stones on the board, and updates the points in them with their
 * chain information and liberties.
 * Updates a board in-place.
 */
export declare function updateChains(board: Board, resetChains?: boolean): void;
/**
 * Assign each point on the board a chain ID, and link its list of 'liberties' (which are empty spaces
 * adjacent to some point on the chain including the current point).
 *
 * Then, remove any chains with no liberties.
 * Modifies the board in place.
 */
export declare function updateCaptures(board: Board, playerWhoMoved: GoColor, resetChains?: boolean): void;
/**
 * Finds all the pieces in the current continuous group, or 'chain'
 *
 * Iteratively traverse the adjacent pieces of the same color to find all the pieces in the same chain,
 * which are the pieces connected directly via a path consisting only of only up/down/left/right
 */
export declare function findAdjacentPointsInChain(board: Board, x: number, y: number): PointState[];
/**
 * Finds all empty spaces on the board.
 */
export declare function getEmptySpaces(board: Board): PointState[];
/**
 * Makes a deep copy of the given board state
 */
export declare function getStateCopy(initialState: BoardState): BoardState;
/** Make a deep copy of a board */
export declare function getBoardCopy(board: Board): Board;
export declare function contains(arr: PointState[], point: PointState): boolean;
export declare function findNeighbors(board: Board, x: number, y: number): Neighbor;
export declare function getArrayFromNeighbor(neighborObject: Neighbor): PointState[];
export declare function isNotNullish<T>(argument: T | undefined | null): argument is T;
