"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetscriptFormat = NetscriptFormat;
const NetscriptHelpers_1 = require("../Netscript/NetscriptHelpers");
const formatNumber_1 = require("../ui/formatNumber");
const StringHelperFunctions_1 = require("../utils/StringHelperFunctions");
function NetscriptFormat() {
    return {
        number: (ctx) => (_n, _fractionalDigits = 3, _suffixStart = 1000, isInteger) => {
            const n = NetscriptHelpers_1.helpers.number(ctx, "n", _n);
            const fractionalDigits = NetscriptHelpers_1.helpers.number(ctx, "fractionalDigits", _fractionalDigits);
            const suffixStart = NetscriptHelpers_1.helpers.number(ctx, "suffixStart", _suffixStart);
            return (0, formatNumber_1.formatNumber)(n, fractionalDigits, suffixStart, !!isInteger);
        },
        ram: (ctx) => (_n, _fractionalDigits = 2) => {
            const n = NetscriptHelpers_1.helpers.number(ctx, "n", _n);
            const fractionalDigits = NetscriptHelpers_1.helpers.number(ctx, "fractionalDigits", _fractionalDigits);
            return (0, formatNumber_1.formatRam)(n, fractionalDigits);
        },
        percent: (ctx) => (_n, _fractionalDigits = 2, _multStart = 1e6) => {
            const n = NetscriptHelpers_1.helpers.number(ctx, "n", _n);
            const fractionalDigits = NetscriptHelpers_1.helpers.number(ctx, "fractionalDigits", _fractionalDigits);
            const multStart = NetscriptHelpers_1.helpers.number(ctx, "multStart", _multStart);
            return (0, formatNumber_1.formatPercent)(n, fractionalDigits, multStart);
        },
        time: (ctx) => (_milliseconds, _milliPrecision) => {
            const milliseconds = NetscriptHelpers_1.helpers.number(ctx, "milliseconds", _milliseconds);
            const milliPrecision = !!_milliPrecision;
            return (0, StringHelperFunctions_1.convertTimeMsToTimeElapsedString)(milliseconds, milliPrecision);
        },
    };
}
