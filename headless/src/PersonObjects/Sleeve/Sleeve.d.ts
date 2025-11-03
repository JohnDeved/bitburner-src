/**
 * Sleeves are bodies that contain the player's cloned consciousness.
 * The player can use these bodies to perform different tasks synchronously.
 *
 * Each sleeve is its own individual, meaning it has its own stats/exp
 *
 * Sleeves are unlocked in BitNode-10.
 */
import type { SleevePerson } from "@nsdefs";
import type { Augmentation } from "../../Augmentation/Augmentation";
import type { SleeveWork } from "./Work/Work";
import { Person } from "../Person";
import { CrimeType, FactionWorkType, GymType, UniversityClassType, CompanyName, FactionName } from "@enums";
import { IReviverValue } from "../../utils/JSONReviver";
import type { MoneySource } from "../../utils/MoneySourceTracker";
export declare class Sleeve extends Person implements SleevePerson {
    currentWork: SleeveWork | null;
    /** Clone retains 'memory' synchronization (and maybe exp?) upon prestige/installing Augs */
    memory: number;
    /**
     * Sleeve shock. Number between 0 and 100
     * Trauma/shock that comes with being in a sleeve. Experience earned
     * is multiplied by shock%. This gets applied before synchronization
     *
     * Reputation earned is also multiplied by shock%
     */
    shock: number;
    /** Stored number of game "loop" cycles */
    storedCycles: number;
    /**
     * Synchronization. Number between 0 and 100
     * When experience is earned  by sleeve, both the player and the sleeve get
     * sync% of the experience earned.
     */
    sync: number;
    constructor();
    /** Updates this object's multipliers for the given augmentation */
    applyAugmentation(aug: Augmentation): void;
    findPurchasableAugs(): Augmentation[];
    shockBonus(): number;
    syncBonus(): number;
    startWork(w: SleeveWork): void;
    stopWork(): void;
    /** Commit crimes */
    commitCrime(type: CrimeType): boolean;
    /** Returns the cost of upgrading this sleeve's memory by a certain amount */
    getMemoryUpgradeCost(n: number): number;
    installAugmentation(aug: Augmentation): void;
    /** Called on every sleeve for a Source File Prestige */
    prestige(): void;
    /**
     * Process loop
     * Returns an object containing the amount of experience that should be
     * transferred to all other sleeves
     */
    process(numCycles?: number): void;
    shockRecovery(): boolean;
    synchronize(): boolean;
    /** Take a course at a university */
    takeUniversityCourse(universityName: string, className: UniversityClassType): boolean;
    tryBuyAugmentation(aug: Augmentation): boolean;
    upgradeMemory(n: number): void;
    /**
     * Start work for one of the player's companies
     * Returns boolean indicating success
     */
    workForCompany(companyName: CompanyName): boolean;
    workForFaction(factionName: FactionName, workType: FactionWorkType): boolean;
    /** Begin a gym workout task */
    workoutAtGym(gymName: string, stat: GymType): boolean;
    /** Begin a bladeburner task */
    bladeburner(action: string, contract?: string): boolean;
    travelCostMoneySource(): MoneySource;
    /** Sleeves are immortal, but we damage them for max hp so they get shocked */
    kill(): boolean;
    takeDamage(amt: number): boolean;
    static recalculateNumOwned(): void;
    whoAmI(): string;
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a Sleeve object from a JSON save state. */
    static fromJSON(value: IReviverValue): Sleeve;
}
