"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RamCalculationErrorCode = void 0;
// No need for an enum helper
var RamCalculationErrorCode;
(function (RamCalculationErrorCode) {
    RamCalculationErrorCode[RamCalculationErrorCode["SyntaxError"] = -1] = "SyntaxError";
    RamCalculationErrorCode[RamCalculationErrorCode["ImportError"] = -2] = "ImportError";
    RamCalculationErrorCode[RamCalculationErrorCode["InvalidServer"] = -3] = "InvalidServer";
})(RamCalculationErrorCode || (exports.RamCalculationErrorCode = RamCalculationErrorCode = {}));
