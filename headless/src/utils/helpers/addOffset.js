"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addOffset = addOffset;
/**
 * Adds a random offset to a number within a certain percentage
 * @example
 * // Returns between 95-105
 * addOffset(100, 5);
 * @example
 * // Returns between 63-77
 * addOffSet(70, 10);
 * @param midpoint The number to be the midpoint of the offset range
 * @param percentage The percentage (in a range of 0-100) to offset
 */
function addOffset(midpoint, percentage) {
    const maxPercent = 100;
    if (percentage < 0 || percentage > maxPercent) {
        return midpoint;
    }
    const offset = midpoint * (percentage / maxPercent);
    // Double the range to account for both sides of the midpoint.
    return midpoint + (Math.random() * (offset * 2) - offset);
}
