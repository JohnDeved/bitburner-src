"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundToTwo = roundToTwo;
/**
 * Rounds a number to two decimal places.
 * @param decimal A decimal value to trim to two places.
 */
function roundToTwo(decimal) {
    return Math.round(decimal * 100) / 100;
}
