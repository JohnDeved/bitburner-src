"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMove = validateMove;
exports.handlePassTurn = handlePassTurn;
exports.makePlayerMove = makePlayerMove;
exports.getOpponentNextMove = getOpponentNextMove;
exports.getValidMoves = getValidMoves;
exports.getChains = getChains;
exports.getLiberties = getLiberties;
exports.getControlledEmptyNodes = getControlledEmptyNodes;
exports.setTestingBoardState = setTestingBoardState;
exports.getHistory = getHistory;
exports.getGameState = getGameState;
exports.getMoveHistory = getMoveHistory;
exports.getCurrentPlayer = getCurrentPlayer;
exports.resetBoardState = resetBoardState;
exports.getStats = getStats;
exports.resetStats = resetStats;
exports.validateBoardState = validateBoardState;
exports.checkCheatApiAccess = checkCheatApiAccess;
exports.determineCheatSuccess = determineCheatSuccess;
exports.cheatSuccessChance = cheatSuccessChance;
exports.cheatRemoveRouter = cheatRemoveRouter;
exports.cheatPlayTwoMoves = cheatPlayTwoMoves;
exports.cheatRepairOfflineNode = cheatRepairOfflineNode;
exports.cheatDestroyNode = cheatDestroyNode;
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const Go_1 = require("../Go");
const boardState_1 = require("../boardState/boardState");
const goAI_1 = require("../boardAnalysis/goAI");
const boardAnalysis_1 = require("../boardAnalysis/boardAnalysis");
const scoring_1 = require("../boardAnalysis/scoring");
const RNG_1 = require("../../Casino/RNG");
const Record_1 = require("../../Types/Record");
const effect_1 = require("./effect");
const Constants_1 = require("../Constants");
const NetscriptHelpers_1 = require("../../Netscript/NetscriptHelpers");
const ErrorMessages_1 = require("../../Netscript/ErrorMessages");
/**
 * Check the move based on the current settings
 */
function validateMove(ctx, x, y, methodName = "", settings = {}) {
    Go_1.Go.moveOrCheatViaApi = true;
    const check = {
        emptyNode: true,
        requireNonEmptyNode: false,
        repeat: true,
        onlineNode: true,
        requireOfflineNode: false,
        suicide: true,
        playAsWhite: false,
        pass: false,
        ...settings,
    };
    const moveString = methodName + (check.pass ? "" : ` ${x},${y}`) + (check.playAsWhite ? " (White)" : "") + ": ";
    const moveColor = check.playAsWhite ? _enums_1.GoColor.white : _enums_1.GoColor.black;
    if (check.playAsWhite) {
        validatePlayAsWhite(ctx);
    }
    validateTurn(ctx, moveString, moveColor);
    if (check.pass) {
        return;
    }
    const boardSize = Go_1.Go.currentGame.board.length;
    if (x < 0 || x >= boardSize) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, `Invalid column number (x = ${x}), column must be a number 0 through ${boardSize - 1}`);
    }
    if (y < 0 || y >= boardSize) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, `Invalid row number (y = ${y}), row must be a number 0 through ${boardSize - 1}`);
    }
    const validity = (0, boardAnalysis_1.evaluateIfMoveIsValid)(Go_1.Go.currentGame, x, y, moveColor);
    const point = Go_1.Go.currentGame.board[x][y];
    if (!point && check.onlineNode) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, `The node ${x},${y} is offline, so you cannot ${methodName === "removeRouter"
            ? "clear this point with removeRouter()"
            : methodName === "destroyNode"
                ? "destroy the node. (Attempted to destroyNode)"
                : "place a router there"}.`);
    }
    if (validity === _enums_1.GoValidity.noSuicide && check.suicide) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, `${moveString} ${validity}. That point has no neighboring empty nodes, and is not connected to a network with access to empty nodes, meaning it would be instantly captured if played there.`);
    }
    if (validity === _enums_1.GoValidity.boardRepeated && check.repeat) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, `${moveString} ${validity}. That move would repeat the previous board state, which is illegal as it leads to infinite loops.`);
    }
    if (point?.color !== _enums_1.GoColor.empty && check.emptyNode) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, `The point ${x},${y} is occupied by a router, so you cannot ${methodName === "destroyNode" ? "destroy this node. (Attempted to destroyNode)" : "place a router there"}`);
    }
    if (point?.color === _enums_1.GoColor.empty && check.requireNonEmptyNode) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, `The point ${x},${y} does not have a router on it, so you cannot clear this point with removeRouter().`);
    }
    if (point && check.requireOfflineNode) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, `The node ${x},${y} is not offline, so you cannot repair the node.`);
    }
}
function validatePlayAsWhite(ctx) {
    if (Go_1.Go.currentGame.ai !== _enums_1.GoOpponent.none) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, `${_enums_1.GoValidity.invalid}. You can only play as white when playing against 'No AI'`);
    }
    if (Go_1.Go.currentGame.previousPlayer === _enums_1.GoColor.white) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, `${_enums_1.GoValidity.notYourTurn}. You cannot play or pass as white until the opponent has played.`);
    }
}
function validateTurn(ctx, moveString = "", color = _enums_1.GoColor.black) {
    if (Go_1.Go.currentGame.previousPlayer === color) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, `${moveString} ${_enums_1.GoValidity.notYourTurn}. Do you have multiple scripts running, or did you forget to await makeMove() or opponentNextTurn()`);
    }
    if (Go_1.Go.currentGame.previousPlayer === null) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, `${moveString} ${_enums_1.GoValidity.gameOver}. You cannot make more moves. Start a new game using resetBoardState().`);
    }
}
/**
 * Pass player's turn and await the opponent's response (or logs the end of the game if both players pass)
 */
function handlePassTurn(ctx, passAsWhite = false) {
    const color = passAsWhite ? _enums_1.GoColor.white : _enums_1.GoColor.black;
    (0, boardState_1.passTurn)(Go_1.Go.currentGame, color);
    NetscriptHelpers_1.helpers.log(ctx, () => "Go turn passed.");
    if (Go_1.Go.currentGame.previousPlayer === null) {
        logEndGame(ctx);
    }
    return (0, goAI_1.handleNextTurn)(Go_1.Go.currentGame, true);
}
/**
 * Validates and applies the player's router placement
 */
function makePlayerMove(ctx, x, y, playAsWhite = false) {
    const boardState = Go_1.Go.currentGame;
    const color = playAsWhite ? _enums_1.GoColor.white : _enums_1.GoColor.black;
    const validity = (0, boardAnalysis_1.evaluateIfMoveIsValid)(boardState, x, y, color);
    const moveWasMade = (0, boardState_1.makeMove)(boardState, x, y, color);
    if (validity !== _enums_1.GoValidity.valid || !moveWasMade) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, `Invalid move: ${x} ${y}. ${validity}.`);
    }
    NetscriptHelpers_1.helpers.log(ctx, () => `Go move played: ${x}, ${y}${playAsWhite ? " (White)" : ""}`);
    return (0, goAI_1.handleNextTurn)(boardState, true);
}
/**
  Returns the promise that provides the opponent's move, once it finishes thinking.
 */
function getOpponentNextMove(ctx, logOpponentMove = true, playAsWhite = false) {
    const playerColor = playAsWhite ? _enums_1.GoColor.white : _enums_1.GoColor.black;
    const nextTurn = (0, goAI_1.getNextTurn)(playerColor);
    // Only asynchronously log the opponent move if not disabled by the player
    if (logOpponentMove) {
        return nextTurn.then((move) => {
            if (move.type === _enums_1.GoPlayType.gameOver) {
                logEndGame(ctx);
            }
            else if (move.type === _enums_1.GoPlayType.pass) {
                NetscriptHelpers_1.helpers.log(ctx, () => `Opponent passed their turn. You can end the game by passing as well.`);
            }
            else if (move.type === _enums_1.GoPlayType.move) {
                NetscriptHelpers_1.helpers.log(ctx, () => `Opponent played move: ${move.x}, ${move.y}`);
            }
            return move;
        });
    }
    return nextTurn;
}
/**
 * Returns a grid of booleans indicating if the coordinates at that location are a valid move for the player
 */
function getValidMoves(_boardState, playAsWhite = false) {
    const boardState = _boardState || Go_1.Go.currentGame;
    const color = playAsWhite ? _enums_1.GoColor.white : _enums_1.GoColor.black;
    // If the game is over, or if it is not your turn, there are no valid moves
    if (!boardState.previousPlayer || boardState.previousPlayer === color) {
        return boardState.board.map(() => Array(boardState.board.length).fill(false));
    }
    // Map the board matrix into true/false values
    return boardState.board.map((column, x) => column.reduce((validityArray, point, y) => {
        const isValid = (0, boardAnalysis_1.evaluateIfMoveIsValid)(boardState, x, y, color) === _enums_1.GoValidity.valid;
        validityArray.push(isValid);
        return validityArray;
    }, []));
}
/**
 * Returns a grid with an ID for each contiguous chain of same-state nodes (excluding dead/offline nodes)
 */
function getChains(_board) {
    const board = _board || Go_1.Go.currentGame.board;
    const chains = [];
    // Turn the internal chain IDs into nice consecutive numbers for display to the player
    return board.map((column) => column.reduce((chainIdArray, point) => {
        if (!point) {
            chainIdArray.push(null);
            return chainIdArray;
        }
        if (!chains.includes(point.chain)) {
            chains.push(point.chain);
        }
        chainIdArray.push(chains.indexOf(point.chain));
        return chainIdArray;
    }, []));
}
/**
 * Returns a grid of numbers representing the number of open-node connections each player-owned chain has.
 */
function getLiberties(_board) {
    const board = _board || Go_1.Go.currentGame.board;
    return board.map((column) => column.reduce((libertyArray, point) => {
        libertyArray.push(point?.liberties?.length || -1);
        return libertyArray;
    }, []));
}
/**
 * Returns a grid indicating which player, if any, controls the empty nodes by fully encircling it with their routers
 */
function getControlledEmptyNodes(_board) {
    const board = _board || Go_1.Go.currentGame.board;
    const controlled = (0, boardAnalysis_1.getControlledSpace)(board);
    return controlled.map((column, x) => column.reduce((ownedPoints, owner, y) => {
        if (owner === _enums_1.GoColor.white) {
            return ownedPoints + "O";
        }
        if (owner === _enums_1.GoColor.black) {
            return ownedPoints + "X";
        }
        if (!board[x][y]) {
            return ownedPoints + "#";
        }
        if (board[x][y]?.color === _enums_1.GoColor.empty) {
            return ownedPoints + "?";
        }
        return ownedPoints + ".";
    }, ""));
}
/**
 * Resets the active game to be a new board with "No AI" as the opponent. Applies the specified board state and komi to the new game.
 * Used for testing scenarios.
 */
function setTestingBoardState(ctx, board, komi) {
    resetBoardState(ctx, _enums_1.GoOpponent.none, board.length);
    Go_1.Go.currentGame.board = board;
    if (komi != undefined) {
        Go_1.Go.currentGame.komiOverride = komi;
    }
    Go_1.GoEvents.emit();
}
/**
 * Returns all previous board states as SimpleBoards
 */
function getHistory() {
    return Go_1.Go.currentGame.previousBoards.map((boardString) => (0, boardAnalysis_1.simpleBoardFromBoardString)(boardString));
}
/**
 * Gets the status of the current game.
 * Shows the current player, current score, and the previous move coordinates.
 * Previous move will be null for a pass, or if there are no prior moves.
 *
 * Also provides the white player's komi (bonus starting score), and the amount of bonus cycles from offline time remaining
 */
function getGameState() {
    const currentPlayer = getCurrentPlayer();
    const score = (0, scoring_1.getScore)(Go_1.Go.currentGame);
    const previousMove = (0, boardAnalysis_1.getPreviousMove)();
    return {
        currentPlayer,
        whiteScore: score[_enums_1.GoColor.white].sum,
        blackScore: score[_enums_1.GoColor.black].sum,
        previousMove,
        komi: score[_enums_1.GoColor.white].komi,
        bonusCycles: Go_1.Go.storedCycles,
    };
}
function getMoveHistory() {
    return Go_1.Go.currentGame.previousBoards.map((boardString) => (0, boardAnalysis_1.simpleBoardFromBoardString)(boardString));
}
/**
 * Returns 'None' if the game is over, otherwise returns the color of the current player's turn
 */
function getCurrentPlayer() {
    if (Go_1.Go.currentGame.previousPlayer === null) {
        return "None";
    }
    return Go_1.Go.currentGame.previousPlayer === _enums_1.GoColor.black ? _enums_1.GoColor.white : _enums_1.GoColor.black;
}
/**
 * Handle post-game logging
 */
function logEndGame(ctx) {
    const boardState = Go_1.Go.currentGame;
    const score = (0, scoring_1.getScore)(boardState);
    NetscriptHelpers_1.helpers.log(ctx, () => `Subnet complete! Final score: ${boardState.ai}: ${score[_enums_1.GoColor.white].sum},  Player: ${score[_enums_1.GoColor.black].sum}`);
}
/**
 * Clears the board, resets winstreak if applicable
 */
function resetBoardState(ctx, opponent, boardSize) {
    if (![5, 7, 9, 13].includes(boardSize) && opponent !== _enums_1.GoOpponent.w0r1d_d43m0n) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, `Invalid subnet size requested (${boardSize}), size must be 5, 7, 9, or 13`);
    }
    if (opponent === _enums_1.GoOpponent.w0r1d_d43m0n && !_player_1.Player.hasAugmentation(_enums_1.AugmentationName.TheRedPill, true)) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, `Invalid opponent requested (${opponent}), this opponent has not yet been discovered`);
    }
    const oldBoardState = Go_1.Go.currentGame;
    if (oldBoardState.previousPlayer !== null && oldBoardState.previousBoards.length) {
        (0, scoring_1.resetWinstreak)(oldBoardState.ai, false);
    }
    Go_1.Go.currentGame = (0, boardState_1.getNewBoardState)(boardSize, opponent, true);
    (0, goAI_1.resetGoPromises)();
    (0, boardAnalysis_1.clearAllPointHighlights)(Go_1.Go.currentGame);
    NetscriptHelpers_1.helpers.log(ctx, () => `New game started: ${opponent}, ${boardSize}x${boardSize}`);
    return (0, boardAnalysis_1.simpleBoardFromBoard)(Go_1.Go.currentGame.board);
}
/**
 * Retrieve and clean up stats for each opponent played against
 */
function getStats() {
    const statDetails = {};
    for (const opponent of (0, Record_1.getRecordKeys)(Go_1.Go.stats)) {
        const details = (0, scoring_1.getOpponentStats)(opponent);
        const nodePower = (0, scoring_1.getOpponentStats)(opponent).nodePower;
        const effectPercent = ((0, effect_1.CalculateEffect)(nodePower, opponent) - 1) * 100;
        const effectDescription = (0, effect_1.getEffectTypeForFaction)(opponent);
        statDetails[opponent] = {
            wins: details.wins,
            losses: details.losses,
            winStreak: details.winStreak,
            highestWinStreak: details.highestWinStreak,
            rep: details.rep,
            bonusPercent: effectPercent,
            bonusDescription: effectDescription,
        };
    }
    return statDetails;
}
/**
 * Reset all win/loss numbers for the No AI opponent.
 * @param resetAll if true, reset win/loss records for all opponents. This leaves node power and bonuses unchanged.
 */
function resetStats(resetAll = false) {
    if (resetAll) {
        for (const opponent of (0, Record_1.getRecordKeys)(Go_1.Go.stats)) {
            Go_1.Go.stats[opponent] = {
                ...Go_1.Go.stats[opponent],
                wins: 0,
                losses: 0,
                winStreak: 0,
                oldWinStreak: 0,
                highestWinStreak: 0,
            };
        }
    }
    else {
        Go_1.Go.stats[_enums_1.GoOpponent.none] = (0, Constants_1.newOpponentStats)();
    }
}
const boardValidity = {
    valid: "",
    badShape: "Invalid boardState: Board must be a square",
    badType: "Invalid boardState: Board must be an array of strings",
    badSize: "Invalid boardState: Board must be 5, 7, 9, 13, or 19 in size",
    badCharacters: 'Invalid board state: unknown characters found. "X" represents black pieces, "O" white, "." empty points, and "#" offline nodes.',
    failedToCreateBoard: "Invalid board state: Failed to create board",
};
/**
 * Validate the given SimpleBoard and prior board state (if present) and turn it into a full BoardState with updated analytics
 */
function validateBoardState(ctx, _boardState, _priorBoardState, playAsWhite = false) {
    const simpleBoard = getSimpleBoardFromUnknown(ctx, _boardState);
    const priorSimpleBoard = getSimpleBoardFromUnknown(ctx, _priorBoardState);
    if (!_boardState || !simpleBoard) {
        return undefined;
    }
    try {
        return (0, boardState_1.getNewBoardStateFromSimpleBoard)(simpleBoard, priorSimpleBoard, undefined, playAsWhite ? _enums_1.GoColor.black : _enums_1.GoColor.white);
    }
    catch (e) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, boardValidity.failedToCreateBoard);
    }
}
/**
 * Check that the given boardState is a valid SimpleBoard, and return it if it is.
 */
function getSimpleBoardFromUnknown(ctx, _boardState) {
    if (!_boardState) {
        return undefined;
    }
    if (!Array.isArray(_boardState)) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, boardValidity.badType);
    }
    if (_boardState.find((row) => typeof row !== "string")) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, boardValidity.badType);
    }
    const boardState = _boardState;
    if (boardState.find((row) => row.length !== boardState.length)) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, boardValidity.badShape);
    }
    if (![5, 7, 9, 13, 19].includes(boardState.length)) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, boardValidity.badSize);
    }
    if (boardState.find((row) => row.match(/[^XO#.]/))) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, boardValidity.badCharacters);
    }
    return boardState;
}
/** Validate singularity access by throwing an error if the player does not have access. */
function checkCheatApiAccess(ctx) {
    const hasSourceFile = _player_1.Player.activeSourceFileLvl(14) > 1;
    const isBitnodeFourteenTwo = _player_1.Player.activeSourceFileLvl(14) === 1 && _player_1.Player.bitNodeN === 14;
    if (!hasSourceFile && !isBitnodeFourteenTwo) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, `The go.cheat API requires Source-File 14.2 to run, a power up you obtain later in the game.
      It will be very obvious when and how you can obtain it.`);
    }
}
/**
 * Determines if the attempted cheat move is successful. If so, applies the cheat via the callback, and gets the opponent's response.
 *
 * If it fails, determines if the player's turn is skipped, or if the player is ejected from the subnet.
 */
function determineCheatSuccess(ctx, callback, successRngOverride, ejectRngOverride, playAsWhite = false) {
    const state = Go_1.Go.currentGame;
    const rng = new RNG_1.WHRNG(_player_1.Player.totalPlaytime);
    state.passCount = 0;
    const priorCheatCount = playAsWhite ? state.cheatCountForWhite : state.cheatCount;
    const playerColor = playAsWhite ? _enums_1.GoColor.white : _enums_1.GoColor.black;
    // If cheat is successful, run callback
    if ((successRngOverride ?? rng.random()) <= cheatSuccessChance(state.cheatCount, playAsWhite)) {
        callback();
    }
    // If there have been prior cheat attempts, and the cheat fails, there is a 10% chance of instantly ending the game
    else if (priorCheatCount && (ejectRngOverride ?? rng.random()) < 0.1 && state.ai !== _enums_1.GoOpponent.none) {
        NetscriptHelpers_1.helpers.log(ctx, () => `Cheat failed! You have been ejected from the subnet.`);
        (0, scoring_1.forceEndGoGame)(state);
        _player_1.Player.giveAchievement("IPVGO_ANTICHEAT");
        return (0, goAI_1.handleNextTurn)(state, true);
    }
    else {
        // If the cheat fails, your turn is skipped
        NetscriptHelpers_1.helpers.log(ctx, () => `Cheat failed. Your turn has been skipped.`);
        (0, boardState_1.passTurn)(state, playerColor, false);
    }
    if (playAsWhite) {
        state.cheatCountForWhite++;
    }
    else {
        state.cheatCount++;
    }
    Go_1.Go.currentGame.previousPlayer = playerColor;
    (0, boardState_1.updateCaptures)(Go_1.Go.currentGame.board, playerColor, true);
    return (0, goAI_1.handleNextTurn)(state, true);
}
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
function cheatSuccessChance(cheatCountOverride, playAsWhite = false) {
    const cheatCount = cheatCountOverride ?? (playAsWhite ? Go_1.Go.currentGame.cheatCountForWhite : Go_1.Go.currentGame.cheatCount);
    const sourceFileBonus = _player_1.Player.activeSourceFileLvl(14) === 3 ? 0.25 : 0;
    const cheatCountScalar = (0.7 - 0.02 * cheatCount) ** cheatCount;
    return Math.max(Math.min(0.6 * cheatCountScalar * _player_1.Player.mults.crime_success + sourceFileBonus, 1), 0);
}
/**
 * Attempts to remove an existing router from the board. Can fail. If failed, can immediately end the game
 */
function cheatRemoveRouter(ctx, x, y, successRngOverride, ejectRngOverride, playAsWhite = false) {
    const point = Go_1.Go.currentGame.board[x][y];
    if (!point) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, `Cheat failed. The point ${x},${y} is already offline.`);
    }
    return determineCheatSuccess(ctx, () => {
        point.color = _enums_1.GoColor.empty;
        NetscriptHelpers_1.helpers.log(ctx, () => `Cheat successful. The point ${x},${y} was cleared.`);
    }, successRngOverride, ejectRngOverride, playAsWhite);
}
/**
 * Attempts play two moves at once. Can fail. If failed, can immediately end the game
 */
function cheatPlayTwoMoves(ctx, x1, y1, x2, y2, successRngOverride, ejectRngOverride, playAsWhite = false) {
    const point1 = Go_1.Go.currentGame.board[x1][y1];
    const point2 = Go_1.Go.currentGame.board[x2][y2];
    if (!point1 || !point2) {
        throw (0, ErrorMessages_1.errorMessage)(ctx, `Cheat failed. One of the points ${x1},${y1} or ${x2},${y2} is already offline.`);
    }
    const playerColor = playAsWhite ? _enums_1.GoColor.white : _enums_1.GoColor.black;
    return determineCheatSuccess(ctx, () => {
        point1.color = playerColor;
        point2.color = playerColor;
        NetscriptHelpers_1.helpers.log(ctx, () => `Cheat successful. Two go moves played: ${x1},${y1} and ${x2},${y2}`);
    }, successRngOverride, ejectRngOverride, playAsWhite);
}
function cheatRepairOfflineNode(ctx, x, y, successRngOverride, ejectRngOverride, playAsWhite = false) {
    return determineCheatSuccess(ctx, () => {
        Go_1.Go.currentGame.board[x][y] = {
            chain: "",
            liberties: null,
            y,
            color: _enums_1.GoColor.empty,
            x,
        };
        NetscriptHelpers_1.helpers.log(ctx, () => `Cheat successful. The point ${x},${y} was repaired.`);
    }, successRngOverride, ejectRngOverride, playAsWhite);
}
function cheatDestroyNode(ctx, x, y, successRngOverride, ejectRngOverride, playAsWhite = false) {
    return determineCheatSuccess(ctx, () => {
        Go_1.Go.currentGame.board[x][y] = null;
        NetscriptHelpers_1.helpers.log(ctx, () => `Cheat successful. The point ${x},${y} was destroyed.`);
    }, successRngOverride, ejectRngOverride, playAsWhite);
}
