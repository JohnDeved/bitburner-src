# Bitburner Script Examples

Example scripts demonstrating the headless test environment.

## batch-hack.js

Advanced HWGW (Hack-Weaken-Grow-Weaken) batch hacking algorithm.

**Features:**
- Distributes work across multiple servers using `ns.exec()`
- Creates and deploys worker scripts automatically
- Tracks player level progression
- Identifies newly hackable servers
- Optimized for maximum money generation

**Usage:**
```bash
npx JohnDeved/bitburner-src test/examples/batch-hack.js --time 30
```

**Performance:**
- ~$19M earned in 30 minutes simulation
- Time to $1M: ~3 minutes
- Time to $1B: ~2 days
- Uses multiple servers for parallel execution
