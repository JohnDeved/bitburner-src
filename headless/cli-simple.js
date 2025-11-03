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
  npx JohnDeved/bitburner-src <your-script.js>
  npx JohnDeved/bitburner-src <your-script.js> --time 60

Options:
  --time <minutes>       How long to simulate (default: 30 minutes)
  --json                 Output as JSON
  
Examples:
  npx JohnDeved/bitburner-src hack.js
  npx JohnDeved/bitburner-src hack.js --time 60

More info: https://github.com/JohnDeved/bitburner-src
`);
  process.exit(0);
}

// Version
if (args.includes('--version') || args.includes('-v')) {
  const pkg = require('../package.json');
  console.log(`v${pkg.version}`);
  process.exit(0);
}

// Get script
const scriptPath = args.find(arg => !arg.startsWith('--'));
if (!scriptPath) {
  console.error('\n❌ Please provide a script file\n');
  console.error('Example: npx JohnDeved/bitburner-src hack.js\n');
  process.exit(1);
}

if (!fs.existsSync(scriptPath)) {
  console.error(`\n❌ Cannot find: ${scriptPath}\n`);
  process.exit(1);
}

// Options
const getOpt = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
};

const mins = parseFloat(getOpt('--time')) || 30;
const ms = mins * 60 * 1000;
const json = args.includes('--json');

const content = fs.readFileSync(scriptPath, 'utf-8');
const name = path.basename(scriptPath);

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
    s.writeToScriptFile("${name}" as any, ${JSON.stringify(content)});
    const json = ${json};
    if (!json) {
      console.log('\\n╔══════════════════════════════════════════════════════════════╗');
      console.log('║           Bitburner Script Simulator                         ║');
      console.log('╚══════════════════════════════════════════════════════════════╝\\n');
      console.log(\`📄 Script: ${name}\`);
      console.log(\`⏱️  Time: ${mins} minutes\`);
      console.log(\`💰 Starting: $\${Player.money.toLocaleString()}\`);
      console.log(\`\\n⚡ Simulating...\\n\`);
    }
    const r = await simulateScript("${name}" as any, [], { maxTime: ${ms} });
    if (json) {
      console.log(JSON.stringify({ success: r.success, earned: r.moneyGained, time: r.timeSimulated/1000, runs: r.completions, perSec: r.timeSimulated > 0 ? (r.moneyGained / r.timeSimulated) * 1000 : 0 }, null, 2));
    } else {
      if (!r.success) {
        console.log('❌ Failed');
        if (r.error) console.log(\`Error: \${r.error}\`);
        console.log('');
      } else {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('                          RESULTS                              ');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n');
        console.log(\`✅ Status: Success\`);
        console.log(\`💵 Earned: $\${r.moneyGained.toLocaleString()}\`);
        console.log(\`🔄 Runs: \${r.completions.toLocaleString()}\`);
        if (r.moneyGained > 0) {
          const ps = (r.moneyGained / r.timeSimulated) * 1000;
          const ph = ps * 3600;
          const pd = ph * 24;
          console.log(\`\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\`);
          console.log(\`                    EARNING RATES                             \`);
          console.log(\`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n\`);
          console.log(\`⏱️  Per Second: $\${ps.toLocaleString(undefined, {maximumFractionDigits: 2})}\`);
          console.log(\`⏱️  Per Hour:   $\${ph.toLocaleString(undefined, {maximumFractionDigits: 2})}\`);
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
        } else {
          console.log(\`\\n⚠️  No money earned.\`);
        }
        console.log(\`\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n\`);
        console.log(\`✨ Done!\\n\`);
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
