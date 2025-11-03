"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addObstacles = addObstacles;
exports.resetCoordinates = resetCoordinates;
exports.removeIslands = removeIslands;
exports.rotate90Degrees = rotate90Degrees;
const _player_1 = require("@player");
const Constants_1 = require("../Constants");
const RNG_1 = require("../../Casino/RNG");
const boardAnalysis_1 = require("../boardAnalysis/boardAnalysis");
const boardState_1 = require("./boardState");
const _enums_1 = require("@enums");
function addObstacles(boardState) {
    const rng = new RNG_1.WHRNG(_player_1.Player.totalPlaytime ?? new Date().getTime());
    const random = (n1, n2) => n1 + Math.floor((n2 - n1 + 1) * rng.random());
    const shouldRemoveCorner = !random(0, 4);
    const shouldRemoveRows = !shouldRemoveCorner && !random(0, 4);
    const shouldAddCenterBreak = !shouldRemoveCorner && !shouldRemoveRows && random(0, 3);
    const obstacleTypeCount = +shouldRemoveCorner + +shouldRemoveRows + +shouldAddCenterBreak;
    const edgeDeadCount = random(1, (getScale(boardState.board) + 2 - obstacleTypeCount) * 1.5);
    if (shouldRemoveCorner) {
        boardState.board = addDeadCorners(boardState.board, random);
    }
    if (shouldAddCenterBreak) {
        boardState.board = addCenterBreak(boardState.board, random);
    }
    boardState.board = randomizeRotation(boardState.board, random);
    if (shouldRemoveRows) {
        boardState.board = removeRows(boardState.board, random);
    }
    boardState.board = addDeadNodesToEdge(boardState.board, random, edgeDeadCount);
    boardState.board = ensureOfflineNodes(boardState.board);
    boardState.board = resetCoordinates(boardState.board);
    boardState.board = removeIslands(boardState.board);
}
function resetCoordinates(board) {
    const size = board[0].length;
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const point = board[x]?.[y];
            if (point) {
                point.x = x;
                point.y = y;
            }
        }
    }
    return board;
}
/**
 * Removes all tiny islands of empty points (2 or fewer) from the board
 * @param board
 */
function removeIslands(board) {
    (0, boardState_1.updateChains)(board, true);
    const chains = (0, boardAnalysis_1.getAllChains)(board);
    for (const chain of chains) {
        if (chain.length <= 2 && chain[0]?.color === _enums_1.GoColor.empty) {
            for (const point of chain) {
                board[point.x][point.y] = null;
            }
        }
    }
    return board;
}
function getScale(board) {
    return Constants_1.boardSizes.indexOf(board[0].length);
}
function removeRows(board, random) {
    const rowsToRemove = Math.max(random(-2, getScale(board)), 1);
    for (let i = 0; i < rowsToRemove; i++) {
        board[i] = board[i].map(() => null);
    }
    board = rotateNTimes(board, 3);
    return board;
}
function addDeadNodesToEdge(board, random, maxPerEdge) {
    const size = board[0].length;
    for (let i = 0; i < 4; i++) {
        const count = random(0, maxPerEdge);
        for (let j = 0; j < count; j++) {
            const yIndex = Math.max(random(-2, size - 1), 0);
            board[0][yIndex] = null;
        }
        board = rotate90Degrees(board);
    }
    return board;
}
function addDeadCorners(board, random) {
    const scale = getScale(board) + 1;
    addDeadCorner(board, random, scale);
    if (!random(0, 3)) {
        board = rotate90Degrees(board);
        board = rotate90Degrees(board);
        addDeadCorner(board, random, scale - 2);
    }
    return randomizeRotation(board, random);
}
function addDeadCorner(board, random, size) {
    let currentSize = size;
    for (let i = 0; i < size && i < currentSize; i++) {
        random(0, 1) && currentSize--;
        board[i].forEach((point, index) => index < currentSize && point && (board[point.x][point.y] = null));
    }
    return board;
}
function addCenterBreak(board, random) {
    const size = board[0].length;
    const maxOffset = getScale(board);
    const xIndex = random(0, maxOffset * 2) - maxOffset + Math.floor(size / 2);
    const length = random(1, Math.floor(size / 2 - 1));
    board[xIndex] = board[xIndex].map((point, index) => (index < length ? null : point));
    return randomizeRotation(board, random);
}
function ensureOfflineNodes(board) {
    if (board.flat().some((point) => !point)) {
        return board;
    }
    board[0][0] = null;
    return board;
}
function randomizeRotation(board, random) {
    return rotateNTimes(board, random(0, 3));
}
function rotateNTimes(board, rotations) {
    for (let i = 0; i < rotations; i++) {
        board = rotate90Degrees(board);
    }
    return board;
}
function rotate90Degrees(board) {
    return board[0].map((_, index) => board.map((row) => row[index]).reverse());
}
