"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllGangs = void 0;
exports.getDefaultAllGangs = getDefaultAllGangs;
exports.resetGangs = resetGangs;
exports.loadAllGangs = loadAllGangs;
exports.getClashWinChance = getClashWinChance;
const _enums_1 = require("@enums");
const GenericReviver_1 = require("../utils/GenericReviver");
const JsonSchemaValidator_1 = require("../JsonSchema/JsonSchemaValidator");
const DialogBox_1 = require("../ui/React/DialogBox");
function getDefaultAllGangs() {
    return {
        [_enums_1.FactionName.SlumSnakes]: {
            power: 1,
            territory: 1 / 7,
        },
        [_enums_1.FactionName.Tetrads]: {
            power: 1,
            territory: 1 / 7,
        },
        [_enums_1.FactionName.TheSyndicate]: {
            power: 1,
            territory: 1 / 7,
        },
        [_enums_1.FactionName.TheDarkArmy]: {
            power: 1,
            territory: 1 / 7,
        },
        [_enums_1.FactionName.SpeakersForTheDead]: {
            power: 1,
            territory: 1 / 7,
        },
        [_enums_1.FactionName.NiteSec]: {
            power: 1,
            territory: 1 / 7,
        },
        [_enums_1.FactionName.TheBlackHand]: {
            power: 1,
            territory: 1 / 7,
        },
    };
}
exports.AllGangs = getDefaultAllGangs();
function resetGangs() {
    exports.AllGangs = getDefaultAllGangs();
}
function loadAllGangs(saveString) {
    let allGangsData;
    let validate;
    try {
        allGangsData = JSON.parse(saveString, GenericReviver_1.Reviver);
        validate = JsonSchemaValidator_1.JsonSchemaValidator.AllGangs;
        if (!validate(allGangsData)) {
            console.error("validate.errors:", validate.errors);
            // validate.errors is an array of objects, so we need to use JSON.stringify.
            throw new Error(JSON.stringify(validate.errors));
        }
    }
    catch (error) {
        console.error(error);
        console.error("Invalid AllGangsSave:", saveString);
        resetGangs();
        setTimeout(() => {
            (0, DialogBox_1.dialogBoxCreate)(`Cannot load data of AllGangs. AllGangs is reset. Error: ${error}.`);
        }, 1000);
        return;
    }
    exports.AllGangs = allGangsData;
}
function getClashWinChance(thisGang, otherGang) {
    const thisGangPower = exports.AllGangs[thisGang].power;
    const otherGangPower = exports.AllGangs[otherGang].power;
    return thisGangPower / (thisGangPower + otherGangPower);
}
