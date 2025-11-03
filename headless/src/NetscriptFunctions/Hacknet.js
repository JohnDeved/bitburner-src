"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetscriptHacknet = NetscriptHacknet;
const _player_1 = require("@player");
const Constants_1 = require("../Hacknet/data/Constants");
const HacknetHelpers_1 = require("../Hacknet/HacknetHelpers");
const HacknetServer_1 = require("../Hacknet/HacknetServer");
const HacknetNode_1 = require("../Hacknet/HacknetNode");
const HashUpgrades_1 = require("../Hacknet/HashUpgrades");
const AllServers_1 = require("../Server/AllServers");
const NetscriptHelpers_1 = require("../Netscript/NetscriptHelpers");
const EnumHelper_1 = require("../utils/EnumHelper");
function NetscriptHacknet() {
    // Utility function to get Hacknet Node object
    const getHacknetNode = function (ctx, i) {
        if (i < 0 || i >= _player_1.Player.hacknetNodes.length) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, "Index specified for Hacknet Node is out-of-bounds: " + i);
        }
        if ((0, HacknetHelpers_1.hasHacknetServers)()) {
            const hi = _player_1.Player.hacknetNodes[i];
            if (typeof hi !== "string")
                throw new Error("hacknet node was not a string");
            const hserver = (0, AllServers_1.GetServer)(hi);
            if (!(hserver instanceof HacknetServer_1.HacknetServer))
                throw new Error("hacknet server was not actually hacknet server");
            if (hserver == null) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Could not get Hacknet Server for index ${i}. This is probably a bug, please report to game dev`);
            }
            return hserver;
        }
        else {
            const node = _player_1.Player.hacknetNodes[i];
            if (!(node instanceof HacknetNode_1.HacknetNode))
                throw new Error("hacknet node was not node.");
            return node;
        }
    };
    return {
        numNodes: () => () => {
            return _player_1.Player.hacknetNodes.length;
        },
        maxNumNodes: () => () => {
            if ((0, HacknetHelpers_1.hasHacknetServers)()) {
                return Constants_1.HacknetServerConstants.MaxServers;
            }
            return Infinity;
        },
        purchaseNode: () => () => {
            return (0, HacknetHelpers_1.purchaseHacknet)();
        },
        getPurchaseNodeCost: () => () => {
            if ((0, HacknetHelpers_1.hasHacknetServers)()) {
                return (0, HacknetHelpers_1.getCostOfNextHacknetServer)();
            }
            else {
                return (0, HacknetHelpers_1.getCostOfNextHacknetNode)();
            }
        },
        getNodeStats: (ctx) => (_i) => {
            const i = NetscriptHelpers_1.helpers.number(ctx, "i", _i);
            const node = getHacknetNode(ctx, i);
            const hasUpgraded = (0, HacknetHelpers_1.hasHacknetServers)();
            const res = {
                name: node instanceof HacknetServer_1.HacknetServer ? node.hostname : node.name,
                level: node.level,
                ram: node instanceof HacknetServer_1.HacknetServer ? node.maxRam : node.ram,
                cores: node.cores,
                production: node instanceof HacknetServer_1.HacknetServer ? node.hashRate : node.moneyGainRatePerSecond,
                timeOnline: node.onlineTimeSeconds,
                totalProduction: node instanceof HacknetServer_1.HacknetServer ? node.totalHashesGenerated : node.totalMoneyGenerated,
            };
            if (hasUpgraded && node instanceof HacknetServer_1.HacknetServer) {
                res.cache = node.cache;
                res.hashCapacity = node.hashCapacity;
                res.ramUsed = node.ramUsed;
            }
            return res;
        },
        upgradeLevel: (ctx) => (_i, _n = 1) => {
            const i = NetscriptHelpers_1.helpers.number(ctx, "i", _i);
            const n = NetscriptHelpers_1.helpers.number(ctx, "n", _n);
            const node = getHacknetNode(ctx, i);
            return (0, HacknetHelpers_1.purchaseLevelUpgrade)(node, n);
        },
        upgradeRam: (ctx) => (_i, _n = 1) => {
            const i = NetscriptHelpers_1.helpers.number(ctx, "i", _i);
            const n = NetscriptHelpers_1.helpers.number(ctx, "n", _n);
            const node = getHacknetNode(ctx, i);
            return (0, HacknetHelpers_1.purchaseRamUpgrade)(node, n);
        },
        upgradeCore: (ctx) => (_i, _n = 1) => {
            const i = NetscriptHelpers_1.helpers.number(ctx, "i", _i);
            const n = NetscriptHelpers_1.helpers.number(ctx, "n", _n);
            const node = getHacknetNode(ctx, i);
            return (0, HacknetHelpers_1.purchaseCoreUpgrade)(node, n);
        },
        upgradeCache: (ctx) => (_i, _n = 1) => {
            const i = NetscriptHelpers_1.helpers.number(ctx, "i", _i);
            const n = NetscriptHelpers_1.helpers.number(ctx, "n", _n);
            if (!(0, HacknetHelpers_1.hasHacknetServers)()) {
                return false;
            }
            const node = getHacknetNode(ctx, i);
            if (!(node instanceof HacknetServer_1.HacknetServer)) {
                NetscriptHelpers_1.helpers.log(ctx, () => "Can only be called on hacknet servers");
                return false;
            }
            const res = (0, HacknetHelpers_1.purchaseCacheUpgrade)(node, n);
            if (res) {
                (0, HacknetHelpers_1.updateHashManagerCapacity)();
            }
            return res;
        },
        getLevelUpgradeCost: (ctx) => (_i, _n = 1) => {
            const i = NetscriptHelpers_1.helpers.number(ctx, "i", _i);
            const n = NetscriptHelpers_1.helpers.number(ctx, "n", _n);
            const node = getHacknetNode(ctx, i);
            return node.calculateLevelUpgradeCost(n, _player_1.Player.mults.hacknet_node_level_cost);
        },
        getRamUpgradeCost: (ctx) => (_i, _n = 1) => {
            const i = NetscriptHelpers_1.helpers.number(ctx, "i", _i);
            const n = NetscriptHelpers_1.helpers.number(ctx, "n", _n);
            const node = getHacknetNode(ctx, i);
            return node.calculateRamUpgradeCost(n, _player_1.Player.mults.hacknet_node_ram_cost);
        },
        getCoreUpgradeCost: (ctx) => (_i, _n = 1) => {
            const i = NetscriptHelpers_1.helpers.number(ctx, "i", _i);
            const n = NetscriptHelpers_1.helpers.number(ctx, "n", _n);
            const node = getHacknetNode(ctx, i);
            return node.calculateCoreUpgradeCost(n, _player_1.Player.mults.hacknet_node_core_cost);
        },
        getCacheUpgradeCost: (ctx) => (_i, _n = 1) => {
            const i = NetscriptHelpers_1.helpers.number(ctx, "i", _i);
            const n = NetscriptHelpers_1.helpers.number(ctx, "n", _n);
            if (!(0, HacknetHelpers_1.hasHacknetServers)()) {
                return Infinity;
            }
            const node = getHacknetNode(ctx, i);
            if (!(node instanceof HacknetServer_1.HacknetServer)) {
                NetscriptHelpers_1.helpers.log(ctx, () => "Can only be called on hacknet servers");
                return -1;
            }
            return node.calculateCacheUpgradeCost(n);
        },
        numHashes: () => () => {
            if (!(0, HacknetHelpers_1.hasHacknetServers)()) {
                return 0;
            }
            return _player_1.Player.hashManager.hashes;
        },
        hashCapacity: () => () => {
            if (!(0, HacknetHelpers_1.hasHacknetServers)()) {
                return 0;
            }
            return _player_1.Player.hashManager.capacity;
        },
        hashCost: (ctx) => (_upgName, _count = 1) => {
            const upgName = (0, EnumHelper_1.getEnumHelper)("HashUpgradeEnum").nsGetMember(ctx, _upgName);
            const count = NetscriptHelpers_1.helpers.number(ctx, "count", _count);
            if (!(0, HacknetHelpers_1.hasHacknetServers)()) {
                return Infinity;
            }
            return _player_1.Player.hashManager.getUpgradeCost(upgName, count);
        },
        spendHashes: (ctx) => (_upgName, _upgTarget = "", _count = 1) => {
            const upgName = (0, EnumHelper_1.getEnumHelper)("HashUpgradeEnum").nsGetMember(ctx, _upgName);
            const upgTarget = NetscriptHelpers_1.helpers.string(ctx, "upgTarget", _upgTarget);
            const count = NetscriptHelpers_1.helpers.integer(ctx, "count", _count);
            if (count < 0) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, "Count must be a non-negative integer.");
            }
            if (!(0, HacknetHelpers_1.hasHacknetServers)()) {
                return false;
            }
            const result = (0, HacknetHelpers_1.purchaseHashUpgrade)(upgName, upgTarget, count);
            if (!result.success) {
                NetscriptHelpers_1.helpers.log(ctx, () => result.message);
            }
            return result.success;
        },
        getHashUpgrades: () => () => {
            if (!(0, HacknetHelpers_1.hasHacknetServers)()) {
                return [];
            }
            return Object.values(HashUpgrades_1.HashUpgrades).map((upgrade) => upgrade.name);
        },
        getHashUpgradeLevel: (ctx) => (_upgName) => {
            const upgName = NetscriptHelpers_1.helpers.string(ctx, "upgName", _upgName);
            const level = _player_1.Player.hashManager.upgrades[upgName];
            if (level === undefined) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid Hash Upgrade: ${upgName}`);
            }
            return level;
        },
        getStudyMult: () => () => {
            if (!(0, HacknetHelpers_1.hasHacknetServers)()) {
                return 1;
            }
            return _player_1.Player.hashManager.getStudyMult();
        },
        getTrainingMult: () => () => {
            if (!(0, HacknetHelpers_1.hasHacknetServers)()) {
                return 1;
            }
            return _player_1.Player.hashManager.getTrainingMult();
        },
    };
}
