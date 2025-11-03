import type { Sleeve } from "../Sleeve";
import type { ActionIdentifier } from "../../../Bladeburner/Types";
import type { PromisePair } from "../../../Types/Promises";
import { BladeburnerActionType } from "@enums";
import { IReviverValue } from "../../../utils/JSONReviver";
import { SleeveWorkClass, SleeveWorkType } from "./Work";
interface SleeveBladeburnerWorkParams {
    actionId: ActionIdentifier & {
        type: BladeburnerActionType.General | BladeburnerActionType.Contract;
    };
}
export declare const isSleeveBladeburnerWork: (w: SleeveWorkClass | null) => w is SleeveBladeburnerWork;
export declare class SleeveBladeburnerWork extends SleeveWorkClass {
    type: SleeveWorkType.BLADEBURNER;
    tasksCompleted: number;
    cyclesWorked: number;
    actionId: ActionIdentifier & {
        type: BladeburnerActionType.General | BladeburnerActionType.Contract;
    };
    nextCompletionPair: PromisePair<void>;
    constructor(params?: SleeveBladeburnerWorkParams);
    cyclesNeeded(sleeve: Sleeve): number;
    finish(): void;
    process(sleeve: Sleeve, cycles: number): void;
    get nextCompletion(): Promise<void>;
    APICopy(sleeve: Sleeve): {
        type: SleeveWorkType.BLADEBURNER;
        actionType: any;
        actionName: any;
        tasksCompleted: number;
        cyclesWorked: number;
        cyclesNeeded: number;
        nextCompletion: Promise<void>;
    };
    static savedKeys: readonly (keyof SleeveBladeburnerWork)[];
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a BladeburnerWork object from a JSON save state. */
    static fromJSON(value: IReviverValue): SleeveBladeburnerWork;
}
export {};
