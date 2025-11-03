"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPositiveSafeInteger = exports.isPositiveNumber = exports.isPositiveInteger = exports.isSafeInteger = exports.isInteger = exports.isNumber = void 0;
// Numeric typechecking functions - these should be moved somewhere else
const isNumber = (n) => !Number.isNaN(Number(n));
exports.isNumber = isNumber;
const isInteger = (n) => Number.isInteger(n);
exports.isInteger = isInteger;
const isSafeInteger = (n) => Number.isSafeInteger(n);
exports.isSafeInteger = isSafeInteger;
const isPositiveInteger = (n) => (0, exports.isInteger)(n) && n > 0;
exports.isPositiveInteger = isPositiveInteger;
const isPositiveNumber = (n) => (0, exports.isNumber)(n) && n > 0;
exports.isPositiveNumber = isPositiveNumber;
const isPositiveSafeInteger = (n) => (0, exports.isSafeInteger)(n) && (0, exports.isPositiveInteger)(n);
exports.isPositiveSafeInteger = isPositiveSafeInteger;
