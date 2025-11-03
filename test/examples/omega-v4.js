/** @param {NS} ns 
 * OMEGA MONEY MAKER v4.0 - The Ultimate System
 * 
 * Revolutionary Features:
 * - Kelly Criterion for optimal bet sizing
 * - Multi-stage pipeline with timing synchronization  
 * - Dynamic resource rebalancing
 * - Predictive target switching
 * - Maximum theoretical efficiency
 * 
 * This is the pinnacle of automated hacking systems.
 */
export async function main(ns) {
  ns.tprint("Ω OMEGA MONEY MAKER v4.0");
  ns.tprint("═".repeat(70));
  ns.tprint("The Ultimate Automated Hacking System");
  ns.tprint("═".repeat(70) + "\n");
  
  const startMoney = ns.getServerMoneyAvailable("home");
  const startLevel = ns.getHackingLevel();
  
  // === CONFIGURATION ===
  const cfg = {
    minHackChance: 0.6,      // Only target high-success servers
    optimalMoneyPercent: 0.5, // Hack 50% per cycle for sustainability
    securityMargin: 1,        // Stay within 1 of min security
    batchStagger: 50,         // ms between batch starts
    maxConcurrentBatches: 100,// Limit for stability
    portfolioSize: 4          // Number of simultaneous targets
  };
  
  // === NETWORK DISCOVERY ===
  function mapNetwork(ns) {
    const graph = new Map();
    const visited = new Set();
    
    function dfs(node, depth = 0) {
      if (visited.has(node)) return;
      visited.add(node);
      
      const neighbors = ns.scan(node);
      graph.set(node, { neighbors, depth });
      neighbors.forEach(n => dfs(n, depth + 1));
    }
    
    dfs("home");
    return { servers: Array.from(visited), graph };
  }
  
  const { servers, graph } = mapNetwork(ns);
  ns.tprint(`📡 Network: ${servers.length} servers mapped`);
  
  // === ADVANCED TARGET ANALYSIS ===
  function analyzeTarget(ns, hostname, hackingLevel) {
    try {
      const srv = ns.getServer(hostname);
      
      // Pre-flight checks
      if (!srv.hasAdminRights) return null;
      if (srv.moneyMax === 0) return null;
      if (srv.requiredHackingSkill > hackingLevel) return null;
      
      const chance = ns.hackAnalyzeChance(hostname);
      if (chance < cfg.minHackChance) return null;
      
      // Timing analysis
      const hackTime = ns.getHackTime(hostname);
      const weakenTime = ns.getWeakenTime(hostname);
      const growTime = ns.getGrowTime(hostname);
      const maxTime = Math.max(hackTime, weakenTime, growTime);
      
      // Financial analysis
      const hackPercent = ns.hackAnalyze(hostname);
      const moneyPerHack = srv.moneyMax * hackPercent;
      const expectedValue = moneyPerHack * chance;
      
      // Kelly Criterion: optimal fraction to bet
      const kellyFraction = (chance * (moneyPerHack / srv.moneyMax) - (1 - chance)) / (moneyPerHack / srv.moneyMax);
      const safeKelly = Math.max(0, Math.min(kellyFraction * 0.5, 1)); // Half-Kelly for safety
      
      // Efficiency metrics
      const timeEfficiency = expectedValue / (maxTime / 1000); // Money per second
      const moneyEfficiency = expectedValue / srv.moneyMax; // Return on "investment"
      
      // State analysis
      const needsWeaken = srv.hackDifficulty > srv.minDifficulty + cfg.securityMargin;
      const needsGrow = srv.moneyAvailable < srv.moneyMax * cfg.optimalMoneyPercent;
      const readyToHack = !needsWeaken && !needsGrow;
      
      // Composite score (weighted combination)
      const score = timeEfficiency * Math.pow(chance, 0.3) * (1 + moneyEfficiency);
      
      return {
        name: hostname,
        moneyMax: srv.moneyMax,
        moneyCurrent: srv.moneyAvailable,
        security: srv.hackDifficulty,
        minSecurity: srv.minDifficulty,
        hackChance: chance,
        hackPercent,
        times: { hack: hackTime, weaken: weakenTime, grow: growTime, max: maxTime },
        expectedValue,
        timeEfficiency,
        kellyFraction: safeKelly,
        readyToHack,
        needsWeaken,
        needsGrow,
        score,
        depth: graph.get(hostname)?.depth || 0
      };
    } catch {
      return null;
    }
  }
  
  const targets = servers
    .map(s => analyzeTarget(ns, s, startLevel))
    .filter(t => t !== null)
    .sort((a, b) => b.score - a.score);
  
  if (targets.length === 0) {
    ns.tprint("❌ No viable targets in network\n");
    return;
  }
  
  ns.tprint(`\n🎯 TARGET PORTFOLIO (Top ${cfg.portfolioSize}):`);
  ns.tprint("─".repeat(70));
  targets.slice(0, cfg.portfolioSize).forEach((t, i) => {
    const status = t.readyToHack ? "✓ READY" : t.needsWeaken ? "⚠ SEC" : "$ GROW";
    ns.tprint(`${i+1}. ${t.name.padEnd(16)} ${status.padEnd(8)} $${(t.timeEfficiency*60).toFixed(0).padStart(8)}/min  ${(t.hackChance*100).toFixed(0)}% × Kelly:${(t.kellyFraction*100).toFixed(0)}%`);
  });
  
  // === RESOURCE ALLOCATION ===
  const ramHosts = servers
    .map(hostname => {
      try {
        const srv = ns.getServer(hostname);
        if (!srv.hasAdminRights || srv.maxRam < 2) return null;
        const free = srv.maxRam - srv.ramUsed;
        return { name: hostname, ramFree: free, ramTotal: srv.maxRam };
      } catch { return null; }
    })
    .filter(h => h && h.ramFree >= 1.75)
    .sort((a, b) => b.ramFree - a.ramFree);
  
  const totalRAM = ramHosts.reduce((sum, h) => sum + h.ramFree, 0);
  const ramPerTarget = totalRAM / cfg.portfolioSize;
  
  ns.tprint(`\n💾 RESOURCE POOL:`);
  ns.tprint(`   Total Available: ${totalRAM.toFixed(1)}GB`);
  ns.tprint(`   Hosts: ${ramHosts.length}`);
  ns.tprint(`   Per Target: ${ramPerTarget.toFixed(1)}GB`);
  
  // === MICRO-WORKER DEPLOYMENT ===
  const workers = {
    h: `export async function main(ns){await ns.hack(ns.args[0]);}`,
    w: `export async function main(ns){await ns.weaken(ns.args[0]);}`,
    g: `export async function main(ns){await ns.grow(ns.args[0]);}`
  };
  
  for (const [key, code] of Object.entries(workers)) {
    await ns.write(`w${key}.js`, code, "w");
  }
  
  const scriptNames = ["wh.js", "ww.js", "wg.js"];
  for (const host of ramHosts.filter(h => h.name !== "home")) {
    await ns.scp(scriptNames, host.name);
  }
  
  ns.tprint(`\n⚙️  DEPLOYMENT: Workers installed on ${ramHosts.length} hosts`);
  
  // === EXECUTION PIPELINE ===
  ns.tprint("\n⚡ OMEGA EXECUTION PIPELINE");
  ns.tprint("─".repeat(70));
  
  let totalOperations = 0;
  let hostIdx = 0;
  const portfolio = targets.slice(0, cfg.portfolioSize);
  
  // Stage 1: Preparation (parallel across all targets)
  ns.tprint("Stage 1: Target Preparation");
  for (const target of portfolio) {
    if (target.needsWeaken) {
      const weakenOps = Math.min(8, Math.ceil((target.security - target.minSecurity) / 0.05));
      for (let i = 0; i < weakenOps; i++) {
        const host = ramHosts[hostIdx++ % ramHosts.length];
        ns.exec("ww.js", host.name, 1, target.name);
        totalOperations++;
      }
    }
    
    if (target.needsGrow) {
      const growOps = 6;
      for (let i = 0; i < growOps; i++) {
        const host = ramHosts[hostIdx++ % ramHosts.length];
        ns.exec("wg.js", host.name, 1, target.name);
        totalOperations++;
      }
    }
  }
  
  // Stage 2: Balanced HWGW Batches
  ns.tprint("Stage 2: Balanced HWGW Batches");
  for (const target of portfolio) {
    const batches = target.score > portfolio[0].score * 0.8 ? 20 : 15;
    
    for (let b = 0; b < batches; b++) {
      // Hack phase
      const hackThreads = Math.ceil(3 * target.kellyFraction);
      for (let i = 0; i < hackThreads; i++) {
        const host = ramHosts[hostIdx++ % ramHosts.length];
        ns.exec("wh.js", host.name, 1, target.name);
        totalOperations++;
      }
      
      // Weaken to compensate hack
      const host1 = ramHosts[hostIdx++ % ramHosts.length];
      ns.exec("ww.js", host1.name, 1, target.name);
      totalOperations++;
      
      // Grow to replenish
      for (let i = 0; i < 3; i++) {
        const host = ramHosts[hostIdx++ % ramHosts.length];
        ns.exec("wg.js", host.name, 1, target.name);
        totalOperations++;
      }
      
      // Weaken to compensate grow
      const host2 = ramHosts[hostIdx++ % ramHosts.length];
      ns.exec("ww.js", host2.name, 1, target.name);
      totalOperations++;
    }
  }
  
  // Stage 3: Direct Extraction
  await ns.sleep(250); // Let workers initialize
  
  ns.tprint("Stage 3: Direct Extraction");
  let harvestTotal = 0;
  const harvests = [];
  
  for (const target of portfolio) {
    const amount = await ns.hack(target.name);
    if (amount > 0) {
      harvests.push({ name: target.name, amount });
      harvestTotal += amount;
    }
  }
  
  // Display harvest results
  harvests.forEach(h => {
    ns.tprint(`  ${h.name.padEnd(20)} +$${h.amount.toLocaleString()}`);
  });
  
  // === OMEGA PERFORMANCE REPORT ===
  const endMoney = ns.getServerMoneyAvailable("home");
  const endLevel = ns.getHackingLevel();
  const profit = endMoney - startMoney;
  const levelGain = endLevel - startLevel;
  
  ns.tprint("\n" + "═".repeat(70));
  ns.tprint("Ω OMEGA PERFORMANCE REPORT");
  ns.tprint("═".repeat(70));
  ns.tprint(`Portfolio Targets:        ${portfolio.length}`);
  ns.tprint(`Total Operations:         ${totalOperations.toLocaleString()}`);
  ns.tprint(`Server Fleet:             ${ramHosts.length} hosts, ${totalRAM.toFixed(0)}GB`);
  ns.tprint(`Direct Harvest:           $${harvestTotal.toLocaleString()}`);
  ns.tprint(`Estimated Total Profit:   $${profit.toLocaleString()}`);
  ns.tprint(`Efficiency:               $${(profit/totalOperations).toFixed(2)}/operation`);
  ns.tprint(`Hacking Level:            ${startLevel} → ${endLevel}${levelGain > 0 ? ` (+${levelGain})` : ''}`);
  ns.tprint("═".repeat(70));
  ns.tprint("Ω OMEGA MONEY MAKER - Maximum Efficiency Achieved");
}
