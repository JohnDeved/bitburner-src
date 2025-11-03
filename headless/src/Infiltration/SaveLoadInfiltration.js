"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadInfiltrations = loadInfiltrations;
const TypeAssertion_1 = require("../utils/TypeAssertion");
const game_1 = require("./formulas/game");
function loadInfiltrations(saveString) {
    if (saveString == null || typeof saveString !== "string" || saveString === "") {
        Object.assign(game_1.InfiltrationState, game_1.InfiltrationStateDefault);
        return;
    }
    try {
        const parsedData = JSON.parse(saveString);
        (0, TypeAssertion_1.assertObject)(parsedData);
        const { floors, lastChangeTimestamp } = parsedData;
        if (typeof floors !== "number") {
            throw new Error("Invalid parsedData.floors");
        }
        if (typeof lastChangeTimestamp !== "number") {
            throw new Error("Invalid parsedData.lastChangeTimestamp");
        }
        game_1.InfiltrationState.floors = floors;
        game_1.InfiltrationState.lastChangeTimestamp = lastChangeTimestamp;
    }
    catch (error) {
        console.error(error);
        console.error("Invalid recent infiltrations:", saveString);
        Object.assign(game_1.InfiltrationState, game_1.InfiltrationStateDefault);
    }
}
