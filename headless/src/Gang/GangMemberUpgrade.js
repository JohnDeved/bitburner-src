"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GangMemberUpgrade = void 0;
const upgrades_1 = require("./data/upgrades");
const formatNumber_1 = require("../ui/formatNumber");
class GangMemberUpgrade {
    constructor(name = "", cost = 0, type = upgrades_1.UpgradeType.Weapon, mults = {}) {
        this.name = name;
        this.cost = cost;
        this.type = type;
        this.mults = mults;
        // No initialization because it depend on number formatter config
        this.desc = "";
        formatNumber_1.FormatsHaveChanged.subscribe(() => (this.desc = this.createDescription()));
    }
    createDescription() {
        const lines = ["Effects:"];
        if (this.mults.str != null) {
            lines.push(`+${(0, formatNumber_1.formatPercent)(this.mults.str - 1, 0)} strength skill`);
            lines.push(`+${(0, formatNumber_1.formatPercent)((this.mults.str - 1) / 4, 2)} strength exp`);
        }
        if (this.mults.def != null) {
            lines.push(`+${(0, formatNumber_1.formatPercent)(this.mults.def - 1, 0)} defense skill`);
            lines.push(`+${(0, formatNumber_1.formatPercent)((this.mults.def - 1) / 4, 2)} defense exp`);
        }
        if (this.mults.dex != null) {
            lines.push(`+${(0, formatNumber_1.formatPercent)(this.mults.dex - 1, 0)} dexterity skill`);
            lines.push(`+${(0, formatNumber_1.formatPercent)((this.mults.dex - 1) / 4, 2)} dexterity exp`);
        }
        if (this.mults.agi != null) {
            lines.push(`+${(0, formatNumber_1.formatPercent)(this.mults.agi - 1, 0)} agility skill`);
            lines.push(`+${(0, formatNumber_1.formatPercent)((this.mults.agi - 1) / 4, 2)} agility exp`);
        }
        if (this.mults.cha != null) {
            lines.push(`+${(0, formatNumber_1.formatPercent)(this.mults.cha - 1, 0)} charisma skill`);
            lines.push(`+${(0, formatNumber_1.formatPercent)((this.mults.cha - 1) / 4, 2)} charisma exp`);
        }
        if (this.mults.hack != null) {
            lines.push(`+${(0, formatNumber_1.formatPercent)(this.mults.hack - 1, 0)} hacking skill`);
            lines.push(`+${(0, formatNumber_1.formatPercent)((this.mults.hack - 1) / 4, 2)} hacking exp`);
        }
        return lines.join("<br>");
    }
    // User friendly version of type.
    getType() {
        switch (this.type) {
            case upgrades_1.UpgradeType.Weapon:
                return "Weapon";
            case upgrades_1.UpgradeType.Armor:
                return "Armor";
            case upgrades_1.UpgradeType.Vehicle:
                return "Vehicle";
            case upgrades_1.UpgradeType.Rootkit:
                return "Rootkit";
            case upgrades_1.UpgradeType.Augmentation:
                return "Augmentation";
            default:
                return "";
        }
    }
}
exports.GangMemberUpgrade = GangMemberUpgrade;
