"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleeveClassWork = exports.isSleeveClassWork = void 0;
const _enums_1 = require("@enums");
const JSONReviver_1 = require("../../../utils/JSONReviver");
const Work_1 = require("./Work");
const ClassWork_1 = require("../../../Work/ClassWork");
const Formulas_1 = require("../../../Work/Formulas");
const WorkStats_1 = require("../../../Work/WorkStats");
const Locations_1 = require("../../../Locations/Locations");
const EnumHelper_1 = require("../../../utils/EnumHelper");
const TypeAssertion_1 = require("../../../utils/TypeAssertion");
const isSleeveClassWork = (w) => w !== null && w.type === Work_1.SleeveWorkType.CLASS;
exports.isSleeveClassWork = isSleeveClassWork;
class SleeveClassWork extends Work_1.SleeveWorkClass {
    constructor(params) {
        super();
        this.type = Work_1.SleeveWorkType.CLASS;
        this.classType = params?.classType ?? _enums_1.UniversityClassType.computerScience;
        this.location = params?.location ?? _enums_1.LocationName.Sector12RothmanUniversity;
    }
    calculateRates(sleeve) {
        return (0, WorkStats_1.scaleWorkStats)((0, Formulas_1.calculateClassEarnings)(sleeve, this.classType, this.location), sleeve.shockBonus(), false);
    }
    isGym() {
        return (0, EnumHelper_1.isMember)("GymType", this.classType);
    }
    process(sleeve, cycles) {
        const rate = this.calculateRates(sleeve);
        (0, Work_1.applySleeveGains)(sleeve, rate, cycles);
    }
    APICopy() {
        return {
            type: Work_1.SleeveWorkType.CLASS,
            classType: this.classType,
            location: this.location,
        };
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("SleeveClassWork", this);
    }
    /** Initializes a ClassWork object from a JSON save state. */
    static fromJSON(value) {
        (0, TypeAssertion_1.assertObject)(value.data);
        if (typeof value.data.classType !== "string" || !(value.data.classType in ClassWork_1.Classes)) {
            value.data.classType = "Computer Science";
        }
        if (typeof value.data.location !== "string" || !(value.data.location in Locations_1.Locations)) {
            value.data.location = _enums_1.LocationName.Sector12RothmanUniversity;
        }
        return (0, JSONReviver_1.Generic_fromJSON)(SleeveClassWork, value.data);
    }
}
exports.SleeveClassWork = SleeveClassWork;
JSONReviver_1.constructorsForReviver.SleeveClassWork = SleeveClassWork;
