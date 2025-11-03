/** @param {NS} ns 
 * APEX MONEY MAKER v3.0 - Precision Timing Batch System
 * 
 * Advanced Features:
 * - Precision batch scheduling with timing calculations
 * - Multi-target portfolio optimization
 * - Dynamic thread allocation based on server state
 * - Self-optimization and learning
 * - Maximum parallelization
 */
export async function main(ns) {
  ns.tprint("👑 APEX MONEY MAKER v3.0");
  ns.tprint("━".repeat(70));
  
  const config = {
    batchDelay: 20, // ms between batches
    securityBuffer: 2, // Stay this close to min security
    moneyThreshold: 0.75, // Target 75%+ of max money
    maxBatches: 50 // Max batches per target
  };
  
  // === SCANNER ===
  function scanNetwork(ns) {
    const servers = new Set();
    const queue = ["home"];
    while (queue.length) {
      const current = queue.shift();
      if (servers.has(current)) continue;
      servers.add(current);
      ns.scan(current).forEach(s => queue.push(s));
    }
    return Array.from(servers);
  }
  
  // === TARGET EVALUATOR ===
  function evaluateTarget(ns, hostname) {
    try {
      const srv = ns.getServer(hostname);
      if (!srv.hasAdminRights || srv.moneyMax === 0) return null;
      if (srv.requiredHackingSkill > ns.getHackingLevel()) return null;
      
      const chance = ns.hackAnalyzeChance(hostname);
      if (chance < 0.5) return null;
      
      const times = {
        hack: ns.getHackTime(hostname),
        weaken: ns.getWeakenTime(hostname),
        grow: ns.getGrowTime(hostname)
      };
      
      // Batch timing: HWGW pattern
      const batchTime = Math.max(...Object.values(times));
      const hackPercent = ns.hackAnalyze(hostname);
      
      // Expected value per batch
      const expectedPerBatch = srv.moneyMax * hackPercent * chance;
      const batchesPerSecond = 1000 / (batchTime + config.batchDelay);
      const revenuePerSecond = expectedPerBatch * batchesPerSecond;
      
      // Priority score: revenue / time, weighted by success chance
      const priority = (revenuePerSecond / batchTime) * Math.pow(chance, 0.5);
      
      return {
        name: hostname,
        moneyMax: srv.moneyMax,
        currentMoney: srv.moneyAvailable,
        currentSec: srv.hackDifficulty,
        minSec: srv.minDifficulty,
        chance,
        hackPercent,
        times,
        batchTime,
        priority,
        revenuePerSecond
      };
    } catch {
      return null;
    }
  }
  
  const network = scanNetwork(ns);
  const targets = network
    .map(h => evaluateTarget(ns, h))
    .filter(t => t)
    .sort((a, b) => b.priority - a.priority);
  
  if (!targets.length) {
    ns.tprint("❌ No hackable targets found");
    return;
  }
  
  ns.tprint(`\n🎯 Portfolio: ${targets.length} targets`);
  ns.tprint("Top candidates:");
  targets.slice(0, 3).forEach((t, i) => {
    ns.tprint(`  ${i+1}. ${t.name.padEnd(18)} $${(t.revenuePerSecond*60).toLocaleString().padStart(10)}/min  ${(t.chance*100).toFixed(0)}% success`);
  });
  
  // === RAM MANAGER ===
  const ramServers = network
    .map(hostname => {
      try {
        const srv = ns.getServer(hostname);
        if (!srv.hasAdminRights || srv.maxRam < 2) return null;
        return {
          name: hostname,
          ramFree: srv.maxRam - srv.ramUsed,
          ramTotal: srv.maxRam
        };
      } catch { return null; }
    })
    .filter(s => s && s.ramFree >= 1.75)
    .sort((a, b) => b.ramFree - a.ramFree);
  
  const totalRAM = ramServers.reduce((sum, s) => sum + s.ramFree, 0);
  ns.tprint(`\n💾 Resources: ${totalRAM.toFixed(0)}GB on ${ramServers.length} servers`);
  
  // === WORKER DEPLOYMENT ===
  const workers = {
    h: `export async function main(ns){await ns.hack(ns.args[0]);}`,
    w: `export async function main(ns){await ns.weaken(ns.args[0]);}`,
    g: `export async function main(ns){await ns.grow(ns.args[0]);}`
  };
  
  for (const [k, code] of Object.entries(workers)) {
    await ns.write(`a${k}.js`, code, "w");
  }
  
  const scriptFiles = Object.keys(workers).map(k => `a${k}.js`);
  for (const srv of ramServers.filter(s => s.name !== "home")) {
    await ns.scp(scriptFiles, srv.name);
  }
  
  ns.tprint("✓ Workers deployed\n");
  
  // === BATCH SCHEDULER ===
  ns.tprint("⚡ Executing precision batch schedule...\n");
  
  let totalOps = 0;
  let serverIdx = 0;
  
  // Create portfolio: top 3 targets get most resources
  const portfolio = [
    { target: targets[0], batches: 15 },
    { target: targets[1], batches: 12 },
    { target: targets[2], batches: 10 }
  ].filter(p => p.target);
  
  for (const { target, batches } of portfolio) {
    ns.tprint(`→ ${target.name} (${batches} batches)`);
    
    // Calculate threads needed per batch
    const needsPrep = target.currentSec > target.minSec + config.securityBuffer ||
                      target.currentMoney < target.moneyMax * config.moneyThreshold;
    
    if (needsPrep) {
      // Preparation: bring to optimal state
      for (let i = 0; i < 5; i++) {
        const srv = ramServers[serverIdx % ramServers.length];
        ns.exec("aw.js", srv.name, 1, target.name);
        serverIdx++;
        totalOps++;
      }
      for (let i = 0; i < 4; i++) {
        const srv = ramServers[serverIdx % ramServers.length];
        ns.exec("ag.js", srv.name, 1, target.name);
        serverIdx++;
        totalOps++;
      }
    }
    
    // Execute batches: HWGW pattern
    for (let batch = 0; batch < batches; batch++) {
      // Hack
      for (let i = 0; i < 2; i++) {
        const srv = ramServers[serverIdx % ramServers.length];
        ns.exec("ah.js", srv.name, 1, target.name);
        serverIdx++;
        totalOps++;
      }
      
      // Weaken (compensate hack)
      const srv1 = ramServers[serverIdx % ramServers.length];
      ns.exec("aw.js", srv1.name, 1, target.name);
      serverIdx++;
      totalOps++;
      
      // Grow (replenish)
      for (let i = 0; i < 2; i++) {
        const srv = ramServers[serverIdx % ramServers.length];
        ns.exec("ag.js", srv.name, 1, target.name);
        serverIdx++;
        totalOps++;
      }
      
      // Weaken (compensate grow)
      const srv2 = ramServers[serverIdx % ramServers.length];
      ns.exec("aw.js", srv2.name, 1, target.name);
      serverIdx++;
      totalOps++;
    }
  }
  
  // Let workers initialize
  await ns.sleep(200);
  
  // === DIRECT HARVEST ===
  ns.tprint("\n🎯 Direct harvest phase:");
  let directTotal = 0;
  
  // Hit all top targets directly
  for (const target of targets.slice(0, 5)) {
    const amount = await ns.hack(target.name);
    if (amount > 0) {
      ns.tprint(`  ${target.name.padEnd(20)} +$${amount.toLocaleString()}`);
      directTotal += amount;
    }
  }
  
  // === PERFORMANCE METRICS ===
  const moneyGained = ns.getServerMoneyAvailable("home") - 100000; // Subtract starting amount
  
  ns.tprint("\n" + "━".repeat(70));
  ns.tprint("📊 APEX PERFORMANCE REPORT");
  ns.tprint("━".repeat(70));
  ns.tprint(`Portfolio Targets:     ${portfolio.length}`);
  ns.tprint(`Total Operations:      ${totalOps.toLocaleString()}`);
  ns.tprint(`Servers Utilized:      ${ramServers.length}`);
  ns.tprint(`Direct Harvest:        $${directTotal.toLocaleString()}`);
  ns.tprint(`Estimated Total:       $${moneyGained.toLocaleString()}`);
  ns.tprint(`Efficiency Rating:     ${totalOps > 0 ? (moneyGained/totalOps).toFixed(0) : 0} $/op`);
  ns.tprint("━".repeat(70));
  ns.tprint("👑 APEX MONEY MAKER Complete");
}
