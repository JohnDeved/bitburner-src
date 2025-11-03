"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GangMemberUpgrades = void 0;
const upgrades_1 = require("./data/upgrades");
const GangMemberUpgrade_1 = require("./GangMemberUpgrade");
exports.GangMemberUpgrades = {};
(function () {
    upgrades_1.gangMemberUpgradesMetadata.forEach((e) => {
        exports.GangMemberUpgrades[e.name] = new GangMemberUpgrade_1.GangMemberUpgrade(e.name, e.cost, e.upgType, e.mults);
    });
})();
