/**
 * Class representing a Script instance that is actively running.
 * A Script can have multiple active instances
 */
import type React from "react";
import { Script } from "./Script";
import { ScriptURL } from "./LoadedModule";
import { IReviverValue } from "../utils/JSONReviver";
import { ScriptArg } from "@nsdefs";
import { PositiveInteger } from "../types";
import { ScriptFilePath } from "../Paths/ScriptFilePath";
import { ScriptKey } from "../utils/helpers/scriptKey";
import type { LogBoxProperties } from "../ui/React/LogBoxManager";
export declare class RunningScript {
    args: ScriptArg[];
    dataMap: Record<string, number[]>;
    filename: ScriptFilePath;
    logs: React.ReactNode[];
    logUpd: boolean;
    offlineExpGained: number;
    offlineMoneyMade: number;
    offlineRunningTime: number;
    onlineExpGained: number;
    onlineMoneyMade: number;
    onlineRunningTime: number;
    pid: number;
    parent: number;
    ramUsage: number;
    server: string;
    scriptKey: ScriptKey;
    tailProps: LogBoxProperties | null;
    title: string | React.ReactElement;
    threads: PositiveInteger;
    temporary: boolean;
    dependencies: Map<ScriptURL, Script>;
    constructor(script?: Script, ramUsage?: number, args?: ScriptArg[]);
    log(txt: React.ReactNode): void;
    displayLog(): void;
    clearLog(): void;
    recordHack(hostname: string, moneyGained: number, n?: number): void;
    recordGrow(hostname: string, n?: number): void;
    recordWeaken(hostname: string, n?: number): void;
    toJSON(): IReviverValue;
    static fromJSON(value: IReviverValue): RunningScript;
}
