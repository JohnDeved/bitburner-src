/**
 * A generic "smart reviver" function.
 * Looks for object values with a `ctor` property and a `data` property.
 * If it finds them, and finds a matching constructor, it hands
 * off to that `fromJSON` function, passing in the value. */
export declare function Reviver(_key: string, value: unknown): any;
