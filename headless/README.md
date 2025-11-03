# Bitburner Headless Test Environment

Test Bitburner scripts in Node.js without running the full game.

## Installation

```bash
npm install --save-dev JohnDeved/bitburner-src
```

## CLI Usage

```bash
# Simple - simulate 30 minutes
npx bitburner-src script.js

# Custom time (minutes)
npx bitburner-src script.js -t 60

# Pass script arguments
npx bitburner-src script.js n00dles 10

# Upload multiple files
npx bitburner-src main.js -f utils.js,config.txt

# Other modes
npx bitburner-src script.js -q     # Quiet
npx bitburner-src script.js -v     # Verbose
npx bitburner-src script.js --json # JSON output
```

## Testing with Jest

```typescript
import { getNS, setupHackingTestEnvironment, simulateScript } from "bitburner/headless";

describe("My Script", () => {
  beforeEach(() => {
    setupHackingTestEnvironment(); // Player with hacking 100, $100K
  });

  test("generates money", async () => {
    const ns = getNS();
    const home = ns.getServer("home");
    
    // Write and run your script
    await ns.write("hack.js", `
      export async function main(ns) {
        await ns.hack(ns.args[0] || "n00dles");
      }
    `, "w");
    
    const result = await simulateScript("hack.js", ["n00dles"], {
      maxTime: 60000 // 60 seconds
    });
    
    expect(result.success).toBe(true);
    console.log(`Earned: $${result.moneyGained}`);
  });
});
```

## Available Functions

- `getNS()` - Get Netscript instance
- `setupBasicTestingEnvironment()` - Clean environment
- `setupHackingTestEnvironment()` - Pre-configured player (hacking 100, $100K, 64GB RAM)
- `simulateScript(script, args, options)` - Run script and track money generation
- `initGameEnvironment()` - Initialize game (call once)
- `fixDoImportIssue()` - Fix imports (call once)

See examples in `test/examples/`.
