import { WorkerScript } from "./WorkerScript";
export declare function killWorkerScript(ws: WorkerScript): boolean;
export declare function killWorkerScriptByPid(pid: number, killer?: WorkerScript): boolean;
export declare const killAllScripts: () => void;
