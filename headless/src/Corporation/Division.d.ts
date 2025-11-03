import { CorpMaterialName, CorpResearchName, CorpStateName } from "@nsdefs";
import { CityName, IndustryType } from "@enums";
import { IReviverValue } from "../utils/JSONReviver";
import { OfficeSpace } from "./OfficeSpace";
import { Product } from "./Product";
import { Warehouse } from "./Warehouse";
import { Corporation } from "./Corporation";
import { JSONMap, JSONSet } from "../Types/Jsonable";
import { PartialRecord } from "../Types/Record";
import { Material } from "./Material";
interface DivisionParams {
    name: string;
    corp: Corporation;
    industry: IndustryType;
}
export declare class Division {
    name: string;
    industry: any;
    researchPoints: number;
    researched: JSONSet<CorpResearchName>;
    requiredMaterials: PartialRecord<CorpMaterialName, number>;
    treeInitialized: boolean;
    /** An array of the name of materials being produced */
    producedMaterials: CorpMaterialName[];
    products: JSONMap<string, Product>;
    makesProducts: boolean;
    get maxProducts(): number;
    awareness: number;
    popularity: number;
    startingCost: number;
    realEstateFactor: number;
    researchFactor: number;
    hardwareFactor: number;
    robotFactor: number;
    aiCoreFactor: number;
    advertisingFactor: number;
    productionMult: number;
    lastCycleRevenue: number;
    lastCycleExpenses: number;
    thisCycleRevenue: number;
    thisCycleExpenses: number;
    newInd: boolean;
    warehouses: PartialRecord<CityName, Warehouse>;
    offices: PartialRecord<CityName, OfficeSpace>;
    numAdVerts: number;
    constructor(params?: DivisionParams | null);
    hasMaximumNumberProducts(): boolean;
    calculateProductionFactors(): void;
    calculateRecoupableValue(): number;
    updateWarehouseSizeUsed(warehouse: Warehouse): void;
    process(marketCycles: number, corporation: Corporation): void;
    processMaterialMarket(): void;
    processProductMarket(marketCycles?: number): void;
    processSaleState(marketCycles: number, item: Material | Product, corporation: Corporation, office: OfficeSpace, warehouse: Warehouse): number;
    processMaterials(marketCycles: number, corporation: Corporation): [number, number];
    /** Process product development and production/sale */
    processProducts(marketCycles: number, corporation: Corporation): [number, number];
    processProduct(marketCycles: number, product: Product, corporation: Corporation): number;
    resetImports(state: CorpStateName): void;
    discontinueProduct(productName: string): void;
    getAdVertCost(): number;
    applyAdVert(corporation: Corporation): void;
    getOfficeProductivity(office: OfficeSpace, params?: {
        forProduct?: boolean;
    }): number;
    getBusinessFactor(office: OfficeSpace): number;
    getAdvertisingFactors(): [
        totalFactor: number,
        awarenessFactor: number,
        popularityFactor: number,
        ratioFactor: number
    ];
    getMarketFactor(item: Material | Product): number;
    hasResearch(name: CorpResearchName): boolean;
    updateResearchTree(): void;
    getAdvertisingMultiplier(): number;
    getEmployeeChaMultiplier(): number;
    getEmployeeCreMultiplier(): number;
    getEmployeeEffMultiplier(): number;
    getEmployeeIntMultiplier(): number;
    getProductionMultiplier(): number;
    getProductProductionMultiplier(): number;
    getSalesMultiplier(): number;
    getScientificResearchMultiplier(): number;
    getStorageMultiplier(): number;
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a Division object from a JSON save state. */
    static fromJSON(value: IReviverValue): Division;
    static includedKeys: readonly (keyof Division)[];
}
export {};
