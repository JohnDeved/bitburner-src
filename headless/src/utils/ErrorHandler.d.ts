import type { WorkerScript } from "../Netscript/WorkerScript";
/** Generate an error dialog when workerscript is known */
export declare function handleUnknownError(e: unknown, ws?: WorkerScript | null, initialText?: string): void;
/** Use this handler to handle the error when we call getSaveData function or getSaveInfo function */
export declare function handleGetSaveDataInfoError(error: unknown, fromGetSaveInfo?: boolean): void;
