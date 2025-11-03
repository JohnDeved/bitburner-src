import type { WorkerScript } from "./WorkerScript";
/** Permissive type for the documented API functions */
type APIFn = (...args: any[]) => unknown;
/** Type for internal, unwrapped ctx function that produces an APIFunction */
type InternalFn<F extends APIFn> = (ctx: NetscriptContext) => ((...args: unknown[]) => ReturnType<F>) & F;
/** Type constraint for an API layer. They must all fit this "shape". */
type GenericAPI<T> = {
    [key in keyof T]: APIFn | GenericAPI<T[key]>;
};
export type InternalAPI<API> = {
    [key in keyof API]: API[key] extends APIFn ? InternalFn<API[key]> : InternalAPI<API[key]>;
};
export interface NetscriptContext {
    workerScript: WorkerScript;
    function: string;
    functionPath: string;
}
export declare function NSProxy<API extends GenericAPI<API>>(ws: WorkerScript, ns: InternalAPI<API>, tree: string[], additionalData?: Record<string, unknown>): API;
/** Specify when a function was removed from the game, and its replacement function. */
interface RemovedFunctionInfo {
    /** The version in which the function was removed */
    version: string;
    /** The replacement function to use, or the entire replacement message if replaceMsg is true. */
    replacement: string;
    /** If set, replacement is treated as a full replacement message. */
    replaceMsg?: true;
}
export declare function setRemovedFunctions(api: object, infos: Record<string, RemovedFunctionInfo>): void;
export {};
