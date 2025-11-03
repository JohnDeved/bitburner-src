/**
 * The worker agent for running a script instance. Each running script instance
 * has its own underlying WorkerScript object.
 *
 * Note that these objects are not saved and re-loaded when the game is refreshed.
 * Instead, whenever the game is opened, WorkerScripts are re-created from
 * RunningScript objects
 */
import type React from "react";
import type { BaseServer } from "../Server/BaseServer";
import type { NSFull } from "../NetscriptFunctions";
import type { ScriptFilePath } from "../Paths/ScriptFilePath";
import type { RunningScript } from "../Script/RunningScript";
import type { Script } from "../Script/Script";
import type { ScriptArg } from "@nsdefs";
import type { ScriptDeath } from "./ScriptDeath";
import { Environment } from "./Environment";
export declare class WorkerScript {
    /** Script's arguments */
    args: ScriptArg[];
    /** Copy of the script's code */
    code: string;
    /**
     * Holds the timeoutID (numeric value) for whenever this script is blocked by a
     * timed Netscript function. i.e. Holds the return value of setTimeout()
     */
    delay: number | null;
    /** Holds the Promise reject() function while the script is "blocked" by an async op */
    delayReject: ((reason?: ScriptDeath) => void) | undefined;
    /** Stores names of all functions that have logging disabled */
    disableLogs: Record<string, boolean>;
    /**
     * Used for dynamic RAM calculation. Stores names of all functions that have
     * already been checked by this script.
     * TODO: Could probably just combine this with loadedFns?
     */
    dynamicLoadedFns: Record<string, boolean>;
    /** Tracks dynamic RAM usage */
    dynamicRamUsage: number;
    /** Netscript Environment for this script */
    env: Environment;
    /**
     * Used for static RAM calculation. Stores names of all functions that have
     * already been checked by this script
     */
    loadedFns: Record<string, boolean>;
    /** Filename of script */
    name: ScriptFilePath;
    /** Script's output/return value. Currently not used or implemented */
    output: string;
    /**
     * Process ID. Must be an integer. Used for efficient script
     * killing and removal.
     */
    pid: number;
    /** Reference to underlying RunningScript object */
    scriptRef: RunningScript;
    /** hostname on which this script is running */
    hostname: string;
    /**Map of functions called when the script ends. */
    atExit: Map<string, () => void>;
    constructor(runningScriptObj: RunningScript, pid: number, nsFuncsGenerator?: (ws: WorkerScript) => NSFull);
    /** Returns the Server on which this script is running */
    getServer(): BaseServer;
    /**
     * Returns the Script object for the underlying script.
     * Returns null if it cannot be found (which would be a bug)
     */
    getScript(): Script | null;
    shouldLog(fn: string): boolean;
    log(func: string, txt: () => string): void;
    print(txt: React.ReactNode): void;
}
