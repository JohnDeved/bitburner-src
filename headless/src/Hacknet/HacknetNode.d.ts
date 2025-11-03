/**
 * Hacknet Node Class
 *
 * Hacknet Nodes are specialized machines that passively earn the player money over time.
 * They can be upgraded to increase their production
 */
import { IHacknetNode } from "./IHacknetNode";
import { IReviverValue } from "../utils/JSONReviver";
import { ObjectValidator } from "../utils/Validator";
export declare class HacknetNode implements IHacknetNode {
    static validationData: ObjectValidator<HacknetNode>;
    cores: number;
    level: number;
    moneyGainRatePerSecond: number;
    name: string;
    onlineTimeSeconds: number;
    ram: number;
    totalMoneyGenerated: number;
    constructor(name?: string, prodMult?: number);
    calculateCoreUpgradeCost(levels: number, costMult: number): number;
    calculateLevelUpgradeCost(levels: number, costMult: number): number;
    calculateRamUpgradeCost(levels: number, costMult: number): number;
    process(numCycles?: number): number;
    upgradeCore(levels: number, prodMult: number): void;
    upgradeLevel(levels: number, prodMult: number): void;
    upgradeRam(levels: number, prodMult: number): void;
    updateMoneyGainRate(prodMult: number): void;
    /** Serialize the current object to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a HacknetNode object from a JSON save state. */
    static fromJSON(value: IReviverValue): HacknetNode;
}
