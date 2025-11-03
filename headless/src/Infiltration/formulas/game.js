"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfiltrationState = exports.InfiltrationStateDefault = exports.MaxDifficultyForInfiltration = void 0;
exports.calculateMarketDemandMultiplier = calculateMarketDemandMultiplier;
exports.decreaseMarketDemandMultiplier = decreaseMarketDemandMultiplier;
exports.calculateDifficulty = calculateDifficulty;
exports.calculateReward = calculateReward;
const _player_1 = require("@player");
const clampNumber_1 = require("../../utils/helpers/clampNumber");
exports.MaxDifficultyForInfiltration = 3.5;
// This value is typically denoted "lambda," and is the instantaneous rate of decay.
const DecayRate = -2e-5;
// This is the scalar for how much each floor completed affects the rewards for infiltration.
const MarketDemandFactor = 1e-3;
exports.InfiltrationStateDefault = {
    lastChangeTimestamp: 0,
    floors: 0,
};
// Tracks an exponential moving average of number of successful infiltrations performed,
// which decays back to 0. This state is only updated after a successful infil.
exports.InfiltrationState = { ...exports.InfiltrationStateDefault };
function calculateCurrentInfilFloors(timestamp) {
    return exports.InfiltrationState.floors * Math.exp(DecayRate * (timestamp - exports.InfiltrationState.lastChangeTimestamp));
}
// Calculates the infiltration reward multiplier based on how many and how recent other infiltrations were completed.
// Each infiltration completed reduces the demand for corporate espionage data for a little while, thus affecting the
// market demand.
function calculateMarketDemandMultiplier(timestamp, clamp = true) {
    const floors = calculateCurrentInfilFloors(timestamp);
    // A parabola is chosen because it is easy to analyze and tune. The constant
    // is a tuning factor, which primarily adjusts what the optimum rate of
    // auto-infil is, and thus how good auto-infil is. The optimum
    // marketDemandMultiplier will be 2/3 regardless of this constant.
    const marketDemandMultiplier = 1 - MarketDemandFactor * floors * floors;
    return (0, clampNumber_1.clampNumber)(marketDemandMultiplier, clamp ? 0 : marketDemandMultiplier, 1);
}
function decreaseMarketDemandMultiplier(timestamp, floors) {
    exports.InfiltrationState.floors = calculateCurrentInfilFloors(timestamp) + floors;
    exports.InfiltrationState.lastChangeTimestamp = timestamp;
}
function calculateRawDiff(stats, startingDifficulty) {
    return (0, clampNumber_1.clampNumber)(startingDifficulty - Math.pow(stats, 0.9) / 250 - _player_1.Player.skills.intelligence / 1600, 0);
}
function calculateDifficulty(startingSecurityLevel) {
    const totalStats = _player_1.Player.skills.strength +
        _player_1.Player.skills.defense +
        _player_1.Player.skills.dexterity +
        _player_1.Player.skills.agility +
        _player_1.Player.skills.charisma;
    return calculateRawDiff(totalStats, startingSecurityLevel);
}
function calculateReward(startingSecurityLevel) {
    return (0, clampNumber_1.clampNumber)(calculateRawDiff(465, startingSecurityLevel), 0, 3);
}
