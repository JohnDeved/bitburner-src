"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crime = void 0;
const Constants_1 = require("../Constants");
const _player_1 = require("@player");
const CrimeWork_1 = require("../Work/CrimeWork");
const intelligence_1 = require("../PersonObjects/formulas/intelligence");
const BitNodeMultipliers_1 = require("../BitNode/BitNodeMultipliers");
class Crime {
    constructor(workName, tooltipText, type, time, money, difficulty, karma, params) {
        // Milliseconds it takes to attempt the crime
        this.time = 0;
        // Weighting factors that determine how stats affect the success rate of this crime
        this.hacking_success_weight = 0;
        this.strength_success_weight = 0;
        this.defense_success_weight = 0;
        this.dexterity_success_weight = 0;
        this.agility_success_weight = 0;
        this.charisma_success_weight = 0;
        // How much stat experience is granted by this crime
        this.hacking_exp = 0;
        this.strength_exp = 0;
        this.defense_exp = 0;
        this.dexterity_exp = 0;
        this.agility_exp = 0;
        this.charisma_exp = 0;
        this.intelligence_exp = 0;
        this.workName = workName;
        this.tooltipText = tooltipText;
        this.type = type;
        this.time = time;
        this.money = money;
        this.difficulty = difficulty;
        this.karma = karma;
        this.hacking_success_weight = params.hacking_success_weight ? params.hacking_success_weight : 0;
        this.strength_success_weight = params.strength_success_weight ? params.strength_success_weight : 0;
        this.defense_success_weight = params.defense_success_weight ? params.defense_success_weight : 0;
        this.dexterity_success_weight = params.dexterity_success_weight ? params.dexterity_success_weight : 0;
        this.agility_success_weight = params.agility_success_weight ? params.agility_success_weight : 0;
        this.charisma_success_weight = params.charisma_success_weight ? params.charisma_success_weight : 0;
        this.hacking_exp = params.hacking_exp ? params.hacking_exp : 0;
        this.strength_exp = params.strength_exp ? params.strength_exp : 0;
        this.defense_exp = params.defense_exp ? params.defense_exp : 0;
        this.dexterity_exp = params.dexterity_exp ? params.dexterity_exp : 0;
        this.agility_exp = params.agility_exp ? params.agility_exp : 0;
        this.charisma_exp = params.charisma_exp ? params.charisma_exp : 0;
        this.intelligence_exp = params.intelligence_exp ? params.intelligence_exp : 0;
        this.kills = params.kills ? params.kills : 0;
    }
    commit(div = 1, workerScript = null) {
        if (div <= 0) {
            div = 1;
        }
        _player_1.Player.startWork(new CrimeWork_1.CrimeWork({
            crimeType: this.type,
            singularity: workerScript !== null,
        }));
        return this.time;
    }
    successRate(p) {
        let chance = this.hacking_success_weight * p.skills.hacking +
            this.strength_success_weight * p.skills.strength +
            this.defense_success_weight * p.skills.defense +
            this.dexterity_success_weight * p.skills.dexterity +
            this.agility_success_weight * p.skills.agility +
            this.charisma_success_weight * p.skills.charisma +
            Constants_1.CONSTANTS.IntelligenceCrimeWeight * p.skills.intelligence;
        chance /= Constants_1.CONSTANTS.MaxSkillLevel;
        chance /= this.difficulty;
        chance *= p.mults.crime_success;
        chance *= BitNodeMultipliers_1.currentNodeMults.CrimeSuccessRate;
        chance *= (0, intelligence_1.calculateIntelligenceBonus)(p.skills.intelligence, 1);
        return Math.min(chance, 1);
    }
}
exports.Crime = Crime;
