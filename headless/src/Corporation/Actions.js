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
exports.createCorporation = createCorporation;
exports.createDivision = createDivision;
exports.removeDivision = removeDivision;
exports.purchaseOffice = purchaseOffice;
exports.issueDividends = issueDividends;
exports.goPublic = goPublic;
exports.issueNewShares = issueNewShares;
exports.acceptInvestmentOffer = acceptInvestmentOffer;
exports.convertPriceString = convertPriceString;
exports.convertAmountString = convertAmountString;
exports.sellMaterial = sellMaterial;
exports.sellProduct = sellProduct;
exports.setSmartSupply = setSmartSupply;
exports.setSmartSupplyOption = setSmartSupplyOption;
exports.buyMaterial = buyMaterial;
exports.bulkPurchase = bulkPurchase;
exports.sellShares = sellShares;
exports.buyBackShares = buyBackShares;
exports.upgradeOfficeSize = upgradeOfficeSize;
exports.buyTea = buyTea;
exports.throwParty = throwParty;
exports.purchaseWarehouse = purchaseWarehouse;
exports.upgradeWarehouseCost = upgradeWarehouseCost;
exports.upgradeWarehouse = upgradeWarehouse;
exports.hireAdVert = hireAdVert;
exports.makeProduct = makeProduct;
exports.research = research;
exports.exportMaterial = exportMaterial;
exports.cancelExportMaterial = cancelExportMaterial;
exports.limitProductProduction = limitProductProduction;
exports.limitMaterialProduction = limitMaterialProduction;
exports.setMaterialMarketTA1 = setMaterialMarketTA1;
exports.setMaterialMarketTA2 = setMaterialMarketTA2;
exports.setProductMarketTA1 = setProductMarketTA1;
exports.setProductMarketTA2 = setProductMarketTA2;
exports.bribe = bribe;
const _player_1 = require("@player");
const MaterialInfo_1 = require("./MaterialInfo");
const IndustryData_1 = require("./data/IndustryData");
const Division_1 = require("./Division");
const corpConstants = __importStar(require("./data/Constants"));
const OfficeSpace_1 = require("./OfficeSpace");
const Product_1 = require("./Product");
const Warehouse_1 = require("./Warehouse");
const _enums_1 = require("@enums");
const ResearchMap_1 = require("./ResearchMap");
const Helpers_1 = require("./ui/Helpers");
const _enums_2 = require("@enums");
const getRandomIntInclusive_1 = require("../utils/helpers/getRandomIntInclusive");
const Record_1 = require("../Types/Record");
const helpers_1 = require("./helpers");
const Factions_1 = require("../Faction/Factions");
const throwIfReachable_1 = require("../utils/helpers/throwIfReachable");
const formatNumber_1 = require("../ui/formatNumber");
function createCorporation(corporationName, selfFund, restart) {
    const checkResult = (0, helpers_1.canCreateCorporation)(selfFund, restart);
    switch (checkResult) {
        case _enums_1.CreatingCorporationCheckResultEnum.Success:
            break;
        case _enums_1.CreatingCorporationCheckResultEnum.NoSf3OrDisabled:
        case _enums_1.CreatingCorporationCheckResultEnum.CorporationExists:
            return { success: false, message: (0, helpers_1.convertCreatingCorporationCheckResultToMessage)(checkResult) };
        case _enums_1.CreatingCorporationCheckResultEnum.UseSeedMoneyOutsideBN3:
        case _enums_1.CreatingCorporationCheckResultEnum.DisabledBySoftCap:
            // In order to maintain backward compatibility, we have to throw an error in these cases.
            throw new Error((0, helpers_1.convertCreatingCorporationCheckResultToMessage)(checkResult));
        default:
            (0, throwIfReachable_1.throwIfReachable)(checkResult);
    }
    if (!corporationName) {
        return { success: false, message: "Corporation name cannot be an empty string." };
    }
    if (selfFund) {
        const cost = (0, helpers_1.costOfCreatingCorporation)(restart);
        if (!_player_1.Player.canAfford(cost)) {
            return {
                success: false,
                message: `You don't have enough money to create a corporation. It costs ${(0, formatNumber_1.formatMoney)(cost)}.`,
            };
        }
        _player_1.Player.startCorporation(corporationName, false);
        _player_1.Player.loseMoney(cost, "corporation");
    }
    else {
        _player_1.Player.startCorporation(corporationName, true);
    }
    return { success: true };
}
function createDivision(corporation, industry, name) {
    if (corporation.divisions.size >= corporation.maxDivisions)
        throw new Error(`Cannot expand into ${industry} industry, too many divisions!`);
    if (corporation.divisions.has(name))
        throw new Error(`Division name ${name} is already in use!`);
    // "Overview" is forbidden as a division name, see CorporationRoot.tsx for why this would cause issues.
    if (name === "Overview")
        throw new Error(`"Overview" is a forbidden division name.`);
    const data = IndustryData_1.IndustriesData[industry];
    if (!data)
        throw new Error(`Invalid industry: '${industry}'`);
    const cost = data.startingCost;
    if (corporation.funds < cost) {
        throw new Error("Not enough money to create a new division in this industry");
    }
    else if (name === "") {
        throw new Error("New division must have a name!");
    }
    else {
        corporation.loseFunds(cost, "division");
        corporation.divisions.set(name, new Division_1.Division({
            corp: corporation,
            name: name,
            industry: industry,
        }));
        corporation.numberOfOfficesAndWarehouses += 2;
    }
}
function removeDivision(corporation, name) {
    const division = corporation.divisions.get(name);
    if (!division)
        throw new Error("There is no division called " + name);
    corporation.divisions.delete(name);
    corporation.numberOfOfficesAndWarehouses -= (0, Record_1.getRecordValues)(division.offices).length;
    corporation.numberOfOfficesAndWarehouses -= (0, Record_1.getRecordValues)(division.warehouses).length;
    // We also need to remove any exports that were pointing to the old division
    for (const otherDivision of corporation.divisions.values()) {
        for (const warehouse of (0, Record_1.getRecordValues)(otherDivision.warehouses)) {
            for (const material of (0, Record_1.getRecordValues)(warehouse.materials)) {
                // Work backwards through exports array so splicing doesn't affect the loop
                for (let i = material.exports.length - 1; i >= 0; i--) {
                    if (material.exports[i].division === name)
                        material.exports.splice(i, 1);
                }
            }
        }
    }
    const price = division.calculateRecoupableValue();
    corporation.gainFunds(price, "division");
    return price;
}
function purchaseOffice(corporation, division, city) {
    if (corporation.funds < corpConstants.officeInitialCost) {
        throw new Error("You don't have enough company funds to open a new office!");
    }
    if (division.offices[city]) {
        throw new Error(`You have already expanded into ${city} for ${division.name}`);
    }
    corporation.loseFunds(corpConstants.officeInitialCost, "division");
    division.offices[city] = new OfficeSpace_1.OfficeSpace({
        city: city,
        size: corpConstants.officeInitialSize,
    });
    ++corporation.numberOfOfficesAndWarehouses;
}
function issueDividends(corporation, rate) {
    if (isNaN(rate) || rate < 0 || rate > corpConstants.dividendMaxRate) {
        throw new Error(`Invalid value. Must be an number between 0 and ${corpConstants.dividendMaxRate}`);
    }
    corporation.dividendRate = rate;
}
function goPublic(corporation, numShares) {
    const ceoOwnership = (corporation.numShares - numShares) / corporation.totalShares;
    const initialSharePrice = corporation.getTargetSharePrice(ceoOwnership);
    if (isNaN(numShares) || numShares < 0) {
        throw new Error("Invalid value for number of issued shares");
    }
    if (numShares > corporation.numShares) {
        throw new Error("You don't have that many shares to issue!");
    }
    corporation.public = true;
    corporation.sharePrice = initialSharePrice;
    corporation.issuedShares += numShares;
    corporation.numShares -= numShares;
    corporation.gainFunds(numShares * initialSharePrice, "public equity");
}
function issueNewShares(corporation, amount) {
    const failureReason = (0, helpers_1.issueNewSharesFailureReason)(corporation, amount);
    if (failureReason)
        throw new Error(failureReason);
    const ceoOwnership = corporation.numShares / (corporation.totalShares + amount);
    const newSharePrice = corporation.getTargetSharePrice(ceoOwnership);
    const profit = (amount * (corporation.sharePrice + newSharePrice)) / 2;
    const cooldownMultiplier = corporation.totalShares / corpConstants.initialShares;
    corporation.issueNewSharesCooldown = corpConstants.issueNewSharesCooldown * cooldownMultiplier;
    const privateOwnedRatio = corporation.investorShares / corporation.totalShares;
    const maxPrivateShares = Math.round((amount / 2) * privateOwnedRatio);
    const privateShares = Math.round((0, getRandomIntInclusive_1.getRandomIntInclusive)(0, maxPrivateShares) / 10e6) * 10e6;
    corporation.issuedShares += amount - privateShares;
    corporation.investorShares += privateShares;
    corporation.totalShares += amount;
    corporation.gainFunds(profit, "public equity");
    // Set sharePrice directly because all formulas will be based on stale cycleValuation data
    corporation.sharePrice = newSharePrice;
    return [profit, amount, privateShares];
}
function acceptInvestmentOffer(corporation) {
    if (corporation.fundingRound >= corpConstants.fundingRoundShares.length ||
        corporation.fundingRound >= corpConstants.fundingRoundMultiplier.length ||
        corporation.public) {
        throw new Error("No more investment offers are available.");
    }
    const val = corporation.valuation;
    const percShares = corpConstants.fundingRoundShares[corporation.fundingRound];
    const roundMultiplier = corpConstants.fundingRoundMultiplier[corporation.fundingRound];
    const funding = val * percShares * roundMultiplier;
    const investShares = Math.floor(corpConstants.initialShares * percShares);
    corporation.fundingRound++;
    corporation.gainFunds(funding, "private equity");
    corporation.numShares -= investShares;
    corporation.investorShares += investShares;
}
function convertPriceString(price) {
    /**
     * This is a common error. We should check it to get a "user-friendly" error message. If we pass an empty string to
     * eval(), it will return undefined, and the "is-it-a-valid-number" following check will throw an unhelpful error
     * message.
     */
    if (price === "") {
        throw new Error("Price cannot be an empty string.");
    }
    /**
     * Replace invalid characters. Only accepts:
     * - Digit characters
     * - 4 most basic algebraic operations (+ - * /)
     * - Parentheses
     * - Dot character
     * - Any characters in this list: [e, E, M, P]
     */
    const sanitizedPrice = price.replace(/[^\d+\-*/().eEMP]/g, "");
    // Replace MP with test numbers.
    for (const testNumber of [-1.2e123, -123456, 123456, 1.2e123]) {
        const temp = sanitizedPrice.replace(/MP/g, testNumber.toString());
        let evaluatedTemp;
        try {
            evaluatedTemp = eval?.(temp);
            if (typeof evaluatedTemp !== "number" || !Number.isFinite(evaluatedTemp)) {
                throw new Error(`Evaluated value is not a valid number: ${evaluatedTemp}. Price: ${price}. sanitizedPrice: ${sanitizedPrice}. testNumber: ${testNumber}.`);
            }
        }
        catch (error) {
            throw new Error(`Invalid value or expression for sell price field: ${error}`, { cause: error });
        }
    }
    // Use sanitized price.
    return sanitizedPrice;
}
function convertAmountString(amount) {
    /**
     * This is a common error. We should check it to get a "user-friendly" error message. If we pass an empty string to
     * eval(), it will return undefined, and the "is-it-a-valid-number" following check will throw an unhelpful error
     * message.
     */
    if (amount === "") {
        throw new Error("Amount cannot be an empty string.");
    }
    /**
     * Replace invalid characters. Only accepts:
     * - Digit characters
     * - 4 most basic algebraic operations (+ - * /)
     * - Parentheses
     * - Dot character
     * - Any characters in this list: [e, E, M, A, X, P, R, O, D, I, N, V]
     */
    const sanitizedAmount = amount.replace(/[^\d+\-*/().eEMAXPRODINV]/g, "");
    for (const testNumber of [-1.2e123, -123456, 123456, 1.2e123]) {
        let temp = sanitizedAmount.replace(/MAX/g, testNumber.toString());
        temp = temp.replace(/PROD/g, testNumber.toString());
        temp = temp.replace(/INV/g, testNumber.toString());
        let evaluatedTemp;
        try {
            evaluatedTemp = eval?.(temp);
            if (typeof evaluatedTemp !== "number" || !Number.isFinite(evaluatedTemp)) {
                throw new Error(`Evaluated value is not a valid number: ${evaluatedTemp}. Amount: ${amount}. sanitizedAmount: ${sanitizedAmount}. testNumber: ${testNumber}.`);
            }
        }
        catch (error) {
            throw new Error(`Invalid value or expression for sell quantity field: ${error}`, { cause: error });
        }
    }
    // Use sanitized amount.
    return sanitizedAmount;
}
function sellMaterial(material, amount, price) {
    const convertedPrice = convertPriceString(price.toUpperCase());
    const convertedAmount = convertAmountString(amount.toUpperCase());
    material.desiredSellPrice = convertedPrice;
    material.desiredSellAmount = convertedAmount;
}
function sellProduct(product, city, amt, price, all) {
    const convertedPrice = convertPriceString(price.toUpperCase());
    const convertedAmount = convertAmountString(amt.toUpperCase());
    if (all) {
        for (const cityName of Object.values(_enums_2.CityName)) {
            product.cityData[cityName].desiredSellAmount = convertedAmount;
            product.cityData[cityName].desiredSellPrice = convertedPrice;
        }
    }
    else {
        product.cityData[city].desiredSellAmount = convertedAmount;
        product.cityData[city].desiredSellPrice = convertedPrice;
    }
}
function setSmartSupply(warehouse, smartSupply) {
    warehouse.smartSupplyEnabled = smartSupply;
}
function setSmartSupplyOption(warehouse, material, useOption) {
    warehouse.smartSupplyOptions[material.name] = useOption;
}
function buyMaterial(division, material, amt) {
    if (!(0, Helpers_1.isRelevantMaterial)(material.name, division)) {
        throw new Error(`${material.name} is not a relevant material for industry ${division.industry}`);
    }
    if (!Number.isFinite(amt) || amt < 0) {
        throw new Error(`Invalid amount '${amt}' to buy material '${material.name}'. Must be numeric and greater than or equal to 0`);
    }
    material.buyAmount = amt;
}
function bulkPurchase(corp, division, warehouse, material, amt) {
    if (!(0, Helpers_1.isRelevantMaterial)(material.name, division)) {
        throw new Error(`${material.name} is not a relevant material for industry ${division.industry}`);
    }
    const matSize = MaterialInfo_1.MaterialInfo[material.name].size;
    const maxAmount = (warehouse.size - warehouse.sizeUsed) / matSize;
    if (!Number.isFinite(amt) || amt < 0) {
        throw new Error(`Invalid amount '${amt}' to buy material '${material.name}'. Must be numeric and greater than or equal to 0`);
    }
    if (amt > maxAmount) {
        throw new Error(`You do not have enough warehouse size to fit this purchase`);
    }
    // Special case: if "amount" is 0, this is a no-op.
    if (amt === 0) {
        return;
    }
    const cost = amt * material.marketPrice;
    if (corp.funds < cost) {
        throw new Error(`You cannot afford this purchase.`);
    }
    corp.loseFunds(cost, "materials");
    material.averagePrice =
        (material.averagePrice * material.stored + material.marketPrice * amt) / (material.stored + amt);
    material.stored += amt;
    warehouse.sizeUsed = warehouse.sizeUsed + amt * matSize;
}
function sellShares(corporation, numShares) {
    const failureReason = (0, helpers_1.sellSharesFailureReason)(corporation, numShares);
    if (failureReason)
        throw new Error(failureReason);
    const [profit, newSharePrice, newSharesUntilUpdate] = corporation.calculateShareSale(numShares);
    corporation.numShares -= numShares;
    corporation.issuedShares += numShares;
    corporation.sharePrice = newSharePrice;
    corporation.shareSalesUntilPriceUpdate = newSharesUntilUpdate;
    corporation.shareSaleCooldown = corpConstants.sellSharesCooldown;
    _player_1.Player.gainMoney(profit, "corporation");
    return profit;
}
function buyBackShares(corporation, numShares) {
    const failureReason = (0, helpers_1.buybackSharesFailureReason)(corporation, numShares);
    if (failureReason)
        throw new Error(failureReason);
    const [cost, newSharePrice, newSharesUntilUpdate] = corporation.calculateShareBuyback(numShares);
    corporation.numShares += numShares;
    corporation.issuedShares -= numShares;
    corporation.sharePrice = newSharePrice;
    corporation.shareSalesUntilPriceUpdate = newSharesUntilUpdate;
    _player_1.Player.loseMoney(cost, "corporation");
    return true;
}
function upgradeOfficeSize(corp, office, increase) {
    const cost = (0, helpers_1.calculateOfficeSizeUpgradeCost)(office.size, increase);
    if (corp.funds < cost)
        return;
    office.size += increase;
    corp.loseFunds(cost, "office");
}
function buyTea(corp, office) {
    const cost = office.getTeaCost();
    if (corp.funds < cost || !office.setTea())
        return false;
    corp.loseFunds(cost, "tea");
    return true;
}
function throwParty(corp, office, costPerEmployee) {
    const mult = 1 + costPerEmployee / 10e6;
    const cost = costPerEmployee * office.numEmployees;
    if (corp.funds < cost) {
        return 0;
    }
    if (!office.setParty(mult)) {
        return 0;
    }
    corp.loseFunds(cost, "parties");
    return mult;
}
function purchaseWarehouse(corp, division, city) {
    if (corp.funds < corpConstants.warehouseInitialCost)
        return;
    if (division.warehouses[city])
        return;
    corp.loseFunds(corpConstants.warehouseInitialCost, "division");
    division.warehouses[city] = new Warehouse_1.Warehouse({
        division: division,
        loc: city,
        size: corpConstants.warehouseInitialSize,
    });
    ++corp.numberOfOfficesAndWarehouses;
}
function upgradeWarehouseCost(level, amt) {
    return Array.from(Array(amt).keys()).reduce((acc, index) => acc + corpConstants.warehouseSizeUpgradeCostBase * Math.pow(1.07, level + 1 + index), 0);
}
function upgradeWarehouse(corp, division, warehouse, amt = 1) {
    const sizeUpgradeCost = upgradeWarehouseCost(warehouse.level, amt);
    if (corp.funds < sizeUpgradeCost)
        return;
    warehouse.level += amt;
    warehouse.updateSize(corp, division);
    corp.loseFunds(sizeUpgradeCost, "warehouse");
}
function hireAdVert(corp, division) {
    const cost = division.getAdVertCost();
    if (corp.funds < cost)
        return;
    corp.loseFunds(cost, "advert");
    division.applyAdVert(corp);
}
function makeProduct(corp, division, city, productName, designInvest, marketingInvest) {
    // For invalid investment inputs, just use 0
    if (isNaN(designInvest) || designInvest < 0)
        designInvest = 0;
    if (isNaN(marketingInvest) || marketingInvest < 0)
        marketingInvest = 0;
    if (!division.offices[city]) {
        throw new Error(`Cannot develop a product in a city without an office!`);
    }
    if (productName == null || productName === "") {
        throw new Error("You must specify a name for your product!");
    }
    if (!division.makesProducts) {
        throw new Error("You cannot create products for this industry!");
    }
    if (corp.funds < designInvest + marketingInvest) {
        throw new Error("You don't have enough company funds to make this large of an investment");
    }
    if (division.products.size >= division.maxProducts) {
        throw new Error(`You are already at the max products (${division.maxProducts}) for division: ${division.name}!`);
    }
    const product = new Product_1.Product({
        name: productName.replace(/[<>]/g, "").trim(), //Sanitize for HTMl elements?
        createCity: city,
        designInvestment: designInvest,
        advertisingInvestment: marketingInvest,
    });
    if (division.products.has(product.name)) {
        throw new Error(`You already have a product with this name!`);
    }
    corp.loseFunds(designInvest + marketingInvest, "product development");
    division.products.set(product.name, product);
}
function research(researchingDivision, researchName) {
    const corp = _player_1.Player.corporation;
    if (!corp)
        return;
    const researchTree = IndustryData_1.IndustryResearchTrees[researchingDivision.industry];
    if (researchTree === undefined)
        throw new Error(`No research tree for industry '${researchingDivision.industry}'`);
    const research = ResearchMap_1.ResearchMap[researchName];
    const researchNode = researchTree.findNode(researchName);
    if (!researchNode) {
        return;
    }
    const researchPreReq = researchNode.parent?.researchName;
    //Check to see if the research request has any pre-reqs that need to be researched first.
    if (researchPreReq) {
        if (!researchingDivision.researched?.has(researchPreReq)) {
            throw new Error(`Division ${researchingDivision.name} requires ${researchPreReq} before researching ${research.name}`);
        }
    }
    if (researchingDivision.researched.has(researchName))
        return;
    if (researchingDivision.researchPoints < research.cost) {
        throw new Error(`You do not have enough Scientific Research for ${research.name}`);
    }
    researchingDivision.researchPoints -= research.cost;
    // Get the Node from the Research Tree and set its 'researched' property
    researchTree.research(researchName);
    // All divisions of the same type as the researching division get the new research.
    for (const division of corp.divisions.values()) {
        if (division.industry !== researchingDivision.industry)
            continue;
        division.researched.add(researchName);
        // Handle researches that need to have their effects manually applied here.
        // Warehouse size needs to be updated here because it is not recalculated during normal processing.
        if (researchName == "Drones - Transport") {
            for (const warehouse of (0, Record_1.getRecordValues)(division.warehouses)) {
                warehouse.updateSize(corp, division);
            }
        }
    }
}
/** Set a new export for a material. Throw on any invalid input. */
function exportMaterial(targetDivision, targetCity, material, amount) {
    if (!(0, Helpers_1.isRelevantMaterial)(material.name, targetDivision)) {
        throw new Error(`You cannot export material: ${material.name} to division: ${targetDivision.name}!`);
    }
    if (!targetDivision.warehouses[targetCity]) {
        throw new Error(`Cannot export to ${targetCity} in division ${targetDivision.name} because there is no warehouse.`);
    }
    if (material === targetDivision.warehouses[targetCity]?.materials[material.name]) {
        throw new Error(`Source and target division/city cannot be the same.`);
    }
    for (const existingExport of material.exports) {
        if (existingExport.division === targetDivision.name && existingExport.city === targetCity) {
            throw new Error(`Tried to initialize an export to a duplicate warehouse.
Target warehouse (division / city): ${existingExport.division} / ${existingExport.city}
Existing export amount: ${existingExport.amount}
Attempted export amount: ${amount}`);
        }
    }
    // Perform sanitization and tests
    let sanitizedAmt = amount.replace(/\s+/g, "").toUpperCase();
    sanitizedAmt = sanitizedAmt.replace(/[^-()\d/*+.MAXEPRODINV]/g, "");
    for (const testReplacement of ["(1.23)", "(-1.23)"]) {
        const replaced = sanitizedAmt.replace(/(MAX|IPROD|EPROD|IINV|EINV)/g, testReplacement);
        let evaluated;
        try {
            evaluated = eval?.(replaced);
            if (typeof evaluated !== "number" || !Number.isFinite(evaluated)) {
                throw new Error(`Evaluated value is not a valid number: ${evaluated}`);
            }
        }
        catch (error) {
            throw new Error(`Error while trying to set the exported amount of ${material.name}.
Error occurred while testing keyword replacement with ${testReplacement}.
Your input: ${amount}
Sanitized input: ${sanitizedAmt}
Input after replacement: ${replaced}
Evaluated value: ${evaluated}
Error encountered: ${error}`);
        }
    }
    const exportObj = { division: targetDivision.name, city: targetCity, amount: sanitizedAmt };
    material.exports.push(exportObj);
}
function cancelExportMaterial(divisionName, cityName, material) {
    const index = material.exports.findIndex((exp) => exp.division === divisionName && exp.city === cityName);
    if (index === -1)
        return;
    material.exports.splice(index, 1);
}
function limitProductProduction(product, cityName, quantity) {
    if (quantity < 0 || isNaN(quantity)) {
        product.cityData[cityName].productionLimit = null;
    }
    else {
        product.cityData[cityName].productionLimit = quantity;
    }
}
function limitMaterialProduction(material, quantity) {
    if (quantity < 0 || isNaN(quantity)) {
        material.productionLimit = null;
    }
    else {
        material.productionLimit = quantity;
    }
}
function setMaterialMarketTA1(material, on) {
    material.marketTa1 = on;
}
function setMaterialMarketTA2(material, on) {
    material.marketTa2 = on;
}
function setProductMarketTA1(product, on) {
    product.marketTa1 = on;
}
function setProductMarketTA2(product, on) {
    product.marketTa2 = on;
}
function bribe(corporation, fundsForBribing, factionName) {
    if (!Number.isFinite(fundsForBribing) || fundsForBribing <= 0 || corporation.funds < fundsForBribing) {
        return {
            success: false,
            message: "Invalid amount of cash for bribing.",
        };
    }
    if (corporation.valuation < corpConstants.bribeThreshold) {
        return {
            success: false,
            message: `The corporation valuation is below the threshold. Threshold: ${(0, formatNumber_1.formatNumber)(corpConstants.bribeThreshold)}.`,
        };
    }
    if (!_player_1.Player.factions.includes(factionName)) {
        return {
            success: false,
            message: `You are not a member of ${factionName}.`,
        };
    }
    const faction = Factions_1.Factions[factionName];
    const factionInfo = faction.getInfo();
    if (!factionInfo.offersWork()) {
        return {
            success: false,
            message: `${factionName} cannot be bribed. It does not offer any types of work.`,
        };
    }
    const reputationGain = fundsForBribing / corpConstants.bribeAmountPerReputation;
    faction.playerReputation += reputationGain;
    corporation.loseFunds(fundsForBribing, "bribery");
    return {
        success: true,
        reputationGain,
    };
}
