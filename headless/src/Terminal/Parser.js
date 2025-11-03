"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitCommands = splitCommands;
exports.parseCommands = parseCommands;
exports.parseCommand = parseCommand;
const string_1 = require("../utils/helpers/string");
const Alias_1 = require("../Alias");
// Helper function to parse individual arguments into number/boolean/string as appropriate
function parseArg(arg) {
    if (arg === "true")
        return true;
    if (arg === "false")
        return false;
    const argAsNumber = Number(arg);
    if (!isNaN(argAsNumber))
        return argAsNumber;
    return (0, string_1.trimQuotes)(arg);
}
/** split a commands string into a commands array */
function splitCommands(commandsText) {
    // regex to match each entire command separately, without the semicolon included.
    const commandRegex = /(?:'[^']*'|"[^"]*"|[^;])*/g;
    const commands = commandsText.match(commandRegex);
    if (!commands)
        return [];
    return commands.map((command) => command.trim());
}
/** parse a commands string, including alias substitution, into a commands array */
function parseCommands(commandsText) {
    // Split the commands, apply aliases once, then split again and filter out empty commands.
    const commands = splitCommands(commandsText).map(Alias_1.substituteAliases).flatMap(splitCommands).filter(Boolean);
    return commands;
}
/** get a commandArgs array from a single command string */
function parseCommand(command) {
    // Match every command arg in a given command string
    const argDetection = /(?:([^ ;"']*"[^"]*"|[^ ;"']*'[^']*'|[^\s]+))/g;
    const commandArgs = command.match(argDetection);
    if (!commandArgs)
        return [];
    return commandArgs.map(parseArg);
}
