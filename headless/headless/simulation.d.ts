/**
 * Script Simulation Utilities
 *
 * Provides utilities for simulating script execution over time and tracking money generation.
 */
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
export declare function simulateScript(scriptPath: ScriptFilePath, args?: (string | number | boolean)[], options?: SimulationOptions): Promise<SimulationResult>;
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
export declare function calculateHackingRate(targetServer: string, threads?: number): number;
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
export declare function estimateTimeToReachMoney(scriptPath: ScriptFilePath, targetMoney: number, sampleTime?: number): Promise<number | null>;
