"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextCompanyPositionHelper = getNextCompanyPositionHelper;
const CompanyPositions_1 = require("./CompanyPositions");
function getNextCompanyPositionHelper(currPos) {
    if (!currPos)
        return null;
    const nextPosName = currPos.nextPosition;
    if (!nextPosName)
        return null;
    return CompanyPositions_1.CompanyPositions[nextPosName];
}
