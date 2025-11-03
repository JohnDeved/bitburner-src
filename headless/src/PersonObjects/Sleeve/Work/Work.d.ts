import { IReviverValue } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { WorkStats } from "../../../Work/WorkStats";
import { SleeveTask } from "@nsdefs";
import { SleeveCompanyWork } from "./SleeveCompanyWork";
import { SleeveFactionWork } from "./SleeveFactionWork";
import { SleeveCrimeWork } from "./SleeveCrimeWork";
import { SleeveClassWork } from "./SleeveClassWork";
import { SleeveRecoveryWork } from "./SleeveRecoveryWork";
import { SleeveSynchroWork } from "./SleeveSynchroWork";
import { SleeveBladeburnerWork } from "./SleeveBladeburnerWork";
import { SleeveInfiltrateWork } from "./SleeveInfiltrateWork";
import { SleeveSupportWork } from "./SleeveSupportWork";
export declare const applySleeveGains: (sleeve: Sleeve, shockedStats: WorkStats, mult?: number) => void;
export declare abstract class SleeveWorkClass {
    abstract type: SleeveWorkType;
    abstract process(sleeve: Sleeve, cycles: number): void;
    abstract APICopy(sleeve: Sleeve): SleeveTask;
    abstract toJSON(): IReviverValue;
    finish(): void;
}
export declare enum SleeveWorkType {
    COMPANY = "COMPANY",
    FACTION = "FACTION",
    CRIME = "CRIME",
    CLASS = "CLASS",
    RECOVERY = "RECOVERY",
    SYNCHRO = "SYNCHRO",
    BLADEBURNER = "BLADEBURNER",
    INFILTRATE = "INFILTRATE",
    SUPPORT = "SUPPORT"
}
export type SleeveWork = SleeveCompanyWork | SleeveFactionWork | SleeveCrimeWork | SleeveClassWork | SleeveRecoveryWork | SleeveSynchroWork | SleeveBladeburnerWork | SleeveInfiltrateWork | SleeveSupportWork;
