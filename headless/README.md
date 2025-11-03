# Bitburner Headless Test Environment

A headless test environment for Bitburner TypeScript scripts. This package allows you to test your Bitburner scripts in a Node.js environment without running the full game.

## Installation

```bash
npm install --save-dev JohnDeved/bitburner-src
```

## Usage

### Basic Test Setup

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
