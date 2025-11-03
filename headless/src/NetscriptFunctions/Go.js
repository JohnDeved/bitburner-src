"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetscriptGo = NetscriptGo;
const Go_1 = require("../Go/Go");
const NetscriptHelpers_1 = require("../Netscript/NetscriptHelpers");
const boardAnalysis_1 = require("../Go/boardAnalysis/boardAnalysis");
const netscriptGoImplementation_1 = require("../Go/effects/netscriptGoImplementation");
const EnumHelper_1 = require("../utils/EnumHelper");
const ErrorMessages_1 = require("../Netscript/ErrorMessages");
/**
 * Go API implementation
 */
function NetscriptGo() {
    return {
        makeMove: (ctx) => (_x, _y, _playAsWhite) => {
            const x = NetscriptHelpers_1.helpers.number(ctx, "x", _x);
            const y = NetscriptHelpers_1.helpers.number(ctx, "y", _y);
            const playAsWhite = NetscriptHelpers_1.helpers.boolean(ctx, "playAsWhite", _playAsWhite ?? false);
            (0, netscriptGoImplementation_1.validateMove)(ctx, x, y, "makeMove", { playAsWhite });
            return (0, netscriptGoImplementation_1.makePlayerMove)(ctx, x, y, playAsWhite);
        },
        passTurn: (ctx) => (_playAsWhite) => {
            const playAsWhite = NetscriptHelpers_1.helpers.boolean(ctx, "playAsWhite", _playAsWhite ?? false);
            (0, netscriptGoImplementation_1.validateMove)(ctx, -1, -1, "passTurn", { playAsWhite, pass: true });
            return (0, netscriptGoImplementation_1.handlePassTurn)(ctx, playAsWhite);
        },
        opponentNextTurn: (ctx) => async (_logOpponentMove, _playAsWhite) => {
            const logOpponentMove = NetscriptHelpers_1.helpers.boolean(ctx, "logOpponentMove", _logOpponentMove ?? false);
            const playAsWhite = NetscriptHelpers_1.helpers.boolean(ctx, "playAsWhite", _playAsWhite ?? false);
            return (0, netscriptGoImplementation_1.getOpponentNextMove)(ctx, logOpponentMove, playAsWhite);
        },
        getBoardState: () => () => {
            return (0, boardAnalysis_1.simpleBoardFromBoard)(Go_1.Go.currentGame.board);
        },
        getMoveHistory: () => () => {
            return (0, netscriptGoImplementation_1.getMoveHistory)();
        },
        getCurrentPlayer: () => () => {
            return (0, netscriptGoImplementation_1.getCurrentPlayer)();
        },
        getGameState: () => () => {
            return (0, netscriptGoImplementation_1.getGameState)();
        },
        getOpponent: () => () => {
            return Go_1.Go.currentGame.ai;
        },
        resetBoardState: (ctx) => (_opponent, _boardSize) => {
            const opponent = (0, EnumHelper_1.getEnumHelper)("GoOpponent").nsGetMember(ctx, _opponent);
            const boardSize = NetscriptHelpers_1.helpers.number(ctx, "boardSize", _boardSize);
            return (0, netscriptGoImplementation_1.resetBoardState)(ctx, opponent, boardSize);
        },
        analysis: {
            getValidMoves: (ctx) => (_boardState, _priorBoardState, _playAsWhite) => {
                if (_boardState == true) {
                    return (0, netscriptGoImplementation_1.getValidMoves)(undefined, true);
                }
                const playAsWhite = NetscriptHelpers_1.helpers.boolean(ctx, "playAsWhite", _playAsWhite ?? false);
                const State = (0, netscriptGoImplementation_1.validateBoardState)(ctx, _boardState, _priorBoardState, playAsWhite);
                return (0, netscriptGoImplementation_1.getValidMoves)(State, playAsWhite);
            },
            getChains: (ctx) => (_boardState) => {
                const State = (0, netscriptGoImplementation_1.validateBoardState)(ctx, _boardState);
                return (0, netscriptGoImplementation_1.getChains)(State?.board);
            },
            getLiberties: (ctx) => (_boardState) => {
                const State = (0, netscriptGoImplementation_1.validateBoardState)(ctx, _boardState);
                return (0, netscriptGoImplementation_1.getLiberties)(State?.board);
            },
            getControlledEmptyNodes: (ctx) => (_boardState) => {
                const State = (0, netscriptGoImplementation_1.validateBoardState)(ctx, _boardState);
                return (0, netscriptGoImplementation_1.getControlledEmptyNodes)(State?.board);
            },
            getStats: () => () => {
                return (0, netscriptGoImplementation_1.getStats)();
            },
            resetStats: (ctx) => (_resetAll = false) => {
                const resetAll = NetscriptHelpers_1.helpers.boolean(ctx, "resetAll", _resetAll ?? false);
                (0, netscriptGoImplementation_1.resetStats)(resetAll);
            },
            setTestingBoardState: (ctx) => (_boardState, _komi) => {
                const State = (0, netscriptGoImplementation_1.validateBoardState)(ctx, _boardState);
                if (!State) {
                    throw (0, ErrorMessages_1.errorMessage)(ctx, "Invalid board state passed to setTestingBoardState()");
                }
                const komi = _komi !== undefined ? NetscriptHelpers_1.helpers.number(ctx, "komi", _komi) : undefined;
                return (0, netscriptGoImplementation_1.setTestingBoardState)(ctx, State.board, komi);
            },
            highlightPoint: (ctx) => (_x, _y, _color, _text) => {
                const x = NetscriptHelpers_1.helpers.number(ctx, "x", _x);
                const y = NetscriptHelpers_1.helpers.number(ctx, "y", _y);
                const color = NetscriptHelpers_1.helpers.string(ctx, "color", _color ?? "");
                const text = NetscriptHelpers_1.helpers.string(ctx, "text", _text ?? "");
                (0, boardAnalysis_1.addPointHighlight)(Go_1.Go.currentGame, x, y, color, text);
            },
            clearPointHighlight: (ctx) => (_x, _y) => {
                const x = NetscriptHelpers_1.helpers.number(ctx, "x", _x);
                const y = NetscriptHelpers_1.helpers.number(ctx, "y", _y);
                (0, boardAnalysis_1.clearPointHighlight)(Go_1.Go.currentGame, x, y);
            },
            clearAllPointHighlights: () => () => (0, boardAnalysis_1.clearAllPointHighlights)(Go_1.Go.currentGame),
        },
        cheat: {
            getCheatSuccessChance: (ctx) => (_cheatCount, _playAsWhite) => {
                (0, netscriptGoImplementation_1.checkCheatApiAccess)(ctx);
                const playAsWhite = NetscriptHelpers_1.helpers.boolean(ctx, "playAsWhite", _playAsWhite ?? false);
                const normalizedCheatCount = _cheatCount ?? (playAsWhite ? Go_1.Go.currentGame.cheatCountForWhite : Go_1.Go.currentGame.cheatCount);
                const cheatCount = NetscriptHelpers_1.helpers.number(ctx, "cheatCount", normalizedCheatCount);
                return (0, netscriptGoImplementation_1.cheatSuccessChance)(cheatCount, playAsWhite);
            },
            getCheatCount: (ctx) => (_playAsWhite) => {
                (0, netscriptGoImplementation_1.checkCheatApiAccess)(ctx);
                const playAsWhite = NetscriptHelpers_1.helpers.boolean(ctx, "playAsWhite", _playAsWhite ?? false);
                return playAsWhite ? Go_1.Go.currentGame.cheatCountForWhite : Go_1.Go.currentGame.cheatCount;
            },
            removeRouter: (ctx) => (_x, _y, _playAsWhite) => {
                (0, netscriptGoImplementation_1.checkCheatApiAccess)(ctx);
                const x = NetscriptHelpers_1.helpers.number(ctx, "x", _x);
                const y = NetscriptHelpers_1.helpers.number(ctx, "y", _y);
                const playAsWhite = NetscriptHelpers_1.helpers.boolean(ctx, "playAsWhite", _playAsWhite ?? false);
                (0, netscriptGoImplementation_1.validateMove)(ctx, x, y, "removeRouter", {
                    emptyNode: false,
                    requireNonEmptyNode: true,
                    repeat: false,
                    suicide: false,
                    playAsWhite: playAsWhite,
                });
                return (0, netscriptGoImplementation_1.cheatRemoveRouter)(ctx, x, y, undefined, undefined, playAsWhite);
            },
            playTwoMoves: (ctx) => (_x1, _y1, _x2, _y2, _playAsWhite) => {
                (0, netscriptGoImplementation_1.checkCheatApiAccess)(ctx);
                const x1 = NetscriptHelpers_1.helpers.number(ctx, "x", _x1);
                const y1 = NetscriptHelpers_1.helpers.number(ctx, "y", _y1);
                const playAsWhite = NetscriptHelpers_1.helpers.boolean(ctx, "playAsWhite", _playAsWhite ?? false);
                (0, netscriptGoImplementation_1.validateMove)(ctx, x1, y1, "playTwoMoves", {
                    repeat: false,
                    suicide: false,
                    playAsWhite,
                });
                const x2 = NetscriptHelpers_1.helpers.number(ctx, "x", _x2);
                const y2 = NetscriptHelpers_1.helpers.number(ctx, "y", _y2);
                (0, netscriptGoImplementation_1.validateMove)(ctx, x2, y2, "playTwoMoves", {
                    repeat: false,
                    suicide: false,
                    playAsWhite,
                });
                return (0, netscriptGoImplementation_1.cheatPlayTwoMoves)(ctx, x1, y1, x2, y2, undefined, undefined, playAsWhite);
            },
            repairOfflineNode: (ctx) => (_x, _y, _playAsWhite) => {
                (0, netscriptGoImplementation_1.checkCheatApiAccess)(ctx);
                const x = NetscriptHelpers_1.helpers.number(ctx, "x", _x);
                const y = NetscriptHelpers_1.helpers.number(ctx, "y", _y);
                const playAsWhite = NetscriptHelpers_1.helpers.boolean(ctx, "playAsWhite", _playAsWhite ?? false);
                (0, netscriptGoImplementation_1.validateMove)(ctx, x, y, "repairOfflineNode", {
                    emptyNode: false,
                    repeat: false,
                    onlineNode: false,
                    requireOfflineNode: true,
                    suicide: false,
                    playAsWhite,
                });
                return (0, netscriptGoImplementation_1.cheatRepairOfflineNode)(ctx, x, y, undefined, undefined, playAsWhite);
            },
            destroyNode: (ctx) => (_x, _y, _playAsWhite) => {
                (0, netscriptGoImplementation_1.checkCheatApiAccess)(ctx);
                const x = NetscriptHelpers_1.helpers.number(ctx, "x", _x);
                const y = NetscriptHelpers_1.helpers.number(ctx, "y", _y);
                const playAsWhite = NetscriptHelpers_1.helpers.boolean(ctx, "playAsWhite", _playAsWhite ?? false);
                (0, netscriptGoImplementation_1.validateMove)(ctx, x, y, "destroyNode", {
                    repeat: false,
                    onlineNode: true,
                    suicide: false,
                    playAsWhite,
                });
                return (0, netscriptGoImplementation_1.cheatDestroyNode)(ctx, x, y, undefined, undefined, playAsWhite);
            },
        },
    };
}
