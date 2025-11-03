import type { Corporation } from "./Corporation";
import type { Division } from "./Division";
import { CityName } from "@enums";
import { Material } from "./Material";
import { IReviverValue } from "../utils/JSONReviver";
interface IConstructorParams {
    division: Division;
    loc: CityName;
    size: number;
}
export declare class Warehouse {
    level: number;
    city: any;
    materials: Record<APIMaterialName, Material>;
    size: number;
    sizeUsed: number;
    smartSupplyEnabled: boolean;
    smartSupplyOptions: Record<CorpMaterialName, CorpSmartSupplyOption>;
    smartSupplyStore: number;
    constructor(params?: IConstructorParams | null);
    updateMaterialSizeUsed(): void;
    updateSize(corporation: Corporation, division: Division): void;
    toJSON(): IReviverValue;
    static fromJSON(value: IReviverValue): Warehouse;
}
export {};
