"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyPosition = void 0;
const Constants_1 = require("../Constants");
class CompanyPosition {
    constructor(name, p) {
        this.name = name;
        this.field = p.field;
        this.nextPosition = p.nextPosition;
        this.baseSalary = p.baseSalary;
        this.repMultiplier = p.repMultiplier;
        this.isPartTime = p.isPartTime ?? false;
        this.applyText = p.applyText ?? `Apply for ${this.name} Job`;
        this.hiredText = p.hiredText ?? `Congratulations, you are now employed as a ${this.name}`;
        this.requiredHacking = p.reqdHacking != null ? p.reqdHacking : 0;
        this.requiredStrength = p.reqdStrength != null ? p.reqdStrength : 0;
        this.requiredDefense = p.reqdDefense != null ? p.reqdDefense : 0;
        this.requiredDexterity = p.reqdDexterity != null ? p.reqdDexterity : 0;
        this.requiredAgility = p.reqdAgility != null ? p.reqdAgility : 0;
        this.requiredCharisma = p.reqdCharisma != null ? p.reqdCharisma : 0;
        this.requiredReputation = p.reqdReputation != null ? p.reqdReputation : 0;
        this.hackingEffectiveness = p.hackingEffectiveness != null ? p.hackingEffectiveness : 0;
        this.strengthEffectiveness = p.strengthEffectiveness != null ? p.strengthEffectiveness : 0;
        this.defenseEffectiveness = p.defenseEffectiveness != null ? p.defenseEffectiveness : 0;
        this.dexterityEffectiveness = p.dexterityEffectiveness != null ? p.dexterityEffectiveness : 0;
        this.agilityEffectiveness = p.agilityEffectiveness != null ? p.agilityEffectiveness : 0;
        this.charismaEffectiveness = p.charismaEffectiveness != null ? p.charismaEffectiveness : 0;
        if (Math.round(this.hackingEffectiveness +
            this.strengthEffectiveness +
            this.defenseEffectiveness +
            this.dexterityEffectiveness +
            this.agilityEffectiveness +
            this.charismaEffectiveness) !== 100) {
            console.error(`CompanyPosition ${this.name} parameters do not sum to 100`);
        }
        this.hackingExpGain = p.hackingExpGain != null ? p.hackingExpGain : 0;
        this.strengthExpGain = p.strengthExpGain != null ? p.strengthExpGain : 0;
        this.defenseExpGain = p.defenseExpGain != null ? p.defenseExpGain : 0;
        this.dexterityExpGain = p.dexterityExpGain != null ? p.dexterityExpGain : 0;
        this.agilityExpGain = p.agilityExpGain != null ? p.agilityExpGain : 0;
        this.charismaExpGain = p.charismaExpGain != null ? p.charismaExpGain : 0;
    }
    requiredSkills(jobStatReqOffset) {
        return {
            hacking: this.requiredHacking > 0 ? this.requiredHacking + jobStatReqOffset : 0,
            strength: this.requiredStrength > 0 ? this.requiredStrength + jobStatReqOffset : 0,
            defense: this.requiredDefense > 0 ? this.requiredDefense + jobStatReqOffset : 0,
            dexterity: this.requiredDexterity > 0 ? this.requiredDexterity + jobStatReqOffset : 0,
            agility: this.requiredAgility > 0 ? this.requiredAgility + jobStatReqOffset : 0,
            charisma: this.requiredCharisma > 0 ? this.requiredCharisma + jobStatReqOffset : 0,
            intelligence: 0,
        };
    }
    calculateJobPerformance(worker) {
        const hackRatio = (this.hackingEffectiveness * worker.skills.hacking) / Constants_1.CONSTANTS.MaxSkillLevel;
        const strRatio = (this.strengthEffectiveness * worker.skills.strength) / Constants_1.CONSTANTS.MaxSkillLevel;
        const defRatio = (this.defenseEffectiveness * worker.skills.defense) / Constants_1.CONSTANTS.MaxSkillLevel;
        const dexRatio = (this.dexterityEffectiveness * worker.skills.dexterity) / Constants_1.CONSTANTS.MaxSkillLevel;
        const agiRatio = (this.agilityEffectiveness * worker.skills.agility) / Constants_1.CONSTANTS.MaxSkillLevel;
        const chaRatio = (this.charismaEffectiveness * worker.skills.charisma) / Constants_1.CONSTANTS.MaxSkillLevel;
        let reputationGain = (this.repMultiplier * (hackRatio + strRatio + defRatio + dexRatio + agiRatio + chaRatio)) / 100;
        if (isNaN(reputationGain)) {
            console.error("Company reputation gain calculated to be NaN");
            reputationGain = 0;
        }
        reputationGain += worker.skills.intelligence / Constants_1.CONSTANTS.MaxSkillLevel;
        return reputationGain;
    }
}
exports.CompanyPosition = CompanyPosition;
