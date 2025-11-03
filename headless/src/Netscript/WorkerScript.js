"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerScript = void 0;
const Environment_1 = require("./Environment");
const RamCostGenerator_1 = require("./RamCostGenerator");
const AllServers_1 = require("../Server/AllServers");
class WorkerScript {
    constructor(runningScriptObj, pid, nsFuncsGenerator) {
        /** Copy of the script's code */
        this.code = "";
        /**
         * Holds the timeoutID (numeric value) for whenever this script is blocked by a
         * timed Netscript function. i.e. Holds the return value of setTimeout()
         */
        this.delay = null;
        /** Holds the Promise reject() function while the script is "blocked" by an async op */
        this.delayReject = undefined;
        /** Stores names of all functions that have logging disabled */
        this.disableLogs = {};
        /**
         * Used for dynamic RAM calculation. Stores names of all functions that have
         * already been checked by this script.
         * TODO: Could probably just combine this with loadedFns?
         */
        this.dynamicLoadedFns = {};
        /** Tracks dynamic RAM usage */
        this.dynamicRamUsage = RamCostGenerator_1.RamCostConstants.Base;
        /**
         * Used for static RAM calculation. Stores names of all functions that have
         * already been checked by this script
         */
        this.loadedFns = {};
        /** Script's output/return value. Currently not used or implemented */
        this.output = "";
        /**Map of functions called when the script ends. */
        this.atExit = new Map();
        this.name = runningScriptObj.filename;
        this.hostname = runningScriptObj.server;
        const sanitizedPid = Math.round(pid);
        if (typeof sanitizedPid !== "number" || isNaN(sanitizedPid)) {
            throw new Error(`Invalid PID when constructing WorkerScript: ${pid}`);
        }
        this.pid = sanitizedPid;
        runningScriptObj.pid = sanitizedPid;
        // Get the underlying script's code
        const server = (0, AllServers_1.GetServer)(this.hostname);
        if (server == null) {
            throw new Error(`WorkerScript constructed with invalid server ip: ${this.hostname}`);
        }
        const script = server.scripts.get(this.name);
        if (!script) {
            throw new Error(`WorkerScript constructed with invalid script filename: ${this.name}`);
        }
        this.code = script.code;
        this.scriptRef = runningScriptObj;
        this.args = runningScriptObj.args.slice();
        this.env = new Environment_1.Environment();
        if (typeof nsFuncsGenerator === "function") {
            this.env.vars = nsFuncsGenerator(this);
        }
    }
    /** Returns the Server on which this script is running */
    getServer() {
        const server = (0, AllServers_1.GetServer)(this.hostname);
        if (server == null)
            throw new Error(`Script ${this.name} pid ${this.pid} is running on non-existent server?`);
        return server;
    }
    /**
     * Returns the Script object for the underlying script.
     * Returns null if it cannot be found (which would be a bug)
     */
    getScript() {
        const server = this.getServer();
        const script = server.scripts.get(this.name);
        if (!script) {
            console.error("Failed to find underlying Script object in WorkerScript.getScript(). This probably means somethings wrong");
            return null;
        }
        return script;
    }
    shouldLog(fn) {
        return !(this.disableLogs.ALL || this.disableLogs[fn]);
    }
    log(func, txt) {
        if (this.shouldLog(func)) {
            if (func && txt) {
                this.scriptRef.log(`${func}: ${txt()}`);
            }
            else if (func) {
                this.scriptRef.log(func);
            }
            else {
                this.scriptRef.log(txt());
            }
        }
    }
    print(txt) {
        this.scriptRef.log(txt);
    }
}
exports.WorkerScript = WorkerScript;
