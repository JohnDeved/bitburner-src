"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBitNodeFinished = isBitNodeFinished;
exports.canAccessBitNodeFeature = canAccessBitNodeFeature;
exports.knowAboutBitverse = knowAboutBitverse;
exports.getDefaultBitNodeOptions = getDefaultBitNodeOptions;
exports.validateSourceFileOverrides = validateSourceFileOverrides;
exports.setBitNodeOptions = setBitNodeOptions;
exports.finishBitNode = finishBitNode;
const _player_1 = require("@player");
const AllServers_1 = require("../Server/AllServers");
const Server_1 = require("../Server/Server");
const SpecialServers_1 = require("../Server/data/SpecialServers");
const Jsonable_1 = require("../Types/Jsonable");
const Constants_1 = require("./Constants");
function isBitNodeFinished() {
    const wd = (0, AllServers_1.GetServer)(SpecialServers_1.SpecialServers.WorldDaemon);
    if (!(wd instanceof Server_1.Server)) {
        throw new Error("WorldDaemon is not a normal server. This is a bug. Please contact developers.");
    }
    return wd.backdoorInstalled;
}
function canAccessBitNodeFeature(bitNode) {
    return _player_1.Player.bitNodeN === bitNode || _player_1.Player.activeSourceFileLvl(bitNode) > 0;
}
function knowAboutBitverse() {
    for (const sfActiveLevel of _player_1.Player.activeSourceFiles.values()) {
        if (sfActiveLevel > 0) {
            return true;
        }
    }
    return false;
}
function getDefaultBitNodeOptions() {
    return {
        sourceFileOverrides: new Jsonable_1.JSONMap(),
        intelligenceOverride: undefined,
        restrictHomePCUpgrade: false,
        disableGang: false,
        disableCorporation: false,
        disableBladeburner: false,
        disable4SData: false,
        disableHacknetServer: false,
        disableSleeveExpAndAugmentation: false,
    };
}
function validateSourceFileOverrides(sourceFileOverrides, isDataFromPlayer) {
    if (!isDataFromPlayer && !(sourceFileOverrides instanceof Jsonable_1.JSONMap)) {
        return { valid: false, message: `It must be a JSONMap.` };
    }
    for (const [sfNumber, sfLevel] of sourceFileOverrides.entries()) {
        if (!Constants_1.validBitNodes.includes(sfNumber)) {
            return { valid: false, message: `Invalid BitNode: ${sfNumber}.` };
        }
        if (!Number.isFinite(sfLevel)) {
            return { valid: false, message: `Invalid SF level: ${sfLevel}.` };
        }
        const maxSfLevel = _player_1.Player.sourceFileLvl(sfNumber);
        if (sfLevel > maxSfLevel) {
            return { valid: false, message: `Invalid SF level: ${sfLevel}. Max level: ${maxSfLevel}.` };
        }
    }
    return { valid: true };
}
function setBitNodeOptions(bitNodeOptions) {
    const validationResultForSourceFileOverrides = validateSourceFileOverrides(bitNodeOptions.sourceFileOverrides, false);
    if (!validationResultForSourceFileOverrides.valid) {
        throw new Error(`sourceFileOverrides is invalid. Reason: ${validationResultForSourceFileOverrides.message}`);
    }
    if (bitNodeOptions.intelligenceOverride !== undefined &&
        (!Number.isInteger(bitNodeOptions.intelligenceOverride) || bitNodeOptions.intelligenceOverride < 0)) {
        throw new Error(`intelligenceOverride is invalid. It must be a non-negative integer.`);
    }
    Object.assign(_player_1.Player.bitNodeOptions, bitNodeOptions);
}
/**
 * This function only sets the backdoorInstalled flag of the WD server. The caller must call Router.toPage() to route
 * the UI to the BitVerse page. Importing Router from src\ui\GameRoot.tsx brings too many unnecessary dependencies to
 * this utility file.
 */
function finishBitNode() {
    const wd = (0, AllServers_1.GetServer)(SpecialServers_1.SpecialServers.WorldDaemon);
    if (!(wd instanceof Server_1.Server)) {
        throw new Error("WorldDaemon is not a normal server. This is a bug. Please contact developers.");
    }
    wd.backdoorInstalled = true;
}
