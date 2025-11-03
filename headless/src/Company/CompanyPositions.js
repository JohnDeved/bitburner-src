"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyPositions = void 0;
const _enums_1 = require("@enums");
const CompanyPositionsMetadata_1 = require("./data/CompanyPositionsMetadata");
const CompanyPosition_1 = require("./CompanyPosition");
const Record_1 = require("../Types/Record");
exports.CompanyPositions = (() => {
    const metadata = (0, CompanyPositionsMetadata_1.getCompanyPositionMetadata)();
    return (0, Record_1.createEnumKeyedRecord)(_enums_1.JobName, (name) => new CompanyPosition_1.CompanyPosition(name, metadata[name]));
})();
