import { Server, IConstructorParams } from "./Server";
import { BaseServer } from "./BaseServer";
import { Person as IPerson } from "@nsdefs";
import { Server as IServer } from "@nsdefs";
export declare enum ServerOwnershipType {
    All = 0,
    Foreign = 1,// Non-owned servers
    Owned = 2,// Home Computer, Purchased Servers, and Hacknet Servers
    Purchased = 3
}
/**
 * Constructs a new server, while also ensuring that the new server
 * does not have a duplicate hostname/ip.
 */
export declare function safelyCreateUniqueServer(params: IConstructorParams): Server;
/**
 * Returns the number of "growth cycles" needed to grow the specified server by the specified amount, taking into
 * account only the multiplicative factor. Does not account for the additive $1/thread. Only used for growthAnalyze.
 * @param server - Server being grown
 * @param growth - How much the server is being grown by, in DECIMAL form (e.g. 1.5 rather than 50)
 * @param p - Reference to Player object
 * @returns Number of "growth cycles" needed
 */
export declare function numCycleForGrowth(server: IServer, growth: number, cores?: number): number;
/**
 * This function calculates the number of threads needed to grow a server from one $amount to a higher $amount
 * (ie, how many threads to grow this server from $200 to $600 for example).
 * It protects the inputs (so putting in INFINITY for targetMoney will use moneyMax, putting in a negative for start will use 0, etc.)
 * @param server - Server being grown
 * @param targetMoney - How much you want the server grown TO (not by), for instance, to grow from 200 to 600, input 600
 * @param startMoney - How much you are growing the server from, for instance, to grow from 200 to 600, input 200
 * @param cores - Number of cores on the host performing grow
 * @returns Integer threads needed by a single ns.grow call to reach targetMoney from startMoney.
 */
export declare function numCycleForGrowthCorrected(server: IServer, targetMoney: number, startMoney: number, cores?: number, person?: IPerson): number;
export declare function processSingleServerGrowth(server: Server, threads: number, cores?: number): number;
export declare function prestigeHomeComputer(homeComp: Server): void;
export declare function getServerOnNetwork(server: BaseServer, i: number): BaseServer | null;
export declare function isBackdoorInstalled(server: BaseServer): boolean;
export declare function isBackdoorInstalledInCompanyServer(companyName: string): boolean;
export declare function getCoreBonus(cores?: number): number;
export declare function getWeakenEffect(threads: number, cores: number): number;
export declare function checkServerOwnership(baseServer: BaseServer, serverType: ServerOwnershipType): boolean;
