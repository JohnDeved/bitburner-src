import { RamCalculationErrorCode } from "./RamCalculationErrorCodes";
import type { Script } from "./Script";
import type { ScriptFilePath } from "../Paths/ScriptFilePath";
import type { ServerName } from "../Types/strings";
import { type AST } from "../utils/ScriptTransformer";
export interface RamUsageEntry {
    type: "ns" | "dom" | "fn" | "misc";
    name: string;
    cost: number;
}
export type RamCalculationSuccess = {
    cost: number;
    entries: RamUsageEntry[];
    errorCode?: never;
    errorMessage?: never;
};
export type RamCalculationFailure = {
    cost?: never;
    entries?: never;
    errorCode: RamCalculationErrorCode;
    errorMessage?: string;
};
export type RamCalculation = RamCalculationSuccess | RamCalculationFailure;
export declare function checkInfiniteLoop(ast: AST, code: string): number[];
/**
 * Calculate RAM usage of a script
 *
 * @param input - Code's AST or code of the script
 * @param scriptName - The script's name. Used to resolve relative paths
 * @param server - Servername of the scripts for Error Message
 * @param otherScripts - Other scripts on the server
 * @returns
 */
export declare function calculateRamUsage(input: AST | string, scriptName: ScriptFilePath, server: ServerName, otherScripts: Map<ScriptFilePath, Script>): RamCalculation;
