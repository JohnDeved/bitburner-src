"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugType = void 0;
exports.assertStringWithNSContext = assertStringWithNSContext;
exports.assertFunctionWithNSContext = assertFunctionWithNSContext;
const ErrorMessages_1 = require("./ErrorMessages");
const userFriendlyString = (v) => {
    const clip = (s) => {
        if (s.length > 15)
            return s.slice(0, 12) + "...";
        return s;
    };
    if (typeof v === "number")
        return String(v);
    if (typeof v === "string") {
        if (v === "")
            return "empty string";
        return `'${clip(v)}'`;
    }
    const json = JSON.stringify(v);
    if (!json)
        return "???";
    return `'${clip(json)}'`;
};
const debugType = (v) => {
    if (v === null)
        return `Is null.`;
    if (v === undefined)
        return "Is undefined.";
    if (typeof v === "function")
        return "Is a function.";
    return `Is of type '${typeof v}', value: ${userFriendlyString(v)}`;
};
exports.debugType = debugType;
/**
 * This function should be used to assert strings provided by the player. It uses a specialized utility function that
 * provides a stack trace pointing to the player's invalid caller.
 */
function assertStringWithNSContext(ctx, argName, v) {
    if (typeof v !== "string")
        throw (0, ErrorMessages_1.errorMessage)(ctx, `${argName} expected to be a string. ${(0, exports.debugType)(v)}`, "TYPE");
}
function assertFunctionWithNSContext(ctx, argName, v) {
    if (typeof v !== "function")
        throw (0, ErrorMessages_1.errorMessage)(ctx, `${argName} expected to be a function ${(0, exports.debugType)(v)}`, "TYPE");
}
