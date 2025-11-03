"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleeveSynchroWork = exports.isSleeveSynchroWork = void 0;
const _player_1 = require("@player");
const JSONReviver_1 = require("../../../utils/JSONReviver");
const Work_1 = require("./Work");
const intelligence_1 = require("../../formulas/intelligence");
const isSleeveSynchroWork = (w) => w !== null && w.type === Work_1.SleeveWorkType.SYNCHRO;
exports.isSleeveSynchroWork = isSleeveSynchroWork;
class SleeveSynchroWork extends Work_1.SleeveWorkClass {
    constructor() {
        super(...arguments);
        this.type = Work_1.SleeveWorkType.SYNCHRO;
    }
    process(sleeve, cycles) {
        sleeve.sync = Math.min(100, sleeve.sync + (0, intelligence_1.calculateIntelligenceBonus)(_player_1.Player.skills.intelligence, 0.5) * 0.0002 * cycles);
        if (sleeve.sync >= 100)
            sleeve.stopWork();
    }
    APICopy() {
        return { type: Work_1.SleeveWorkType.SYNCHRO };
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("SleeveSynchroWork", this);
    }
    /** Initializes a SynchroWork object from a JSON save state. */
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(SleeveSynchroWork, value.data);
    }
}
exports.SleeveSynchroWork = SleeveSynchroWork;
JSONReviver_1.constructorsForReviver.SleeveSynchroWork = SleeveSynchroWork;
