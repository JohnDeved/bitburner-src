"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kill = kill;
const Terminal_1 = require("../../Terminal");
const ScriptHelpers_1 = require("../../Script/ScriptHelpers");
const killWorkerScript_1 = require("../../Netscript/killWorkerScript");
const ScriptFilePath_1 = require("../../Paths/ScriptFilePath");
function kill(args, server) {
    try {
        if (args.length < 1 || typeof args[0] === "boolean") {
            Terminal_1.Terminal.error("Incorrect usage of kill command. Usage: kill [pid] or kill [scriptname] [arg1] [arg2]...");
            return;
        }
        // Kill by PID
        if (typeof args[0] === "number") {
            const pid = args[0];
            const res = (0, killWorkerScript_1.killWorkerScriptByPid)(pid);
            if (res) {
                Terminal_1.Terminal.print(`Killing script with PID ${pid}`);
            }
            else {
                Terminal_1.Terminal.error(`Failed to kill script with PID ${pid}. No such script is running`);
            }
            return;
        }
        const path = Terminal_1.Terminal.getFilepath(args[0]);
        if (!path)
            return Terminal_1.Terminal.error(`Invalid filename: ${args[0]}`);
        if (!(0, ScriptFilePath_1.hasScriptExtension)(path))
            return Terminal_1.Terminal.error(`Invalid file extension. Kill can only be used on scripts.`);
        const runningScripts = (0, ScriptHelpers_1.findRunningScripts)(path, args.slice(1), server);
        if (runningScripts === null) {
            Terminal_1.Terminal.error("No such script is running. Nothing to kill");
            return;
        }
        let killed = 0;
        for (const pid of runningScripts.keys()) {
            killed++;
            if (killed < 5) {
                Terminal_1.Terminal.print(`Killing ${path} with pid ${pid}`);
            }
            (0, killWorkerScript_1.killWorkerScriptByPid)(pid);
        }
        if (killed >= 5) {
            Terminal_1.Terminal.print(`... killed ${killed} instances total`);
        }
    }
    catch (error) {
        console.error(error);
        Terminal_1.Terminal.error(String(error));
    }
}
