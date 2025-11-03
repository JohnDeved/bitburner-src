import type { Person } from "../PersonObjects/Person";
import type { Action } from "./Types";
export declare function calculateActionRankGain(action: Action, level?: number): number;
export declare function calculateActionReputationGain(person: Person, rankGain: number): number;
