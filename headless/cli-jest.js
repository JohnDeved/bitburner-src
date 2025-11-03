#!/usr/bin/env node

/**
 * CLI runner using Jest infrastructure instead of tsx
 * This avoids the module loading issues with tsx and PNGs
 */

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get script path and options from arguments
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
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
  npx JohnDeved/bitburner-src my-hack-script.js --time 120000
  npx JohnDeved/bitburner-src my-hack-script.js --json

For more information, visit: https://github.com/JohnDeved/bitburner-src
`);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  const packageJson = require('../package.json');
  console.log(`Bitburner Headless v${packageJson.version}`);
  process.exit(0);
}

// Get the script file (first non-option argument)
const scriptPath = args.find(arg => !arg.startsWith('--'));

if (!scriptPath) {
  console.error('❌ Error: No script path provided');
  console.error('Usage: npx JohnDeved/bitburner-src <script> [options]');
  process.exit(1);
}

if (!fs.existsSync(scriptPath)) {
  console.error(`❌ Error: Script file not found: ${scriptPath}`);
  process.exit(1);
}

// Create a temporary test file in the test directory that Jest knows about
const tempDir = path.join(__dirname, '..', 'test', 'jest', '.cli-temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const tempTestFile = path.join(tempDir, 'cli-runner.test.ts');

// Parse options
const getOption = (flag) => {
  const index = args.indexOf(flag);
  return index !== -1 && args[index + 1] ? args[index + 1] : null;
};

const time = getOption('--time') || '60000';
const scriptArgs = getOption('--args') || '';
const threads = getOption('--threads') || '1';
const isJson = args.includes('--json');
const isTestOnly = args.includes('--test-only');

// Read the script content
const scriptContent = fs.readFileSync(scriptPath, 'utf-8');
const scriptBasename = path.basename(scriptPath);

// Create the test file with correct imports relative to test directory
const testContent = `
import {
  setupBasicTestingEnvironment,
  initGameEnvironment,
  fixDoImportIssue,
  Player,
  resetPidCounter,
  getNS,
  simulateScript,
  type ScriptFilePath,
} from "../../../headless/index";

fixDoImportIssue();
initGameEnvironment();

describe("CLI Runner", () => {
  beforeEach(() => {
    setupBasicTestingEnvironment();
    resetPidCounter();
  });

  test("run script", async () => {
    const server = Player.getHomeComputer();
    const scriptPath = "${scriptBasename}" as ScriptFilePath;
    const scriptContent = ${JSON.stringify(scriptContent)};
    const scriptArgs = ${JSON.stringify(scriptArgs.split(',').filter(Boolean))};
    const time = ${time};
    const isTestOnly = ${isTestOnly};
    const isJson = ${isJson};
    
    server.writeToScriptFile(scriptPath, scriptContent);
    
    if (isTestOnly) {
      const script = server.scripts.get(scriptPath);
      if (!script) {
        console.error("   ✗ Failed to load script");
        expect(script).toBeDefined();
        return;
      }
      
      const ramUsage = script.getRamUsage(server.scripts);
      if (!ramUsage) {
        console.error("   ✗ Cannot calculate RAM usage - syntax error?");
        expect(ramUsage).toBeDefined();
        return;
      }
      
      if (!isJson) {
        console.log("\\n🔍 Testing script: ${scriptBasename}");
        console.log(\`   Arguments: \${scriptArgs.join(", ") || "none"}\\n\`);
        console.log("   ✓ Script file found");
        console.log("   ✓ Script loaded successfully");
        console.log(\`   ✓ RAM Usage: \${ramUsage.toFixed(2)} GB\`);
        console.log(\`   ✓ Available RAM: \${server.maxRam} GB\`);
        
        if (ramUsage > server.maxRam) {
          console.warn("   ⚠ Warning: Script requires more RAM than available");
        }
        
        console.log("\\n✅ Test completed successfully\\n");
      }
      
      expect(script).toBeDefined();
      expect(ramUsage).toBeGreaterThan(0);
    } else {
      const result = await simulateScript(scriptPath, scriptArgs, { maxTime: time });
      
      if (isJson) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(\`\\n🚀 Simulating script: \${scriptPath}\`);
        console.log(\`   Duration: \${(time / 1000).toFixed(1)}s\`);
        console.log(\`   Arguments: \${scriptArgs.join(", ") || "none"}\`);
        console.log(\`   Starting money: $\${Player.money.toFixed(2)}\`);
        console.log(\`\\n   Running simulation...\\n\`);
        
        console.log("📊 Simulation Results:");
        console.log(\`   Status: \${result.success ? "✅ Success" : "❌ Failed"}\`);
        if (result.error) {
          console.log(\`   Error: \${result.error}\`);
        }
        console.log(\`   Initial Money: $\${result.initialMoney.toFixed(2)}\`);
        console.log(\`   Final Money: $\${result.finalMoney.toFixed(2)}\`);
        console.log(\`   Money Gained: $\${result.moneyGained.toFixed(2)}\`);
        console.log(\`   Time Simulated: \${(result.timeSimulated / 1000).toFixed(2)}s\`);
        console.log(\`   Script Completions: \${result.completions}\`);
        
        if (result.timeSimulated > 0 && result.moneyGained > 0) {
          const moneyPerSecond = (result.moneyGained / result.timeSimulated) * 1000;
          const moneyPerMinute = moneyPerSecond * 60;
          const moneyPerHour = moneyPerSecond * 3600;
          const moneyPerDay = moneyPerHour * 24;
          
          console.log("\\n💰 Money Generation Rate:");
          console.log(\`   $\${moneyPerSecond.toFixed(2)} per second\`);
          console.log(\`   $\${moneyPerMinute.toFixed(2)} per minute\`);
          console.log(\`   $\${moneyPerHour.toFixed(2)} per hour\`);
          console.log(\`   $\${moneyPerDay.toFixed(2)} per day\`);
          
          console.log("\\n📈 Projections:");
          const timeToMillion = moneyPerSecond > 0 ? 1000000 / moneyPerSecond : Infinity;
          const timeToBillion = moneyPerSecond > 0 ? 1000000000 / moneyPerSecond : Infinity;
          
          if (timeToMillion < 3600) {
            console.log(\`   Time to $1M: \${(timeToMillion / 60).toFixed(1)} minutes\`);
          } else if (timeToMillion < 86400) {
            console.log(\`   Time to $1M: \${(timeToMillion / 3600).toFixed(1)} hours\`);
          } else {
            console.log(\`   Time to $1M: \${(timeToMillion / 86400).toFixed(1)} days\`);
          }
          
          if (timeToBillion < 3600) {
            console.log(\`   Time to $1B: \${(timeToBillion / 60).toFixed(1)} minutes\`);
          } else if (timeToBillion < 86400) {
            console.log(\`   Time to $1B: \${(timeToBillion / 3600).toFixed(1)} hours\`);
          } else {
            console.log(\`   Time to $1B: \${(timeToBillion / 86400).toFixed(1)} days\`);
          }
          
          if (result.completions > 0) {
            const avgTimePerRun = result.timeSimulated / result.completions;
            const avgMoneyPerRun = result.moneyGained / result.completions;
            console.log("\\n⚡ Efficiency Metrics:");
            console.log(\`   Average time per run: \${(avgTimePerRun / 1000).toFixed(2)}s\`);
            console.log(\`   Average money per run: $\${avgMoneyPerRun.toFixed(2)}\`);
          }
        } else if (result.success && result.moneyGained === 0) {
          console.log("\\n   ℹ️  Script completed but no money was gained");
          console.log("   This might be a utility script or it needs more time to generate money.");
        } else if (result.success && result.moneyGained < 0) {
          console.log(\`\\n   ⚠️  Script lost money: $\${Math.abs(result.moneyGained).toFixed(2)}\`);
          console.log("   This might be intentional (spending money) or indicate an issue.");
        }
        
        if (result.logs.length > 0) {
          console.log("\\n📝 Script Logs (last 10):");
          result.logs.slice(-10).forEach((log) => {
            console.log(\`   \${log}\`);
          });
        }
        
        console.log(result.success ? "\\n✅ Simulation completed\\n" : "\\n❌ Simulation failed\\n");
      }
      
      expect(result.success).toBe(true);
    }
  }, 120000);
});
`;

fs.writeFileSync(tempTestFile, testContent);

// Run Jest with the temporary test file
const jestResult = spawnSync(
  'npx',
  ['jest', tempTestFile, '--testTimeout=120000', '--verbose=false', '--silent=false'],
  {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
    shell: true
  }
);

// Clean up
try {
  fs.unlinkSync(tempTestFile);
  fs.rmdirSync(tempDir);
} catch (e) {
  // Ignore cleanup errors
}

process.exit(jestResult.status || 0);
