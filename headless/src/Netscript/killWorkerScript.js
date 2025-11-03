"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.killAllScripts = void 0;
exports.killWorkerScript = killWorkerScript;
exports.killWorkerScriptByPid = killWorkerScriptByPid;
/**
 * Stops an actively-running script (represented by a WorkerScript object)
 * and removes it from the global pool of active scripts.
 */
const ScriptDeath_1 = require("./ScriptDeath");
const WorkerScript_1 = require("./WorkerScript");
const WorkerScripts_1 = require("./WorkerScripts");
const AllServers_1 = require("../Server/AllServers");
const RecentScripts_1 = require("./RecentScripts");
const InteractiveTutorial_1 = require("../InteractiveTutorial");
const AlertManager_1 = require("../ui/React/AlertManager");
const ErrorHandler_1 = require("../utils/ErrorHandler");
const roundToTwo_1 = require("../utils/helpers/roundToTwo");
function killWorkerScript(ws) {
    if (InteractiveTutorial_1.ITutorial.isRunning) {
        AlertManager_1.AlertEvents.emit("Processes cannot be killed during the tutorial.");
        return false;
    }
    stopAndCleanUpWorkerScript(ws);
    return true;
}
function killWorkerScriptByPid(pid, killer) {
    const ws = WorkerScripts_1.workerScripts.get(pid);
    if (ws instanceof WorkerScript_1.WorkerScript) {
        ws.log("", () => (killer ? `Script killed by script ${killer.name} with PID ${killer.pid}` : "Script killed."));
        stopAndCleanUpWorkerScript(ws);
        return true;
    }
    return false;
}
const killAllScripts = () => {
    for (const server of (0, AllServers_1.GetAllServers)()) {
        for (const byPid of server.runningScriptMap.values()) {
            for (const pid of byPid.keys()) {
                killWorkerScriptByPid(pid);
            }
        }
    }
};
exports.killAllScripts = killAllScripts;
function stopAndCleanUpWorkerScript(ws) {
    // Only clean up once.
    // Important: Only this function can set stopFlag!
    if (ws.env.stopFlag)
        return;
    //Clean up any ongoing netscriptDelay
    if (ws.delay)
        clearTimeout(ws.delay);
    ws.delayReject?.(new ScriptDeath_1.ScriptDeath(ws));
    ws.env.runningFn = "";
    const atExit = ws.atExit;
    //Calling ns.exit inside ns.atExit can lead to recursion
    //so the map must be cleared before looping
    ws.atExit = new Map();
    for (const [id, callback] of atExit) {
        try {
            callback();
        }
        catch (e) {
            (0, ErrorHandler_1.handleUnknownError)(e, ws, `Error running atExit function with id ${id}.\n\n`);
        }
    }
    if (ws.env.stopFlag) {
        // If atExit() kills the script, we'll already be stopped, don't stop again.
        return;
    }
    ws.env.stopFlag = true;
    removeWorkerScript(ws);
}
/**
 * Helper function that removes the script being killed from the global pool.
 * Also handles other cleanup-time operations
 *
 * @param {WorkerScript} - Identifier for WorkerScript. Either the object itself, or
 *                                  its index in the global workerScripts array
 */
function removeWorkerScript(workerScript) {
    const ip = workerScript.hostname;
    // Get the server on which the script runs
    const server = (0, AllServers_1.GetServer)(ip);
    if (server == null) {
        console.error(`Could not find server on which this script is running: ${ip}`);
        return;
    }
    // Delete the RunningScript object from that server
    const rs = workerScript.scriptRef;
    const byPid = server.runningScriptMap.get(rs.scriptKey);
    if (!byPid) {
        console.error(`Couldn't find runningScriptMap for key ${rs.scriptKey}`);
    }
    else {
        byPid.delete(workerScript.pid);
        if (byPid.size === 0) {
            server.runningScriptMap.delete(rs.scriptKey);
        }
    }
    // Update ram used. Reround to prevent accumulation of error.
    server.updateRamUsed((0, roundToTwo_1.roundToTwo)(server.ramUsed - rs.ramUsage * rs.threads));
    WorkerScripts_1.workerScripts.delete(workerScript.pid);
    if (rs.temporary === false) {
        (0, RecentScripts_1.AddRecentScript)(workerScript);
    }
}
