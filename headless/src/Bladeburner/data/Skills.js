"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skills = void 0;
const _enums_1 = require("@enums");
const Skill_1 = require("../Skill");
exports.Skills = {
    [_enums_1.BladeburnerSkillName.BladesIntuition]: new Skill_1.Skill({
        name: _enums_1.BladeburnerSkillName.BladesIntuition,
        desc: "Each level of this skill increases your success chance for all Contracts, Operations, and BlackOps by 3%",
        baseCost: 3,
        costInc: 2.1,
        mults: { [_enums_1.BladeburnerMultName.SuccessChanceAll]: 3 },
    }),
    [_enums_1.BladeburnerSkillName.Cloak]: new Skill_1.Skill({
        name: _enums_1.BladeburnerSkillName.Cloak,
        desc: "Each level of this skill increases your " +
            "success chance in stealth-related Contracts, Operations, and BlackOps by 5.5%",
        baseCost: 2,
        costInc: 1.1,
        mults: { [_enums_1.BladeburnerMultName.SuccessChanceStealth]: 5.5 },
    }),
    [_enums_1.BladeburnerSkillName.ShortCircuit]: new Skill_1.Skill({
        name: _enums_1.BladeburnerSkillName.ShortCircuit,
        desc: "Each level of this skill increases your success chance " +
            "in Contracts, Operations, and BlackOps that involve retirement by 5.5%",
        baseCost: 2,
        costInc: 2.1,
        mults: { [_enums_1.BladeburnerMultName.SuccessChanceKill]: 5.5 },
    }),
    [_enums_1.BladeburnerSkillName.DigitalObserver]: new Skill_1.Skill({
        name: _enums_1.BladeburnerSkillName.DigitalObserver,
        desc: "Each level of this skill increases your success chance in all Operations and BlackOps by 4%",
        baseCost: 2,
        costInc: 2.1,
        mults: { [_enums_1.BladeburnerMultName.SuccessChanceOperation]: 4 },
    }),
    [_enums_1.BladeburnerSkillName.Tracer]: new Skill_1.Skill({
        name: _enums_1.BladeburnerSkillName.Tracer,
        desc: "Each level of this skill increases your success chance in all Contracts by 4%",
        baseCost: 2,
        costInc: 2.1,
        mults: { [_enums_1.BladeburnerMultName.SuccessChanceContract]: 4 },
    }),
    [_enums_1.BladeburnerSkillName.Overclock]: new Skill_1.Skill({
        name: _enums_1.BladeburnerSkillName.Overclock,
        desc: "Each level of this skill decreases the time it takes " +
            "to attempt a Contract, Operation, and BlackOp by 1% (Max Level: 90)",
        baseCost: 3,
        costInc: 1.4,
        maxLvl: 90,
        mults: { [_enums_1.BladeburnerMultName.ActionTime]: -1 },
    }),
    [_enums_1.BladeburnerSkillName.Reaper]: new Skill_1.Skill({
        name: _enums_1.BladeburnerSkillName.Reaper,
        desc: "Each level of this skill increases your effective combat stats for Bladeburner actions by 2%",
        baseCost: 2,
        costInc: 2.1,
        mults: {
            [_enums_1.BladeburnerMultName.EffStr]: 2,
            [_enums_1.BladeburnerMultName.EffDef]: 2,
            [_enums_1.BladeburnerMultName.EffDex]: 2,
            [_enums_1.BladeburnerMultName.EffAgi]: 2,
        },
    }),
    [_enums_1.BladeburnerSkillName.EvasiveSystem]: new Skill_1.Skill({
        name: _enums_1.BladeburnerSkillName.EvasiveSystem,
        desc: "Each level of this skill increases your effective dexterity and agility for Bladeburner actions by 4%",
        baseCost: 2,
        costInc: 2.1,
        mults: { [_enums_1.BladeburnerMultName.EffDex]: 4, [_enums_1.BladeburnerMultName.EffAgi]: 4 },
    }),
    [_enums_1.BladeburnerSkillName.Datamancer]: new Skill_1.Skill({
        name: _enums_1.BladeburnerSkillName.Datamancer,
        desc: "Each level of this skill increases your effectiveness in " +
            "synthoid population analysis and investigation by 5%. " +
            "This affects all actions that can potentially increase " +
            "the accuracy of your synthoid population/community estimates.",
        baseCost: 3,
        costInc: 1,
        mults: { [_enums_1.BladeburnerMultName.SuccessChanceEstimate]: 5 },
    }),
    [_enums_1.BladeburnerSkillName.CybersEdge]: new Skill_1.Skill({
        name: _enums_1.BladeburnerSkillName.CybersEdge,
        desc: "Each level of this skill increases your max stamina by 2%",
        baseCost: 1,
        costInc: 3,
        mults: { [_enums_1.BladeburnerMultName.Stamina]: 2 },
    }),
    [_enums_1.BladeburnerSkillName.HandsOfMidas]: new Skill_1.Skill({
        name: _enums_1.BladeburnerSkillName.HandsOfMidas,
        desc: "Each level of this skill increases the amount of money you receive from Contracts by 10%",
        baseCost: 2,
        costInc: 2.5,
        mults: { [_enums_1.BladeburnerMultName.Money]: 10 },
    }),
    [_enums_1.BladeburnerSkillName.Hyperdrive]: new Skill_1.Skill({
        name: _enums_1.BladeburnerSkillName.Hyperdrive,
        desc: "Each level of this skill increases the experience earned from Contracts, Operations, and BlackOps by 10%",
        baseCost: 1,
        costInc: 2.5,
        mults: { [_enums_1.BladeburnerMultName.ExpGain]: 10 },
    }),
};
