import { IReviverValue } from "../utils/JSONReviver";
import { CompletedProgramName } from "@enums";
import { Work, WorkType } from "./Work";
import { Program } from "../Programs/Program";
export declare const isCreateProgramWork: (w: Work | null) => w is CreateProgramWork;
interface CreateProgramWorkParams {
    programName: CompletedProgramName;
    singularity: boolean;
}
export declare class CreateProgramWork extends Work {
    programName: CompletedProgramName;
    unitCompleted: number;
    unitRate: number;
    constructor(params?: CreateProgramWorkParams);
    unitNeeded(): number;
    getProgram(): Program;
    process(cycles: number): boolean;
    finish(cancelled: boolean, suppressDialog?: boolean): void;
    APICopy(): {
        type: WorkType.CREATE_PROGRAM;
        cyclesWorked: number;
        programName: CompletedProgramName;
    };
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a CreateProgramWork object from a JSON save state. */
    static fromJSON(value: IReviverValue): CreateProgramWork;
}
export {};
