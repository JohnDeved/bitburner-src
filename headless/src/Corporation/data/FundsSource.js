"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongTermFundsSources = void 0;
// Funds transactions which affect valuation directly and should not be included in earnings projections.
// This includes capital expenditures (which may be recoupable), time-limited actions, and transfers to/from other game mechanics.
const FundsSourceLongTerm = [
    "product development",
    "office",
    "warehouse",
    "upgrades",
    "bribery",
    "public equity",
    "private equity",
    "hacknet",
    "force majeure",
];
exports.LongTermFundsSources = new Set(FundsSourceLongTerm);
