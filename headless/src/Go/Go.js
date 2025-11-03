"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoEvents = exports.Go = exports.GoObject = exports.getEmptyHighlightedPoints = void 0;
const Record_1 = require("../Types/Record");
const goAI_1 = require("./boardAnalysis/goAI");
const boardState_1 = require("./boardState/boardState");
const EventEmitter_1 = require("../utils/EventEmitter");
const getEmptyHighlightedPoints = (size = 7) => {
    return Array.from({ length: size }, () => Array.from({ length: size }, () => null));
};
exports.getEmptyHighlightedPoints = getEmptyHighlightedPoints;
class GoObject {
    constructor() {
        // Todo: Make previous game a slimmer interface
        this.previousGame = null;
        this.currentGame = (0, boardState_1.getNewBoardState)(7);
        this.stats = {};
        this.storedCycles = 0;
        // This flag is used when checking the achievement CHALLENGE_BN14.
        this.moveOrCheatViaApi = false;
    }
    prestigeAugmentation() {
        for (const opponent of (0, Record_1.getRecordKeys)(exports.Go.stats)) {
            const stats = exports.Go.stats[opponent];
            if (!stats) {
                continue;
            }
            stats.wins = 0;
            stats.losses = 0;
            stats.nodes = 0;
            stats.nodePower = 0;
            stats.winStreak = 0;
            stats.oldWinStreak = 0;
            stats.highestWinStreak = 0;
        }
    }
    prestigeSourceFile() {
        this.previousGame = null;
        this.currentGame = (0, boardState_1.getNewBoardState)(7);
        this.stats = {};
        this.moveOrCheatViaApi = false;
        (0, goAI_1.resetGoPromises)();
    }
    /**
     * Stores offline time that is consumed to speed up the AI.
     * Only stores offline time if the player has actually been using the mechanic.
     */
    storeCycles(offlineCycles) {
        if (this.previousGame) {
            this.storedCycles += offlineCycles ?? 0;
        }
    }
}
exports.GoObject = GoObject;
exports.Go = new GoObject();
/** Event emitter to allow the UI to subscribe to Go gameplay updates in order to trigger rerenders properly */
exports.GoEvents = new EventEmitter_1.EventEmitter();
