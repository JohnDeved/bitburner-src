"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashUpgrades = void 0;
const HashUpgrade_1 = require("./HashUpgrade");
const HashUpgradesMetadata_1 = require("./data/HashUpgradesMetadata");
exports.HashUpgrades = {};
for (const metadata of HashUpgradesMetadata_1.HashUpgradesMetadata) {
    exports.HashUpgrades[metadata.name] = new HashUpgrade_1.HashUpgrade(metadata);
}
