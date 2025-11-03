"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipaddr = ipaddr;
const Terminal_1 = require("../../Terminal");
function ipaddr(args, server) {
    if (args.length !== 0) {
        Terminal_1.Terminal.error("Incorrect usage of hostname command. Usage: ipaddr");
        return;
    }
    Terminal_1.Terminal.print(server.ip);
}
