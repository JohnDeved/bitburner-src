import { Person as IPerson } from "@nsdefs";
import { Server as IServer } from "@nsdefs";
/** Returns the chance the person has to successfully hack a server */
export declare function calculateHackingChance(server: IServer, person: IPerson): number;
/**
 * Returns the amount of hacking experience the person will gain upon
 * successfully hacking a server
 */
export declare function calculateHackingExpGain(server: IServer, person: IPerson): number;
/**
 * Returns the percentage of money that will be stolen from a server if
 * it is successfully hacked (returns the decimal form, not the actual percent value)
 */
export declare function calculatePercentMoneyHacked(server: IServer, person: IPerson): number;
/** Returns time it takes to complete a hack on a server, in seconds */
export declare function calculateHackingTime(server: IServer, person: IPerson): number;
/** Returns time it takes to complete a grow operation on a server, in seconds */
export declare function calculateGrowTime(server: IServer, person: IPerson): number;
/** Returns time it takes to complete a weaken operation on a server, in seconds */
export declare function calculateWeakenTime(server: IServer, person: IPerson): number;
