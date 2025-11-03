"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAccessGang = canAccessGang;
exports.isAwareOfGang = isAwareOfGang;
exports.getGangFaction = getGangFaction;
exports.getGangName = getGangName;
exports.hasGangWith = hasGangWith;
exports.startGang = startGang;
exports.inGang = inGang;
const Factions_1 = require("../../Faction/Factions");
const Gang_1 = require("../../Gang/Gang");
const Constants_1 = require("../../Gang/data/Constants");
const FactionWork_1 = require("../../Work/FactionWork");
const BitNodeUtils_1 = require("../../BitNode/BitNodeUtils");
function canAccessGang() {
    if (this.bitNodeOptions.disableGang) {
        return { success: false, message: "Gang is disabled by advanced options." };
    }
    if (this.bitNodeN === 2) {
        return { success: true };
    }
    if (this.activeSourceFileLvl(2) === 0) {
        return { success: false, message: "You do not have Source-File 2." };
    }
    if (this.karma > Constants_1.GangConstants.GangKarmaRequirement) {
        return {
            success: false,
            message: `Your karma must be less than or equal to ${Constants_1.GangConstants.GangKarmaRequirement}.`,
        };
    }
    return { success: true };
}
function isAwareOfGang() {
    return (0, BitNodeUtils_1.canAccessBitNodeFeature)(2) && !this.bitNodeOptions.disableGang;
}
function getGangFaction() {
    const gang = this.gang;
    if (gang === null)
        throw new Error("Cannot get gang faction because player is not in a gang.");
    const fac = Factions_1.Factions[gang.facName];
    if (fac == null)
        throw new Error(`Gang has invalid faction name: ${gang.facName}`);
    return fac;
}
function getGangName() {
    const gang = this.gang;
    return gang ? gang.facName : null;
}
function hasGangWith(facName) {
    const gang = this.gang;
    return gang ? gang.facName === facName : false;
}
function startGang(factionName, hacking) {
    // isFactionWork handles null internally, finishWork might need to be run with true
    if ((0, FactionWork_1.isFactionWork)(this.currentWork) && this.currentWork.factionName === factionName)
        this.finishWork(false);
    this.gang = new Gang_1.Gang(factionName, hacking);
    const fac = Factions_1.Factions[factionName];
    if (fac == null) {
        throw new Error(`Invalid faction name when creating gang: ${factionName}`);
    }
    fac.playerReputation = 0;
}
function inGang() {
    return Boolean(this.gang);
}
