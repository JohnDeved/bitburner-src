"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatedBoardFromSimpleBoard = void 0;
exports.evaluateIfMoveIsValid = evaluateIfMoveIsValid;
exports.evaluateMoveResult = evaluateMoveResult;
exports.getControlledSpace = getControlledSpace;
exports.findEffectiveLibertiesOfNewMove = findEffectiveLibertiesOfNewMove;
exports.findMaxLibertyCountOfAdjacentChains = findMaxLibertyCountOfAdjacentChains;
exports.findMinLibertyCountOfAdjacentChains = findMinLibertyCountOfAdjacentChains;
exports.findEnemyNeighborChainWithFewestLiberties = findEnemyNeighborChainWithFewestLiberties;
exports.getAllValidMoves = getAllValidMoves;
exports.getAllEyesByChainId = getAllEyesByChainId;
exports.getAllEyes = getAllEyes;
exports.getAllPotentialEyes = getAllPotentialEyes;
exports.getAllNeighboringChains = getAllNeighboringChains;
exports.getPlayerNeighbors = getPlayerNeighbors;
exports.getAllNeighbors = getAllNeighbors;
exports.isPointInChain = isPointInChain;
exports.getAllChains = getAllChains;
exports.findAllCapturedChains = findAllCapturedChains;
exports.findLibertiesForChain = findLibertiesForChain;
exports.findChainLibertiesForPoint = findChainLibertiesForPoint;
exports.findAdjacentLibertiesForPoint = findAdjacentLibertiesForPoint;
exports.findAdjacentLibertiesAndAlliesForPoint = findAdjacentLibertiesAndAlliesForPoint;
exports.simpleBoardFromBoard = simpleBoardFromBoard;
exports.boardStringFromBoard = boardStringFromBoard;
exports.boardFromBoardString = boardFromBoardString;
exports.simpleBoardFromBoardString = simpleBoardFromBoardString;
exports.boardFromSimpleBoard = boardFromSimpleBoard;
exports.boardStateFromSimpleBoard = boardStateFromSimpleBoard;
exports.blankPointState = blankPointState;
exports.areSimpleBoardsIdentical = areSimpleBoardsIdentical;
exports.getColorOnBoardString = getColorOnBoardString;
exports.getPreviousMove = getPreviousMove;
exports.getPreviousMoveDetails = getPreviousMoveDetails;
exports.addPointHighlight = addPointHighlight;
exports.clearPointHighlight = clearPointHighlight;
exports.clearAllPointHighlights = clearAllPointHighlights;
const _enums_1 = require("@enums");
const Go_1 = require("../Go");
const boardState_1 = require("../boardState/boardState");
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
function evaluateIfMoveIsValid(boardState, x, y, player, shortcut = true) {
    const point = boardState.board[x]?.[y];
    if (boardState.previousPlayer === null) {
        return _enums_1.GoValidity.gameOver;
    }
    if (boardState.previousPlayer === player) {
        return _enums_1.GoValidity.notYourTurn;
    }
    if (!point) {
        return _enums_1.GoValidity.pointBroken;
    }
    if (point.color !== _enums_1.GoColor.empty) {
        return _enums_1.GoValidity.pointNotEmpty;
    }
    // Detect if the move might be an immediate repeat (only one board of history is saved to check)
    const possibleRepeat = boardState.previousBoards.find((board) => getColorOnBoardString(board, x, y) === player);
    if (shortcut) {
        // If the current point has some adjacent open spaces, it is not suicide. If the move is not repeated, it is legal
        const liberties = findAdjacentLibertiesForPoint(boardState.board, x, y);
        const hasLiberty = liberties.north || liberties.east || liberties.south || liberties.west;
        if (!possibleRepeat && hasLiberty) {
            return _enums_1.GoValidity.valid;
        }
        // If a connected friendly chain has more than one liberty, the move is not suicide. If the move is not repeated, it is legal
        const neighborChainLibertyCount = findMaxLibertyCountOfAdjacentChains(boardState, x, y, player);
        if (!possibleRepeat && neighborChainLibertyCount > 1) {
            return _enums_1.GoValidity.valid;
        }
        // If there is any neighboring enemy chain with only one liberty, and the move is not repeated, it is valid,
        // because it would capture the enemy chain and free up some liberties for itself
        const potentialCaptureChainLibertyCount = findMinLibertyCountOfAdjacentChains(boardState.board, x, y, player === _enums_1.GoColor.black ? _enums_1.GoColor.white : _enums_1.GoColor.black);
        if (!possibleRepeat && potentialCaptureChainLibertyCount < 2) {
            return _enums_1.GoValidity.valid;
        }
        // If there is no direct liberties for the move, no captures, and no neighboring friendly chains with multiple liberties,
        // the move is not valid because it would suicide the piece
        if (!hasLiberty && potentialCaptureChainLibertyCount >= 2 && neighborChainLibertyCount <= 1) {
            return _enums_1.GoValidity.noSuicide;
        }
    }
    // If the move has been played before and is not obviously illegal, we have to actually play it out to determine
    // if it is a repeated move, or if it is a valid move
    const evaluationBoard = evaluateMoveResult(boardState.board, x, y, player, true);
    if (evaluationBoard[x]?.[y]?.color !== player) {
        return _enums_1.GoValidity.noSuicide;
    }
    if (possibleRepeat && boardState.previousBoards.length) {
        const simpleEvalBoard = boardStringFromBoard(evaluationBoard);
        if (boardState.previousBoards.includes(simpleEvalBoard)) {
            return _enums_1.GoValidity.boardRepeated;
        }
    }
    return _enums_1.GoValidity.valid;
}
/**
 * Create a new evaluation board and play out the results of the given move on the new board
 * @returns the evaluation board
 */
function evaluateMoveResult(board, x, y, player, resetChains = false) {
    const evaluationBoard = (0, boardState_1.getBoardCopy)(board);
    const point = evaluationBoard[x]?.[y];
    if (!point)
        return board;
    point.color = player;
    const neighbors = (0, boardState_1.getArrayFromNeighbor)((0, boardState_1.findNeighbors)(board, x, y));
    const chainIdsToUpdate = [point.chain, ...neighbors.map((point) => point.chain)];
    resetChainsById(evaluationBoard, chainIdsToUpdate);
    (0, boardState_1.updateCaptures)(evaluationBoard, player, resetChains);
    return evaluationBoard;
}
function getControlledSpace(board) {
    const chains = getAllChains(board);
    const length = board[0].length;
    const whiteControlledEmptyNodes = getAllPotentialEyes(board, chains, _enums_1.GoColor.white, length * 2)
        .map((eye) => eye.chain)
        .flat();
    const blackControlledEmptyNodes = getAllPotentialEyes(board, chains, _enums_1.GoColor.black, length * 2)
        .map((eye) => eye.chain)
        .flat();
    const ownedPointGrid = Array.from({ length }, () => Array.from({ length }, () => _enums_1.GoColor.empty));
    whiteControlledEmptyNodes.forEach((node) => {
        ownedPointGrid[node.x][node.y] = _enums_1.GoColor.white;
    });
    blackControlledEmptyNodes.forEach((node) => {
        ownedPointGrid[node.x][node.y] = _enums_1.GoColor.black;
    });
    return ownedPointGrid;
}
/**
  Clear the chain and liberty data of all points in the given chains
 */
const resetChainsById = (board, chainIds) => {
    for (const column of board) {
        for (const point of column) {
            if (!point || !chainIds.includes(point.chain))
                continue;
            point.chain = "";
            point.liberties = [];
        }
    }
};
/**
 * For a potential move, determine what the liberty of the point would be if played, by looking at adjacent empty nodes
 * as well as the remaining liberties of neighboring friendly chains
 */
function findEffectiveLibertiesOfNewMove(board, x, y, player) {
    const friendlyChains = getAllChains(board).filter((chain) => chain[0].color === player);
    const neighbors = findAdjacentLibertiesAndAlliesForPoint(board, x, y, player);
    const neighborPoints = [neighbors.north, neighbors.east, neighbors.south, neighbors.west].filter(boardState_1.isNotNullish);
    // Get all chains that the new move will connect to
    const allyNeighbors = neighborPoints.filter((neighbor) => neighbor.color === player);
    const allyNeighborChainLiberties = allyNeighbors
        .map((neighbor) => {
        const chain = friendlyChains.find((chain) => chain[0].chain === neighbor.chain);
        return chain?.[0]?.liberties ?? null;
    })
        .flat()
        .filter(boardState_1.isNotNullish);
    // Get all empty spaces that the new move connects to that aren't already part of friendly liberties
    const directLiberties = neighborPoints.filter((neighbor) => neighbor.color === _enums_1.GoColor.empty);
    const allLiberties = [...directLiberties, ...allyNeighborChainLiberties];
    // filter out duplicates, and starting point
    return allLiberties
        .filter((liberty, index) => allLiberties.findIndex((neighbor) => liberty.x === neighbor.x && liberty.y === neighbor.y) === index)
        .filter((liberty) => liberty.x !== x || liberty.y !== y);
}
/**
 * Find the number of open spaces that are connected to chains adjacent to a given point, and return the maximum
 */
function findMaxLibertyCountOfAdjacentChains(boardState, x, y, player) {
    const neighbors = findAdjacentLibertiesAndAlliesForPoint(boardState.board, x, y, player);
    const friendlyNeighbors = [neighbors.north, neighbors.east, neighbors.south, neighbors.west]
        .filter(boardState_1.isNotNullish)
        .filter((neighbor) => neighbor.color === player);
    return friendlyNeighbors.reduce((max, neighbor) => Math.max(max, neighbor?.liberties?.length ?? 0), 0);
}
/**
 * Find the number of open spaces that are connected to chains adjacent to a given point, and return the minimum
 */
function findMinLibertyCountOfAdjacentChains(board, x, y, player) {
    const chain = findEnemyNeighborChainWithFewestLiberties(board, x, y, player);
    return chain?.[0]?.liberties?.length ?? 99;
}
function findEnemyNeighborChainWithFewestLiberties(board, x, y, player) {
    const chains = getAllChains(board);
    const neighbors = findAdjacentLibertiesAndAlliesForPoint(board, x, y, player);
    const friendlyNeighbors = [neighbors.north, neighbors.east, neighbors.south, neighbors.west]
        .filter(boardState_1.isNotNullish)
        .filter((neighbor) => neighbor.color === player);
    const minimumLiberties = friendlyNeighbors.reduce((min, neighbor) => Math.min(min, neighbor?.liberties?.length ?? 0), friendlyNeighbors?.[0]?.liberties?.length ?? 99);
    const chainId = friendlyNeighbors.find((neighbor) => neighbor?.liberties?.length === minimumLiberties)?.chain;
    return chains.find((chain) => chain[0].chain === chainId);
}
/**
 * Returns a list of points that are valid moves for the given player
 */
function getAllValidMoves(boardState, player) {
    return (0, boardState_1.getEmptySpaces)(boardState.board).filter((point) => evaluateIfMoveIsValid(boardState, point.x, point.y, player) === _enums_1.GoValidity.valid);
}
/**
  Find all empty point groups where either:
  * all of its immediate surrounding player-controlled points are in the same continuous chain, or
  * it is completely surrounded by some single larger chain and the edge of the board

  Eyes are important, because a chain of pieces cannot be captured if it fully surrounds two or more eyes.
 */
function getAllEyesByChainId(board, player) {
    const allChains = getAllChains(board);
    const eyeCandidates = getAllPotentialEyes(board, allChains, player);
    const eyes = {};
    eyeCandidates.forEach((candidate) => {
        if (candidate.neighbors.length === 0) {
            return;
        }
        // If only one chain surrounds the empty space, it is a true eye
        if (candidate.neighbors.length === 1) {
            const neighborChainID = candidate.neighbors[0][0].chain;
            eyes[neighborChainID] = eyes[neighborChainID] || [];
            eyes[neighborChainID].push(candidate.chain);
            return;
        }
        // If any chain fully encircles the empty space (even if there are other chains encircled as well), the eye is true
        const neighborsEncirclingEye = findNeighboringChainsThatFullyEncircleEmptySpace(board, candidate.chain, candidate.neighbors, allChains);
        neighborsEncirclingEye.forEach((neighborChain) => {
            const neighborChainID = neighborChain[0].chain;
            eyes[neighborChainID] = eyes[neighborChainID] || [];
            eyes[neighborChainID].push(candidate.chain);
        });
    });
    return eyes;
}
/**
 * Get a list of all eyes, grouped by the chain they are adjacent to
 */
function getAllEyes(board, player, eyesObject) {
    const eyes = eyesObject ?? getAllEyesByChainId(board, player);
    return Object.keys(eyes).map((key) => eyes[key]);
}
/**
  Find all empty spaces completely surrounded by a single player color.
  For each player chain number, add any empty space chains that are completely surrounded by a single player's color to
   an array at that chain number's index.
 */
function getAllPotentialEyes(board, allChains, player, _maxSize) {
    const nodeCount = board.map((row) => row.filter((p) => p)).flat().length;
    const maxSize = _maxSize ?? Math.min(nodeCount * 0.4, 11);
    const emptyPointChains = allChains.filter((chain) => chain[0].color === _enums_1.GoColor.empty);
    const eyeCandidates = [];
    emptyPointChains
        .filter((chain) => chain.length <= maxSize)
        .forEach((chain) => {
        const neighboringChains = getAllNeighboringChains(board, chain, allChains);
        const hasWhitePieceNeighbor = neighboringChains.find((neighborChain) => neighborChain[0]?.color === _enums_1.GoColor.white);
        const hasBlackPieceNeighbor = neighboringChains.find((neighborChain) => neighborChain[0]?.color === _enums_1.GoColor.black);
        // Record the neighbor chains of the eye candidate empty chain, if all of its neighbors are the same color piece
        if ((hasWhitePieceNeighbor && !hasBlackPieceNeighbor && player === _enums_1.GoColor.white) ||
            (!hasWhitePieceNeighbor && hasBlackPieceNeighbor && player === _enums_1.GoColor.black)) {
            eyeCandidates.push({
                neighbors: neighboringChains,
                chain: chain,
                id: chain[0].chain,
            });
        }
    });
    return eyeCandidates;
}
/**
 *  For each chain bordering an eye candidate:
 *    remove all other neighboring chains. (replace with empty points)
 *    check if the eye candidate is a simple true eye now
 *       If so, the original candidate is a true eye.
 */
function findNeighboringChainsThatFullyEncircleEmptySpace(board, candidateChain, neighborChainList, allChains) {
    const boardMax = board[0].length - 1;
    const candidateSpread = findFurthestPointsOfChain(candidateChain);
    return neighborChainList.filter((neighborChain, index) => {
        // If the chain does not go far enough to surround the eye in question, don't bother building an eval board
        const neighborSpread = findFurthestPointsOfChain(neighborChain);
        const couldWrapNorth = neighborSpread.north > candidateSpread.north ||
            (candidateSpread.north === boardMax && neighborSpread.north === boardMax);
        const couldWrapEast = neighborSpread.east > candidateSpread.east ||
            (candidateSpread.east === boardMax && neighborSpread.east === boardMax);
        const couldWrapSouth = neighborSpread.south < candidateSpread.south || (candidateSpread.south === 0 && neighborSpread.south === 0);
        const couldWrapWest = neighborSpread.west < candidateSpread.west || (candidateSpread.west === 0 && neighborSpread.west === 0);
        if (!couldWrapNorth || !couldWrapEast || !couldWrapSouth || !couldWrapWest) {
            return false;
        }
        const evaluationBoard = (0, boardState_1.getBoardCopy)(board);
        const examplePoint = candidateChain[0];
        const otherChainNeighborPoints = removePointAtIndex(neighborChainList, index).flat().filter(boardState_1.isNotNullish);
        otherChainNeighborPoints.forEach((point) => {
            const pointToEdit = evaluationBoard[point.x]?.[point.y];
            if (pointToEdit) {
                pointToEdit.color = _enums_1.GoColor.empty;
            }
        });
        (0, boardState_1.updateChains)(evaluationBoard);
        const newChains = getAllChains(evaluationBoard);
        const newChainID = evaluationBoard[examplePoint.x]?.[examplePoint.y]?.chain;
        const chain = newChains.find((chain) => chain[0].chain === newChainID) || [];
        const newNeighborChains = getAllNeighboringChains(board, chain, allChains);
        return newNeighborChains.length === 1;
    });
}
/**
 * Determine the furthest that a chain extends in each of the cardinal directions
 */
function findFurthestPointsOfChain(chain) {
    return chain.reduce((directions, point) => {
        if (point.y > directions.north) {
            directions.north = point.y;
        }
        if (point.y < directions.south) {
            directions.south = point.y;
        }
        if (point.x > directions.east) {
            directions.east = point.x;
        }
        if (point.x < directions.west) {
            directions.west = point.x;
        }
        return directions;
    }, {
        north: chain[0].y,
        east: chain[0].x,
        south: chain[0].y,
        west: chain[0].x,
    });
}
/**
 * Removes an element from an array at the given index
 */
function removePointAtIndex(arr, index) {
    const newArr = [...arr];
    newArr.splice(index, 1);
    return newArr;
}
/**
 * Get all player chains that are adjacent / touching the current chain
 */
function getAllNeighboringChains(board, chain, allChains) {
    const playerNeighbors = getPlayerNeighbors(board, chain);
    const neighboringChains = playerNeighbors.reduce((neighborChains, neighbor) => neighborChains.add(allChains.find((chain) => chain[0].chain === neighbor.chain) || []), new Set());
    return [...neighboringChains];
}
/**
 * Gets all points that have player pieces adjacent to the given point
 */
function getPlayerNeighbors(board, chain) {
    return getAllNeighbors(board, chain).filter((neighbor) => neighbor && neighbor.color !== _enums_1.GoColor.empty);
}
/**
 * Gets all points adjacent to the given point
 */
function getAllNeighbors(board, chain) {
    const allNeighbors = chain.reduce((chainNeighbors, point) => {
        (0, boardState_1.getArrayFromNeighbor)((0, boardState_1.findNeighbors)(board, point.x, point.y))
            .filter((neighborPoint) => !isPointInChain(neighborPoint, chain))
            .forEach((neighborPoint) => chainNeighbors.add(neighborPoint));
        return chainNeighbors;
    }, new Set());
    return [...allNeighbors];
}
/**
 * Determines if chain has a point that matches the given coordinates
 */
function isPointInChain(point, chain) {
    return !!chain.find((chainPoint) => chainPoint.x === point.x && chainPoint.y === point.y);
}
/**
 * Finds all groups of connected pieces, or empty space groups
 */
function getAllChains(board) {
    const chains = {};
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
            const point = board[x]?.[y];
            // If the current chain is already analyzed, skip it
            if (!point || point.chain === "") {
                continue;
            }
            chains[point.chain] = chains[point.chain] || [];
            chains[point.chain].push(point);
        }
    }
    return Object.keys(chains).map((key) => chains[key]);
}
/**
 * Find any group of stones with no liberties (who therefore are to be removed from the board)
 */
function findAllCapturedChains(chainList, playerWhoMoved) {
    const opposingPlayer = playerWhoMoved === _enums_1.GoColor.white ? _enums_1.GoColor.black : _enums_1.GoColor.white;
    const enemyChainsToCapture = findCapturedChainOfColor(chainList, opposingPlayer);
    if (enemyChainsToCapture.length) {
        return enemyChainsToCapture;
    }
    const friendlyChainsToCapture = findCapturedChainOfColor(chainList, playerWhoMoved);
    if (friendlyChainsToCapture.length) {
        return friendlyChainsToCapture;
    }
}
function findCapturedChainOfColor(chainList, playerColor) {
    return chainList.filter((chain) => chain?.[0].color === playerColor && chain?.[0].liberties?.length === 0);
}
/**
 * Find all empty points adjacent to any piece in a given chain
 */
function findLibertiesForChain(board, chain) {
    return getAllNeighbors(board, chain).filter((neighbor) => neighbor && neighbor.color === _enums_1.GoColor.empty);
}
/**
 * Find all empty points adjacent to any piece in the chain that a given point belongs to
 */
function findChainLibertiesForPoint(board, x, y) {
    const chain = (0, boardState_1.findAdjacentPointsInChain)(board, x, y);
    return findLibertiesForChain(board, chain);
}
/**
 * Returns an object that includes which of the cardinal neighbors are empty
 * (adjacent 'liberties' of the current piece )
 */
function findAdjacentLibertiesForPoint(board, x, y) {
    const neighbors = (0, boardState_1.findNeighbors)(board, x, y);
    const hasNorthLiberty = neighbors.north && neighbors.north.color === _enums_1.GoColor.empty;
    const hasEastLiberty = neighbors.east && neighbors.east.color === _enums_1.GoColor.empty;
    const hasSouthLiberty = neighbors.south && neighbors.south.color === _enums_1.GoColor.empty;
    const hasWestLiberty = neighbors.west && neighbors.west.color === _enums_1.GoColor.empty;
    return {
        north: hasNorthLiberty ? neighbors.north : null,
        east: hasEastLiberty ? neighbors.east : null,
        south: hasSouthLiberty ? neighbors.south : null,
        west: hasWestLiberty ? neighbors.west : null,
    };
}
/**
 * Returns an object that includes which of the cardinal neighbors are either empty or contain the
 * current player's pieces. Used for making the connection map on the board
 */
function findAdjacentLibertiesAndAlliesForPoint(board, x, y, _player) {
    const currentPoint = board[x]?.[y];
    const player = _player || (!currentPoint || currentPoint.color === _enums_1.GoColor.empty ? undefined : currentPoint.color);
    const adjacentLiberties = findAdjacentLibertiesForPoint(board, x, y);
    const neighbors = (0, boardState_1.findNeighbors)(board, x, y);
    return {
        north: adjacentLiberties.north || neighbors.north?.color === player ? neighbors.north : null,
        east: adjacentLiberties.east || neighbors.east?.color === player ? neighbors.east : null,
        south: adjacentLiberties.south || neighbors.south?.color === player ? neighbors.south : null,
        west: adjacentLiberties.west || neighbors.west?.color === player ? neighbors.west : null,
    };
}
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
function simpleBoardFromBoard(board) {
    return board.map((column) => column.reduce((str, point) => {
        if (!point) {
            return str + "#";
        }
        if (point.color === _enums_1.GoColor.black) {
            return str + "X";
        }
        if (point.color === _enums_1.GoColor.white) {
            return str + "O";
        }
        return str + ".";
    }, ""));
}
/**
 * Returns a string representation of the given board.
 * The string representation is the same as simpleBoardFromBoard() but concatenated into a single string
 *
 * For example, a 5x5 board might look like this:
 * ```
 *   "XX.O.X..OO.XO..XXO...XOO."
 * ```
 */
function boardStringFromBoard(board) {
    return simpleBoardFromBoard(board).join("");
}
/**
 * Returns a full board object from a string representation of the board.
 * The string representation is the same as simpleBoardFromBoard() but concatenated into a single string
 *
 * For example, a 5x5 board might look like this:
 * ```
 *   "XX.O.X..OO.XO..XXO...XOO."
 * ```
 */
function boardFromBoardString(boardString) {
    const simpleBoardArray = simpleBoardFromBoardString(boardString);
    return boardFromSimpleBoard(simpleBoardArray);
}
/**
 * Slices a string representation of a board into an array of strings representing the rows on the board
 */
function simpleBoardFromBoardString(boardString) {
    // Turn the SimpleBoard string into a string array, allowing access of each point via indexes e.g. [0][1]
    const boardSize = Math.round(Math.sqrt(boardString.length));
    const boardTiles = boardString.split("");
    // Split the single board string into rows of length equal to the board width
    const simpleBoardArray = Array(boardSize)
        .fill("")
        .map((_, index) => boardTiles.slice(index * boardSize, (index + 1) * boardSize).join(""));
    return simpleBoardArray;
}
/** Creates a board object from a simple board. The resulting board has no analytics (liberties/chains) */
function boardFromSimpleBoard(simpleBoard) {
    return simpleBoard.map((column, x) => column.split("").map((char, y) => {
        if (char === "#")
            return null;
        if (char === "X")
            return blankPointState(_enums_1.GoColor.black, x, y);
        if (char === "O")
            return blankPointState(_enums_1.GoColor.white, x, y);
        return blankPointState(_enums_1.GoColor.empty, x, y);
    }));
}
/**
 * Creates a Board object from the given simpleBoard string array
 * Also updates the board object with the analytics (liberties/chains) from the simple board
 */
const updatedBoardFromSimpleBoard = (simpleBoard) => {
    const board = boardFromSimpleBoard(simpleBoard);
    (0, boardState_1.updateChains)(board);
    return board;
};
exports.updatedBoardFromSimpleBoard = updatedBoardFromSimpleBoard;
function boardStateFromSimpleBoard(simpleBoard, ai = _enums_1.GoOpponent.Daedalus, lastPlayer = _enums_1.GoColor.black) {
    const newBoardState = (0, boardState_1.getNewBoardState)(simpleBoard[0].length, ai, false, boardFromSimpleBoard(simpleBoard));
    newBoardState.previousPlayer = lastPlayer;
    (0, boardState_1.updateCaptures)(newBoardState.board, lastPlayer);
    return newBoardState;
}
function blankPointState(color, x, y) {
    return {
        color: color,
        y,
        x,
        chain: "",
        liberties: null,
    };
}
function areSimpleBoardsIdentical(simpleBoard1, simpleBoard2) {
    return simpleBoard1.every((column, x) => column === simpleBoard2[x]);
}
function getColorOnBoardString(boardString, x, y) {
    const boardSize = Math.round(Math.sqrt(boardString.length));
    const char = boardString[x * boardSize + y];
    if (char === "X")
        return _enums_1.GoColor.black;
    if (char === "O")
        return _enums_1.GoColor.white;
    if (char === ".")
        return _enums_1.GoColor.empty;
    return null;
}
/** Find a move made by the previous player, if present. */
function getPreviousMove() {
    const priorBoard = Go_1.Go.currentGame.previousBoards[0];
    if (Go_1.Go.currentGame.passCount || !priorBoard) {
        return null;
    }
    for (const [rowIndex, row] of Go_1.Go.currentGame.board.entries()) {
        for (const [pointIndex, point] of row.entries()) {
            const priorColor = point && getColorOnBoardString(priorBoard, point.x, point.y);
            const currentColor = point?.color;
            const isPreviousPlayer = currentColor === Go_1.Go.currentGame.previousPlayer;
            const isChanged = priorColor !== currentColor;
            if (priorColor && currentColor && isPreviousPlayer && isChanged) {
                return [rowIndex, pointIndex];
            }
        }
    }
    return null;
}
/**
 * Gets the last move, if it was made by the specified color and is present
 */
function getPreviousMoveDetails() {
    const priorMove = getPreviousMove();
    if (priorMove) {
        return {
            type: _enums_1.GoPlayType.move,
            x: priorMove[0],
            y: priorMove[1],
        };
    }
    return {
        type: Go_1.Go.currentGame.previousPlayer ? _enums_1.GoPlayType.pass : _enums_1.GoPlayType.gameOver,
        x: null,
        y: null,
    };
}
function addPointHighlight(board, x, y, color, text) {
    board.highlightedPoints[x][y] = { color, text };
    Go_1.GoEvents.emit();
}
function clearPointHighlight(board, x, y) {
    board.highlightedPoints[x][y] = null;
    Go_1.GoEvents.emit();
}
function clearAllPointHighlights(board) {
    board.highlightedPoints = (0, Go_1.getEmptyHighlightedPoints)(Go_1.Go.currentGame.board.length);
    Go_1.GoEvents.emit();
}
