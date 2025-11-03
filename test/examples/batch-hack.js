/** @param {NS} ns 
 * Advanced Batch Hacking Algorithm
 * Uses HWGW (Hack-Weaken-Grow-Weaken) batching technique
 * Distributes work across multiple servers
 */
export async function main(ns) {
  const target = ns.args[0] || "n00dles";
  
  ns.tprint("🚀 Advanced Batch Hacking System Starting");
  ns.tprint(`Target: ${target}`);
  
  // Initial stats
  const initialLevel = ns.getHackingLevel();
  const initialMoney = ns.getServerMoneyAvailable("home");
  ns.print(`Starting Level: ${initialLevel}`);
  ns.print(`Starting Money: $${initialMoney.toLocaleString()}`);
  
  // Create worker scripts
  const hackScript = `export async function main(ns) {
    await ns.hack(ns.args[0]);
  }`;
  
  const weakenScript = `export async function main(ns) {
    await ns.weaken(ns.args[0]);
  }`;
  
  const growScript = `export async function main(ns) {
    await ns.grow(ns.args[0]);
  }`;
  
  await ns.write("batch-hack.js", hackScript, "w");
  await ns.write("batch-weaken.js", weakenScript, "w");
  await ns.write("batch-grow.js", growScript, "w");
  ns.print("✓ Created worker scripts");
  
  // Find all usable servers
  function findServers(ns, current = "home", visited = new Set()) {
    visited.add(current);
    const neighbors = ns.scan(current);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        findServers(ns, neighbor, visited);
      }
    }
    return Array.from(visited);
  }
  
  const allServers = findServers(ns);
  const usableServers = allServers.filter(s => {
    try {
      const server = ns.getServer(s);
      return server.hasAdminRights && server.maxRam >= 2;
    } catch { return false; }
  });
  
  ns.print(`Found ${usableServers.length} usable servers: ${usableServers.join(", ")}`);
  
  // Prepare target
  const targetServer = ns.getServer(target);
  ns.print(`Target security: ${targetServer.hackDifficulty}/${targetServer.minDifficulty}`);
  ns.print(`Target money: $${targetServer.moneyAvailable}/$${targetServer.moneyMax}`);
  
  // Copy scripts to all servers
  for (const server of usableServers) {
    if (server !== "home") {
      await ns.scp(["batch-hack.js", "batch-weaken.js", "batch-grow.js"], server);
    }
  }
  ns.print("✓ Scripts distributed to all servers");
  
  // Batch execution
  let batchCount = 0;
  let totalHacks = 0;
  let serverIndex = 0;
  
  // Run multiple batches
  for (let i = 0; i < 3; i++) {
    batchCount++;
    ns.print(`\n=== Batch ${batchCount} ===`);
    
    // Weaken first (reduce security)
    for (let w = 0; w < 2; w++) {
      const server = usableServers[serverIndex % usableServers.length];
      const pid = ns.exec("batch-weaken.js", server, 1, target);
      if (pid > 0) ns.print(`Weaken on ${server} (PID: ${pid})`);
      serverIndex++;
    }
    
    // Grow (increase money)
    for (let g = 0; g < 2; g++) {
      const server = usableServers[serverIndex % usableServers.length];
      const pid = ns.exec("batch-grow.js", server, 1, target);
      if (pid > 0) ns.print(`Grow on ${server} (PID: ${pid})`);
      serverIndex++;
    }
    
    // Hack (steal money)
    for (let h = 0; h < 3; h++) {
      const server = usableServers[serverIndex % usableServers.length];
      const pid = ns.exec("batch-hack.js", server, 1, target);
      if (pid > 0) {
        ns.print(`Hack on ${server} (PID: ${pid})`);
        totalHacks++;
      }
      serverIndex++;
    }
    
    // Small delay between batches
    await ns.sleep(50);
  }
  
  // Do one final direct hack to ensure we get money
  ns.print("\n=== Final Direct Hack ===");
  const finalHack = await ns.hack(target);
  if (finalHack > 0) {
    ns.print(`Direct hack stole $${finalHack.toLocaleString()}`);
  }
  
  // Wait for operations to complete
  await ns.sleep(100);
  
  // Final stats
  const finalLevel = ns.getHackingLevel();
  const finalMoney = ns.getServerMoneyAvailable("home");
  const levelGain = finalLevel - initialLevel;
  const moneyGain = finalMoney - initialMoney;
  
  ns.tprint("\n📊 Batch Hacking Results:");
  ns.tprint(`Batches Executed: ${batchCount}`);
  ns.tprint(`Total Hack Operations: ${totalHacks}`);
  ns.tprint(`Servers Used: ${usableServers.length}`);
  ns.tprint(`Level: ${initialLevel} → ${finalLevel} (+${levelGain})`);
  ns.tprint(`Money Gained: $${moneyGain.toLocaleString()}`);
  
  // Check if we can hack more servers now
  if (levelGain > 0) {
    ns.tprint("\n🎯 Checking for newly hackable servers...");
    let newServers = 0;
    for (const server of allServers) {
      try {
        const s = ns.getServer(server);
        if (!s.hasAdminRights && s.requiredHackingSkill && s.requiredHackingSkill <= finalLevel) {
          ns.tprint(`  ✨ Can now hack: ${server} (requires ${s.requiredHackingSkill})`);
          newServers++;
        }
      } catch {}
    }
    if (newServers === 0) {
      ns.tprint("  No new servers available at this level");
    }
  }
  
  ns.tprint("\n✅ Advanced Batch Hacking Complete!");
}
