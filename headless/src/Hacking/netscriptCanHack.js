"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.netscriptCanHack = netscriptCanHack;
exports.netscriptCanGrow = netscriptCanGrow;
exports.netscriptCanWeaken = netscriptCanWeaken;
const _player_1 = require("@player");
function baseCheck(server, actionName) {
    const hostname = server.hostname;
    if (server.purchasedByPlayer) {
        return {
            res: false,
            msg: `Cannot ${actionName} ${hostname} server because it is your server`,
        };
    }
    if (!server.hasAdminRights) {
        return {
            res: false,
            msg: `Cannot ${actionName} ${hostname} server because you do not have root access`,
        };
    }
    return { res: true };
}
function netscriptCanHack(server, customActionName) {
    const initialCheck = baseCheck(server, customActionName ?? "hack");
    if (!initialCheck.res) {
        return initialCheck;
    }
    const s = server;
    if (s.requiredHackingSkill > _player_1.Player.skills.hacking) {
        return {
            res: false,
            msg: `Cannot hack ${server.hostname} server because your hacking skill is not high enough`,
        };
    }
    return { res: true };
}
function netscriptCanGrow(server) {
    return baseCheck(server, "grow");
}
function netscriptCanWeaken(server) {
    return baseCheck(server, "weaken");
}
