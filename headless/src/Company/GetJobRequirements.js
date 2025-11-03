"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobRequirements = getJobRequirements;
exports.getJobRequirementText = getJobRequirementText;
const FactionJoinCondition_1 = require("../Faction/FactionJoinCondition");
const Record_1 = require("../Types/Record");
function getJobRequirements(company, pos) {
    const reqSkills = pos.requiredSkills(company.jobStatReqOffset);
    const reqs = [];
    for (const [skillName, value] of (0, Record_1.getRecordEntries)(reqSkills)) {
        if (value > 0) {
            reqs.push((0, FactionJoinCondition_1.haveSkill)(skillName, value));
        }
    }
    if (pos.requiredReputation > 0) {
        reqs.push((0, FactionJoinCondition_1.haveCompanyRep)(company.name, pos.requiredReputation));
    }
    return reqs;
}
/** Returns a string with the given CompanyPosition's stat requirements */
function getJobRequirementText(company, pos) {
    const reqs = getJobRequirements(company, pos);
    return `(${pos.name} requires: ${reqs.map((s) => s.toString()).join(", ")})`;
}
