"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lscpu = lscpu;
const Terminal_1 = require("../../Terminal");
function lscpu(_args, server) {
    Terminal_1.Terminal.print(server.cpuCores + " Core(s)");
}
