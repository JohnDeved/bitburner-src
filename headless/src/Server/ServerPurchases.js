"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renamePurchasedServer = exports.upgradePurchasedServer = exports.getPurchasedServerUpgradeCost = void 0;
exports.getPurchaseServerCost = getPurchaseServerCost;
exports.getPurchaseServerLimit = getPurchaseServerLimit;
exports.getPurchaseServerMaxRam = getPurchaseServerMaxRam;
exports.purchaseServer = purchaseServer;
exports.purchaseRamForHomeComputer = purchaseRamForHomeComputer;
/**
 * Implements functions for purchasing servers or purchasing more RAM for
 * the home computer
 */
const AllServers_1 = require("./AllServers");
const ServerHelpers_1 = require("./ServerHelpers");
const BitNodeMultipliers_1 = require("../BitNode/BitNodeMultipliers");
const Constants_1 = require("./data/Constants");
const _player_1 = require("@player");
const DialogBox_1 = require("../ui/React/DialogBox");
const isPowerOfTwo_1 = require("../utils/helpers/isPowerOfTwo");
const WorkerScripts_1 = require("../Netscript/WorkerScripts");
const strings_1 = require("../Types/strings");
// Returns the cost of purchasing a server with the given RAM
// Returns Infinity for invalid 'ram' arguments
/**
 * @param ram Amount of RAM on purchased server (GB)
 * @returns Cost of purchasing the given server. Returns infinity for invalid arguments
 */
function getPurchaseServerCost(ram) {
    // TODO shift checks into
    const sanitizedRam = Math.round(ram);
    if (isNaN(sanitizedRam) || !(0, isPowerOfTwo_1.isPowerOfTwo)(sanitizedRam) || !(Math.sign(sanitizedRam) === 1)) {
        return Infinity;
    }
    if (sanitizedRam > getPurchaseServerMaxRam()) {
        return Infinity;
    }
    const upg = Math.max(0, Math.log(sanitizedRam) / Math.log(2) - 6);
    return (sanitizedRam *
        Constants_1.ServerConstants.BaseCostFor1GBOfRamServer *
        BitNodeMultipliers_1.currentNodeMults.PurchasedServerCost *
        Math.pow(BitNodeMultipliers_1.currentNodeMults.PurchasedServerSoftcap, upg));
}
const getPurchasedServerUpgradeCost = (hostname, ram) => {
    const server = (0, AllServers_1.GetServer)(hostname);
    if (!server)
        throw new Error(`Server '${hostname}' not found.`);
    if (!_player_1.Player.purchasedServers.includes(server.hostname))
        throw new Error(`Server '${hostname}' not a purchased server.`);
    if (isNaN(ram) || !(0, isPowerOfTwo_1.isPowerOfTwo)(ram) || !(Math.sign(ram) === 1))
        throw new Error(`${ram} is not a positive power of 2`);
    if (server.maxRam >= ram)
        throw new Error(`The new ram of '${hostname}' (${ram}) must be bigger than its current ram (${server.maxRam}).`);
    return getPurchaseServerCost(ram) - getPurchaseServerCost(server.maxRam);
};
exports.getPurchasedServerUpgradeCost = getPurchasedServerUpgradeCost;
const upgradePurchasedServer = (hostname, ram) => {
    const server = (0, AllServers_1.GetServer)(hostname);
    if (!server)
        throw new Error(`Server '${hostname}' not found.`);
    const cost = (0, exports.getPurchasedServerUpgradeCost)(hostname, ram);
    if (!_player_1.Player.canAfford(cost))
        throw new Error(`You don't have enough money to upgrade '${hostname}'.`);
    _player_1.Player.loseMoney(cost, "servers");
    server.maxRam = ram;
};
exports.upgradePurchasedServer = upgradePurchasedServer;
const renamePurchasedServer = (hostname, newName) => {
    if ((0, strings_1.isIPAddress)(hostname))
        throw new Error(`${hostname} is an IP address, not a hostname.`);
    const server = (0, AllServers_1.GetServer)(hostname);
    if (!server)
        throw new Error(`Server '${hostname}' doesn't exists.`);
    if (newName == "" || (0, strings_1.isIPAddress)(newName))
        throw new Error(`${newName} is an invalid hostname.`);
    if ((0, AllServers_1.GetServer)(newName))
        throw new Error(`Server '${newName}' already exists.`);
    if (!_player_1.Player.purchasedServers.includes(hostname))
        throw new Error(`Server '${hostname}' is not a player server.`);
    if (newName.startsWith("hacknet-node-") || newName.startsWith("hacknet-server-")) {
        throw new Error(`'${newName}' is a reserved hostname.`);
    }
    const replace = (arr, old, next) => {
        return arr.map((v) => (v === old ? next : v));
    };
    _player_1.Player.purchasedServers = replace(_player_1.Player.purchasedServers, hostname, newName);
    if (_player_1.Player.currentServer === hostname)
        _player_1.Player.currentServer = newName;
    const home = _player_1.Player.getHomeComputer();
    home.serversOnNetwork = replace(home.serversOnNetwork, hostname, newName);
    server.serversOnNetwork = replace(server.serversOnNetwork, hostname, newName);
    for (const byPid of server.runningScriptMap.values()) {
        for (const r of byPid.values()) {
            r.server = newName;
            const ws = WorkerScripts_1.workerScripts.get(r.pid);
            if (!ws)
                continue;
            ws.hostname = newName;
        }
    }
    server.scripts.forEach((r) => (r.server = newName));
    server.hostname = newName;
    (0, AllServers_1.renameServer)(hostname, newName);
};
exports.renamePurchasedServer = renamePurchasedServer;
function getPurchaseServerLimit() {
    return Math.round(Constants_1.ServerConstants.PurchasedServerLimit * BitNodeMultipliers_1.currentNodeMults.PurchasedServerLimit);
}
function getPurchaseServerMaxRam() {
    const ram = Math.round(Constants_1.ServerConstants.PurchasedServerMaxRam * BitNodeMultipliers_1.currentNodeMults.PurchasedServerMaxRam);
    // Round this to the nearest power of 2
    return 1 << (31 - Math.clz32(ram));
}
// Manually purchase a server (NOT through Netscript)
function purchaseServer(hostname, ram) {
    const cost = getPurchaseServerCost(ram);
    if (cost === Infinity) {
        return;
    }
    //Check if player has enough money
    if (!_player_1.Player.canAfford(cost)) {
        (0, DialogBox_1.dialogBoxCreate)("You don't have enough money to purchase this server!");
        return;
    }
    //Maximum server limit
    if (_player_1.Player.purchasedServers.length >= getPurchaseServerLimit()) {
        (0, DialogBox_1.dialogBoxCreate)("You have reached the maximum limit of " +
            getPurchaseServerLimit() +
            " servers. " +
            "You cannot purchase any more. You can " +
            "delete some of your purchased servers using the deleteServer() Netscript function in a script");
        return;
    }
    if (hostname == "") {
        (0, DialogBox_1.dialogBoxCreate)("You must enter a hostname for your new server!");
        return;
    }
    if (hostname.startsWith("hacknet-node-") || hostname.startsWith("hacknet-server-")) {
        (0, DialogBox_1.dialogBoxCreate)(`'${hostname}' is a reserved hostname, please try again.`);
        return;
    }
    // Create server
    const newServ = (0, ServerHelpers_1.safelyCreateUniqueServer)({
        adminRights: true,
        hostname: hostname,
        ip: (0, AllServers_1.createUniqueRandomIp)(),
        isConnectedTo: false,
        maxRam: ram,
        organizationName: "",
        purchasedByPlayer: true,
    });
    (0, AllServers_1.AddToAllServers)(newServ);
    // Add to Player's purchasedServers array
    _player_1.Player.purchasedServers.push(newServ.hostname);
    // Connect new server to home computer
    const homeComputer = _player_1.Player.getHomeComputer();
    homeComputer.serversOnNetwork.push(newServ.hostname);
    newServ.serversOnNetwork.push(homeComputer.hostname);
    _player_1.Player.loseMoney(cost, "servers");
    (0, DialogBox_1.dialogBoxCreate)("Server successfully purchased with hostname " + newServ.hostname);
}
// Manually upgrade RAM on home computer (NOT through Netscript)
function purchaseRamForHomeComputer() {
    const cost = _player_1.Player.getUpgradeHomeRamCost();
    if (!_player_1.Player.canAfford(cost)) {
        (0, DialogBox_1.dialogBoxCreate)("You do not have enough money to purchase additional RAM for your home computer");
        return;
    }
    const homeComputer = _player_1.Player.getHomeComputer();
    if ((_player_1.Player.bitNodeOptions.restrictHomePCUpgrade && homeComputer.maxRam >= 128) ||
        homeComputer.maxRam >= Constants_1.ServerConstants.HomeComputerMaxRam) {
        (0, DialogBox_1.dialogBoxCreate)(`You cannot upgrade your home computer RAM because it is at its maximum possible value`);
        return;
    }
    homeComputer.maxRam *= 2;
    _player_1.Player.loseMoney(cost, "servers");
}
