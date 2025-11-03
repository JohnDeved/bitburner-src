import { IReviverValue } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { SleeveWorkClass, SleeveWorkType } from "./Work";
import { CrimeType } from "@enums";
import { Crime } from "../../../Crime/Crime";
import { WorkStats } from "../../../Work/WorkStats";
export declare const isSleeveCrimeWork: (w: SleeveWorkClass | null) => w is SleeveCrimeWork;
export declare class SleeveCrimeWork extends SleeveWorkClass {
    type: SleeveWorkType.CRIME;
    crimeType: CrimeType;
    tasksCompleted: number;
    cyclesWorked: number;
    constructor(crimeType?: CrimeType);
    getCrime(): Crime;
    getExp(sleeve: Sleeve): WorkStats;
    cyclesNeeded(): number;
    process(sleeve: Sleeve, cycles: number): void;
    APICopy(): {
        type: SleeveWorkType.CRIME;
        crimeType: CrimeType;
        tasksCompleted: number;
        cyclesWorked: number;
        cyclesNeeded: number;
    };
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes an object from a JSON save state. */
    static fromJSON(value: IReviverValue): SleeveCrimeWork;
}
