import type { MoneySource } from "../utils/MoneySourceTracker";
import { Person } from "../PersonObjects/Person";
import { Multipliers } from "../PersonObjects/Multipliers";
export interface WorkStats {
    money: number;
    reputation: number;
    hackExp: number;
    strExp: number;
    defExp: number;
    dexExp: number;
    agiExp: number;
    chaExp: number;
    intExp: number;
}
export declare const newWorkStats: (params?: Partial<WorkStats>) => WorkStats;
/** Add two workStats objects */
export declare const sumWorkStats: (w0: WorkStats, w1: WorkStats) => WorkStats;
/** Scale all stats on a WorkStats object by a number. Money scaling optional but defaults to true. */
export declare const scaleWorkStats: (w: WorkStats, n: number, scaleMoney?: boolean) => WorkStats;
export declare const applyWorkStats: (target: Person, workStats: WorkStats, cycles: number, source: MoneySource) => WorkStats;
export declare const applyWorkStatsExp: (target: Person, workStats: WorkStats, mult?: number) => WorkStats;
/** Calculate the application of a person's multipliers to a WorkStats object */
export declare function multWorkStats(workStats: Partial<WorkStats>, mults: Multipliers, moneyMult?: number, repMult?: number): {
    money: number;
    reputation: number;
    hackExp: number;
    strExp: number;
    defExp: number;
    dexExp: number;
    agiExp: number;
    chaExp: number;
    intExp: number;
};
