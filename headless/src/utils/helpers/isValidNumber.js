"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidNumber = isValidNumber;
/**
 * Checks that a variable is a valid number. A valid number
 * must be a "number" type and cannot be NaN
 */
function isValidNumber(n) {
    return typeof n === "number" && !isNaN(n);
}
