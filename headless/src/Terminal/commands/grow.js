"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grow = grow;
const Terminal_1 = require("../../Terminal");
function grow(args, server) {
    if (args.length !== 0)
        return Terminal_1.Terminal.error("Incorrect usage of grow command. Usage: grow");
    if (server.purchasedByPlayer)
        return Terminal_1.Terminal.error("Cannot grow your own machines!");
    if (!server.hasAdminRights)
        return Terminal_1.Terminal.error("You do not have admin rights for this machine!");
    // Grow does not require meeting the hacking level, but undefined requiredHackingSkill indicates the wrong type of server.
    if (server.requiredHackingSkill === undefined)
        return Terminal_1.Terminal.error("Cannot grow this server.");
    Terminal_1.Terminal.startGrow();
}
