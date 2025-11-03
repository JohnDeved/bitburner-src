"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseMultipliers = exports.smartSupplyOptions = exports.minEmployeeDecay = exports.valuationLength = exports.fundingRoundMultiplier = exports.fundingRoundShares = exports.maxProductsBase = exports.employeeRaiseAmount = exports.marketCyclesPerEmployeeRaise = exports.employeeSalaryMultiplier = exports.dividendMaxRate = exports.baseProductProfitMult = exports.bribeAmountPerReputation = exports.bribeThreshold = exports.officeSizeUpgradeCostBase = exports.officeInitialSize = exports.officeInitialCost = exports.warehouseSizeUpgradeCostBase = exports.warehouseInitialSize = exports.warehouseInitialCost = exports.secondsPerMarketCycle = exports.gameCyclesPerCorpStateCycle = exports.gameCyclesPerMarketCycle = exports.teaCostPerEmployee = exports.sellSharesCooldown = exports.issueNewSharesCooldown = exports.sharesPerPriceUpdate = exports.initialShares = exports.researchNames = exports.researchNamesProductOnly = exports.researchNamesBase = exports.upgradeNames = exports.unlockNames = exports.materialNames = exports.industryNames = exports.employeePositions = exports.stateNames = void 0;
const Constants_1 = require("../../Constants");
const _enums_1 = require("@enums");
/** Names of all corporation game states */
exports.stateNames = ["START", "PURCHASE", "PRODUCTION", "EXPORT", "SALE"], 
// TODO: remove IndustryType and EmployeePositions enums and just use the typed strings.
/** Names of all corporation employee positions */
exports.employeePositions = Object.values(_enums_1.CorpEmployeeJob), 
/** Names of all industries. */
exports.industryNames = Object.values(_enums_1.IndustryType), 
/** Names of all materials */
exports.materialNames = Object.values(_enums_1.CorpMaterialName), 
/** Names of all one-time corporation-wide unlocks */
exports.unlockNames = Object.values(_enums_1.CorpUnlockName), exports.upgradeNames = Object.values(_enums_1.CorpUpgradeName), 
/** Names of all researches common to all industries */
exports.researchNamesBase = Object.values(_enums_1.CorpBaseResearchName), 
/** Names of all researches only available to product industries */
exports.researchNamesProductOnly = Object.values(_enums_1.CorpProductResearchName), 
/** Names of all researches */
exports.researchNames = [...exports.researchNamesBase, ...exports.researchNamesProductOnly], exports.initialShares = 1e9, 
/** When selling large number of shares, price is dynamically updated for every batch of this amount */
exports.sharesPerPriceUpdate = 1e6, 
/** Cooldown for issue new shares cooldown in game cycles. Initially 4 hours. */
exports.issueNewSharesCooldown = 72e3, 
/** Cooldown for selling shares in game cycles. 1 hour. */
exports.sellSharesCooldown = 18e3, exports.teaCostPerEmployee = 500e3, exports.gameCyclesPerMarketCycle = 50, exports.gameCyclesPerCorpStateCycle = exports.gameCyclesPerMarketCycle / exports.stateNames.length, exports.secondsPerMarketCycle = (exports.gameCyclesPerMarketCycle * Constants_1.CONSTANTS.MilliPerCycle) / 1000, exports.warehouseInitialCost = 5e9, exports.warehouseInitialSize = 100, exports.warehouseSizeUpgradeCostBase = 1e9, exports.officeInitialCost = 4e9, exports.officeInitialSize = 3, exports.officeSizeUpgradeCostBase = 1e9, exports.bribeThreshold = 100e12, exports.bribeAmountPerReputation = 1e9, exports.baseProductProfitMult = 5, exports.dividendMaxRate = 1, 
/** Conversion factor for employee stats to initial salary */
exports.employeeSalaryMultiplier = 3, exports.marketCyclesPerEmployeeRaise = 400, exports.employeeRaiseAmount = 50, 
/** Max products for a division without upgrades */
exports.maxProductsBase = 3, exports.fundingRoundShares = [0.1, 0.35, 0.25, 0.2], exports.fundingRoundMultiplier = [3, 2, 2, 1.5], exports.valuationLength = 10, 
/** Minimum decay value for employee morale/energy */
exports.minEmployeeDecay = 10, 
/** smart supply options */
exports.smartSupplyOptions = Object.values(_enums_1.SmartSupplyOption), exports.PurchaseMultipliers = {
    x1: 1,
    x5: 5,
    x10: 10,
    x50: 50,
    x100: 100,
    MAX: "MAX",
};
