"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
/**
 * The environment in which a script runs. The environment holds
 * Netscript functions and arguments for that script.
 */
class Environment {
    constructor() {
        /** Whether or not the script that uses this Environment is stopped */
        this.stopFlag = false;
        /** The currently running function */
        this.runningFn = "";
        /** Environment variables (currently only Netscript functions) */
        this.vars = null;
    }
}
exports.Environment = Environment;
