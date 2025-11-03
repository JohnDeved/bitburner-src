"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObject = validateObject;
exports.minMax = minMax;
exports.oneOf = oneOf;
exports.subsetOf = subsetOf;
function validateObject(obj, validator) {
    for (const key of Object.keys(validator)) {
        const paramValidator = validator[key];
        if (paramValidator !== undefined) {
            if (typeof paramValidator === "function") {
                paramValidator(obj, key);
            }
            else if (paramValidator.func !== undefined) {
                paramValidator.func(obj, validator, key);
            }
            else {
                const objVal = obj[key];
                if (typeof objVal !== typeof paramValidator.default) {
                    obj[key] = paramValidator.default;
                }
                if (typeof objVal === "number" && paramValidator.min !== undefined && objVal < paramValidator.min) {
                    obj[key] = paramValidator.min;
                }
                if (typeof objVal === "number" && paramValidator.max !== undefined && objVal > paramValidator.max) {
                    obj[key] = paramValidator.max;
                }
            }
        }
    }
}
function minMax(def, min, max) {
    return (obj, key) => {
        if (typeof obj[key] !== "number") {
            obj[key] = def;
            return;
        }
        if (obj[key] < min) {
            obj[key] = min;
        }
        if (obj[key] > max) {
            obj[key] = max;
        }
    };
}
function oneOf(def, options) {
    return (obj, key) => {
        if (typeof obj[key] !== typeof def) {
            obj[key] = def;
            return;
        }
        if (!options.includes(obj[key])) {
            obj[key] = def;
        }
    };
}
function subsetOf(options) {
    return (obj, key) => {
        if (typeof obj[key] !== "object" || !Array.isArray(obj[key])) {
            obj[key] = [];
            return;
        }
        const validValues = [];
        for (const value of obj[key]) {
            if (options.includes(value))
                validValues.push(value);
        }
        obj[key] = validValues;
    };
}
