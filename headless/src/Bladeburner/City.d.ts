import { CityName } from "@enums";
import { IReviverValue } from "../utils/JSONReviver";
export declare class City {
    name: CityName;
    pop: number;
    popEst: number;
    comms: number;
    chaos: number;
    constructor(name?: any);
    /** @param {number} p - the percentage change, not the multiplier. e.g. pass in p = 5 for 5% */
    changeChaosByPercentage(p: number): void;
    improvePopulationEstimateByCount(n: number): void;
    /** @param {number} p - the percentage change, not the multiplier. e.g. pass in p = 5 for 5% */
    improvePopulationEstimateByPercentage(p: number, skillMult?: number): void;
    /**
     * @param params.estChange - Number to change the estimate by
     * @param params.estOffset - Offset percentage to apply to estimate */
    changePopulationByCount(n: number, params?: {
        estChange: number;
        estOffset: number;
    }): void;
    /**
     * @param {number} p - the percentage change, not the multiplier. e.g. pass in p = 5 for 5%
     * @param {boolean} params.changeEstEqually - Whether to change the population estimate by an equal amount
     * @param {boolean} params.nonZero - Whether to ensure that population always changes by at least 1 */
    changePopulationByPercentage(p: number, params?: {
        nonZero: boolean;
        changeEstEqually: boolean;
    }): number;
    changeChaosByCount(n: number): void;
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a City object from a JSON save state. */
    static fromJSON(value: IReviverValue): City;
}
