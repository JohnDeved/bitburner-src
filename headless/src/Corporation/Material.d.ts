import { CorpMaterialName } from "@nsdefs";
import { IReviverValue } from "../utils/JSONReviver";
import { Export } from "./Export";
interface IConstructorParams {
    name: CorpMaterialName;
}
export declare class Material {
    name: CorpMaterialName;
    stored: number;
    quality: number;
    demand: number;
    demandRange: number[];
    competition: number;
    competitionRange: number[];
    maxVolatility: number;
    markup: number;
    buyAmount: number;
    actualSellAmount: number;
    productionAmount: number;
    importAmount: number;
    exports: Export[];
    exportedLastCycle: number;
    marketPrice: number;
    averagePrice: number;
    /** null if there is no limit set on production. 0 actually limits production to 0. */
    productionLimit: number | null;
    desiredSellAmount: string | number;
    desiredSellPrice: string | number;
    marketTa1: boolean;
    marketTa2: boolean;
    uiMarketPrice: number;
    maxSellPerCycle: number;
    constructor(params?: IConstructorParams);
    getMarkupLimit(): number;
    processMarket(): void;
    toJSON(): IReviverValue;
    static fromJSON(value: IReviverValue): Material;
}
export {};
