"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = help;
const Terminal_1 = require("../../Terminal");
const HelpText_1 = require("../HelpText");
function help(args) {
    if (args.length !== 0 && args.length !== 1) {
        Terminal_1.Terminal.error("Incorrect usage of help command. Usage: help");
        return;
    }
    if (args.length === 0) {
        HelpText_1.TerminalHelpText.forEach((line) => Terminal_1.Terminal.print(line));
    }
    else {
        const cmd = args[0] + "";
        const txt = HelpText_1.HelpTexts[cmd];
        if (txt == null) {
            Terminal_1.Terminal.error("No help topics match '" + cmd + "'");
            return;
        }
        txt.forEach((t) => Terminal_1.Terminal.print(t));
    }
}
