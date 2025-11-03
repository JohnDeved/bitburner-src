"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleeveRecoveryWork = exports.isSleeveRecoveryWork = void 0;
const JSONReviver_1 = require("../../../utils/JSONReviver");
const Work_1 = require("./Work");
const intelligence_1 = require("../../formulas/intelligence");
const isSleeveRecoveryWork = (w) => w !== null && w.type === Work_1.SleeveWorkType.RECOVERY;
exports.isSleeveRecoveryWork = isSleeveRecoveryWork;
class SleeveRecoveryWork extends Work_1.SleeveWorkClass {
    constructor() {
        super(...arguments);
        this.type = Work_1.SleeveWorkType.RECOVERY;
    }
    process(sleeve, cycles) {
        sleeve.shock = Math.max(0, sleeve.shock - 0.0002 * (0, intelligence_1.calculateIntelligenceBonus)(sleeve.skills.intelligence, 0.75) * cycles);
        if (sleeve.shock <= 0)
            sleeve.stopWork();
    }
    APICopy() {
        return { type: Work_1.SleeveWorkType.RECOVERY };
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("SleeveRecoveryWork", this);
    }
    /** Initializes a RecoveryWork object from a JSON save state. */
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(SleeveRecoveryWork, value.data);
    }
}
exports.SleeveRecoveryWork = SleeveRecoveryWork;
JSONReviver_1.constructorsForReviver.SleeveRecoveryWork = SleeveRecoveryWork;
