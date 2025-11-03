import { IReviverValue } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { SleeveWorkClass, SleeveWorkType } from "./Work";
export declare const isSleeveRecoveryWork: (w: SleeveWorkClass | null) => w is SleeveRecoveryWork;
export declare class SleeveRecoveryWork extends SleeveWorkClass {
    type: SleeveWorkType.RECOVERY;
    process(sleeve: Sleeve, cycles: number): void;
    APICopy(): {
        type: SleeveWorkType.RECOVERY;
    };
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a RecoveryWork object from a JSON save state. */
    static fromJSON(value: IReviverValue): SleeveRecoveryWork;
}
