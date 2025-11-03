"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHackingChance = calculateHackingChance;
exports.calculateHackingExpGain = calculateHackingExpGain;
exports.calculatePercentMoneyHacked = calculatePercentMoneyHacked;
exports.calculateHackingTime = calculateHackingTime;
exports.calculateGrowTime = calculateGrowTime;
exports.calculateWeakenTime = calculateWeakenTime;
const BitNodeMultipliers_1 = require("./BitNode/BitNodeMultipliers");
const intelligence_1 = require("./PersonObjects/formulas/intelligence");
const clampNumber_1 = require("./utils/helpers/clampNumber");
/** Returns the chance the person has to successfully hack a server */
function calculateHackingChance(server, person) {
    const hackDifficulty = server.hackDifficulty ?? 100;
    const requiredHackingSkill = server.requiredHackingSkill ?? 1e9;
    // Unrooted or unhackable server
    if (!server.hasAdminRights || hackDifficulty >= 100)
        return 0;
    const hackFactor = 1.75;
    const difficultyMult = (100 - hackDifficulty) / 100;
    const skillMult = (0, clampNumber_1.clampNumber)(hackFactor * person.skills.hacking, 1);
    const skillChance = (skillMult - requiredHackingSkill) / skillMult;
    const chance = skillChance *
        difficultyMult *
        person.mults.hacking_chance *
        (0, intelligence_1.calculateIntelligenceBonus)(person.skills.intelligence, 1);
    return (0, clampNumber_1.clampNumber)(chance, 0, 1);
}
/**
 * Returns the amount of hacking experience the person will gain upon
 * successfully hacking a server
 */
function calculateHackingExpGain(server, person) {
    const baseDifficulty = server.baseDifficulty;
    if (!baseDifficulty)
        return 0;
    const baseExpGain = 3;
    const diffFactor = 0.3;
    let expGain = baseExpGain;
    expGain += baseDifficulty * diffFactor;
    return expGain * person.mults.hacking_exp * BitNodeMultipliers_1.currentNodeMults.HackExpGain;
}
/**
 * Returns the percentage of money that will be stolen from a server if
 * it is successfully hacked (returns the decimal form, not the actual percent value)
 */
function calculatePercentMoneyHacked(server, person) {
    const hackDifficulty = server.hackDifficulty ?? 100;
    if (hackDifficulty >= 100)
        return 0;
    const requiredHackingSkill = server.requiredHackingSkill ?? 1e9;
    // Adjust if needed for balancing. This is the divisor for the final calculation
    const balanceFactor = 240;
    const difficultyMult = (100 - hackDifficulty) / 100;
    const skillMult = (person.skills.hacking - (requiredHackingSkill - 1)) / person.skills.hacking;
    const percentMoneyHacked = (difficultyMult * skillMult * person.mults.hacking_money * BitNodeMultipliers_1.currentNodeMults.ScriptHackMoney) / balanceFactor;
    return Math.min(1, Math.max(percentMoneyHacked, 0));
}
/** Returns time it takes to complete a hack on a server, in seconds */
function calculateHackingTime(server, person) {
    const { hackDifficulty, requiredHackingSkill } = server;
    if (typeof hackDifficulty !== "number" || typeof requiredHackingSkill !== "number")
        return Infinity;
    const difficultyMult = requiredHackingSkill * hackDifficulty;
    const baseDiff = 500;
    const baseSkill = 50;
    const diffFactor = 2.5;
    let skillFactor = diffFactor * difficultyMult + baseDiff;
    skillFactor /= person.skills.hacking + baseSkill;
    const hackTimeMultiplier = 5;
    const hackingTime = (hackTimeMultiplier * skillFactor) /
        (person.mults.hacking_speed *
            BitNodeMultipliers_1.currentNodeMults.HackingSpeedMultiplier *
            (0, intelligence_1.calculateIntelligenceBonus)(person.skills.intelligence, 1));
    return hackingTime;
}
/** Returns time it takes to complete a grow operation on a server, in seconds */
function calculateGrowTime(server, person) {
    const growTimeMultiplier = 3.2; // Relative to hacking time. 16/5 = 3.2
    return growTimeMultiplier * calculateHackingTime(server, person);
}
/** Returns time it takes to complete a weaken operation on a server, in seconds */
function calculateWeakenTime(server, person) {
    const weakenTimeMultiplier = 4; // Relative to hacking time
    return weakenTimeMultiplier * calculateHackingTime(server, person);
}
