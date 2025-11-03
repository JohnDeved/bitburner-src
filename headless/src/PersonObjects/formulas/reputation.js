"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHackingWorkRepGain = getHackingWorkRepGain;
exports.getFactionSecurityWorkRepGain = getFactionSecurityWorkRepGain;
exports.getFactionFieldWorkRepGain = getFactionFieldWorkRepGain;
const Constants_1 = require("../../Constants");
const BitNodeMultipliers_1 = require("../../BitNode/BitNodeMultipliers");
const Share_1 = require("../../NetworkShare/Share");
const intelligence_1 = require("./intelligence");
function mult(favor) {
    let favorMult = 1 + favor / 100;
    if (isNaN(favorMult)) {
        favorMult = 1;
    }
    return favorMult * BitNodeMultipliers_1.currentNodeMults.FactionWorkRepGain;
}
function getHackingWorkRepGain(p, favor) {
    return (((p.skills.hacking + p.skills.intelligence / 3) / Constants_1.CONSTANTS.MaxSkillLevel) *
        p.mults.faction_rep *
        (0, intelligence_1.calculateIntelligenceBonus)(p.skills.intelligence, 1) *
        mult(favor) *
        (0, Share_1.calculateCurrentShareBonus)());
}
function getFactionSecurityWorkRepGain(p, favor) {
    const t = (0.9 *
        (p.skills.strength +
            p.skills.defense +
            p.skills.dexterity +
            p.skills.agility +
            (p.skills.hacking + p.skills.intelligence) * (0, Share_1.calculateCurrentShareBonus)())) /
        Constants_1.CONSTANTS.MaxSkillLevel /
        4.5;
    return t * p.mults.faction_rep * mult(favor) * (0, intelligence_1.calculateIntelligenceBonus)(p.skills.intelligence, 1);
}
function getFactionFieldWorkRepGain(p, favor) {
    const t = (0.9 *
        (p.skills.strength +
            p.skills.defense +
            p.skills.dexterity +
            p.skills.agility +
            p.skills.charisma +
            (p.skills.hacking + p.skills.intelligence) * (0, Share_1.calculateCurrentShareBonus)())) /
        Constants_1.CONSTANTS.MaxSkillLevel /
        5.5;
    return t * p.mults.faction_rep * mult(favor) * (0, intelligence_1.calculateIntelligenceBonus)(p.skills.intelligence, 1);
}
