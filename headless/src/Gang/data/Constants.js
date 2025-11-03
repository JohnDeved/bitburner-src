"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GangConstants = void 0;
const Constants_1 = require("../../Constants");
const _enums_1 = require("@enums");
exports.GangConstants = {
    /** Number of members that can be recruited with 0 respect. */
    numFreeMembers: 3,
    /** Exponential base used in determining the respect threshold for recruiting a new member. */
    recruitThresholdBase: 5,
    // Respect is divided by this to get rep gain
    GangRespectToReputationRatio: 75,
    MaximumGangMembers: 12,
    CyclesPerTerritoryAndPowerUpdate: 100,
    // Portion of upgrade multiplier that is kept after ascending
    AscensionMultiplierRatio: 0.15,
    // Penalty to ascension points on install
    InstallAscensionPenalty: 0.95,
    // Names of possible Gangs
    Names: [
        _enums_1.FactionName.SlumSnakes,
        _enums_1.FactionName.Tetrads,
        _enums_1.FactionName.TheSyndicate,
        _enums_1.FactionName.TheDarkArmy,
        _enums_1.FactionName.SpeakersForTheDead,
        _enums_1.FactionName.NiteSec,
        _enums_1.FactionName.TheBlackHand,
    ],
    GangKarmaRequirement: -54000,
    /** Normal number of game cycles processed at once (2 seconds) */
    minCyclesToProcess: 2000 / Constants_1.CONSTANTS.MilliPerCycle,
    /** Maximum number of cycles to process at once during bonus time (5 seconds) */
    maxCyclesToProcess: 5000 / Constants_1.CONSTANTS.MilliPerCycle,
};
