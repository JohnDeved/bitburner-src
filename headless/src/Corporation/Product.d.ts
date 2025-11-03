import type { Division } from "./Division";
import { CorpMaterialName } from "@nsdefs";
import { CityName, CorpEmployeeJob } from "@enums";
import { IReviverValue } from "../utils/JSONReviver";
import { PartialRecord } from "../Types/Record";
interface IConstructorParams {
    name: string;
    createCity: CityName;
    designInvestment: number;
    advertisingInvestment: number;
}
/** A corporation product. Products are shared across the entire division, unlike materials which are per-warehouse */
export declare class Product {
    /** Name of the product */
    name: string;
    /** Demand for this product, which goes down over time. */
    demand: number;
    /** Competition for this product */
    competition: number;
    /** Markup. Affects how high of a price you can charge for this Product
    without suffering a loss in the # of sales */
    markup: number;
    /** Whether the development for this product is finished yet */
    finished: boolean;
    developmentProgress: number;
    creationCity: any;
    designInvestment: number;
    advertisingInvestment: number;
    creationJobFactors: {
        [CorpEmployeeJob.Operations]: number;
        [CorpEmployeeJob.Engineer]: number;
        [CorpEmployeeJob.Business]: number;
        [CorpEmployeeJob.Management]: number;
        [CorpEmployeeJob.RandD]: number;
        total: number;
    };
    rating: number;
    /** Stats of the product */
    stats: {
        quality: number;
        performance: number;
        durability: number;
        reliability: number;
        aesthetics: number;
        features: number;
    };
    cityData: Record<string, {
        /** Amount of product stored in warehouse */
        stored: number;
        /** Amount of this product produced per cycle in this city */
        productionAmount: number;
        /** Amount of this product that was sold last cycle in this city */
        actualSellAmount: number;
        /** Total effective rating of the product in this city */
        effectiveRating: number;
        /** Manual limit on production amount for the product in this city*/
        productionLimit: number | null;
        /** Player input sell amount e.g. "MAX" */
        desiredSellAmount: number | string;
        /** Player input sell price e.g. "MP * 5" */
        desiredSellPrice: string | number;
        /** Cost of producing this product if buying its component materials at market price */
        productionCost: number;
    }>;
    /** How much warehouse space is occupied per unit of this product */
    size: number;
    /** Required materials per unit of this product */
    requiredMaterials: PartialRecord<CorpMaterialName, number>;
    marketTa1: boolean;
    marketTa2: boolean;
    uiMarketPrice: Record<string, number>;
    /** Effective number that "MAX" represents in a sell amount */
    maxSellAmount: number;
    constructor(params?: IConstructorParams | null);
    createProduct(marketCycles: number, employeeProd: typeof Product.prototype.creationJobFactors): void;
    finishProduct(division: Division): void;
    calculateRating(industry: Division): void;
    toJSON(): IReviverValue;
    static fromJSON(value: IReviverValue): Product;
}
export {};
