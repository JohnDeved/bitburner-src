import type { Person } from "../../PersonObjects/Person";
import type { Bladeburner } from "../Bladeburner";
import type { ActionIdFor } from "../Types";
import { BladeburnerActionType, BladeburnerGeneralActionName } from "@enums";
import { ActionClass, ActionParams } from "./Action";
type GeneralActionParams = ActionParams & {
    name: BladeburnerGeneralActionName;
    getActionTime: (bladeburner: Bladeburner, person: Person) => number;
    getSuccessChance?: (bladeburner: Bladeburner, person: Person) => number;
};
export declare class GeneralAction extends ActionClass {
    readonly type: BladeburnerActionType.General;
    readonly name: BladeburnerGeneralActionName;
    get id(): ActionIdFor<GeneralAction>;
    static IsAcceptedName(name: unknown): name is BladeburnerGeneralActionName;
    static createId(name: BladeburnerGeneralActionName): ActionIdFor<GeneralAction>;
    constructor(params: GeneralActionParams);
    getSuccessChance(__bladeburner: Bladeburner, __person: Person): number;
    getSuccessRange(bladeburner: Bladeburner, person: Person): [minChance: number, maxChance: number];
}
export {};
