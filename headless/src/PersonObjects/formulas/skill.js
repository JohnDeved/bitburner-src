"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSkill = calculateSkill;
exports.calculateExp = calculateExp;
exports.calculateSkillProgress = calculateSkillProgress;
exports.getEmptySkillProgress = getEmptySkillProgress;
const clampNumber_1 = require("../../utils/helpers/clampNumber");
/**
 * Given an experience amount and stat multiplier, calculates the
 * stat level. Stat-agnostic (same formula for every stat)
 */
function calculateSkill(exp, mult = 1) {
    const value = Math.floor(mult * (32 * Math.log(exp + 534.6) - 200));
    return (0, clampNumber_1.clampNumber)(value, 1);
}
function calculateExp(skill, mult = 1) {
    const floorSkill = Math.floor(skill);
    let value = Math.exp((skill / mult + 200) / 32) - 534.6;
    if (skill === floorSkill && Number.isFinite(skill)) {
        // Check for floating point rounding issues that would cause the inverse
        // operation to return the wrong result.
        let calcSkill = calculateSkill(value, mult);
        let diff = Math.abs(value * Number.EPSILON);
        let newValue = value;
        while (calcSkill < skill) {
            newValue = value + diff;
            diff *= 2;
            calcSkill = calculateSkill(newValue, mult);
        }
        value = newValue;
    }
    return (0, clampNumber_1.clampNumber)(value, 0);
}
function calculateSkillProgress(exp, mult = 1) {
    const currentSkill = calculateSkill(exp, mult);
    const nextSkill = currentSkill + 1;
    const baseExperience = calculateExp(currentSkill, mult);
    const nextExperience = calculateExp(nextSkill, mult);
    const normalize = (value) => ((value - baseExperience) * 100) / (nextExperience - baseExperience);
    const rawProgress = nextExperience - baseExperience !== 0 ? normalize(exp) : 99.99;
    const progress = (0, clampNumber_1.clampNumber)(rawProgress, 0, 100);
    const currentExperience = (0, clampNumber_1.clampNumber)(exp - baseExperience, 0);
    const remainingExperience = (0, clampNumber_1.clampNumber)(nextExperience - exp, 0);
    return {
        currentSkill,
        nextSkill,
        baseExperience,
        experience: exp,
        nextExperience,
        currentExperience,
        remainingExperience,
        progress,
    };
}
function getEmptySkillProgress() {
    return {
        currentSkill: 0,
        nextSkill: 0,
        baseExperience: 0,
        experience: 0,
        nextExperience: 0,
        currentExperience: 0,
        remainingExperience: 0,
        progress: 0,
    };
}
