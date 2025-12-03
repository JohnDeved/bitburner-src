# Bitburner Headless Test Environment

Test Bitburner scripts in Node.js without running the full game. Measure money generation and validate your hacking algorithms with **fast simulation** - 30 simulated minutes complete in ~20 seconds of real time.

**⚡ Optimized**: ~5-10MB install (95% smaller than full package)  
**🚀 Fast Simulation**: 30 game minutes in ~20 real seconds  
**🔄 Works with infinite loops**: Automatically handles scripts designed to run forever

## Quick Start

```bash
# Install
npm install --save-dev JohnDeved/bitburner-src

# Test a script (default: 30 simulated minutes)
npx bitburner-src hack.js

# Simulate for 60 game minutes (completes in ~40 real seconds)
npx bitburner-src hack.js -t 60

# For scripts needing longer runtime
npx bitburner-src hack.js -t 180  # 3 simulated hours

# With arguments
npx bitburner-src hack.js n00dles -t 30
```

## How It Works

The simulator runs your script at **accelerated speed** - game time progresses much faster than real time. The `-t` option specifies **simulated game minutes**, not real-time seconds.

**Fast Simulation**: Scripts execute as quickly as possible while maintaining accurate timing calculations for hack/grow/weaken operations. No estimation - all logic runs properly.

Works with:

- ✅ **Scripts that complete** - Runs and measures normally
- ✅ **Infinite loop scripts** - Runs for the time limit, then stops and reports earnings
- ✅ **Scripts with dependencies** - Automatically loads referenced files
- ✅ **Long-running scripts** - Scripts taking 30+ minutes in vanilla game can be tested quickly

No script modification needed! Your infinite-loop scripts work as-is.

## CLI Options

```bash
-t, --time <min>   Simulation time in minutes (default: 30)
-f, --files <...>  Additional files to upload (comma-separated)
--json             Output as JSON
-q, --quiet        Minimal output
-v, --verbose      Show script logs
```

## Jest Integration

```typescript
import { setupHackingTestEnvironment, getNS, simulateScript } from "bitburner/headless";

test("hack script generates money", async () => {
  setupHackingTestEnvironment(); // Hacking 100, $100K, 64GB RAM
  const ns = getNS();
  
  await ns.write("hack.js", `
    export async function main(ns) {
      await ns.hack(ns.args[0] || "n00dles");
    }
  `, "w");
  
  const result = await simulateScript("hack.js", ["n00dles"], {
    maxTime: 60000 // 1 minute
  });
  
  expect(result.success).toBe(true);
  console.log(`Earned: $${result.moneyGained.toLocaleString()}`);
});
```

## API Reference

Core functions:
- `setupHackingTestEnvironment()` - Ready-to-hack environment
- `getNS()` - Get Netscript instance
- `simulateScript(script, args, options)` - Run and measure

See `headless/index.ts` for complete API.

## TypeScript Support

Both `.js` and `.ts` files are supported. TypeScript files are processed automatically:

```typescript
export async function main(ns: NS) {
  const target = ns.args[0] as string || "n00dles";
  await ns.hack(target);
}
```

**Note**: Complex TypeScript patterns may cause RAM calculation errors. If this happens, simplify type annotations or use JavaScript.

## Examples

See `test/examples/` for working examples:
- `basic-hack.js` - Simple hacking loop
- `advanced-batch.js` - HWGW batching with multi-server deployment
