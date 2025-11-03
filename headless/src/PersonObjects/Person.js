"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Person = void 0;
const _enums_1 = require("@enums");
const BitNodeMultipliers_1 = require("../BitNode/BitNodeMultipliers");
const Constants_1 = require("../Constants");
const Player_1 = require("../Player");
const Multipliers_1 = require("./Multipliers");
const skill_1 = require("./formulas/skill");
// Base class representing a person-like object
class Person {
    constructor() {
        this.hp = { current: 10, max: 10 };
        this.skills = {
            hacking: 1,
            strength: 1,
            defense: 1,
            dexterity: 1,
            agility: 1,
            charisma: 1,
            intelligence: 0,
        };
        this.exp = {
            hacking: 0,
            strength: 0,
            defense: 0,
            dexterity: 0,
            agility: 0,
            charisma: 0,
            intelligence: 0,
        };
        this.mults = (0, Multipliers_1.defaultMultipliers)();
        /** Augmentations */
        this.augmentations = [];
        this.queuedAugmentations = [];
        /** City that the person is in */
        this.city = _enums_1.CityName.Sector12;
        this.calculateSkill = skill_1.calculateSkill; //Class version is equal to imported version
    }
    gainHackingExp(exp) {
        if (isNaN(exp)) {
            console.error("ERR: NaN passed into Player.gainHackingExp()");
            return;
        }
        this.exp.hacking += exp;
        if (this.exp.hacking < 0) {
            this.exp.hacking = 0;
        }
        this.skills.hacking = (0, skill_1.calculateSkill)(this.exp.hacking, this.mults.hacking * BitNodeMultipliers_1.currentNodeMults.HackingLevelMultiplier);
    }
    gainStrengthExp(exp) {
        if (isNaN(exp)) {
            console.error("ERR: NaN passed into Player.gainStrengthExp()");
            return;
        }
        this.exp.strength += exp;
        if (this.exp.strength < 0) {
            this.exp.strength = 0;
        }
        this.skills.strength = (0, skill_1.calculateSkill)(this.exp.strength, this.mults.strength * BitNodeMultipliers_1.currentNodeMults.StrengthLevelMultiplier);
    }
    gainDefenseExp(exp) {
        if (isNaN(exp)) {
            console.error("ERR: NaN passed into player.gainDefenseExp()");
            return;
        }
        this.exp.defense += exp;
        if (this.exp.defense < 0) {
            this.exp.defense = 0;
        }
        this.skills.defense = (0, skill_1.calculateSkill)(this.exp.defense, this.mults.defense * BitNodeMultipliers_1.currentNodeMults.DefenseLevelMultiplier);
        const ratio = this.hp.current / this.hp.max;
        this.hp.max = Math.floor(10 + this.skills.defense / 10);
        this.hp.current = Math.round(this.hp.max * ratio);
    }
    gainDexterityExp(exp) {
        if (isNaN(exp)) {
            console.error("ERR: NaN passed into Player.gainDexterityExp()");
            return;
        }
        this.exp.dexterity += exp;
        if (this.exp.dexterity < 0) {
            this.exp.dexterity = 0;
        }
        this.skills.dexterity = (0, skill_1.calculateSkill)(this.exp.dexterity, this.mults.dexterity * BitNodeMultipliers_1.currentNodeMults.DexterityLevelMultiplier);
    }
    gainAgilityExp(exp) {
        if (isNaN(exp)) {
            console.error("ERR: NaN passed into Player.gainAgilityExp()");
            return;
        }
        this.exp.agility += exp;
        if (this.exp.agility < 0) {
            this.exp.agility = 0;
        }
        this.skills.agility = (0, skill_1.calculateSkill)(this.exp.agility, this.mults.agility * BitNodeMultipliers_1.currentNodeMults.AgilityLevelMultiplier);
    }
    gainCharismaExp(exp) {
        if (isNaN(exp)) {
            console.error("ERR: NaN passed into Player.gainCharismaExp()");
            return;
        }
        this.exp.charisma += exp;
        if (this.exp.charisma < 0) {
            this.exp.charisma = 0;
        }
        this.skills.charisma = (0, skill_1.calculateSkill)(this.exp.charisma, this.mults.charisma * BitNodeMultipliers_1.currentNodeMults.CharismaLevelMultiplier);
    }
    gainIntelligenceExp(exp) {
        if (isNaN(exp)) {
            console.error("ERROR: NaN passed into Player.gainIntelligenceExp()");
            return;
        }
        /**
         * Don't change sourceFileLvl to activeSourceFileLvl. When the player has int level, the ability to gain more int is
         * a permanent benefit.
         */
        if (Player_1.Player.sourceFileLvl(5) > 0 || this.skills.intelligence > 0 || Player_1.Player.bitNodeN === 5) {
            this.exp.intelligence += exp;
            this.skills.intelligence = Math.floor(this.calculateSkill(this.exp.intelligence, 1));
        }
    }
    gainStats(retValue) {
        this.gainHackingExp(retValue.hackExp * this.mults.hacking_exp);
        this.gainStrengthExp(retValue.strExp * this.mults.strength_exp);
        this.gainDefenseExp(retValue.defExp * this.mults.defense_exp);
        this.gainDexterityExp(retValue.dexExp * this.mults.dexterity_exp);
        this.gainAgilityExp(retValue.agiExp * this.mults.agility_exp);
        this.gainCharismaExp(retValue.chaExp * this.mults.charisma_exp);
        this.gainIntelligenceExp(retValue.intExp);
    }
    regenerateHp(amt) {
        if (typeof amt !== "number") {
            console.warn(`Player.regenerateHp() called without a numeric argument: ${amt}`);
            return;
        }
        this.hp.current += amt;
        if (this.hp.current > this.hp.max) {
            this.hp.current = this.hp.max;
        }
    }
    updateSkillLevels() {
        for (const [skill, bnMult] of [
            ["hacking", "HackingLevelMultiplier"],
            ["strength", "StrengthLevelMultiplier"],
            ["defense", "DefenseLevelMultiplier"],
            ["dexterity", "DexterityLevelMultiplier"],
            ["agility", "AgilityLevelMultiplier"],
            ["charisma", "CharismaLevelMultiplier"],
        ]) {
            this.skills[skill] = Math.max(1, Math.floor(this.calculateSkill(this.exp[skill], this.mults[skill] * BitNodeMultipliers_1.currentNodeMults[bnMult])));
        }
        const ratio = Math.min(this.hp.current / this.hp.max, 1);
        this.hp.max = Math.floor(10 + this.skills.defense / 10);
        this.hp.current = Math.round(this.hp.max * ratio);
    }
    hasAugmentation(augName, ignoreQueued = false) {
        if (this.augmentations.some((a) => a.name === augName)) {
            return true;
        }
        if (!ignoreQueued && this.queuedAugmentations.some((a) => a.name === augName)) {
            return true;
        }
        return false;
    }
    travel(cityName) {
        if (!Player_1.Player.canAfford(Constants_1.CONSTANTS.TravelCost)) {
            return false;
        }
        Player_1.Player.loseMoney(Constants_1.CONSTANTS.TravelCost, this.travelCostMoneySource());
        this.city = cityName;
        return true;
    }
    /** Reset all multipliers to 1 */
    resetMultipliers() {
        this.mults = (0, Multipliers_1.defaultMultipliers)();
    }
}
exports.Person = Person;
