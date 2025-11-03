"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hack = hack;
const Terminal_1 = require("../../Terminal");
const _player_1 = require("@player");
function hack(args, server) {
    if (args.length !== 0)
        return Terminal_1.Terminal.error("Incorrect usage of hack command. Usage: hack");
    if (server.purchasedByPlayer)
        return Terminal_1.Terminal.error("Cannot hack your own machines!");
    if (!server.hasAdminRights)
        return Terminal_1.Terminal.error("You do not have admin rights for this machine!");
    // Acts as a functional check that the server is hackable. Hacknet servers should already be filtered out anyway by purchasedByPlayer
    if (server.requiredHackingSkill === undefined)
        return Terminal_1.Terminal.error("Cannot hack this server.");
    if (server.requiredHackingSkill > _player_1.Player.skills.hacking) {
        return Terminal_1.Terminal.error("Your hacking skill is not high enough to hack this machine. Try analyzing the machine to determine the required hacking skill");
    }
    Terminal_1.Terminal.startHack();
}
