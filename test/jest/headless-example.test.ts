/**
 * Example test file demonstrating how to use the Bitburner headless test environment
 * This file can be used as a reference for writing your own tests
 */

import {
  getNS,
  setupBasicTestingEnvironment,
  initGameEnvironment,
  fixDoImportIssue,
  Player,
  GetServerOrThrow,
  SpecialServers,
  startWorkerScript,
  workerScripts,
  RunningScript,
  resetPidCounter,
  type ScriptFilePath,
} from "../../headless";

// Initialize the environment once before all tests
fixDoImportIssue();
initGameEnvironment();

describe("Bitburner Headless Environment Examples", () => {
  beforeEach(() => {
    // Set up a clean testing environment for each test
    setupBasicTestingEnvironment();
    resetPidCounter();
  });

  test("should get NS instance and access home server", () => {
    const ns = getNS();
    const homeServer = ns.getServer(SpecialServers.Home);
    
    expect(homeServer.hostname).toBe("home");
    expect(homeServer.maxRam).toBeGreaterThan(0);
  });

  test("should write and read script files", () => {
    const home = Player.getHomeComputer();
    const scriptPath = "test-script.js" as ScriptFilePath;
    const scriptCode = `
      export async function main(ns) {
        ns.tprint("Hello from test!");
      }
    `;

    const writeResult = home.writeToScriptFile(scriptPath, scriptCode);
    expect(writeResult.overwritten).toBe(false);

    const script = home.scripts.get(scriptPath);
    expect(script).toBeDefined();
    expect(script?.filename).toBe("test-script.js");
    expect(script?.code).toBe(scriptCode);
  });

  test("should calculate RAM usage of a script", () => {
    const home = Player.getHomeComputer();
    const scriptPath = "ram-test.js" as ScriptFilePath;
    
    home.writeToScriptFile(scriptPath, `
      export async function main(ns) {
        const server = ns.getServer("home");
        ns.print(server.hostname);
      }
    `);

    const script = home.scripts.get(scriptPath);
    expect(script).toBeDefined();
    
    const ramUsage = script?.getRamUsage(home.scripts);
    expect(ramUsage).toBeDefined();
    expect(ramUsage).toBeGreaterThan(0);
  });

  test("should run a script and verify logs", async () => {
    const server = Player.getHomeComputer();
    const scriptPath = "logging-test.js" as ScriptFilePath;
    
    server.writeToScriptFile(scriptPath, `
      export async function main(ns) {
        const server = ns.getServer("home");
        ns.print("Server: " + server.hostname);
        ns.print("RAM: " + server.maxRam);
      }
    `);

    const script = server.scripts.get(scriptPath);
    if (!script) throw new Error("Script not found");

    const ramUsage = script.getRamUsage(server.scripts);
    if (!ramUsage) throw new Error("Cannot calculate RAM usage");

    const runningScript = new RunningScript(script, ramUsage);
    const pid = startWorkerScript(runningScript, server);
    
    expect(pid).toBeGreaterThan(0);
    
    const workerScript = workerScripts.get(pid);
    expect(workerScript).toBeDefined();

    // Wait for the script to complete
    await new Promise<void>((resolve) => {
      workerScript!.atExit = new Map([["default", resolve]]);
    });

    // Verify logs
    expect(runningScript.logs.length).toBeGreaterThan(0);
    expect(runningScript.logs[0]).toContain("Server: home");
    expect(runningScript.logs[1]).toContain("RAM:");
  });

  test("should access player information", () => {
    expect(Player).toBeDefined();
    expect(Player.money).toBeDefined();
    expect(Player.skills.hacking).toBeDefined();
  });

  test("should access special servers", () => {
    const home = GetServerOrThrow(SpecialServers.Home);
    expect(home.hostname).toBe("home");
    expect(home.hasAdminRights).toBe(true);
  });
});
