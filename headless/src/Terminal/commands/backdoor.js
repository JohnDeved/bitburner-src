"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backdoor = backdoor;
const Terminal_1 = require("../../Terminal");
const _player_1 = require("@player");
const Server_1 = require("../../Server/Server");
function backdoor(args, server) {
    if (args.length !== 0) {
        Terminal_1.Terminal.error("Incorrect usage of backdoor command. Usage: backdoor");
        return;
    }
    if (!(server instanceof Server_1.Server)) {
        Terminal_1.Terminal.error("Can only install a backdoor on normal servers");
        return;
    }
    if (server.purchasedByPlayer) {
        Terminal_1.Terminal.error("Cannot install a backdoor on your own machines! You are currently connected to your home PC or one of your purchased servers.");
        return;
    }
    if (!server.hasAdminRights) {
        Terminal_1.Terminal.error("You do not have admin rights for this machine");
        return;
    }
    if (server.requiredHackingSkill > _player_1.Player.skills.hacking) {
        Terminal_1.Terminal.error("Your hacking skill is not high enough to install a backdoor on this machine. Try analyzing the machine to determine the required hacking skill.");
        return;
    }
    if (server.backdoorInstalled) {
        Terminal_1.Terminal.warn(`You have already installed a backdoor on this server. You can check the "Backdoor" status via the "analyze" command.`);
    }
    Terminal_1.Terminal.startBackdoor();
}
