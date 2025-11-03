"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.home = home;
const Terminal_1 = require("../../Terminal");
function home(args) {
    if (args.length !== 0) {
        Terminal_1.Terminal.error("Incorrect usage of home command. Usage: home");
        return;
    }
    Terminal_1.Terminal.connectToServer("home");
}
