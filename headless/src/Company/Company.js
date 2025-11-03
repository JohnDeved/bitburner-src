"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Company_favor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
const _enums_1 = require("@enums");
const favor_1 = require("../Faction/formulas/favor");
const clampNumber_1 = require("../utils/helpers/clampNumber");
class Company {
    constructor(p) {
        // Static info, initialized once at game load.
        this.name = _enums_1.CompanyName.NoodleBar;
        this.info = "";
        this.companyPositions = new Set();
        /** Company-specific multiplier for earnings */
        this.expMultiplier = 1;
        this.salaryMultiplier = 1;
        /**
         * The additional levels of stats you need to quality for a job
         * in this company.
         *
         * For example, the base stat requirement for an intern position is 1.
         * But if a company has a offset of 200, then you would need stat(s) of 201
         */
        this.jobStatReqOffset = 0;
        // Dynamic info, loaded from save and updated during game.
        this.playerReputation = 0;
        _Company_favor.set(this, 0);
        this.name = p.name;
        if (p.info)
            this.info = p.info;
        p.companyPositions.forEach((jobName) => this.companyPositions.add(jobName));
        this.expMultiplier = p.expMultiplier;
        this.salaryMultiplier = p.salaryMultiplier;
        this.jobStatReqOffset = p.jobStatReqOffset;
        if (p.relatedFaction)
            this.relatedFaction = p.relatedFaction;
    }
    get favor() {
        return __classPrivateFieldGet(this, _Company_favor, "f");
    }
    /**
     * There is no setter for this.#favor. This is intentional. Performing arithmetic operations on `favor` may lead to
     * the overflow error of `playerReputation`, so anything that wants to change `favor` must explicitly do that through
     * `setFavor`.
     *
     * @param value
     */
    setFavor(value) {
        if (Number.isNaN(value)) {
            __classPrivateFieldSet(this, _Company_favor, 0, "f");
            return;
        }
        __classPrivateFieldSet(this, _Company_favor, (0, clampNumber_1.clampNumber)(value, 0, favor_1.MaxFavor), "f");
    }
    hasPosition(pos) {
        return this.companyPositions.has(typeof pos === "string" ? pos : pos.name);
    }
    prestigeAugmentation() {
        this.setFavor((0, favor_1.addRepToFavor)(this.favor, this.playerReputation));
        this.playerReputation = 0;
    }
    prestigeSourceFile() {
        this.setFavor(0);
        this.playerReputation = 0;
    }
}
exports.Company = Company;
_Company_favor = new WeakMap();
