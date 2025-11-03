"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.free = free;
const Terminal_1 = require("../../Terminal");
const formatNumber_1 = require("../../ui/formatNumber");
function free(args, server) {
    if (args.length !== 0) {
        Terminal_1.Terminal.error("Incorrect usage of free command. Usage: free");
        return;
    }
    const ram = (0, formatNumber_1.formatRam)(server.maxRam);
    const used = (0, formatNumber_1.formatRam)(server.ramUsed);
    const avail = (0, formatNumber_1.formatRam)(server.maxRam - server.ramUsed);
    const maxLength = Math.max(ram.length, Math.max(used.length, avail.length));
    const usedPercent = (0, formatNumber_1.formatPercent)(server.ramUsed / server.maxRam);
    Terminal_1.Terminal.print(`Total:     ${" ".repeat(maxLength - ram.length)}${ram}`);
    Terminal_1.Terminal.print(`Used:      ${" ".repeat(maxLength - used.length)}${used}` + (server.maxRam > 0 ? ` (${usedPercent})` : ""));
    Terminal_1.Terminal.print(`Available: ${" ".repeat(maxLength - avail.length)}${avail}`);
}
