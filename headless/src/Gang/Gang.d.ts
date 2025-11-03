/**
 * TODO unplanned
 * Add police clashes
 * balance point to keep them from running out of control
 */
import type { PromisePair } from "../Types/Promises";
import { IReviverValue } from "../utils/JSONReviver";
import { GangMemberUpgrade } from "./GangMemberUpgrade";
import { IAscensionResult } from "./IAscensionResult";
import { GangMember } from "./GangMember";
import { WorkerScript } from "../Netscript/WorkerScript";
import { FactionName } from "@enums";
export declare enum RecruitmentResult {
    Success = "Success",
    EmptyName = "Member name cannot be an empty string",
    DuplicatedName = "This name was used",
    ExceedMaxNumber = "Your gang recruited maximum number of members",
    NotEnoughRespect = "Your gang does not have enough respect to recruit more members"
}
export declare const GangPromise: PromisePair<number>;
export declare class Gang {
    facName: FactionName;
    members: GangMember[];
    wanted: number;
    respect: number;
    isHackingGang: boolean;
    /** Respect gain rate, per cycle */
    respectGainRate: number;
    /** Wanted level gain rate, per cycle */
    wantedGainRate: number;
    /** Money gain rate, per cycle */
    moneyGainRate: number;
    storedCycles: number;
    storedTerritoryAndPowerCycles: number;
    territoryClashChance: number;
    territoryWarfareEngaged: boolean;
    notifyMemberDeath: boolean;
    constructor(facName?: any, hacking?: boolean);
    getPower(): number;
    getTerritory(): number;
    /** Main process function called by the engine loop every game cycle */
    process(numCycles?: number): void;
    /** Process respect/wanted/money gains
     * @param numCycles The number of cycles to process. */
    processGains(numCycles: number): void;
    /** Process Territory and Power
     * @param numCycles The number of cycles to process. */
    processTerritoryAndPowerGains(numCycles: number): void;
    /** Process member experience gain
     * @param numCycles The number of cycles to process. */
    processExperienceGains(numCycles: number): void;
    clash(won?: boolean): void;
    canRecruitMember(): RecruitmentResult;
    /** @returns The respect threshold needed for the next member recruitment. Infinity if already at or above max members. */
    respectForNextRecruit(): number;
    getRecruitsAvailable(): number;
    recruitMember(name: string): RecruitmentResult;
    getWantedPenalty(): number;
    calculatePower(): number;
    killMember(member: GangMember): void;
    ascendMember(member: GangMember, workerScript?: WorkerScript): IAscensionResult;
    getDiscount(): number;
    /** Returns only valid tasks for this gang. Excludes 'Unassigned' */
    getAllTaskNames(): string[];
    getUpgradeCost(upg: GangMemberUpgrade | null): number;
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a Gang object from a JSON save state. */
    static fromJSON(value: IReviverValue): Gang;
}
