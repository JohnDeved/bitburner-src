import { BaseServer } from "../Server/BaseServer";
import { RunningScript } from "./RunningScript";
import type { ScriptFilePath } from "../Paths/ScriptFilePath";
export declare function scriptCalculateOfflineProduction(runningScript: RunningScript, playerLastUpdate: number, playerPlaytimeSinceLastAug: number): void;
export declare function findRunningScripts(path: ScriptFilePath, args: (string | number | boolean)[], server: BaseServer): Map<number, RunningScript> | null;
export declare function findRunningScriptByPid(pid: number): RunningScript | null;
