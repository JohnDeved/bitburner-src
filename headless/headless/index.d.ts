/**
 * Bitburner Headless Test Environment
 *
 * This module provides utilities for testing Bitburner scripts in a headless environment.
 * It can be installed via: npm i JohnDeved/bitburner-src
 */
export { getNS, setupBasicTestingEnvironment, initGameEnvironment, fixDoImportIssue, getMockedNetscriptContext, } from "../test/jest/Utilities";
export { Player, setPlayer } from "../src/Player";
export { WorkerScript } from "../src/Netscript/WorkerScript";
export { NetscriptFunctions } from "../src/NetscriptFunctions";
export { RunningScript } from "../src/Script/RunningScript";
export { GetServerOrThrow, GetServer } from "../src/Server/AllServers";
export { workerScripts } from "../src/Netscript/WorkerScripts";
export { startWorkerScript, runScriptFromScript } from "../src/NetscriptWorker";
export { SpecialServers } from "../src/Server/data/SpecialServers";
export { resetPidCounter } from "../src/Netscript/Pid";
export type { ScriptFilePath } from "../src/Paths/ScriptFilePath";
export type { NSFull } from "../src/NetscriptFunctions";
export { simulateScript, calculateHackingRate, estimateTimeToReachMoney, type SimulationResult, type SimulationOptions, } from "./simulation";
/**
 * Note: For full Netscript type definitions (NS, Player, Server, etc.),
 * you can import them directly from the source:
 *
 * import type { NS, Player, Server } from "bitburner/headless";
 *
 * Or reference the NetscriptDefinitions.d.ts file directly in your tsconfig.json
 */
