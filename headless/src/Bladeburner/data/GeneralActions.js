"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralActions = void 0;
const _enums_1 = require("@enums");
const GeneralAction_1 = require("../Actions/GeneralAction");
const Constants_1 = require("./Constants");
exports.GeneralActions = {
    [_enums_1.BladeburnerGeneralActionName.Training]: new GeneralAction_1.GeneralAction({
        name: _enums_1.BladeburnerGeneralActionName.Training,
        getActionTime: () => 30,
        desc: "Improve your abilities at the Bladeburner unit's specialized training center. Doing this gives experience for " +
            "all combat stats and also increases your max stamina.",
    }),
    [_enums_1.BladeburnerGeneralActionName.FieldAnalysis]: new GeneralAction_1.GeneralAction({
        name: _enums_1.BladeburnerGeneralActionName.FieldAnalysis,
        getActionTime: () => 30,
        desc: "Mine and analyze Synthoid-related data. This improves the Bladeburner unit's intelligence on Synthoid locations " +
            "and activities. Completing this action will improve the accuracy of your Synthoid population estimated in the " +
            "current city.\n" +
            "Does NOT require stamina.",
    }),
    [_enums_1.BladeburnerGeneralActionName.Recruitment]: new GeneralAction_1.GeneralAction({
        name: _enums_1.BladeburnerGeneralActionName.Recruitment,
        getActionTime: function (bladeburner, person) {
            const effCharisma = bladeburner.getEffectiveSkillLevel(person, "charisma");
            const charismaFactor = Math.pow(effCharisma, 0.81) + effCharisma / 90;
            return Math.max(10, Math.round(Constants_1.BladeburnerConstants.BaseRecruitmentTimeNeeded - charismaFactor));
        },
        getSuccessChance: function (bladeburner, person) {
            return Math.pow(person.skills.charisma, 0.45) / (bladeburner.teamSize - bladeburner.sleeveSize + 1);
        },
        desc: "Attempt to recruit members for your Bladeburner team. These members can help you conduct operations.\n" +
            "Does NOT require stamina.",
        successScaling: "Success chance is affected by Charisma.",
    }),
    [_enums_1.BladeburnerGeneralActionName.Diplomacy]: new GeneralAction_1.GeneralAction({
        name: _enums_1.BladeburnerGeneralActionName.Diplomacy,
        getActionTime: () => 60,
        desc: "Improve diplomatic relations with the Synthoid population. Completing this action will reduce the chaos level of " +
            "your current city.\n" +
            "Does NOT require stamina.",
    }),
    [_enums_1.BladeburnerGeneralActionName.HyperbolicRegen]: new GeneralAction_1.GeneralAction({
        name: _enums_1.BladeburnerGeneralActionName.HyperbolicRegen,
        getActionTime: () => 60,
        desc: "Enter cryogenic stasis using the Bladeburner division's hi-tech Regeneration Chamber. This will slowly heal your " +
            "wounds and slightly increase your stamina.",
    }),
    [_enums_1.BladeburnerGeneralActionName.InciteViolence]: new GeneralAction_1.GeneralAction({
        name: _enums_1.BladeburnerGeneralActionName.InciteViolence,
        getActionTime: () => 60,
        desc: "Purposefully stir trouble in the synthoid community in order to gain a political edge. This will generate " +
            "additional contracts and operations at the cost of increasing the chaos level of all cities.\n" +
            "Does NOT require stamina.",
        warning: "This action increases chaos of all cities by percentage.",
    }),
};
