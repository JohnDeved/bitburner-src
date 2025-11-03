"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScore = getScore;
exports.endGoGame = endGoGame;
exports.forceEndGoGame = forceEndGoGame;
exports.resetWinstreak = resetWinstreak;
exports.logBoard = logBoard;
exports.getOpponentStats = getOpponentStats;
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const Constants_1 = require("../Constants");
const boardAnalysis_1 = require("./boardAnalysis");
const goAI_1 = require("./goAI");
const effect_1 = require("../effects/effect");
const boardState_1 = require("../boardState/boardState");
const Factions_1 = require("../../Faction/Factions");
const EnumHelper_1 = require("../../utils/EnumHelper");
const Go_1 = require("../Go");
const favor_1 = require("../../Faction/formulas/favor");
/**
 * Returns the score of the current board.
 * Each player gets one point for each piece on the board, and one point for any empty node
 *  fully surrounded by their pieces
 */
function getScore(boardState) {
    const komi = (0, goAI_1.getKomi)(boardState) ?? 6.5;
    const whitePieces = getColoredPieceCount(boardState, _enums_1.GoColor.white);
    const blackPieces = getColoredPieceCount(boardState, _enums_1.GoColor.black);
    const territoryScores = getTerritoryScores(boardState.board);
    return {
        [_enums_1.GoColor.white]: {
            pieces: whitePieces,
            territory: territoryScores[_enums_1.GoColor.white],
            komi: komi,
            sum: whitePieces + territoryScores[_enums_1.GoColor.white] + komi,
        },
        [_enums_1.GoColor.black]: {
            pieces: blackPieces,
            territory: territoryScores[_enums_1.GoColor.black],
            komi: 0,
            sum: blackPieces + territoryScores[_enums_1.GoColor.black],
        },
    };
}
/**
 * Handles ending the game. Sets the previous player to null to prevent further moves, calculates score, and updates
 * player node count and power, and game history
 */
function endGoGame(boardState) {
    if (boardState.previousPlayer === null) {
        return;
    }
    boardState.previousPlayer = null;
    const statusToUpdate = getOpponentStats(boardState.ai);
    statusToUpdate.rep = statusToUpdate.rep ?? 0;
    const score = getScore(boardState);
    if (score[_enums_1.GoColor.black].sum < score[_enums_1.GoColor.white].sum) {
        resetWinstreak(boardState.ai, true);
    }
    else {
        statusToUpdate.wins++;
        statusToUpdate.oldWinStreak = statusToUpdate.winStreak;
        statusToUpdate.winStreak = statusToUpdate.oldWinStreak < 0 ? 1 : statusToUpdate.winStreak + 1;
        if (statusToUpdate.winStreak > statusToUpdate.highestWinStreak) {
            statusToUpdate.highestWinStreak = statusToUpdate.winStreak;
        }
        const factionName = (0, EnumHelper_1.getEnumHelper)("FactionName").getMember(boardState.ai);
        if (factionName &&
            statusToUpdate.winStreak % 2 === 0 &&
            _player_1.Player.factions.includes(factionName) &&
            statusToUpdate.rep < (0, effect_1.getMaxRep)()) {
            const currentFavor = Factions_1.Factions[factionName].favor;
            const repToAdd = (0, effect_1.getMaxRep)() / 200;
            const newFavor = (0, favor_1.addRepToFavor)(currentFavor, repToAdd);
            Factions_1.Factions[factionName].setFavor(newFavor);
            statusToUpdate.rep += repToAdd;
        }
        if (factionName === _enums_1.FactionName.Illuminati && statusToUpdate.winStreak >= 10) {
            _player_1.Player.giveAchievement("IPVGO_WINNING_STREAK");
        }
    }
    statusToUpdate.nodePower +=
        score[_enums_1.GoColor.black].sum *
            (0, effect_1.getDifficultyMultiplier)(score[_enums_1.GoColor.white].komi, boardState.board[0].length) *
            (0, effect_1.getWinstreakMultiplier)(statusToUpdate.winStreak, statusToUpdate.oldWinStreak);
    statusToUpdate.nodes += score[_enums_1.GoColor.black].sum;
    Go_1.Go.currentGame = boardState;
    Go_1.Go.previousGame = boardState;
    (0, goAI_1.resetAI)(true);
    Go_1.GoEvents.emit();
    // Update multipliers with new bonuses, once at the end of the game
    _player_1.Player.applyEntropy(_player_1.Player.entropy);
}
/**
 * Forcefully ends the game, resetting the winstreak (if any) and ending the game without applying node power bonuses.
 * Used for critically failing a cheat attempt.
 * @param boardState - the boardstate to reset
 */
function forceEndGoGame(boardState) {
    resetWinstreak(boardState.ai, false);
    boardState.previousPlayer = null;
    Go_1.Go.currentGame = boardState;
    Go_1.Go.previousGame = boardState;
    (0, goAI_1.resetAI)(true);
    Go_1.GoEvents.emit();
}
/**
 * Sets the winstreak to zero for the given opponent, and adds a loss
 */
function resetWinstreak(opponent, gameComplete) {
    const statusToUpdate = getOpponentStats(opponent);
    statusToUpdate.losses++;
    statusToUpdate.oldWinStreak = statusToUpdate.winStreak;
    if (statusToUpdate.winStreak >= 0) {
        statusToUpdate.winStreak = -1;
    }
    else if (gameComplete) {
        // Only increase the "dry streak" count if the game actually finished
        statusToUpdate.winStreak--;
    }
}
/**
 * Gets the number pieces of a given color on the board
 */
function getColoredPieceCount(boardState, color) {
    return boardState.board.reduce((sum, row) => sum + row.filter(boardState_1.isNotNullish).filter((point) => point.color === color).length, 0);
}
/**
 * Finds all empty spaces fully surrounded by a single player's stones
 */
function getTerritoryScores(board) {
    const emptyTerritoryChains = (0, boardAnalysis_1.getAllChains)(board).filter((chain) => chain?.[0]?.color === _enums_1.GoColor.empty && chain.length <= board.length * 2);
    return emptyTerritoryChains.reduce((scores, currentChain) => {
        const chainColor = checkTerritoryOwnership(board, currentChain);
        return {
            [_enums_1.GoColor.white]: scores[_enums_1.GoColor.white] + (chainColor === _enums_1.GoColor.white ? currentChain.length : 0),
            [_enums_1.GoColor.black]: scores[_enums_1.GoColor.black] + (chainColor === _enums_1.GoColor.black ? currentChain.length : 0),
        };
    }, {
        [_enums_1.GoColor.white]: 0,
        [_enums_1.GoColor.black]: 0,
    });
}
/**
 * Finds all neighbors of the empty points in question. If they are all one color, that player controls that space
 */
function checkTerritoryOwnership(board, emptyPointChain) {
    if (emptyPointChain.length > board[0].length ** 2 - 3) {
        return null;
    }
    const playerNeighbors = (0, boardAnalysis_1.getPlayerNeighbors)(board, emptyPointChain);
    const hasWhitePieceNeighbors = playerNeighbors.find((p) => p.color === _enums_1.GoColor.white);
    const hasBlackPieceNeighbors = playerNeighbors.find((p) => p.color === _enums_1.GoColor.black);
    const isWhiteTerritory = hasWhitePieceNeighbors && !hasBlackPieceNeighbors;
    const isBlackTerritory = hasBlackPieceNeighbors && !hasWhitePieceNeighbors;
    return isWhiteTerritory ? _enums_1.GoColor.white : isBlackTerritory ? _enums_1.GoColor.black : null;
}
/**
 * prints the board state to the console
 */
function logBoard(boardState) {
    const state = boardState.board;
    console.log("--------------");
    for (let x = 0; x < state.length; x++) {
        let output = `${x}: `;
        for (let y = 0; y < state[x].length; y++) {
            const point = state[x][y];
            output += ` ${point?.chain ?? ""}`;
        }
        console.log(output);
    }
}
function getOpponentStats(opponent) {
    return Go_1.Go.stats[opponent] ?? (Go_1.Go.stats[opponent] = (0, Constants_1.newOpponentStats)());
}
