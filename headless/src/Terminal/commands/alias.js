"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alias = alias;
const Terminal_1 = require("../../Terminal");
const Alias_1 = require("../../Alias");
function alias(args) {
    if (args.length === 0) {
        (0, Alias_1.printAliases)();
        return;
    }
    if (args[0] === "--all") {
        Terminal_1.Terminal.error(`--all is reserved for removal`);
        return;
    }
    if (args.length === 1) {
        if ((0, Alias_1.parseAliasDeclaration)(args[0] + "")) {
            Terminal_1.Terminal.print(`Set alias ${args[0]}`);
            return;
        }
    }
    if (args.length === 2) {
        if (args[0] === "-g") {
            if ((0, Alias_1.parseAliasDeclaration)(args[1] + "", true)) {
                Terminal_1.Terminal.print(`Set global alias ${args[1]}`);
                return;
            }
        }
    }
    Terminal_1.Terminal.error('Incorrect usage of alias command. Usage: alias [-g] [aliasname="value"]');
}
