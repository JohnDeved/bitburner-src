import { IReviverValue } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { SleeveWorkClass, SleeveWorkType } from "./Work";
import { FactionName, FactionWorkType } from "@enums";
import { Faction } from "../../../Faction/Faction";
import { WorkStats } from "../../../Work/WorkStats";
interface SleeveFactionWorkParams {
    factionWorkType: FactionWorkType;
    factionName: FactionName;
}
export declare const isSleeveFactionWork: (w: SleeveWorkClass | null) => w is SleeveFactionWork;
export declare class SleeveFactionWork extends SleeveWorkClass {
    type: SleeveWorkType.FACTION;
    factionWorkType: FactionWorkType;
    factionName: FactionName;
    constructor(params?: SleeveFactionWorkParams);
    getExpRates(sleeve: Sleeve): WorkStats;
    getReputationRate(sleeve: Sleeve): number;
    getFaction(): Faction;
    process(sleeve: Sleeve, cycles: number): void;
    APICopy(): {
        type: SleeveWorkType.FACTION;
        factionWorkType: FactionWorkType;
        factionName: FactionName;
    };
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a FactionWork object from a JSON save state. */
    static fromJSON(value: IReviverValue): SleeveFactionWork;
}
export {};
