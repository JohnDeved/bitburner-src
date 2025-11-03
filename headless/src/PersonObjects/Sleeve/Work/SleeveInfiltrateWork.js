"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleeveInfiltrateWork = exports.isSleeveInfiltrateWork = void 0;
const _player_1 = require("@player");
const JSONReviver_1 = require("../../../utils/JSONReviver");
const Work_1 = require("./Work");
const Constants_1 = require("../../../Constants");
const getKeyList_1 = require("../../../utils/helpers/getKeyList");
const infiltrateCycles = 60000 / Constants_1.CONSTANTS.MilliPerCycle;
const isSleeveInfiltrateWork = (w) => w !== null && w.type === Work_1.SleeveWorkType.INFILTRATE;
exports.isSleeveInfiltrateWork = isSleeveInfiltrateWork;
class SleeveInfiltrateWork extends Work_1.SleeveWorkClass {
    constructor() {
        super(...arguments);
        this.type = Work_1.SleeveWorkType.INFILTRATE;
        this.cyclesWorked = 0;
        this.nextCompletionPair = { promise: null, resolve: null };
    }
    cyclesNeeded() {
        return infiltrateCycles;
    }
    process(sleeve, cycles) {
        if (!_player_1.Player.bladeburner)
            return sleeve.stopWork();
        this.cyclesWorked += cycles;
        if (this.cyclesWorked > this.cyclesNeeded()) {
            this.cyclesWorked -= this.cyclesNeeded();
            _player_1.Player.bladeburner.infiltrateSynthoidCommunities();
            this.finish();
        }
    }
    get nextCompletion() {
        if (!this.nextCompletionPair.promise)
            this.nextCompletionPair.promise = new Promise((r) => (this.nextCompletionPair.resolve = r));
        return this.nextCompletionPair.promise;
    }
    finish() {
        if (this.nextCompletionPair.resolve) {
            this.nextCompletionPair.resolve();
            this.nextCompletionPair.resolve = null;
            this.nextCompletionPair.promise = null;
        }
    }
    APICopy() {
        return {
            type: Work_1.SleeveWorkType.INFILTRATE,
            cyclesWorked: this.cyclesWorked,
            cyclesNeeded: this.cyclesNeeded(),
            nextCompletion: this.nextCompletion,
        };
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("SleeveInfiltrateWork", this, SleeveInfiltrateWork.savedKeys);
    }
    /** Initializes a BladeburnerWork object from a JSON save state. */
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(SleeveInfiltrateWork, value.data, SleeveInfiltrateWork.savedKeys);
    }
}
exports.SleeveInfiltrateWork = SleeveInfiltrateWork;
SleeveInfiltrateWork.savedKeys = (0, getKeyList_1.getKeyList)(SleeveInfiltrateWork, { removedKeys: ["nextCompletionPair"] });
JSONReviver_1.constructorsForReviver.SleeveInfiltrateWork = SleeveInfiltrateWork;
