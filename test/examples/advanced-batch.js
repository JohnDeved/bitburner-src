/** @param {NS} ns */
export async function main(ns) {
  // Create compact worker scripts
  await ns.write("hack.js", "export async function main(ns) { await ns.hack(ns.args[0]); }", "w");
  await ns.write("grow.js", "export async function main(ns) { await ns.grow(ns.args[0]); }", "w");
  await ns.write("weaken.js", "export async function main(ns) { await ns.weaken(ns.args[0]); }", "w");
  
  // Scan network
  function scanAll(ns) {
    const seen = new Set();
    const queue = ["home"];
    while (queue.length) {
      const server = queue.shift();
      if (seen.has(server)) continue;
      seen.add(server);
      queue.push(...ns.scan(server));
    }
    return Array.from(seen);
  }
  
  const allServers = scanAll(ns);
  const targets = allServers.filter(s => 
    s !== "home" && ns.hasRootAccess(s) && ns.getServerMaxMoney(s) > 0
  );
  const workers = allServers.filter(s => 
    ns.hasRootAccess(s) && ns.getServerMaxRam(s) > 0
  );
  
  // Deploy workers
  for (const server of workers) {
    await ns.scp(["hack.js", "grow.js", "weaken.js"], server);
  }
  
  ns.print(`Targeting ${targets.length} servers with ${workers.length} workers`);
  
  // Main loop: HWGW batching
  while (true) {
    for (const target of targets) {
      const money = ns.getServerMoneyAvailable(target);
      const maxMoney = ns.getServerMaxMoney(target);
      const security = ns.getServerSecurityLevel(target);
      const minSec = ns.getServerMinSecurityLevel(target);
      
      // Determine action
      let script, threads;
      if (security > minSec + 5) {
        script = "weaken.js";
        threads = 10;
      } else if (money < maxMoney * 0.75) {
        script = "grow.js";
        threads = 15;
      } else {
        script = "hack.js";
        threads = Math.max(1, Math.floor(ns.hackAnalyzeThreads(target, money * 0.5)));
      }
      
      // Execute on workers
      for (const server of workers) {
        const ram = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
        const scriptRam = ns.getScriptRam(script);
        const available = Math.floor(ram / scriptRam);
        if (available > 0) {
          ns.exec(script, server, Math.min(threads, available), target);
        }
      }
    }
    
    await ns.sleep(1000);
  }
}
