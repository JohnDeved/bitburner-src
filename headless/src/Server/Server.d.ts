import { BaseServer } from "./BaseServer";
import { IReviverValue } from "../utils/JSONReviver";
import { IPAddress } from "../Types/strings";
export interface IConstructorParams {
    adminRights?: boolean;
    hackDifficulty?: number;
    hostname: string;
    ip?: IPAddress;
    isConnectedTo?: boolean;
    maxRam?: number;
    moneyAvailable?: number;
    numOpenPortsRequired?: number;
    organizationName?: string;
    purchasedByPlayer?: boolean;
    requiredHackingSkill?: number;
    serverGrowth?: number;
}
export declare class Server extends BaseServer {
    backdoorInstalled: boolean;
    baseDifficulty: number;
    hackDifficulty: number;
    minDifficulty: number;
    moneyAvailable: number;
    moneyMax: number;
    numOpenPortsRequired: number;
    openPortCount: number;
    requiredHackingSkill: number;
    serverGrowth: number;
    constructor(params?: IConstructorParams);
    /** Ensures that the server's difficulty (server security) doesn't get too high */
    capDifficulty(): void;
    /**
     * Change this server's minimum security
     * @param n - Value by which to increase/decrease the server's minimum security
     * @param perc - Whether it should be changed by a percentage, or a flat value
     */
    changeMinimumSecurity(n: number, perc?: boolean): void;
    /**
     * Change this server's maximum money
     * @param n - Value by which to change the server's maximum money
     */
    changeMaximumMoney(n: number): void;
    /** Strengthens a server's security level (difficulty) by the specified amount */
    fortify(amt: number): void;
    /** Lowers the server's security level (difficulty) by the specified amount) */
    weaken(amt: number): void;
    /** Serialize the current object to a JSON save state */
    toJSON(): IReviverValue;
    static fromJSON(value: IReviverValue): Server;
}
