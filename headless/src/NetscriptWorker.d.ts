import { WorkerScript } from "./Netscript/WorkerScript";
import { Port, PortNumber } from "./NetscriptPort";
import { RunningScript } from "./Script/RunningScript";
import { BaseServer } from "./Server/BaseServer";
import { ScriptArg } from "@nsdefs";
import { CompleteRunOptions } from "./Netscript/NetscriptHelpers";
import { ScriptFilePath } from "./Paths/ScriptFilePath";
import { Result } from "./types";
export declare const NetscriptPorts: Map<PortNumber, Port>;
export declare function prestigeWorkerScripts(): void;
/**
 * Used to start a RunningScript (by creating and starting its
 * corresponding WorkerScript), and add the RunningScript to the server on which
 * it is active
 */
export declare function startWorkerScript(runningScript: RunningScript, server: BaseServer, parent?: WorkerScript): number;
/** Updates the online running time stat of all running scripts */
export declare function updateOnlineScriptTimes(numCycles?: number): void;
/**
 * Called when the game is loaded. Loads all running scripts (from all servers)
 * into worker scripts so that they will start running
 */
export declare function loadAllRunningScripts(): void;
export declare function createRunningScriptInstance(server: BaseServer, scriptPath: ScriptFilePath, runOpts: CompleteRunOptions, args: ScriptArg[]): Result<{
    runningScript: RunningScript;
}>;
/** Run a script from inside another script (run(), exec(), spawn(), etc.) */
export declare function runScriptFromScript(caller: string, server: BaseServer, scriptPath: ScriptFilePath, args: ScriptArg[], workerScript: WorkerScript, runOpts: CompleteRunOptions): number;
