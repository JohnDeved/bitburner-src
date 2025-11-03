import { IReviverValue } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { SleeveWorkClass, SleeveWorkType } from "./Work";
export declare const isSleeveSynchroWork: (w: SleeveWorkClass | null) => w is SleeveSynchroWork;
export declare class SleeveSynchroWork extends SleeveWorkClass {
    type: SleeveWorkType.SYNCHRO;
    process(sleeve: Sleeve, cycles: number): void;
    APICopy(): {
        type: SleeveWorkType.SYNCHRO;
    };
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a SynchroWork object from a JSON save state. */
    static fromJSON(value: IReviverValue): SleeveSynchroWork;
}
