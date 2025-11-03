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
exports.Division = void 0;
const _enums_1 = require("@enums");
const JSONReviver_1 = require("../utils/JSONReviver");
const IndustryData_1 = require("./data/IndustryData");
const corpConstants = __importStar(require("./data/Constants"));
const getRandomIntInclusive_1 = require("../utils/helpers/getRandomIntInclusive");
const calculateEffectWithFactors_1 = require("../utils/calculateEffectWithFactors");
const OfficeSpace_1 = require("./OfficeSpace");
const DialogBox_1 = require("../ui/React/DialogBox");
const MaterialInfo_1 = require("./MaterialInfo");
const Warehouse_1 = require("./Warehouse");
const Jsonable_1 = require("../Types/Jsonable");
const Record_1 = require("../Types/Record");
const Material_1 = require("./Material");
const getKeyList_1 = require("../utils/helpers/getKeyList");
const helpers_1 = require("./helpers");
const exceptionAlert_1 = require("../utils/helpers/exceptionAlert");
const throwIfReachable_1 = require("../utils/helpers/throwIfReachable");
const TypeAssertion_1 = require("../utils/TypeAssertion");
class Division {
    get maxProducts() {
        if (!this.makesProducts)
            return 0;
        // Calculate additional number of allowed Products from Research/Upgrades
        let additional = 0;
        if (this.hasResearch("uPgrade: Capacity.I"))
            ++additional;
        if (this.hasResearch("uPgrade: Capacity.II"))
            ++additional;
        return corpConstants.maxProductsBase + additional;
    }
    constructor(params = null) {
        this.name = "DefaultDivisionName";
        this.industry = _enums_1.IndustryType.Agriculture;
        this.researchPoints = 0;
        this.researched = new Jsonable_1.JSONSet();
        this.requiredMaterials = {};
        // Not included in save file. Just used for tracking whether research tree has been updated since game load.
        this.treeInitialized = false;
        /** An array of the name of materials being produced */
        this.producedMaterials = [];
        this.products = new Jsonable_1.JSONMap();
        this.makesProducts = false;
        this.awareness = 0;
        this.popularity = 0;
        this.startingCost = 0;
        /* The following are factors for how much production/other things are increased by
             different factors. The production increase always has diminishing returns,
             and they are all represented by exponentials of < 1 (e.g x ^ 0.5, x ^ 0.8)
             The number for these represent the exponential. A lower number means more
             diminishing returns */
        this.realEstateFactor = 0;
        this.researchFactor = 0;
        this.hardwareFactor = 0;
        this.robotFactor = 0;
        this.aiCoreFactor = 0;
        this.advertisingFactor = 0;
        this.productionMult = 1; //Production multiplier
        //Financials
        this.lastCycleRevenue = 0;
        this.lastCycleExpenses = 0;
        this.thisCycleRevenue = 0;
        this.thisCycleExpenses = 0;
        this.newInd = true;
        // Sector 12 office and warehouse are added by default, these entries are added in the constructor.
        this.warehouses = {};
        this.offices = {};
        this.numAdVerts = 0;
        if (!params)
            return;
        // Must be initialized inside the constructor because it references the industry
        this.industry = params.industry;
        this.name = params.name;
        // Add default starting
        this.warehouses[_enums_1.CityName.Sector12] = new Warehouse_1.Warehouse({
            loc: _enums_1.CityName.Sector12,
            division: this,
            size: corpConstants.warehouseInitialSize,
        });
        this.offices[_enums_1.CityName.Sector12] = new OfficeSpace_1.OfficeSpace({
            city: _enums_1.CityName.Sector12,
            size: corpConstants.officeInitialSize,
        });
        // Loading data based on this division's industry type
        const data = IndustryData_1.IndustriesData[this.industry];
        this.startingCost = data.startingCost;
        this.makesProducts = data.makesProducts;
        this.realEstateFactor = data.realEstateFactor ?? 0;
        this.researchFactor = data.scienceFactor ?? 0;
        this.hardwareFactor = data.hardwareFactor ?? 0;
        this.robotFactor = data.robotFactor ?? 0;
        this.aiCoreFactor = data.aiCoreFactor ?? 0;
        this.advertisingFactor = data.advertisingFactor ?? 0;
        this.requiredMaterials = data.requiredMaterials;
        this.producedMaterials = data.producedMaterials ?? [];
    }
    hasMaximumNumberProducts() {
        return this.products.size >= this.maxProducts;
    }
    //Calculates the values that factor into the production and properties of
    //materials/products (such as quality, etc.)
    calculateProductionFactors() {
        let multSum = 0;
        for (const warehouse of (0, Record_1.getRecordValues)(this.warehouses)) {
            const materials = warehouse.materials;
            const cityMult = Math.pow(0.002 * materials["Real Estate"].stored + 1, this.realEstateFactor) *
                Math.pow(0.002 * materials.Hardware.stored + 1, this.hardwareFactor) *
                Math.pow(0.002 * materials.Robots.stored + 1, this.robotFactor) *
                Math.pow(0.002 * materials["AI Cores"].stored + 1, this.aiCoreFactor);
            multSum += Math.pow(cityMult, 0.73);
        }
        multSum < 1 ? (this.productionMult = 1) : (this.productionMult = multSum);
    }
    calculateRecoupableValue() {
        let price = this.startingCost;
        for (const city of (0, Record_1.getRecordKeys)(this.offices)) {
            if (city === _enums_1.CityName.Sector12)
                continue;
            price += corpConstants.officeInitialCost;
            if (this.warehouses[city])
                price += corpConstants.warehouseInitialCost;
        }
        price /= 2;
        return price;
    }
    updateWarehouseSizeUsed(warehouse) {
        warehouse.updateMaterialSizeUsed();
        for (const prod of this.products.values()) {
            warehouse.sizeUsed += prod.cityData[warehouse.city].stored * prod.size;
        }
    }
    process(marketCycles = 1, corporation) {
        const state = corporation.state.nextName;
        //At the start of a cycle, store and reset revenue/expenses
        //Then calculate salaries and process the markets
        if (state === "START") {
            if (isNaN(this.thisCycleRevenue) || isNaN(this.thisCycleExpenses)) {
                (0, exceptionAlert_1.exceptionAlert)(new Error(`Invalid revenue/expenses. thisCycleRevenue: ${this.thisCycleRevenue}. thisCycleExpenses: ${this.thisCycleExpenses}`), true);
                this.thisCycleRevenue = 0;
                this.thisCycleExpenses = 0;
            }
            this.lastCycleRevenue = this.thisCycleRevenue / (marketCycles * corpConstants.secondsPerMarketCycle);
            this.lastCycleExpenses = this.thisCycleExpenses / (marketCycles * corpConstants.secondsPerMarketCycle);
            this.thisCycleRevenue = 0;
            this.thisCycleExpenses = 0;
            // Once you start making revenue, the player should no longer be
            // considered new, and therefore no longer needs the 'tutorial' UI elements
            if (this.lastCycleRevenue > 0) {
                this.newInd = false;
            }
            // Process offices (and the employees in them)
            let employeeSalary = 0;
            for (const officeLoc of Object.values(_enums_1.CityName)) {
                const office = this.offices[officeLoc];
                if (office)
                    employeeSalary += office.process(marketCycles, corporation, this);
            }
            this.thisCycleExpenses = this.thisCycleExpenses + employeeSalary;
            // Process change in demand/competition of materials/products
            this.processMaterialMarket();
            this.processProductMarket(marketCycles);
            // Process loss of popularity
            this.popularity -= marketCycles * 0.0001;
            this.popularity = Math.max(0, this.popularity);
            return;
        }
        // Process production, purchase, and import/export of materials
        let res = this.processMaterials(marketCycles, corporation);
        if (Array.isArray(res)) {
            this.thisCycleRevenue = this.thisCycleRevenue + res[0];
            this.thisCycleExpenses = this.thisCycleExpenses + res[1];
        }
        // Process creation, production & sale of products
        res = this.processProducts(marketCycles, corporation);
        if (Array.isArray(res)) {
            this.thisCycleRevenue = this.thisCycleRevenue + res[0];
            this.thisCycleExpenses = this.thisCycleExpenses + res[1];
        }
    }
    // Process change in demand and competition for this industry's materials
    processMaterialMarket() {
        //References to prodMats and reqMats
        const reqMats = this.requiredMaterials, prodMats = this.producedMaterials;
        //Only 'process the market' for materials that this industry deals with
        for (const city of Object.values(_enums_1.CityName)) {
            //If this industry has a warehouse in this city, process the market
            //for every material this industry requires or produces
            if (this.warehouses[city]) {
                const wh = this.warehouses[city];
                for (const name of Object.keys(reqMats)) {
                    if (Object.hasOwn(reqMats, name)) {
                        wh.materials[name].processMarket();
                    }
                }
                //Produced materials are stored in an array
                for (const matName of prodMats)
                    wh.materials[matName].processMarket();
                //Process these twice because these boost production ??????
                wh.materials.Hardware.processMarket();
                wh.materials.Robots.processMarket();
                wh.materials["AI Cores"].processMarket();
                wh.materials["Real Estate"].processMarket();
            }
        }
    }
    // Process change in demand and competition for this industry's products
    processProductMarket(marketCycles = 1) {
        // Demand gradually decreases, and competition gradually increases
        for (const product of this.products.values()) {
            let change = (0, getRandomIntInclusive_1.getRandomIntInclusive)(0, 3) * 0.0004;
            if (change === 0)
                continue;
            if (this.industry === _enums_1.IndustryType.Pharmaceutical ||
                this.industry === _enums_1.IndustryType.Software ||
                this.industry === _enums_1.IndustryType.Robotics) {
                change *= 3;
            }
            change *= marketCycles;
            product.demand -= change;
            product.competition += change;
            product.competition = Math.min(product.competition, 99.99);
            product.demand = Math.max(product.demand, 0.001);
        }
    }
    processSaleState(marketCycles, item, corporation, office, warehouse) {
        let revenue = 0;
        const city = office.city;
        const isMaterial = item instanceof Material_1.Material;
        if (isMaterial) {
            if ((typeof item.desiredSellPrice === "number" && item.desiredSellPrice < 0) || item.desiredSellAmount === 0) {
                item.actualSellAmount = 0;
                return 0;
            }
        }
        else {
            item.cityData[city].productionCost = 0;
            for (const [reqMatName, reqQty] of (0, Record_1.getRecordEntries)(item.requiredMaterials)) {
                item.cityData[city].productionCost += reqQty * warehouse.materials[reqMatName].marketPrice;
            }
            // With products, the production cost is increased for labor
            item.cityData[city].productionCost *= corpConstants.baseProductProfitMult;
        }
        let stored;
        let desiredSellAmount;
        let desiredSellPrice;
        let productionAmount;
        let name;
        let marketTa1;
        let marketTa2;
        let marketPrice;
        let markupLimit;
        let qualityAndEffectiveRatingFactor;
        if (isMaterial) {
            stored = item.stored;
            desiredSellAmount = item.desiredSellAmount;
            desiredSellPrice = item.desiredSellPrice;
            productionAmount = item.productionAmount;
            name = item.name;
            marketTa1 = item.marketTa1;
            marketTa2 = item.marketTa2;
            marketPrice = item.marketPrice;
            markupLimit = item.getMarkupLimit();
            qualityAndEffectiveRatingFactor = item.quality + 0.001;
        }
        else {
            stored = item.cityData[city].stored;
            desiredSellAmount = item.cityData[city].desiredSellAmount;
            desiredSellPrice = item.cityData[city].desiredSellPrice;
            productionAmount = item.cityData[city].productionAmount;
            name = item.name;
            marketTa1 = item.marketTa1;
            marketTa2 = item.marketTa2;
            marketPrice = item.cityData[city].productionCost;
            if (item.markup === 0) {
                (0, exceptionAlert_1.exceptionAlert)(new Error(`Markup of product ${item.name} is 0`));
                item.markup = 1;
            }
            markupLimit = Math.max(item.cityData[city].effectiveRating, 0.001) / item.markup;
            qualityAndEffectiveRatingFactor = 0.5 * Math.pow(item.cityData[city].effectiveRating, 0.65);
        }
        // Sale multipliers
        const businessFactor = this.getBusinessFactor(office); // Business employee productivity
        const advertisingFactor = this.getAdvertisingFactors()[0]; // Awareness + popularity
        const marketFactor = this.getMarketFactor(item); // Competition + demand
        // Parse player sell-amount input (needed for TA.II and selling)
        let sellAmt;
        // The amount gets re-multiplied later, so this is the correct
        // amount to calculate with for "MAX".
        const adjustedQty = stored / (corpConstants.secondsPerMarketCycle * marketCycles);
        /**
         * desiredSellAmount is usually a string, but it also can be a number in old versions. eval requires a
         * string, so we convert it to a string here, replace placeholders, and then pass it to eval.
         */
        let temp = String(desiredSellAmount);
        temp = temp.replace(/MAX/g, adjustedQty.toString());
        temp = temp.replace(/PROD/g, productionAmount.toString());
        temp = temp.replace(/INV/g, stored.toString());
        try {
            // Typecasting here is fine. We will validate the result immediately after this line.
            sellAmt = eval?.(temp);
            if (typeof sellAmt !== "number" || !Number.isFinite(sellAmt)) {
                throw new Error(`Evaluated value is not a valid number: ${sellAmt}`);
            }
        }
        catch (error) {
            (0, DialogBox_1.dialogBoxCreate)(`Error evaluating your sell amount for ${name} in ${this.name}'s ${city} office. Error: ${error}.`);
            return 0;
        }
        // sellAmt must be a non-negative number.
        if (sellAmt < 0) {
            sellAmt = 0;
        }
        // Calculate Sale Cost (sCost), which could be dynamically evaluated
        let sCost;
        if (marketTa2) {
            // Reverse engineer the 'maxSell' formula
            // 1. Set 'maxSell' = sellAmt
            // 2. Substitute formula for 'markup'
            // 3. Solve for 'sCost'
            const sqrtDenominator = qualityAndEffectiveRatingFactor *
                marketFactor *
                businessFactor *
                corporation.getSalesMult() *
                advertisingFactor *
                this.getSalesMultiplier();
            const denominator = Math.sqrt(sellAmt / sqrtDenominator);
            let optimalPrice;
            if (sqrtDenominator === 0 || denominator === 0) {
                if (sellAmt === 0) {
                    optimalPrice = 0; // Nothing to sell
                }
                else {
                    optimalPrice = marketPrice + markupLimit;
                    console.warn(`In Corporation, found illegal 0s when trying to calculate MarketTA2 sale cost`);
                }
            }
            else {
                optimalPrice = markupLimit / denominator + marketPrice;
            }
            // Store this "optimal price" in a property so we don't have to re-calculate it for the UI.
            sCost = optimalPrice;
        }
        else if (marketTa1) {
            sCost = marketPrice + markupLimit;
        }
        else {
            // If the player does not set the price, desiredSellPrice will be an empty string.
            if (desiredSellPrice === "") {
                return 0;
            }
            /**
             * desiredSellPrice is usually a string, but it also can be a number in old versions. eval requires a
             * string, so we convert it to a string here, replace the placeholder MP, and then pass it to eval later.
             */
            const temp = String(desiredSellPrice).replace(/MP/g, marketPrice.toString());
            try {
                // Typecasting here is fine. We will validate the result immediately after this line.
                sCost = eval?.(temp);
                if (typeof sCost !== "number" || !Number.isFinite(sCost)) {
                    throw new Error(`Evaluated value is not a valid number: ${sCost}`);
                }
            }
            catch (error) {
                (0, DialogBox_1.dialogBoxCreate)(`Error evaluating your sell price for ${name} in ${this.name}'s ${city} office. ` +
                    `The sell amount is being set to zero. Error: ${error}`);
                return 0;
            }
        }
        if (isMaterial) {
            item.uiMarketPrice = sCost;
        }
        else {
            item.uiMarketPrice[city] = sCost;
        }
        const markupMultiplier = (0, helpers_1.calculateMarkupMultiplier)(sCost, marketPrice, markupLimit);
        // Calculate how much of the material sells (per second)
        const maxSellPerCycle = qualityAndEffectiveRatingFactor *
            marketFactor *
            markupMultiplier *
            businessFactor *
            corporation.getSalesMult() *
            advertisingFactor *
            this.getSalesMultiplier();
        if (isMaterial) {
            item.maxSellPerCycle = maxSellPerCycle;
        }
        else {
            item.maxSellAmount = maxSellPerCycle;
        }
        sellAmt = Math.min(maxSellPerCycle, sellAmt);
        sellAmt = sellAmt * corpConstants.secondsPerMarketCycle * marketCycles;
        sellAmt = Math.min(stored, sellAmt);
        const setActualSellAmount = (value) => {
            if (isMaterial) {
                item.actualSellAmount = value;
            }
            else {
                item.cityData[city].actualSellAmount = value;
            }
        };
        if (sellAmt < 0) {
            console.error(`sellAmt calculated to be negative for ${name} in ${this.name}'s ${city}`);
            setActualSellAmount(0);
            return 0;
        }
        if (sellAmt && sCost >= 0) {
            if (isMaterial) {
                item.stored -= sellAmt;
            }
            else {
                item.cityData[city].stored -= sellAmt;
            }
            revenue += sellAmt * sCost;
            setActualSellAmount(sellAmt / (corpConstants.secondsPerMarketCycle * marketCycles));
        }
        else {
            setActualSellAmount(0);
        }
        return revenue;
    }
    //Process production, purchase, and import/export of materials
    processMaterials(marketCycles = 1, corporation) {
        const state = corporation.state.nextName;
        let revenue = 0;
        let expenses = 0;
        this.calculateProductionFactors();
        for (const [city, office] of (0, Record_1.getRecordEntries)(this.offices)) {
            // Research points can be created even without a warehouse
            this.researchPoints +=
                // Todo: add constant for magic number
                0.004 *
                    Math.pow(office.employeeProductionByJob[_enums_1.CorpEmployeeJob.RandD], 0.5) *
                    corporation.getScientificResearchMult() *
                    this.getScientificResearchMultiplier();
            // Employee pay is an expense even with no warehouse.
            expenses += office.totalSalary;
            const warehouse = this.warehouses[city];
            if (!warehouse)
                continue;
            switch (state) {
                case "PURCHASE": {
                    const smartBuy = {};
                    /* Process purchase of materials, not from smart supply */
                    for (const [matName, mat] of (0, Record_1.getRecordEntries)(warehouse.materials)) {
                        const reqMat = this.requiredMaterials[matName];
                        if (warehouse.smartSupplyEnabled && reqMat) {
                            // Smart supply
                            mat.buyAmount = reqMat * warehouse.smartSupplyStore;
                            let buyAmt = mat.buyAmount * corpConstants.secondsPerMarketCycle * marketCycles;
                            const maxAmt = Math.floor((warehouse.size - warehouse.sizeUsed) / MaterialInfo_1.MaterialInfo[matName].size);
                            buyAmt = Math.min(buyAmt, maxAmt);
                            if (buyAmt > 0)
                                smartBuy[matName] = [buyAmt, reqMat];
                        }
                        else {
                            // Not smart supply
                            let buyAmt = 0;
                            let maxAmt = 0;
                            buyAmt = mat.buyAmount * corpConstants.secondsPerMarketCycle * marketCycles;
                            maxAmt = Math.floor((warehouse.size - warehouse.sizeUsed) / MaterialInfo_1.MaterialInfo[matName].size);
                            buyAmt = Math.min(buyAmt, maxAmt);
                            if (buyAmt > 0) {
                                mat.quality = Math.max(0.1, (mat.quality * mat.stored + 1 * buyAmt) / (mat.stored + buyAmt));
                                mat.averagePrice = (mat.stored * mat.averagePrice + buyAmt * mat.marketPrice) / (mat.stored + buyAmt);
                                mat.stored += buyAmt;
                                expenses += buyAmt * mat.marketPrice;
                            }
                            this.updateWarehouseSizeUsed(warehouse);
                        }
                    } //End process purchase of materials
                    // Find which material were trying to create the least amount of product with.
                    let worseAmt = 1e99;
                    for (const [buyAmt, reqMat] of Object.values(smartBuy)) {
                        const amt = buyAmt / reqMat;
                        if (amt < worseAmt)
                            worseAmt = amt;
                    }
                    // Align all the materials to the smallest amount.
                    for (const buyArray of Object.values(smartBuy)) {
                        buyArray[0] = worseAmt * buyArray[1];
                    }
                    // Calculate the total size of all things were trying to buy
                    let totalSize = 0;
                    for (const [matName, [buyAmt]] of (0, Record_1.getRecordEntries)(smartBuy)) {
                        if (buyAmt === undefined)
                            throw new Error(`Somehow smartbuy matname is undefined`);
                        totalSize += buyAmt * MaterialInfo_1.MaterialInfo[matName].size;
                    }
                    // Shrink to the size of available space.
                    const freeSpace = warehouse.size - warehouse.sizeUsed;
                    if (totalSize > freeSpace) {
                        // Multiplier applied to buy amounts to not overfill warehouse
                        const buyMult = freeSpace / totalSize;
                        for (const buyArray of Object.values(smartBuy)) {
                            buyArray[0] = Math.floor(buyArray[0] * buyMult);
                        }
                    }
                    // Use the materials already in the warehouse if the option is on.
                    for (const [matName, buyArray] of (0, Record_1.getRecordEntries)(smartBuy)) {
                        if (warehouse.smartSupplyOptions[matName] === "none")
                            continue;
                        const mat = warehouse.materials[matName];
                        if (warehouse.smartSupplyOptions[matName] === "leftovers") {
                            buyArray[0] = Math.max(0, buyArray[0] - mat.stored);
                        }
                        else {
                            buyArray[0] = Math.max(0, buyArray[0] - mat.importAmount * corpConstants.secondsPerMarketCycle * marketCycles);
                        }
                    }
                    // buy them
                    for (const [matName, [buyAmt]] of (0, Record_1.getRecordEntries)(smartBuy)) {
                        const mat = warehouse.materials[matName];
                        if (mat.stored + buyAmt !== 0) {
                            mat.quality = (mat.quality * mat.stored + 1 * buyAmt) / (mat.stored + buyAmt);
                            mat.averagePrice = (mat.averagePrice * mat.stored + mat.marketPrice * buyAmt) / (mat.stored + buyAmt);
                        }
                        else {
                            mat.quality = 1;
                            mat.averagePrice = mat.marketPrice;
                        }
                        mat.stored += buyAmt;
                        mat.buyAmount = buyAmt / (corpConstants.secondsPerMarketCycle * marketCycles);
                        expenses += buyAmt * mat.marketPrice;
                    }
                    break;
                }
                case "PRODUCTION":
                    warehouse.smartSupplyStore = 0; //Reset smart supply amount
                    /* Process production of materials */
                    if (this.producedMaterials.length > 0) {
                        const mat = warehouse.materials[this.producedMaterials[0]];
                        //Calculate the maximum production of this material based
                        //on the office's productivity
                        const maxProd = this.getOfficeProductivity(office) *
                            this.productionMult * // Multiplier from materials
                            corporation.getProductionMultiplier() *
                            this.getProductionMultiplier(); // Multiplier from Research
                        let prod;
                        // If there is a limit set on production, apply the limit
                        prod = mat.productionLimit === null ? maxProd : Math.min(maxProd, mat.productionLimit);
                        prod *= corpConstants.secondsPerMarketCycle * marketCycles; //Convert production from per second to per market cycle
                        // Calculate net change in warehouse storage making the produced materials will cost
                        let totalMatSize = 0;
                        for (let tmp = 0; tmp < this.producedMaterials.length; ++tmp) {
                            totalMatSize += MaterialInfo_1.MaterialInfo[this.producedMaterials[tmp]].size;
                        }
                        for (const [reqMatName, reqQty] of (0, Record_1.getRecordEntries)(this.requiredMaterials)) {
                            totalMatSize -= MaterialInfo_1.MaterialInfo[reqMatName].size * reqQty;
                        }
                        // If not enough space in warehouse, limit the amount of produced materials
                        if (totalMatSize > 0) {
                            const maxAmt = Math.floor((warehouse.size - warehouse.sizeUsed) / totalMatSize);
                            prod = Math.min(maxAmt, prod);
                        }
                        if (prod < 0) {
                            prod = 0;
                        }
                        // Keep track of production for smart supply (/s)
                        warehouse.smartSupplyStore += prod / (corpConstants.secondsPerMarketCycle * marketCycles);
                        // Make sure we have enough resource to make our materials
                        let producableFrac = 1;
                        for (const [reqMatName, reqMat] of (0, Record_1.getRecordEntries)(this.requiredMaterials)) {
                            const req = reqMat * prod;
                            if (warehouse.materials[reqMatName].stored < req) {
                                producableFrac = Math.min(producableFrac, warehouse.materials[reqMatName].stored / req);
                            }
                        }
                        if (producableFrac <= 0) {
                            producableFrac = 0;
                            prod = 0;
                        }
                        // Make our materials if they are producable
                        if (producableFrac > 0 && prod > 0) {
                            const requiredMatsEntries = (0, Record_1.getRecordEntries)(this.requiredMaterials);
                            let avgQlt = 0;
                            const divider = requiredMatsEntries.length;
                            for (const [reqMatName, reqMat] of requiredMatsEntries) {
                                const reqMatQtyNeeded = reqMat * prod * producableFrac;
                                // producableFrac already takes into account that we have enough stored
                                // Math.max is used here to avoid stored becoming negative (which can lead to NaNs)
                                /**
                                 * material.stored can become negative due to floating-point inaccuracy.
                                 *
                                 * Let's check this situation: Tobacco: 1 Plants -> 1 Product. In this situation, we have:
                                 * - reqQty = 1
                                 * - producableFrac = material.stored / prod
                                 * - reqMatQtyNeeded = prod * material.stored / prod
                                 *
                                 * Due to floating-point inaccuracy, "prod * material.stored / prod" may be slightly greater than
                                 * "material.stored". Example numbers from a real test run:
                                 * - warehouse.materials[reqMatName].stored: 942118
                                 * - prod: 176915618.50773352
                                 * - producableFrac: 0.005325239274783516
                                 * - reqMatQtyNeeded: 942118.0000000001
                                 */
                                warehouse.materials[reqMatName].stored = Math.max(0, warehouse.materials[reqMatName].stored - reqMatQtyNeeded);
                                warehouse.materials[reqMatName].productionAmount = 0;
                                warehouse.materials[reqMatName].productionAmount -=
                                    reqMatQtyNeeded / (corpConstants.secondsPerMarketCycle * marketCycles);
                                avgQlt += warehouse.materials[reqMatName].quality / divider;
                            }
                            avgQlt = Math.max(avgQlt, 1);
                            for (let j = 0; j < this.producedMaterials.length; ++j) {
                                let tempQlt = office.employeeProductionByJob[_enums_1.CorpEmployeeJob.Engineer] / 90 +
                                    Math.pow(this.researchPoints, this.researchFactor) +
                                    Math.pow(Math.max(0, warehouse.materials["AI Cores"].stored), this.aiCoreFactor) / 10e3;
                                const logQlt = Math.max(Math.pow(tempQlt, 0.5), 1);
                                tempQlt = Math.min(tempQlt, avgQlt * logQlt);
                                warehouse.materials[this.producedMaterials[j]].quality = Math.max(1, (warehouse.materials[this.producedMaterials[j]].quality *
                                    warehouse.materials[this.producedMaterials[j]].stored +
                                    tempQlt * prod * producableFrac) /
                                    (warehouse.materials[this.producedMaterials[j]].stored + prod * producableFrac));
                                warehouse.materials[this.producedMaterials[j]].averagePrice =
                                    (warehouse.materials[this.producedMaterials[j]].averagePrice *
                                        warehouse.materials[this.producedMaterials[j]].stored +
                                        warehouse.materials[this.producedMaterials[j]].marketPrice * prod * producableFrac) /
                                        (warehouse.materials[this.producedMaterials[j]].stored + prod * producableFrac);
                                warehouse.materials[this.producedMaterials[j]].stored += prod * producableFrac;
                            }
                        }
                        else {
                            for (const reqMatName of (0, Record_1.getRecordKeys)(this.requiredMaterials)) {
                                warehouse.materials[reqMatName].productionAmount = 0;
                            }
                        }
                        //Per second
                        const materialProduction = (prod * producableFrac) / (corpConstants.secondsPerMarketCycle * marketCycles);
                        for (const prodMatName of this.producedMaterials) {
                            warehouse.materials[prodMatName].productionAmount = materialProduction;
                        }
                    }
                    else {
                        //If this doesn't produce any materials, then it only creates
                        //Products. Creating products will consume materials. The
                        //Production of all consumed materials must be set to 0
                        for (const reqMatName of (0, Record_1.getRecordKeys)(this.requiredMaterials)) {
                            warehouse.materials[reqMatName].productionAmount = 0;
                        }
                    }
                    break;
                case "SALE":
                    /* Process sale of materials */
                    for (const material of (0, Record_1.getRecordValues)(warehouse.materials)) {
                        revenue += this.processSaleState(marketCycles, material, corporation, office, warehouse);
                    }
                    break;
                case "EXPORT":
                    for (const matName of Object.values(corpConstants.materialNames)) {
                        if (Object.hasOwn(warehouse.materials, matName)) {
                            const mat = warehouse.materials[matName];
                            mat.exportedLastCycle = 0; //Reset export
                            for (let expI = 0; expI < mat.exports.length; ++expI) {
                                const exp = mat.exports[expI];
                                const expIndustry = corporation.divisions.get(exp.division);
                                if (!expIndustry) {
                                    console.error(`Invalid export! ${exp.division}`);
                                    continue;
                                }
                                const expWarehouse = expIndustry.warehouses[exp.city];
                                if (!expWarehouse) {
                                    console.error(`Invalid export! ${expIndustry.name} ${exp.city}`);
                                    continue;
                                }
                                const tempMaterial = expWarehouse.materials[matName];
                                let amtStr = exp.amount.replace(/MAX/g, (mat.stored / (corpConstants.secondsPerMarketCycle * marketCycles)).toString());
                                amtStr = amtStr.replace(/EPROD/g, `(${mat.productionAmount})`);
                                amtStr = amtStr.replace(/IPROD/g, `(${tempMaterial.productionAmount})`);
                                amtStr = amtStr.replace(/EINV/g, `(${mat.stored})`);
                                amtStr = amtStr.replace(/IINV/g, `(${tempMaterial.stored})`);
                                let amt = 0;
                                try {
                                    // Typecasting here is fine. We will validate the result immediately after this line.
                                    amt = eval?.(amtStr);
                                    if (typeof amt !== "number" || !Number.isFinite(amt)) {
                                        throw new Error(`Evaluated value is not a valid number: ${amt}`);
                                    }
                                }
                                catch (e) {
                                    (0, DialogBox_1.dialogBoxCreate)(`Calculating export for ${mat.name} in ${this.name}'s ${city} division failed with error: ${e}`);
                                    continue;
                                }
                                amt = amt * corpConstants.secondsPerMarketCycle * marketCycles;
                                if (mat.stored < amt) {
                                    amt = mat.stored;
                                }
                                // Make sure theres enough space in warehouse
                                if (expWarehouse.sizeUsed >= expWarehouse.size) {
                                    // Warehouse at capacity. Exporting doesn't
                                    // affect revenue so just return 0's
                                    continue;
                                }
                                else {
                                    const maxAmt = Math.floor((expWarehouse.size - expWarehouse.sizeUsed) / MaterialInfo_1.MaterialInfo[matName].size);
                                    amt = Math.min(maxAmt, amt);
                                }
                                if (amt <= 0) {
                                    continue;
                                }
                                expWarehouse.materials[matName].importAmount +=
                                    amt / (corpConstants.secondsPerMarketCycle * marketCycles);
                                //Pretty sure this can cause some issues if there are multiple sources importing same material to same warehouse
                                //but this will do for now
                                expWarehouse.materials[matName].quality = Math.max(0.1, (expWarehouse.materials[matName].quality * expWarehouse.materials[matName].stored +
                                    amt * mat.quality) /
                                    (expWarehouse.materials[matName].stored + amt));
                                expWarehouse.materials[matName].averagePrice =
                                    (expWarehouse.materials[matName].averagePrice * expWarehouse.materials[matName].stored +
                                        expWarehouse.materials[matName].marketPrice * amt) /
                                        (expWarehouse.materials[matName].stored + amt);
                                expWarehouse.materials[matName].stored += amt;
                                mat.stored -= amt;
                                mat.exportedLastCycle += amt;
                                expIndustry.updateWarehouseSizeUsed(expWarehouse);
                            }
                            //totalExp should be per second
                            mat.exportedLastCycle /= corpConstants.secondsPerMarketCycle * marketCycles;
                        }
                    }
                    break;
                case "START":
                    break;
                default:
                    (0, throwIfReachable_1.throwIfReachable)(state);
            } //End switch(this.state)
            this.updateWarehouseSizeUsed(warehouse);
        }
        return [revenue, expenses];
    }
    /** Process product development and production/sale */
    processProducts(marketCycles = 1, corporation) {
        const state = corporation.state.nextName;
        let revenue = 0;
        const expenses = 0;
        //Create products
        for (const [name, product] of this.products) {
            if (!product.finished) {
                // Product still under development
                if (state !== "PRODUCTION")
                    continue;
                const city = product.creationCity;
                const office = this.offices[city];
                if (!office) {
                    console.error(`Product ${name} being created in a city without an office. This is a bug.`);
                    continue;
                }
                product.createProduct(marketCycles, office.employeeProductionByJob);
                if (product.developmentProgress >= 100) {
                    product.finishProduct(this);
                }
                break;
            }
            else {
                revenue += this.processProduct(marketCycles, product, corporation);
            }
        }
        return [revenue, expenses];
    }
    //Processes FINISHED products
    processProduct(marketCycles = 1, product, corporation) {
        const state = corporation.state.nextName;
        let totalProfit = 0;
        for (const [city, office] of (0, Record_1.getRecordEntries)(this.offices)) {
            const warehouse = this.warehouses[city];
            if (!warehouse)
                continue;
            switch (state) {
                case "PRODUCTION": {
                    //Calculate the maximum production of this material based
                    //on the office's productivity
                    const maxProd = this.getOfficeProductivity(office, { forProduct: true }) *
                        corporation.getProductionMultiplier() *
                        this.productionMult * // Multiplier from materials
                        this.getProductionMultiplier() * // Multiplier from research
                        this.getProductProductionMultiplier(); // Multiplier from research
                    let prod;
                    const productionLimit = product.cityData[city].productionLimit;
                    //Account for whether production is manually limited
                    if (productionLimit !== null) {
                        prod = Math.min(maxProd, productionLimit);
                    }
                    else {
                        prod = maxProd;
                    }
                    prod *= corpConstants.secondsPerMarketCycle * marketCycles;
                    //Calculate net change in warehouse storage making the Products will cost
                    let netStorageSize = product.size;
                    for (const [reqMatName, reqQty] of (0, Record_1.getRecordEntries)(product.requiredMaterials)) {
                        netStorageSize -= MaterialInfo_1.MaterialInfo[reqMatName].size * reqQty;
                    }
                    //If there's not enough space in warehouse, limit the amount of Product
                    if (netStorageSize > 0) {
                        const maxAmt = Math.floor((warehouse.size - warehouse.sizeUsed) / netStorageSize);
                        prod = Math.min(maxAmt, prod);
                    }
                    warehouse.smartSupplyStore += prod / (corpConstants.secondsPerMarketCycle * marketCycles);
                    //Make sure we have enough resources to make our Products
                    let producableFrac = 1;
                    for (const [reqMatName, reqQty] of (0, Record_1.getRecordEntries)(product.requiredMaterials)) {
                        const req = reqQty * prod;
                        if (warehouse.materials[reqMatName].stored < req) {
                            producableFrac = Math.min(producableFrac, warehouse.materials[reqMatName].stored / req);
                        }
                    }
                    //Make our Products if they are producable
                    if (producableFrac > 0 && prod > 0) {
                        let avgQlt = 1;
                        for (const [reqMatName, reqQty] of (0, Record_1.getRecordEntries)(product.requiredMaterials)) {
                            const reqMatQtyNeeded = reqQty * prod * producableFrac;
                            // producableFrac already takes into account that we have enough stored
                            // Math.max is used here to avoid stored becoming negative (which can lead to NaNs)
                            /**
                             * material.stored can become negative due to floating-point inaccuracy.
                             *
                             * Let's check this situation: Tobacco: 1 Plants -> 1 Product. In this situation, we have:
                             * - reqQty = 1
                             * - producableFrac = material.stored / prod
                             * - reqMatQtyNeeded = prod * material.stored / prod
                             *
                             * Due to floating-point inaccuracy, "prod * material.stored / prod" may be slightly greater than
                             * "material.stored". Example numbers from a real test run:
                             * - warehouse.materials[reqMatName].stored: 942118
                             * - prod: 176915618.50773352
                             * - producableFrac: 0.005325239274783516
                             * - reqMatQtyNeeded: 942118.0000000001
                             */
                            warehouse.materials[reqMatName].stored = Math.max(0, warehouse.materials[reqMatName].stored - reqMatQtyNeeded);
                            warehouse.materials[reqMatName].productionAmount -=
                                reqMatQtyNeeded / (corpConstants.secondsPerMarketCycle * marketCycles);
                            avgQlt += warehouse.materials[reqMatName].quality;
                        }
                        avgQlt /= Object.keys(product.requiredMaterials).length;
                        const tempEffRat = Math.min(product.rating, avgQlt * Math.pow(product.rating, 0.5));
                        //Effective Rating
                        product.cityData[city].effectiveRating =
                            (product.cityData[city].effectiveRating * product.cityData[city].stored +
                                tempEffRat * prod * producableFrac) /
                                (product.cityData[city].stored + prod * producableFrac);
                        //Quantity
                        product.cityData[city].stored += prod * producableFrac;
                    }
                    //Keep track of production Per second
                    product.cityData[city].productionAmount =
                        (prod * producableFrac) / (corpConstants.secondsPerMarketCycle * marketCycles);
                    break;
                }
                case "SALE":
                    totalProfit += this.processSaleState(marketCycles, product, corporation, office, warehouse);
                    break;
                case "START":
                case "PURCHASE":
                case "EXPORT":
                    break;
                default:
                    (0, throwIfReachable_1.throwIfReachable)(state);
            } //End switch(this.state)
            this.updateWarehouseSizeUsed(warehouse);
        }
        return totalProfit;
    }
    resetImports(state) {
        //At the start of the export state, set the imports of everything to 0
        if (state === "EXPORT") {
            for (const warehouse of (0, Record_1.getRecordValues)(this.warehouses)) {
                for (const material of (0, Record_1.getRecordValues)(warehouse.materials)) {
                    material.importAmount = 0;
                }
            }
        }
    }
    discontinueProduct(productName) {
        this.products.delete(productName);
    }
    getAdVertCost() {
        return 1e9 * Math.pow(1.06, this.numAdVerts);
    }
    applyAdVert(corporation) {
        const advMult = corporation.getAdvertisingMultiplier() * this.getAdvertisingMultiplier();
        const awareness = (this.awareness + 3 * advMult) * (1.005 * advMult);
        this.awareness = Math.min(awareness, Number.MAX_VALUE);
        const popularity = (this.popularity + 1 * advMult) * ((1 + (0, getRandomIntInclusive_1.getRandomIntInclusive)(1, 3) / 200) * advMult);
        this.popularity = Math.min(popularity, Number.MAX_VALUE);
        ++this.numAdVerts;
    }
    // Returns how much of a material can be produced based of office productivity (employee stats)
    getOfficeProductivity(office, params = {}) {
        const opProd = office.employeeProductionByJob[_enums_1.CorpEmployeeJob.Operations];
        const engrProd = office.employeeProductionByJob[_enums_1.CorpEmployeeJob.Engineer];
        const mgmtProd = office.employeeProductionByJob[_enums_1.CorpEmployeeJob.Management];
        const total = opProd + engrProd + mgmtProd;
        if (total <= 0)
            return 0;
        // Management is a multiplier for the production from Operations and Engineers
        const mgmtFactor = 1 + mgmtProd / (1.2 * total);
        // For production, Operations is slightly more important than engineering
        // Both Engineering and Operations have diminishing returns
        const prod = (Math.pow(opProd, 0.4) + Math.pow(engrProd, 0.3)) * mgmtFactor;
        // Generic multiplier for the production. Used for game-balancing purposes
        const balancingMult = 0.05;
        if (params && params.forProduct) {
            // Products are harder to create and therefore have less production
            return 0.5 * balancingMult * prod;
        }
        else {
            return balancingMult * prod;
        }
    }
    // Returns a multiplier based on the office' 'Business' employees that affects sales
    getBusinessFactor(office) {
        const businessProd = 1 + office.employeeProductionByJob[_enums_1.CorpEmployeeJob.Business];
        return (0, calculateEffectWithFactors_1.calculateEffectWithFactors)(businessProd, 0.26, 10e3);
    }
    //Returns a set of multipliers based on the Industry's awareness, popularity, and advFac. This
    //multiplier affects sales. The result is:
    //  [Total sales mult, total awareness mult, total pop mult, awareness/pop ratio mult]
    getAdvertisingFactors() {
        const awarenessFac = Math.pow(this.awareness + 1, this.advertisingFactor);
        const popularityFac = Math.pow(this.popularity + 1, this.advertisingFactor);
        const ratioFac = this.awareness === 0 ? 0.01 : Math.max((this.popularity + 0.001) / this.awareness, 0.01);
        const totalFac = Math.pow(awarenessFac * popularityFac * ratioFac, 0.85);
        return [totalFac, awarenessFac, popularityFac, ratioFac];
    }
    //Returns a multiplier based on a materials demand and competition that affects sales
    getMarketFactor(item) {
        return Math.max(0.1, (item.demand * (100 - item.competition)) / 100);
    }
    // Returns a boolean indicating whether this Industry has the specified Research
    hasResearch(name) {
        return this.researched.has(name);
    }
    updateResearchTree() {
        if (this.treeInitialized)
            return;
        const researchTree = IndustryData_1.IndustryResearchTrees[this.industry];
        // Need to populate the tree in case we are loading a game.
        for (const research of this.researched)
            researchTree.research(research);
        // Also need to load researches from the tree in case we are making a new division.
        for (const research of researchTree.researched)
            this.researched.add(research);
        this.treeInitialized = true;
    }
    // Get multipliers from Research
    getAdvertisingMultiplier() {
        const researchTree = IndustryData_1.IndustryResearchTrees[this.industry];
        this.updateResearchTree();
        return researchTree.getAdvertisingMultiplier();
    }
    getEmployeeChaMultiplier() {
        const researchTree = IndustryData_1.IndustryResearchTrees[this.industry];
        this.updateResearchTree();
        return researchTree.getEmployeeChaMultiplier();
    }
    getEmployeeCreMultiplier() {
        const researchTree = IndustryData_1.IndustryResearchTrees[this.industry];
        this.updateResearchTree();
        return researchTree.getEmployeeCreMultiplier();
    }
    getEmployeeEffMultiplier() {
        const researchTree = IndustryData_1.IndustryResearchTrees[this.industry];
        this.updateResearchTree();
        return researchTree.getEmployeeEffMultiplier();
    }
    getEmployeeIntMultiplier() {
        const researchTree = IndustryData_1.IndustryResearchTrees[this.industry];
        this.updateResearchTree();
        return researchTree.getEmployeeIntMultiplier();
    }
    getProductionMultiplier() {
        const researchTree = IndustryData_1.IndustryResearchTrees[this.industry];
        this.updateResearchTree();
        return researchTree.getProductionMultiplier();
    }
    getProductProductionMultiplier() {
        const researchTree = IndustryData_1.IndustryResearchTrees[this.industry];
        this.updateResearchTree();
        return researchTree.getProductProductionMultiplier();
    }
    getSalesMultiplier() {
        const researchTree = IndustryData_1.IndustryResearchTrees[this.industry];
        this.updateResearchTree();
        return researchTree.getSalesMultiplier();
    }
    getScientificResearchMultiplier() {
        const researchTree = IndustryData_1.IndustryResearchTrees[this.industry];
        this.updateResearchTree();
        return researchTree.getScientificResearchMultiplier();
    }
    getStorageMultiplier() {
        const researchTree = IndustryData_1.IndustryResearchTrees[this.industry];
        this.updateResearchTree();
        return researchTree.getStorageMultiplier();
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("Division", this, Division.includedKeys);
    }
    /** Initializes a Division object from a JSON save state. */
    static fromJSON(value) {
        const division = (0, JSONReviver_1.Generic_fromJSON)(Division, value.data, Division.includedKeys);
        // division.type was renamed to division.industry in v3.0.0.
        (0, TypeAssertion_1.assertObject)(value.data);
        if ("type" in value.data) {
            division.industry = value.data.type;
        }
        return division;
    }
}
exports.Division = Division;
Division.includedKeys = (0, getKeyList_1.getKeyList)(Division, { removedKeys: ["treeInitialized"] });
JSONReviver_1.constructorsForReviver.Division = Division;
