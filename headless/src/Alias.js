"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalAliases = exports.Aliases = void 0;
exports.loadAliases = loadAliases;
exports.loadGlobalAliases = loadGlobalAliases;
exports.printAliases = printAliases;
exports.parseAliasDeclaration = parseAliasDeclaration;
exports.removeAlias = removeAlias;
exports.substituteAliases = substituteAliases;
const Terminal_1 = require("./Terminal");
const string_1 = require("./utils/helpers/string");
exports.Aliases = new Map();
exports.GlobalAliases = new Map();
function loadAliases(saveString) {
    exports.Aliases.clear();
    const parsedAliases = JSON.parse(saveString);
    if (!parsedAliases || typeof parsedAliases !== "object")
        return;
    for (const [name, alias] of Object.entries(parsedAliases)) {
        if (typeof name === "string" && typeof alias === "string")
            exports.Aliases.set(name, alias);
    }
}
function loadGlobalAliases(saveString) {
    exports.GlobalAliases.clear();
    const parsedAliases = JSON.parse(saveString);
    if (!parsedAliases || typeof parsedAliases !== "object")
        return;
    for (const [name, alias] of Object.entries(parsedAliases)) {
        if (typeof name === "string" && typeof alias === "string")
            exports.GlobalAliases.set(name, alias);
    }
}
// Prints all aliases to terminal
function printAliases() {
    for (const [name, alias] of exports.Aliases)
        Terminal_1.Terminal.print("alias " + name + "=" + alias);
    for (const [name, alias] of exports.GlobalAliases)
        Terminal_1.Terminal.print("global alias " + name + "=" + alias);
}
// Returns true if successful, false otherwise
function parseAliasDeclaration(dec, global = false) {
    const re = /^([\w|!%,@-]+)=(.+)$/;
    const matches = dec.match(re);
    if (matches == null || matches.length != 3) {
        return false;
    }
    matches[2] = (0, string_1.trimQuotes)(matches[2]);
    if (global) {
        addGlobalAlias(matches[1], matches[2]);
    }
    else {
        addAlias(matches[1], matches[2]);
    }
    return true;
}
function addAlias(name, value) {
    exports.GlobalAliases.delete(name);
    exports.Aliases.set(name, value.trim());
}
function addGlobalAlias(name, value) {
    exports.Aliases.delete(name);
    exports.GlobalAliases.set(name, value.trim());
}
function removeAlias(name) {
    const hadAlias = exports.Aliases.has(name) || exports.GlobalAliases.has(name);
    exports.Aliases.delete(name);
    exports.GlobalAliases.delete(name);
    return hadAlias;
}
/**
 * Returns the original string with any aliases substituted in.
 * Aliases are only applied to "whole words", one level deep
 * @param origCommand the original command string
 */
function substituteAliases(origCommand) {
    return applyAliases(origCommand);
}
/**
 * Recursively evaluates aliases and applies them to the command string,
 * unless there are any reference loops or the reference chain is too deep
 * @param origCommand the original command string
 * @param depth the current recursion depth
 * @param currentlyProcessingAliases any aliases that have been applied in the recursive evaluation leading to this point
 * @return { string } the provided command with all of its referenced aliases evaluated
 */
function applyAliases(origCommand, depth = 0, currentlyProcessingAliases = []) {
    if (!origCommand) {
        return origCommand;
    }
    const commandArray = origCommand.split(" ");
    // Do not apply aliases when defining a new alias
    if (commandArray[0] === "unalias" || commandArray[0] === "alias") {
        return commandArray.join(" ");
    }
    // First get non-global aliases, and recursively apply them
    // (unless there are any reference loops or the reference chain is too deep)
    const localAlias = exports.Aliases.get(commandArray[0]);
    if (localAlias && !currentlyProcessingAliases.includes(localAlias)) {
        const appliedAlias = applyAliases(localAlias, depth + 1, [commandArray[0], ...currentlyProcessingAliases]);
        commandArray.splice(0, 1, ...appliedAlias.split(" "));
    }
    // Once local aliasing is complete (or if none are present) handle any global aliases
    const processedCommands = commandArray.reduce((resolvedCommandArray, command) => {
        const globalAlias = exports.GlobalAliases.get(command);
        if (globalAlias && !currentlyProcessingAliases.includes(globalAlias)) {
            const appliedAlias = applyAliases(globalAlias, depth + 1, [command, ...currentlyProcessingAliases]);
            resolvedCommandArray.push(appliedAlias);
        }
        else {
            // If there is no alias, or if the alias has a circular reference, leave the command as-is
            resolvedCommandArray.push(command);
        }
        return resolvedCommandArray;
    }, []);
    return processedCommands.join(" ");
}
