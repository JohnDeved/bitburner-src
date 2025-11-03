"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mem = mem;
const Terminal_1 = require("../../Terminal");
const formatNumber_1 = require("../../ui/formatNumber");
const Settings_1 = require("../../Settings/Settings");
function mem(args, server) {
    try {
        if (args.length !== 1 && args.length !== 3) {
            Terminal_1.Terminal.error("Incorrect usage of mem command. usage: mem [scriptname] [-t] [number threads]");
            return;
        }
        const scriptName = args[0] + "";
        let numThreads = 1;
        if (args.length === 3 && args[1] === "-t") {
            numThreads = Math.round(parseInt(args[2] + ""));
            if (isNaN(numThreads) || numThreads < 1) {
                Terminal_1.Terminal.error("Invalid number of threads specified. Number of threads must be greater than 1");
                return;
            }
        }
        const script = Terminal_1.Terminal.getScript(scriptName);
        if (script == null) {
            Terminal_1.Terminal.error("mem failed. No such script exists!");
            return;
        }
        const singleRamUsage = script.getRamUsage(server.scripts);
        if (!singleRamUsage)
            return Terminal_1.Terminal.error(`Could not calculate ram usage for ${scriptName}`);
        const ramUsage = singleRamUsage * numThreads;
        Terminal_1.Terminal.print(`This script requires ${(0, formatNumber_1.formatRam)(ramUsage)} of RAM to run for ${numThreads} thread(s)`);
        const verboseEntries = script.ramUsageEntries.sort((a, b) => b.cost - a.cost) ?? [];
        const padding = Settings_1.Settings.UseIEC60027_2 ? 9 : 8;
        for (const entry of verboseEntries) {
            Terminal_1.Terminal.print(`${(0, formatNumber_1.formatRam)(entry.cost * numThreads).padStart(padding)} | ${entry.name} (${entry.type})`);
        }
        if (ramUsage > 0 && verboseEntries.length === 0) {
            // Let's warn the user that he might need to save his script again to generate the detailed entries
            Terminal_1.Terminal.warn("You might have to open & save this script to see the detailed RAM usage information.");
        }
    }
    catch (error) {
        console.error(error);
        Terminal_1.Terminal.error(String(error));
    }
}
