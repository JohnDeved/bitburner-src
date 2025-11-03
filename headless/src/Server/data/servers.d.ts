import type { ServerName } from "../../Types/strings";
import { LiteratureName } from "@enums";
import { IMinMaxRange } from "../../types";
/**
 * The metadata describing the base state of servers on the network.
 * These values will be adjusted based on Bitnode multipliers when the Server objects are built out.
 */
interface IServerMetadata {
    /** When populated, the base security level of the server. */
    hackDifficulty?: number | IMinMaxRange;
    /** The DNS name of the server. */
    hostname: ServerName;
    /** When populated, the files will be added to the server when created. */
    literature?: LiteratureName[];
    /**
     * When populated, the exponent of 2^x amount of RAM the server has.
     * This should be in the range of 1-20, to match the Player's max RAM.
     */
    maxRamExponent?: number | IMinMaxRange;
    /** How much money the server starts out with. */
    moneyAvailable: number | IMinMaxRange;
    /**
     * The number of network layers away from the `home` server.
     * This value is between 1 and 15.
     * If this is not populated, @specialName should be.
     */
    networkLayer?: number | IMinMaxRange;
    /** The number of ports that must be opened before the player can execute NUKE. */
    numOpenPortsRequired: number;
    /** The organization that the server belongs to. */
    organizationName: string;
    /** The minimum hacking level before the player can run NUKE. */
    requiredHackingSkill: number | IMinMaxRange;
    /** The growth factor for the server. */
    serverGrowth?: number | IMinMaxRange;
    /** A "unique" server that has special implications when the player manually hacks it. */
    specialName?: string;
}
/** The metadata for building up the servers on the network. */
export declare const serverMetadata: IServerMetadata[];
export {};
