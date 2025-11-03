/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0] || "n00dles";
  
  // Copy worker script to target
  await ns.scp("worker.js", target, "home");
  
  // Execute worker on target
  const threads = Math.floor(ns.getServerMaxRam(target) / ns.getScriptRam("worker.js"));
  if (threads > 0) {
    ns.exec("worker.js", target, threads, target);
    ns.tprint(`Started ${threads} workers on ${target}`);
  }
  
  // Monitor for 30 seconds
  await ns.sleep(30000);
}
