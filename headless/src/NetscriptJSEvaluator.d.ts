import { type ScriptURL, type ScriptModule } from "./Script/LoadedModule";
import type { Script } from "./Script/Script";
import type { ScriptFilePath } from "./Paths/ScriptFilePath";
export declare const config: {
    doImport(url: ScriptURL): Promise<ScriptModule>;
};
export declare function compile(script: Script, scripts: Map<ScriptFilePath, Script>): Promise<ScriptModule>;
