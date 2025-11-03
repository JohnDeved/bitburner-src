"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sudov = sudov;
const Terminal_1 = require("../../Terminal");
function sudov(args, server) {
    if (args.length !== 0) {
        Terminal_1.Terminal.error("Incorrect number of arguments. Usage: sudov");
        return;
    }
    if (server.hasAdminRights) {
        Terminal_1.Terminal.print("You have ROOT access to this machine");
    }
    else {
        Terminal_1.Terminal.print("You do NOT have root access to this machine");
    }
}
