import { IHacknetNode } from "./IHacknetNode";
import { BaseServer } from "../Server/BaseServer";
import { IPAddress } from "../Types/strings";
import { IReviverValue } from "../utils/JSONReviver";
interface IConstructorParams {
    adminRights?: boolean;
    hostname: string;
    ip?: IPAddress;
    isConnectedTo?: boolean;
    maxRam?: number;
    organizationName?: string;
}
/** Hacknet Servers - Reworked Hacknet Node mechanic for BitNode-9 */
export declare class HacknetServer extends BaseServer implements IHacknetNode {
    cache: number;
    cores: number;
    hashCapacity: number;
    hashRate: number;
    level: number;
    onlineTimeSeconds: number;
    totalHashesGenerated: number;
    purchasedByPlayer: boolean;
    isHacknetServer: boolean;
    constructor(params?: IConstructorParams);
    calculateCacheUpgradeCost(levels: number): number;
    calculateCoreUpgradeCost(levels: number, costMult: number): number;
    calculateLevelUpgradeCost(levels: number, costMult: number): number;
    calculateRamUpgradeCost(levels: number, costMult: number): number;
    process(numCycles?: number): number;
    upgradeCache(levels: number): void;
    upgradeCore(levels: number, prodMult: number): void;
    upgradeLevel(levels: number, prodMult: number): void;
    upgradeRam(levels: number, prodMult: number): boolean;
    updateRamUsed(ram: number): void;
    updateHashCapacity(): void;
    updateHashRate(prodMult: number): void;
    toJSON(): IReviverValue;
    static fromJSON(value: IReviverValue): HacknetServer;
}
export {};
