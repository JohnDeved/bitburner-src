import type { Unknownify } from "../types";
export declare function assertLoadingType<T extends object>(val: object): asserts val is Unknownify<T>;
export declare class TypeAssertionError extends Error {
    friendlyType: string;
    constructor(message: string, friendlyType: string, options?: ErrorOptions);
}
/** Function for providing custom error message to throw for a type assertion.
 * @param v: Value to assert type of
 * @param assertFn: Typechecking function to use for asserting type of v.
 * @param msgFn: Function to use to generate an error message if an error is produced. */
export declare function assert<T>(v: unknown, assertFn: (v: unknown) => asserts v is T, msgFn: (type: string) => string): asserts v is T;
export declare function isObject(v: unknown): v is Record<string, unknown>;
/** For non-objects, and for array/null, throws an error with the friendlyType of v. */
export declare function assertObject(v: unknown): asserts v is Record<string, unknown>;
/** For non-string, throws an error with the friendlyType of v. */
export declare function assertString(v: unknown): asserts v is string;
/** For non-array, throws an error with the friendlyType of v. */
export declare function assertArray(v: unknown): asserts v is unknown[];
export declare function assertNumberArray(unknownData: unknown, assertFinite?: boolean): asserts unknownData is number[];
