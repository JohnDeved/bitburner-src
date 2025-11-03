import { CityName, CorpEmployeeJob } from "@enums";
import { IReviverValue } from "../utils/JSONReviver";
import { Division } from "./Division";
import { Corporation } from "./Corporation";
interface IParams {
    city: CityName;
    size: number;
}
export declare class OfficeSpace {
    city: any;
    size: number;
    maxEnergy: number;
    maxMorale: number;
    avgEnergy: number;
    avgMorale: number;
    avgIntelligence: number;
    avgCharisma: number;
    avgCreativity: number;
    avgEfficiency: number;
    totalExperience: number;
    numEmployees: number;
    totalSalary: number;
    autoTea: boolean;
    autoParty: boolean;
    teaPending: boolean;
    partyMult: number;
    employeeProductionByJob: {
        total: number;
    };
    employeeJobs: Record<string, number>;
    employeeNextJobs: Record<string, number>;
    constructor(params?: IParams | null);
    atCapacity(): boolean;
    process(marketCycles: number, corporation: Corporation, industry: Division): number;
    calculateEmployeeProductivity(corporation: Corporation, industry: Division): void;
    hireRandomEmployee(position: CorpEmployeeJob): boolean;
    autoAssignJob(job: CorpEmployeeJob, target: number): boolean;
    getTeaCost(): number;
    setTea(): boolean;
    setParty(mult: number): boolean;
    toJSON(): IReviverValue;
    static fromJSON(value: IReviverValue): OfficeSpace;
}
export {};
