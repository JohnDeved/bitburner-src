"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllGangsSchema = void 0;
const Constants_1 = require("../../Gang/data/Constants");
/**
 * If we add/remove gangs, we must change 4 things:
 * - src\Gang\AllGangs.ts: getDefaultAllGangs
 * - src\Gang\data\Constants.ts: GangConstants.Names
 * - src\Gang\data\power.ts: PowerMultiplier
 * - Save file migration code.
 *
 * Gang code assumes that save data contains exactly gangs defined in these places.
 */
exports.AllGangsSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    patternProperties: {
        ".*": {
            type: "object",
            properties: {
                power: {
                    type: "number",
                },
                territory: {
                    type: "number",
                },
            },
            required: ["power", "territory"],
        },
    },
    propertyNames: {
        enum: Constants_1.GangConstants.Names,
    },
    required: Constants_1.GangConstants.Names,
};
