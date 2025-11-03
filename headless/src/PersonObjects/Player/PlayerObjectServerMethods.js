"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTorRouter = hasTorRouter;
exports.getCurrentServer = getCurrentServer;
exports.getHomeComputer = getHomeComputer;
exports.getUpgradeHomeRamCost = getUpgradeHomeRamCost;
exports.getUpgradeHomeCoresCost = getUpgradeHomeCoresCost;
exports.createHacknetServer = createHacknetServer;
// Server and HacknetServer-related methods for the Player class (PlayerObject)
const Constants_1 = require("../../Server/data/Constants");
const BitNodeMultipliers_1 = require("../../BitNode/BitNodeMultipliers");
const Server_1 = require("../../Server/Server");
const HacknetServer_1 = require("../../Hacknet/HacknetServer");
const AllServers_1 = require("../../Server/AllServers");
const SpecialServers_1 = require("../../Server/data/SpecialServers");
const HacknetHelpers_1 = require("../../Hacknet/HacknetHelpers");
function hasTorRouter() {
    return this.getHomeComputer().serversOnNetwork.includes(SpecialServers_1.SpecialServers.DarkWeb);
}
function getCurrentServer() {
    const server = (0, AllServers_1.GetServer)(this.currentServer);
    if (server === null)
        throw new Error(`somehow connected to a server that does not exist. ${this.currentServer}`);
    return server;
}
function getHomeComputer() {
    const home = (0, AllServers_1.GetServer)("home");
    if (home instanceof Server_1.Server)
        return home;
    throw new Error("home computer was not a normal server");
}
function getUpgradeHomeRamCost() {
    //Calculate how many times ram has been upgraded (doubled)
    const currentRam = this.getHomeComputer().maxRam;
    const numUpgrades = Math.log2(currentRam);
    //Calculate cost
    //Have cost increase by some percentage each time RAM has been upgraded
    const mult = Math.pow(1.58, numUpgrades);
    const cost = currentRam * Constants_1.ServerConstants.BaseCostFor1GBOfRamHome * mult * BitNodeMultipliers_1.currentNodeMults.HomeComputerRamCost;
    return cost;
}
function getUpgradeHomeCoresCost() {
    return 1e9 * Math.pow(7.5, this.getHomeComputer().cpuCores);
}
function createHacknetServer() {
    const numOwned = this.hacknetNodes.length;
    const name = (0, HacknetHelpers_1.hasHacknetServers)() ? `hacknet-server-${numOwned}` : `hacknet-node-${numOwned}`;
    const server = new HacknetServer_1.HacknetServer({
        adminRights: true,
        hostname: name,
        ip: (0, AllServers_1.createUniqueRandomIp)(),
        // player: this,
    });
    this.hacknetNodes.push(server.hostname);
    // Configure the HacknetServer to actually act as a Server
    (0, AllServers_1.AddToAllServers)(server);
    const homeComputer = this.getHomeComputer();
    homeComputer.serversOnNetwork.push(server.hostname);
    server.serversOnNetwork.push(SpecialServers_1.SpecialServers.Home);
    return server;
}
