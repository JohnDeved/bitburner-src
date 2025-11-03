"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMoneyGainRate = calculateMoneyGainRate;
exports.calculateLevelUpgradeCost = calculateLevelUpgradeCost;
exports.calculateRamUpgradeCost = calculateRamUpgradeCost;
exports.calculateCoreUpgradeCost = calculateCoreUpgradeCost;
exports.calculateNodeCost = calculateNodeCost;
const BitNodeMultipliers_1 = require("../../BitNode/BitNodeMultipliers");
const Constants_1 = require("../data/Constants");
function calculateMoneyGainRate(level, ram, cores, mult) {
    const gainPerLevel = Constants_1.HacknetNodeConstants.MoneyGainPerLevel;
    const levelMult = level * gainPerLevel;
    const ramMult = Math.pow(1.035, ram - 1);
    const coresMult = (cores + 5) / 6;
    return levelMult * ramMult * coresMult * mult * BitNodeMultipliers_1.currentNodeMults.HacknetNodeMoney;
}
function calculateLevelUpgradeCost(startingLevel, extraLevels = 1, costMult = 1) {
    const sanitizedLevels = Math.round(extraLevels);
    if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
        return 0;
    }
    if (startingLevel >= Constants_1.HacknetNodeConstants.MaxLevel) {
        return Infinity;
    }
    const mult = Constants_1.HacknetNodeConstants.UpgradeLevelMult;
    let totalMultiplier = 0;
    let currLevel = startingLevel - 1;
    for (let i = 0; i < sanitizedLevels; ++i) {
        totalMultiplier += Math.pow(mult, currLevel);
        ++currLevel;
    }
    return Constants_1.HacknetNodeConstants.LevelBaseCost * totalMultiplier * costMult;
}
function calculateRamUpgradeCost(startingRam, extraLevels = 1, costMult = 1) {
    const sanitizedLevels = Math.round(extraLevels);
    if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
        return 0;
    }
    if (startingRam >= Constants_1.HacknetNodeConstants.MaxRam) {
        return Infinity;
    }
    let totalCost = 0;
    let numUpgrades = Math.round(Math.log2(startingRam));
    let currentRam = startingRam;
    for (let i = 0; i < sanitizedLevels; ++i) {
        const baseCost = currentRam * Constants_1.HacknetNodeConstants.RamBaseCost;
        const mult = Math.pow(Constants_1.HacknetNodeConstants.UpgradeRamMult, numUpgrades);
        totalCost += baseCost * mult;
        currentRam *= 2;
        ++numUpgrades;
    }
    totalCost *= costMult;
    return totalCost;
}
function calculateCoreUpgradeCost(startingCore, extraLevels = 1, costMult = 1) {
    const sanitizedCores = Math.round(extraLevels);
    if (isNaN(sanitizedCores) || sanitizedCores < 1) {
        return 0;
    }
    if (startingCore >= Constants_1.HacknetNodeConstants.MaxCores) {
        return Infinity;
    }
    const coreBaseCost = Constants_1.HacknetNodeConstants.CoreBaseCost;
    const mult = Constants_1.HacknetNodeConstants.UpgradeCoreMult;
    let totalCost = 0;
    let currentCores = startingCore;
    for (let i = 0; i < sanitizedCores; ++i) {
        totalCost += coreBaseCost * Math.pow(mult, currentCores - 1);
        ++currentCores;
    }
    totalCost *= costMult;
    return totalCost;
}
function calculateNodeCost(n, mult = 1) {
    if (n <= 0) {
        return 0;
    }
    return Constants_1.HacknetNodeConstants.BaseCost * Math.pow(Constants_1.HacknetNodeConstants.PurchaseNextMult, n - 1) * mult;
}
