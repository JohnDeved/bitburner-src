# Bitburner Headless Test Environment

Test Bitburner scripts in Node.js without running the full game. Measure money generation and validate your hacking algorithms.

**⚡ Optimized**: ~5-10MB install (95% smaller than full package)

## Quick Start

```bash
# Install
npm install --save-dev JohnDeved/bitburner-src

# Test a script
npx bitburner-src hack.js

# Simulate for 60 minutes
npx bitburner-src hack.js -t 60

# With arguments
npx bitburner-src hack.js n00dles -t 30
```

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
