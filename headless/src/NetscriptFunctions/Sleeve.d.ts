import type { Sleeve as NetscriptSleeve } from "@nsdefs";
import { InternalAPI, NetscriptContext } from "../Netscript/APIWrapper";
export declare const checkSleeveAPIAccess: (ctx: NetscriptContext) => void;
export declare const checkSleeveNumber: (ctx: NetscriptContext, sleeveNumber: number) => void;
export declare function NetscriptSleeve(): InternalAPI<NetscriptSleeve>;
