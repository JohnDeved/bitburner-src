"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tail = tail;
const Terminal_1 = require("../../Terminal");
const ScriptHelpers_1 = require("../../Script/ScriptHelpers");
const LogBoxManager_1 = require("../../ui/React/LogBoxManager");
const ScriptFilePath_1 = require("../../Paths/ScriptFilePath");
function tail(commandArray, server) {
    try {
        if (commandArray.length < 1) {
            Terminal_1.Terminal.error("Incorrect number of arguments. Usage: tail [pid] or tail [scriptname] [arg1] [arg2]...");
        }
        else if (typeof commandArray[0] === "string") {
            const [rawName, ...args] = commandArray;
            const path = Terminal_1.Terminal.getFilepath(rawName);
            if (!path)
                return Terminal_1.Terminal.error(`Invalid filename: ${rawName}`);
            if (!(0, ScriptFilePath_1.hasScriptExtension)(path))
                return Terminal_1.Terminal.error(`Invalid file extension. Tail can only be used on scripts.`);
            const candidates = (0, ScriptHelpers_1.findRunningScripts)(path, args, server);
            // if there's no candidate then we just don't know.
            if (candidates === null) {
                Terminal_1.Terminal.error(`No script named ${path} with args ${JSON.stringify(args)} is running on the server`);
                return;
            }
            // Just use the first one (if there are multiple with the same
            // arguments, they can't be distinguished except by pid).
            const next = candidates.values().next();
            if (!next.done) {
                LogBoxManager_1.LogBoxEvents.emit(next.value);
            }
        }
        else if (typeof commandArray[0] === "number") {
            const runningScript = (0, ScriptHelpers_1.findRunningScriptByPid)(commandArray[0]);
            if (runningScript == null) {
                Terminal_1.Terminal.error(`No script with PID ${commandArray[0]} is running`);
                return;
            }
            LogBoxManager_1.LogBoxEvents.emit(runningScript);
        }
    }
    catch (error) {
        console.error(error);
        Terminal_1.Terminal.error(String(error));
    }
}
