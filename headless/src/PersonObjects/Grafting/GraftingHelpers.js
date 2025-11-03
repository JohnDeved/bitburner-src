"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateGraftingTimeWithBonus = exports.graftingIntBonus = exports.getGraftingAvailableAugs = void 0;
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const Augmentations_1 = require("../../Augmentation/Augmentations");
const intelligence_1 = require("../formulas/intelligence");
const Record_1 = require("../../Types/Record");
const getGraftingAvailableAugs = () => {
    const augs = [];
    for (const [augName, aug] of (0, Record_1.getRecordEntries)(Augmentations_1.Augmentations)) {
        if (_player_1.Player.factions.includes(_enums_1.FactionName.Bladeburners)) {
            if (aug.isSpecial && !aug.factions.includes(_enums_1.FactionName.Bladeburners))
                continue;
        }
        else {
            if (aug.isSpecial)
                continue;
        }
        augs.push(augName);
    }
    return augs.filter((augmentation) => !_player_1.Player.hasAugmentation(augmentation));
};
exports.getGraftingAvailableAugs = getGraftingAvailableAugs;
const graftingIntBonus = () => {
    return (0, intelligence_1.calculateIntelligenceBonus)(_player_1.Player.skills.intelligence, 1);
};
exports.graftingIntBonus = graftingIntBonus;
const calculateGraftingTimeWithBonus = (aug) => {
    const baseTime = aug.time;
    return baseTime / (0, exports.graftingIntBonus)();
};
exports.calculateGraftingTimeWithBonus = calculateGraftingTimeWithBonus;
