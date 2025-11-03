"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayToString = arrayToString;
exports.filterTruthy = filterTruthy;
/**
 * Returns the input array as a comma separated string.
 *
 * Does several things that Array.toString() doesn't do
 *  - Adds brackets around the array
 *  - Adds quotation marks around strings
 */
function arrayToString(a) {
    const vals = [];
    for (let i = 0; i < a.length; ++i) {
        let elem = a[i];
        if (Array.isArray(elem)) {
            elem = arrayToString(elem);
        }
        else if (typeof elem === "string") {
            elem = `"${elem}"`;
        }
        vals.push(elem);
    }
    return `[${vals.join(", ")}]`;
}
function filterTruthy(input) {
    return input.filter(Boolean);
}
