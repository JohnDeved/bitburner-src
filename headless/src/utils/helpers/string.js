"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimQuotes = trimQuotes;
/** Removes a single layer of matching single or double quotes, if present. */
function trimQuotes(value) {
    if (value.length < 2)
        return value;
    if (value.at(0) !== value.at(-1))
        return value;
    if (value.at(0) !== "'" && value.at(0) !== '"')
        return value;
    return value.substring(1, value.length - 1);
}
