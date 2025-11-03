import type { BaseServer } from "../Server/BaseServer";
import { type RamUsageEntry } from "./RamCalculations";
import type { LoadedModule, ScriptURL } from "./LoadedModule";
import { type IReviverValue } from "../utils/JSONReviver";
import type { ScriptFilePath } from "../Paths/ScriptFilePath";
import { ContentFile } from "../Paths/ContentFile";
/** A script file as a file on a server.
 * For the execution of a script, see RunningScript and WorkerScript */
export declare class Script extends ContentFile {
    code: string;
    filename: ScriptFilePath;
    server: string;
    ramUsage: number | null;
    ramUsageEntries: RamUsageEntry[];
    ramCalculationError: string | null;
    mod: LoadedModule | null;
    /** Scripts that directly import this one. Stored so we can invalidate these dependent scripts when this one is invalidated. */
    dependents: Set<Script>;
    /**
     * Scripts that we directly or indirectly import, including ourselves.
     * Stored only so RunningScript can use it, to translate urls in error messages.
     * Because RunningScript uses the reference directly (to reduce object copies), it must be immutable.
     */
    dependencies: Map<ScriptURL, Script>;
    get content(): string;
    set content(newCode: string);
    constructor(filename?: ScriptFilePath, code?: string, server?: string);
    /** Invalidates the current script module and related data, e.g. when modifying the file. */
    invalidateModule(): void;
    /** Gets the ram usage, while also attempting to update it if it's currently null */
    getRamUsage(otherScripts: Map<ScriptFilePath, Script>): number | null;
    /**
     * Calculates and updates the script's RAM usage based on its code
     * @param {Script[]} otherScripts - Other scripts on the server. Used to process imports
     */
    updateRamUsage(otherScripts: Map<ScriptFilePath, Script>): void;
    /** Remove script from server. Fails if the provided server isn't the server for this script. */
    deleteFromServer(server: BaseServer): boolean;
    /** The keys that are relevant in a save file */
    static savedKeys: readonly ["code", "filename", "server", "metadata"];
    toJSON(): IReviverValue;
    static fromJSON(value: IReviverValue): Script;
}
