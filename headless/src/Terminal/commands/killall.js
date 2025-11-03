"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.killall = killall;
const Terminal_1 = require("../../Terminal");
const killWorkerScript_1 = require("../../Netscript/killWorkerScript");
function killall(_args, server) {
    Terminal_1.Terminal.print("Killing all running scripts");
    for (const byPid of server.runningScriptMap.values()) {
        for (const runningScript of byPid.values()) {
            (0, killWorkerScript_1.killWorkerScriptByPid)(runningScript.pid);
        }
    }
}
