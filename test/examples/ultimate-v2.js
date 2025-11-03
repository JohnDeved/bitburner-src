/** @param {NS} ns 
 * ULTIMATE MONEY MAKER v2.0 - Adaptive Multi-Target System
 * Features:
 * - Dynamic target prioritization based on profit/time
 * - Intelligent RAM allocation
 * - Thread calculation for maximum efficiency
 * - Multi-server parallel execution
 */
export async function main(ns) {
  ns.tprint("💰 ULTIMATE MONEY MAKER v2.0");
  ns.tprint("━".repeat(60));
  
  const startMoney = ns.getServerMoneyAvailable("home");
  const startTime = Date.now();
  
  // === PHASE 1: Intelligence Gathering ===
  function deepScan(ns) {
    const found = new Set();
    const scan = (host) => {
      found.add(host);
      ns.scan(host).forEach(s => !found.has(s) && scan(s));
    };
    scan("home");
    return Array.from(found);
  }
  
  const allServers = deepScan(ns);
  const hackingLevel = ns.getHackingLevel();
  
  // === PHASE 2: Target Analysis with Formulas ===
  const analyzeTarget = (hostname) => {
    try {
      const server = ns.getServer(hostname);
      
      // Skip if not hackable
      if (!server.hasAdminRights || server.moneyMax === 0) return null;
      if (server.requiredHackingSkill > hackingLevel) return null;
      
      const hackChance = ns.hackAnalyzeChance(hostname);
      if (hackChance < 0.4) return null; // Skip low success rate
      
      const hackTime = ns.getHackTime(hostname);
      const weakenTime = ns.getWeakenTime(hostname);
      const growTime = ns.getGrowTime(hostname);
      
      // Calculate profit per second
      const hackPercent = ns.hackAnalyze(hostname);
      const moneyPerHack = server.moneyMax * hackPercent;
      const profitPerSecond = (moneyPerHack * hackChance) / (hackTime / 1000);
      
      // Calculate optimal operation counts
      const securityGap = server.hackDifficulty - server.minDifficulty;
      const weakensNeeded = Math.ceil(securityGap / 0.05);
      
      return {
        name: hostname,
        moneyMax: server.moneyMax,
        moneyCurrent: server.moneyAvailable,
        hackChance,
        hackTime,
        weakenTime,
        growTime,
        profitPerSecond,
        weakensNeeded,
        hackPercent,
        score: profitPerSecond * hackChance // Combined metric
      };
    } catch {
      return null;
    }
  };
  
  const targets = allServers
    .map(analyzeTarget)
    .filter(t => t !== null)
    .sort((a, b) => b.score - a.score);
  
  if (targets.length === 0) {
    ns.tprint("❌ No viable targets!");
    return;
  }
  
  ns.tprint(`\n🎯 Analyzed ${targets.length} hackable targets`);
  ns.tprint("Top 5 by score:");
  targets.slice(0, 5).forEach((t, i) => {
    ns.tprint(`  ${i+1}. ${t.name.padEnd(20)} Score: ${t.score.toFixed(0)} (${(t.hackChance*100).toFixed(0)}% × $${(t.profitPerSecond*60).toFixed(0)}/min)`);
  });
  
  // === PHASE 3: RAM Allocation ===
  const ramHosts = allServers
    .map(hostname => {
      try {
        const server = ns.getServer(hostname);
        return server.hasAdminRights && server.maxRam >= 2 ? {
          name: hostname,
          available: server.maxRam - server.ramUsed,
          max: server.maxRam
        } : null;
      } catch { return null; }
    })
    .filter(h => h && h.available >= 1.75)
    .sort((a, b) => b.available - a.available);
  
  const totalAvailableRAM = ramHosts.reduce((sum, h) => sum + h.available, 0);
  ns.tprint(`\n💾 RAM: ${totalAvailableRAM.toFixed(1)}GB available on ${ramHosts.length} servers`);
  
  // === PHASE 4: Deploy Micro-Workers ===
  const scripts = {
    h: `export async function main(ns) { await ns.hack(ns.args[0]); }`,
    w: `export async function main(ns) { await ns.weaken(ns.args[0]); }`,
    g: `export async function main(ns) { await ns.grow(ns.args[0]); }`
  };
  
  for (const [key, code] of Object.entries(scripts)) {
    await ns.write(`u${key}.js`, code, "w");
  }
  
  // Distribute to all hosts
  for (const host of ramHosts.filter(h => h.name !== "home")) {
    await ns.scp(["uh.js", "uw.js", "ug.js"], host.name);
  }
  
  // === PHASE 5: Intelligent Execution Strategy ===
  ns.tprint("\n⚡ Executing optimized attack strategy...\n");
  
  let operations = 0;
  let hostIndex = 0;
  
  // Focus on top targets with calculated operations
  for (const target of targets.slice(0, 5)) {
    ns.tprint(`→ ${target.name}`);
    
    // Prepare phase (if needed)
    if (target.weakensNeeded > 0) {
      const weakensToRun = Math.min(target.weakensNeeded, 5);
      for (let i = 0; i < weakensToRun; i++) {
        const host = ramHosts[hostIndex % ramHosts.length];
        ns.exec("uw.js", host.name, 1, target.name);
        hostIndex++;
        operations++;
      }
    }
    
    // Money extraction phase - use more threads for better targets
    const isTopTarget = targets.indexOf(target) < 3;
    const hackThreads = isTopTarget ? 8 : 5;
    const growThreads = isTopTarget ? 6 : 4;
    
    for (let i = 0; i < growThreads; i++) {
      const host = ramHosts[hostIndex % ramHosts.length];
      ns.exec("ug.js", host.name, 1, target.name);
      hostIndex++;
      operations++;
    }
    
    for (let i = 0; i < hackThreads; i++) {
      const host = ramHosts[hostIndex % ramHosts.length];
      ns.exec("uh.js", host.name, 1, target.name);
      hostIndex++;
      operations++;
    }
  }
  
  // Small delay for workers to start
  await ns.sleep(150);
  
  // === PHASE 6: Direct Attack on Best Targets ===
  ns.tprint("\n🎯 Direct attacks:");
  let directEarnings = 0;
  
  for (const target of targets.slice(0, 5)) {
    const stolen = await ns.hack(target.name);
    if (stolen > 0) {
      ns.tprint(`  ${target.name}: +$${stolen.toLocaleString()}`);
      directEarnings += stolen;
    }
  }
  
  // === PHASE 7: Results ===
  const endMoney = ns.getServerMoneyAvailable("home");
  const profit = endMoney - startMoney;
  const elapsed = (Date.now() - startTime) / 1000;
  
  ns.tprint("\n" + "━".repeat(60));
  ns.tprint("📊 RESULTS:");
  ns.tprint(`   Operations: ${operations}`);
  ns.tprint(`   Servers Used: ${ramHosts.length}`);
  ns.tprint(`   Direct Earnings: $${directEarnings.toLocaleString()}`);
  ns.tprint(`   Total Profit: $${profit.toLocaleString()}`);
  ns.tprint(`   Time: ${elapsed.toFixed(1)}s`);
  ns.tprint(`   Rate: $${(profit/elapsed).toFixed(0)}/sec`);
  ns.tprint("━".repeat(60));
}
