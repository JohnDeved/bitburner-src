"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateWantedPenalty = calculateWantedPenalty;
exports.calculateRespectGain = calculateRespectGain;
exports.calculateWantedLevelGain = calculateWantedLevelGain;
exports.calculateMoneyGain = calculateMoneyGain;
exports.calculateAscensionPointsGain = calculateAscensionPointsGain;
exports.calculateAscensionMult = calculateAscensionMult;
const BitNodeMultipliers_1 = require("../../BitNode/BitNodeMultipliers");
function calculateWantedPenalty(gang) {
    return gang.respect / (gang.respect + gang.wantedLevel);
}
function calculateRespectGain(gang, member, task) {
    if (task.baseRespect === 0)
        return 0;
    let statWeight = (task.hackWeight / 100) * member.hack +
        (task.strWeight / 100) * member.str +
        (task.defWeight / 100) * member.def +
        (task.dexWeight / 100) * member.dex +
        (task.agiWeight / 100) * member.agi +
        (task.chaWeight / 100) * member.cha;
    statWeight -= 4 * task.difficulty;
    if (statWeight <= 0)
        return 0;
    const territoryMult = Math.max(0.005, Math.pow(gang.territory * 100, task.territory.respect) / 100);
    const territoryPenalty = (0.2 * gang.territory + 0.8) * BitNodeMultipliers_1.currentNodeMults.GangSoftcap;
    if (isNaN(territoryMult) || territoryMult <= 0)
        return 0;
    const respectMult = calculateWantedPenalty(gang);
    return Math.pow(11 * task.baseRespect * statWeight * territoryMult * respectMult, territoryPenalty);
}
function calculateWantedLevelGain(gang, member, task) {
    if (task.baseWanted === 0)
        return 0;
    let statWeight = (task.hackWeight / 100) * member.hack +
        (task.strWeight / 100) * member.str +
        (task.defWeight / 100) * member.def +
        (task.dexWeight / 100) * member.dex +
        (task.agiWeight / 100) * member.agi +
        (task.chaWeight / 100) * member.cha;
    statWeight -= 3.5 * task.difficulty;
    if (statWeight <= 0)
        return 0;
    const territoryMult = Math.max(0.005, Math.pow(gang.territory * 100, task.territory.wanted) / 100);
    if (isNaN(territoryMult) || territoryMult <= 0)
        return 0;
    if (task.baseWanted < 0) {
        return 0.4 * task.baseWanted * statWeight * territoryMult;
    }
    const calc = (7 * task.baseWanted) / Math.pow(3 * statWeight * territoryMult, 0.8);
    // Put an arbitrary cap on this to prevent wanted level from rising too fast if the
    // denominator is very small. Might want to rethink formula later
    return Math.min(100, calc);
}
function calculateMoneyGain(gang, member, task) {
    if (task.baseMoney === 0)
        return 0;
    let statWeight = (task.hackWeight / 100) * member.hack +
        (task.strWeight / 100) * member.str +
        (task.defWeight / 100) * member.def +
        (task.dexWeight / 100) * member.dex +
        (task.agiWeight / 100) * member.agi +
        (task.chaWeight / 100) * member.cha;
    statWeight -= 3.2 * task.difficulty;
    if (statWeight <= 0)
        return 0;
    const territoryMult = Math.max(0.005, Math.pow(gang.territory * 100, task.territory.money) / 100);
    if (isNaN(territoryMult) || territoryMult <= 0)
        return 0;
    const respectMult = calculateWantedPenalty(gang);
    const territoryPenalty = (0.2 * gang.territory + 0.8) * BitNodeMultipliers_1.currentNodeMults.GangSoftcap;
    return Math.pow(5 * task.baseMoney * statWeight * territoryMult * respectMult, territoryPenalty);
}
function calculateAscensionPointsGain(exp) {
    return Math.max(exp - 1000, 0);
}
function calculateAscensionMult(points) {
    return Math.max(Math.pow(points / 2000, 0.5), 1);
}
