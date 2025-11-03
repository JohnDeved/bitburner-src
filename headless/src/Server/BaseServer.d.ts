import type { Server as IServer } from "@nsdefs";
import type { CompletedProgramName, LiteratureName, MessageFilename } from "@enums";
import type { IPAddress, ServerName } from "../Types/strings";
import type { FilePath } from "../Paths/FilePath";
import { CodingContract } from "../CodingContract/Contract";
import { RunningScript } from "../Script/RunningScript";
import { Script } from "../Script/Script";
import { TextFile } from "../TextFile";
import { IReturnStatus } from "../types";
import { ScriptFilePath } from "../Paths/ScriptFilePath";
import { TextFilePath } from "../Paths/TextFilePath";
import { IReviverValue } from "../utils/JSONReviver";
import { JSONMap } from "../Types/Jsonable";
import { ContentFile, ContentFilePath } from "../Paths/ContentFile";
import { ProgramFilePath } from "../Paths/ProgramFilePath";
import type { ScriptKey } from "../utils/helpers/scriptKey";
interface IConstructorParams {
    adminRights?: boolean;
    hostname: string;
    ip?: IPAddress;
    isConnectedTo?: boolean;
    maxRam?: number;
    organizationName?: string;
}
interface writeResult {
    overwritten: boolean;
}
/** Abstract Base Class for any Server object */
export declare abstract class BaseServer implements IServer {
    contracts: CodingContract[];
    cpuCores: number;
    ftpPortOpen: boolean;
    hasAdminRights: boolean;
    hostname: ServerName;
    httpPortOpen: boolean;
    ip: IPAddress;
    isConnectedTo: boolean;
    maxRam: number;
    messages: (MessageFilename | LiteratureName)[];
    organizationName: string;
    programs: (ProgramFilePath | CompletedProgramName)[];
    ramUsed: number;
    runningScriptMap: Map<ScriptKey, Map<number, RunningScript>>;
    savedScripts: RunningScript[] | undefined;
    scripts: JSONMap<ScriptFilePath, Script>;
    serversOnNetwork: string[];
    smtpPortOpen: boolean;
    sqlPortOpen: boolean;
    sshPortOpen: boolean;
    textFiles: JSONMap<TextFilePath, TextFile>;
    purchasedByPlayer: boolean;
    backdoorInstalled?: boolean;
    baseDifficulty?: number;
    hackDifficulty?: number;
    minDifficulty?: number;
    moneyAvailable?: number;
    moneyMax?: number;
    numOpenPortsRequired?: number;
    openPortCount?: number;
    requiredHackingSkill?: number;
    serverGrowth?: number;
    isHacknetServer?: boolean;
    constructor(params?: IConstructorParams);
    addContract(contract: CodingContract): void;
    getContract(contractName: string): CodingContract | null;
    /** Get a TextFile or Script depending on the input path type. */
    getContentFile(path: ContentFilePath): ContentFile | null;
    /** Returns boolean indicating whether the given script is running on this server */
    isRunning(path: ScriptFilePath): boolean;
    removeContract(contract: CodingContract | string): void;
    /**
     * Remove a file from the server
     * @param path Name of file to be deleted
     * @returns {IReturnStatus} Return status object indicating whether or not file was deleted
     */
    removeFile(path: FilePath): IReturnStatus;
    /**
     * Called when a script is run on this server.
     * All this function does is add a RunningScript object to the
     * `runningScripts` array. It does NOT check whether the script actually can
     * be run.
     */
    runScript(script: RunningScript): void;
    setMaxRam(ram: number): void;
    updateRamUsed(ram: number): void;
    pushProgram(program: ProgramFilePath | CompletedProgramName): void;
    /**
     * Write to a script file
     * Overwrites existing files. Creates new files if the script does not exist.
     */
    writeToScriptFile(filename: ScriptFilePath, code: string): writeResult;
    writeToTextFile(textPath: TextFilePath, txt: string): writeResult;
    /** Write to a Script or TextFile */
    writeToContentFile(path: ContentFilePath, content: string): writeResult;
    toJSONBase(ctorName: string, keys: readonly (keyof this)[]): IReviverValue;
    static fromJSONBase<T extends BaseServer>(value: IReviverValue, ctor: new () => T, keys: readonly (keyof T)[]): T;
    static getIncludedKeys<T extends BaseServer>(ctor: new () => T): readonly (keyof T)[];
}
export {};
