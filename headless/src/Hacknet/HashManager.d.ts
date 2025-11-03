import { HashUpgrade } from "./HashUpgrade";
import { IReviverValue } from "../utils/JSONReviver";
import { Result } from "../types";
import { HashUpgradeEnum } from "./Enums";
export declare class HashManager {
    capacity: number;
    hashes: number;
    upgrades: Record<string, number>;
    constructor();
    /** Generic helper function for getting a multiplier from a HashUpgrade */
    getMult(upgName: HashUpgradeEnum): number;
    /** One of the Hash upgrades improves studying. This returns that multiplier */
    getStudyMult(): number;
    /** One of the Hash upgrades improves gym training. This returns that multiplier */
    getTrainingMult(): number;
    getUpgrade(upgName: HashUpgradeEnum): HashUpgrade | null;
    /** Get the cost (in hashes) of an upgrade */
    getUpgradeCost(upgName: HashUpgradeEnum, count?: number): number;
    prestige(): void;
    /** Reverts an upgrade and refunds the hashes used to buy it */
    refundUpgrade(upgName: HashUpgradeEnum, count?: number): void;
    /**
     * Stores the given hashes, capping at capacity
     * @param numHashes The number of hashes to increment
     * @returns The number of wasted hashes (over capacity)
     */
    storeHashes(numHashes: number): number;
    updateCapacity(newCap: number): void;
    /**
     * Returns boolean indicating whether or not the upgrade was successfully purchased.
     * Note that this function does NOT actually implement the effect.
     */
    upgrade(upgName: HashUpgradeEnum, count?: number): Result;
    toJSON(): IReviverValue;
    static fromJSON(value: IReviverValue): HashManager;
}
