/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0] || "n00dles";
  while (true) {
    await ns.hack(target);
  }
}
