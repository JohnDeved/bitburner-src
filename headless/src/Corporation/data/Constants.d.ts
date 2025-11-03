import type { CorpEmployeePosition, CorpIndustryName, CorpMaterialName as APIMaterialName, CorpResearchName, CorpSmartSupplyOption, CorpStateName, CorpUnlockName as APIUnlockName, CorpUpgradeName as APIUpgradeName } from "@nsdefs";
import { PositiveInteger } from "../../types";
/** Names of all corporation game states */
export declare const stateNames: CorpStateName[], 
/** Names of all corporation employee positions */
employeePositions: CorpEmployeePosition[], 
/** Names of all industries. */
industryNames: CorpIndustryName[], 
/** Names of all materials */
materialNames: APIMaterialName[], 
/** Names of all one-time corporation-wide unlocks */
unlockNames: APIUnlockName[], upgradeNames: APIUpgradeName[], 
/** Names of all researches common to all industries */
researchNamesBase: CorpResearchName[], 
/** Names of all researches only available to product industries */
researchNamesProductOnly: CorpResearchName[], 
/** Names of all researches */
researchNames: CorpResearchName[], initialShares = 1000000000, 
/** When selling large number of shares, price is dynamically updated for every batch of this amount */
sharesPerPriceUpdate = 1000000, 
/** Cooldown for issue new shares cooldown in game cycles. Initially 4 hours. */
issueNewSharesCooldown = 72000, 
/** Cooldown for selling shares in game cycles. 1 hour. */
sellSharesCooldown = 18000, teaCostPerEmployee = 500000, gameCyclesPerMarketCycle = 50, gameCyclesPerCorpStateCycle: number, secondsPerMarketCycle: number, warehouseInitialCost = 5000000000, warehouseInitialSize = 100, warehouseSizeUpgradeCostBase = 1000000000, officeInitialCost = 4000000000, officeInitialSize = 3, officeSizeUpgradeCostBase = 1000000000, bribeThreshold = 100000000000000, bribeAmountPerReputation = 1000000000, baseProductProfitMult = 5, dividendMaxRate = 1, 
/** Conversion factor for employee stats to initial salary */
employeeSalaryMultiplier = 3, marketCyclesPerEmployeeRaise = 400, employeeRaiseAmount = 50, 
/** Max products for a division without upgrades */
maxProductsBase = 3, fundingRoundShares: number[], fundingRoundMultiplier: number[], valuationLength = 10, 
/** Minimum decay value for employee morale/energy */
minEmployeeDecay = 10, 
/** smart supply options */
smartSupplyOptions: CorpSmartSupplyOption[], PurchaseMultipliers: {
    x1: PositiveInteger;
    x5: PositiveInteger;
    x10: PositiveInteger;
    x50: PositiveInteger;
    x100: PositiveInteger;
    MAX: "MAX";
};
