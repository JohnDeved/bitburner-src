import { ClassType, LocationName } from "@enums";
import { IReviverValue } from "../../../utils/JSONReviver";
import { SleeveWorkClass, SleeveWorkType } from "./Work";
import { Sleeve } from "../Sleeve";
import { WorkStats } from "../../../Work/WorkStats";
export declare const isSleeveClassWork: (w: SleeveWorkClass | null) => w is SleeveClassWork;
interface ClassWorkParams {
    classType: ClassType;
    location: LocationName;
}
export declare class SleeveClassWork extends SleeveWorkClass {
    type: SleeveWorkType.CLASS;
    classType: ClassType;
    location: LocationName;
    constructor(params?: ClassWorkParams);
    calculateRates(sleeve: Sleeve): WorkStats;
    isGym(): boolean;
    process(sleeve: Sleeve, cycles: number): void;
    APICopy(): {
        type: SleeveWorkType.CLASS;
        classType: ClassType;
        location: LocationName;
    };
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a ClassWork object from a JSON save state. */
    static fromJSON(value: IReviverValue): SleeveClassWork;
}
export {};
