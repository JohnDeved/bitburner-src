"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleeveFactionWork = exports.isSleeveFactionWork = void 0;
const _player_1 = require("@player");
const JSONReviver_1 = require("../../../utils/JSONReviver");
const Work_1 = require("./Work");
const _enums_1 = require("@enums");
const Factions_1 = require("../../../Faction/Factions");
const Formulas_1 = require("../../../Work/Formulas");
const WorkStats_1 = require("../../../Work/WorkStats");
const EnumHelper_1 = require("../../../utils/EnumHelper");
const isSleeveFactionWork = (w) => w !== null && w.type === Work_1.SleeveWorkType.FACTION;
exports.isSleeveFactionWork = isSleeveFactionWork;
class SleeveFactionWork extends Work_1.SleeveWorkClass {
    constructor(params) {
        super();
        this.type = Work_1.SleeveWorkType.FACTION;
        this.factionWorkType = params?.factionWorkType ?? _enums_1.FactionWorkType.hacking;
        this.factionName = params?.factionName ?? _enums_1.FactionName.Sector12;
    }
    getExpRates(sleeve) {
        return (0, WorkStats_1.scaleWorkStats)((0, Formulas_1.calculateFactionExp)(sleeve, this.factionWorkType), sleeve.shockBonus(), false);
    }
    getReputationRate(sleeve) {
        return (0, Formulas_1.calculateFactionRep)(sleeve, this.factionWorkType, this.getFaction().favor) * sleeve.shockBonus();
    }
    getFaction() {
        const f = Factions_1.Factions[this.factionName];
        if (!f)
            throw new Error(`Faction work started with invalid / unknown faction: '${this.factionName}'`);
        return f;
    }
    process(sleeve, cycles) {
        if (this.factionName === _player_1.Player.gang?.facName)
            return sleeve.stopWork();
        const exp = this.getExpRates(sleeve);
        (0, Work_1.applySleeveGains)(sleeve, exp, cycles);
        const rep = this.getReputationRate(sleeve);
        this.getFaction().playerReputation += rep * cycles;
    }
    APICopy() {
        return {
            type: Work_1.SleeveWorkType.FACTION,
            factionWorkType: this.factionWorkType,
            factionName: this.factionName,
        };
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("SleeveFactionWork", this);
    }
    /** Initializes a FactionWork object from a JSON save state. */
    static fromJSON(value) {
        const factionWork = (0, JSONReviver_1.Generic_fromJSON)(SleeveFactionWork, value.data);
        factionWork.factionWorkType = (0, EnumHelper_1.getEnumHelper)("FactionWorkType").getMember(factionWork.factionWorkType, {
            alwaysMatch: true,
        });
        factionWork.factionName = (0, EnumHelper_1.getEnumHelper)("FactionName").getMember(factionWork.factionName, { alwaysMatch: true });
        return factionWork;
    }
}
exports.SleeveFactionWork = SleeveFactionWork;
JSONReviver_1.constructorsForReviver.SleeveFactionWork = SleeveFactionWork;
