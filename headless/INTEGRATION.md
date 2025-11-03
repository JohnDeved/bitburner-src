# Headless Test Environment Integration Example

This directory demonstrates how to use the Bitburner headless test environment in an external project.

## Setup

1. Install the package:
```bash
npm install --save-dev JohnDeved/bitburner-src
```

2. Create a test file (e.g., `my-script.test.ts`):
```typescript
import {
  getNS,
  setupBasicTestingEnvironment,
  initGameEnvironment,
  fixDoImportIssue,
  Player,
  type ScriptFilePath,
} from "bitburner/headless";

// Initialize once
fixDoImportIssue();
initGameEnvironment();

describe("My Script Tests", () => {
  beforeEach(() => {
    setupBasicTestingEnvironment();
  });

  test("my test", () => {
    const ns = getNS();
    // Your test code here
  });
});
```

3. Configure your `tsconfig.json` to include Bitburner types:
```json
{
  "compilerOptions": {
    "types": ["node", "jest"],
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

4. Run your tests:
```bash
npm test
```

## Example: Testing a Hacking Script

Here's a complete example of testing a simple hacking script:

```typescript
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
  type ScriptFilePath,
} from "bitburner/headless";

fixDoImportIssue();
initGameEnvironment();

describe("Hacking Script Tests", () => {
  beforeEach(() => {
    setupBasicTestingEnvironment();
    resetPidCounter();
  });

  test("should successfully hack a server", async () => {
    const ns = getNS();
    const targetServer = "n00dles";
    
    // Get server info
    const server = ns.getServer(targetServer);
    expect(server).toBeDefined();
    expect(server.hostname).toBe(targetServer);
    
    // Check if we can hack it
    const hackChance = ns.hackAnalyzeChance(targetServer);
    expect(hackChance).toBeGreaterThan(0);
  });

  test("should analyze grow/weaken effectiveness", () => {
    const ns = getNS();
    const target = "n00dles";
    
    // Analyze server
    const growthThreads = ns.growthAnalyze(target, 2);
    expect(growthThreads).toBeGreaterThan(0);
    
    const weakenAmount = ns.weakenAnalyze(1);
    expect(weakenAmount).toBeGreaterThan(0);
  });
});
```

## Example: Testing a Purchase Script

```typescript
test("should calculate server purchase costs", () => {
  const ns = getNS();
  
  // Check server purchase costs
  const cost8GB = ns.getPurchasedServerCost(8);
  const cost16GB = ns.getPurchasedServerCost(16);
  
  expect(cost16GB).toBeGreaterThan(cost8GB);
  expect(cost8GB).toBeGreaterThan(0);
});
```

## Tips

- Always call `fixDoImportIssue()` and `initGameEnvironment()` once before running tests
- Call `setupBasicTestingEnvironment()` in `beforeEach()` to get a clean state for each test
- Use `resetPidCounter()` if you're starting worker scripts to ensure consistent PIDs
- The test environment provides a basic game state with home server and some foreign servers
- You can write scripts to the home server using `Player.getHomeComputer().writeToScriptFile()`
