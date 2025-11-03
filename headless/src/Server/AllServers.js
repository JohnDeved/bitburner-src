"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameServer = void 0;
exports.GetServer = GetServer;
exports.GetServerOrThrow = GetServerOrThrow;
exports.GetReachableServer = GetReachableServer;
exports.GetAllServers = GetAllServers;
exports.DeleteServer = DeleteServer;
exports.ipExists = ipExists;
exports.createUniqueRandomIp = createUniqueRandomIp;
exports.AddToAllServers = AddToAllServers;
exports.initForeignServers = initForeignServers;
exports.prestigeAllServers = prestigeAllServers;
exports.loadAllServers = loadAllServers;
exports.saveAllServers = saveAllServers;
const Server_1 = require("./Server");
const servers_1 = require("./data/servers");
const HacknetServer_1 = require("../Hacknet/HacknetServer");
const IPAddress_1 = require("../utils/IPAddress");
const getRandomIntInclusive_1 = require("../utils/helpers/getRandomIntInclusive");
const GenericReviver_1 = require("../utils/GenericReviver");
const SpecialServers_1 = require("./data/SpecialServers");
const BitNodeMultipliers_1 = require("../BitNode/BitNodeMultipliers");
const strings_1 = require("../Types/strings");
require("../Script/RunningScript"); // For reviver side-effect
const TypeAssertion_1 = require("../utils/TypeAssertion");
/**
 * Map of all Servers that exist in the game
 *  Key (string) = IP
 *  Value = Server object
 */
let AllServers = {};
function GetServerByIP(ip) {
    for (const server of Object.values(AllServers)) {
        if (server.ip !== ip)
            continue;
        return server;
    }
}
//Get server by IP or hostname. Returns null if invalid
function GetServer(s) {
    if (Object.hasOwn(AllServers, s)) {
        const server = AllServers[s];
        if (server)
            return server;
    }
    if (!(0, strings_1.isIPAddress)(s))
        return null;
    const ipserver = GetServerByIP(s);
    if (ipserver !== undefined) {
        return ipserver;
    }
    return null;
}
/**
 * In our codebase, we usually have to call GetServer() like this:
 * ```
 * const server = GetServer(hostname);
 * if (!server) {
 *   throw new Error("Error message");
 * }
 * // Use server
 * ```
 * With this utility function, we don't need to write boilerplate code.
 */
function GetServerOrThrow(serverId) {
    const server = GetServer(serverId);
    if (!server) {
        throw new Error(`Server ${serverId} does not exist.`);
    }
    return server;
}
//Get server by IP or hostname. Returns null if invalid or unreachable.
function GetReachableServer(s) {
    const server = GetServer(s);
    if (server === null)
        return server;
    if (server.serversOnNetwork.length === 0)
        return null;
    return server;
}
function GetAllServers() {
    const servers = [];
    for (const key of Object.keys(AllServers)) {
        servers.push(AllServers[key]);
    }
    return servers;
}
function DeleteServer(serverkey) {
    for (const key of Object.keys(AllServers)) {
        const server = AllServers[key];
        if (server.ip !== serverkey && server.hostname !== serverkey)
            continue;
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete AllServers[key];
        break;
    }
}
function ipExists(ip) {
    for (const hostName in AllServers) {
        if (AllServers[hostName].ip === ip) {
            return true;
        }
    }
    return false;
}
function createUniqueRandomIp() {
    let ip;
    // Repeat generating ip, until unique one is found
    do {
        ip = (0, IPAddress_1.createRandomIp)();
    } while (ipExists(ip));
    return ip;
}
// Safely add a Server to the AllServers map
function AddToAllServers(server) {
    if (GetServer(server.hostname)) {
        console.warn(`The hostname of the server that's being added is: ${server.hostname}`);
        console.warn(`The server that already has this hostname is: ${AllServers[server.hostname].hostname}`);
        throw new Error(`Error: Trying to add a server with an existing hostname. Hostname: ${server.hostname}.`);
    }
    AllServers[server.hostname] = server;
}
const renameServer = (hostname, newName) => {
    AllServers[newName] = AllServers[hostname];
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete AllServers[hostname];
};
exports.renameServer = renameServer;
function initForeignServers(homeComputer) {
    /* Create a randomized network for all the foreign servers */
    //Groupings for creating a randomized network
    const networkLayers = [];
    for (let i = 0; i < 15; i++) {
        networkLayers.push([]);
    }
    const toNumber = (value) => {
        if (typeof value === "number")
            return value;
        else
            return (0, getRandomIntInclusive_1.getRandomIntInclusive)(value.min, value.max);
    };
    for (const metadata of servers_1.serverMetadata) {
        const serverParams = {
            hostname: metadata.hostname,
            ip: createUniqueRandomIp(),
            numOpenPortsRequired: metadata.numOpenPortsRequired,
            organizationName: metadata.organizationName,
        };
        if (metadata.maxRamExponent !== undefined) {
            serverParams.maxRam = Math.pow(2, toNumber(metadata.maxRamExponent));
        }
        if (metadata.hackDifficulty)
            serverParams.hackDifficulty = toNumber(metadata.hackDifficulty);
        if (metadata.moneyAvailable)
            serverParams.moneyAvailable = toNumber(metadata.moneyAvailable);
        if (metadata.requiredHackingSkill)
            serverParams.requiredHackingSkill = toNumber(metadata.requiredHackingSkill);
        if (metadata.serverGrowth)
            serverParams.serverGrowth = toNumber(metadata.serverGrowth);
        const server = new Server_1.Server(serverParams);
        if (metadata.networkLayer) {
            const layer = toNumber(metadata.networkLayer);
            server.cpuCores = (0, getRandomIntInclusive_1.getRandomIntInclusive)(Math.ceil(layer / 2), layer);
        }
        for (const filename of metadata.literature || []) {
            server.messages.push(filename);
        }
        if (server.hostname === SpecialServers_1.SpecialServers.WorldDaemon) {
            server.requiredHackingSkill *= BitNodeMultipliers_1.currentNodeMults.WorldDaemonDifficulty;
        }
        AddToAllServers(server);
        if (metadata.networkLayer !== undefined) {
            networkLayers[toNumber(metadata.networkLayer) - 1].push(server);
        }
    }
    /* Create a randomized network for all the foreign servers */
    const linkComputers = (server1, server2) => {
        server1.serversOnNetwork.push(server2.hostname);
        server2.serversOnNetwork.push(server1.hostname);
    };
    const getRandomArrayItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const linkNetworkLayers = (network1, selectServer) => {
        for (const server of network1) {
            linkComputers(server, selectServer());
        }
    };
    // Connect the first tier of servers to the player's home computer
    linkNetworkLayers(networkLayers[0], () => homeComputer);
    for (let i = 1; i < networkLayers.length; i++) {
        linkNetworkLayers(networkLayers[i], () => getRandomArrayItem(networkLayers[i - 1]));
    }
}
function prestigeAllServers() {
    for (const member of Object.keys(AllServers)) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete AllServers[member];
    }
    AllServers = {};
}
function loadAllServers(saveString) {
    const allServersData = JSON.parse(saveString, GenericReviver_1.Reviver);
    (0, TypeAssertion_1.assertObject)(allServersData);
    if (Object.keys(allServersData).length === 0) {
        throw new Error("Server list is empty.");
    }
    for (const [serverName, server] of Object.entries(allServersData)) {
        if (!(server instanceof Server_1.Server) && !(server instanceof HacknetServer_1.HacknetServer)) {
            throw new Error(`Server ${serverName} is not an instance of Server or HacknetServer.`);
        }
    }
    // We validated the data above, so it's safe to typecast here.
    AllServers = allServersData;
}
function saveAllServers() {
    return JSON.stringify(AllServers);
}
