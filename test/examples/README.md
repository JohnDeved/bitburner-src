# Bitburner Script Examples

Example scripts demonstrating the headless test environment.

## Automatic Dependency Loading

The CLI automatically detects and loads relative files referenced by your scripts (e.g., worker scripts for `ns.exec()`). This includes files referenced with patterns like:
- `ns.exec("worker.js", ...)`
- `ns.scp("helper.js", ...)`  
- `ns.write("data.txt", ...)`
- `ns.read("config.txt")`

All referenced files are automatically uploaded to the home server before simulation starts.

## controller.js + worker.js

Demonstrates automatic dependency loading. The controller script references `worker.js`, which is automatically detected and loaded.

**Usage:**
```bash
npx JohnDeved/bitburner-src test/examples/controller.js --time 5
```

The CLI will show: `📦 Dependencies: 1 file(s) loaded`

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
