"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Corporation = exports.CorporationPromise = void 0;
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const CorporationState_1 = require("./CorporationState");
const CorporationUnlocks_1 = require("./data/CorporationUnlocks");
const CorporationUpgrades_1 = require("./data/CorporationUpgrades");
const corpConstants = __importStar(require("./data/Constants"));
const FundsSource_1 = require("./data/FundsSource");
const helpers_1 = require("./helpers");
const BitNodeMultipliers_1 = require("../BitNode/BitNodeMultipliers");
const LiteratureHelpers_1 = require("../Literature/LiteratureHelpers");
const DialogBox_1 = require("../ui/React/DialogBox");
const JSONReviver_1 = require("../utils/JSONReviver");
const Jsonable_1 = require("../Types/Jsonable");
const formatNumber_1 = require("../ui/formatNumber");
const types_1 = require("../types");
const Record_1 = require("../Types/Record");
const getKeyList_1 = require("../utils/helpers/getKeyList");
const TypeAssertion_1 = require("../utils/TypeAssertion");
exports.CorporationPromise = { promise: null, resolve: null };
class Corporation {
    constructor(params = {}) {
        this.name = "The Corporation";
        /** Map keyed by division name */
        this.divisions = new Jsonable_1.JSONMap();
        this.maxDivisions = 20 * BitNodeMultipliers_1.currentNodeMults.CorporationDivisions;
        //Financial stats
        this.funds = 150e9;
        this.revenue = 0;
        this.expenses = 0;
        this.fundingRound = 0;
        /** Publicly traded */
        this.public = false;
        /** Total existing shares */
        this.totalShares = corpConstants.initialShares;
        this.numShares = corpConstants.initialShares; // Total shares owned by player
        this.shareSalesUntilPriceUpdate = corpConstants.sharesPerPriceUpdate;
        this.shareSaleCooldown = 0; // Game cycles until player can sell shares again
        this.issueNewSharesCooldown = 0; // Game cycles until player can issue shares again
        this.dividendRate = 0;
        this.tributeModifier = 1 - BitNodeMultipliers_1.currentNodeMults.CorporationSoftcap + 0.15;
        this.investorShares = 0;
        this.issuedShares = 0;
        this.sharePrice = 0;
        this.storedCycles = 0;
        this.unlocks = new Jsonable_1.JSONSet();
        this.upgrades = (0, Record_1.createEnumKeyedRecord)(_enums_1.CorpUpgradeName, () => ({ level: 0, value: 1 }));
        this.previousTotalAssets = 150e9;
        this.totalAssets = 150e9;
        this.cycleValuation = 0;
        this.valuationsList = [0];
        this.valuation = 0;
        this.state = new CorporationState_1.CorporationState();
        // This is used for calculating cycle valuation.
        this.numberOfOfficesAndWarehouses = 0;
        this.name = params.name || "The Corporation";
        this.seedFunded = params.seedFunded ?? false;
        this.shareSaleCooldown = params.shareSaleCooldown ?? 0;
    }
    gainFunds(amt, source) {
        if (!isFinite(amt)) {
            console.error("Trying to add invalid amount of funds. Please report to game developer.");
            return;
        }
        if (FundsSource_1.LongTermFundsSources.has(source)) {
            // This cycle's assets include the purchase price of a capital expenditure.
            // (It will likely depreciate in the following cycle.)
            // Or the value of some non-accounted item (equity, hashes) that was sold for a capital gain.
            // (It will remain as funds, with no effect on assetDelta.)
            this.totalAssets += Math.abs(amt);
        }
        this.funds += amt;
    }
    loseFunds(amt, source) {
        return this.gainFunds(-amt, source);
    }
    getNextState() {
        return this.state.nextName;
    }
    storeCycles(numCycles) {
        this.storedCycles += numCycles;
    }
    process() {
        if (this.storedCycles < 0)
            this.storedCycles = 0;
        if (this.storedCycles >= corpConstants.gameCyclesPerCorpStateCycle) {
            const state = this.getNextState();
            const marketCycles = 1;
            const gameCycles = marketCycles * corpConstants.gameCyclesPerCorpStateCycle;
            this.storedCycles -= gameCycles;
            // Can't combine these loops, imports must be completely cleared before
            // we start processing exports of any division.
            for (const ind of this.divisions.values()) {
                ind.resetImports(state);
            }
            for (const ind of this.divisions.values()) {
                ind.process(marketCycles, this);
            }
            // Process cooldowns
            if (this.shareSaleCooldown > 0) {
                this.shareSaleCooldown -= gameCycles;
            }
            if (this.issueNewSharesCooldown > 0) {
                this.issueNewSharesCooldown -= gameCycles;
            }
            //At the start of a new cycle, calculate profits from previous cycle
            if (state === "START") {
                this.revenue = 0;
                this.expenses = 0;
                this.divisions.forEach((ind) => {
                    if (ind.lastCycleRevenue === -Infinity || ind.lastCycleRevenue === Infinity) {
                        return;
                    }
                    if (ind.lastCycleExpenses === -Infinity || ind.lastCycleExpenses === Infinity) {
                        return;
                    }
                    this.revenue = this.revenue + ind.lastCycleRevenue;
                    this.expenses = this.expenses + ind.lastCycleExpenses;
                });
                if (isNaN(this.funds) || this.funds === Infinity || this.funds === -Infinity) {
                    (0, DialogBox_1.dialogBoxCreate)("There was an error calculating your Corporations funds and they got reset to 0. " +
                        "This is a bug. Please report to game developer.\n\n" +
                        "(Your funds have been set to $150b for the inconvenience)");
                    this.funds = 150e9;
                }
                const cycleRevenue = this.revenue * (marketCycles * corpConstants.secondsPerMarketCycle);
                const cycleExpenses = this.expenses * (marketCycles * corpConstants.secondsPerMarketCycle);
                const cycleProfit = cycleRevenue - cycleExpenses;
                this.gainFunds(cycleRevenue, "operating revenue");
                this.loseFunds(cycleExpenses, "operating expenses");
                if (this.dividendRate > 0 && cycleProfit > 0) {
                    // Validate input again, just to be safe
                    if (isNaN(this.dividendRate) || this.dividendRate < 0 || this.dividendRate > corpConstants.dividendMaxRate) {
                        console.error(`Invalid Corporation dividend rate: ${this.dividendRate}`);
                    }
                    else {
                        const totalDividends = this.dividendRate * cycleProfit;
                        _player_1.Player.gainMoney(this.getCycleDividends(), "corporation");
                        this.loseFunds(totalDividends, "dividends");
                    }
                }
                this.updateTotalAssets();
                this.cycleValuation = this.determineCycleValuation();
                this.determineValuation();
                this.updateSharePrice();
            }
            this.state.incrementState();
            // Handle "nextUpdate" resolver after this update
            if (exports.CorporationPromise.resolve) {
                exports.CorporationPromise.resolve(state);
                exports.CorporationPromise.resolve = null;
                exports.CorporationPromise.promise = null;
            }
        }
    }
    getCycleDividends() {
        const profit = this.revenue - this.expenses;
        const cycleProfit = profit * corpConstants.secondsPerMarketCycle;
        const totalDividends = this.dividendRate * cycleProfit;
        const dividendsPerShare = totalDividends / this.totalShares;
        const dividends = this.numShares * dividendsPerShare;
        return Math.pow(dividends, 1 - this.tributeModifier);
    }
    determineCycleValuation() {
        let val, assetDelta = (this.totalAssets - this.previousTotalAssets) / corpConstants.secondsPerMarketCycle;
        // Handle pre-totalAssets saves
        assetDelta ?? (assetDelta = this.revenue - this.expenses);
        if (this.public) {
            // Account for dividends
            if (this.dividendRate > 0) {
                assetDelta *= 1 - this.dividendRate;
            }
            val = this.funds + assetDelta * 85e3;
            // Math.pow(1.1, 1 / 12) = 1.0079741404289038
            val *= Math.pow(1.0079741404289038, this.numberOfOfficesAndWarehouses);
            val = Math.max(val, 0);
        }
        else {
            val = 10e9 + this.funds / 3;
            if (assetDelta > 0) {
                val += assetDelta * 315e3;
            }
            // Math.pow(1.1, 1 / 12) = 1.0079741404289038
            val *= Math.pow(1.0079741404289038, this.numberOfOfficesAndWarehouses);
            val -= val % 1e6; //Round down to nearest million
        }
        if (val < 10e9)
            val = 10e9; // Base valuation
        return val * BitNodeMultipliers_1.currentNodeMults.CorporationValuation;
    }
    determineValuation() {
        this.valuationsList.push(this.cycleValuation); //Add current valuation to the list
        if (this.valuationsList.length > corpConstants.valuationLength)
            this.valuationsList.shift();
        let val = this.valuationsList.reduce((a, b) => a + b); //Calculate valuations sum
        val /= this.valuationsList.length; //Calculate the average
        this.valuation = val;
    }
    updateTotalAssets() {
        let assets = this.funds;
        this.divisions.forEach((ind) => {
            assets += ind.calculateRecoupableValue();
            for (const warehouse of (0, Record_1.getRecordValues)(ind.warehouses)) {
                for (const mat of (0, Record_1.getRecordValues)(warehouse.materials)) {
                    assets += mat.stored * mat.averagePrice;
                }
                for (const prod of ind.products.values()) {
                    assets += prod.cityData[warehouse.city].stored * prod.cityData[warehouse.city].productionCost;
                }
            }
        });
        this.previousTotalAssets = this.totalAssets;
        this.totalAssets = assets;
    }
    getTargetSharePrice(ceoOwnership = null) {
        // Share price is proportional to total corporation valuation.
        // When the CEO owns 0% of the company, market cap is 0.5x valuation.
        // When the CEO owns 25% of the company, market cap is 1.0x valuation.
        // When the CEO owns 100% of shares, market cap is 1.5x valuation.
        if (ceoOwnership === null) {
            ceoOwnership = this.numShares / this.totalShares;
        }
        const ceoConfidence = 0.5 + Math.sqrt(Math.max(0, ceoOwnership));
        const marketCap = this.valuation * ceoConfidence;
        return marketCap / this.totalShares;
    }
    updateSharePrice() {
        const targetPrice = this.getTargetSharePrice();
        if (this.sharePrice <= targetPrice) {
            this.sharePrice *= 1 + Math.random() * 0.01;
        }
        else {
            this.sharePrice *= 1 - Math.random() * 0.01;
        }
        if (this.sharePrice <= 0.01) {
            this.sharePrice = 0.01;
        }
    }
    calculateMaxNewShares() {
        const maxNewSharesUnrounded = Math.round(this.totalShares * 0.2);
        const maxNewShares = maxNewSharesUnrounded - (maxNewSharesUnrounded % 10e6);
        return maxNewShares;
    }
    // Calculates how much money will be made and what the resulting stock price
    // will be when the player sells their shares
    // @return - [Player profit, final stock price, end shareSalesUntilPriceUpdate property]
    calculateShareSale(numShares) {
        let sharesRemaining = numShares;
        let sharesUntilUpdate = this.shareSalesUntilPriceUpdate;
        let sharePrice = this.sharePrice;
        let sharesSold = 0;
        let profit = 0;
        const sharesPerStep = Math.sign(numShares || 1) * corpConstants.sharesPerPriceUpdate;
        const maxIterations = Math.ceil(numShares / sharesPerStep);
        if (isNaN(maxIterations) || maxIterations > 10e6) {
            console.error(`Something went wrong or unexpected when calculating share sale. Max iterations calculated to be ${maxIterations}`);
            return [0, 0, 0];
        }
        for (let i = 0; i < maxIterations; ++i) {
            if (Math.abs(sharesRemaining) < Math.abs(sharesUntilUpdate)) {
                profit += sharePrice * sharesRemaining;
                sharesUntilUpdate -= sharesRemaining;
                break;
            }
            else {
                profit += sharePrice * sharesPerStep;
                sharesRemaining -= sharesPerStep;
                sharesSold += sharesPerStep;
                // Update the share price
                const ceoOwnership = (this.numShares - sharesSold) / this.totalShares;
                const targetPrice = this.getTargetSharePrice(ceoOwnership);
                if (sharePrice <= targetPrice) {
                    sharePrice *= 1 + 0.5 * 0.01;
                }
                else {
                    sharePrice *= 1 - 0.5 * 0.01;
                }
                sharesUntilUpdate = corpConstants.sharesPerPriceUpdate;
            }
        }
        return [profit, sharePrice, sharesUntilUpdate];
    }
    calculateShareBuyback(numShares) {
        const [profit, sharePrice, sharesUntilUpdate] = this.calculateShareSale(-numShares);
        const cost = -1.1 * profit;
        return [cost, sharePrice, sharesUntilUpdate];
    }
    getInvestmentOffer() {
        if (this.fundingRound >= corpConstants.fundingRoundShares.length ||
            this.fundingRound >= corpConstants.fundingRoundMultiplier.length ||
            this.public)
            return {
                funds: 0,
                shares: 0,
                round: this.fundingRound + 1, // Make more readable
            }; // Don't throw an error here, no reason to have a second function to check if you can get investment.
        const val = this.valuation;
        const percShares = corpConstants.fundingRoundShares[this.fundingRound];
        const roundMultiplier = corpConstants.fundingRoundMultiplier[this.fundingRound];
        const funding = val * percShares * roundMultiplier;
        const investShares = Math.floor(corpConstants.initialShares * percShares);
        return {
            funds: funding,
            shares: investShares,
            round: this.fundingRound + 1, // Make more readable
        };
    }
    convertCooldownToString(cd) {
        // The cooldown value is based on game cycles. Convert to a simple string
        const seconds = cd / 5;
        const SecondsPerMinute = 60;
        const SecondsPerHour = 3600;
        if (seconds > SecondsPerHour) {
            return `${Math.floor(seconds / SecondsPerHour)} hour(s)`;
        }
        else if (seconds > SecondsPerMinute) {
            return `${Math.floor(seconds / SecondsPerMinute)} minute(s)`;
        }
        else {
            return `${Math.floor(seconds)} second(s)`;
        }
    }
    /**
     * Purchasing a one-time unlock
     */
    purchaseUnlock(unlockName) {
        if (this.unlocks.has(unlockName)) {
            return {
                success: false,
                message: `${unlockName} has already been unlocked.`,
            };
        }
        const price = CorporationUnlocks_1.CorpUnlocks[unlockName].price;
        if (this.funds < price) {
            return {
                success: false,
                message: `Insufficient funds to purchase ${unlockName}, requires ${(0, formatNumber_1.formatMoney)(price)}.`,
            };
        }
        this.loseFunds(price, "upgrades");
        this.unlocks.add(unlockName);
        // Apply effects for one-time unlocks
        if (unlockName === _enums_1.CorpUnlockName.ShadyAccounting) {
            this.tributeModifier -= 0.05;
        }
        if (unlockName === _enums_1.CorpUnlockName.GovernmentPartnership) {
            this.tributeModifier -= 0.1;
        }
        return {
            success: true,
        };
    }
    /**
     * Purchasing a levelable upgrade
     */
    purchaseUpgrade(upgradeName, amount = 1) {
        if (!(0, types_1.isPositiveInteger)(amount)) {
            return {
                success: false,
                message: `Number of upgrade levels purchased must be a positive integer (attempted: ${amount}).`,
            };
        }
        const upgrade = CorporationUpgrades_1.CorpUpgrades[upgradeName];
        const totalCost = (0, helpers_1.calculateUpgradeCost)(upgrade.basePrice, upgrade.priceMult, this.upgrades[upgradeName].level, amount);
        if (this.funds < totalCost) {
            return {
                success: false,
                message: `Not enough funds to purchase ${amount} of upgrade ${upgradeName}.`,
            };
        }
        this.loseFunds(totalCost, "upgrades");
        this.upgrades[upgradeName].level += amount;
        this.upgrades[upgradeName].value += upgrade.benefit * amount;
        // Apply effects for upgrades
        if (upgradeName === _enums_1.CorpUpgradeName.SmartStorage) {
            for (const division of this.divisions.values()) {
                for (const warehouse of (0, Record_1.getRecordValues)(division.warehouses)) {
                    warehouse.updateSize(this, division);
                }
            }
        }
        return {
            success: true,
        };
    }
    getProductionMultiplier() {
        return this.upgrades[_enums_1.CorpUpgradeName.SmartFactories].value;
    }
    getStorageMultiplier() {
        return this.upgrades[_enums_1.CorpUpgradeName.SmartStorage].value;
    }
    getAdvertisingMultiplier() {
        return this.upgrades[_enums_1.CorpUpgradeName.WilsonAnalytics].value;
    }
    getEmployeeCreMultiplier() {
        return this.upgrades[_enums_1.CorpUpgradeName.NuoptimalNootropicInjectorImplants].value;
    }
    getEmployeeChaMult() {
        return this.upgrades[_enums_1.CorpUpgradeName.SpeechProcessorImplants].value;
    }
    getEmployeeIntMult() {
        return this.upgrades[_enums_1.CorpUpgradeName.NeuralAccelerators].value;
    }
    getEmployeeEffMult() {
        return this.upgrades[_enums_1.CorpUpgradeName.FocusWires].value;
    }
    getSalesMult() {
        return this.upgrades[_enums_1.CorpUpgradeName.ABCSalesBots].value;
    }
    getScientificResearchMult() {
        return this.upgrades[_enums_1.CorpUpgradeName.ProjectInsight].value;
    }
    // Adds the Corporation Handbook (Starter Guide) to the player's home computer.
    // This is a lit file that gives introductory info to the player
    // This occurs when the player clicks the "Getting Started Guide" button on the overview panel
    getStarterGuide() {
        // Check if player already has Corporation Handbook
        const homeComp = _player_1.Player.getHomeComputer();
        const handbook = _enums_1.LiteratureName.CorporationManagementHandbook;
        if (!homeComp.messages.includes(handbook))
            homeComp.messages.push(handbook);
        (0, LiteratureHelpers_1.showLiterature)(handbook);
        return;
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("Corporation", this, Corporation.includedProperties);
    }
    /** Initializes a Corporation object from a JSON save state. */
    static fromJSON(value) {
        const corporation = (0, JSONReviver_1.Generic_fromJSON)(Corporation, value.data, Corporation.includedProperties);
        // numberOfOfficesAndWarehouses is not in the included properties and must be calculated
        for (const division of corporation.divisions.values()) {
            corporation.numberOfOfficesAndWarehouses += (0, Record_1.getRecordValues)(division.offices).length;
            corporation.numberOfOfficesAndWarehouses += (0, Record_1.getRecordValues)(division.warehouses).length;
        }
        // tributeModifier is divisionTax in pre-v3.0.0.
        (0, TypeAssertion_1.assertObject)(value.data);
        if (typeof value.data.dividendTax === "number") {
            corporation.tributeModifier = value.data.dividendTax;
        }
        return corporation;
    }
}
exports.Corporation = Corporation;
// Exclude numberOfOfficesAndWarehouses
Corporation.includedProperties = (0, getKeyList_1.getKeyList)(Corporation, { removedKeys: ["numberOfOfficesAndWarehouses"] });
JSONReviver_1.constructorsForReviver.Corporation = Corporation;
