"use strict";
// This is in a separate file from the normal augmentation helpers to limit import impact on Augmentations.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnstableCircadianModulatorParams = getUnstableCircadianModulatorParams;
const _enums_1 = require("@enums");
const Record_1 = require("../Types/Record");
const RNG_1 = require("../Casino/RNG");
function getUnstableCircadianModulatorParams() {
    //Time-Based Augment Test
    const randomBonuses = getRandomBonus();
    const UnstableCircadianModulatorParams = {
        moneyCost: 5e9,
        repCost: 3.625e5,
        info: "An experimental nanobot injection. Its unstable nature leads to " +
            "unpredictable results based on your circadian rhythm.",
        factions: [_enums_1.FactionName.SpeakersForTheDead],
    };
    (0, Record_1.getRecordKeys)(randomBonuses.bonuses).forEach((key) => (UnstableCircadianModulatorParams[key] = randomBonuses.bonuses[key]));
    return UnstableCircadianModulatorParams;
}
function getRandomBonus() {
    const bonuses = [
        {
            bonuses: {
                hacking_chance: 1.25,
                hacking_speed: 1.1,
                hacking_money: 1.25,
                hacking_grow: 1.1,
            },
            description: "Increases the player's hacking chance by 25%.\n" +
                "Increases the player's hacking speed by 10%.\n" +
                "Increases the amount of money the player gains from hacking by 25%.\n" +
                "Improves the effectiveness of grow() by 10%.",
        },
        {
            bonuses: {
                hacking: 1.15,
                hacking_exp: 2,
            },
            description: "Increases the player's hacking skill by 15%.\n" +
                "Increases the player's hacking experience gain rate by 100%.",
        },
        {
            bonuses: {
                strength: 1.25,
                strength_exp: 2,
                defense: 1.25,
                defense_exp: 2,
                dexterity: 1.25,
                dexterity_exp: 2,
                agility: 1.25,
                agility_exp: 2,
            },
            description: "Increases all of the player's combat stats by 25%.\n" +
                "Increases all of the player's combat stat experience gain rate by 100%.",
        },
        {
            bonuses: {
                charisma: 1.5,
                charisma_exp: 2,
            },
            description: "This augmentation increases the player's charisma by 50%.\n" +
                "Increases the player's charisma experience gain rate by 100%.",
        },
        {
            bonuses: {
                hacknet_node_money: 1.2,
                hacknet_node_purchase_cost: 0.85,
                hacknet_node_ram_cost: 0.85,
                hacknet_node_core_cost: 0.85,
                hacknet_node_level_cost: 0.85,
            },
            description: "Increases Hacknet production by 20%.\n" + "Decreases all costs related to Hacknet by 15%.",
        },
        {
            bonuses: {
                company_rep: 1.25,
                faction_rep: 1.15,
                work_money: 1.7,
            },
            description: "Increases the amount of money the player gains from working by 70%.\n" +
                "Increases the amount of reputation the player gains when working for a company by 25%.\n" +
                "Increases the amount of reputation the player gains for a faction by 15%.",
        },
        {
            bonuses: {
                crime_success: 2,
                crime_money: 2,
            },
            description: "Increases the player's crime success rate by 100%.\n" +
                "Increases the amount of money the player gains from crimes by 100%.",
        },
    ];
    const randomNumber = new RNG_1.WHRNG(Math.floor(Date.now() / 3600000));
    for (let i = 0; i < 5; i++)
        randomNumber.step();
    return bonuses[Math.floor(bonuses.length * randomNumber.random())];
}
