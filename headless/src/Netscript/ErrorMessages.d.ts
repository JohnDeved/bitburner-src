import type { WorkerScript } from "./WorkerScript";
import type { NetscriptContext } from "./APIWrapper";
/** Log a message to a script's logs */
export declare function log(ctx: NetscriptContext, message: () => string): void;
/** Error messages may contain blob URLs (). This function replaces those URLs with the script names. */
export declare function parseBlobUrlInMessage(ws: WorkerScript, msg: string): string;
/** Creates an error message string containing hostname, scriptname, and the error message msg */
export declare function basicErrorMessage(ws: WorkerScript, msg: string, type?: string): string;
/**
 * Creates an error message string with a stack trace.
 *
 * When the player provides invalid input, we try to provide a stack trace that points to the player's invalid caller,
 * but we don't have an error instance with a stack trace. In order to get that stack trace, we create a new error
 * instance, then remove "unrelated" traces (code in our codebase) and leave only traces of the player's code.
 */
export declare function errorMessage(ctx: NetscriptContext, msg: string, type?: string): string;
