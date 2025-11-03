"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAccessCorporation = canAccessCorporation;
exports.startCorporation = startCorporation;
const _enums_1 = require("@enums");
const IndustryData_1 = require("../../Corporation/data/IndustryData");
const Corporation_1 = require("../../Corporation/Corporation");
const BitNodeUtils_1 = require("../../BitNode/BitNodeUtils");
function canAccessCorporation() {
    return (0, BitNodeUtils_1.canAccessBitNodeFeature)(3) && !this.bitNodeOptions.disableCorporation;
}
function startCorporation(corpName, seedFunded) {
    this.corporation = new Corporation_1.Corporation({
        name: corpName,
        seedFunded: seedFunded,
        shareSaleCooldown: this.corporation?.shareSaleCooldown,
    });
    //reset the research tree in case the corporation was restarted
    (0, IndustryData_1.resetIndustryResearchTrees)();
    if (this.bitNodeN === 3 || this.activeSourceFileLvl(3) === 3) {
        this.corporation.unlocks.add(_enums_1.CorpUnlockName.WarehouseAPI);
        this.corporation.unlocks.add(_enums_1.CorpUnlockName.OfficeAPI);
    }
    if (seedFunded) {
        this.corporation.investorShares += 500e6;
        this.corporation.totalShares += 500e6;
    }
}
