"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Script = void 0;
const RamCalculations_1 = require("./RamCalculations");
const JSONReviver_1 = require("../utils/JSONReviver");
const roundToTwo_1 = require("../utils/helpers/roundToTwo");
const RamCostGenerator_1 = require("../Netscript/RamCostGenerator");
const ContentFile_1 = require("../Paths/ContentFile");
/** A script file as a file on a server.
 * For the execution of a script, see RunningScript and WorkerScript */
class Script extends ContentFile_1.ContentFile {
    get content() {
        this.metadata.read();
        return this.code;
    }
    set content(newCode) {
        this.metadata.edit();
        if (this.code === newCode)
            return;
        this.code = newCode;
        this.invalidateModule();
    }
    constructor(filename = "default.js", code = "", server = "") {
        super();
        // Ram calculation, only exists after first poll of ram cost after updating
        this.ramUsage = null;
        this.ramUsageEntries = [];
        this.ramCalculationError = null;
        // Runtime data that only exists when the script has been initiated. Cleared when script or a dependency script is updated.
        this.mod = null;
        /** Scripts that directly import this one. Stored so we can invalidate these dependent scripts when this one is invalidated. */
        this.dependents = new Set();
        /**
         * Scripts that we directly or indirectly import, including ourselves.
         * Stored only so RunningScript can use it, to translate urls in error messages.
         * Because RunningScript uses the reference directly (to reduce object copies), it must be immutable.
         */
        this.dependencies = new Map();
        this.filename = filename;
        this.code = code;
        this.server = server; // hostname of server this script is on
    }
    /** Invalidates the current script module and related data, e.g. when modifying the file. */
    invalidateModule() {
        // Always clear ram usage
        this.ramUsage = null;
        this.ramUsageEntries.length = 0;
        this.ramCalculationError = null;
        // Early return if there's already no URL
        if (!this.mod)
            return;
        this.mod = null;
        for (const dependent of this.dependents)
            dependent.invalidateModule();
        this.dependents.clear();
        // This will be mutated in compile(), but is immutable after that.
        // (No RunningScripts can access this copy before that point).
        this.dependencies = new Map();
    }
    /** Gets the ram usage, while also attempting to update it if it's currently null */
    getRamUsage(otherScripts) {
        if (this.ramUsage)
            return this.ramUsage;
        this.updateRamUsage(otherScripts);
        return this.ramUsage;
    }
    /**
     * Calculates and updates the script's RAM usage based on its code
     * @param {Script[]} otherScripts - Other scripts on the server. Used to process imports
     */
    updateRamUsage(otherScripts) {
        const ramCalc = (0, RamCalculations_1.calculateRamUsage)(this.code, this.filename, this.server, otherScripts);
        if (ramCalc.cost && ramCalc.cost >= RamCostGenerator_1.RamCostConstants.Base) {
            this.ramUsage = (0, roundToTwo_1.roundToTwo)(ramCalc.cost);
            this.ramUsageEntries = ramCalc.entries;
            this.ramCalculationError = null;
            return;
        }
        this.ramUsage = null;
        this.ramCalculationError = ramCalc.errorMessage ?? null;
    }
    /** Remove script from server. Fails if the provided server isn't the server for this script. */
    deleteFromServer(server) {
        if (this.server !== server.hostname || server.isRunning(this.filename))
            return false;
        this.invalidateModule();
        server.scripts.delete(this.filename);
        return true;
    }
    // Serialize the current object to a JSON save state
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("Script", this, Script.savedKeys);
    }
    // Initializes a Script Object from a JSON save state
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(Script, value.data, Script.savedKeys);
    }
}
exports.Script = Script;
/** The keys that are relevant in a save file */
Script.savedKeys = ["code", "filename", "server", "metadata"];
JSONReviver_1.constructorsForReviver.Script = Script;
