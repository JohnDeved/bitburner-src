"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructorsForReviver = void 0;
exports.isReviverValue = isReviverValue;
exports.Generic_toJSON = Generic_toJSON;
exports.Generic_fromJSON = Generic_fromJSON;
const Jsonable_1 = require("../Types/Jsonable");
const TypeAssertion_1 = require("./TypeAssertion");
function isReviverValue(value) {
    return (typeof value === "object" && value !== null && "ctor" in value && typeof value.ctor === "string" && "data" in value);
}
exports.constructorsForReviver = { JSONSet: Jsonable_1.JSONSet, JSONMap: Jsonable_1.JSONMap };
/**
 * A generic "toJSON" function that creates the data expected by Reviver.
 *
 * @param ctorName String name of the constructor, part of the reviver JSON.
 * @param obj      The object to convert to stringified data in the reviver JSON.
 * @param keys     If provided, only these keys will be saved to the reviver JSON data. */
function Generic_toJSON(ctorName, obj, keys) {
    const data = {};
    // keys provided: only save data for the provided keys
    if (keys) {
        for (const key of keys)
            data[key] = obj[key];
        return { ctor: ctorName, data: data };
    }
    // no keys provided: save all own keys of the object
    for (const [key, val] of Object.entries(obj))
        data[key] = val;
    return { ctor: ctorName, data: data };
}
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
function Generic_fromJSON(ctor, data, keys) {
    (0, TypeAssertion_1.assertObject)(data);
    const obj = new ctor();
    // If keys were provided, just load the provided keys (if they are in the data)
    if (keys) {
        for (const key of keys) {
            // This cast is safe (T has string keys), but still needed because "keyof T" cannot be used to index data.
            const val = data[key];
            if (val !== undefined) {
                // This is an unsafe assignment. We may load data with wrong types at runtime.
                obj[key] = val;
            }
        }
        return obj;
    }
    // No keys provided: load every key in data
    for (const [key, val] of Object.entries(data)) {
        // This is an unsafe assignment. We may load data with wrong types at runtime.
        obj[key] = val;
    }
    return obj;
}
