"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weaken = weaken;
const Terminal_1 = require("../../Terminal");
function weaken(args, server) {
    if (args.length !== 0)
        return Terminal_1.Terminal.error("Incorrect usage of weaken command. Usage: weaken");
    if (server.purchasedByPlayer)
        return Terminal_1.Terminal.error("Cannot weaken your own machines!");
    if (!server.hasAdminRights)
        return Terminal_1.Terminal.error("You do not have admin rights for this machine!");
    // Weaken does not require meeting the hacking level, but undefined requiredHackingSkill indicates the wrong type of server.
    if (server.requiredHackingSkill === undefined)
        return Terminal_1.Terminal.error("Cannot weaken this server.");
    Terminal_1.Terminal.startWeaken();
}
