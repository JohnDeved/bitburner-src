import { Server } from "./Server";
import { BaseServer } from "./BaseServer";
import { HacknetServer } from "../Hacknet/HacknetServer";
import { IPAddress } from "../Types/strings";
import "../Script/RunningScript";
export declare function GetServer(s: string): BaseServer | null;
/**
 * In our codebase, we usually have to call GetServer() like this:
 * ```
 * const server = GetServer(hostname);
 * if (!server) {
 *   throw new Error("Error message");
 * }
 * // Use server
 * ```
 * With this utility function, we don't need to write boilerplate code.
 */
export declare function GetServerOrThrow(serverId: string): BaseServer;
export declare function GetReachableServer(s: string): BaseServer | null;
export declare function GetAllServers(): BaseServer[];
export declare function DeleteServer(serverkey: string): void;
export declare function ipExists(ip: string): boolean;
export declare function createUniqueRandomIp(): IPAddress;
export declare function AddToAllServers(server: Server | HacknetServer): void;
export declare const renameServer: (hostname: string, newName: string) => void;
export declare function initForeignServers(homeComputer: Server): void;
export declare function prestigeAllServers(): void;
export declare function loadAllServers(saveString: string): void;
export declare function saveAllServers(): string;
