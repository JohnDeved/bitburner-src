import type { Bladeburner } from "../Bladeburner";
import type { ActionIdFor, Availability } from "../Types";
import { BladeburnerActionType, BladeburnerBlackOpName } from "@enums";
import { ActionClass, ActionParams } from "./Action";
import { operationTeamSuccessBonus } from "./Operation";
import type { TeamActionWithCasualties } from "./TeamCasualties";
interface BlackOpParams {
    name: BladeburnerBlackOpName;
    reqdRank: number;
    n: number;
}
export declare class BlackOperation extends ActionClass implements TeamActionWithCasualties {
    readonly type: BladeburnerActionType.BlackOp;
    readonly name: BladeburnerBlackOpName;
    n: number;
    reqdRank: number;
    teamCount: number;
    get id(): ActionIdFor<BlackOperation>;
    static createId(name: BladeburnerBlackOpName): ActionIdFor<BlackOperation>;
    static IsAcceptedName(name: unknown): name is BladeburnerBlackOpName;
    constructor(params: ActionParams & BlackOpParams);
    getAvailability(bladeburner: Bladeburner): Availability;
    getActionTimePenalty(): number;
    getPopulationSuccessFactor(): number;
    getChaosSuccessFactor(): number;
    getMinimumCasualties(): number;
    getTeamSuccessBonus: typeof operationTeamSuccessBonus;
    getActionTypeSkillSuccessBonus: (inst: Bladeburner) => number;
}
export {};
