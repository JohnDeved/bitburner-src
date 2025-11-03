"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clampNumber = clampNumber;
exports.clampInteger = clampInteger;
const Constants_1 = require("../../Constants");
/**
 * Clamps the value on a lower and an upper bound
 * @param {number} value Value to clamp
 * @param {number} min Lower bound, defaults to negative Number.MAX_VALUE
 * @param {number} max Upper bound, defaults to Number.MAX_VALUE
 * @returns {number} Clamped value
 */
function clampNumber(value, min = -Number.MAX_VALUE, max = Number.MAX_VALUE) {
    if (isNaN(value)) {
        if (Constants_1.CONSTANTS.isDevBranch)
            throw new Error("NaN passed into clampNumber()");
        return min;
    }
    return Math.max(Math.min(value, max), min);
}
function clampInteger(value, min = -Number.MAX_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
    if (isNaN(value)) {
        if (Constants_1.CONSTANTS.isDevBranch)
            throw new Error("NaN passed into clampInteger()");
        return min;
    }
    return Math.round(Math.max(Math.min(value, max), min));
}
