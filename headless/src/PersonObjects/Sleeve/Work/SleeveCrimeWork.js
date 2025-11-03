"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleeveCrimeWork = exports.isSleeveCrimeWork = void 0;
const _player_1 = require("@player");
const JSONReviver_1 = require("../../../utils/JSONReviver");
const Work_1 = require("./Work");
const _enums_1 = require("@enums");
const Crimes_1 = require("../../../Crime/Crimes");
const WorkStats_1 = require("../../../Work/WorkStats");
const Constants_1 = require("../../../Constants");
const Formulas_1 = require("../../../Work/Formulas");
const isSleeveCrimeWork = (w) => w !== null && w.type === Work_1.SleeveWorkType.CRIME;
exports.isSleeveCrimeWork = isSleeveCrimeWork;
class SleeveCrimeWork extends Work_1.SleeveWorkClass {
    constructor(crimeType) {
        super();
        this.type = Work_1.SleeveWorkType.CRIME;
        this.tasksCompleted = 0;
        this.cyclesWorked = 0;
        this.crimeType = crimeType ?? _enums_1.CrimeType.shoplift;
    }
    getCrime() {
        return Crimes_1.Crimes[this.crimeType];
    }
    getExp(sleeve) {
        return (0, WorkStats_1.scaleWorkStats)((0, Formulas_1.calculateCrimeWorkStats)(sleeve, this.getCrime()), sleeve.shockBonus(), false);
    }
    cyclesNeeded() {
        return this.getCrime().time / Constants_1.CONSTANTS.MilliPerCycle;
    }
    process(sleeve, cycles) {
        this.cyclesWorked += cycles;
        if (this.cyclesWorked < this.cyclesNeeded())
            return;
        while (this.cyclesWorked > this.cyclesNeeded()) {
            const crime = this.getCrime();
            const gains = this.getExp(sleeve);
            const success = Math.random() < crime.successRate(sleeve);
            if (success) {
                _player_1.Player.karma -= crime.karma * sleeve.syncBonus();
                _player_1.Player.numPeopleKilled += crime.kills;
            }
            else
                gains.money = 0;
            (0, Work_1.applySleeveGains)(sleeve, gains, success ? 1 : 0.25);
            this.tasksCompleted++;
            this.cyclesWorked -= this.cyclesNeeded();
        }
    }
    APICopy() {
        return {
            type: Work_1.SleeveWorkType.CRIME,
            crimeType: this.crimeType,
            tasksCompleted: this.tasksCompleted,
            cyclesWorked: this.cyclesWorked,
            cyclesNeeded: this.cyclesNeeded(),
        };
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("SleeveCrimeWork", this);
    }
    /** Initializes an object from a JSON save state. */
    static fromJSON(value) {
        const crimeWork = (0, JSONReviver_1.Generic_fromJSON)(SleeveCrimeWork, value.data);
        if (!(crimeWork.crimeType in Crimes_1.Crimes)) {
            crimeWork.crimeType = _enums_1.CrimeType.shoplift;
        }
        return crimeWork;
    }
}
exports.SleeveCrimeWork = SleeveCrimeWork;
JSONReviver_1.constructorsForReviver.SleeveCrimeWork = SleeveCrimeWork;
