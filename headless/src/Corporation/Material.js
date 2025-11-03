"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Material = void 0;
const JSONReviver_1 = require("../utils/JSONReviver");
const Constants_1 = require("./data/Constants");
const MaterialInfo_1 = require("./MaterialInfo");
class Material {
    constructor(params) {
        // Amount of material owned
        this.stored = 0;
        // Material's "quality". Unbounded
        this.quality = 1;
        // How much demand the Material has in the market, and the range of possible
        // values for this "demand"
        this.demand = 0;
        this.demandRange = [0, 0];
        // How much competition there is for this Material in the market, and the range
        // of possible values for this "competition"
        this.competition = 0;
        this.competitionRange = [0, 0];
        // Maximum volatility of this Materials stats
        this.maxVolatility = 0;
        // Markup. Determines how high of a price you can charge on the material
        // compared to the market price without suffering loss in # of sales
        // Quality is divided by this to determine markup limits
        // e,g, If mku is 10 and quality is 100 then you can markup prices by 100/10 = 10
        this.markup = 0;
        // How much of this material is being bought, sold, imported and produced every second
        this.buyAmount = 0;
        this.actualSellAmount = 0;
        this.productionAmount = 0;
        this.importAmount = 0;
        // Exports of this material to another warehouse/industry
        this.exports = [];
        // Total amount of this material exported in the last cycle
        this.exportedLastCycle = 0;
        // Cost / sec to buy this material. AKA Market Price
        this.marketPrice = 0;
        // Average price paid for the material (accounted as marketPrice for produced/imported materials)
        this.averagePrice = 0;
        /** null if there is no limit set on production. 0 actually limits production to 0. */
        this.productionLimit = null;
        // Player inputs for sell price and amount.
        this.desiredSellAmount = 0;
        this.desiredSellPrice = "";
        // Flags that signal whether automatic sale pricing through Market TA is enabled
        this.marketTa1 = false;
        this.marketTa2 = false;
        this.uiMarketPrice = 0;
        // Determines the maximum amount of this material that can be sold in one market cycle
        this.maxSellPerCycle = 0;
        this.name = params?.name ?? Constants_1.materialNames[0];
        this.demand = MaterialInfo_1.MaterialInfo[this.name].demandBase;
        this.demandRange = MaterialInfo_1.MaterialInfo[this.name].demandRange;
        this.competition = MaterialInfo_1.MaterialInfo[this.name].competitionBase;
        this.competitionRange = MaterialInfo_1.MaterialInfo[this.name].competitionRange;
        this.marketPrice = MaterialInfo_1.MaterialInfo[this.name].baseCost;
        this.averagePrice = this.marketPrice;
        this.maxVolatility = MaterialInfo_1.MaterialInfo[this.name].maxVolatility;
        this.markup = MaterialInfo_1.MaterialInfo[this.name].baseMarkup;
    }
    getMarkupLimit() {
        return this.quality / this.markup;
    }
    // Process change in demand, competition, and buy cost of this material
    processMarket() {
        // The price will change in accordance with demand and competition.
        // e.g. If demand goes up, then so does price. If competition goes up, price goes down
        const priceVolatility = (Math.random() * this.maxVolatility) / 300;
        const priceChange = 1 + priceVolatility;
        //This 1st random check determines whether competition increases or decreases
        const compVolatility = (Math.random() * this.maxVolatility) / 100;
        const compChange = 1 + compVolatility;
        if (Math.random() < 0.5) {
            this.competition *= compChange;
            if (this.competition > this.competitionRange[1]) {
                this.competition = this.competitionRange[1];
            }
            this.marketPrice *= 1 / priceChange; // Competition increases, so price goes down
        }
        else {
            this.competition *= 1 / compChange;
            if (this.competition < this.competitionRange[0]) {
                this.competition = this.competitionRange[0];
            }
            this.marketPrice *= priceChange; // Competition decreases, so price goes up
        }
        // This 2nd random check determines whether demand increases or decreases
        const dmdVolatility = (Math.random() * this.maxVolatility) / 100;
        const dmdChange = 1 + dmdVolatility;
        if (Math.random() < 0.5) {
            this.demand *= dmdChange;
            if (this.demand > this.demandRange[1]) {
                this.demand = this.demandRange[1];
            }
            this.marketPrice *= priceChange; // Demand increases, so price goes up
        }
        else {
            this.demand *= 1 / dmdChange;
            if (this.demand < this.demandRange[0]) {
                this.demand = this.demandRange[0];
            }
            this.marketPrice *= 1 / priceChange;
        }
    }
    // Serialize the current object to a JSON save state.
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("Material", this);
    }
    // Initializes a Material object from a JSON save state.
    static fromJSON(value) {
        const material = (0, JSONReviver_1.Generic_fromJSON)(Material, value.data);
        if (isNaN(material.quality)) {
            material.quality = 1;
        }
        /**
         * averagePrice has not been calculated properly, so if it is an invalid value (Number.isFinite returns false) or 0
         * (wrong initial value), we set it to marketPrice.
         */
        if (!Number.isFinite(material.averagePrice) || material.averagePrice === 0) {
            material.averagePrice = material.marketPrice;
        }
        return material;
    }
}
exports.Material = Material;
JSONReviver_1.constructorsForReviver.Material = Material;
