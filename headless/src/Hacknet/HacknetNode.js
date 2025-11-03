"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HacknetNode = void 0;
const Constants_1 = require("../Constants");
const HacknetNodes_1 = require("./formulas/HacknetNodes");
const Constants_2 = require("./data/Constants");
const DialogBox_1 = require("../ui/React/DialogBox");
const JSONReviver_1 = require("../utils/JSONReviver");
const Validator_1 = require("../utils/Validator");
class HacknetNode {
    constructor(name = "", prodMult = 1) {
        // Node's number of cores
        this.cores = 1;
        // Node's Level
        this.level = 1;
        // Node's production per second
        this.moneyGainRatePerSecond = 0;
        // How long this Node has existed, in seconds
        this.onlineTimeSeconds = 0;
        // Node's RAM (GB)
        this.ram = 1;
        // Total money earned by this Node
        this.totalMoneyGenerated = 0;
        this.name = name;
        this.updateMoneyGainRate(prodMult);
    }
    // Get the cost to upgrade this Node's number of cores
    calculateCoreUpgradeCost(levels = 1, costMult) {
        return (0, HacknetNodes_1.calculateCoreUpgradeCost)(this.cores, levels, costMult);
    }
    // Get the cost to upgrade this Node's level
    calculateLevelUpgradeCost(levels = 1, costMult) {
        return (0, HacknetNodes_1.calculateLevelUpgradeCost)(this.level, levels, costMult);
    }
    // Get the cost to upgrade this Node's RAM
    calculateRamUpgradeCost(levels = 1, costMult) {
        return (0, HacknetNodes_1.calculateRamUpgradeCost)(this.ram, levels, costMult);
    }
    // Process this Hacknet Node in the game loop.
    // Returns the amount of money generated
    process(numCycles = 1) {
        const seconds = (numCycles * Constants_1.CONSTANTS.MilliPerCycle) / 1000;
        let gain = this.moneyGainRatePerSecond * seconds;
        if (isNaN(gain)) {
            console.error(`Hacknet Node ${this.name} calculated earnings of NaN`);
            gain = 0;
        }
        this.totalMoneyGenerated += gain;
        this.onlineTimeSeconds += seconds;
        return gain;
    }
    // Upgrade this Node's number of cores, if possible
    // Returns a boolean indicating whether new cores were successfully bought
    upgradeCore(levels = 1, prodMult) {
        this.cores = Math.min(Constants_2.HacknetNodeConstants.MaxCores, Math.round(this.cores + levels));
        this.updateMoneyGainRate(prodMult);
    }
    // Upgrade this Node's level, if possible
    // Returns a boolean indicating whether the level was successfully updated
    upgradeLevel(levels = 1, prodMult) {
        this.level = Math.min(Constants_2.HacknetNodeConstants.MaxLevel, Math.round(this.level + levels));
        this.updateMoneyGainRate(prodMult);
    }
    // Upgrade this Node's RAM, if possible
    // Returns a boolean indicating whether the RAM was successfully upgraded
    upgradeRam(levels = 1, prodMult) {
        for (let i = 0; i < levels; ++i) {
            this.ram *= 2; // Ram is always doubled
        }
        this.ram = Math.round(this.ram); // Handle any floating point precision issues
        this.updateMoneyGainRate(prodMult);
    }
    // Re-calculate this Node's production and update the moneyGainRatePerSecond prop
    updateMoneyGainRate(prodMult) {
        this.moneyGainRatePerSecond = (0, HacknetNodes_1.calculateMoneyGainRate)(this.level, this.ram, this.cores, prodMult);
        if (isNaN(this.moneyGainRatePerSecond)) {
            this.moneyGainRatePerSecond = 0;
            (0, DialogBox_1.dialogBoxCreate)("Error in calculating Hacknet Node production. Please report to game developer");
        }
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("HacknetNode", this);
    }
    /** Initializes a HacknetNode object from a JSON save state. */
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(HacknetNode, value.data);
    }
}
exports.HacknetNode = HacknetNode;
HacknetNode.validationData = {
    cores: (0, Validator_1.minMax)(1, 1, Constants_2.HacknetNodeConstants.MaxCores),
    level: (0, Validator_1.minMax)(1, 1, Constants_2.HacknetNodeConstants.MaxLevel),
    ram: (0, Validator_1.minMax)(1, 1, Constants_2.HacknetNodeConstants.MaxRam),
    onlineTimeSeconds: (0, Validator_1.minMax)(0, 0, Infinity),
    totalMoneyGenerated: (0, Validator_1.minMax)(0, 0, Infinity),
};
JSONReviver_1.constructorsForReviver.HacknetNode = HacknetNode;
