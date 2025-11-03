/** @param {NS} ns */
export async function main(ns) {
  ns.tprint("Testing relative path file operations...");
  
  // Create a helper script with relative path
  const helperScript = `
    /** @param {NS} ns */
    export async function main(ns) {
      const target = ns.args[0] || "n00dles";
      await ns.hack(target);
      ns.tprint("Helper executed successfully!");
    }
  `;
  
  // Write helper script (relative path)
  await ns.write("helper.js", helperScript, "w");
  ns.tprint("✓ Created helper.js");
  
  // Try to execute it from home (absolute path - should work)
  const pid1 = ns.exec("helper.js", "home", 1, "n00dles");
  if (pid1 > 0) {
    ns.tprint("✓ Executed helper.js on home");
  } else {
    ns.tprint("✗ Failed to execute helper.js on home");
  }
  
  // Wait a bit for helper to run
  await ns.sleep(1000);
  
  // Try to copy to another server (relative path)
  const target = "n00dles";
  const copied = await ns.scp("helper.js", target);
  if (copied) {
    ns.tprint(`✓ Copied helper.js to ${target}`);
    
    // Try to execute on remote server
    const pid2 = ns.exec("helper.js", target, 1, "n00dles");
    if (pid2 > 0) {
      ns.tprint(`✓ Executed helper.js on ${target}`);
    } else {
      ns.tprint(`✗ Failed to execute helper.js on ${target}`);
    }
  } else {
    ns.tprint(`✗ Failed to copy helper.js to ${target}`);
  }
  
  await ns.sleep(1000);
  ns.tprint("\nTest complete!");
}
