
const fs = require('fs');
const path = require('path');
const { setupHackingTestEnvironment, getNS } = require('../jest/Utilities');
const { simulateScript } = require('../../headless/simulation');

test('CLI simulation', async () => {
  setupHackingTestEnvironment();
  const ns = getNS();
  
  // Load script
  const scriptPath = "/tmp/test-hack.js";
  const scriptContent = fs.readFileSync(scriptPath, 'utf8');
  const scriptName = path.basename(scriptPath);
  await ns.write(scriptName, scriptContent, 'w');
  
  // Load additional files
  const additionalFiles = [];
  for (const file of additionalFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      await ns.write(path.basename(file), content, 'w');
    }
  }
  
  const quiet = true;
  const jsonOutput = false;
  const timeMinutes = 1;
  const verbose = false;
  
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
  const result = await simulateScript(scriptName, [], {
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
  
  // Cleanup temp test file
  try {
    fs.unlinkSync("/home/runner/work/bitburner-src/bitburner-src/test/.cli-tmp/cli-test-1764723506246.test.js");
  } catch (e) {
    // Ignore cleanup errors
  }
  
  expect(result.success).toBe(true);
}, 600000); // 10 minute timeout
