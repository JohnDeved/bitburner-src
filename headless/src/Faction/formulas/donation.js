"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repFromDonation = repFromDonation;
exports.donationForRep = donationForRep;
exports.favorNeededToDonate = favorNeededToDonate;
exports.canDonate = canDonate;
exports.donate = donate;
const _player_1 = require("@player");
const Constants_1 = require("../../Constants");
const BitNodeMultipliers_1 = require("../../BitNode/BitNodeMultipliers");
function repFromDonation(amt, person) {
    return (amt / Constants_1.CONSTANTS.DonateMoneyToRepDivisor) * person.mults.faction_rep * BitNodeMultipliers_1.currentNodeMults.FactionWorkRepGain;
}
function donationForRep(rep, person) {
    return (rep * Constants_1.CONSTANTS.DonateMoneyToRepDivisor) / person.mults.faction_rep / BitNodeMultipliers_1.currentNodeMults.FactionWorkRepGain;
}
function favorNeededToDonate() {
    return Math.floor(Constants_1.CONSTANTS.BaseFavorToDonate * BitNodeMultipliers_1.currentNodeMults.FavorToDonateToFaction);
}
function canDonate(amt) {
    return !isNaN(amt) && amt > 0 && _player_1.Player.money >= amt;
}
/** Donates money to the faction provided and returns repuation gained */
function donate(amt, faction) {
    if (!canDonate(amt)) {
        return 0;
    }
    const repGain = repFromDonation(amt, _player_1.Player);
    _player_1.Player.loseMoney(amt, "other");
    faction.playerReputation += repGain;
    return repGain;
}
