"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashUpgrade = void 0;
class HashUpgrade {
    constructor(p) {
        /**
         * Base cost for this upgrade. Every time the upgrade is purchased,
         * its cost increases by this same amount (so its 1x, 2x, 3x, 4x, etc.)
         */
        this.costPerLevel = 0;
        /** Description of what the upgrade does */
        this.desc = "";
        /**
         * Boolean indicating that this upgrade's effect affects a single server,
         * the "target" server
         */
        this.hasTargetServer = false;
        /**
         * Boolean indicating that this upgrade's effect affects a single company,
         * the "target" company
         */
        this.hasTargetCompany = false;
        // Generic value used to indicate the potency/amount of this upgrade's effect
        // The meaning varies between different upgrades
        this.value = 0;
        // Functions that returns the UI element to display the effect of this upgrade.
        this.effectText = () => null;
        if (p.cost != null) {
            this.cost = p.cost;
        }
        if (p.effectText != null) {
            this.effectText = p.effectText;
        }
        this.costPerLevel = p.costPerLevel;
        this.desc = p.desc;
        this.hasTargetServer = p.hasTargetServer ? p.hasTargetServer : false;
        this.hasTargetCompany = p.hasTargetCompany ? p.hasTargetCompany : false;
        this.name = p.name;
        this.value = p.value;
    }
    getCost(currentLevel, count = 1) {
        if (typeof this.cost === "number") {
            return this.cost * count;
        }
        //This formula is equivalent to
        //(currentLevel + 1) * this.costPerLevel
        //being performed repeatedly
        const collapsedSum = 0.5 * count * (count + 2 * currentLevel + 1);
        return this.costPerLevel * collapsedSum;
    }
}
exports.HashUpgrade = HashUpgrade;
