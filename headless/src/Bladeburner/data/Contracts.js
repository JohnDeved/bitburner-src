"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContracts = createContracts;
exports.loadContractsData = loadContractsData;
const _enums_1 = require("@enums");
const Contract_1 = require("../Actions/Contract");
const getRandomIntInclusive_1 = require("../../utils/helpers/getRandomIntInclusive");
const TypeAssertion_1 = require("../../utils/TypeAssertion");
function createContracts() {
    return {
        [_enums_1.BladeburnerContractName.Tracking]: new Contract_1.Contract({
            name: _enums_1.BladeburnerContractName.Tracking,
            desc: "Identify and locate Synthoids. This contract involves reconnaissance and information-gathering ONLY. Do NOT " +
                "engage. Stealth is of the utmost importance.\n" +
                "Successfully completing this contract will slightly improve the Synthoid population estimate of your current city.",
            successScaling: "Significantly affected by Dexterity and Agility. Minor bonus from combat stats and Charisma. Unaffected by Hacking skill.",
            baseDifficulty: 125,
            difficultyFac: 1.02,
            rewardFac: 1.041,
            rankGain: 0.3,
            hpLoss: 0.5,
            weights: {
                hacking: 0,
                strength: 0.05,
                defense: 0.05,
                dexterity: 0.35,
                agility: 0.35,
                charisma: 0.1,
                intelligence: 0.05,
            },
            decays: {
                hacking: 0,
                strength: 0.91,
                defense: 0.91,
                dexterity: 0.91,
                agility: 0.91,
                charisma: 0.9,
                intelligence: 1,
            },
            isStealth: true,
            growthFunction: () => (0, getRandomIntInclusive_1.getRandomIntInclusive)(5, 75) / 10,
            minCount: 25,
        }),
        [_enums_1.BladeburnerContractName.BountyHunter]: new Contract_1.Contract({
            name: _enums_1.BladeburnerContractName.BountyHunter,
            desc: "Hunt down and capture fugitive Synthoids. These Synthoids are wanted alive.\n" +
                "Successfully completing this contract will decrease the Synthoid population of your current city and increase its chaos level.",
            successScaling: "Significantly affected by Dexterity and Agility. Minor bonus from combat stats and Charisma. Unaffected by Hacking skill.",
            baseDifficulty: 250,
            difficultyFac: 1.04,
            rewardFac: 1.085,
            rankGain: 0.9,
            hpLoss: 1,
            weights: {
                hacking: 0,
                strength: 0.15,
                defense: 0.15,
                dexterity: 0.25,
                agility: 0.25,
                charisma: 0.1,
                intelligence: 0.1,
            },
            decays: {
                hacking: 0,
                strength: 0.91,
                defense: 0.91,
                dexterity: 0.91,
                agility: 0.91,
                charisma: 0.8,
                intelligence: 0.9,
            },
            isKill: true,
            growthFunction: () => (0, getRandomIntInclusive_1.getRandomIntInclusive)(5, 75) / 10,
            minCount: 5,
        }),
        [_enums_1.BladeburnerContractName.Retirement]: new Contract_1.Contract({
            name: _enums_1.BladeburnerContractName.Retirement,
            desc: "Hunt down and retire (kill) rogue Synthoids.\n" +
                "Successfully completing this contract will decrease the Synthoid population of your current city and increase its chaos level.",
            successScaling: "Affected by combat stats. Minor bonus from Charisma. Unaffected by Hacking skill.",
            baseDifficulty: 200,
            difficultyFac: 1.03,
            rewardFac: 1.065,
            rankGain: 0.6,
            hpLoss: 1,
            weights: {
                hacking: 0,
                strength: 0.2,
                defense: 0.2,
                dexterity: 0.2,
                agility: 0.2,
                charisma: 0.1,
                intelligence: 0.1,
            },
            decays: {
                hacking: 0,
                strength: 0.91,
                defense: 0.91,
                dexterity: 0.91,
                agility: 0.91,
                charisma: 0.8,
                intelligence: 0.9,
            },
            isKill: true,
            growthFunction: () => (0, getRandomIntInclusive_1.getRandomIntInclusive)(5, 75) / 10,
            minCount: 5,
        }),
    };
}
function loadContractsData(data, contracts) {
    // loading data as "unknown" and typechecking it down is probably not necessary
    // but this will prevent crashes even with malformed savedata
    if (!data || typeof data !== "object")
        return;
    (0, TypeAssertion_1.assertLoadingType)(data);
    for (const contractName of Object.values(_enums_1.BladeburnerContractName)) {
        const loadedContract = data[contractName];
        if (!(loadedContract instanceof Contract_1.Contract))
            continue;
        contracts[contractName].loadData(loadedContract);
    }
}
