import type { RunningScript } from "../Script/RunningScript";
import type { WorkerScript } from "./WorkerScript";
export declare const recentScripts: RecentScript[];
export declare function AddRecentScript(workerScript: WorkerScript): void;
export interface RecentScript {
    id: number;
    timeOfDeath: Date;
    runningScript: RunningScript;
}
