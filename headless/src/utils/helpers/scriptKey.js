"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scriptKey = scriptKey;
exports.matchScriptPathExact = matchScriptPathExact;
exports.matchScriptPathUnanchored = matchScriptPathUnanchored;
// The key used to lookup worker scripts in their map.
function scriptKey(path, args) {
    // Asterisk is used as a delimiter because it' not a valid character in paths.
    return (path + "*" + JSON.stringify(args));
}
// Returns a RegExp that can be used to find scripts with a path that fully
// matches "pattern" in the scriptKey.
function matchScriptPathExact(pattern) {
    // Must fully match pattern, starting at the beginning and ending with the
    // asterisk delimiter, which can't appear in script paths.
    return new RegExp("^" + pattern + "\\*");
}
// Returns a RegExp that can be used to find scripts with a path that
// matches "pattern" somewhere in the scriptKey.
function matchScriptPathUnanchored(pattern) {
    // Don't let the match extend into the arguments part (script paths can't
    // include "[").
    return matchScriptPathExact("[^[]*" + pattern + "[^[]*");
}
