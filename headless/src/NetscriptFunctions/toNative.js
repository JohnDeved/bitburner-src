"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNative = toNative;
const JSInterpreter_1 = require("../ThirdParty/JSInterpreter");
const defaultInterpreter = new JSInterpreter_1.Interpreter("", () => undefined);
const isPseudoObject = (v) => !!v &&
    typeof v === "object" &&
    Object.hasOwn(v, "properties") &&
    Object.hasOwn(v, "getter") &&
    Object.hasOwn(v, "setter") &&
    Object.hasOwn(v, "proto");
// the acorn interpreter has a bug where it doesn't convert arrays correctly.
// so we have to more or less copy it here.
function toNative(pseudoObj) {
    if (pseudoObj == null)
        return null;
    if (!isPseudoObject(pseudoObj)) {
        return pseudoObj; // it wasn't a pseudo object anyway.
    }
    if (Object.hasOwn(pseudoObj, "class") && pseudoObj.class === "Array") {
        const arr = [];
        const length = defaultInterpreter.getProperty(pseudoObj, "length");
        if (typeof length === "number") {
            for (let i = 0; i < length; i++) {
                if (defaultInterpreter.hasProperty(pseudoObj, i)) {
                    arr[i] = toNative(defaultInterpreter.getProperty(pseudoObj, i));
                }
            }
        }
        return arr;
    }
    else {
        // Object.
        const obj = {};
        for (const key of Object.keys(pseudoObj.properties)) {
            const val = pseudoObj.properties[key];
            obj[key] = toNative(val);
        }
        return obj;
    }
}
