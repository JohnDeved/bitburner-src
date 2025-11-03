"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.history = history;
const Terminal_1 = require("../../Terminal");
const _player_1 = require("@player");
function history(args) {
    if (args.length === 0) {
        Terminal_1.Terminal.commandHistory.forEach((command, index) => {
            Terminal_1.Terminal.print(`${index.toString().padStart(2)} ${command}`);
        });
        return;
    }
    const arg = args[0] + "";
    if (arg === "-c" || arg === "--clear") {
        _player_1.Player.terminalCommandHistory = [];
        Terminal_1.Terminal.commandHistory = [];
        Terminal_1.Terminal.commandHistoryIndex = 1;
    }
    else {
        Terminal_1.Terminal.error("Incorrect usage of history command. usage: history [-c]");
    }
}
