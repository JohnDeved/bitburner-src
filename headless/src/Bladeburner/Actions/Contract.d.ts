import type { Bladeburner } from "../Bladeburner";
import type { ActionIdFor } from "../Types";
import { IReviverValue } from "../../utils/JSONReviver";
import { BladeburnerActionType, BladeburnerContractName } from "../Enums";
import { LevelableActionClass, LevelableActionParams } from "./LevelableAction";
export declare class Contract extends LevelableActionClass {
    readonly type: BladeburnerActionType.Contract;
    readonly name: BladeburnerContractName;
    get id(): ActionIdFor<Contract>;
    static IsAcceptedName(name: unknown): name is BladeburnerContractName;
    static createId(name: BladeburnerContractName): ActionIdFor<Contract>;
    constructor(params?: (LevelableActionParams & {
        name: BladeburnerContractName;
    }) | null);
    getActionTypeSkillSuccessBonus(inst: Bladeburner): number;
    toJSON(): IReviverValue;
    static fromJSON(value: IReviverValue): Contract;
}
