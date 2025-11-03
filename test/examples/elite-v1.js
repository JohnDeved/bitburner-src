/** @param {NS} ns 
 * ELITE MONEY MAKER v1.0
 * Multi-target optimal batch scheduling system
 */
export async function main(ns) {
  ns.tprint("💎 ELITE MONEY MAKER v1.0");
  ns.tprint("━".repeat(60));
  
  // Find all servers
  function scanAll(ns) {
    const visited = new Set();
    const queue = ["home"];
    while (queue.length > 0) {
      const current = queue.shift();
      if (visited.has(current)) continue;
      visited.add(current);
      ns.scan(current).forEach(s => queue.push(s));
    }
    return Array.from(visited);
  }
  
  const allServers = scanAll(ns);
  const myLevel = ns.getHackingLevel();
  
  // Get hackable targets sorted by potential profit
  const targets = allServers
    .map(s => {
      try {
        const srv = ns.getServer(s);
        if (!srv.hasAdminRights || srv.moneyMax === 0) return null;
        if (srv.requiredHackingSkill && srv.requiredHackingSkill > myLevel) return null;
        
        const hackChance = ns.hackAnalyzeChance(s);
        const hackTime = ns.getHackTime(s);
        const potential = (srv.moneyMax * hackChance) / (hackTime / 1000);
        
        return {
          name: s,
          moneyMax: srv.moneyMax,
          hackChance,
          hackTime,
          potential,
          security: srv.hackDifficulty,
          minSecurity: srv.minDifficulty
        };
      } catch { return null; }
    })
    .filter(t => t && t.hackChance > 0.5)
    .sort((a, b) => b.potential - a.potential);
  
  if (targets.length === 0) {
    ns.tprint("❌ No hackable targets found!");
    return;
  }
  
  ns.tprint(`\n🎯 Top Targets (by profit potential):`);
  targets.slice(0, 5).forEach((t, i) => {
    ns.tprint(`${i + 1}. ${t.name}: $${(t.potential * 60).toFixed(0)}/min (${(t.hackChance * 100).toFixed(1)}% success)`);
  });
  
  // Get all servers with RAM
  const ramServers = allServers
    .map(s => {
      try {
        const srv = ns.getServer(s);
        return srv.hasAdminRights && srv.maxRam >= 2 ? {
          name: s,
          maxRam: srv.maxRam,
          usedRam: srv.ramUsed
        } : null;
      } catch { return null; }
    })
    .filter(s => s)
    .sort((a, b) => b.maxRam - a.maxRam);
  
  const totalRam = ramServers.reduce((sum, s) => sum + s.maxRam, 0);
  ns.tprint(`\n💾 Total RAM: ${totalRam}GB across ${ramServers.length} servers`);
  
  // Create optimized workers
  const workers = {
    hack: `export async function main(ns) { await ns.hack(ns.args[0]); }`,
    weaken: `export async function main(ns) { await ns.weaken(ns.args[0]); }`,
    grow: `export async function main(ns) { await ns.grow(ns.args[0]); }`
  };
  
  for (const [name, code] of Object.entries(workers)) {
    await ns.write(`elite-${name}.js`, code, "w");
  }
  
  // Distribute scripts
  for (const srv of ramServers) {
    if (srv.name !== "home") {
      await ns.scp(Object.keys(workers).map(n => `elite-${n}.js`), srv.name);
    }
  }
  ns.tprint("✓ Workers deployed\n");
  
  // Execute optimal strategy
  ns.tprint("⚡ Executing multi-target strategy...\n");
  
  let totalRuns = 0;
  let serverIdx = 0;
  
  // Attack top 3 targets simultaneously
  for (const target of targets.slice(0, 3)) {
    ns.tprint(`Attacking: ${target.name}`);
    
    // Prepare target (weaken + grow)
    for (let i = 0; i < 3; i++) {
      const srv = ramServers[serverIdx % ramServers.length];
      ns.exec(`elite-weaken.js`, srv.name, 1, target.name);
      serverIdx++;
      totalRuns++;
    }
    
    for (let i = 0; i < 3; i++) {
      const srv = ramServers[serverIdx % ramServers.length];
      ns.exec(`elite-grow.js`, srv.name, 1, target.name);
      serverIdx++;
      totalRuns++;
    }
    
    // Hack aggressively
    for (let i = 0; i < 5; i++) {
      const srv = ramServers[serverIdx % ramServers.length];
      ns.exec(`elite-hack.js`, srv.name, 1, target.name);
      serverIdx++;
      totalRuns++;
    }
  }
  
  await ns.sleep(100);
  
  // Direct hacks on best targets
  for (const target of targets.slice(0, 3)) {
    const stolen = await ns.hack(target.name);
    if (stolen > 0) {
      ns.tprint(`✓ ${target.name}: +$${stolen.toLocaleString()}`);
    }
  }
  
  ns.tprint(`\n✅ Executed ${totalRuns} operations across ${ramServers.length} servers`);
  ns.tprint("💎 ELITE MONEY MAKER Complete!");
}
