import { IReviverValue } from "../../../utils/JSONReviver";
import { SleeveWorkClass, SleeveWorkType } from "./Work";
export declare const isSleeveSupportWork: (w: SleeveWorkClass | null) => w is SleeveSupportWork;
export declare class SleeveSupportWork extends SleeveWorkClass {
    type: SleeveWorkType.SUPPORT;
    constructor();
    process(): void;
    finish(): void;
    APICopy(): {
        type: SleeveWorkType.SUPPORT;
    };
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a BladeburnerWork object from a JSON save state. */
    static fromJSON(value: IReviverValue): SleeveSupportWork;
}
