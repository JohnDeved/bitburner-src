"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneySourceTracker = void 0;
const JSONReviver_1 = require("./JSONReviver");
class MoneySourceTracker {
    constructor() {
        this.bladeburner = 0;
        this.casino = 0;
        this.class = 0;
        this.codingcontract = 0;
        this.corporation = 0;
        this.crime = 0;
        this.gang = 0;
        this.gang_expenses = 0;
        this.hacking = 0;
        this.hacknet = 0;
        this.hacknet_expenses = 0;
        this.hospitalization = 0;
        this.infiltration = 0;
        this.sleeves = 0;
        this.stock = 0;
        this.total = 0;
        this.work = 0;
        this.servers = 0;
        this.other = 0;
        this.augmentations = 0;
    }
    // Record money earned
    record(amt, source) {
        this[source] += amt;
        this.total += amt;
    }
    // Reset the money tracker by setting all stats to 0
    reset() {
        for (const prop in this) {
            if (typeof this[prop] === "number") {
                this[prop] = 0;
            }
        }
    }
    // Serialize the current object to a JSON save state.
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("MoneySourceTracker", this);
    }
    // Initializes a MoneySourceTracker object from a JSON save state.
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(MoneySourceTracker, value.data);
    }
}
exports.MoneySourceTracker = MoneySourceTracker;
JSONReviver_1.constructorsForReviver.MoneySourceTracker = MoneySourceTracker;
