"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrimeWork = exports.isCrimeWork = void 0;
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const JSONReviver_1 = require("../utils/JSONReviver");
const Constants_1 = require("../Constants");
const CrimeHelpers_1 = require("../Crime/CrimeHelpers");
const Crimes_1 = require("../Crime/Crimes");
const DialogBox_1 = require("../ui/React/DialogBox");
const Work_1 = require("./Work");
const WorkStats_1 = require("./WorkStats");
const Formulas_1 = require("./Formulas");
const EnumHelper_1 = require("../utils/EnumHelper");
const isCrimeWork = (w) => w !== null && w.type === Work_1.WorkType.CRIME;
exports.isCrimeWork = isCrimeWork;
class CrimeWork extends Work_1.Work {
    constructor(params) {
        super(Work_1.WorkType.CRIME, params?.singularity ?? true);
        this.crimeType = params?.crimeType ?? _enums_1.CrimeType.shoplift;
        this.unitCompleted = 0;
    }
    getCrime() {
        return Crimes_1.Crimes[this.crimeType];
    }
    process(cycles = 1) {
        /**
         * Crime work is processed in a loop. If the number of cycles is too large, the loop blocks the game engine for too
         * long. 12960000 is the number of cycles in 30 days (5 * 3600 * 24 * 30). On a very old machine, the loop takes
         * ~800-1000 ms to process the "shoplift" crime which is the fastest crime (faster crime = more iteration).
         */
        cycles = Math.min(cycles, 12960000);
        this.cyclesWorked += cycles;
        const time = Object.values(Crimes_1.Crimes).find((c) => c.type === this.crimeType)?.time ?? 0;
        this.unitCompleted += Constants_1.CONSTANTS.MilliPerCycle * cycles;
        while (this.unitCompleted >= time) {
            this.commit();
            this.unitCompleted -= time;
        }
        return false;
    }
    earnings() {
        return (0, Formulas_1.calculateCrimeWorkStats)(_player_1.Player, this.getCrime());
    }
    commit() {
        const crime = this.getCrime();
        if (crime == null) {
            (0, DialogBox_1.dialogBoxCreate)(`ERR: Unrecognized crime type (${this.crimeType}). This is probably a bug please contact the developer`);
            return;
        }
        const focusBonus = _player_1.Player.focusPenalty();
        // exp times 2 because were trying to maintain the same numbers as before the conversion
        // Technically the definition of Crimes should have the success numbers and failure should divide by 4
        let gains = (0, WorkStats_1.scaleWorkStats)(this.earnings(), focusBonus, false);
        let karma = crime.karma;
        const success = (0, CrimeHelpers_1.determineCrimeSuccess)(crime.type);
        if (success) {
            _player_1.Player.gainMoney(gains.money, "crime");
            _player_1.Player.numPeopleKilled += crime.kills;
            _player_1.Player.gainIntelligenceExp(gains.intExp);
        }
        else {
            gains = (0, WorkStats_1.scaleWorkStats)(gains, 0.25);
            karma /= 4;
        }
        _player_1.Player.gainHackingExp(gains.hackExp);
        _player_1.Player.gainStrengthExp(gains.strExp);
        _player_1.Player.gainDefenseExp(gains.defExp);
        _player_1.Player.gainDexterityExp(gains.dexExp);
        _player_1.Player.gainAgilityExp(gains.agiExp);
        _player_1.Player.gainCharismaExp(gains.chaExp);
        _player_1.Player.karma -= karma * focusBonus;
    }
    finish() {
        /** nothing to do */
    }
    APICopy() {
        return {
            type: Work_1.WorkType.CRIME,
            cyclesWorked: this.cyclesWorked,
            crimeType: this.crimeType,
        };
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("CrimeWork", this);
    }
    /** Initializes a CrimeWork object from a JSON save state. */
    static fromJSON(value) {
        const crimeWork = (0, JSONReviver_1.Generic_fromJSON)(CrimeWork, value.data);
        crimeWork.crimeType = (0, EnumHelper_1.getEnumHelper)("CrimeType").getMember(crimeWork.crimeType, { alwaysMatch: true });
        return crimeWork;
    }
}
exports.CrimeWork = CrimeWork;
JSONReviver_1.constructorsForReviver.CrimeWork = CrimeWork;
