"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyNameAsLocationName = companyNameAsLocationName;
exports.calculateEffectiveRequiredReputation = calculateEffectiveRequiredReputation;
const Constants_1 = require("../Constants");
const ServerHelpers_1 = require("../Server/ServerHelpers");
const __companyNameCheck = true;
function companyNameAsLocationName(companyName) {
    // Due to the check above, we know that all company names are valid location names.
    return companyName;
}
function calculateEffectiveRequiredReputation(companyName, reputation) {
    return (reputation * ((0, ServerHelpers_1.isBackdoorInstalledInCompanyServer)(companyName) ? Constants_1.CONSTANTS.CompanyRequiredReputationMultiplier : 1));
}
