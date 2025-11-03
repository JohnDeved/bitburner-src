"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateActionRankGain = calculateActionRankGain;
exports.calculateActionReputationGain = calculateActionReputationGain;
const BitNodeMultipliers_1 = require("../BitNode/BitNodeMultipliers");
const Enums_1 = require("../Enums");
const Factions_1 = require("../Faction/Factions");
const Constants_1 = require("./data/Constants");
const Enums_2 = require("./Enums");
function calculateActionRankGain(action, level) {
    switch (action.type) {
        case Enums_2.BladeburnerActionType.General:
            if (action.name === Enums_2.BladeburnerGeneralActionName.FieldAnalysis) {
                return 0.1 * BitNodeMultipliers_1.currentNodeMults.BladeburnerRank;
            }
            break;
        case Enums_2.BladeburnerActionType.Contract:
        case Enums_2.BladeburnerActionType.Operation: {
            if (level == null) {
                level = action.level;
            }
            const rewardMultiplier = Math.pow(action.rewardFac, level - 1);
            return action.rankGain * rewardMultiplier * BitNodeMultipliers_1.currentNodeMults.BladeburnerRank;
        }
        case Enums_2.BladeburnerActionType.BlackOp:
            return action.rankGain * BitNodeMultipliers_1.currentNodeMults.BladeburnerRank;
    }
    return 0;
}
function calculateActionReputationGain(person, rankGain) {
    const favorBonus = 1 + Factions_1.Factions[Enums_1.FactionName.Bladeburners].favor / 100;
    return Constants_1.BladeburnerConstants.RankToFactionRepFactor * rankGain * person.mults.faction_rep * favorBonus;
}
