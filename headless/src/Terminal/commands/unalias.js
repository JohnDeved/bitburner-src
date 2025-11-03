"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unalias = unalias;
const Terminal_1 = require("../../Terminal");
const Alias_1 = require("../../Alias");
function unalias(args) {
    if (args.length !== 1) {
        Terminal_1.Terminal.error("Incorrect usage of unalias name. Usage: unalias [alias] or unalias --all");
        return;
    }
    else if (args[0] === "--all") {
        for (const alias of Alias_1.Aliases) {
            if ((0, Alias_1.removeAlias)(alias[0] + "")) {
                Terminal_1.Terminal.print(`Removed alias ${alias[0]}`);
            }
        }
        for (const alias of Alias_1.GlobalAliases) {
            if ((0, Alias_1.removeAlias)(alias[0] + "")) {
                Terminal_1.Terminal.print(`Removed alias ${alias[0]}`);
            }
        }
    }
    else if ((0, Alias_1.removeAlias)(args[0] + "")) {
        Terminal_1.Terminal.print(`Removed alias ${args[0]}`);
    }
    else {
        Terminal_1.Terminal.error(`No such alias exists: ${args[0]}`);
    }
}
