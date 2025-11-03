import type { PlayerObject } from "../PersonObjects/Player/PlayerObject";
import { FactionName, FactionDiscovery } from "@enums";
import { Faction } from "./Faction";
import { PartialRecord } from "../Types/Record";
/** The static list of all factions. Initialized once and never modified. */
export declare const Factions: Record<string, Faction>;
type SavegameFaction = {
    playerReputation?: number;
    favor?: number;
    discovery?: FactionDiscovery;
};
export declare function loadFactions(saveString: string, player: PlayerObject): void;
export declare function getFactionsSave(): PartialRecord<FactionName, SavegameFaction>;
export {};
