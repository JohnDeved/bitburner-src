/**
 * Functions used to determine whether the target can be hacked (or grown/weakened).
 * Meant to be used for Netscript implementation
 *
 * The returned status object's message should be used for logging in Netscript
 */
import { IReturnStatus } from "../types";
import { Server } from "../Server/Server";
export declare function netscriptCanHack(server: Server, customActionName?: string): IReturnStatus;
export declare function netscriptCanGrow(server: Server): IReturnStatus;
export declare function netscriptCanWeaken(server: Server): IReturnStatus;
