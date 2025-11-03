import type { NetscriptContext } from "./APIWrapper";
export declare const debugType: (v: unknown) => string;
/**
 * This function should be used to assert strings provided by the player. It uses a specialized utility function that
 * provides a stack trace pointing to the player's invalid caller.
 */
export declare function assertStringWithNSContext(ctx: NetscriptContext, argName: string, v: unknown): asserts v is string;
export declare function assertFunctionWithNSContext(ctx: NetscriptContext, argName: string, v: unknown): asserts v is () => void;
