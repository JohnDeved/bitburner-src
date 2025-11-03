"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Augmentation = void 0;
// Class definition for a single Augmentation object
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const formatNumber_1 = require("../ui/formatNumber");
const Multipliers_1 = require("../PersonObjects/Multipliers");
const Record_1 = require("../Types/Record");
function generateStatsDescription(mults, programs, startingMoney) {
    // For a percentage that is <10, show x.xx%, otherwise show xx.x%
    const f = (x) => (0, formatNumber_1.formatPercent)(x, x - 1 < 0.1 ? 2 : 1);
    let desc = "Effects:";
    // Skills
    if (mults.hacking !== 1 &&
        mults.hacking === mults.strength &&
        mults.hacking === mults.defense &&
        mults.hacking === mults.dexterity &&
        mults.hacking === mults.agility &&
        mults.hacking === mults.charisma) {
        desc += `\n+${f(mults.hacking - 1)} all skills`;
    }
    else {
        // Not allskills
        if (mults.hacking !== 1)
            desc += `\n+${f(mults.hacking - 1)} hacking skill`;
        if (mults.strength !== 1 &&
            mults.strength === mults.defense &&
            mults.strength === mults.dexterity &&
            mults.strength === mults.agility) {
            desc += `\n+${f(mults.strength - 1)} combat skills`;
        }
        else {
            // Not all combat
            if (mults.strength !== 1)
                desc += `\n+${f(mults.strength - 1)} strength skill`;
            if (mults.defense !== 1)
                desc += `\n+${f(mults.defense - 1)} defense skill`;
            if (mults.dexterity !== 1)
                desc += `\n+${f(mults.dexterity - 1)} dexterity skill`;
            if (mults.agility !== 1)
                desc += `\n+${f(mults.agility - 1)} agility skill`;
        }
        if (mults.charisma !== 1)
            desc += `\n+${f(mults.charisma - 1)} charisma skill`;
    }
    // Skill XP
    if (mults.hacking_exp !== 1 &&
        mults.hacking_exp === mults.strength_exp &&
        mults.hacking_exp === mults.defense_exp &&
        mults.hacking_exp === mults.dexterity_exp &&
        mults.hacking_exp === mults.agility_exp &&
        mults.hacking_exp === mults.charisma_exp) {
        desc += `\n+${f(mults.hacking_exp - 1)} exp for all skills`;
    }
    else {
        // Not allskillxp
        if (mults.hacking_exp !== 1)
            desc += `\n+${f(mults.hacking_exp - 1)} hacking exp`;
        if (mults.strength_exp !== 1 &&
            mults.strength_exp === mults.defense_exp &&
            mults.strength_exp === mults.dexterity_exp &&
            mults.strength_exp === mults.agility_exp) {
            desc += `\n+${f(mults.strength_exp - 1)} combat exp`;
        }
        else {
            // Not all combat
            if (mults.strength_exp !== 1)
                desc += `\n+${f(mults.strength_exp - 1)} strength exp`;
            if (mults.defense_exp !== 1)
                desc += `\n+${f(mults.defense_exp - 1)} defense exp`;
            if (mults.dexterity_exp !== 1)
                desc += `\n+${f(mults.dexterity_exp - 1)} dexterity exp`;
            if (mults.agility_exp !== 1)
                desc += `\n+${f(mults.agility_exp - 1)} agility exp`;
        }
        if (mults.charisma_exp !== 1)
            desc += `\n+${f(mults.charisma_exp - 1)} charisma exp`;
    }
    if (mults.hacking_speed !== 1)
        desc += `\n+${f(mults.hacking_speed - 1)} faster hack(), grow(), and weaken()`;
    if (mults.hacking_chance !== 1)
        desc += `\n+${f(mults.hacking_chance - 1)} hack() success chance`;
    if (mults.hacking_money !== 1)
        desc += `\n+${f(mults.hacking_money - 1)} hack() power`;
    if (mults.hacking_grow !== 1)
        desc += `\n+${f(mults.hacking_grow - 1)} grow() power`;
    // Reputation
    if (mults.faction_rep !== 1 && mults.faction_rep === mults.company_rep)
        desc += `\n+${f(mults.faction_rep - 1)} reputation from factions and companies`;
    else {
        // Not all reputation
        if (mults.faction_rep !== 1)
            desc += `\n+${f(mults.faction_rep - 1)} reputation from factions`;
        if (mults.company_rep !== 1)
            desc += `\n+${f(mults.company_rep - 1)} reputation from companies`;
    }
    if (mults.crime_money !== 1)
        desc += `\n+${f(mults.crime_money - 1)} crime money`;
    if (mults.crime_success !== 1)
        desc += `\n+${f(mults.crime_success - 1)} crime success rate`;
    if (mults.work_money !== 1)
        desc += `\n+${f(mults.work_money - 1)} work money`;
    // Hacknet: costs are negative
    if (mults.hacknet_node_money !== 1)
        desc += `\n+${f(mults.hacknet_node_money - 1)} hacknet production`;
    if (mults.hacknet_node_purchase_cost !== 1) {
        desc += `\n-${f(-(mults.hacknet_node_purchase_cost - 1))} hacknet purchase cost`;
    }
    if (mults.hacknet_node_level_cost !== 1) {
        desc += `\n-${f(-(mults.hacknet_node_level_cost - 1))} hacknet level upgrade cost`;
    }
    if (mults.hacknet_node_ram_cost !== 1) {
        desc += `\n-${f(-(mults.hacknet_node_ram_cost - 1))} hacknet RAM upgrade cost`;
    }
    if (mults.hacknet_node_core_cost !== 1) {
        desc += `\n-${f(-(mults.hacknet_node_core_cost - 1))} hacknet core upgrade cost`;
    }
    // Bladeburner
    if (mults.bladeburner_max_stamina !== 1)
        desc += `\n+${f(mults.bladeburner_max_stamina - 1)} Bladeburner Max Stamina`;
    if (mults.bladeburner_stamina_gain !== 1) {
        desc += `\n+${f(mults.bladeburner_stamina_gain - 1)} Bladeburner Stamina gain`;
    }
    if (mults.bladeburner_analysis !== 1) {
        desc += `\n+${f(mults.bladeburner_analysis - 1)} Bladeburner Field Analysis effectiveness`;
    }
    if (mults.bladeburner_success_chance !== 1) {
        desc += `\n+${f(mults.bladeburner_success_chance - 1)} Bladeburner action success chance`;
    }
    if (startingMoney)
        desc += `\nStart with ${startingMoney} after installing Augmentations.`;
    if (programs)
        desc += `\nStart with ${programs.join(" and ")} after installing Augmentations.`;
    return desc;
}
class Augmentation {
    constructor(params) {
        // How much money this costs to buy before multipliers
        this.baseCost = 0;
        // How much faction reputation is required to unlock this  before multipliers
        this.baseRepRequirement = 0;
        // Any Augmentation not immediately available in BitNode-1 is special (e.g. Bladeburner augs)
        this.isSpecial = false;
        // Array of names of all prerequisites
        this.prereqs = [];
        // Multipliers given by this Augmentation.  Must match the property name in
        // The Player/Person classes
        this.mults = (0, Multipliers_1.defaultMultipliers)();
        // Factions that offer this aug.
        this.factions = [];
        this.name = params.name;
        this.info = params.info;
        this.prereqs = params.prereqs ? params.prereqs : [];
        this.baseRepRequirement = params.repCost;
        Object.freeze(this.baseRepRequirement);
        this.baseCost = params.moneyCost;
        Object.freeze(this.baseCost);
        this.factions = params.factions;
        if (params.isSpecial) {
            this.isSpecial = true;
        }
        // Set multipliers
        for (const multName of (0, Record_1.getRecordKeys)(this.mults)) {
            const mult = params[multName];
            if (mult)
                this.mults[multName] = mult;
        }
        this.startingMoney = params.startingMoney ?? 0;
        this.programs = params.programs ?? [];
        if (params.stats === undefined)
            this.stats = generateStatsDescription(this.mults, params.programs, params.startingMoney);
        else
            this.stats = params.stats;
    }
    /** Get the current level of an augmentation before buying. Currently only relevant for NFG. */
    getLevel() {
        // Only NFG currently has levels, all others will be level 0 before purchase
        if (this.name !== _enums_1.AugmentationName.NeuroFluxGovernor)
            return 0;
        // Owned NFG has the level baked in
        const ownedNFGLevel = _player_1.Player.augmentations.find((aug) => aug.name === this.name)?.level ?? 0;
        // Queued NFG is queued multiple times for each level purchased
        const queuedNFGLevel = _player_1.Player.queuedAugmentations.filter((aug) => aug.name === this.name).length;
        return ownedNFGLevel + queuedNFGLevel;
    }
    /** Get the next level of an augmentation to buy. Currently only relevant for NFG. */
    getNextLevel() {
        return this.getLevel() + 1;
    }
}
exports.Augmentation = Augmentation;
