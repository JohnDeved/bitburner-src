import { Person as IPerson } from "@nsdefs";
import { Faction } from "../Faction";
export declare function repFromDonation(amt: number, person: IPerson): number;
export declare function donationForRep(rep: number, person: IPerson): number;
export declare function favorNeededToDonate(): number;
export declare function canDonate(amt: number): boolean;
/** Donates money to the faction provided and returns repuation gained */
export declare function donate(amt: number, faction: Faction): number;
