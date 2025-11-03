"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyze = analyze;
const Terminal_1 = require("../../Terminal");
function analyze(args) {
    if (args.length !== 0) {
        Terminal_1.Terminal.error("Incorrect usage of analyze command. Usage: analyze");
        return;
    }
    Terminal_1.Terminal.startAnalyze();
}
