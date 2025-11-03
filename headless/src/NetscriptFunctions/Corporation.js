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
exports.NetscriptCorporation = NetscriptCorporation;
const _player_1 = require("@player");
const Corporation_1 = require("../Corporation/Corporation");
const lodash_1 = require("lodash");
const Actions_1 = require("../Corporation/Actions");
const CorporationUnlocks_1 = require("../Corporation/data/CorporationUnlocks");
const CorporationUpgrades_1 = require("../Corporation/data/CorporationUpgrades");
const _enums_1 = require("@enums");
const IndustryData_1 = require("../Corporation/data/IndustryData");
const corpConstants = __importStar(require("../Corporation/data/Constants"));
const ResearchMap_1 = require("../Corporation/ResearchMap");
const APIWrapper_1 = require("../Netscript/APIWrapper");
const NetscriptHelpers_1 = require("../Netscript/NetscriptHelpers");
const EnumHelper_1 = require("../utils/EnumHelper");
const MaterialInfo_1 = require("../Corporation/MaterialInfo");
const helpers_1 = require("../Corporation/helpers");
const Record_1 = require("../Types/Record");
const DeprecationHelper_1 = require("../utils/DeprecationHelper");
function NetscriptCorporation() {
    function hasUnlock(unlockName) {
        const corporation = getCorporation();
        return corporation.unlocks.has(unlockName);
    }
    function getUnlockCost(unlockName) {
        return CorporationUnlocks_1.CorpUnlocks[unlockName].price;
    }
    function getUpgradeLevel(upgradeName) {
        const corporation = getCorporation();
        return corporation.upgrades[upgradeName].level;
    }
    function getUpgradeLevelCost(upgradeName) {
        const corporation = getCorporation();
        const upgrade = CorporationUpgrades_1.CorpUpgrades[upgradeName];
        const cost = (0, helpers_1.calculateUpgradeCost)(upgrade.basePrice, upgrade.priceMult, corporation.upgrades[upgradeName].level, 1);
        return cost;
    }
    function getResearchCost(division, researchName) {
        const researchTree = IndustryData_1.IndustryResearchTrees[division.industry];
        if (researchTree === undefined)
            throw new Error(`No research tree for industry '${division.industry}'`);
        const allResearch = researchTree.getAllNodes();
        if (!allResearch.includes(researchName))
            throw new Error(`No research named '${researchName}'`);
        const research = ResearchMap_1.ResearchMap[researchName];
        return research.cost;
    }
    function hasResearched(division, researchName) {
        return division.researched.has(researchName);
    }
    function getCorporation() {
        const corporation = _player_1.Player.corporation;
        if (corporation === null)
            throw new Error("cannot be called without a corporation");
        return corporation;
    }
    function getDivision(divisionName) {
        const corporation = getCorporation();
        const division = corporation.divisions.get(divisionName);
        if (division === undefined)
            throw new Error(`No division named '${divisionName}'`);
        return division;
    }
    function getOffice(divisionName, cityName) {
        const division = getDivision(divisionName);
        const office = division.offices[cityName];
        if (!office)
            throw new Error(`${division.name} has not expanded to '${cityName}'`);
        return office;
    }
    function getWarehouse(divisionName, cityName) {
        const division = getDivision(divisionName);
        const warehouse = division.warehouses[cityName];
        if (!warehouse)
            throw new Error(`${division.name} does not have a warehouse in '${cityName}'`);
        return warehouse;
    }
    function getMaterial(divisionName, cityName, materialName) {
        const warehouse = getWarehouse(divisionName, cityName);
        const material = warehouse.materials[materialName];
        return material;
    }
    function getProduct(divisionName, productName) {
        const division = getDivision(divisionName);
        const product = division.products.get(productName);
        if (product === undefined)
            throw new Error(`Invalid product name: '${productName}'`);
        return product;
    }
    function checkAccess(ctx, api) {
        if (!_player_1.Player.corporation)
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, "Must own a corporation.");
        if (!api)
            return;
        if (!_player_1.Player.corporation.unlocks.has(api)) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, "You do not have access to this API.");
        }
    }
    function getSafeDivision(division) {
        const cities = (0, Record_1.getRecordKeys)(division.offices);
        const data = {
            name: division.name,
            industry: division.industry,
            awareness: division.awareness,
            popularity: division.popularity,
            productionMult: division.productionMult,
            researchPoints: division.researchPoints,
            lastCycleRevenue: division.lastCycleRevenue,
            lastCycleExpenses: division.lastCycleExpenses,
            thisCycleRevenue: division.thisCycleRevenue,
            thisCycleExpenses: division.thisCycleExpenses,
            numAdVerts: division.numAdVerts,
            cities: cities,
            products: [...division.products.keys()],
            makesProducts: division.makesProducts,
            maxProducts: division.maxProducts,
        };
        (0, DeprecationHelper_1.setDeprecatedProperties)(data, {
            type: {
                identifier: "ns.corporation.getDivision().type",
                message: "Use ns.corporation.getDivision().industry instead.",
                value: data.industry,
            },
        });
        return data;
    }
    const warehouseAPI = {
        getUpgradeWarehouseCost: (ctx) => (_divisionName, _cityName, _amt = 1) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const amt = NetscriptHelpers_1.helpers.number(ctx, "amount", _amt);
            if (amt < 1) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, "You must provide a positive number");
            }
            const warehouse = getWarehouse(divisionName, cityName);
            return (0, Actions_1.upgradeWarehouseCost)(warehouse.level, amt);
        },
        hasWarehouse: (ctx) => (_divisionName, _cityName) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const division = getDivision(divisionName);
            return cityName in division.warehouses;
        },
        getWarehouse: (ctx) => (_divisionName, _cityName) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const warehouse = getWarehouse(divisionName, cityName);
            return {
                level: warehouse.level,
                city: warehouse.city,
                size: warehouse.size,
                sizeUsed: warehouse.sizeUsed,
                smartSupplyEnabled: warehouse.smartSupplyEnabled,
            };
        },
        getMaterial: (ctx) => (_divisionName, _cityName, _materialName) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const materialName = (0, EnumHelper_1.getEnumHelper)("CorpMaterialName").nsGetMember(ctx, _materialName, "materialName");
            const material = getMaterial(divisionName, cityName, materialName);
            const corporation = getCorporation();
            const exports = structuredClone(material.exports);
            return {
                marketPrice: material.marketPrice,
                desiredSellPrice: material.desiredSellPrice,
                desiredSellAmount: material.desiredSellAmount,
                name: material.name,
                stored: material.stored,
                quality: material.quality,
                demand: corporation.unlocks.has(_enums_1.CorpUnlockName.MarketResearchDemand) ? material.demand : undefined,
                competition: corporation.unlocks.has(_enums_1.CorpUnlockName.MarketDataCompetition) ? material.competition : undefined,
                buyAmount: material.buyAmount,
                productionAmount: material.productionAmount,
                importAmount: material.importAmount,
                actualSellAmount: material.actualSellAmount,
                exports: exports,
                productionLimit: material.productionLimit,
            };
        },
        getProduct: (ctx) => (_divisionName, _cityName, _productName) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const productName = NetscriptHelpers_1.helpers.string(ctx, "productName", _productName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const product = getProduct(divisionName, productName);
            const corporation = getCorporation();
            const cityData = product.cityData[cityName];
            return {
                name: product.name,
                demand: corporation.unlocks.has(_enums_1.CorpUnlockName.MarketResearchDemand) ? product.demand : undefined,
                competition: corporation.unlocks.has(_enums_1.CorpUnlockName.MarketDataCompetition) ? product.competition : undefined,
                rating: product.rating,
                effectiveRating: cityData.effectiveRating,
                stats: structuredClone(product.stats),
                productionCost: cityData.productionCost,
                desiredSellPrice: cityData.desiredSellPrice,
                desiredSellAmount: cityData.desiredSellAmount,
                stored: cityData.stored,
                productionAmount: cityData.productionAmount,
                actualSellAmount: cityData.actualSellAmount,
                developmentProgress: product.developmentProgress,
                advertisingInvestment: product.advertisingInvestment,
                designInvestment: product.designInvestment,
                size: product.size,
                productionLimit: cityData.productionLimit,
            };
        },
        purchaseWarehouse: (ctx) => (_divisionName, _cityName) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const corporation = getCorporation();
            (0, Actions_1.purchaseWarehouse)(corporation, getDivision(divisionName), cityName);
        },
        upgradeWarehouse: (ctx) => (_divisionName, _cityName, _amt = 1) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const amt = NetscriptHelpers_1.helpers.number(ctx, "amount", _amt);
            const corporation = getCorporation();
            if (amt < 1) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, "You must provide a positive number");
            }
            (0, Actions_1.upgradeWarehouse)(corporation, getDivision(divisionName), getWarehouse(divisionName, cityName), amt);
        },
        sellMaterial: (ctx) => (_divisionName, _cityName, _materialName, _amt, _price) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const materialName = (0, EnumHelper_1.getEnumHelper)("CorpMaterialName").nsGetMember(ctx, _materialName, "materialName");
            const amt = NetscriptHelpers_1.helpers.string(ctx, "amt", _amt);
            const price = NetscriptHelpers_1.helpers.string(ctx, "price", _price);
            const material = getMaterial(divisionName, cityName, materialName);
            (0, Actions_1.sellMaterial)(material, amt, price);
        },
        sellProduct: (ctx) => (_divisionName, _cityName, _productName, _amt, _price, _all) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const productName = NetscriptHelpers_1.helpers.string(ctx, "productName", _productName);
            const amt = NetscriptHelpers_1.helpers.string(ctx, "amt", _amt);
            const price = NetscriptHelpers_1.helpers.string(ctx, "price", _price);
            const all = !!_all;
            const product = getProduct(divisionName, productName);
            (0, Actions_1.sellProduct)(product, cityName, amt, price, all);
        },
        discontinueProduct: (ctx) => (_divisionName, _productName) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const productName = NetscriptHelpers_1.helpers.string(ctx, "productName", _productName);
            getDivision(divisionName).discontinueProduct(productName);
        },
        setSmartSupply: (ctx) => (_divisionName, _cityName, _enabled) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const enabled = !!_enabled;
            const warehouse = getWarehouse(divisionName, cityName);
            if (!hasUnlock(_enums_1.CorpUnlockName.SmartSupply))
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `You have not purchased the Smart Supply upgrade!`);
            (0, Actions_1.setSmartSupply)(warehouse, enabled);
        },
        setSmartSupplyOption: (ctx) => (_divisionName, _cityName, _materialName, _option) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const materialName = (0, EnumHelper_1.getEnumHelper)("CorpMaterialName").nsGetMember(ctx, _materialName, "materialName");
            const warehouse = getWarehouse(divisionName, cityName);
            const material = getMaterial(divisionName, cityName, materialName);
            const option = (0, EnumHelper_1.getEnumHelper)("SmartSupplyOption").nsGetMember(ctx, _option);
            if (!hasUnlock(_enums_1.CorpUnlockName.SmartSupply))
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `You have not purchased the Smart Supply upgrade!`);
            (0, Actions_1.setSmartSupplyOption)(warehouse, material, option);
        },
        buyMaterial: (ctx) => (_divisionName, _cityName, _materialName, _amt) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const division = getCorporation().divisions.get(divisionName);
            if (!division)
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `No division with provided name ${divisionName}`);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const materialName = (0, EnumHelper_1.getEnumHelper)("CorpMaterialName").nsGetMember(ctx, _materialName, "materialName");
            const amt = NetscriptHelpers_1.helpers.number(ctx, "amt", _amt);
            const material = getMaterial(divisionName, cityName, materialName);
            (0, Actions_1.buyMaterial)(division, material, amt);
        },
        bulkPurchase: (ctx) => (_divisionName, _cityName, _materialName, _amt) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const division = getCorporation().divisions.get(divisionName);
            if (!division)
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `No division with provided name ${divisionName}`);
            const corporation = getCorporation();
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const materialName = (0, EnumHelper_1.getEnumHelper)("CorpMaterialName").nsGetMember(ctx, _materialName, "materialName");
            const amt = NetscriptHelpers_1.helpers.number(ctx, "amt", _amt);
            const warehouse = getWarehouse(divisionName, cityName);
            const material = getMaterial(divisionName, cityName, materialName);
            (0, Actions_1.bulkPurchase)(corporation, division, warehouse, material, amt);
        },
        makeProduct: (ctx) => (_divisionName, _cityName, _productName, _designInvest, _marketingInvest) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const productName = NetscriptHelpers_1.helpers.string(ctx, "productName", _productName);
            const designInvest = NetscriptHelpers_1.helpers.number(ctx, "designInvest", _designInvest);
            const marketingInvest = NetscriptHelpers_1.helpers.number(ctx, "marketingInvest", _marketingInvest);
            const corporation = getCorporation();
            (0, Actions_1.makeProduct)(corporation, getDivision(divisionName), cityName, productName, designInvest, marketingInvest);
        },
        limitProductProduction: (ctx) => (_divisionName, _cityName, _productName, _qty) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const productName = NetscriptHelpers_1.helpers.string(ctx, "productName", _productName);
            const qty = NetscriptHelpers_1.helpers.number(ctx, "qty", _qty);
            (0, Actions_1.limitProductProduction)(getProduct(divisionName, productName), cityName, qty);
        },
        exportMaterial: (ctx) => (_sourceDivision, _sourceCity, _targetDivision, _targetCity, _materialName, _amt) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            if (!hasUnlock(_enums_1.CorpUnlockName.Export)) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `You have not unlocked the Export feature!`);
            }
            const sourceDivision = NetscriptHelpers_1.helpers.string(ctx, "sourceDivision", _sourceDivision);
            const sourceCity = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _sourceCity, "sourceCity");
            const targetDivision = getDivision(NetscriptHelpers_1.helpers.string(ctx, "targetDivision", _targetDivision));
            const targetCity = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _targetCity, "targetCity");
            const materialName = (0, EnumHelper_1.getEnumHelper)("CorpMaterialName").nsGetMember(ctx, _materialName, "materialName");
            const amt = NetscriptHelpers_1.helpers.string(ctx, "amt", _amt);
            (0, Actions_1.exportMaterial)(targetDivision, targetCity, getMaterial(sourceDivision, sourceCity, materialName), amt);
        },
        cancelExportMaterial: (ctx) => (_sourceDivision, _sourceCity, _targetDivision, _targetCity, _materialName) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            if (!hasUnlock(_enums_1.CorpUnlockName.Export)) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `You have not unlocked the Export feature!`);
            }
            const sourceDivision = NetscriptHelpers_1.helpers.string(ctx, "sourceDivision", _sourceDivision);
            const sourceCity = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _sourceCity, "sourceCity");
            const targetDivision = NetscriptHelpers_1.helpers.string(ctx, "targetDivision", _targetDivision);
            const targetCity = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _targetCity, "targetCity");
            const materialName = (0, EnumHelper_1.getEnumHelper)("CorpMaterialName").nsGetMember(ctx, _materialName, "materialName");
            (0, Actions_1.cancelExportMaterial)(targetDivision, targetCity, getMaterial(sourceDivision, sourceCity, materialName));
        },
        limitMaterialProduction: (ctx) => (_divisionName, _cityName, _materialName, _qty) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const materialName = (0, EnumHelper_1.getEnumHelper)("CorpMaterialName").nsGetMember(ctx, _materialName, "materialName");
            const qty = NetscriptHelpers_1.helpers.number(ctx, "qty", _qty);
            (0, Actions_1.limitMaterialProduction)(getMaterial(divisionName, cityName, materialName), qty);
        },
        setMaterialMarketTA1: (ctx) => (_divisionName, _cityName, _materialName, _on) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const materialName = (0, EnumHelper_1.getEnumHelper)("CorpMaterialName").nsGetMember(ctx, _materialName, "materialName");
            const on = !!_on;
            if (!getDivision(divisionName).hasResearch("Market-TA.I"))
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `You have not researched MarketTA.I for division: ${divisionName}`);
            (0, Actions_1.setMaterialMarketTA1)(getMaterial(divisionName, cityName, materialName), on);
        },
        setMaterialMarketTA2: (ctx) => (_divisionName, _cityName, _materialName, _on) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const materialName = (0, EnumHelper_1.getEnumHelper)("CorpMaterialName").nsGetMember(ctx, _materialName, "materialName");
            const on = !!_on;
            if (!getDivision(divisionName).hasResearch("Market-TA.II"))
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `You have not researched MarketTA.II for division: ${divisionName}`);
            (0, Actions_1.setMaterialMarketTA2)(getMaterial(divisionName, cityName, materialName), on);
        },
        setProductMarketTA1: (ctx) => (_divisionName, _productName, _on) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const productName = NetscriptHelpers_1.helpers.string(ctx, "productName", _productName);
            const on = !!_on;
            if (!getDivision(divisionName).hasResearch("Market-TA.I"))
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `You have not researched MarketTA.I for division: ${divisionName}`);
            (0, Actions_1.setProductMarketTA1)(getProduct(divisionName, productName), on);
        },
        setProductMarketTA2: (ctx) => (_divisionName, _productName, _on) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.WarehouseAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const productName = NetscriptHelpers_1.helpers.string(ctx, "productName", _productName);
            const on = !!_on;
            if (!getDivision(divisionName).hasResearch("Market-TA.II"))
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `You have not researched MarketTA.II for division: ${divisionName}`);
            (0, Actions_1.setProductMarketTA2)(getProduct(divisionName, productName), on);
        },
    };
    const officeAPI = {
        getHireAdVertCost: (ctx) => (_divisionName) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.OfficeAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const division = getDivision(divisionName);
            return division.getAdVertCost();
        },
        getHireAdVertCount: (ctx) => (_divisionName) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.OfficeAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const division = getDivision(divisionName);
            return division.numAdVerts;
        },
        getResearchCost: (ctx) => (_divisionName, _researchName) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.OfficeAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const researchName = (0, EnumHelper_1.getEnumHelper)("CorpResearchName").nsGetMember(ctx, _researchName, "researchName");
            return getResearchCost(getDivision(divisionName), researchName);
        },
        hasResearched: (ctx) => (_divisionName, _researchName) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.OfficeAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const researchName = (0, EnumHelper_1.getEnumHelper)("CorpResearchName").nsGetMember(ctx, _researchName, "researchName");
            return hasResearched(getDivision(divisionName), researchName);
        },
        getOfficeSizeUpgradeCost: (ctx) => (_divisionName, _cityName, _increase) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.OfficeAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const increase = NetscriptHelpers_1.helpers.positiveInteger(ctx, "increase", _increase);
            const office = getOffice(divisionName, cityName);
            return (0, helpers_1.calculateOfficeSizeUpgradeCost)(office.size, increase);
        },
        setJobAssignment: (ctx) => (_divisionName, _cityName, _job, _amount) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.OfficeAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const amount = NetscriptHelpers_1.helpers.number(ctx, "amount", _amount);
            const job = (0, EnumHelper_1.getEnumHelper)("CorpEmployeeJob").nsGetMember(ctx, _job, "job");
            if (job === _enums_1.CorpEmployeeJob.Unassigned) {
                NetscriptHelpers_1.helpers.log(ctx, () => `This API will not do anything and just return false if you pass "Unassigned" to the "job" parameter.`);
                return false;
            }
            if (amount < 0 || !Number.isInteger(amount)) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid value for amount! Must be an integer and greater than or be 0". Amount:'${amount}'`);
            }
            const office = getOffice(divisionName, cityName);
            const totalNewEmployees = amount - office.employeeNextJobs[job];
            if (office.employeeNextJobs[_enums_1.CorpEmployeeJob.Unassigned] < totalNewEmployees) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Unable to bring '${job} employees to ${amount}. Requires ${totalNewEmployees} unassigned employees`);
            }
            return office.autoAssignJob(job, amount);
        },
        hireEmployee: (ctx) => (_divisionName, _cityName, _position) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.OfficeAPI);
            _position ?? (_position = _enums_1.CorpEmployeeJob.Unassigned);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const position = (0, EnumHelper_1.getEnumHelper)("CorpEmployeeJob").nsGetMember(ctx, _position, "position");
            const office = getOffice(divisionName, cityName);
            return office.hireRandomEmployee(position);
        },
        upgradeOfficeSize: (ctx) => (_divisionName, _cityName, _size) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.OfficeAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const size = NetscriptHelpers_1.helpers.positiveInteger(ctx, "size", _size);
            const office = getOffice(divisionName, cityName);
            const corporation = getCorporation();
            (0, Actions_1.upgradeOfficeSize)(corporation, office, size);
        },
        throwParty: (ctx) => (_divisionName, _cityName, _costPerEmployee) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.OfficeAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const costPerEmployee = NetscriptHelpers_1.helpers.number(ctx, "costPerEmployee", _costPerEmployee);
            if (costPerEmployee < 0) {
                throw new Error("Invalid value for Cost Per Employee field! Must be numeric and greater than 0");
            }
            const corporation = getCorporation();
            const office = getOffice(divisionName, cityName);
            return (0, Actions_1.throwParty)(corporation, office, costPerEmployee);
        },
        buyTea: (ctx) => (_divisionName, _cityName) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.OfficeAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const corporation = getCorporation();
            const office = getOffice(divisionName, cityName);
            return (0, Actions_1.buyTea)(corporation, office);
        },
        hireAdVert: (ctx) => (_divisionName) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.OfficeAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const corporation = getCorporation();
            (0, Actions_1.hireAdVert)(corporation, getDivision(divisionName));
        },
        research: (ctx) => (_divisionName, _researchName) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.OfficeAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const researchName = (0, EnumHelper_1.getEnumHelper)("CorpResearchName").nsGetMember(ctx, _researchName, "researchName");
            (0, Actions_1.research)(getDivision(divisionName), researchName);
        },
        getOffice: (ctx) => (_divisionName, _cityName) => {
            checkAccess(ctx, _enums_1.CorpUnlockName.OfficeAPI);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const office = getOffice(divisionName, cityName);
            return {
                city: office.city,
                size: office.size,
                maxEnergy: office.maxEnergy,
                maxMorale: office.maxMorale,
                numEmployees: office.numEmployees,
                avgEnergy: office.avgEnergy,
                avgMorale: office.avgMorale,
                totalExperience: office.totalExperience,
                employeeProductionByJob: Object.assign({}, office.employeeProductionByJob),
                employeeJobs: Object.assign({}, office.employeeJobs),
            };
        },
    };
    // TODO 2.2: Add removed function error dialogs for all the functions removed/replaced by getConstants.
    const corpFunctions = {
        ...warehouseAPI,
        ...officeAPI,
        hasCorporation: () => () => !!_player_1.Player.corporation,
        canCreateCorporation: (ctx) => (_selfFund) => {
            const selfFund = !!_selfFund;
            const checkResult = (0, helpers_1.canCreateCorporation)(selfFund, false);
            if (checkResult !== _enums_1.CreatingCorporationCheckResultEnum.Success) {
                NetscriptHelpers_1.helpers.log(ctx, () => (0, helpers_1.convertCreatingCorporationCheckResultToMessage)(checkResult));
            }
            return checkResult;
        },
        createCorporation: (ctx) => (_corporationName, _selfFund = true) => {
            const corporationName = NetscriptHelpers_1.helpers.string(ctx, "corporationName", _corporationName);
            const selfFund = !!_selfFund;
            const result = (0, Actions_1.createCorporation)(corporationName, selfFund, false);
            if (!result.success) {
                NetscriptHelpers_1.helpers.log(ctx, () => result.message);
            }
            return result.success;
        },
        getConstants: () => () => {
            /* TODO 2.2: possibly just rework the whole corp constants structure to be more readable, and just use
             *           structuredClone to provide it directly to player.
             * TODO 2.2: Roll product information into industriesData, there's no reason to look up a product separately */
            // TODO: add functions for getting materialInfo and research info
            return structuredClone((0, lodash_1.omit)(corpConstants, "fundingRoundShares", "fundingRoundMultiplier", "valuationLength"));
        },
        getIndustryData: (ctx) => (_industryName) => {
            checkAccess(ctx);
            const industryName = (0, EnumHelper_1.getEnumHelper)("IndustryType").nsGetMember(ctx, _industryName, "industryName");
            return structuredClone(IndustryData_1.IndustriesData[industryName]);
        },
        getMaterialData: (ctx) => (_materialName) => {
            checkAccess(ctx);
            const materialName = (0, EnumHelper_1.getEnumHelper)("CorpMaterialName").nsGetMember(ctx, _materialName, "materialName");
            return structuredClone(MaterialInfo_1.MaterialInfo[materialName]);
        },
        expandIndustry: (ctx) => (_industryName, _divisionName) => {
            checkAccess(ctx);
            const industryName = (0, EnumHelper_1.getEnumHelper)("IndustryType").nsGetMember(ctx, _industryName, "industryName");
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const corporation = getCorporation();
            (0, Actions_1.createDivision)(corporation, industryName, divisionName);
        },
        expandCity: (ctx) => (_divisionName, _cityName) => {
            checkAccess(ctx);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            const corporation = getCorporation();
            const division = getDivision(divisionName);
            (0, Actions_1.purchaseOffice)(corporation, division, cityName);
        },
        purchaseUnlock: (ctx) => (_unlockName) => {
            checkAccess(ctx);
            const unlockName = (0, EnumHelper_1.getEnumHelper)("CorpUnlockName").nsGetMember(ctx, _unlockName, "unlockName");
            const corporation = getCorporation();
            const result = corporation.purchaseUnlock(unlockName);
            if (!result.success) {
                throw new Error(`Could not unlock ${unlockName}: ${result.message}`);
            }
        },
        levelUpgrade: (ctx) => (_upgradeName) => {
            checkAccess(ctx);
            const upgradeName = (0, EnumHelper_1.getEnumHelper)("CorpUpgradeName").nsGetMember(ctx, _upgradeName, "upgradeName");
            const corporation = getCorporation();
            const result = corporation.purchaseUpgrade(upgradeName, 1);
            if (!result.success) {
                throw new Error(`Could not upgrade ${upgradeName}: ${result.message}`);
            }
        },
        issueDividends: (ctx) => (_rate) => {
            checkAccess(ctx);
            const rate = NetscriptHelpers_1.helpers.number(ctx, "rate", _rate);
            const max = corpConstants.dividendMaxRate;
            if (rate < 0 || rate > max)
                throw new Error(`Invalid value for rate field! Must be numeric, greater than 0, and less than ${max}`);
            const corporation = getCorporation();
            if (!corporation.public)
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Your company has not gone public!`);
            (0, Actions_1.issueDividends)(corporation, rate);
        },
        issueNewShares: (ctx) => (_amount) => {
            checkAccess(ctx);
            const corporation = getCorporation();
            const maxNewShares = corporation.calculateMaxNewShares();
            if (_amount == undefined)
                _amount = maxNewShares;
            const amount = NetscriptHelpers_1.helpers.number(ctx, "amount", _amount);
            const [funds] = (0, Actions_1.issueNewShares)(corporation, amount);
            return funds;
        },
        getDivision: (ctx) => (_divisionName) => {
            checkAccess(ctx);
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            const division = getDivision(divisionName);
            return getSafeDivision(division);
        },
        getCorporation: (ctx) => () => {
            checkAccess(ctx);
            const corporation = getCorporation();
            const data = {
                name: corporation.name,
                funds: corporation.funds,
                revenue: corporation.revenue,
                expenses: corporation.expenses,
                public: corporation.public,
                totalShares: corporation.totalShares,
                numShares: corporation.numShares,
                shareSaleCooldown: corporation.shareSaleCooldown,
                investorShares: corporation.investorShares,
                issuedShares: corporation.issuedShares,
                issueNewSharesCooldown: corporation.issueNewSharesCooldown,
                sharePrice: corporation.sharePrice,
                dividendRate: corporation.dividendRate,
                tributeModifier: corporation.tributeModifier,
                dividendEarnings: corporation.getCycleDividends() / corpConstants.secondsPerMarketCycle,
                nextState: corporation.state.nextName,
                prevState: corporation.state.prevName,
                divisions: [...corporation.divisions.keys()],
                valuation: corporation.valuation,
            };
            return data;
        },
        hasUnlock: (ctx) => (_unlockName) => {
            checkAccess(ctx);
            const unlockName = (0, EnumHelper_1.getEnumHelper)("CorpUnlockName").nsGetMember(ctx, _unlockName, "unlockName");
            return hasUnlock(unlockName);
        },
        getUnlockCost: (ctx) => (_unlockName) => {
            checkAccess(ctx);
            const unlockName = (0, EnumHelper_1.getEnumHelper)("CorpUnlockName").nsGetMember(ctx, _unlockName, "unlockName");
            return getUnlockCost(unlockName);
        },
        getUpgradeLevel: (ctx) => (_upgradeName) => {
            checkAccess(ctx);
            const upgradeName = (0, EnumHelper_1.getEnumHelper)("CorpUpgradeName").nsGetMember(ctx, _upgradeName, "upgradeName");
            return getUpgradeLevel(upgradeName);
        },
        getUpgradeLevelCost: (ctx) => (_upgradeName) => {
            checkAccess(ctx);
            const upgradeName = (0, EnumHelper_1.getEnumHelper)("CorpUpgradeName").nsGetMember(ctx, _upgradeName, "upgradeName");
            return getUpgradeLevelCost(upgradeName);
        },
        getInvestmentOffer: (ctx) => () => {
            checkAccess(ctx);
            const corporation = getCorporation();
            return corporation.getInvestmentOffer();
        },
        acceptInvestmentOffer: (ctx) => () => {
            checkAccess(ctx);
            const corporation = getCorporation();
            try {
                (0, Actions_1.acceptInvestmentOffer)(corporation);
                return true;
            }
            catch (err) {
                return false;
            }
        },
        goPublic: (ctx) => (_numShares) => {
            checkAccess(ctx);
            const corporation = getCorporation();
            if (corporation.public)
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, "Corporation is already public");
            const numShares = NetscriptHelpers_1.helpers.number(ctx, "numShares", _numShares);
            (0, Actions_1.goPublic)(corporation, numShares);
            return true;
        },
        sellShares: (ctx) => (_numShares) => {
            checkAccess(ctx);
            const numShares = NetscriptHelpers_1.helpers.number(ctx, "numShares", _numShares);
            return (0, Actions_1.sellShares)(getCorporation(), numShares);
        },
        buyBackShares: (ctx) => (_numShares) => {
            checkAccess(ctx);
            const numShares = NetscriptHelpers_1.helpers.number(ctx, "numShares", _numShares);
            return (0, Actions_1.buyBackShares)(getCorporation(), numShares);
        },
        bribe: (ctx) => (_factionName, _amountCash) => {
            checkAccess(ctx);
            const factionName = (0, EnumHelper_1.getEnumHelper)("FactionName").nsGetMember(ctx, _factionName);
            const amountCash = NetscriptHelpers_1.helpers.positiveNumber(ctx, "amountCash", _amountCash);
            const result = (0, Actions_1.bribe)(getCorporation(), amountCash, factionName);
            if (!result.success) {
                NetscriptHelpers_1.helpers.log(ctx, () => result.message);
            }
            return result.success;
        },
        getBonusTime: (ctx) => () => {
            checkAccess(ctx);
            return getCorporation().storedCycles * 200;
        },
        nextUpdate: (ctx) => () => {
            checkAccess(ctx);
            if (!Corporation_1.CorporationPromise.promise)
                Corporation_1.CorporationPromise.promise = new Promise((res) => (Corporation_1.CorporationPromise.resolve = res));
            return Corporation_1.CorporationPromise.promise;
        },
        sellDivision: (ctx) => (_divisionName) => {
            checkAccess(ctx);
            const corporation = getCorporation();
            const divisionName = NetscriptHelpers_1.helpers.string(ctx, "divisionName", _divisionName);
            (0, Actions_1.removeDivision)(corporation, divisionName);
        },
    };
    // Removed functions
    (0, APIWrapper_1.setRemovedFunctions)(corpFunctions, {
        assignJob: {
            version: "2.2.0",
            replacement: "Removed due to employees no longer being objects. Use ns.corporation.setJobAssignment instead.",
            replaceMsg: true,
        },
        getEmployee: {
            version: "2.2.0",
            replacement: "Removed due to employees no longer being individual objects.",
            replaceMsg: true,
        },
        getExpandCityCost: { version: "2.2.0", replacement: "corporation.getConstants().officeInitialCost" },
        getExpandIndustryCost: { version: "2.2.0", replacement: "corporation.getIndustryData" },
        getIndustryTypes: { version: "2.2.0", replacement: "corporation.getConstants().industryNames" },
        getMaterialNames: { version: "2.2.0", replacement: "corporation.getConstants().materialNames" },
        getPurchaseWarehouseCost: { version: "2.2.0", replacement: "corporation.getConstants().warehouseInitialCost" },
        getResearchNames: { version: "2.2.0", replacement: "corporation.getConstants().researchNames" },
        getUnlockables: { version: "2.2.0", replacement: "corporation.getConstants().unlockNames" },
        getUpgradeNames: { version: "2.2.0", replacement: "corporation.getConstants().upgradeNames" },
        setAutoJobAssignment: { version: "3.0.0", replacement: "corporation.setJobAssignment()" },
    });
    return corpFunctions;
}
