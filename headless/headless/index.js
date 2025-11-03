"use strict";
/**
 * Bitburner Headless Test Environment
 *
 * This module provides utilities for testing Bitburner scripts in a headless environment.
 * It can be installed via: npm i JohnDeved/bitburner-src
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateTimeToReachMoney = exports.calculateHackingRate = exports.simulateScript = exports.resetPidCounter = exports.SpecialServers = exports.runScriptFromScript = exports.startWorkerScript = exports.workerScripts = exports.GetServer = exports.GetServerOrThrow = exports.RunningScript = exports.NetscriptFunctions = exports.WorkerScript = exports.setPlayer = exports.Player = exports.getMockedNetscriptContext = exports.fixDoImportIssue = exports.initGameEnvironment = exports.setupBasicTestingEnvironment = exports.getNS = void 0;
// Re-export test utilities
var Utilities_1 = require("../test/jest/Utilities");
Object.defineProperty(exports, "getNS", { enumerable: true, get: function () { return Utilities_1.getNS; } });
Object.defineProperty(exports, "setupBasicTestingEnvironment", { enumerable: true, get: function () { return Utilities_1.setupBasicTestingEnvironment; } });
Object.defineProperty(exports, "initGameEnvironment", { enumerable: true, get: function () { return Utilities_1.initGameEnvironment; } });
Object.defineProperty(exports, "fixDoImportIssue", { enumerable: true, get: function () { return Utilities_1.fixDoImportIssue; } });
Object.defineProperty(exports, "getMockedNetscriptContext", { enumerable: true, get: function () { return Utilities_1.getMockedNetscriptContext; } });
// Re-export core types and utilities
var Player_1 = require("../src/Player");
Object.defineProperty(exports, "Player", { enumerable: true, get: function () { return Player_1.Player; } });
Object.defineProperty(exports, "setPlayer", { enumerable: true, get: function () { return Player_1.setPlayer; } });
var WorkerScript_1 = require("../src/Netscript/WorkerScript");
Object.defineProperty(exports, "WorkerScript", { enumerable: true, get: function () { return WorkerScript_1.WorkerScript; } });
var NetscriptFunctions_1 = require("../src/NetscriptFunctions");
Object.defineProperty(exports, "NetscriptFunctions", { enumerable: true, get: function () { return NetscriptFunctions_1.NetscriptFunctions; } });
var RunningScript_1 = require("../src/Script/RunningScript");
Object.defineProperty(exports, "RunningScript", { enumerable: true, get: function () { return RunningScript_1.RunningScript; } });
var AllServers_1 = require("../src/Server/AllServers");
Object.defineProperty(exports, "GetServerOrThrow", { enumerable: true, get: function () { return AllServers_1.GetServerOrThrow; } });
Object.defineProperty(exports, "GetServer", { enumerable: true, get: function () { return AllServers_1.GetServer; } });
var WorkerScripts_1 = require("../src/Netscript/WorkerScripts");
Object.defineProperty(exports, "workerScripts", { enumerable: true, get: function () { return WorkerScripts_1.workerScripts; } });
var NetscriptWorker_1 = require("../src/NetscriptWorker");
Object.defineProperty(exports, "startWorkerScript", { enumerable: true, get: function () { return NetscriptWorker_1.startWorkerScript; } });
Object.defineProperty(exports, "runScriptFromScript", { enumerable: true, get: function () { return NetscriptWorker_1.runScriptFromScript; } });
var SpecialServers_1 = require("../src/Server/data/SpecialServers");
Object.defineProperty(exports, "SpecialServers", { enumerable: true, get: function () { return SpecialServers_1.SpecialServers; } });
var Pid_1 = require("../src/Netscript/Pid");
Object.defineProperty(exports, "resetPidCounter", { enumerable: true, get: function () { return Pid_1.resetPidCounter; } });
// Re-export simulation utilities
var simulation_1 = require("./simulation");
Object.defineProperty(exports, "simulateScript", { enumerable: true, get: function () { return simulation_1.simulateScript; } });
Object.defineProperty(exports, "calculateHackingRate", { enumerable: true, get: function () { return simulation_1.calculateHackingRate; } });
Object.defineProperty(exports, "estimateTimeToReachMoney", { enumerable: true, get: function () { return simulation_1.estimateTimeToReachMoney; } });
/**
 * Note: For full Netscript type definitions (NS, Player, Server, etc.),
 * you can import them directly from the source:
 *
 * import type { NS, Player, Server } from "bitburner/headless";
 *
 * Or reference the NetscriptDefinitions.d.ts file directly in your tsconfig.json
 */
