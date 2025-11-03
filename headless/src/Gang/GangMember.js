"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GangMember = void 0;
const GangMemberTasks_1 = require("./GangMemberTasks");
const GangMemberUpgrades_1 = require("./GangMemberUpgrades");
const _player_1 = require("@player");
const Constants_1 = require("./data/Constants");
const JSONReviver_1 = require("../utils/JSONReviver");
const formulas_1 = require("./formulas/formulas");
const _3_0_0_1 = require("../utils/APIBreaks/3.0.0");
class GangMember {
    constructor(name = "") {
        this.task = "Unassigned";
        this.earnedRespect = 0;
        this.hack = 1;
        this.str = 1;
        this.def = 1;
        this.dex = 1;
        this.agi = 1;
        this.cha = 1;
        this.hack_exp = 0;
        this.str_exp = 0;
        this.def_exp = 0;
        this.dex_exp = 0;
        this.agi_exp = 0;
        this.cha_exp = 0;
        this.hack_mult = 1;
        this.str_mult = 1;
        this.def_mult = 1;
        this.dex_mult = 1;
        this.agi_mult = 1;
        this.cha_mult = 1;
        this.hack_asc_points = 0;
        this.str_asc_points = 0;
        this.def_asc_points = 0;
        this.dex_asc_points = 0;
        this.agi_asc_points = 0;
        this.cha_asc_points = 0;
        this.upgrades = []; // Names of upgrades
        this.augmentations = []; // Names of augmentations only
        this.name = name;
    }
    calculateSkill(exp, mult = 1) {
        return Math.max(Math.floor(mult * (32 * Math.log(exp + 534.5) - 200)), 1);
    }
    calculateAscensionMult(points) {
        return (0, formulas_1.calculateAscensionMult)(points);
    }
    updateSkillLevels() {
        this.hack = this.calculateSkill(this.hack_exp, this.hack_mult * this.calculateAscensionMult(this.hack_asc_points));
        this.str = this.calculateSkill(this.str_exp, this.str_mult * this.calculateAscensionMult(this.str_asc_points));
        this.def = this.calculateSkill(this.def_exp, this.def_mult * this.calculateAscensionMult(this.def_asc_points));
        this.dex = this.calculateSkill(this.dex_exp, this.dex_mult * this.calculateAscensionMult(this.dex_asc_points));
        this.agi = this.calculateSkill(this.agi_exp, this.agi_mult * this.calculateAscensionMult(this.agi_asc_points));
        this.cha = this.calculateSkill(this.cha_exp, this.cha_mult * this.calculateAscensionMult(this.cha_asc_points));
    }
    calculatePower() {
        return (this.hack + this.str + this.def + this.dex + this.agi + this.cha) / 95;
    }
    assignToTask(taskName) {
        if (!Object.hasOwn(GangMemberTasks_1.GangMemberTasks, taskName)) {
            this.task = "Unassigned";
            return false;
        }
        this.task = taskName;
        return true;
    }
    unassignFromTask() {
        this.task = "Unassigned";
    }
    getTask() {
        if (Object.hasOwn(GangMemberTasks_1.GangMemberTasks, this.task)) {
            return GangMemberTasks_1.GangMemberTasks[this.task];
        }
        return GangMemberTasks_1.GangMemberTasks.Unassigned;
    }
    calculateRespectGain(gang) {
        const task = this.getTask();
        const g = {
            respect: gang.respect,
            wantedLevel: gang.wanted,
            territory: gang.getTerritory(),
        };
        return (0, formulas_1.calculateRespectGain)(g, this, task);
    }
    calculateWantedLevelGain(gang) {
        const task = this.getTask();
        const g = {
            respect: gang.respect,
            wantedLevel: gang.wanted,
            territory: gang.getTerritory(),
        };
        return (0, formulas_1.calculateWantedLevelGain)(g, this, task);
    }
    calculateMoneyGain(gang) {
        const task = this.getTask();
        const g = {
            respect: gang.respect,
            wantedLevel: gang.wanted,
            territory: gang.getTerritory(),
        };
        return (0, formulas_1.calculateMoneyGain)(g, this, task);
    }
    expMult() {
        return {
            hack: (this.hack_mult - 1) / 4 + 1,
            str: (this.str_mult - 1) / 4 + 1,
            def: (this.def_mult - 1) / 4 + 1,
            dex: (this.dex_mult - 1) / 4 + 1,
            agi: (this.agi_mult - 1) / 4 + 1,
            cha: (this.cha_mult - 1) / 4 + 1,
        };
    }
    // Calculate our gain for each stat based on each modifier of member
    // if no task is assigned to that member we return null, other wise we
    // return an object containing our per-cycle gains for each stat.
    calculateExpGain(numCycles = 1) {
        const task = this.getTask();
        if (task === GangMemberTasks_1.GangMemberTasks.Unassigned)
            return null;
        const expValues = {
            hack_exp: 0,
            str_exp: 0,
            def_exp: 0,
            dex_exp: 0,
            agi_exp: 0,
            cha_exp: 0,
        };
        const difficultyMult = Math.pow(task.difficulty, 0.9);
        const difficultyPerCycles = difficultyMult * numCycles;
        const weightDivisor = 1500;
        const expMult = this.expMult();
        expValues.hack_exp +=
            (task.hackWeight / weightDivisor) *
                difficultyPerCycles *
                expMult.hack *
                this.calculateAscensionMult(this.hack_asc_points);
        expValues.str_exp +=
            (task.strWeight / weightDivisor) *
                difficultyPerCycles *
                expMult.str *
                this.calculateAscensionMult(this.str_asc_points);
        expValues.def_exp +=
            (task.defWeight / weightDivisor) *
                difficultyPerCycles *
                expMult.def *
                this.calculateAscensionMult(this.def_asc_points);
        expValues.dex_exp +=
            (task.dexWeight / weightDivisor) *
                difficultyPerCycles *
                expMult.dex *
                this.calculateAscensionMult(this.dex_asc_points);
        expValues.agi_exp +=
            (task.agiWeight / weightDivisor) *
                difficultyPerCycles *
                expMult.agi *
                this.calculateAscensionMult(this.agi_asc_points);
        expValues.cha_exp +=
            (task.chaWeight / weightDivisor) *
                difficultyPerCycles *
                expMult.cha *
                this.calculateAscensionMult(this.cha_asc_points);
        return expValues;
    }
    gainExperience(numCycles) {
        // Do the calculations if our function returns null meaning no task is assigned
        // then we return otherwise we add our exp gains to our total values
        const gains = this.calculateExpGain(numCycles);
        if (gains === null) {
            return;
        }
        this.hack_exp += gains.hack_exp;
        this.str_exp += gains.str_exp;
        this.def_exp += gains.def_exp;
        this.dex_exp += gains.dex_exp;
        this.agi_exp += gains.agi_exp;
        this.cha_exp += gains.cha_exp;
    }
    earnRespect(numCycles = 1, gang) {
        const earnedRespect = this.calculateRespectGain(gang) * numCycles;
        this.earnedRespect += earnedRespect;
        return earnedRespect;
    }
    getGainedAscensionPoints() {
        return {
            hack: (0, formulas_1.calculateAscensionPointsGain)(this.hack_exp),
            str: (0, formulas_1.calculateAscensionPointsGain)(this.str_exp),
            def: (0, formulas_1.calculateAscensionPointsGain)(this.def_exp),
            dex: (0, formulas_1.calculateAscensionPointsGain)(this.dex_exp),
            agi: (0, formulas_1.calculateAscensionPointsGain)(this.agi_exp),
            cha: (0, formulas_1.calculateAscensionPointsGain)(this.cha_exp),
        };
    }
    canAscend() {
        const points = this.getGainedAscensionPoints();
        return points.hack > 0 || points.str > 0 || points.def > 0 || points.dex > 0 || points.agi > 0 || points.cha > 0;
    }
    getCurrentAscensionMults() {
        return {
            hack: this.calculateAscensionMult(this.hack_asc_points),
            str: this.calculateAscensionMult(this.str_asc_points),
            def: this.calculateAscensionMult(this.def_asc_points),
            dex: this.calculateAscensionMult(this.dex_asc_points),
            agi: this.calculateAscensionMult(this.agi_asc_points),
            cha: this.calculateAscensionMult(this.cha_asc_points),
        };
    }
    getAscensionMultsAfterAscend() {
        const points = this.getGainedAscensionPoints();
        return {
            hack: this.calculateAscensionMult(this.hack_asc_points + points.hack),
            str: this.calculateAscensionMult(this.str_asc_points + points.str),
            def: this.calculateAscensionMult(this.def_asc_points + points.def),
            dex: this.calculateAscensionMult(this.dex_asc_points + points.dex),
            agi: this.calculateAscensionMult(this.agi_asc_points + points.agi),
            cha: this.calculateAscensionMult(this.cha_asc_points + points.cha),
        };
    }
    getAscensionResults() {
        const postAscend = this.getAscensionMultsAfterAscend();
        const preAscend = this.getCurrentAscensionMults();
        return {
            hack: postAscend.hack / preAscend.hack,
            str: postAscend.str / preAscend.str,
            def: postAscend.def / preAscend.def,
            dex: postAscend.dex / preAscend.dex,
            agi: postAscend.agi / preAscend.agi,
            cha: postAscend.cha / preAscend.cha,
        };
    }
    getPostInstallPoints() {
        return {
            hack: this.hack_asc_points * Constants_1.GangConstants.InstallAscensionPenalty,
            str: this.str_asc_points * Constants_1.GangConstants.InstallAscensionPenalty,
            def: this.def_asc_points * Constants_1.GangConstants.InstallAscensionPenalty,
            dex: this.dex_asc_points * Constants_1.GangConstants.InstallAscensionPenalty,
            agi: this.agi_asc_points * Constants_1.GangConstants.InstallAscensionPenalty,
            cha: this.cha_asc_points * Constants_1.GangConstants.InstallAscensionPenalty,
        };
    }
    ascend() {
        const res = this.getAscensionResults();
        const points = this.getGainedAscensionPoints();
        this.hack_asc_points += points.hack;
        this.str_asc_points += points.str;
        this.def_asc_points += points.def;
        this.dex_asc_points += points.dex;
        this.agi_asc_points += points.agi;
        this.cha_asc_points += points.cha;
        // Remove upgrades. Then re-calculate multipliers and stats
        this.upgrades.length = 0;
        this.hack_mult = 1;
        this.str_mult = 1;
        this.def_mult = 1;
        this.dex_mult = 1;
        this.agi_mult = 1;
        this.cha_mult = 1;
        for (let i = 0; i < this.augmentations.length; ++i) {
            const aug = GangMemberUpgrades_1.GangMemberUpgrades[this.augmentations[i]];
            this.applyUpgrade(aug);
        }
        // Clear exp and recalculate stats
        this.hack_exp = 0;
        this.str_exp = 0;
        this.def_exp = 0;
        this.dex_exp = 0;
        this.agi_exp = 0;
        this.cha_exp = 0;
        this.updateSkillLevels();
        const respectToDeduct = this.earnedRespect;
        this.earnedRespect = 0;
        return {
            respect: respectToDeduct,
            hack: res.hack,
            str: res.str,
            def: res.def,
            dex: res.dex,
            agi: res.agi,
            cha: res.cha,
        };
    }
    applyUpgrade(upg) {
        if (upg.mults.str != null)
            this.str_mult *= upg.mults.str;
        if (upg.mults.def != null)
            this.def_mult *= upg.mults.def;
        if (upg.mults.dex != null)
            this.dex_mult *= upg.mults.dex;
        if (upg.mults.agi != null)
            this.agi_mult *= upg.mults.agi;
        if (upg.mults.cha != null)
            this.cha_mult *= upg.mults.cha;
        if (upg.mults.hack != null)
            this.hack_mult *= upg.mults.hack;
    }
    buyUpgrade(upg) {
        if (!_player_1.Player.gang)
            throw new Error("Tried to buy a gang member upgrade when no gang was present");
        // Prevent purchasing of already-owned upgrades
        if (this.augmentations.includes(upg.name) || this.upgrades.includes(upg.name))
            return false;
        if (_player_1.Player.money < _player_1.Player.gang.getUpgradeCost(upg))
            return false;
        _player_1.Player.loseMoney(_player_1.Player.gang.getUpgradeCost(upg), "gang_expenses");
        if (upg.type === "g") {
            this.augmentations.push(upg.name);
        }
        else {
            this.upgrades.push(upg.name);
        }
        this.applyUpgrade(upg);
        return true;
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("GangMember", this);
    }
    /** Initializes a GangMember object from a JSON save state. */
    static fromJSON(value) {
        const member = (0, JSONReviver_1.Generic_fromJSON)(GangMember, value.data);
        for (let i = 0; i < member.upgrades.length; ++i) {
            member.upgrades[i] = (0, _3_0_0_1.convertV2GangEquipmentNames)(member.upgrades[i]);
        }
        return member;
    }
}
exports.GangMember = GangMember;
JSONReviver_1.constructorsForReviver.GangMember = GangMember;
