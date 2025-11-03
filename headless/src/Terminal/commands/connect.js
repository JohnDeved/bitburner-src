"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = connect;
const Terminal_1 = require("../../Terminal");
const ServerHelpers_1 = require("../../Server/ServerHelpers");
const AllServers_1 = require("../../Server/AllServers");
const exceptionAlert_1 = require("../../utils/helpers/exceptionAlert");
function connect(args, server) {
    // Disconnect from current server in Terminal and connect to new one
    if (args.length !== 1) {
        Terminal_1.Terminal.error("Incorrect usage of connect command. Usage: connect [hostname]");
        return;
    }
    const hostname = String(args[0]);
    const target = (0, AllServers_1.GetServer)(hostname);
    if (target === null) {
        Terminal_1.Terminal.error(`Invalid hostname: '${hostname}'`);
        return;
    }
    // Adjacent servers
    for (let i = 0; i < server.serversOnNetwork.length; i++) {
        const other = (0, ServerHelpers_1.getServerOnNetwork)(server, i);
        if (other === null) {
            (0, exceptionAlert_1.exceptionAlert)(new Error(`${server.serversOnNetwork[i]} is on the network of ${server.hostname}, but we cannot find its data.`));
            return;
        }
        if (other.hostname === target.hostname) {
            Terminal_1.Terminal.connectToServer(hostname);
            return;
        }
    }
    /**
     * Backdoored + owned servers (home, private servers, or hacknet servers). With home computer, purchasedByPlayer is
     * true.
     */
    if (target.backdoorInstalled || target.purchasedByPlayer) {
        Terminal_1.Terminal.connectToServer(hostname);
        return;
    }
    Terminal_1.Terminal.error(`Cannot directly connect to ${hostname}. Make sure the server is backdoored or adjacent to your current server`);
}
