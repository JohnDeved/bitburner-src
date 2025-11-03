import type { ScriptArg } from "@nsdefs";
import type { ScriptFilePath } from "../../Paths/ScriptFilePath";
export type ScriptKey = string & {
    __type: "ScriptKey";
};
export declare function scriptKey(path: ScriptFilePath, args: ScriptArg[]): ScriptKey;
export declare function matchScriptPathExact(pattern: string): RegExp;
export declare function matchScriptPathUnanchored(pattern: string): RegExp;
