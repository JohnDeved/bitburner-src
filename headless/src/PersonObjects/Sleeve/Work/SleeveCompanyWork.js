"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleeveCompanyWork = exports.isSleeveCompanyWork = void 0;
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const JSONReviver_1 = require("../../../utils/JSONReviver");
const Work_1 = require("./Work");
const Companies_1 = require("../../../Company/Companies");
const Formulas_1 = require("../../../Work/Formulas");
const WorkStats_1 = require("../../../Work/WorkStats");
const PlayerInfluencing_1 = require("../../../StockMarket/PlayerInfluencing");
const CompanyPositions_1 = require("../../../Company/CompanyPositions");
const EnumHelper_1 = require("../../../utils/EnumHelper");
const InvalidWork_1 = require("../../../Work/InvalidWork");
const isSleeveCompanyWork = (w) => w !== null && w.type === Work_1.SleeveWorkType.COMPANY;
exports.isSleeveCompanyWork = isSleeveCompanyWork;
class SleeveCompanyWork extends Work_1.SleeveWorkClass {
    constructor(companyName = _enums_1.CompanyName.NoodleBar) {
        super();
        this.type = Work_1.SleeveWorkType.COMPANY;
        this.companyName = companyName;
    }
    getCompany() {
        return Companies_1.Companies[this.companyName];
    }
    getGainRates(sleeve, job) {
        const company = this.getCompany();
        return (0, WorkStats_1.scaleWorkStats)((0, Formulas_1.calculateCompanyWorkStats)(sleeve, company, CompanyPositions_1.CompanyPositions[job], company.favor), sleeve.shockBonus(), false);
    }
    process(sleeve, cycles) {
        const company = this.getCompany();
        const job = _player_1.Player.jobs[this.companyName];
        if (!job)
            return sleeve.stopWork();
        const gains = this.getGainRates(sleeve, job);
        (0, Work_1.applySleeveGains)(sleeve, gains, cycles);
        company.playerReputation += gains.reputation * cycles;
        (0, PlayerInfluencing_1.influenceStockThroughCompanyWork)(company, gains.reputation, cycles);
    }
    APICopy() {
        return {
            type: Work_1.SleeveWorkType.COMPANY,
            companyName: this.companyName,
        };
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("SleeveCompanyWork", this);
    }
    /** Initializes a CompanyWork object from a JSON save state. */
    static fromJSON(value) {
        const work = (0, JSONReviver_1.Generic_fromJSON)(SleeveCompanyWork, value.data);
        if (!(0, EnumHelper_1.isMember)("CompanyName", work.companyName))
            return (0, InvalidWork_1.invalidWork)();
        return work;
    }
}
exports.SleeveCompanyWork = SleeveCompanyWork;
JSONReviver_1.constructorsForReviver.SleeveCompanyWork = SleeveCompanyWork;
