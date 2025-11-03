import { ObjectValidator } from "./Validator";
type JsonableClass = (new () => {
    toJSON: () => IReviverValue;
}) & {
    fromJSON: (value: IReviverValue) => unknown;
    validationData?: ObjectValidator<any>;
};
export interface IReviverValue<T = unknown> {
    ctor: string;
    data: T;
}
export declare function isReviverValue(value: unknown): value is IReviverValue;
export declare const constructorsForReviver: Partial<Record<string, JsonableClass>>;
/**
 * A generic "toJSON" function that creates the data expected by Reviver.
 *
 * @param ctorName String name of the constructor, part of the reviver JSON.
 * @param obj      The object to convert to stringified data in the reviver JSON.
 * @param keys     If provided, only these keys will be saved to the reviver JSON data. */
export declare function Generic_toJSON<T extends Record<string, any>>(ctorName: string, obj: T, keys?: readonly (keyof T)[]): IReviverValue;
/**
 * A generic "fromJSON" function for use with Reviver: Just calls the
 * constructor function with no arguments, then applies all of the
 * key/value pairs from the raw data to the instance. Only useful for
 * constructors that can be reasonably called without arguments!
 *
 * @param ctor The constructor to call
 * @param data The saved data to restore to the constructed object
 * @param keys If provided, only these keys will be restored from data.
 * @returns    The object */
export declare function Generic_fromJSON<T extends Record<string, any>>(ctor: new () => T, data: unknown, keys?: readonly (keyof T)[]): T;
export {};
