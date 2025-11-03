#!/usr/bin/env node

/**
 * Bitburner Headless CLI
 * 
 * Command-line interface for running and testing Bitburner scripts in a headless environment.
 * 
 * Usage: npx JohnDeved/bitburner-src <script> [options]
 */

import * as fs from "fs";
import * as path from "path";

// Lazy load modules to avoid loading unnecessary dependencies
let indexModule: any = null;
let simulationModule: any = null;

function loadModules() {
  if (!indexModule) {
    // Use dynamic require to avoid top-level imports
    indexModule = require("./index");
  }
  if (!simulationModule) {
    simulationModule = require("./simulation");
  }
  return { indexModule, simulationModule };
}

function showHelp() {
  console.log(`
Bitburner Headless CLI

Usage: npx JohnDeved/bitburner-src <script> [options]

Arguments:
  <script>                Path to your Bitburner script (.js or .ts)

Options:
  --time <ms>            Simulation time in milliseconds (default: 60000)
  --args <args>          Script arguments (comma-separated)
  --threads <n>          Number of threads (default: 1)
  --json                 Output results as JSON
  --test-only            Only test if script loads, don't run simulation
  --help, -h             Show this help message
  --version, -v          Show version information

Examples:
  # Test if a script loads correctly
  npx JohnDeved/bitburner-src myscript.js --test-only

  # Simulate a hack script for 2 minutes
  npx JohnDeved/bitburner-src hack.js --time 120000

  # Run with arguments
  npx JohnDeved/bitburner-src hack.js --args "n00dles,foodnstuff"

  # Get JSON output for parsing
  npx JohnDeved/bitburner-src hack.js --json > results.json

For more information, visit: https://github.com/JohnDeved/bitburner-src
`);
}

function showVersion() {
  const packageJson = require("../package.json");
  console.log(`Bitburner Headless v${packageJson.version}`);
}

async function testScript(scriptPath: string, args: string[] = []) {
  // Lazy load the modules
  const { indexModule } = loadModules();
  
  const {
    getNS,
    setupBasicTestingEnvironment,
    initGameEnvironment,
    fixDoImportIssue,
    Player,
  } = indexModule;

  fixDoImportIssue();
  initGameEnvironment();
  setupBasicTestingEnvironment();

  console.log(`\n🔍 Testing script: ${scriptPath}`);
  console.log(`   Arguments: ${args.join(", ") || "none"}\n`);

  try {
    const ns = getNS();
    const server = Player.getHomeComputer();

    // Check if script exists in current directory
    let scriptCode: string;
    if (fs.existsSync(scriptPath)) {
      scriptCode = fs.readFileSync(scriptPath, "utf-8");
      console.log(`   ✓ Script file found`);
    } else {
      console.error(`   ✗ Script file not found: ${scriptPath}`);
      process.exit(1);
    }

    // Write script to virtual server
    const scriptFileName = path.basename(scriptPath);
    server.writeToScriptFile(scriptFileName as any, scriptCode);

    const script = server.scripts.get(scriptFileName as any);
    if (!script) {
      console.error("   ✗ Failed to load script");
      process.exit(1);
    }

    // Calculate RAM usage
    const ramUsage = script.getRamUsage(server.scripts);
    if (!ramUsage) {
      console.error("   ✗ Cannot calculate RAM usage - syntax error?");
      process.exit(1);
    }

    console.log(`   ✓ Script loaded successfully`);
    console.log(`   ✓ RAM Usage: ${ramUsage.toFixed(2)} GB`);
    console.log(`   ✓ Available RAM: ${server.maxRam} GB`);

    if (ramUsage > server.maxRam) {
      console.warn(`   ⚠ Warning: Script requires more RAM than available`);
    }

    console.log(`\n✅ Test completed successfully\n`);
  } catch (error) {
    console.error(`\n❌ Test failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  }
}

async function simulateScript(
  scriptPath: string,
  options: {
    args?: string[];
    time?: number;
    threads?: number;
    json?: boolean;
  } = {},
) {
  const { args = [], time = 60000, threads = 1, json = false } = options;

  // Lazy load the modules
  const { indexModule, simulationModule } = loadModules();

  const {
    setupBasicTestingEnvironment,
    initGameEnvironment,
    fixDoImportIssue,
    Player,
    resetPidCounter,
  } = indexModule;

  const { simulateScript: simulate } = simulationModule;

  fixDoImportIssue();
  initGameEnvironment();
  setupBasicTestingEnvironment();
  resetPidCounter();

  if (!json) {
    console.log(`\n🚀 Simulating script: ${path.basename(scriptPath)}`);
    console.log(`   Duration: ${(time / 1000).toFixed(1)}s`);
    console.log(`   Arguments: ${args.join(", ") || "none"}`);
    console.log(`   Threads: ${threads}`);
    console.log(`   Starting money: $${Player.money.toFixed(2)}`);
    console.log(`\n   Running simulation...`);
  }

  try {
    const server = Player.getHomeComputer();

    // Load script from file system
    let scriptCode: string;
    if (fs.existsSync(scriptPath)) {
      scriptCode = fs.readFileSync(scriptPath, "utf-8");
    } else {
      if (!json) console.error(`\n❌ Script file not found: ${scriptPath}\n`);
      process.exit(1);
    }

    const scriptFileName = path.basename(scriptPath);
    server.writeToScriptFile(scriptFileName as any, scriptCode);

    // Run simulation
    const result = await simulate(scriptFileName as any, args, { maxTime: time });

    if (json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(`\n📊 Simulation Results:`);
      console.log(`   Status: ${result.success ? "✅ Success" : "❌ Failed"}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      console.log(`   Initial Money: $${result.initialMoney.toFixed(2)}`);
      console.log(`   Final Money: $${result.finalMoney.toFixed(2)}`);
      console.log(`   Money Gained: $${result.moneyGained.toFixed(2)}`);
      console.log(`   Time Simulated: ${(result.timeSimulated / 1000).toFixed(2)}s`);
      console.log(`   Script Completions: ${result.completions}`);
      
      if (result.timeSimulated > 0 && result.moneyGained > 0) {
        const moneyPerSecond = (result.moneyGained / result.timeSimulated) * 1000;
        const moneyPerMinute = moneyPerSecond * 60;
        const moneyPerHour = moneyPerSecond * 3600;
        const moneyPerDay = moneyPerHour * 24;
        
        console.log(`\n💰 Money Generation Rate:`);
        console.log(`   $${moneyPerSecond.toFixed(2)} per second`);
        console.log(`   $${moneyPerMinute.toFixed(2)} per minute`);
        console.log(`   $${moneyPerHour.toFixed(2)} per hour`);
        console.log(`   $${moneyPerDay.toFixed(2)} per day`);
        
        // Show projections
        console.log(`\n📈 Projections:`);
        const timeToMillion = moneyPerSecond > 0 ? 1000000 / moneyPerSecond : Infinity;
        const timeToBillion = moneyPerSecond > 0 ? 1000000000 / moneyPerSecond : Infinity;
        
        if (timeToMillion < 3600) {
          console.log(`   Time to $1M: ${(timeToMillion / 60).toFixed(1)} minutes`);
        } else if (timeToMillion < 86400) {
          console.log(`   Time to $1M: ${(timeToMillion / 3600).toFixed(1)} hours`);
        } else {
          console.log(`   Time to $1M: ${(timeToMillion / 86400).toFixed(1)} days`);
        }
        
        if (timeToBillion < 3600) {
          console.log(`   Time to $1B: ${(timeToBillion / 60).toFixed(1)} minutes`);
        } else if (timeToBillion < 86400) {
          console.log(`   Time to $1B: ${(timeToBillion / 3600).toFixed(1)} hours`);
        } else {
          console.log(`   Time to $1B: ${(timeToBillion / 86400).toFixed(1)} days`);
        }
        
        // Show efficiency metrics
        if (result.completions > 0) {
          const avgTimePerRun = result.timeSimulated / result.completions;
          const avgMoneyPerRun = result.moneyGained / result.completions;
          console.log(`\n⚡ Efficiency Metrics:`);
          console.log(`   Average time per run: ${(avgTimePerRun / 1000).toFixed(2)}s`);
          console.log(`   Average money per run: $${avgMoneyPerRun.toFixed(2)}`);
        }
      } else if (result.success && result.moneyGained === 0) {
        console.log(`\n   ℹ️  Script completed but no money was gained`);
        console.log(`   This might be a utility script or it needs more time to generate money.`);
      } else if (result.success && result.moneyGained < 0) {
        console.log(`\n   ⚠️  Script lost money: $${Math.abs(result.moneyGained).toFixed(2)}`);
        console.log(`   This might be intentional (spending money) or indicate an issue.`);
      }

      if (result.logs.length > 0) {
        console.log(`\n📝 Script Logs (last 10):`);
        result.logs.slice(-10).forEach((log) => {
          console.log(`   ${log}`);
        });
      }

      console.log(result.success ? "\n✅ Simulation completed\n" : "\n❌ Simulation failed\n");
    }

    process.exit(result.success ? 0 : 1);
  } catch (error) {
    if (json) {
      console.log(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : String(error),
        }),
      );
    } else {
      console.error(`\n❌ Simulation failed: ${error instanceof Error ? error.message : String(error)}\n`);
    }
    process.exit(1);
  }
}

// Main CLI handler
async function main() {
  const args = process.argv.slice(2);

  // Handle help and version flags
  if (
    args.length === 0 ||
    args.includes("--help") ||
    args.includes("-h") ||
    args.includes("help")
  ) {
    showHelp();
    process.exit(0);
  }

  if (args.includes("--version") || args.includes("-v") || args.includes("version")) {
    showVersion();
    process.exit(0);
  }

  // First argument is the script path
  const scriptPath = args[0];
  
  if (!scriptPath || scriptPath.startsWith("--")) {
    console.error("❌ Error: No script path provided");
    console.error("Usage: npx JohnDeved/bitburner-src <script> [options]");
    console.error("Run with --help for more information");
    process.exit(1);
  }

  // Parse options
  const options: any = {};

  const argsIndex = args.indexOf("--args");
  if (argsIndex !== -1 && args[argsIndex + 1]) {
    options.args = args[argsIndex + 1].split(",").map(s => s.trim());
  }

  const timeIndex = args.indexOf("--time");
  if (timeIndex !== -1 && args[timeIndex + 1]) {
    options.time = parseInt(args[timeIndex + 1], 10);
    if (isNaN(options.time) || options.time <= 0) {
      console.error("❌ Error: --time must be a positive number");
      process.exit(1);
    }
  }

  const threadsIndex = args.indexOf("--threads");
  if (threadsIndex !== -1 && args[threadsIndex + 1]) {
    options.threads = parseInt(args[threadsIndex + 1], 10);
    if (isNaN(options.threads) || options.threads <= 0) {
      console.error("❌ Error: --threads must be a positive number");
      process.exit(1);
    }
  }

  if (args.includes("--json")) {
    options.json = true;
  }

  const testOnly = args.includes("--test-only");

  if (testOnly) {
    await testScript(scriptPath, options.args || []);
  } else {
    await simulateScript(scriptPath, options);
  }
}

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
