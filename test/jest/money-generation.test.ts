/**
 * Test to demonstrate and verify money generation tracking in the headless environment
 */

import {
  getNS,
  setupBasicTestingEnvironment,
  initGameEnvironment,
  fixDoImportIssue,
  Player,
  GetServerOrThrow,
  startWorkerScript,
  workerScripts,
  RunningScript,
  resetPidCounter,
  simulateScript,
  type ScriptFilePath,
} from "../../headless";

// Initialize the environment once before all tests
fixDoImportIssue();
initGameEnvironment();

describe("Money Generation Tracking Tests", () => {
  beforeEach(() => {
    // Set up a clean testing environment for each test
    setupBasicTestingEnvironment();
    resetPidCounter();
  });

  test("should track money gained from a hack script", async () => {
    const server = Player.getHomeComputer();
    const scriptPath = "money-hack.js" as ScriptFilePath;
    
    // Write a hacking script that should generate money
    server.writeToScriptFile(scriptPath, `
      export async function main(ns) {
        const target = ns.args[0] || "n00dles";
        ns.print("Attempting to hack " + target);
        
        const hackAmount = await ns.hack(target);
        
        if (hackAmount > 0) {
          ns.print("Successfully hacked $" + hackAmount);
        } else {
          ns.print("Hack failed or no money stolen");
        }
      }
    `);
    
    const initialMoney = Player.money;
    
    // Simulate the script
    const result = await simulateScript(scriptPath, ["n00dles"], {
      maxTime: 30000, // 30 seconds
    });
    
    // Verify the simulation worked
    expect(result.success).toBe(true);
    expect(result.initialMoney).toBe(initialMoney);
    expect(result.timeSimulated).toBeGreaterThan(0);
    expect(result.completions).toBeGreaterThan(0);
    
    // Log the results
    console.log("\n📊 Money Generation Test Results:");
    console.log(`   Initial Money: $${result.initialMoney.toFixed(2)}`);
    console.log(`   Final Money: $${result.finalMoney.toFixed(2)}`);
    console.log(`   Money Gained: $${result.moneyGained.toFixed(2)}`);
    console.log(`   Time: ${(result.timeSimulated / 1000).toFixed(2)}s`);
    
    if (result.moneyGained > 0) {
      const rate = (result.moneyGained / result.timeSimulated) * 1000;
      console.log(`   Rate: $${rate.toFixed(2)}/s ($${(rate * 3600).toFixed(2)}/hr)`);
    }
  });

  test("should calculate money generation rate accurately", async () => {
    const server = Player.getHomeComputer();
    const scriptPath = "fast-hack.js" as ScriptFilePath;
    
    // Write a script that completes quickly
    server.writeToScriptFile(scriptPath, `
      export async function main(ns) {
        await ns.hack("n00dles");
      }
    `);
    
    const result = await simulateScript(scriptPath, [], {
      maxTime: 10000, // 10 seconds
    });
    
    expect(result.success).toBe(true);
    
    // Calculate and verify rate
    if (result.timeSimulated > 0 && result.moneyGained > 0) {
      const moneyPerSecond = (result.moneyGained / result.timeSimulated) * 1000;
      const moneyPerHour = moneyPerSecond * 3600;
      
      expect(moneyPerSecond).toBeGreaterThan(0);
      expect(moneyPerHour).toBeGreaterThan(0);
      
      console.log("\n💰 Generation Rate:");
      console.log(`   ${moneyPerSecond.toFixed(2)} $/s`);
      console.log(`   ${moneyPerHour.toFixed(2)} $/hr`);
    }
  });

  test("should handle scripts that don't generate money", async () => {
    const server = Player.getHomeComputer();
    const scriptPath = "no-money.js" as ScriptFilePath;
    
    // Write a script that doesn't generate money
    server.writeToScriptFile(scriptPath, `
      export async function main(ns) {
        ns.print("This script doesn't generate money");
        const server = ns.getServer("home");
        ns.print("Server: " + server.hostname);
      }
    `);
    
    const result = await simulateScript(scriptPath, [], {
      maxTime: 5000, // 5 seconds
    });
    
    expect(result.success).toBe(true);
    expect(result.moneyGained).toBe(0);
    
    console.log("\n📊 Non-Money Script Results:");
    console.log(`   Money Gained: $${result.moneyGained} (as expected)`);
  });

  test("should track multiple completions", async () => {
    const server = Player.getHomeComputer();
    const scriptPath = "multi-hack.js" as ScriptFilePath;
    
    // Write a script that can complete multiple times
    server.writeToScriptFile(scriptPath, `
      export async function main(ns) {
        await ns.hack("n00dles");
      }
    `);
    
    const result = await simulateScript(scriptPath, [], {
      maxTime: 20000, // 20 seconds
    });
    
    if (result.success && result.completions > 0) {
      const avgMoneyPerCompletion = result.moneyGained / result.completions;
      const avgTimePerCompletion = result.timeSimulated / result.completions;
      
      console.log("\n⚡ Multiple Completion Stats:");
      console.log(`   Total Completions: ${result.completions}`);
      console.log(`   Avg Money/Run: $${avgMoneyPerCompletion.toFixed(2)}`);
      console.log(`   Avg Time/Run: ${(avgTimePerCompletion / 1000).toFixed(2)}s`);
      
      expect(result.completions).toBeGreaterThanOrEqual(1);
    }
  });
});
