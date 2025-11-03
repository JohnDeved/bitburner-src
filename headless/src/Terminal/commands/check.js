"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = check;
const Terminal_1 = require("../../Terminal");
const ScriptHelpers_1 = require("../../Script/ScriptHelpers");
const ScriptFilePath_1 = require("../../Paths/ScriptFilePath");
function check(args, server) {
    if (args.length < 1) {
        Terminal_1.Terminal.error(`Incorrect number of arguments. Usage: check [script] [arg1] [arg2]...`);
    }
    else {
        const scriptName = Terminal_1.Terminal.getFilepath(args[0] + "");
        if (!scriptName)
            return Terminal_1.Terminal.error(`Invalid filename: ${args[0]}`);
        // Can only tail script files
        if (!(0, ScriptFilePath_1.hasScriptExtension)(scriptName)) {
            return Terminal_1.Terminal.error(`check: File extension must be one of ${ScriptFilePath_1.validScriptExtensions.join(", ")})`);
        }
        // Check that the script is running on this machine
        const runningScripts = (0, ScriptHelpers_1.findRunningScripts)(scriptName, args.slice(1), server);
        if (runningScripts === null) {
            Terminal_1.Terminal.error(`No script named ${scriptName} is running on the server`);
            return;
        }
        const next = runningScripts.values().next();
        if (!next.done) {
            next.value.displayLog();
        }
    }
}
