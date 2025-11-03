"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factions = void 0;
exports.loadFactions = loadFactions;
exports.getFactionsSave = getFactionsSave;
const _enums_1 = require("@enums");
const Faction_1 = require("./Faction");
const GenericReviver_1 = require("../utils/GenericReviver");
const TypeAssertion_1 = require("../utils/TypeAssertion");
const Record_1 = require("../Types/Record");
const Augmentations_1 = require("../Augmentation/Augmentations");
const EnumHelper_1 = require("../utils/EnumHelper");
const clampNumber_1 = require("../utils/helpers/clampNumber");
/** The static list of all factions. Initialized once and never modified. */
exports.Factions = (0, Record_1.createEnumKeyedRecord)(_enums_1.FactionName, (name) => new Faction_1.Faction(name));
// Add the associated augs to every faction
for (const aug of (0, Record_1.getRecordValues)(Augmentations_1.Augmentations)) {
    for (const factionName of aug.factions) {
        const faction = exports.Factions[factionName];
        faction.augmentations.push(aug.name);
    }
}
function loadFactions(saveString, player) {
    const loadedFactions = JSON.parse(saveString, GenericReviver_1.Reviver);
    // This loading method allows invalid data in player save, but just ignores anything invalid
    if (!loadedFactions)
        return;
    if (typeof loadedFactions !== "object")
        return;
    for (const [loadedFactionName, loadedFaction] of Object.entries(loadedFactions)) {
        if (!(0, EnumHelper_1.getEnumHelper)("FactionName").isMember(loadedFactionName))
            continue;
        if (!loadedFaction)
            continue;
        const faction = exports.Factions[loadedFactionName];
        if (typeof loadedFaction !== "object")
            continue;
        (0, TypeAssertion_1.assertLoadingType)(loadedFaction);
        const { playerReputation: loadedRep, favor: loadedFavor, discovery: loadedDiscovery } = loadedFaction;
        if (typeof loadedRep === "number" && loadedRep >= 0) {
            // `playerReputation` must be in [0, Number.MAX_VALUE].
            faction.playerReputation = (0, clampNumber_1.clampNumber)(loadedRep, 0);
        }
        if (typeof loadedFavor === "number" && loadedFavor >= 0) {
            // `favor` must be in [0, MaxFavor]. This rule will be enforced in the `setFavor` function.
            faction.setFavor(loadedFavor);
        }
        if ((0, EnumHelper_1.getEnumHelper)("FactionDiscovery").isMember(loadedDiscovery))
            faction.discovery = loadedDiscovery;
    }
    // Load joined factions from player save
    for (const joinedFacName of player.factions) {
        if (!(0, EnumHelper_1.getEnumHelper)("FactionName").isMember(joinedFacName)) {
            console.error(`Invalid faction in player save factions array: ${joinedFacName}`);
            continue;
        }
        const faction = exports.Factions[joinedFacName];
        faction.isMember = true;
        faction.alreadyInvited = true;
        faction.discovery = _enums_1.FactionDiscovery.known;
        for (const enemyFacName of faction.getInfo().enemies)
            exports.Factions[enemyFacName].isBanned = true;
    }
    // Load invited factions from player save
    for (const invitedFaction of player.factionInvitations) {
        if (!(0, EnumHelper_1.getEnumHelper)("FactionName").isMember(invitedFaction)) {
            console.error(`Invalid faction in player save factionInvitations array: ${invitedFaction}`);
            continue;
        }
        exports.Factions[invitedFaction].alreadyInvited = true;
        exports.Factions[invitedFaction].discovery = _enums_1.FactionDiscovery.known;
    }
}
function getFactionsSave() {
    const save = {};
    for (const factionName of (0, EnumHelper_1.getEnumHelper)("FactionName").valueArray) {
        const faction = exports.Factions[factionName];
        const discovery = faction.discovery === _enums_1.FactionDiscovery.unknown ? undefined : faction.discovery;
        const { favor, playerReputation } = faction;
        if (discovery || favor || playerReputation) {
            save[factionName] = { favor: favor || undefined, playerReputation: playerReputation || undefined, discovery };
        }
    }
    return save;
}
