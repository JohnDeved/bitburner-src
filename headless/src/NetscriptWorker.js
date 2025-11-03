"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetscriptPorts = void 0;
exports.prestigeWorkerScripts = prestigeWorkerScripts;
exports.startWorkerScript = startWorkerScript;
exports.updateOnlineScriptTimes = updateOnlineScriptTimes;
exports.loadAllRunningScripts = loadAllRunningScripts;
exports.createRunningScriptInstance = createRunningScriptInstance;
exports.runScriptFromScript = runScriptFromScript;
/**
 * Functions for handling WorkerScripts, which are the underlying mechanism
 * that allows for scripts to run
 */
const killWorkerScript_1 = require("./Netscript/killWorkerScript");
const ScriptDeath_1 = require("./Netscript/ScriptDeath");
const WorkerScript_1 = require("./Netscript/WorkerScript");
const WorkerScripts_1 = require("./Netscript/WorkerScripts");
const Pid_1 = require("./Netscript/Pid");
const Constants_1 = require("./Constants");
const NetscriptFunctions_1 = require("./NetscriptFunctions");
const NetscriptJSEvaluator_1 = require("./NetscriptJSEvaluator");
const RunningScript_1 = require("./Script/RunningScript");
const ScriptHelpers_1 = require("./Script/ScriptHelpers");
const AllServers_1 = require("./Server/AllServers");
const Settings_1 = require("./Settings/Settings");
const DialogBox_1 = require("./ui/React/DialogBox");
const formatNumber_1 = require("./ui/formatNumber");
const ArrayHelpers_1 = require("./utils/helpers/ArrayHelpers");
const roundToTwo_1 = require("./utils/helpers/roundToTwo");
const Parser_1 = require("./Terminal/Parser");
const Terminal_1 = require("./Terminal");
const NetscriptHelpers_1 = require("./Netscript/NetscriptHelpers");
const ErrorHandler_1 = require("./utils/ErrorHandler");
const ScriptFilePath_1 = require("./Paths/ScriptFilePath");
const _player_1 = require("@player");
const UIEventEmitter_1 = require("./ui/UIEventEmitter");
const ErrorHelper_1 = require("./utils/ErrorHelper");
const exceptionAlert_1 = require("./utils/helpers/exceptionAlert");
exports.NetscriptPorts = new Map();
function prestigeWorkerScripts() {
    for (const ws of WorkerScripts_1.workerScripts.values()) {
        (0, killWorkerScript_1.killWorkerScript)(ws);
    }
    exports.NetscriptPorts.clear();
}
async function startNetscript2Script(workerScript) {
    const scripts = workerScript.getServer().scripts;
    const script = workerScript.getScript();
    if (!script)
        throw "workerScript had no associated script. This is a bug.";
    const ns = workerScript.env.vars;
    if (!ns)
        throw `${script.filename} cannot be run because the NS object hasn't been constructed properly.`;
    const loadedModule = await (0, NetscriptJSEvaluator_1.compile)(script, scripts);
    // if for whatever reason the stopFlag is already set we abort
    if (workerScript.env.stopFlag)
        return;
    if (!loadedModule)
        throw `${script.filename} cannot be run because the script module won't load`;
    const mainFunc = loadedModule.main;
    // TODO unplanned: Better error for "unexpected reserved word" when using await in non-async function?
    if (typeof mainFunc !== "function")
        throw `${script.filename} cannot be run because it does not have a main function.`;
    // Explicitly called from a variable so that we don't bind "this".
    await mainFunc(ns);
}
/**
 * Used to start a RunningScript (by creating and starting its
 * corresponding WorkerScript), and add the RunningScript to the server on which
 * it is active
 */
function startWorkerScript(runningScript, server, parent) {
    if (server.hostname !== runningScript.server) {
        // Temporarily adding a check here to see if this ever triggers
        (0, exceptionAlert_1.exceptionAlert)(new Error(`Tried to launch a worker script on a different server ${server.hostname} than the runningScript's server ${runningScript.server}`), true);
        return 0;
    }
    if (createAndAddWorkerScript(runningScript, server, parent)) {
        // Push onto runningScripts.
        // This has to come after createAndAddWorkerScript() because that fn updates RAM usage
        server.runScript(runningScript);
        // Once the WorkerScript is constructed in createAndAddWorkerScript(), the RunningScript
        // object should have a PID assigned to it, so we return that
        return runningScript.pid;
    }
    return 0;
}
/**
 * Given a RunningScript object, constructs its corresponding WorkerScript,
 * adds it to the global 'workerScripts' pool, and begins executing it.
 * @param {RunningScript} runningScriptObj - Script that's being run
 * @param {Server} server - Server on which the script is to be run
 * returns {boolean} indicating whether or not the workerScript was successfully added
 */
function createAndAddWorkerScript(runningScriptObj, server, parent) {
    if ((0, ScriptFilePath_1.isLegacyScript)(runningScriptObj.filename)) {
        deferredError(`Running .script files is unsupported.`);
        return false;
    }
    const ramUsage = (0, roundToTwo_1.roundToTwo)(runningScriptObj.ramUsage * runningScriptObj.threads);
    const ramAvailable = server.maxRam - server.ramUsed;
    // Check failure conditions before generating the workersScript and return false
    if (ramUsage > ramAvailable + 0.001) {
        deferredError(`Not enough RAM to run script ${runningScriptObj.filename} with args ${(0, ArrayHelpers_1.arrayToString)(runningScriptObj.args)}, needed ${(0, formatNumber_1.formatRam)(ramUsage)} but only have ${(0, formatNumber_1.formatRam)(ramAvailable)} free
If you are seeing this on startup, likely causes are that the autoexec script is too big to fit in RAM, or it took up too much space and other previously running scripts couldn't fit on home.
Otherwise, this can also occur if you have attempted to launch a script from a tail window with insufficient RAM.`);
        return false;
    }
    // Get the pid
    const pid = (0, Pid_1.generateNextPid)();
    if (pid === -1) {
        deferredError(`Failed to start script because could not find available PID. This is most ` +
            `because you have too many scripts running.`);
        return false;
    }
    server.updateRamUsed((0, roundToTwo_1.roundToTwo)(server.ramUsed + ramUsage));
    // Create the WorkerScript. NOTE: WorkerScript ctor will set the underlying
    // RunningScript's PID as well
    const workerScript = new WorkerScript_1.WorkerScript(runningScriptObj, pid, NetscriptFunctions_1.NetscriptFunctions);
    // Add the WorkerScript to the global pool
    WorkerScripts_1.workerScripts.set(pid, workerScript);
    // Start the script's execution using the correct function for file type
    startNetscript2Script(workerScript)
        // Once the code finishes (either resolved or rejected, doesn't matter), set its
        // running status to false
        .then(function () {
        (0, killWorkerScript_1.killWorkerScript)(workerScript);
        workerScript.log("", () => "Script finished running");
    })
        .catch(function (error) {
        (0, ErrorHandler_1.handleUnknownError)(error, workerScript);
        (0, killWorkerScript_1.killWorkerScript)(workerScript);
        workerScript.log("", () => error instanceof ScriptDeath_1.ScriptDeath
            ? "main() terminated."
            : (0, ErrorHelper_1.getErrorMessageWithStackAndCause)(error, "Script crashed due to an error: "));
    })
        .finally(() => {
        // The earnings are transferred to the parent if it still exists.
        if (parent && !parent.env.stopFlag) {
            parent.scriptRef.onlineExpGained += runningScriptObj.onlineExpGained;
            parent.scriptRef.onlineMoneyMade += runningScriptObj.onlineMoneyMade;
        }
    });
    return true;
}
/** Updates the online running time stat of all running scripts */
function updateOnlineScriptTimes(numCycles = 1) {
    const time = (numCycles * Constants_1.CONSTANTS.MilliPerCycle) / 1000; //seconds
    for (const ws of WorkerScripts_1.workerScripts.values()) {
        ws.scriptRef.onlineRunningTime += time;
    }
}
// Needed for popping dialog boxes in functions that run *before* the UI is
// created, and thus before AlertManager exists to listen to the alerts we
// create.
function deferredError(msg) {
    setTimeout(() => (0, DialogBox_1.dialogBoxCreate)(msg), 0);
}
function createAutoexec(server) {
    const args = (0, Parser_1.parseCommand)(Settings_1.Settings.AutoexecScript);
    if (args.length === 0)
        return null;
    const cmd = String(args[0]);
    const scriptPath = (0, ScriptFilePath_1.resolveScriptFilePath)(cmd);
    if (!scriptPath) {
        deferredError(`While running autoexec script:
"${cmd}" is invalid for a script name (maybe missing suffix?)`);
        return null;
    }
    const script = server.scripts.get(scriptPath);
    if (!script) {
        deferredError(`While running autoexec script:
"${cmd}" does not exist!`);
        return null;
    }
    const ramUsage = script.getRamUsage(server.scripts);
    if (ramUsage === null) {
        deferredError(`While running autoexec script:
"${cmd}" has errors!`);
        return null;
    }
    args.shift();
    const rs = new RunningScript_1.RunningScript(script, ramUsage, args);
    rs.temporary = true;
    return rs;
}
/**
 * Called when the game is loaded. Loads all running scripts (from all servers)
 * into worker scripts so that they will start running
 */
function loadAllRunningScripts() {
    /**
     * While loading the save data, the game engine calls this function to load all running scripts. With each script, we
     * calculate the offline data, so we need the current "lastUpdate" and "playtimeSinceLastAug" from the save data.
     * After the main UI is loaded and the logic of this function starts executing, those info in the Player object might be
     * overwritten, so we need to save them here and use them later in "scriptCalculateOfflineProduction".
     */
    const playerLastUpdate = _player_1.Player.lastUpdate;
    const playerPlaytimeSinceLastAug = _player_1.Player.playtimeSinceLastAug;
    const unsubscribe = UIEventEmitter_1.UIEventEmitter.subscribe((event) => {
        if (event !== UIEventEmitter_1.UIEventType.MainUILoaded) {
            return;
        }
        unsubscribe();
        /**
         * Accept all parameters containing "?noscript". The "standard" parameter is "?noScripts", but new players may not
         * notice the "s" character at the end of "noScripts".
         */
        const skipScriptLoad = window.location.href.toLowerCase().includes("?noscript");
        if (skipScriptLoad) {
            Terminal_1.Terminal.warn("Skipped loading player scripts during startup");
            console.info("Skipping the load of any scripts during startup");
        }
        for (const server of (0, AllServers_1.GetAllServers)()) {
            // Reset each server's RAM usage to 0
            server.ramUsed = 0;
            const rsList = server.savedScripts;
            server.savedScripts = undefined;
            if (skipScriptLoad || !rsList) {
                // Start game with no scripts
                continue;
            }
            if (server.hostname === "home") {
                // Push autoexec script onto the front of the list
                const runningScript = createAutoexec(server);
                if (runningScript) {
                    rsList.unshift(runningScript);
                }
            }
            for (const runningScript of rsList) {
                startWorkerScript(runningScript, server);
                (0, ScriptHelpers_1.scriptCalculateOfflineProduction)(runningScript, playerLastUpdate, playerPlaytimeSinceLastAug);
            }
        }
    });
}
function createRunningScriptInstance(server, scriptPath, runOpts, args) {
    const script = server.scripts.get(scriptPath);
    if (!script) {
        return {
            success: false,
            message: `Script ${scriptPath} does not exist on ${server.hostname}.`,
        };
    }
    if (!server.hasAdminRights) {
        return {
            success: false,
            message: `You do not have root access on ${server.hostname}.`,
        };
    }
    const singleRamUsage = runOpts.ramOverride ?? script.getRamUsage(server.scripts);
    if (!singleRamUsage) {
        return {
            success: false,
            message: `Cannot calculate RAM usage of ${scriptPath}. Reason: ${script.ramCalculationError}`,
        };
    }
    const ramUsage = singleRamUsage * runOpts.threads;
    const ramAvailable = server.maxRam - server.ramUsed;
    if (ramUsage > ramAvailable + 0.001) {
        return {
            success: false,
            message: `Cannot run ${scriptPath} (t=${runOpts.threads}) on ${server.hostname}. This script requires ${(0, formatNumber_1.formatRam)(ramUsage)} of RAM.`,
        };
    }
    const runningScript = new RunningScript_1.RunningScript(script, singleRamUsage, args);
    runningScript.temporary = runOpts.temporary;
    return {
        success: true,
        runningScript,
    };
}
/** Run a script from inside another script (run(), exec(), spawn(), etc.) */
function runScriptFromScript(caller, server, scriptPath, args, workerScript, runOpts) {
    // This does not adjust server RAM usage or change any state, so it is safe to call before performing other checks
    const result = createRunningScriptInstance(server, scriptPath, runOpts, args);
    if (!result.success) {
        workerScript.log(caller, () => result.message);
        return 0;
    }
    // Check if script is already running on server and fail if it is.
    if (runOpts.preventDuplicates &&
        (0, NetscriptHelpers_1.getRunningScriptsByArgs)({ workerScript, function: "runScriptFromScript", functionPath: "internal.runScriptFromScript" }, scriptPath, server.hostname, args) !== null) {
        workerScript.log(caller, () => `'${scriptPath}' is already running on '${server.hostname}'`);
        return 0;
    }
    // Able to run script
    workerScript.log(caller, () => `'${scriptPath}' on '${server.hostname}' with ${runOpts.threads} threads and args: ${(0, ArrayHelpers_1.arrayToString)(args)}.`);
    const runningScriptObj = result.runningScript;
    runningScriptObj.parent = workerScript.pid;
    runningScriptObj.threads = runOpts.threads;
    runningScriptObj.temporary = runOpts.temporary;
    return startWorkerScript(runningScriptObj, server, workerScript);
}
