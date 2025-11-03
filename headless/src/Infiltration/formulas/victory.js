"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSellInformationCashReward = calculateSellInformationCashReward;
exports.calculateTradeInformationRepReward = calculateTradeInformationRepReward;
exports.calculateInfiltratorsRepReward = calculateInfiltratorsRepReward;
const _player_1 = require("@player");
const BitNodeMultipliers_1 = require("../../BitNode/BitNodeMultipliers");
const LocationsMetadata_1 = require("../../Locations/data/LocationsMetadata");
const _enums_1 = require("@enums");
const game_1 = require("./game");
function calculateSellInformationCashReward(reward, maxLevel, startingSecurityLevel, timeStamp) {
    const levelBonus = maxLevel * Math.pow(1.01, maxLevel);
    const marketRateMultiplier = (0, game_1.calculateMarketDemandMultiplier)(timeStamp);
    return (Math.pow(reward + 1, 2) *
        Math.pow(startingSecurityLevel, 3) *
        marketRateMultiplier *
        3e3 *
        levelBonus *
        (_player_1.Player.hasAugmentation(_enums_1.AugmentationName.WKSharmonizer, true) ? 1.5 : 1) *
        BitNodeMultipliers_1.currentNodeMults.InfiltrationMoney);
}
function calculateTradeInformationRepReward(reward, maxLevel, startingSecurityLevel, timeStamp) {
    const levelBonus = maxLevel * Math.pow(1.005, maxLevel);
    const marketRateMultiplier = (0, game_1.calculateMarketDemandMultiplier)(timeStamp);
    let balanceMultiplier;
    if (startingSecurityLevel < 4) {
        balanceMultiplier = 0.45;
    }
    else if (startingSecurityLevel < 5) {
        balanceMultiplier = 0.4;
    }
    else if (startingSecurityLevel < 7) {
        balanceMultiplier = 0.35;
    }
    else if (startingSecurityLevel < 12) {
        balanceMultiplier = 0.3;
    }
    else if (startingSecurityLevel < 14) {
        balanceMultiplier = 0.26;
    }
    else if (startingSecurityLevel < 15) {
        balanceMultiplier = 0.25;
    }
    else {
        balanceMultiplier = 0.2;
    }
    return (Math.pow(reward + 1, 1.1) *
        Math.pow(startingSecurityLevel, 1.1) *
        balanceMultiplier *
        marketRateMultiplier *
        30 *
        levelBonus *
        (_player_1.Player.hasAugmentation(_enums_1.AugmentationName.WKSharmonizer, true) ? 1.2 : 1) *
        BitNodeMultipliers_1.currentNodeMults.InfiltrationRep);
}
function calculateInfiltratorsRepReward(faction, maxLevel, startingSecurityLevel, timeStamp) {
    const maxStartingSecurityLevel = LocationsMetadata_1.LocationsMetadata.reduce((acc, data) => {
        const startingSecurityLevel = data.infiltrationData?.startingSecurityLevel || 0;
        return acc > startingSecurityLevel ? acc : startingSecurityLevel;
    }, 0);
    const baseRepGain = (startingSecurityLevel / maxStartingSecurityLevel) * 5000;
    const balanceMultiplier = 0.8 + 0.05 * (maxLevel - 5);
    const marketRateMultiplier = (0, game_1.calculateMarketDemandMultiplier)(timeStamp);
    return (baseRepGain *
        balanceMultiplier *
        marketRateMultiplier *
        (_player_1.Player.hasAugmentation(_enums_1.AugmentationName.WKSharmonizer, true) ? 2 : 1) *
        (1 + faction.favor / 100));
}
