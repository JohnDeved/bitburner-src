"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomIntInclusive = getRandomIntInclusive;
/**
 *
 * Gets a random integer between min (inclusive) and max (inclusive).
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 *
 * @param min The minimum value in the range.
 * @param max The maximum value in the range.
 */
function getRandomIntInclusive(min, max) {
    if (!Number.isInteger(min)) {
        throw new Error(`Min is not an integer. Min: ${min}.`);
    }
    if (!Number.isInteger(max)) {
        throw new Error(`Max is not an integer. Max: ${max}.`);
    }
    if (min > max) {
        throw new Error(`Min is greater than max. Min: ${min}. Max: ${max}.`);
    }
    return Math.floor(Math.random() * (max - min + 1) + min);
}
