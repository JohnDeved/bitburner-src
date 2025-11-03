"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewBoardState = getNewBoardState;
exports.getNewBoardStateFromSimpleBoard = getNewBoardStateFromSimpleBoard;
exports.getHandicap = getHandicap;
exports.makeMove = makeMove;
exports.passTurn = passTurn;
exports.applyHandicap = applyHandicap;
exports.updateChains = updateChains;
exports.updateCaptures = updateCaptures;
exports.findAdjacentPointsInChain = findAdjacentPointsInChain;
exports.getEmptySpaces = getEmptySpaces;
exports.getStateCopy = getStateCopy;
exports.getBoardCopy = getBoardCopy;
exports.contains = contains;
exports.findNeighbors = findNeighbors;
exports.getArrayFromNeighbor = getArrayFromNeighbor;
exports.isNotNullish = isNotNullish;
const _enums_1 = require("@enums");
const Constants_1 = require("../Constants");
const goAI_1 = require("../boardAnalysis/goAI");
const boardAnalysis_1 = require("../boardAnalysis/boardAnalysis");
const scoring_1 = require("../boardAnalysis/scoring");
const offlineNodes_1 = require("./offlineNodes");
/** Generates a new BoardState object with the given opponent and size. Optionally use an existing board. */
function getNewBoardState(boardSize, ai = _enums_1.GoOpponent.Netburners, applyObstacles = false, boardToCopy) {
    if (ai === _enums_1.GoOpponent.w0r1d_d43m0n) {
        boardToCopy = (0, offlineNodes_1.resetCoordinates)((0, offlineNodes_1.rotate90Degrees)((0, boardAnalysis_1.boardFromSimpleBoard)(Constants_1.bitverseBoardShape)));
        boardSize = 19;
        applyObstacles = false;
    }
    const newBoardState = {
        previousBoards: [],
        previousPlayer: _enums_1.GoColor.white,
        ai: ai,
        passCount: 0,
        cheatCount: 0,
        cheatCountForWhite: 0,
        komiOverride: null,
        highlightedPoints: Array.from({ length: boardSize }, () => Array.from({ length: boardSize }, () => null)),
        board: Array.from({ length: boardSize }, (_, x) => Array.from({ length: boardSize }, (_, y) => !boardToCopy || boardToCopy?.[x]?.[y]
            ? {
                color: boardToCopy?.[x]?.[y]?.color ?? _enums_1.GoColor.empty,
                chain: "",
                liberties: null,
                x,
                y,
            }
            : null)),
    };
    if (applyObstacles) {
        (0, offlineNodes_1.addObstacles)(newBoardState);
    }
    const handicap = getHandicap(newBoardState.board[0].length, ai);
    if (handicap) {
        applyHandicap(newBoardState.board, handicap);
    }
    return newBoardState;
}
/**
 * Generates a new BoardState object from a given SimpleBoard string array, and an optional prior move board state
 */
function getNewBoardStateFromSimpleBoard(simpleBoard, priorSimpleBoard, ai = _enums_1.GoOpponent.Netburners, priorColor = undefined) {
    const newState = getNewBoardState(simpleBoard.length, ai, false, (0, boardAnalysis_1.updatedBoardFromSimpleBoard)(simpleBoard));
    if (priorSimpleBoard) {
        newState.previousBoards.push(priorSimpleBoard.join(""));
    }
    if (priorColor) {
        newState.previousPlayer = priorColor;
    }
    else if (priorSimpleBoard) {
        // Identify the previous player based on the difference in pieces
        const priorWhitePieces = priorSimpleBoard.join("").match(/O/g)?.length ?? 0;
        const priorBlackPieces = priorSimpleBoard.join("").match(/X/g)?.length ?? 0;
        const currentWhitePieces = simpleBoard.join("").match(/O/g)?.length ?? 0;
        const currentBlackPieces = simpleBoard.join("").match(/X/g)?.length ?? 0;
        if (priorWhitePieces - priorBlackPieces > currentWhitePieces - currentBlackPieces) {
            newState.previousPlayer = _enums_1.GoColor.black;
        }
    }
    updateCaptures(newState.board, newState.previousPlayer ?? _enums_1.GoColor.white);
    return newState;
}
/**
 * Determines how many starting pieces the opponent has on the board
 */
function getHandicap(boardSize, opponent) {
    // Illuminati and WD get a few starting routers
    if (opponent === _enums_1.GoOpponent.Illuminati || opponent === _enums_1.GoOpponent.w0r1d_d43m0n) {
        return {
            [5]: 1,
            [7]: 3,
            [9]: 4,
            [13]: 5,
            [19]: 7,
        }[boardSize];
    }
    return 0;
}
/**
 * Make a new move on the given board, and update the board state accordingly
 * Modifies the board state in place
 * @returns a boolean representing whether the move was successful
 */
function makeMove(boardState, x, y, player) {
    // Do not update on invalid moves
    const validity = (0, boardAnalysis_1.evaluateIfMoveIsValid)(boardState, x, y, player, false);
    if (validity !== _enums_1.GoValidity.valid || !boardState.board[x][y]?.color) {
        //console.debug(`Invalid move attempted! ${x} ${y} ${player} : ${validity}`);
        return false;
    }
    const point = boardState.board[x][y];
    if (!point)
        return false;
    // Add move to board history
    boardState.previousBoards.unshift((0, boardAnalysis_1.boardStringFromBoard)(boardState.board));
    (0, boardAnalysis_1.clearAllPointHighlights)(boardState);
    point.color = player;
    boardState.previousPlayer = player;
    boardState.passCount = 0;
    updateCaptures(boardState.board, player);
    return true;
}
/**
 * Pass the current player's turn without making a move.
 * Ends the game if this is the second pass in a row.
 */
function passTurn(boardState, player, allowEndGame = true) {
    if (boardState.previousPlayer === null || boardState.previousPlayer === player) {
        return;
    }
    (0, boardAnalysis_1.clearAllPointHighlights)(boardState);
    boardState.previousPlayer = boardState.previousPlayer === _enums_1.GoColor.black ? _enums_1.GoColor.white : _enums_1.GoColor.black;
    boardState.passCount++;
    if (boardState.passCount >= 2 && allowEndGame) {
        (0, scoring_1.endGoGame)(boardState);
    }
}
/**
 * Makes a number of random moves on the board before the game starts, to give one player an edge.
 * Modifies the board in place.
 */
function applyHandicap(board, handicap) {
    const availableMoves = [];
    for (const column of board) {
        for (const point of column) {
            if (point) {
                if (point.color !== _enums_1.GoColor.empty) {
                    // Game is in progress, don't apply handicap
                    return;
                }
                availableMoves.push(point);
            }
        }
    }
    const handicapMoveOptions = (0, goAI_1.getExpansionMoveArray)(board, availableMoves);
    const handicapMoves = [];
    // Special handling for 5x5: extra weight on handicap piece in the center of the board
    if (availableMoves.length < 26 && board[2][2] && Math.random() < 0.2) {
        board[2][2].color = _enums_1.GoColor.white;
        updateChains(board);
        return;
    }
    // select random distinct moves from the move options list up to the specified handicap amount
    for (let i = 0; i < handicap && i < handicapMoveOptions.length; i++) {
        const index = Math.floor(Math.random() * handicapMoveOptions.length);
        handicapMoves.push(handicapMoveOptions[index]);
        handicapMoveOptions.splice(index, 1);
    }
    handicapMoves.forEach((move) => {
        const point = board[move.point.x][move.point.y];
        return move.point && point && (point.color = _enums_1.GoColor.white);
    });
    updateChains(board);
}
/**
 * Finds all groups of connected stones on the board, and updates the points in them with their
 * chain information and liberties.
 * Updates a board in-place.
 */
function updateChains(board, resetChains = true) {
    resetChains && clearChains(board);
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
            const point = board[x][y];
            // If the current point is already analyzed, skip it
            if (!point || point.chain !== "")
                continue;
            const chainMembers = findAdjacentPointsInChain(board, x, y);
            const libertiesForChain = (0, boardAnalysis_1.findLibertiesForChain)(board, chainMembers);
            const id = `${point.x},${point.y}`;
            chainMembers.forEach((member) => {
                member.chain = id;
                member.liberties = libertiesForChain;
            });
        }
    }
}
/**
 * Assign each point on the board a chain ID, and link its list of 'liberties' (which are empty spaces
 * adjacent to some point on the chain including the current point).
 *
 * Then, remove any chains with no liberties.
 * Modifies the board in place.
 */
function updateCaptures(board, playerWhoMoved, resetChains = true) {
    updateChains(board, resetChains);
    const chains = (0, boardAnalysis_1.getAllChains)(board);
    const chainsToCapture = (0, boardAnalysis_1.findAllCapturedChains)(chains, playerWhoMoved);
    if (!chainsToCapture?.length) {
        return;
    }
    chainsToCapture?.forEach((chain) => captureChain(chain));
    updateChains(board);
}
/**
 * Removes a chain from the board, after being captured
 */
function captureChain(chain) {
    chain.forEach((point) => {
        point.color = _enums_1.GoColor.empty;
        point.chain = "";
        point.liberties = [];
    });
}
/**
 * Removes the chain data from all points on a board, in preparation for being recalculated later
 * Updates the board in-place
 */
function clearChains(board) {
    for (const column of board) {
        for (const point of column) {
            if (!point)
                continue;
            point.chain = "";
            point.liberties = null;
        }
    }
}
/**
 * Finds all the pieces in the current continuous group, or 'chain'
 *
 * Iteratively traverse the adjacent pieces of the same color to find all the pieces in the same chain,
 * which are the pieces connected directly via a path consisting only of only up/down/left/right
 */
function findAdjacentPointsInChain(board, x, y) {
    const point = board[x][y];
    if (!point) {
        return [];
    }
    const checkedPoints = [];
    const adjacentPoints = [point];
    const pointsToCheckNeighbors = [point];
    while (pointsToCheckNeighbors.length) {
        const currentPoint = pointsToCheckNeighbors.pop();
        if (!currentPoint) {
            break;
        }
        checkedPoints.push(currentPoint);
        const neighbors = findNeighbors(board, currentPoint.x, currentPoint.y);
        [neighbors.north, neighbors.east, neighbors.south, neighbors.west].filter(isNotNullish).forEach((neighbor) => {
            if (neighbor && neighbor.color === currentPoint.color && !contains(checkedPoints, neighbor)) {
                adjacentPoints.push(neighbor);
                pointsToCheckNeighbors.push(neighbor);
            }
            checkedPoints.push(neighbor);
        });
    }
    return adjacentPoints;
}
/**
 * Finds all empty spaces on the board.
 */
function getEmptySpaces(board) {
    const emptySpaces = [];
    board.forEach((column) => {
        column.forEach((point) => {
            if (point && point.color === _enums_1.GoColor.empty) {
                emptySpaces.push(point);
            }
        });
    });
    return emptySpaces;
}
/**
 * Makes a deep copy of the given board state
 */
function getStateCopy(initialState) {
    const boardState = structuredClone(initialState);
    boardState.previousBoards = initialState.previousBoards ?? [];
    boardState.previousPlayer = initialState.previousPlayer;
    boardState.ai = initialState.ai;
    boardState.passCount = initialState.passCount;
    return boardState;
}
/** Make a deep copy of a board */
function getBoardCopy(board) {
    return structuredClone(board);
}
function contains(arr, point) {
    return !!arr.find((p) => p && p.x === point.x && p.y === point.y);
}
function findNeighbors(board, x, y) {
    return {
        north: board[x]?.[y + 1],
        east: board[x + 1]?.[y],
        south: board[x]?.[y - 1],
        west: board[x - 1]?.[y],
    };
}
function getArrayFromNeighbor(neighborObject) {
    return [neighborObject.north, neighborObject.east, neighborObject.south, neighborObject.west].filter(isNotNullish);
}
function isNotNullish(argument) {
    return argument != null;
}
