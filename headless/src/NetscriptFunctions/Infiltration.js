"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetscriptInfiltration = NetscriptInfiltration;
const _enums_1 = require("@enums");
const Locations_1 = require("../Locations/Locations");
const game_1 = require("../Infiltration/formulas/game");
const victory_1 = require("../Infiltration/formulas/victory");
const Factions_1 = require("../Faction/Factions");
const EnumHelper_1 = require("../utils/EnumHelper");
const NetscriptHelpers_1 = require("../Netscript/NetscriptHelpers");
const ArrayHelpers_1 = require("../utils/helpers/ArrayHelpers");
const exceptionAlert_1 = require("../utils/helpers/exceptionAlert");
function NetscriptInfiltration() {
    const getLocationsWithInfiltrations = Object.values(Locations_1.Locations).filter((location) => location.infiltrationData);
    const calculateInfiltrationData = (ctx, locationName) => {
        const location = Locations_1.Locations[locationName];
        if (location === undefined) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Location "${locationName}" does not exist.`);
        }
        if (location.infiltrationData === undefined) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Location "${locationName}" does not provide infiltrations.`);
        }
        const locationCity = location.city;
        /**
         * location.city is only null when the location is available in all cities. This kind of location does not have
         * infiltration data.
         */
        if (locationCity === null) {
            const errorMessage = `Location "${locationName}" is available in all cities, but it still has infiltration data.`;
            (0, exceptionAlert_1.exceptionAlert)(new Error(errorMessage));
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, errorMessage);
        }
        const startingSecurityLevel = location.infiltrationData.startingSecurityLevel;
        const difficulty = (0, game_1.calculateDifficulty)(startingSecurityLevel);
        // This is supposed to calculate the constant reward, without market demand.
        // We simulate this by using a time far in the future.
        const timestamp = Date.now() + 1e20;
        const reward = (0, game_1.calculateReward)(startingSecurityLevel);
        const maxLevel = location.infiltrationData.maxClearanceLevel;
        return {
            location: {
                city: locationCity,
                name: location.name,
            },
            reward: {
                tradeRep: (0, victory_1.calculateTradeInformationRepReward)(reward, maxLevel, startingSecurityLevel, timestamp),
                sellCash: (0, victory_1.calculateSellInformationCashReward)(reward, maxLevel, startingSecurityLevel, timestamp),
                SoARep: (0, victory_1.calculateInfiltratorsRepReward)(Factions_1.Factions[_enums_1.FactionName.ShadowsOfAnarchy], maxLevel, startingSecurityLevel, timestamp),
            },
            difficulty: difficulty,
            maxClearanceLevel: location.infiltrationData.maxClearanceLevel,
            startingSecurityLevel: location.infiltrationData.startingSecurityLevel,
        };
    };
    return {
        getPossibleLocations: () => () => {
            return (0, ArrayHelpers_1.filterTruthy)(getLocationsWithInfiltrations.map((l) => {
                if (!l.city)
                    return false;
                return {
                    city: l.city,
                    name: l.name,
                };
            }));
        },
        getInfiltration: (ctx) => (_locationName) => {
            const locationName = (0, EnumHelper_1.getEnumHelper)("LocationName").nsGetMember(ctx, _locationName);
            return calculateInfiltrationData(ctx, locationName);
        },
    };
}
