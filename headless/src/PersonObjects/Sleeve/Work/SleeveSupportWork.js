"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleeveSupportWork = exports.isSleeveSupportWork = void 0;
const _player_1 = require("@player");
const JSONReviver_1 = require("../../../utils/JSONReviver");
const Work_1 = require("./Work");
const isSleeveSupportWork = (w) => w !== null && w.type === Work_1.SleeveWorkType.SUPPORT;
exports.isSleeveSupportWork = isSleeveSupportWork;
class SleeveSupportWork extends Work_1.SleeveWorkClass {
    constructor() {
        super();
        this.type = Work_1.SleeveWorkType.SUPPORT;
        _player_1.Player.bladeburner?.sleeveSupport(true);
    }
    process() { }
    finish() {
        _player_1.Player.bladeburner?.sleeveSupport(false);
    }
    APICopy() {
        return { type: Work_1.SleeveWorkType.SUPPORT };
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("SleeveSupportWork", this);
    }
    /** Initializes a BladeburnerWork object from a JSON save state. */
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(SleeveSupportWork, value.data);
    }
}
exports.SleeveSupportWork = SleeveSupportWork;
JSONReviver_1.constructorsForReviver.SleeveSupportWork = SleeveSupportWork;
