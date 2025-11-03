"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONMap = exports.JSONSet = void 0;
const TypeAssertion_1 = require("../utils/TypeAssertion");
// Versions of js builtin classes that can be converted to and from JSON for use in save files
class JSONSet extends Set {
    toJSON() {
        return { ctor: "JSONSet", data: Array.from(this) };
    }
    static fromJSON(value) {
        (0, TypeAssertion_1.assertArray)(value.data);
        return new JSONSet(value.data);
    }
}
exports.JSONSet = JSONSet;
class JSONMap extends Map {
    toJSON() {
        return { ctor: "JSONMap", data: Array.from(this) };
    }
    static fromJSON(value) {
        (0, TypeAssertion_1.assertArray)(value.data);
        for (const item of value.data) {
            (0, TypeAssertion_1.assertArray)(item);
            if (item.length !== 2) {
                console.error("Invalid data passed to JSONMap.fromJSON(). Value:", value);
                throw new Error(`An item is not an array with exactly 2 items. Its length is ${item.length}.`);
            }
        }
        // We validated the data above, so it's safe to typecast here.
        return new JSONMap(value.data);
    }
}
exports.JSONMap = JSONMap;
