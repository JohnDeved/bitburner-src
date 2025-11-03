"use strict";
/**
 * Script Simulation Utilities
 *
 * Provides utilities for simulating script execution over time and tracking money generation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateScript = simulateScript;
exports.calculateHackingRate = calculateHackingRate;
exports.estimateTimeToReachMoney = estimateTimeToReachMoney;
const Player_1 = require("../src/Player");
const AllServers_1 = require("../src/Server/AllServers");
const NetscriptWorker_1 = require("../src/NetscriptWorker");
const WorkerScripts_1 = require("../src/Netscript/WorkerScripts");
const RunningScript_1 = require("../src/Script/RunningScript");
/**
 * Simulates running a script and tracks money generation over time.
 *
 * @param scriptPath - Path to the script to run
 * @param args - Arguments to pass to the script
 * @param options - Simulation options
 * @returns Promise resolving to simulation results
 *
 * @example
 * ```typescript
 * const result = await simulateScript("hack.js" as ScriptFilePath, ["n00dles"], {
 *   maxTime: 60000, // Simulate for 60 seconds
 * });
 *
 * console.log(`Money gained: ${result.moneyGained}`);
 * console.log(`Money per second: ${result.moneyGained / (result.timeSimulated / 1000)}`);
 * ```
 */
async function simulateScript(scriptPath, args = [], options = {}) {
    const { maxTime = 60000, maxCompletions = Infinity, checkInterval = 100, timeout = 300000, } = options;
    const server = Player_1.Player.getHomeComputer();
    const script = server.scripts.get(scriptPath);
    if (!script) {
        return {
            moneyGained: 0,
            initialMoney: 0,
            finalMoney: 0,
            timeSimulated: 0,
            completions: 0,
            logs: [],
            success: false,
            error: `Script ${scriptPath} does not exist on home server`,
        };
    }
    const ramUsage = script.getRamUsage(server.scripts);
    if (!ramUsage) {
        return {
            moneyGained: 0,
            initialMoney: 0,
            finalMoney: 0,
            timeSimulated: 0,
            completions: 0,
            logs: [],
            success: false,
            error: `Cannot calculate RAM usage for ${scriptPath}`,
        };
    }
    const initialMoney = Player_1.Player.money;
    const startTime = Date.now();
    let completions = 0;
    const allLogs = [];
    try {
        const runningScript = new RunningScript_1.RunningScript(script, ramUsage, args);
        const pid = (0, NetscriptWorker_1.startWorkerScript)(runningScript, server);
        if (pid <= 0) {
            return {
                moneyGained: 0,
                initialMoney,
                finalMoney: Player_1.Player.money,
                timeSimulated: 0,
                completions: 0,
                logs: [],
                success: false,
                error: `Failed to start script ${scriptPath}`,
            };
        }
        const workerScript = WorkerScripts_1.workerScripts.get(pid);
        if (!workerScript) {
            return {
                moneyGained: 0,
                initialMoney,
                finalMoney: Player_1.Player.money,
                timeSimulated: 0,
                completions: 0,
                logs: [],
                success: false,
                error: `Worker script not found for PID ${pid}`,
            };
        }
        // Wait for script to complete or timeout
        const scriptCompleted = new Promise((resolve) => {
            workerScript.atExit = new Map([["default", resolve]]);
        });
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Script execution timeout")), timeout);
        });
        // Wait for either completion or timeout
        await Promise.race([scriptCompleted, timeoutPromise]);
        completions++;
        allLogs.push(...runningScript.logs);
        const timeSimulated = Date.now() - startTime;
        const finalMoney = Player_1.Player.money;
        return {
            moneyGained: finalMoney - initialMoney,
            initialMoney,
            finalMoney,
            timeSimulated,
            completions,
            logs: allLogs,
            success: true,
        };
    }
    catch (error) {
        const timeSimulated = Date.now() - startTime;
        return {
            moneyGained: Player_1.Player.money - initialMoney,
            initialMoney,
            finalMoney: Player_1.Player.money,
            timeSimulated,
            completions,
            logs: allLogs,
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}
/**
 * Calculates the theoretical maximum money generation rate for a hacking script.
 *
 * @param targetServer - The server being targeted
 * @param threads - Number of threads to use
 * @returns Expected money per second
 *
 * @example
 * ```typescript
 * const moneyPerSecond = calculateHackingRate("n00dles", 1);
 * console.log(`Expected rate: $${moneyPerSecond}/s`);
 * ```
 */
function calculateHackingRate(targetServer, threads = 1) {
    const server = (0, AllServers_1.GetServerOrThrow)(targetServer);
    const { calculateHackingTime, calculatePercentMoneyHacked, calculateHackingChance } = require("../src/Hacking");
    const hackTime = calculateHackingTime(server, Player_1.Player);
    const percentStolen = calculatePercentMoneyHacked(server, Player_1.Player);
    const hackChance = calculateHackingChance(server, Player_1.Player);
    const moneyPerHack = server.moneyAvailable * percentStolen * threads;
    const expectedMoneyPerHack = moneyPerHack * hackChance;
    const hacksPerSecond = 1 / hackTime;
    return expectedMoneyPerHack * hacksPerSecond;
}
/**
 * Estimates the time needed to reach a target money amount with a given script.
 *
 * @param scriptPath - Path to the hacking script
 * @param targetMoney - Target money amount to reach
 * @param sampleTime - Time to sample the script's performance in milliseconds (default: 10000)
 * @returns Promise resolving to estimated time in milliseconds, or null if unable to estimate
 *
 * @example
 * ```typescript
 * const estimatedTime = await estimateTimeToReachMoney("hack.js" as ScriptFilePath, 1000000);
 * console.log(`Estimated time to reach $1M: ${estimatedTime}ms`);
 * ```
 */
async function estimateTimeToReachMoney(scriptPath, targetMoney, sampleTime = 10000) {
    const sampleResult = await simulateScript(scriptPath, [], { maxTime: sampleTime });
    if (!sampleResult.success || sampleResult.moneyGained <= 0) {
        return null;
    }
    const moneyPerMs = sampleResult.moneyGained / sampleResult.timeSimulated;
    return targetMoney / moneyPerMs;
}
