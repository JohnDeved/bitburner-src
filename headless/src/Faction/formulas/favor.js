"use strict";
// The initial formulas was sum 0 to f of 500*1.02^f.
// see https://en.wikipedia.org/wiki/Geometric_series#Closed-form_formula
// for information on how to calculate this
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxFavor = void 0;
exports.favorToRep = favorToRep;
exports.repToFavor = repToFavor;
exports.addRepToFavor = addRepToFavor;
const clampNumber_1 = require("../../utils/helpers/clampNumber");
exports.MaxFavor = 35331;
// This is the nearest representable value of log(1.02), which is the base of our power.
// It is *not* the same as Math.log(1.02), since "1.02" lacks sufficient precision.
const log1point02 = 0.019802627296179712;
function favorToRep(f) {
    // expm1 is e^x - 1, which is more accurate for small x than doing it the obvious way.
    return (0, clampNumber_1.clampNumber)(25000 * Math.expm1(log1point02 * f), 0);
}
function repToFavor(r) {
    // log1p is log(x + 1), which is more accurate for small x than doing it the obvious way.
    return (0, clampNumber_1.clampNumber)(Math.log1p(r / 25000) / log1point02, 0, exports.MaxFavor);
}
function addRepToFavor(favor, playerReputation) {
    return repToFavor(favorToRep(favor) + playerReputation);
}
