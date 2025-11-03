"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadActionIdentifier = loadActionIdentifier;
const _enums_1 = require("@enums");
const TypeAssertion_1 = require("../../utils/TypeAssertion");
const EnumHelper_1 = require("../../utils/EnumHelper");
/** Loads an action identifier
 * This is used for loading ActionIdentifier class objects from pre-2.6.1
 * Should load both the old format and the new format */
function loadActionIdentifier(identifier) {
    if (!identifier || typeof identifier !== "object")
        return null;
    (0, TypeAssertion_1.assertLoadingType)(identifier);
    if ((0, EnumHelper_1.getEnumHelper)("BladeburnerBlackOpName").isMember(identifier.name)) {
        return { type: _enums_1.BladeburnerActionType.BlackOp, name: identifier.name };
    }
    if ((0, EnumHelper_1.getEnumHelper)("BladeburnerContractName").isMember(identifier.name)) {
        return { type: _enums_1.BladeburnerActionType.Contract, name: identifier.name };
    }
    if ((0, EnumHelper_1.getEnumHelper)("BladeburnerOperationName").isMember(identifier.name)) {
        return { type: _enums_1.BladeburnerActionType.Operation, name: identifier.name };
    }
    if ((0, EnumHelper_1.getEnumHelper)("BladeburnerGeneralActionName").isMember(identifier.name)) {
        return { type: _enums_1.BladeburnerActionType.General, name: identifier.name };
    }
    return null;
}
