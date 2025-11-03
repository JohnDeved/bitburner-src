# Bitburner Headless Test Environment

A headless test environment for Bitburner TypeScript scripts. This package allows you to test your Bitburner scripts in a Node.js environment without running the full game.

## Installation

```bash
npm install --save-dev JohnDeved/bitburner-src
```

**Note:** The CLI currently works best when the package is installed in your project. Direct execution from the GitHub repository may encounter module loading issues due to complex dependencies.

## Usage

### Testing with Jest

The recommended way to use the headless environment is with Jest or another testing framework:

```typescript
import {
  getNS,
  setupBasicTestingEnvironment,
  initGameEnvironment,
  fixDoImportIssue,
  Player,
  GetServerOrThrow,
  SpecialServers,
  type ScriptFilePath,
} from "bitburner/headless";

// Initialize the environment once before all tests
fixDoImportIssue();
initGameEnvironment();

describe("My Bitburner Script Tests", () => {
  beforeEach(() => {
    // Set up a clean testing environment for each test
    setupBasicTestingEnvironment();
  });

  test("should execute a simple script", async () => {
    // Get a Netscript (NS) instance
    const ns = getNS();
    
    // Access the home server
    const home = Player.getHomeComputer();
    
    // Write a test script
    const scriptPath = "test.js" as ScriptFilePath;
    home.writeToScriptFile(scriptPath, `
      export async function main(ns) {
        ns.tprint("Hello from test!");
      }
    `);
    
    // Get the script and verify it exists
    const script = home.scripts.get(scriptPath);
    expect(script).toBeDefined();
    expect(script?.filename).toBe("test.js");
  });

  test("should use Netscript functions", () => {
    const ns = getNS();
    
    // Test Netscript functions
    const homeServer = ns.getServer(SpecialServers.Home);
    expect(homeServer.hostname).toBe("home");
    expect(homeServer.maxRam).toBeGreaterThan(0);
  });
});
```

### Simulating Scripts Over Time

Test how much money your hacking scripts generate:

```typescript
import {
  setupBasicTestingEnvironment,
  initGameEnvironment,
  fixDoImportIssue,
  Player,
  resetPidCounter,
  simulateScript,
  type ScriptFilePath,
} from "bitburner/headless";

fixDoImportIssue();
initGameEnvironment();

describe("Script Performance Tests", () => {
  beforeEach(() => {
    setupBasicTestingEnvironment();
    resetPidCounter();
  });

  test("should generate money over time", async () => {
    const server = Player.getHomeComputer();
    const scriptPath = "hack.js" as ScriptFilePath;
    
    // Write your hacking script
    server.writeToScriptFile(scriptPath, `
      export async function main(ns) {
        const target = ns.args[0] || "n00dles";
        await ns.hack(target);
      }
    `);
    
    // Simulate the script running for 60 seconds
    const result = await simulateScript(scriptPath, ["n00dles"], {
      maxTime: 60000,
    });
    
    expect(result.success).toBe(true);
    console.log(\`Money gained: $\${result.moneyGained}\`);
    console.log(\`Money per second: $\${result.moneyGained / (result.timeSimulated / 1000)}\`);
  });
});
```

### CLI Usage (When Installed)

After installing the package in your project, you can test scripts from the command line:

```bash
# Simple usage - simulate for 30 minutes
npx bitburner-src my-hack-script.js

# Simulate for custom time (in minutes)
npx bitburner-src my-hack-script.js --time 60
npx bitburner-src my-hack-script.js -t 60

# Pass arguments to your script
npx bitburner-src my-hack-script.js n00dles 10

# Upload multiple files to home server
npx bitburner-src main.js --files utils.js,config.txt,worker.js
npx bitburner-src main.js -f lib/helper.js,data.txt

# Quiet mode (minimal output)
npx bitburner-src my-hack-script.js -q

# Verbose mode (show script logs)
npx bitburner-src my-hack-script.js -v

# Get JSON output for parsing
npx bitburner-src my-hack-script.js --json > results.json
```

CLI Options:
- `-t, --time <minutes>` - Simulation time in minutes (default: 30)
- `-f, --files <list>` - Comma-separated list of files to upload to home
- `--json` - Output results as JSON
- `-q, --quiet` - Minimal output (only results)
- `-v, --verbose` - Show script logs
- `--help, -h` - Show help message
- `--version` - Show version information

**Multi-File Projects:**
The CLI automatically detects files referenced in your code (via `ns.exec()`, `ns.scp()`, etc.) and loads them. Use `--files` to manually specify additional files to upload to the home server, just like working with files in the actual game!

### Running Scripts in Tests

```typescript
import {
  getNS,
  setupBasicTestingEnvironment,
  initGameEnvironment,
  fixDoImportIssue,
  Player,
  startWorkerScript,
  workerScripts,
  RunningScript,
  resetPidCounter,
  type ScriptFilePath,
} from "bitburner/headless";

fixDoImportIssue();
initGameEnvironment();

describe("Script Execution Tests", () => {
  beforeEach(() => {
    setupBasicTestingEnvironment();
    resetPidCounter();
  });

  test("should run a script and get output", async () => {
    const server = Player.getHomeComputer();
    const scriptPath = "my-script.js" as ScriptFilePath;
    
    // Write the script
    server.writeToScriptFile(scriptPath, `
      export async function main(ns) {
        const server = ns.getServer("home");
        ns.print(server.hostname);
      }
    `);
    
    // Get the script
    const script = server.scripts.get(scriptPath);
    if (!script) throw new Error("Script not found");
    
    // Calculate RAM usage
    const ramUsage = script.getRamUsage(server.scripts);
    if (!ramUsage) throw new Error("Cannot calculate RAM usage");
    
    // Create a running script instance
    const runningScript = new RunningScript(script, ramUsage);
    
    // Start the worker script
    const pid = startWorkerScript(runningScript, server);
    expect(pid).toBeGreaterThan(0);
    
    // Get the worker script
    const workerScript = workerScripts.get(pid);
    expect(workerScript).toBeDefined();
    
    // Wait for the script to complete
    await new Promise<void>((resolve) => {
      workerScript!.atExit = new Map([["default", resolve]]);
    });
    
    // Check the logs
    expect(runningScript.logs).toContain("home");
  });
});
```

### Testing with Mocked Context

```typescript
import {
  getMockedNetscriptContext,
  type WorkerScript,
} from "bitburner/headless";

test("should use mocked context", () => {
  const logs: string[] = [];
  
  const ctx = getMockedNetscriptContext((func, txt) => {
    logs.push(`${func}: ${txt()}`);
  });
  
  // Use the mocked context in your tests
  expect(ctx.function).toBe("");
  expect(ctx.workerScript).toBeDefined();
});
```

## Available Exports

### Test Utilities
- `getNS()` - Get a Netscript instance for testing
- `setupBasicTestingEnvironment()` - Set up a clean testing environment
- `initGameEnvironment()` - Initialize the game environment (call once)
- `fixDoImportIssue()` - Fix module import issues (call once before tests)
- `getMockedNetscriptContext()` - Get a mocked Netscript context

### Core Classes
- `Player` - The player object
- `WorkerScript` - Worker script class
- `RunningScript` - Running script class
- `NetscriptFunctions` - Netscript function implementations

### Server Functions
- `GetServerOrThrow()` - Get a server by hostname (throws if not found)
- `GetServer()` - Get a server by hostname (returns null if not found)
- `SpecialServers` - Special server hostname constants

### Script Management
- `workerScripts` - Map of running worker scripts
- `startWorkerScript()` - Start a worker script
- `runScriptFromScript()` - Run a script from another script
- `resetPidCounter()` - Reset the PID counter

### Types
- All Netscript type definitions from `NetscriptDefinitions.d.ts`
- `ScriptFilePath` - Type for script file paths
- All enums from the game

## Testing Framework

This package is designed to work with Jest, but should be compatible with other testing frameworks. Make sure to configure your test environment appropriately.

### Jest Configuration Example

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^bitburner/headless$': '<rootDir>/node_modules/bitburner/headless/index.ts',
  },
};
```

## License

See LICENSE in the main repository.
