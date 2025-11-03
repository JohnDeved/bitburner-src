import type { ScriptArg } from "@nsdefs";
import { NetscriptContext } from "../Netscript/APIWrapper";
export type Schema = [string, string | number | boolean | string[]][];
type FlagsRet = Record<string, ScriptArg | string[]>;
export declare function Flags(ctx: NetscriptContext | string[]): (data: unknown) => FlagsRet;
export {};
