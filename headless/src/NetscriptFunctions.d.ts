import { WorkerScript } from "./Netscript/WorkerScript";
import { NS, NSEnums } from "@nsdefs";
import { InternalAPI } from "./Netscript/APIWrapper";
import { INetscriptExtra } from "./NetscriptFunctions/Extra";
export declare const enums: NSEnums;
export type NSFull = Readonly<Omit<NS & INetscriptExtra, "pid" | "args" | "enums">>;
export declare const ns: InternalAPI<NSFull>;
export declare function NetscriptFunctions(ws: WorkerScript): NSFull;
