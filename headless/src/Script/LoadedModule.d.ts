import type { NSFull } from "../NetscriptFunctions";
import type { AutocompleteData, ScriptArg } from "@nsdefs";
export type ScriptURL = string & {
    __type: "ScriptURL";
};
export interface ScriptModule {
    main?: (ns: NSFull, ...args: ScriptArg[]) => unknown;
    autocomplete?: (data: AutocompleteData, flags: string[]) => unknown;
}
export declare class LoadedModule {
    url: ScriptURL;
    module: Promise<ScriptModule>;
    constructor(url: ScriptURL, module: Promise<ScriptModule>);
}
