"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHashGainRate = calculateHashGainRate;
exports.calculateLevelUpgradeCost = calculateLevelUpgradeCost;
exports.calculateRamUpgradeCost = calculateRamUpgradeCost;
exports.calculateCoreUpgradeCost = calculateCoreUpgradeCost;
exports.calculateCacheUpgradeCost = calculateCacheUpgradeCost;
exports.calculateServerCost = calculateServerCost;
const BitNodeMultipliers_1 = require("../../BitNode/BitNodeMultipliers");
const Constants_1 = require("../data/Constants");
function calculateHashGainRate(level, ramUsed, maxRam, cores, mult) {
    const baseGain = Constants_1.HacknetServerConstants.HashesPerLevel * level;
    const ramMultiplier = Math.pow(1.07, Math.log2(maxRam));
    const coreMultiplier = 1 + (cores - 1) / 5;
    const ramRatio = 1 - ramUsed / maxRam;
    return baseGain * ramMultiplier * coreMultiplier * ramRatio * mult * BitNodeMultipliers_1.currentNodeMults.HacknetNodeMoney;
}
function calculateLevelUpgradeCost(startingLevel, extraLevels = 1, costMult = 1) {
    const sanitizedLevels = Math.round(extraLevels);
    if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
        return 0;
    }
    if (startingLevel >= Constants_1.HacknetServerConstants.MaxLevel) {
        return Infinity;
    }
    const mult = Constants_1.HacknetServerConstants.UpgradeLevelMult;
    let totalMultiplier = 0;
    let currLevel = startingLevel;
    for (let i = 0; i < sanitizedLevels; ++i) {
        totalMultiplier += Math.pow(mult, currLevel);
        ++currLevel;
    }
    return 10 * Constants_1.HacknetServerConstants.BaseCost * totalMultiplier * costMult;
}
function calculateRamUpgradeCost(startingRam, extraLevels = 1, costMult = 1) {
    const sanitizedLevels = Math.round(extraLevels);
    if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
        return 0;
    }
    if (startingRam >= Constants_1.HacknetServerConstants.MaxRam) {
        return Infinity;
    }
    let totalCost = 0;
    let numUpgrades = Math.round(Math.log2(startingRam));
    let currentRam = startingRam;
    for (let i = 0; i < sanitizedLevels; ++i) {
        const baseCost = currentRam * Constants_1.HacknetServerConstants.RamBaseCost;
        const mult = Math.pow(Constants_1.HacknetServerConstants.UpgradeRamMult, numUpgrades);
        totalCost += baseCost * mult;
        currentRam *= 2;
        ++numUpgrades;
    }
    totalCost *= costMult;
    return totalCost;
}
function calculateCoreUpgradeCost(startingCores, extraLevels = 1, costMult = 1) {
    const sanitizedLevels = Math.round(extraLevels);
    if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
        return 0;
    }
    if (startingCores >= Constants_1.HacknetServerConstants.MaxCores) {
        return Infinity;
    }
    const mult = Constants_1.HacknetServerConstants.UpgradeCoreMult;
    let totalCost = 0;
    let currentCores = startingCores;
    for (let i = 0; i < sanitizedLevels; ++i) {
        totalCost += Math.pow(mult, currentCores - 1);
        ++currentCores;
    }
    totalCost *= Constants_1.HacknetServerConstants.CoreBaseCost;
    totalCost *= costMult;
    return totalCost;
}
function calculateCacheUpgradeCost(startingCache, extraLevels = 1) {
    const sanitizedLevels = Math.round(extraLevels);
    if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
        return 0;
    }
    if (startingCache >= Constants_1.HacknetServerConstants.MaxCache) {
        return Infinity;
    }
    const mult = Constants_1.HacknetServerConstants.UpgradeCacheMult;
    let totalCost = 0;
    let currentCache = startingCache;
    for (let i = 0; i < sanitizedLevels; ++i) {
        totalCost += Math.pow(mult, currentCache - 1);
        ++currentCache;
    }
    totalCost *= Constants_1.HacknetServerConstants.CacheBaseCost;
    return totalCost;
}
function calculateServerCost(n, mult = 1) {
    if (n - 1 >= Constants_1.HacknetServerConstants.MaxServers) {
        return Infinity;
    }
    return Constants_1.HacknetServerConstants.BaseCost * Math.pow(Constants_1.HacknetServerConstants.PurchaseMult, n - 1) * mult;
}
