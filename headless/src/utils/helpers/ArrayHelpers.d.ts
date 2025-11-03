import { Truthy } from "lodash";
/**
 * Returns the input array as a comma separated string.
 *
 * Does several things that Array.toString() doesn't do
 *  - Adds brackets around the array
 *  - Adds quotation marks around strings
 */
export declare function arrayToString(a: unknown[]): string;
export declare function filterTruthy<T>(input: T[]): Truthy<T>[];
