"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.City = void 0;
const _enums_1 = require("@enums");
const Constants_1 = require("./data/Constants");
const getRandomIntInclusive_1 = require("../utils/helpers/getRandomIntInclusive");
const JSONReviver_1 = require("../utils/JSONReviver");
const addOffset_1 = require("../utils/helpers/addOffset");
const clampNumber_1 = require("../utils/helpers/clampNumber");
class City {
    constructor(name = _enums_1.CityName.Sector12) {
        this.pop = 0; // Population
        this.popEst = 0; // Population estimate
        this.comms = 0; // Number of communities
        this.chaos = 0;
        this.name = name;
        // Synthoid population and estimate
        this.pop = (0, getRandomIntInclusive_1.getRandomIntInclusive)(Constants_1.BladeburnerConstants.PopulationThreshold, 1.5 * Constants_1.BladeburnerConstants.PopulationThreshold);
        this.popEst = this.pop * (Math.random() + 0.5);
        // Number of Synthoid communities population and estimate
        this.comms = (0, getRandomIntInclusive_1.getRandomIntInclusive)(5, 150);
        this.chaos = 0;
    }
    /** @param {number} p - the percentage change, not the multiplier. e.g. pass in p = 5 for 5% */
    changeChaosByPercentage(p) {
        this.chaos = (0, clampNumber_1.clampNumber)(this.chaos * (1 + p / 100), 0);
    }
    improvePopulationEstimateByCount(n) {
        n = (0, clampNumber_1.clampInteger)(n, 0);
        const diff = Math.abs(this.popEst - this.pop);
        // Change would overshoot actual population -> make estimate accurate
        if (diff <= n)
            this.popEst = this.pop;
        // Otherwise make estimate closer by n
        else if (this.popEst < this.pop)
            this.popEst += n;
        else
            this.popEst -= n;
    }
    /** @param {number} p - the percentage change, not the multiplier. e.g. pass in p = 5 for 5% */
    improvePopulationEstimateByPercentage(p, skillMult = 1) {
        const percentage = (0, clampNumber_1.clampNumber)(p * skillMult);
        const m = percentage / 100;
        if (this.popEst < this.pop) {
            // We use an additive factor so we don't get "stuck" at 0.
            const popGrown = (this.popEst + percentage) * (1 + m);
            this.popEst = (0, clampNumber_1.clampNumber)(popGrown, 0, this.pop);
        }
        else {
            // We use an subtractive factor so we can reach 0 in finite steps.
            const popShrunk = (this.popEst - percentage) / (1 + m);
            this.popEst = (0, clampNumber_1.clampNumber)(popShrunk, this.pop);
        }
    }
    /**
     * @param params.estChange - Number to change the estimate by
     * @param params.estOffset - Offset percentage to apply to estimate */
    changePopulationByCount(n, params = { estChange: 0, estOffset: 0 }) {
        n = (0, clampNumber_1.clampInteger)(n);
        this.pop = (0, clampNumber_1.clampInteger)(this.pop + n, 0);
        if (params.estChange && !isNaN(params.estChange)) {
            this.popEst += params.estChange;
        }
        if (params.estOffset) {
            this.popEst = (0, addOffset_1.addOffset)(this.popEst, params.estOffset);
        }
        this.popEst = (0, clampNumber_1.clampInteger)(this.popEst, 0);
    }
    /**
     * @param {number} p - the percentage change, not the multiplier. e.g. pass in p = 5 for 5%
     * @param {boolean} params.changeEstEqually - Whether to change the population estimate by an equal amount
     * @param {boolean} params.nonZero - Whether to ensure that population always changes by at least 1 */
    changePopulationByPercentage(p, params = { nonZero: false, changeEstEqually: false }) {
        let change = (0, clampNumber_1.clampInteger)(this.pop * (p / 100));
        if (params.nonZero && change === 0)
            change = p > 0 ? 1 : -1;
        this.pop = (0, clampNumber_1.clampInteger)(this.pop + change, 0);
        if (params.changeEstEqually)
            this.popEst = (0, clampNumber_1.clampInteger)(this.popEst + change, 0);
        return change;
    }
    changeChaosByCount(n) {
        this.chaos = (0, clampNumber_1.clampNumber)(this.chaos + n, 0);
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("City", this);
    }
    /** Initializes a City object from a JSON save state. */
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(City, value.data);
    }
}
exports.City = City;
JSONReviver_1.constructorsForReviver.City = City;
