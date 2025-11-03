"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Companies = void 0;
exports.loadCompanies = loadCompanies;
exports.getCompaniesSave = getCompaniesSave;
// Constructs all CompanyPosition objects using the metadata in data/companypositions.ts
const CompaniesMetadata_1 = require("./data/CompaniesMetadata");
const Company_1 = require("./Company");
const GenericReviver_1 = require("../utils/GenericReviver");
const TypeAssertion_1 = require("../utils/TypeAssertion");
const Enums_1 = require("./Enums");
const Record_1 = require("../Types/Record");
const EnumHelper_1 = require("../utils/EnumHelper");
const clampNumber_1 = require("../utils/helpers/clampNumber");
exports.Companies = (() => {
    const metadata = (0, CompaniesMetadata_1.getCompaniesMetadata)();
    return (0, Record_1.createEnumKeyedRecord)(Enums_1.CompanyName, (name) => new Company_1.Company(metadata[name]));
})();
// Used to load Companies map from a save
function loadCompanies(saveString) {
    const loadedCompanies = JSON.parse(saveString, GenericReviver_1.Reviver);
    // This loading method allows invalid data in player save, but just ignores anything invalid
    if (!loadedCompanies)
        return;
    if (typeof loadedCompanies !== "object")
        return;
    for (const [loadedCompanyName, loadedCompany] of Object.entries(loadedCompanies)) {
        if (!(0, EnumHelper_1.getEnumHelper)("CompanyName").isMember(loadedCompanyName))
            continue;
        if (!loadedCompany)
            continue;
        if (typeof loadedCompany !== "object")
            continue;
        const company = exports.Companies[loadedCompanyName];
        (0, TypeAssertion_1.assertLoadingType)(loadedCompany);
        const { playerReputation: loadedRep, favor: loadedFavor } = loadedCompany;
        if (typeof loadedRep === "number" && loadedRep >= 0) {
            // `playerReputation` must be in [0, Number.MAX_VALUE].
            company.playerReputation = (0, clampNumber_1.clampNumber)(loadedRep, 0);
        }
        if (typeof loadedFavor === "number" && loadedFavor >= 0) {
            // `favor` must be in [0, MaxFavor]. This rule will be enforced in the `setFavor` function.
            company.setFavor(loadedFavor);
        }
    }
}
// Most companies are usually at default values, so we'll only save the companies with non-default data
function getCompaniesSave() {
    const save = {};
    for (const companyName of (0, EnumHelper_1.getEnumHelper)("CompanyName").valueArray) {
        const { favor, playerReputation } = exports.Companies[companyName];
        if (favor || playerReputation) {
            save[companyName] = { favor: favor || undefined, playerReputation: playerReputation || undefined };
        }
    }
    return save;
}
