"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessConsultJobs = exports.softwareConsultJobs = exports.agentJobs = exports.securityJobs = exports.businessJobs = exports.netEngJobs = exports.itJobs = exports.softwareJobs = exports.JobTracks = void 0;
const _enums_1 = require("@enums");
exports.JobTracks = {
    [_enums_1.JobField.software]: [
        _enums_1.JobName.software0,
        _enums_1.JobName.software1,
        _enums_1.JobName.software2,
        _enums_1.JobName.software3,
        _enums_1.JobName.software4,
        _enums_1.JobName.software5,
        _enums_1.JobName.software6,
        _enums_1.JobName.software7,
    ],
    [_enums_1.JobField.softwareConsultant]: [_enums_1.JobName.softwareConsult0, _enums_1.JobName.softwareConsult1],
    [_enums_1.JobField.it]: [_enums_1.JobName.IT0, _enums_1.JobName.IT1, _enums_1.JobName.IT2, _enums_1.JobName.IT3],
    [_enums_1.JobField.securityEngineer]: [_enums_1.JobName.securityEng],
    [_enums_1.JobField.networkEngineer]: [_enums_1.JobName.networkEng0, _enums_1.JobName.networkEng1],
    [_enums_1.JobField.business]: [
        _enums_1.JobName.business0,
        _enums_1.JobName.business1,
        _enums_1.JobName.business2,
        _enums_1.JobName.business3,
        _enums_1.JobName.business4,
        _enums_1.JobName.business5,
    ],
    [_enums_1.JobField.businessConsultant]: [_enums_1.JobName.businessConsult0, _enums_1.JobName.businessConsult1],
    [_enums_1.JobField.security]: [_enums_1.JobName.security0, _enums_1.JobName.security1, _enums_1.JobName.security2, _enums_1.JobName.security3],
    [_enums_1.JobField.agent]: [_enums_1.JobName.agent0, _enums_1.JobName.agent1, _enums_1.JobName.agent2],
    [_enums_1.JobField.employee]: [_enums_1.JobName.employee],
    [_enums_1.JobField.partTimeEmployee]: [_enums_1.JobName.employeePT],
    [_enums_1.JobField.waiter]: [_enums_1.JobName.waiter],
    [_enums_1.JobField.partTimeWaiter]: [_enums_1.JobName.waiterPT],
};
exports.softwareJobs = exports.JobTracks[_enums_1.JobField.software];
exports.itJobs = exports.JobTracks[_enums_1.JobField.it];
exports.netEngJobs = exports.JobTracks[_enums_1.JobField.networkEngineer];
exports.businessJobs = exports.JobTracks[_enums_1.JobField.business];
exports.securityJobs = exports.JobTracks[_enums_1.JobField.security];
exports.agentJobs = exports.JobTracks[_enums_1.JobField.agent];
exports.softwareConsultJobs = exports.JobTracks[_enums_1.JobField.softwareConsultant];
exports.businessConsultJobs = exports.JobTracks[_enums_1.JobField.businessConsultant];
