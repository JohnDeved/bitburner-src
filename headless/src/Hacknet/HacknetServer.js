"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HacknetServer = void 0;
const Constants_1 = require("../Constants");
const BaseServer_1 = require("../Server/BaseServer");
const Constants_2 = require("./data/Constants");
const HacknetServers_1 = require("./formulas/HacknetServers");
const IPAddress_1 = require("../utils/IPAddress");
const JSONReviver_1 = require("../utils/JSONReviver");
const _player_1 = require("@player");
/** Hacknet Servers - Reworked Hacknet Node mechanic for BitNode-9 */
class HacknetServer extends BaseServer_1.BaseServer {
    constructor(params = { hostname: "", ip: (0, IPAddress_1.createRandomIp)() }) {
        super(params);
        // Cache level. Affects hash Capacity
        this.cache = 1;
        // Number of cores. Improves hash production
        this.cores = 1;
        // Number of hashes that can be stored by this Hacknet Server
        this.hashCapacity = 0;
        // Hashes produced per second
        this.hashRate = 0;
        // Similar to Node level. Improves hash production
        this.level = 1;
        // How long this HacknetServer has existed, in seconds
        this.onlineTimeSeconds = 0;
        // Total number of hashes earned by this server
        this.totalHashesGenerated = 0;
        // Flag indicating whether this is a purchased server
        this.purchasedByPlayer = true;
        this.isHacknetServer = true;
        this.maxRam = 1;
        this.updateHashCapacity();
    }
    calculateCacheUpgradeCost(levels) {
        return (0, HacknetServers_1.calculateCacheUpgradeCost)(this.cache, levels);
    }
    calculateCoreUpgradeCost(levels, costMult) {
        return (0, HacknetServers_1.calculateCoreUpgradeCost)(this.cores, levels, costMult);
    }
    calculateLevelUpgradeCost(levels, costMult) {
        return (0, HacknetServers_1.calculateLevelUpgradeCost)(this.level, levels, costMult);
    }
    calculateRamUpgradeCost(levels, costMult) {
        return (0, HacknetServers_1.calculateRamUpgradeCost)(this.maxRam, levels, costMult);
    }
    // Process this Hacknet Server in the game loop. Returns the number of hashes generated
    process(numCycles = 1) {
        const seconds = (numCycles * Constants_1.CONSTANTS.MilliPerCycle) / 1000;
        this.onlineTimeSeconds += seconds;
        const hashes = this.hashRate * seconds;
        this.totalHashesGenerated += hashes;
        return hashes;
    }
    upgradeCache(levels) {
        this.cache = Math.min(Constants_2.HacknetServerConstants.MaxCache, Math.round(this.cache + levels));
        this.updateHashCapacity();
    }
    upgradeCore(levels, prodMult) {
        this.cores = Math.min(Constants_2.HacknetServerConstants.MaxCores, Math.round(this.cores + levels));
        this.updateHashRate(prodMult);
        this.cpuCores = this.cores;
    }
    upgradeLevel(levels, prodMult) {
        this.level = Math.min(Constants_2.HacknetServerConstants.MaxLevel, Math.round(this.level + levels));
        this.updateHashRate(prodMult);
    }
    upgradeRam(levels, prodMult) {
        this.maxRam *= Math.pow(2, levels);
        this.maxRam = Math.min(Constants_2.HacknetServerConstants.MaxRam, Math.round(this.maxRam));
        this.updateHashRate(prodMult);
        return true;
    }
    updateRamUsed(ram) {
        super.updateRamUsed(ram);
        this.updateHashRate(_player_1.Player.mults.hacknet_node_money);
    }
    updateHashCapacity() {
        this.hashCapacity = 32 * Math.pow(2, this.cache);
    }
    updateHashRate(prodMult) {
        this.hashRate = (0, HacknetServers_1.calculateHashGainRate)(this.level, this.ramUsed, this.maxRam, this.cores, prodMult);
        if (isNaN(this.hashRate)) {
            this.hashRate = 0;
            console.error(`Error calculating Hacknet Server hash production. This is a bug. Please report to game dev`, false);
        }
    }
    // Serialize the current object to a JSON save state
    toJSON() {
        return this.toJSONBase("HacknetServer", includedKeys);
    }
    // Initializes a HacknetServer Object from a JSON save state
    static fromJSON(value) {
        return BaseServer_1.BaseServer.fromJSONBase(value, HacknetServer, includedKeys);
    }
}
exports.HacknetServer = HacknetServer;
const includedKeys = BaseServer_1.BaseServer.getIncludedKeys(HacknetServer);
JSONReviver_1.constructorsForReviver.HacknetServer = HacknetServer;
