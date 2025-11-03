"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalShorthands = void 0;
exports.autoCompleteTypeShorthand = autoCompleteTypeShorthand;
const _enums_1 = require("@enums");
const Actions_1 = require("../Actions");
const resolveActionIdentifierFromName = (name) => {
    if (Actions_1.Contract.IsAcceptedName(name))
        return Actions_1.Contract.createId(name);
    if (Actions_1.BlackOperation.IsAcceptedName(name))
        return Actions_1.BlackOperation.createId(name);
    if (Actions_1.GeneralAction.IsAcceptedName(name))
        return Actions_1.GeneralAction.createId(name);
    if (Actions_1.Operation.IsAcceptedName(name))
        return Actions_1.Operation.createId(name);
    return null;
};
/** Resolve identifier by auto completing from a fuzzy type match, e.g. "blackops" */
function autoCompleteTypeShorthand(typeShorthand, name) {
    let id = resolveActionIdentifierFromName(name);
    if (id && !exports.TerminalShorthands[id.type].includes(typeShorthand.toLowerCase().trim())) {
        id = null;
    }
    return id;
}
/** These shorthands match those documented in the BB Terminal Help */
exports.TerminalShorthands = {
    [_enums_1.BladeburnerActionType.Contract]: ["contract", "contracts", "contr"],
    [_enums_1.BladeburnerActionType.Operation]: ["operation", "operations", "op", "ops"],
    [_enums_1.BladeburnerActionType.BlackOp]: [
        "blackoperation",
        "black operation",
        "black operations",
        "black op",
        "black ops",
        "blackop",
        "blackops",
    ],
    [_enums_1.BladeburnerActionType.General]: ["general", "general action", "gen"],
};
