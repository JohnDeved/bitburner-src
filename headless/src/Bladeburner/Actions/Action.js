"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionClass = void 0;
const addOffset_1 = require("../../utils/helpers/addOffset");
const Constants_1 = require("../data/Constants");
const intelligence_1 = require("../../PersonObjects/formulas/intelligence");
const Enums_1 = require("../Enums");
const Record_1 = require("../../Types/Record");
const clampNumber_1 = require("../../utils/helpers/clampNumber");
class ActionClass {
    constructor(params = null) {
        this.desc = "";
        this.warning = "";
        this.successScaling = "";
        // For LevelableActions, the base difficulty can be increased based on action level
        this.baseDifficulty = 100;
        // All of these scale with level/difficulty
        this.rankGain = 0;
        this.rankLoss = 0;
        this.hpLoss = 0;
        // Action Category. Current categories are stealth and kill
        this.isStealth = false;
        this.isKill = false;
        // Weighting of each stat in determining action success rate
        this.weights = {
            hacking: 1 / 7,
            strength: 1 / 7,
            defense: 1 / 7,
            dexterity: 1 / 7,
            agility: 1 / 7,
            charisma: 1 / 7,
            intelligence: 1 / 7,
        };
        // Diminishing returns of stats (stat ^ decay where 0 <= decay <= 1)
        this.decays = {
            hacking: 0.9,
            strength: 0.9,
            defense: 0.9,
            dexterity: 0.9,
            agility: 0.9,
            charisma: 0.9,
            intelligence: 0.9,
        };
        if (!params)
            return;
        this.desc = params.desc;
        if (params.warning)
            this.warning = params.warning;
        if (params.successScaling)
            this.successScaling = params.successScaling;
        if (params.baseDifficulty)
            this.baseDifficulty = (0, addOffset_1.addOffset)(params.baseDifficulty, 10);
        if (params.rankGain)
            this.rankGain = params.rankGain;
        if (params.rankLoss)
            this.rankLoss = params.rankLoss;
        if (params.hpLoss)
            this.hpLoss = params.hpLoss;
        if (params.isStealth)
            this.isStealth = params.isStealth;
        if (params.isKill)
            this.isKill = params.isKill;
        if (params.weights)
            this.weights = params.weights;
        if (params.decays)
            this.decays = params.decays;
    }
    /** Tests for success. Should be called when an action has completed */
    attempt(bladeburner, person) {
        return Math.random() < this.getSuccessChance(bladeburner, person);
    }
    // All the functions below are overwritten by certain subtypes of action, e.g. BlackOps ignore city stats
    getPopulationSuccessFactor(bladeburner, { est }) {
        const city = bladeburner.getCurrentCity();
        const pop = est ? city.popEst : city.pop;
        return Math.pow(pop / Constants_1.BladeburnerConstants.PopulationThreshold, Constants_1.BladeburnerConstants.PopulationExponent);
    }
    getChaosSuccessFactor(bladeburner) {
        const city = bladeburner.getCurrentCity();
        if (city.chaos > Constants_1.BladeburnerConstants.ChaosThreshold) {
            const diff = 1 + (city.chaos - Constants_1.BladeburnerConstants.ChaosThreshold);
            const mult = Math.pow(diff, 0.5);
            return mult;
        }
        return 1;
    }
    getActionTime(bladeburner, person) {
        const difficulty = this.getDifficulty();
        let baseTime = difficulty / Constants_1.BladeburnerConstants.DifficultyToTimeFactor;
        const skillFac = bladeburner.getSkillMult(Enums_1.BladeburnerMultName.ActionTime); // Always < 1
        const effAgility = bladeburner.getEffectiveSkillLevel(person, "agility");
        const effDexterity = bladeburner.getEffectiveSkillLevel(person, "dexterity");
        const statFac = 0.5 *
            (Math.pow(effAgility, Constants_1.BladeburnerConstants.EffAgiExponentialFactor) +
                Math.pow(effDexterity, Constants_1.BladeburnerConstants.EffDexExponentialFactor) +
                effAgility / Constants_1.BladeburnerConstants.EffAgiLinearFactor +
                effDexterity / Constants_1.BladeburnerConstants.EffDexLinearFactor); // Always > 1
        baseTime = Math.max(1, (baseTime * skillFac) / statFac);
        return Math.ceil(baseTime * this.getActionTimePenalty());
    }
    getTeamSuccessBonus(__bladeburner) {
        return 1;
    }
    getActionTypeSkillSuccessBonus(__bladeburner) {
        return 1;
    }
    getAvailability(__bladeburner) {
        return { available: true };
    }
    getActionTimePenalty() {
        return 1;
    }
    getDifficulty() {
        return this.baseDifficulty;
    }
    getSuccessRange(bladeburner, person) {
        function clamp(x) {
            return Math.max(0, Math.min(x, 1));
        }
        const est = this.getSuccessChance(bladeburner, person, { est: true });
        const real = this.getSuccessChance(bladeburner, person);
        const diff = Math.abs(real - est);
        let low = real - diff;
        let high = real + diff;
        const city = bladeburner.getCurrentCity();
        let r = city.pop / city.popEst;
        if (Number.isNaN(r)) {
            r = 0;
        }
        if (r < 1) {
            low *= r;
        }
        else {
            // We need to "clamp" r with "clampNumber" (not "clamp"), otherwise (high *= r) may be NaN. This happens when the
            // action is Raid, popEst=0, and comms=0.
            high *= (0, clampNumber_1.clampNumber)(r);
        }
        return [clamp(low), clamp(high)];
    }
    getSuccessChance(inst, person, { est } = { est: false }) {
        let difficulty = this.getDifficulty();
        let competence = 0;
        for (const stat of (0, Record_1.getRecordKeys)(person.skills)) {
            competence += this.weights[stat] * Math.pow(inst.getEffectiveSkillLevel(person, stat), this.decays[stat]);
        }
        competence *= (0, intelligence_1.calculateIntelligenceBonus)(person.skills.intelligence, 0.75);
        competence *= inst.calculateStaminaPenalty();
        competence *= this.getTeamSuccessBonus(inst);
        competence *= this.getPopulationSuccessFactor(inst, { est });
        difficulty *= this.getChaosSuccessFactor(inst);
        // Factor skill multipliers into success chance
        competence *= inst.getSkillMult(Enums_1.BladeburnerMultName.SuccessChanceAll);
        competence *= this.getActionTypeSkillSuccessBonus(inst);
        if (this.isStealth)
            competence *= inst.getSkillMult(Enums_1.BladeburnerMultName.SuccessChanceStealth);
        if (this.isKill)
            competence *= inst.getSkillMult(Enums_1.BladeburnerMultName.SuccessChanceKill);
        // Augmentation multiplier
        competence *= person.mults.bladeburner_success_chance;
        if (isNaN(competence)) {
            throw new Error("Competence calculated as NaN in Action.getSuccessChance()");
        }
        return Math.min(1, competence / difficulty);
    }
}
exports.ActionClass = ActionClass;
