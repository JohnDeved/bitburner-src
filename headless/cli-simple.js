#!/usr/bin/env node

/**
 * Bitburner Script Simulator - Simple and User Friendly
 * Run your Bitburner scripts and see how much money they make!
 */

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);

// Help
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║           Bitburner Script Simulator                         ║
╚══════════════════════════════════════════════════════════════╝

Test your Bitburner hacking scripts and see how much money they make!

Usage:
  npx JohnDeved/bitburner-src <script.js> [script-args...] [options]

Options:
  -t, --time <minutes>   How long to simulate (default: 30 minutes)
  -f, --files <list>     Comma-separated list of files to upload to home
  --json                 Output as JSON
  -q, --quiet            Minimal output (only results)
  -v, --verbose          Show script logs
  
Script Arguments:
  Any arguments before options are passed to your script
  
File Loading:
  - Automatically detects files referenced in your script
  - Use --files to manually specify additional files to upload
  - All files are uploaded to the home server before simulation
  
Examples:
  # Simple usage
  npx JohnDeved/bitburner-src hack.js
  
  # Simulate for 60 minutes
  npx JohnDeved/bitburner-src hack.js --time 60
  npx JohnDeved/bitburner-src hack.js -t 60
  
  # Upload multiple files to home server
  npx JohnDeved/bitburner-src main.js --files utils.js,config.txt
  npx JohnDeved/bitburner-src main.js -f lib/helper.js,data.txt
  
  # Pass arguments to your script
  npx JohnDeved/bitburner-src hack.js n00dles 10
  npx JohnDeved/bitburner-src hack.js foodnstuff --time 30
  
  # JSON output for parsing
  npx JohnDeved/bitburner-src hack.js --json

More info: https://github.com/JohnDeved/bitburner-src
`);
  process.exit(0);
}

// Version
if (args.includes('--version') || args.includes('-v') && !args.includes('--verbose')) {
  const pkg = require('../package.json');
  console.log(`v${pkg.version}`);
  process.exit(0);
}

// Parse arguments - separate script args from CLI options
const cliOptions = ['--time', '-t', '--files', '-f', '--json', '--quiet', '-q', '--verbose', '-v'];
let scriptPath = null;
const scriptArgs = [];
let i = 0;

// Find script path and collect script arguments
while (i < args.length) {
  const arg = args[i];
  
  if (cliOptions.includes(arg)) {
    // Skip CLI option and its value if applicable
    if (arg === '--time' || arg === '-t' || arg === '--files' || arg === '-f') {
      i += 2; // Skip option and value
    } else {
      i += 1; // Skip flag
    }
  } else if (!scriptPath) {
    // First non-option arg is the script path
    scriptPath = arg;
    i += 1;
  } else {
    // Subsequent non-option args are script arguments
    scriptArgs.push(arg);
    i += 1;
  }
}

if (!scriptPath) {
  console.error('\n❌ Please provide a script file\n');
  console.error('Example: npx JohnDeved/bitburner-src hack.js\n');
  console.error('Run with --help for more information\n');
  process.exit(1);
}

if (!fs.existsSync(scriptPath)) {
  console.error(`\n❌ Cannot find: ${scriptPath}\n`);
  console.error('Make sure the file exists and the path is correct.\n');
  process.exit(1);
}

// Parse options
const getOpt = (shortFlag, longFlag) => {
  const shortIdx = args.indexOf(shortFlag);
  const longIdx = args.indexOf(longFlag);
  const idx = shortIdx !== -1 ? shortIdx : longIdx;
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
};

const timeStr = getOpt('-t', '--time');
const mins = timeStr ? parseFloat(timeStr) : 30;
if (isNaN(mins) || mins <= 0) {
  console.error(`\n❌ Invalid time value: ${timeStr}\n`);
  console.error('Time must be a positive number (in minutes)\n');
  process.exit(1);
}

const ms = mins * 60 * 1000;
const json = args.includes('--json');
const quiet = args.includes('--quiet') || args.includes('-q');
const verbose = args.includes('--verbose') || args.includes('-v') && !args.includes('--version');

const filesStr = getOpt('-f', '--files');
const additionalFiles = filesStr ? filesStr.split(',').map(f => f.trim()).filter(f => f) : [];

const content = fs.readFileSync(scriptPath, 'utf-8');
const name = path.basename(scriptPath);
const scriptDir = path.dirname(path.resolve(scriptPath));

// Find and load relative file dependencies
function findRelativeFiles(content, baseDir) {
  const files = [];
  // Match common patterns: exec("file.js"), write("file.js"), read("file.txt"), etc.
  // Also match: ns.exec("file.js"), ns.write("file.txt"), etc.
  const patterns = [
    /(?:ns\.)?(?:exec|scp|write|read|run|spawn)\s*\(\s*["']([^"']+\.(?:js|ns|txt|script))/gi,
    /["']([^"']+\.(?:js|ns|txt|script))["']/gi
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const filePath = match[1];
      // Only process relative paths (no absolute paths, no server:path patterns)
      if (!filePath.startsWith('/') && !filePath.includes(':')) {
        files.push(filePath);
      }
    }
  }
  
  // Deduplicate and load files
  const loaded = new Map();
  for (const relPath of [...new Set(files)]) {
    const fullPath = path.join(baseDir, relPath);
    if (fs.existsSync(fullPath)) {
      const fileContent = fs.readFileSync(fullPath, 'utf-8');
      loaded.set(relPath, fileContent);
      // Recursively find dependencies in this file
      const nestedFiles = findRelativeFiles(fileContent, path.dirname(fullPath));
      for (const [npath, ncontent] of nestedFiles) {
        if (!loaded.has(npath)) {
          loaded.set(npath, ncontent);
        }
      }
    }
  }
  
  return loaded;
}

const relativeFiles = findRelativeFiles(content, scriptDir);

// Add manually specified files
for (const filePath of additionalFiles) {
  // Try both relative to current directory and relative to script directory
  let fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    fullPath = path.resolve(scriptDir, filePath);
  }
  
  if (!fs.existsSync(fullPath)) {
    console.error(`\n❌ Cannot find file: ${filePath}\n`);
    console.error(`Tried:\n  ${path.resolve(filePath)}\n  ${path.resolve(scriptDir, filePath)}\n`);
    process.exit(1);
  }
  
  const fileContent = fs.readFileSync(fullPath, 'utf-8');
  // Use basename for the key to match how files appear on home server
  const fileName = path.basename(filePath);
  relativeFiles.set(fileName, fileContent);
}

const tempDir = path.join(__dirname, '..', 'test', 'jest', '.cli-temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const testFile = path.join(tempDir, 'run.test.ts');

fs.writeFileSync(testFile, `
import { setupHackingTestEnvironment, initGameEnvironment, fixDoImportIssue, Player, resetPidCounter, simulateScript } from "../../../headless/index";
fixDoImportIssue();
initGameEnvironment();
describe("Sim", () => {
  beforeEach(() => { setupHackingTestEnvironment(); resetPidCounter(); });
  test("run", async () => {
    const s = Player.getHomeComputer();
    
    // Upload main script
    s.writeToScriptFile("${name}" as any, ${JSON.stringify(content)});
    
    // Upload relative file dependencies
    ${Array.from(relativeFiles.entries()).map(([relPath, fileContent]) => 
      `s.writeToScriptFile(${JSON.stringify(relPath)} as any, ${JSON.stringify(fileContent)});`
    ).join('\n    ')}
    const json = ${json};
    const quiet = ${quiet};
    const verbose = ${verbose};
    const scriptArgs = ${JSON.stringify(scriptArgs)};
    
    if (!json && !quiet) {
      console.log('\\n╔══════════════════════════════════════════════════════════════╗');
      console.log('║           Bitburner Script Simulator                         ║');
      console.log('╚══════════════════════════════════════════════════════════════╝\\n');
      console.log(\`📄 Script: ${name}\`);
      if (scriptArgs.length > 0) {
        console.log(\`📋 Args: \${scriptArgs.join(', ')}\`);
      }
      ${relativeFiles.size > 0 ? `console.log(\`📦 Dependencies: ${relativeFiles.size} file(s) loaded\`);` : ''}
      console.log(\`⏱️  Time: ${mins} minutes\`);
      console.log(\`💰 Starting: $\${Player.money.toLocaleString()}\`);
      console.log(\`\\n⚡ Simulating...\\n\`);
    }
    
    const r = await simulateScript("${name}" as any, scriptArgs, { maxTime: ${ms} });
    
    if (json) {
      console.log(JSON.stringify({ 
        success: r.success, 
        earned: r.moneyGained, 
        time: r.timeSimulated/1000, 
        runs: r.completions, 
        perSec: r.timeSimulated > 0 ? (r.moneyGained / r.timeSimulated) * 1000 : 0,
        logs: verbose ? r.logs : undefined
      }, null, 2));
    } else {
      if (!r.success) {
        console.log('❌ Failed');
        if (r.error) console.log(\`Error: \${r.error}\`);
        if (r.logs.length > 0) {
          console.log('\\nScript output:');
          r.logs.slice(-5).forEach(log => console.log(\`  \${log}\`));
        }
        console.log('');
      } else {
        if (!quiet) {
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('                          RESULTS                              ');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n');
        }
        console.log(\`✅ Status: Success\`);
        console.log(\`💵 Earned: $\${r.moneyGained.toLocaleString()}\`);
        console.log(\`🔄 Runs: \${r.completions.toLocaleString()}\`);
        if (r.moneyGained > 0) {
          const ps = (r.moneyGained / r.timeSimulated) * 1000;
          const ph = ps * 3600;
          const pd = ph * 24;
          if (!quiet) {
            console.log(\`\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\`);
            console.log(\`                    EARNING RATES                             \`);
            console.log(\`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n\`);
          }
          console.log(\`⏱️  Per Second: $\${ps.toLocaleString(undefined, {maximumFractionDigits: 2})}\`);
          console.log(\`⏱️  Per Hour:   $\${ph.toLocaleString(undefined, {maximumFractionDigits: 2})}\`);
          if (!quiet) {
            console.log(\`⏱️  Per Day:    $\${pd.toLocaleString(undefined, {maximumFractionDigits: 2})}\`);
            const tm = ps > 0 ? 1000000 / ps : Infinity;
            const tb = ps > 0 ? 1000000000 / ps : Infinity;
            console.log(\`\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\`);
            console.log(\`                      PROJECTIONS                             \`);
            console.log(\`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n\`);
            if (tm < 3600) console.log(\`🎯 $1 Million:  \${(tm / 60).toFixed(1)} min\`);
            else if (tm < 86400) console.log(\`🎯 $1 Million:  \${(tm / 3600).toFixed(1)} hrs\`);
            else console.log(\`🎯 $1 Million:  \${(tm / 86400).toFixed(1)} days\`);
            if (tb < 86400) console.log(\`🎯 $1 Billion: \${(tb / 3600).toFixed(1)} hrs\`);
            else console.log(\`🎯 $1 Billion: \${(tb / 86400).toFixed(1)} days\`);
          }
        } else {
          console.log(\`\\n⚠️  No money earned.\`);
        }
        if (verbose && r.logs.length > 0) {
          console.log(\`\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\`);
          console.log(\`                      SCRIPT LOGS                              \`);
          console.log(\`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n\`);
          r.logs.slice(-20).forEach(log => console.log(\`  \${log}\`));
        }
        if (!quiet) {
          console.log(\`\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n\`);
          console.log(\`✨ Done!\\n\`);
        }
      }
    }
    expect(r.success).toBe(true);
  }, 120000);
});
`);

const res = spawnSync('npx', ['jest', testFile, '--testTimeout=120000'], {
  stdio: 'inherit',
  cwd: path.join(__dirname, '..'),
  shell: true
});

try { fs.unlinkSync(testFile); } catch(e) {}
process.exit(res.status || 0);
