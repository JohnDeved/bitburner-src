"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateIntelligenceBonus = calculateIntelligenceBonus;
const _player_1 = require("@player");
function calculateIntelligenceBonus(intelligence, weight = 1) {
    const effectiveIntelligence = _player_1.Player.bitNodeOptions.intelligenceOverride !== undefined
        ? Math.min(_player_1.Player.bitNodeOptions.intelligenceOverride, intelligence)
        : intelligence;
    return 1 + (weight * Math.pow(effectiveIntelligence, 0.8)) / 600;
}
