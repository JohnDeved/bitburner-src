"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scan = scan;
const Terminal_1 = require("../../Terminal");
const ServerHelpers_1 = require("../../Server/ServerHelpers");
function scan(args, currServ) {
    if (args.length !== 0) {
        Terminal_1.Terminal.error("Incorrect usage of scan command. Usage: scan");
        return;
    }
    // Displays available network connections using TCP
    const servers = currServ.serversOnNetwork.map((_, i) => {
        const server = (0, ServerHelpers_1.getServerOnNetwork)(currServ, i);
        if (server === null)
            throw new Error("Server should not be null");
        return {
            hostname: server.hostname,
            ip: server.ip,
            hasRoot: server.hasAdminRights ? "Y" : "N",
        };
    });
    servers.unshift({
        hostname: "Hostname",
        ip: "IP",
        hasRoot: "Root Access",
    });
    const maxHostname = Math.max(...servers.map((s) => s.hostname.length));
    const maxIP = Math.max(...servers.map((s) => s.ip.length));
    for (const server of servers) {
        if (!server)
            continue;
        let entry = server.hostname;
        entry += " ".repeat(maxHostname - server.hostname.length + 1);
        entry += server.ip;
        entry += " ".repeat(maxIP - server.ip.length + 1);
        entry += server.hasRoot;
        Terminal_1.Terminal.print(entry);
    }
}
