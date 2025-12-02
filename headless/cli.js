#!/usr/bin/env node

/**
 * Bitburner Headless CLI - Test your scripts and measure money generation
 * 
 * Usage: npx bitburner-src script.js [args...] [options]
 */

const path = require('path');
const fs = require('fs');

// Use ts-node to handle TypeScript files
try {
  // Try to use ts-node if available (for TypeScript support)
  require('ts-node/register/transpile-only');
} catch (e) {
  // ts-node not available, try a simpler approach
  // Register TypeScript extension handler
  require.extensions['.ts'] = function (module, filename) {
    const content = fs.readFileSync(filename, 'utf8');
    // Convert ES6 imports/exports to CommonJS
    let jsContent = content
      // Convert: export { a, b } from 'module'
      .replace(/export\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g, (match, exports, from) => {
        const items = exports.split(',').map(e => e.trim());
        return `const { ${items.join(', ')} } = require('${from}');\nmodule.exports = Object.assign(module.exports || {}, { ${items.join(', ')} });`;
      })
      // Convert: export { a, b }
      .replace(/export\s*\{([^}]+)\}/g, (match, exports) => {
        return `module.exports = Object.assign(module.exports || {}, { ${exports} });`;
      })
      // Convert: export type { ... } (remove)
      .replace(/export\s+type\s*\{[^}]+\}/g, '')
      // Convert: import { a, b } from 'module'
      .replace(/import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g, 'const { $1 } = require(\'$2\')')
      // Convert: import * as name from 'module'
      .replace(/import\s*\*\s*as\s+(\w+)\s+from\s*['"]([^'"]+)['"]/g, 'const $1 = require(\'$2\')')
      // Convert: import name from 'module'
      .replace(/import\s+(\w+)\s+from\s*['"]([^'"]+)['"]/g, 'const $1 = require(\'$2\')')
      // Remove type annotations
      .replace(/:\s*[A-Z]\w*(<[^>]+>)?(\[\])?/g, '')
      .replace(/as\s+[A-Z]\w*/g, '')
      // Convert: export function/class/const/let/var
      .replace(/export\s+(async\s+)?(function|class)\s+/g, '$1$2 ')
      .replace(/export\s+(const|let|var)\s+(\w+)/g, '$1 $2')
      // Add exports for declarations
      .replace(/((?:async\s+)?(?:function|class)\s+(\w+))/g, (match, decl, name) => {
        if (!decl.includes('export')) {
          return `${decl};\nif (typeof module !== 'undefined') module.exports.${name} = ${name};`;
        }
        return decl;
      });
    
    try {
      module._compile(jsContent, filename);
    } catch (compileError) {
      console.error(`Error compiling ${filename}:`, compileError.message);
      throw compileError;
    }
  };
}

// Parse arguments
const args = process.argv.slice(2);

// Help
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║           Bitburner Script Simulator                         ║
╚══════════════════════════════════════════════════════════════╝

Test Bitburner hacking scripts and measure money generation.

Usage:
  npx bitburner-src <script> [script-args...] [options]

Options:
  -t, --time <min>   Simulation time in minutes (default: 30)
  -f, --files <...>  Additional files to upload (comma-separated)
  --json             Output as JSON
  -q, --quiet        Minimal output
  -v, --verbose      Show script logs
  -h, --help         Show this help
  --version          Show version

Examples:
  npx bitburner-src hack.js
  npx bitburner-src hack.js n00dles -t 60
  npx bitburner-src main.js -f utils.js,config.txt
  npx bitburner-src hack.js --json

Note:
  The simulator runs your script for the specified time and measures
  money generation. Works with both completing scripts and infinite loops.
  Infinite-loop scripts will be terminated after the time limit.
`);
  process.exit(0);
}

// Version
if (args.includes('--version')) {
  const pkg = require('../package.json');
  console.log(`bitburner-src v${pkg.version}`);
  process.exit(0);
}

// Parse CLI args
let scriptPath = null;
const scriptArgs = [];
let timeMinutes = 30;
let additionalFiles = [];
let jsonOutput = false;
let quiet = false;
let verbose = false;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '-t' || arg === '--time') {
    timeMinutes = parseInt(args[++i], 10);
  } else if (arg === '-f' || arg === '--files') {
    additionalFiles = args[++i].split(',').map(f => f.trim());
  } else if (arg === '--json') {
    jsonOutput = true;
  } else if (arg === '-q' || arg === '--quiet') {
    quiet = true;
  } else if (arg === '-v' || arg === '--verbose') {
    verbose = true;
  } else if (!scriptPath && !arg.startsWith('-')) {
    scriptPath = arg;
  } else if (scriptPath && !arg.startsWith('-')) {
    scriptArgs.push(arg);
  }
}

// Validate
if (!scriptPath) {
  console.error('\n❌ Please provide a script file\n');
  console.error('Example: npx bitburner-src hack.js\n');
  console.error('Run with --help for more information\n');
  process.exit(1);
}

if (!fs.existsSync(scriptPath)) {
  console.error(`\n❌ Script not found: ${scriptPath}\n`);
  process.exit(1);
}

if (isNaN(timeMinutes) || timeMinutes <= 0) {
  console.error('\n❌ Time must be a positive number\n');
  process.exit(1);
}

// Run simulation using headless module
(async () => {
  try {
    // Use headless module exports (works standalone)
    const {
      setupHackingTestEnvironment,
      getNS,
      simulateScript,
      initGameEnvironment,
      fixDoImportIssue,
    } = require('./index');
    
    // Initialize game environment
    fixDoImportIssue();
    initGameEnvironment();
    
    // Setup environment
    setupHackingTestEnvironment();
    const ns = getNS();
    
    // Load script
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    const scriptName = path.basename(scriptPath);
    await ns.write(scriptName, scriptContent, 'w');
    
    // Load additional files
    for (const file of additionalFiles) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        await ns.write(path.basename(file), content, 'w');
      }
    }
    
    // Output header
    if (!quiet && !jsonOutput) {
      console.log('\n╔══════════════════════════════════════════════════════════════╗');
      console.log('║           Bitburner Script Simulator                         ║');
      console.log('╚══════════════════════════════════════════════════════════════╝\n');
      console.log(`📄 Script: ${scriptName}`);
      console.log(`⏱️  Time: ${timeMinutes} minutes`);
      console.log(`💰 Starting money: $${ns.getPlayer().money.toLocaleString()}\n`);
      console.log('⚡ Simulating...\n');
    }
    
    // Run simulation
    const result = await simulateScript(scriptName, scriptArgs, {
      maxTime: timeMinutes * 60 * 1000,
      fastMode: true,
    });
    
    // Output results
    if (jsonOutput) {
      console.log(JSON.stringify(result, null, 2));
    } else if (quiet) {
      console.log(`$${result.moneyGained.toLocaleString()}`);
    } else {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('                          RESULTS');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      console.log(`${result.success ? '✅' : '❌'} Status: ${result.success ? 'Success' : 'Failed'}`);
      if (result.error) {
        console.log(`❌ Error: ${result.error}`);
      }
      console.log(`💵 Money Earned: $${result.moneyGained.toLocaleString()}`);
      console.log(`🔄 Script Runs: ${result.completions}`);
      
      // Calculate rates
      const timeSeconds = result.timeSimulated / 1000;
      const perSecond = result.moneyGained / timeSeconds;
      const perHour = perSecond * 3600;
      const perDay = perHour * 24;
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('                    EARNING RATES');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      console.log(`⏱️  Per Second: $${Math.round(perSecond).toLocaleString()}`);
      console.log(`⏱️  Per Hour:   $${Math.round(perHour).toLocaleString()}`);
      console.log(`⏱️  Per Day:    $${Math.round(perDay).toLocaleString()}`);
      
      // Projections
      if (perSecond > 0) {
        const toMillion = (1000000 - result.moneyGained) / perSecond / 60;
        const toBillion = (1000000000 - result.moneyGained) / perSecond / 60 / 60 / 24;
        
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('                      PROJECTIONS');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        if (toMillion > 0) {
          console.log(`🎯 Time to $1 Million:  ${toMillion.toFixed(1)} min`);
        }
        if (toBillion > 0) {
          console.log(`🎯 Time to $1 Billion: ${toBillion.toFixed(1)} days`);
        }
      }
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      // Show logs if verbose
      if (verbose && result.logs && result.logs.length > 0) {
        console.log('📋 Script Logs:');
        result.logs.slice(-10).forEach(log => console.log(`   ${log}`));
        console.log();
      }
      
      console.log('✨ Done!\n');
    }
    
    process.exit(result.success ? 0 : 1);
    
  } catch (error) {
    if (!jsonOutput) {
      console.error(`\n❌ Error: ${error.message}\n`);
      if (verbose) {
        console.error(error.stack);
      }
    } else {
      console.log(JSON.stringify({ success: false, error: error.message }, null, 2));
    }
    process.exit(1);
  }
})();
