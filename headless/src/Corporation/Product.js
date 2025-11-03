"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const _enums_1 = require("@enums");
const IndustryData_1 = require("./data/IndustryData");
const MaterialInfo_1 = require("./MaterialInfo");
const JSONReviver_1 = require("../utils/JSONReviver");
const getRandomIntInclusive_1 = require("../utils/helpers/getRandomIntInclusive");
const Record_1 = require("../Types/Record");
/** A corporation product. Products are shared across the entire division, unlike materials which are per-warehouse */
class Product {
    constructor(params = null) {
        /** Name of the product */
        this.name = "DefaultProductName";
        /** Demand for this product, which goes down over time. */
        this.demand = 0;
        /** Competition for this product */
        this.competition = 0;
        /** Markup. Affects how high of a price you can charge for this Product
        without suffering a loss in the # of sales */
        this.markup = 0;
        /** Whether the development for this product is finished yet */
        this.finished = false;
        this.developmentProgress = 0; // Creation progress - A number between 0-100 representing percentage
        this.creationCity = _enums_1.CityName.Sector12; // City in which the product is/was being created
        this.designInvestment = 0; // How much money was invested into designing this Product
        this.advertisingInvestment = 0; // How much money was invested into advertising this Product
        // The average employee productivity and scientific research across the creation of the Product
        this.creationJobFactors = {
            [_enums_1.CorpEmployeeJob.Operations]: 0,
            [_enums_1.CorpEmployeeJob.Engineer]: 0,
            [_enums_1.CorpEmployeeJob.Business]: 0,
            [_enums_1.CorpEmployeeJob.Management]: 0,
            [_enums_1.CorpEmployeeJob.RandD]: 0,
            total: 0,
        };
        // Aggregate score for this Product's 'rating'
        // This is based on the stats/properties below. The weighting of the
        // stats/properties below differs between different industries
        this.rating = 0;
        /** Stats of the product */
        this.stats = {
            quality: 0,
            performance: 0,
            durability: 0,
            reliability: 0,
            aesthetics: 0,
            features: 0,
        };
        // data that is stored per city
        this.cityData = (0, Record_1.createEnumKeyedRecord)(_enums_1.CityName, () => ({
            /** Amount of product stored in warehouse */
            stored: 0,
            /** Amount of this product produced per cycle in this city */
            productionAmount: 0,
            /** Amount of this product that was sold last cycle in this city */
            actualSellAmount: 0,
            /** Total effective rating of the product in this city */
            effectiveRating: 0,
            /** Manual limit on production amount for the product in this city*/
            productionLimit: null,
            /** Player input sell amount e.g. "MAX" */
            desiredSellAmount: 0,
            /** Player input sell price e.g. "MP * 5" */
            desiredSellPrice: "",
            /** Cost of producing this product if buying its component materials at market price */
            productionCost: 0,
        }));
        /** How much warehouse space is occupied per unit of this product */
        this.size = 0;
        /** Required materials per unit of this product */
        this.requiredMaterials = {};
        // Flags that signal whether automatic sale pricing through Market TA is enabled
        this.marketTa1 = false;
        this.marketTa2 = false;
        this.uiMarketPrice = (0, Record_1.createEnumKeyedRecord)(_enums_1.CityName, () => 0);
        /** Effective number that "MAX" represents in a sell amount */
        this.maxSellAmount = 0;
        if (!params)
            return;
        this.name = params.name;
        this.creationCity = params.createCity;
        this.designInvestment = params.designInvestment;
        this.advertisingInvestment = params.advertisingInvestment;
    }
    // Make progress on this product based on current employee productivity
    createProduct(marketCycles, employeeProd) {
        if (this.finished)
            return;
        // Designing/Creating a Product is based mostly off Engineers
        const opProd = employeeProd[_enums_1.CorpEmployeeJob.Operations];
        const engrProd = employeeProd[_enums_1.CorpEmployeeJob.Engineer];
        const mgmtProd = employeeProd[_enums_1.CorpEmployeeJob.Management];
        const total = opProd + engrProd + mgmtProd;
        if (total <= 0) {
            return;
        }
        // Management is a multiplier for the production from Engineers
        const mgmtFactor = 1 + mgmtProd / (1.2 * total);
        const prodMult = (Math.pow(engrProd, 0.34) + Math.pow(opProd, 0.2)) * mgmtFactor;
        const progress = Math.min(marketCycles * 0.01 * prodMult, 100 - this.developmentProgress);
        if (progress <= 0) {
            return;
        }
        this.developmentProgress += progress;
        for (const pos of (0, Record_1.getRecordKeys)(employeeProd)) {
            this.creationJobFactors[pos] += (employeeProd[pos] * progress) / 100;
        }
    }
    // @param division - Division object. Reference to division that makes this Product
    finishProduct(division) {
        this.finished = true;
        // Calculate properties
        const totalProd = this.creationJobFactors.total;
        const engrRatio = this.creationJobFactors[_enums_1.CorpEmployeeJob.Engineer] / totalProd;
        const mgmtRatio = this.creationJobFactors[_enums_1.CorpEmployeeJob.Management] / totalProd;
        const rndRatio = this.creationJobFactors[_enums_1.CorpEmployeeJob.RandD] / totalProd;
        const opsRatio = this.creationJobFactors[_enums_1.CorpEmployeeJob.Operations] / totalProd;
        const busRatio = this.creationJobFactors[_enums_1.CorpEmployeeJob.Business] / totalProd;
        const designMult = 1 + Math.pow(this.designInvestment, 0.1) / 100;
        const balanceMult = 1.2 * engrRatio + 0.9 * mgmtRatio + 1.3 * rndRatio + 1.5 * opsRatio + busRatio;
        const sciMult = 1 + Math.pow(division.researchPoints, division.researchFactor) / 800;
        const totalMult = balanceMult * designMult * sciMult;
        this.stats.quality =
            totalMult *
                (0.1 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Engineer] +
                    0.05 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Management] +
                    0.05 * this.creationJobFactors[_enums_1.CorpEmployeeJob.RandD] +
                    0.02 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Operations] +
                    0.02 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Business]);
        this.stats.performance =
            totalMult *
                (0.15 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Engineer] +
                    0.02 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Management] +
                    0.02 * this.creationJobFactors[_enums_1.CorpEmployeeJob.RandD] +
                    0.02 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Operations] +
                    0.02 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Business]);
        this.stats.durability =
            totalMult *
                (0.05 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Engineer] +
                    0.02 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Management] +
                    0.08 * this.creationJobFactors[_enums_1.CorpEmployeeJob.RandD] +
                    0.05 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Operations] +
                    0.05 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Business]);
        this.stats.reliability =
            totalMult *
                (0.02 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Engineer] +
                    0.08 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Management] +
                    0.02 * this.creationJobFactors[_enums_1.CorpEmployeeJob.RandD] +
                    0.05 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Operations] +
                    0.08 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Business]);
        this.stats.aesthetics =
            totalMult *
                (0.0 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Engineer] +
                    0.08 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Management] +
                    0.05 * this.creationJobFactors[_enums_1.CorpEmployeeJob.RandD] +
                    0.02 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Operations] +
                    0.1 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Business]);
        this.stats.features =
            totalMult *
                (0.08 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Engineer] +
                    0.05 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Management] +
                    0.02 * this.creationJobFactors[_enums_1.CorpEmployeeJob.RandD] +
                    0.05 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Operations] +
                    0.05 * this.creationJobFactors[_enums_1.CorpEmployeeJob.Business]);
        this.calculateRating(division);
        const advMult = 1 + Math.pow(this.advertisingInvestment, 0.1) / 100;
        const busmgtgRatio = Math.max(busRatio + mgmtRatio, 1 / totalProd);
        this.markup = 100 / (advMult * Math.pow(this.stats.quality + 0.001, 0.65) * busmgtgRatio);
        // I actually don't understand well enough to know if this is right.
        // I'm adding this to prevent a crash.
        if (this.markup === 0 || !isFinite(this.markup))
            this.markup = 1;
        this.demand =
            division.awareness === 0 ? 20 : Math.min(100, advMult * (100 * (division.popularity / division.awareness)));
        this.competition = (0, getRandomIntInclusive_1.getRandomIntInclusive)(0, 70);
        //Calculate the product's required materials and size
        this.size = 0;
        for (const [matName, reqQty] of (0, Record_1.getRecordEntries)(division.requiredMaterials)) {
            this.requiredMaterials[matName] = reqQty;
            this.size += MaterialInfo_1.MaterialInfo[matName].size * reqQty;
        }
    }
    calculateRating(industry) {
        const weights = IndustryData_1.IndustriesData[industry.industry].product?.ratingWeights;
        if (!weights) {
            return console.error(`Could not find product rating weights for: ${industry.name}`);
        }
        this.rating = (0, Record_1.getRecordEntries)(weights).reduce((total, [statName, weight]) => total + this.stats[statName] * weight, 0);
    }
    // Serialize the current object to a JSON save state.
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("Product", this);
    }
    // Initializes a Product object from a JSON save state.
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(Product, value.data);
    }
}
exports.Product = Product;
JSONReviver_1.constructorsForReviver.Product = Product;
