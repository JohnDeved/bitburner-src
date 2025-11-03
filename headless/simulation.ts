/**
 * Script Simulation Utilities
 * 
 * Provides utilities for simulating script execution over time and tracking money generation.
 */

import { Player } from "../src/Player";
import { GetServerOrThrow } from "../src/Server/AllServers";
import { startWorkerScript } from "../src/NetscriptWorker";
import { workerScripts } from "../src/Netscript/WorkerScripts";
import { RunningScript } from "../src/Script/RunningScript";
import type { ScriptFilePath } from "../src/Paths/ScriptFilePath";

/**
 * Simulation result containing metrics about script execution
 */
export interface SimulationResult {
  /** Total money gained during simulation */
  moneyGained: number;
  /** Initial player money */
  initialMoney: number;
  /** Final player money */
  finalMoney: number;
  /** Time simulated in milliseconds */
  timeSimulated: number;
  /** Number of script completions */
  completions: number;
  /** Script logs collected during simulation */
  logs: string[];
  /** Whether the simulation completed successfully */
  success: boolean;
  /** Error message if simulation failed */
  error?: string;
}

/**
 * Options for script simulation
 */
export interface SimulationOptions {
  /** Maximum time to simulate in milliseconds (default: 60000) */
  maxTime?: number;
  /** Maximum number of script completions to wait for (default: Infinity) */
  maxCompletions?: number;
  /** Check interval for script status in milliseconds (default: 100) */
  checkInterval?: number;
  /** Timeout for script to complete in milliseconds (default: 300000) */
  timeout?: number;
}

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
export async function simulateScript(
  scriptPath: ScriptFilePath,
  args: (string | number | boolean)[] = [],
  options: SimulationOptions = {},
): Promise<SimulationResult> {
  const {
    maxTime = 60000,
    maxCompletions = Infinity,
    checkInterval = 100,
    timeout = 300000,
  } = options;

  const server = Player.getHomeComputer();
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

  const initialMoney = Player.money;
  const startTime = Date.now();
  let completions = 0;
  const allLogs: string[] = [];

  try {
    const runningScript = new RunningScript(script, ramUsage, args);
    const pid = startWorkerScript(runningScript, server);

    if (pid <= 0) {
      return {
        moneyGained: 0,
        initialMoney,
        finalMoney: Player.money,
        timeSimulated: 0,
        completions: 0,
        logs: [],
        success: false,
        error: `Failed to start script ${scriptPath}`,
      };
    }

    const workerScript = workerScripts.get(pid);
    if (!workerScript) {
      return {
        moneyGained: 0,
        initialMoney,
        finalMoney: Player.money,
        timeSimulated: 0,
        completions: 0,
        logs: [],
        success: false,
        error: `Worker script not found for PID ${pid}`,
      };
    }

    // Wait for script to complete or timeout
    const scriptCompleted = new Promise<void>((resolve) => {
      workerScript.atExit = new Map([["default", resolve]]);
    });

    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error("Script execution timeout")), timeout);
    });

    // Wait for either completion or timeout
    await Promise.race([scriptCompleted, timeoutPromise]);

    completions++;
    allLogs.push(...runningScript.logs);

    const timeSimulated = Date.now() - startTime;
    const finalMoney = Player.money;

    return {
      moneyGained: finalMoney - initialMoney,
      initialMoney,
      finalMoney,
      timeSimulated,
      completions,
      logs: allLogs,
      success: true,
    };
  } catch (error) {
    const timeSimulated = Date.now() - startTime;
    return {
      moneyGained: Player.money - initialMoney,
      initialMoney,
      finalMoney: Player.money,
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
export function calculateHackingRate(targetServer: string, threads: number = 1): number {
  const server = GetServerOrThrow(targetServer);
  const { calculateHackingTime, calculatePercentMoneyHacked, calculateHackingChance } = require("../src/Hacking");
  
  const hackTime = calculateHackingTime(server, Player);
  const percentStolen = calculatePercentMoneyHacked(server, Player);
  const hackChance = calculateHackingChance(server, Player);
  
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
export async function estimateTimeToReachMoney(
  scriptPath: ScriptFilePath,
  targetMoney: number,
  sampleTime: number = 10000,
): Promise<number | null> {
  const sampleResult = await simulateScript(scriptPath, [], { maxTime: sampleTime });
  
  if (!sampleResult.success || sampleResult.moneyGained <= 0) {
    return null;
  }
  
  const moneyPerMs = sampleResult.moneyGained / sampleResult.timeSimulated;
  return targetMoney / moneyPerMs;
}
