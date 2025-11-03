"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunningScript = void 0;
const Settings_1 = require("../Settings/Settings");
const Terminal_1 = require("../Terminal");
const JSONReviver_1 = require("../utils/JSONReviver");
const formatTime_1 = require("../utils/helpers/formatTime");
const RamCostGenerator_1 = require("../Netscript/RamCostGenerator");
const getKeyList_1 = require("../utils/helpers/getKeyList");
const scriptKey_1 = require("../utils/helpers/scriptKey");
class RunningScript {
    constructor(script, ramUsage, args = []) {
        // Script arguments
        this.args = [];
        // Map of [key: hostname] -> Hacking data. Used for offline progress calculations.
        // Hacking data format: [MoneyStolen, NumTimesHacked, NumTimesGrown, NumTimesWeaken]
        this.dataMap = {};
        // Script filename
        this.filename = "default.js";
        // This script's logs. An array of log entries
        this.logs = [];
        // Flag indicating whether the logs have been updated since
        // the last time the UI was updated
        this.logUpd = false;
        // Total amount of hacking experience earned from this script when offline
        this.offlineExpGained = 0;
        // Total amount of money made by this script when offline
        this.offlineMoneyMade = 0;
        // Number of seconds that the script has been running offline
        this.offlineRunningTime = 0.01;
        // Total amount of hacking experience earned from this script when online
        this.onlineExpGained = 0;
        // Total amount of money made by this script when online
        this.onlineMoneyMade = 0;
        // Number of seconds that this script has been running online
        this.onlineRunningTime = 0.01;
        // Process ID. Must be an integer and equals the PID of corresponding WorkerScript
        this.pid = -1;
        // Process ID of the parent process. 0 indicates no parent (such as run from terminal).
        this.parent = 0;
        // How much RAM this script uses for ONE thread
        this.ramUsage = RamCostGenerator_1.RamCostConstants.Base;
        // hostname of the server on which this script is running
        this.server = "";
        // Cached key for ByArgs lookups. Will be overwritten by a correct ScriptKey in fromJSON or constructor
        this.scriptKey = "";
        // Access to properties of the tail window. Can be used to get/set size, position, etc.
        this.tailProps = null;
        // The title, as shown in the script's log box. Defaults to the name + args,
        // but can be changed by the user. If it is set to a React element (only by the user),
        // that will not be persisted, and will be restored to default on load.
        this.title = "";
        // Number of threads that this script is running with
        this.threads = 1;
        // Whether this RunningScript is excluded from saves
        this.temporary = false;
        // Script urls for the current running script for translating urls back to file names in errors
        this.dependencies = new Map();
        if (!script)
            return;
        if (!ramUsage)
            throw new Error("Must provide a ramUsage for RunningScript initialization.");
        this.filename = script.filename;
        this.args = args;
        this.scriptKey = (0, scriptKey_1.scriptKey)(this.filename, args);
        this.server = script.server;
        this.ramUsage = ramUsage;
        this.dependencies = script.dependencies;
        this.title = `${this.filename} ${args.join(" ")}`;
    }
    log(txt) {
        if (this.logs.length > Settings_1.Settings.MaxLogCapacity) {
            this.logs.shift();
        }
        let logEntry = txt;
        if (Settings_1.Settings.TimestampsFormat && typeof txt === "string") {
            logEntry = `[${(0, formatTime_1.formatTime)(Settings_1.Settings.TimestampsFormat)}] ${txt}`;
        }
        this.logs.push(logEntry);
        this.logUpd = true;
    }
    displayLog() {
        for (const log of this.logs) {
            if (typeof log === "string") {
                Terminal_1.Terminal.print(log);
            }
            else {
                Terminal_1.Terminal.printRaw(log);
            }
        }
    }
    clearLog() {
        this.logs.length = 0;
    }
    // Update the moneyStolen and numTimesHack maps when hacking
    recordHack(hostname, moneyGained, n = 1) {
        if (this.dataMap[hostname] == null || this.dataMap[hostname].constructor !== Array) {
            this.dataMap[hostname] = [0, 0, 0, 0];
        }
        this.dataMap[hostname][0] += moneyGained;
        this.dataMap[hostname][1] += n;
    }
    // Update the grow map when calling grow()
    recordGrow(hostname, n = 1) {
        if (this.dataMap[hostname] == null || this.dataMap[hostname].constructor !== Array) {
            this.dataMap[hostname] = [0, 0, 0, 0];
        }
        this.dataMap[hostname][2] += n;
    }
    // Update the weaken map when calling weaken() {
    recordWeaken(hostname, n = 1) {
        if (this.dataMap[hostname] == null || this.dataMap[hostname].constructor !== Array) {
            this.dataMap[hostname] = [0, 0, 0, 0];
        }
        this.dataMap[hostname][3] += n;
    }
    // Serialize the current object to a JSON save state
    toJSON() {
        // Omit the title if it's a ReactNode, it will be filled in with the default on load.
        return (0, JSONReviver_1.Generic_toJSON)("RunningScript", this, typeof this.title === "string" ? includedProperties : includedPropsNoTitle);
    }
    // Initializes a RunningScript Object from a JSON save state
    static fromJSON(value) {
        const runningScript = (0, JSONReviver_1.Generic_fromJSON)(RunningScript, value.data, includedProperties);
        if (!runningScript.scriptKey)
            runningScript.scriptKey = (0, scriptKey_1.scriptKey)(runningScript.filename, runningScript.args);
        if (!runningScript.title)
            runningScript.title = `${runningScript.filename} ${runningScript.args.join(" ")}`;
        return runningScript;
    }
}
exports.RunningScript = RunningScript;
const includedProperties = (0, getKeyList_1.getKeyList)(RunningScript, {
    removedKeys: ["logs", "dependencies", "logUpd", "pid", "parent", "tailProps"],
});
const includedPropsNoTitle = includedProperties.filter((x) => x !== "title");
JSONReviver_1.constructorsForReviver.RunningScript = RunningScript;
