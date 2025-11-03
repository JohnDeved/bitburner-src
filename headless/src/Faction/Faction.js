"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Faction_favor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faction = void 0;
const _enums_1 = require("@enums");
const FactionInfo_1 = require("./FactionInfo");
const favor_1 = require("./formulas/favor");
const clampNumber_1 = require("../utils/helpers/clampNumber");
class Faction {
    constructor(name) {
        /**
         * Flag signalling whether the player has already received an invitation
         * to this faction
         */
        this.alreadyInvited = false;
        /** Holds names of all augmentations that this Faction offers */
        this.augmentations = [];
        /** Amount of favor the player has with this faction. */
        _Faction_favor.set(this, 0);
        /** Flag signalling whether player has been banned from this faction */
        this.isBanned = false;
        /** Flag signalling whether player is a member of this faction */
        this.isMember = false;
        /** Level of player knowledge about this faction (unknown, rumored, known) */
        this.discovery = _enums_1.FactionDiscovery.unknown;
        /** Amount of reputation player has with this faction */
        this.playerReputation = 0;
        this.name = name;
    }
    get favor() {
        return __classPrivateFieldGet(this, _Faction_favor, "f");
    }
    /**
     * There is no setter for this.#favor. This is intentional. Performing arithmetic operations on `favor` may lead to
     * the overflow error of `playerReputation`, so anything that wants to change `favor` must explicitly do that through
     * `setFavor`.
     *
     * @param value
     */
    setFavor(value) {
        if (Number.isNaN(value)) {
            __classPrivateFieldSet(this, _Faction_favor, 0, "f");
            return;
        }
        __classPrivateFieldSet(this, _Faction_favor, (0, clampNumber_1.clampNumber)(value, 0, favor_1.MaxFavor), "f");
    }
    getInfo() {
        const info = FactionInfo_1.FactionInfos[this.name];
        if (info == null) {
            throw new Error(`Missing faction from FactionInfos: ${this.name} this probably means the faction got corrupted somehow`);
        }
        return info;
    }
    prestigeSourceFile() {
        // Reset favor, reputation, and flags
        this.setFavor(0);
        this.playerReputation = 0;
        this.alreadyInvited = false;
        this.isMember = false;
        this.isBanned = false;
    }
    prestigeAugmentation() {
        // Gain favor
        this.setFavor((0, favor_1.addRepToFavor)(this.favor, this.playerReputation));
        // Reset reputation and flags
        this.playerReputation = 0;
        this.alreadyInvited = false;
        this.isMember = false;
        this.isBanned = false;
    }
}
exports.Faction = Faction;
_Faction_favor = new WeakMap();
