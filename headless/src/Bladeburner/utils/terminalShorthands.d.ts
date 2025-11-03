import { ActionIdentifier } from "../Types";
import { BladeburnerActionType } from "@enums";
/** Resolve identifier by auto completing from a fuzzy type match, e.g. "blackops" */
export declare function autoCompleteTypeShorthand(typeShorthand: string, name: string): ActionIdentifier | null;
/** These shorthands match those documented in the BB Terminal Help */
export declare const TerminalShorthands: {
    readonly [BladeburnerActionType.Contract]: string[];
    readonly [BladeburnerActionType.Operation]: string[];
    readonly [BladeburnerActionType.BlackOp]: string[];
    readonly [BladeburnerActionType.General]: string[];
};
