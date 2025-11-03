import { CorpResearchName } from "@nsdefs";
export interface ResearchParams {
    name: CorpResearchName;
    cost: number;
    desc: string;
    advertisingMult?: number;
    employeeChaMult?: number;
    employeeCreMult?: number;
    employeeEffMult?: number;
    employeeIntMult?: number;
    productionMult?: number;
    productProductionMult?: number;
    salesMult?: number;
    sciResearchMult?: number;
    storageMult?: number;
}
export declare class Research {
    name: CorpResearchName;
    cost: number;
    description: string;
    advertisingMult: number;
    employeeChaMult: number;
    employeeCreMult: number;
    employeeEffMult: number;
    employeeIntMult: number;
    productionMult: number;
    productProductionMult: number;
    salesMult: number;
    sciResearchMult: number;
    storageMult: number;
    constructor(p?: ResearchParams | null);
}
