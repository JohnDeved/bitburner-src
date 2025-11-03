"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoSave = getGoSave;
exports.loadGo = loadGo;
const Go_1 = require("./Go");
const boardAnalysis_1 = require("./boardAnalysis/boardAnalysis");
const TypeAssertion_1 = require("../utils/TypeAssertion");
const EnumHelper_1 = require("../utils/EnumHelper");
const Constants_1 = require("./Constants");
const types_1 = require("../types");
const goAI_1 = require("./boardAnalysis/goAI");
const effect_1 = require("./effects/effect");
function getGoSave() {
    return {
        previousGame: Go_1.Go.previousGame
            ? {
                ai: Go_1.Go.previousGame.ai,
                board: (0, boardAnalysis_1.simpleBoardFromBoard)(Go_1.Go.previousGame.board),
                previousPlayer: Go_1.Go.previousGame.previousPlayer,
            }
            : null,
        currentGame: {
            ai: Go_1.Go.currentGame.ai,
            board: (0, boardAnalysis_1.simpleBoardFromBoard)(Go_1.Go.currentGame.board),
            previousBoard: Go_1.Go.currentGame.previousBoards[0] ?? "",
            previousPlayer: Go_1.Go.currentGame.previousPlayer,
            cheatCount: Go_1.Go.currentGame.cheatCount,
            cheatCountForWhite: Go_1.Go.currentGame.cheatCount,
            passCount: Go_1.Go.currentGame.passCount,
        },
        stats: Go_1.Go.stats,
        storedCycles: Go_1.Go.storedCycles,
        moveOrCheatViaApi: Go_1.Go.moveOrCheatViaApi,
    };
}
function loadGo(data) {
    /** Function for ending the loading process, showing an error if there is one, and indicating load success/failure */
    function showError(error) {
        console.warn("Encountered the following issue while loading Go savedata:");
        console.error(error);
        console.warn("Savedata:");
        console.error(data);
        return false;
    }
    if (!data)
        return showError("There was no go savedata");
    // Parsing the savedata
    if (typeof data !== "string")
        return showError("Savedata was not a string");
    let parsedData;
    try {
        parsedData = JSON.parse(data);
    }
    catch (e) {
        return showError(`Cannot JSON.parse the savedata: ${data}`);
    }
    if (!parsedData || typeof parsedData !== "object")
        return showError("Parsed savedata was not an object");
    (0, TypeAssertion_1.assertLoadingType)(parsedData);
    // currentGame
    const currentGame = loadCurrentGame(parsedData.currentGame);
    if (typeof currentGame === "string")
        return showError(currentGame);
    // previousGame
    const previousGame = loadPreviousGame(parsedData.previousGame);
    if (typeof previousGame === "string")
        return showError(previousGame);
    // stats
    const stats = loadStats(parsedData.stats);
    if (typeof stats === "string")
        return showError(stats);
    Go_1.Go.currentGame = currentGame;
    Go_1.Go.previousGame = previousGame;
    Go_1.Go.stats = stats;
    Go_1.Go.storeCycles(loadStoredCycles(parsedData.storedCycles));
    if (typeof parsedData.moveOrCheatViaApi === "boolean") {
        Go_1.Go.moveOrCheatViaApi = parsedData.moveOrCheatViaApi;
    }
    (0, goAI_1.resetAI)();
    (0, goAI_1.handleNextTurn)(currentGame).catch((error) => {
        showError(new Error(`Error while initializing first IPvGO move: ${error}`, { cause: error }));
    });
    return true;
}
/** Loading for Go.currentGame
 * @returns The currentGame object if it can be loaded with no issues. IF there is an issue, a string is returned instead describing the issue.  */
function loadCurrentGame(currentGame) {
    if (!currentGame)
        return "Savedata did not contain a currentGame";
    (0, TypeAssertion_1.assertLoadingType)(currentGame);
    const ai = (0, EnumHelper_1.getEnumHelper)("GoOpponent").getMember(currentGame.ai);
    if (!ai)
        return `currentGame had an invalid opponent: ${currentGame.ai}`;
    if (!Array.isArray(currentGame.board))
        return "Non-array encountered while trying to load a board.";
    const requiredSize = currentGame.board.length;
    const board = loadSimpleBoard(currentGame.board, requiredSize);
    if (typeof board === "string")
        return board;
    const previousPlayer = (0, EnumHelper_1.getEnumHelper)("GoColor").getMember(currentGame.previousPlayer) ?? null;
    const normalizedCheatCount = (0, types_1.isInteger)(currentGame.cheatCount) ? Math.max(0, currentGame.cheatCount || 0) : 0;
    const normalizedCheatCountForWhite = (0, types_1.isInteger)(currentGame.cheatCountForWhite)
        ? Math.max(0, currentGame.cheatCountForWhite || 0)
        : 0;
    if (!(0, types_1.isInteger)(currentGame.passCount) || currentGame.passCount < 0)
        return "invalid number for currentGame.passCount";
    const previousBoards = currentGame.previousBoard && typeof currentGame.previousBoard === "string" ? [currentGame.previousBoard] : [];
    const boardState = (0, boardAnalysis_1.boardStateFromSimpleBoard)(board, ai);
    boardState.previousPlayer = previousPlayer;
    boardState.cheatCount = normalizedCheatCount;
    boardState.cheatCountForWhite = normalizedCheatCountForWhite;
    boardState.passCount = currentGame.passCount;
    boardState.previousBoards = previousBoards;
    return boardState;
}
/** Loading for Go.previousGame
 * @returns The previousGame object if it can be loaded with no issues. IF there is an issue, a string is returned instead describing the issue.  */
function loadPreviousGame(previousGame) {
    if (!previousGame)
        return null;
    (0, TypeAssertion_1.assertLoadingType)(previousGame);
    const ai = (0, EnumHelper_1.getEnumHelper)("GoOpponent").getMember(previousGame.ai);
    if (!ai)
        return `currentGame had an invalid opponent: ${previousGame.ai}`;
    if (!Array.isArray(previousGame.board))
        return "Non-array encountered while trying to load a board.";
    const board = loadSimpleBoard(previousGame.board);
    if (typeof board === "string")
        return board;
    const previousPlayer = (0, EnumHelper_1.getEnumHelper)("GoColor").getMember(previousGame.previousPlayer) ?? null;
    const boardState = (0, boardAnalysis_1.boardStateFromSimpleBoard)(board, ai);
    boardState.previousPlayer = previousPlayer;
    return boardState;
}
/** Loading for Go.stats
 * @returns The stats object if it can be loaded with no issues. IF there is an issue, a string is returned instead describing the issue.  */
function loadStats(stats) {
    const finalStats = {};
    if (!stats)
        return "Savedata did not contain a stats object.";
    if (typeof stats !== "object")
        return "Non-object encountered for Go.stats";
    const entries = Object.entries(stats);
    for (const [opponent, opponentStats] of entries) {
        if (!(0, EnumHelper_1.getEnumHelper)("GoOpponent").isMember(opponent))
            return `Invalid opponent in Go.stats: ${opponent}`;
        if (!(0, TypeAssertion_1.isObject)(opponentStats))
            return "Non-object encountered for an opponent's stats";
        const { highestWinStreak, losses, nodes, wins, oldWinStreak, winStreak, nodePower } = opponentStats;
        // Integers >= 0. Todo: make a better helper for this.
        let rep;
        // We stored favor instead of rep in pre-v3.0.0.
        if ("favor" in opponentStats) {
            if (!(0, types_1.isInteger)(opponentStats.favor) || opponentStats.favor < 0) {
                return `A favor entry in Go.stats was invalid. Opponent: ${opponent}. Favor: ${opponentStats.favor}`;
            }
            /**
             * - Pre-v3.0.0: 1 favor each "winning two games in a row".
             * - V3+: 500/1000/1500/2000 rep each "winning two games in a row". "getMaxRep() / 200" is how we calculate
             * repToAdd in src\Go\boardAnalysis\scoring.ts.
             */
            rep = opponentStats.favor * ((0, effect_1.getMaxRep)() / 200);
        }
        else {
            rep = opponentStats.rep;
        }
        if (!(0, types_1.isInteger)(rep) || rep < 0)
            return "A rep entry in Go.stats was invalid";
        if (!(0, types_1.isInteger)(highestWinStreak) || highestWinStreak < 0)
            return "A highestWinStreak entry in Go.stats was invalid";
        if (!(0, types_1.isInteger)(losses) || losses < 0)
            return "A losses entry in Go.stats was invalid";
        if (!(0, types_1.isInteger)(nodes) || nodes < 0)
            return "A nodes entry in Go.stats was invalid";
        if (!(0, types_1.isInteger)(wins) || wins < 0)
            return "A wins entry in Go.stats was invalid";
        // Integers with no clamping
        if (!(0, types_1.isInteger)(oldWinStreak))
            return "An oldWinStreak entry in Go.stats was invalid";
        if (!(0, types_1.isInteger)(winStreak))
            return "An oldWinStreak entry in Go.stats was invalid";
        // Numbers >= 0
        if (!(0, types_1.isNumber)(nodePower) || nodePower < 0)
            return "A nodePower entry in Go.stats was invalid";
        finalStats[opponent] = { rep, highestWinStreak, losses, nodes, wins, oldWinStreak, winStreak, nodePower };
    }
    return finalStats;
}
/** Loading for a SimpleBoard. Also used to load real boards, which are converted from simple boards higher up.
 * @returns The SimpleBoard object if it can be loaded with no issues. If there is an issue, a string is returned instead describing the issue. */
function loadSimpleBoard(simpleBoard, requiredSize) {
    if (!Array.isArray(simpleBoard))
        return "Non-array encountered while trying to load a SimpleBoard.";
    requiredSize ?? (requiredSize = simpleBoard.length);
    if (!Constants_1.boardSizes.includes(requiredSize))
        return `Invalid board size when loading a SimpleBoard: ${requiredSize}`;
    if (simpleBoard.length !== requiredSize)
        return "Incorrect size while trying to load a SimpleBoard";
    if (!simpleBoard.every((column) => typeof column === "string" && column.length === requiredSize)) {
        return "Incorrect types or column size while loading a SimpleBoard.";
    }
    return simpleBoard;
}
function loadStoredCycles(storedCycles) {
    if (!storedCycles || isNaN(+storedCycles)) {
        return 0;
    }
    return +storedCycles;
}
