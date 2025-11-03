"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkWebItems = void 0;
const DarkWebItem_1 = require("./DarkWebItem");
const _enums_1 = require("@enums");
exports.DarkWebItems = {
    BruteSSHProgram: new DarkWebItem_1.DarkWebItem(_enums_1.CompletedProgramName.bruteSsh, 500e3, "Opens up SSH Ports."),
    FTPCrackProgram: new DarkWebItem_1.DarkWebItem(_enums_1.CompletedProgramName.ftpCrack, 1500e3, "Opens up FTP Ports."),
    RelaySMTPProgram: new DarkWebItem_1.DarkWebItem(_enums_1.CompletedProgramName.relaySmtp, 5e6, "Opens up SMTP Ports."),
    HTTPWormProgram: new DarkWebItem_1.DarkWebItem(_enums_1.CompletedProgramName.httpWorm, 30e6, "Opens up HTTP Ports."),
    SQLInjectProgram: new DarkWebItem_1.DarkWebItem(_enums_1.CompletedProgramName.sqlInject, 250e6, "Opens up SQL Ports."),
    ServerProfiler: new DarkWebItem_1.DarkWebItem(_enums_1.CompletedProgramName.serverProfiler, 500e3, "Displays detailed server information."),
    DeepscanV1: new DarkWebItem_1.DarkWebItem(_enums_1.CompletedProgramName.deepScan1, 500000, "Enables 'scan-analyze' with a depth up to 5."),
    DeepscanV2: new DarkWebItem_1.DarkWebItem(_enums_1.CompletedProgramName.deepScan2, 25e6, "Enables 'scan-analyze' with a depth up to 10."),
    AutolinkProgram: new DarkWebItem_1.DarkWebItem(_enums_1.CompletedProgramName.autoLink, 1e6, "Enables direct connect via 'scan-analyze'."),
    FormulasProgram: new DarkWebItem_1.DarkWebItem(_enums_1.CompletedProgramName.formulas, 5e9, "Unlock access to the formulas API."),
};
