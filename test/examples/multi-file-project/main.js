/** @param {NS} ns */
export async function main(ns) {
  // This demonstrates uploading multiple files to work together
  
  // Import utility functions (these files are uploaded with --files)
  const mathUtils = ns.read("math-utils.js");
  const config = ns.read("config.txt");
  
  ns.tprint("Main script running!");
  ns.tprint(`Config loaded: ${config}`);
  ns.tprint(`Math utils available: ${mathUtils.length} bytes`);
  
  // Use the utilities
  await ns.exec("calculator.js", "home", 1, 10, 20);
  await ns.sleep(100);
  
  ns.tprint("✅ Multi-file project completed!");
}
