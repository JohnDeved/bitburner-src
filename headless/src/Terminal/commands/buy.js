"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buy = buy;
const Terminal_1 = require("../../Terminal");
const _player_1 = require("@player");
const DarkWeb_1 = require("../../DarkWeb/DarkWeb");
function buy(args) {
    if (!_player_1.Player.hasTorRouter()) {
        Terminal_1.Terminal.error(`You need to be able to connect to the Dark Web to use the "buy" command. (Maybe there's a TOR router you can buy somewhere)`);
        return;
    }
    if (args.length != 1) {
        Terminal_1.Terminal.print("Incorrect number of arguments. Usage: ");
        Terminal_1.Terminal.print("buy -l");
        Terminal_1.Terminal.print("buy -a");
        Terminal_1.Terminal.print("buy [item name]");
        return;
    }
    const arg = args[0] + "";
    if (arg == "-l" || arg == "-1" || arg == "--list")
        (0, DarkWeb_1.listAllDarkwebItems)();
    else if (arg == "-a" || arg == "--all")
        (0, DarkWeb_1.buyAllDarkwebItems)();
    else
        (0, DarkWeb_1.buyDarkwebItem)(arg);
}
