import { CrimeType } from "@enums";
import { IReviverValue } from "../utils/JSONReviver";
import { Crime } from "../Crime/Crime";
import { Work, WorkType } from "./Work";
import { WorkStats } from "./WorkStats";
interface CrimeWorkParams {
    crimeType: CrimeType;
    singularity: boolean;
}
export declare const isCrimeWork: (w: Work | null) => w is CrimeWork;
export declare class CrimeWork extends Work {
    crimeType: CrimeType;
    unitCompleted: number;
    constructor(params?: CrimeWorkParams);
    getCrime(): Crime;
    process(cycles?: number): boolean;
    earnings(): WorkStats;
    commit(): void;
    finish(): void;
    APICopy(): {
        type: WorkType.CRIME;
        cyclesWorked: number;
        crimeType: CrimeType;
    };
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a CrimeWork object from a JSON save state. */
    static fromJSON(value: IReviverValue): CrimeWork;
}
export {};
