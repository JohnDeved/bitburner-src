/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0] || "n00dles";
  
  while (true) {
    const money = await ns.hack(target);
    if (money > 0) {
      ns.print(`Hacked ${ns.formatNumber(money)} from ${target}`);
    }
    await ns.sleep(1000);
  }
}
