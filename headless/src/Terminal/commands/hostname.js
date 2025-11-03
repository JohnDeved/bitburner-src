"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostname = hostname;
const Terminal_1 = require("../../Terminal");
function hostname(args, server) {
    if (args.length !== 0) {
        Terminal_1.Terminal.error("Incorrect usage of hostname command. Usage: hostname");
        return;
    }
    Terminal_1.Terminal.print(server.hostname);
}
