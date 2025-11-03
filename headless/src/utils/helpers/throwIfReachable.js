"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwIfReachable = throwIfReachable;
function throwIfReachable(missingCase) {
    throw new Error(`The case of ${missingCase} was not handled.`);
}
