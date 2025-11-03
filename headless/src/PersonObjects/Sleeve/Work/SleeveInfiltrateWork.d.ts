import type { PromisePair } from "../../../Types/Promises";
import { IReviverValue } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { SleeveWorkClass, SleeveWorkType } from "./Work";
export declare const isSleeveInfiltrateWork: (w: SleeveWorkClass | null) => w is SleeveInfiltrateWork;
export declare class SleeveInfiltrateWork extends SleeveWorkClass {
    type: SleeveWorkType.INFILTRATE;
    cyclesWorked: number;
    nextCompletionPair: PromisePair<void>;
    cyclesNeeded(): number;
    process(sleeve: Sleeve, cycles: number): void;
    get nextCompletion(): Promise<void>;
    finish(): void;
    APICopy(): {
        type: SleeveWorkType.INFILTRATE;
        cyclesWorked: number;
        cyclesNeeded: number;
        nextCompletion: Promise<void>;
    };
    static savedKeys: readonly (keyof SleeveInfiltrateWork)[];
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a BladeburnerWork object from a JSON save state. */
    static fromJSON(value: IReviverValue): SleeveInfiltrateWork;
}
