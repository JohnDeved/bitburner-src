"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateServerGrowthLog = calculateServerGrowthLog;
exports.calculateServerGrowth = calculateServerGrowth;
exports.calculateGrowMoney = calculateGrowMoney;
const BitNodeMultipliers_1 = require("../../BitNode/BitNodeMultipliers");
const Constants_1 = require("../data/Constants");
const isValidNumber_1 = require("../../utils/helpers/isValidNumber");
// Returns the log of the growth rate. When passing 1 for threads, this gives a useful constant.
function calculateServerGrowthLog(server, threads, p, cores = 1) {
    if (!server.serverGrowth)
        return -Infinity;
    const hackDifficulty = server.hackDifficulty ?? 100;
    const numServerGrowthCycles = Math.max(threads, 0);
    //Get adjusted growth log, which accounts for server security
    //log1p computes log(1+p), it is far more accurate for small values.
    let adjGrowthLog = Math.log1p(Constants_1.ServerConstants.ServerBaseGrowthIncr / hackDifficulty);
    if (adjGrowthLog >= Constants_1.ServerConstants.ServerMaxGrowthLog) {
        adjGrowthLog = Constants_1.ServerConstants.ServerMaxGrowthLog;
    }
    //Calculate adjusted server growth rate based on parameters
    const serverGrowthPercentage = server.serverGrowth / 100;
    const serverGrowthPercentageAdjusted = serverGrowthPercentage * BitNodeMultipliers_1.currentNodeMults.ServerGrowthRate;
    //Apply serverGrowth for the calculated number of growth cycles
    const coreBonus = 1 + (cores - 1) * (1 / 16);
    // It is critical that numServerGrowthCycles (aka threads) is multiplied last,
    // so that it rounds the same way as numCycleForGrowthCorrected.
    return adjGrowthLog * serverGrowthPercentageAdjusted * p.mults.hacking_grow * coreBonus * numServerGrowthCycles;
}
function calculateServerGrowth(server, threads, p, cores = 1) {
    if (!server.serverGrowth)
        return 0;
    return Math.exp(calculateServerGrowthLog(server, threads, p, cores));
}
// This differs from calculateServerGrowth in that it includes the additive
// factor and all the boundary checks.
function calculateGrowMoney(server, threads, p, cores = 1) {
    let serverGrowth = calculateServerGrowth(server, threads, p, cores);
    if (serverGrowth < 1) {
        console.warn("serverGrowth calculated to be less than 1");
        serverGrowth = 1;
    }
    let moneyAvailable = server.moneyAvailable ?? Number.NaN;
    moneyAvailable += threads; // It can be grown even if it has no money
    moneyAvailable *= serverGrowth;
    // cap at max (or data corruption)
    if (server.moneyMax !== undefined &&
        (0, isValidNumber_1.isValidNumber)(server.moneyMax) &&
        (moneyAvailable > server.moneyMax || isNaN(moneyAvailable))) {
        moneyAvailable = server.moneyMax;
    }
    return moneyAvailable;
}
