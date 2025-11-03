import type { TypedKeys } from "../types";
import { IReviverValue } from "./JSONReviver";
export type MoneySource = TypedKeys<MoneySourceTracker, number>;
export declare class MoneySourceTracker {
    bladeburner: number;
    casino: number;
    class: number;
    codingcontract: number;
    corporation: number;
    crime: number;
    gang: number;
    gang_expenses: number;
    hacking: number;
    hacknet: number;
    hacknet_expenses: number;
    hospitalization: number;
    infiltration: number;
    sleeves: number;
    stock: number;
    total: number;
    work: number;
    servers: number;
    other: number;
    augmentations: number;
    record(amt: number, source: MoneySource): void;
    reset(): void;
    toJSON(): IReviverValue;
    static fromJSON(value: IReviverValue): MoneySourceTracker;
}
