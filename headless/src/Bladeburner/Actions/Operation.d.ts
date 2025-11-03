import type { Person } from "../../PersonObjects/Person";
import type { BlackOperation } from "./BlackOperation";
import type { Bladeburner } from "../Bladeburner";
import type { ActionIdFor, Availability, SuccessChanceParams } from "../Types";
import { BladeburnerActionType, BladeburnerOperationName } from "@enums";
import { IReviverValue } from "../../utils/JSONReviver";
import { LevelableActionClass, LevelableActionParams } from "./LevelableAction";
import type { TeamActionWithCasualties } from "./TeamCasualties";
export interface OperationParams extends LevelableActionParams {
    name: BladeburnerOperationName;
    getAvailability?: (bladeburner: Bladeburner) => Availability;
}
export declare class Operation extends LevelableActionClass implements TeamActionWithCasualties {
    readonly type: BladeburnerActionType.Operation;
    readonly name: BladeburnerOperationName;
    teamCount: number;
    get id(): ActionIdFor<Operation>;
    static IsAcceptedName(name: unknown): name is BladeburnerOperationName;
    static createId(name: BladeburnerOperationName): ActionIdFor<Operation>;
    constructor(params?: OperationParams | null);
    getTeamSuccessBonus: typeof operationTeamSuccessBonus;
    getActionTypeSkillSuccessBonus: (inst: Bladeburner) => number;
    getMinimumCasualties(): number;
    getChaosSuccessFactor(inst: Bladeburner): number;
    getSuccessChance(inst: Bladeburner, person: Person, params: SuccessChanceParams): any;
    reset(): void;
    toJSON(): IReviverValue;
    loadData(loadedObject: Operation): void;
    static fromJSON(value: IReviverValue): Operation;
}
export declare const operationSkillSuccessBonus: (inst: Bladeburner) => number;
export declare function operationTeamSuccessBonus(this: Operation | BlackOperation, inst: Bladeburner): number;
