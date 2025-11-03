"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
// Class representing a single hackable Server
const BaseServer_1 = require("./BaseServer");
const BitNodeMultipliers_1 = require("../BitNode/BitNodeMultipliers");
const createRandomString_1 = require("../utils/helpers/createRandomString");
const IPAddress_1 = require("../utils/IPAddress");
const JSONReviver_1 = require("../utils/JSONReviver");
class Server extends BaseServer_1.BaseServer {
    constructor(params = { hostname: "", ip: (0, IPAddress_1.createRandomIp)() }) {
        super(params);
        // Flag indicating whether this server has a backdoor installed by a player
        this.backdoorInstalled = false;
        // Initial server security level
        // (i.e. security level when the server was created)
        this.baseDifficulty = 1;
        // Server Security Level
        this.hackDifficulty = 1;
        // Minimum server security level that this server can be weakened to
        this.minDifficulty = 1;
        // How much money currently resides on the server and can be hacked
        this.moneyAvailable = 0;
        // Maximum amount of money that this server can hold
        this.moneyMax = 0;
        // Number of open ports required in order to gain admin/root access
        this.numOpenPortsRequired = 5;
        // How many ports are currently opened on the server
        this.openPortCount = 0;
        // Hacking level required to hack this server
        this.requiredHackingSkill = 1;
        // Parameter that affects how effectively this server's money can
        // be increased using the grow() Netscript function
        this.serverGrowth = 1;
        // "hacknet-node-X" hostnames are reserved for Hacknet Servers
        if (this.hostname.startsWith("hacknet-node-") || this.hostname.startsWith("hacknet-server-")) {
            this.hostname = (0, createRandomString_1.createRandomString)(10);
        }
        this.purchasedByPlayer = params.purchasedByPlayer != null ? params.purchasedByPlayer : false;
        //RAM, CPU speed and Scripts
        this.maxRam = params.maxRam != null ? params.maxRam : 0; //GB
        /* Hacking information (only valid for "foreign" aka non-purchased servers) */
        this.requiredHackingSkill = params.requiredHackingSkill != null ? params.requiredHackingSkill : 1;
        const baseMoney = params.moneyAvailable ?? 0;
        this.moneyAvailable = baseMoney * BitNodeMultipliers_1.currentNodeMults.ServerStartingMoney;
        this.moneyMax = 25 * baseMoney * BitNodeMultipliers_1.currentNodeMults.ServerMaxMoney;
        //Hack Difficulty is synonymous with server security. Base Difficulty = Starting difficulty
        const realDifficulty = params.hackDifficulty != null ? params.hackDifficulty * BitNodeMultipliers_1.currentNodeMults.ServerStartingSecurity : 1;
        this.hackDifficulty = Math.min(realDifficulty, 100);
        this.baseDifficulty = this.hackDifficulty;
        this.minDifficulty = Math.min(Math.max(1, Math.round(realDifficulty / 3)), 100);
        this.serverGrowth = params.serverGrowth != null ? params.serverGrowth : 1; //Integer from 0 to 100. Affects money increase from grow()
        //Port information, required for porthacking servers to get admin rights
        this.numOpenPortsRequired = params.numOpenPortsRequired != null ? params.numOpenPortsRequired : 5;
    }
    /** Ensures that the server's difficulty (server security) doesn't get too high */
    capDifficulty() {
        if (this.hackDifficulty < this.minDifficulty) {
            this.hackDifficulty = this.minDifficulty;
        }
        if (this.hackDifficulty < 1) {
            this.hackDifficulty = 1;
        }
        // Place some arbitrarily limit that realistically should never happen unless someone is
        // screwing around with the game
        if (this.hackDifficulty > 100) {
            this.hackDifficulty = 100;
        }
    }
    /**
     * Change this server's minimum security
     * @param n - Value by which to increase/decrease the server's minimum security
     * @param perc - Whether it should be changed by a percentage, or a flat value
     */
    changeMinimumSecurity(n, perc = false) {
        if (perc) {
            this.minDifficulty *= n;
        }
        else {
            this.minDifficulty += n;
        }
        // Server security cannot go below 1
        this.minDifficulty = Math.max(1, this.minDifficulty);
    }
    /**
     * Change this server's maximum money
     * @param n - Value by which to change the server's maximum money
     */
    changeMaximumMoney(n) {
        const softCap = 10e12;
        if (this.moneyMax > softCap) {
            const aboveCap = this.moneyMax - softCap;
            n = 1 + (n - 1) / Math.log(aboveCap) / Math.log(8);
        }
        this.moneyMax *= n;
    }
    /** Strengthens a server's security level (difficulty) by the specified amount */
    fortify(amt) {
        this.hackDifficulty += amt;
        this.capDifficulty();
    }
    /** Lowers the server's security level (difficulty) by the specified amount) */
    weaken(amt) {
        this.hackDifficulty -= amt;
        this.capDifficulty();
    }
    /** Serialize the current object to a JSON save state */
    toJSON() {
        return this.toJSONBase("Server", includedKeys);
    }
    // Initializes a Server Object from a JSON save state
    static fromJSON(value) {
        return BaseServer_1.BaseServer.fromJSONBase(value, Server, includedKeys);
    }
}
exports.Server = Server;
const includedKeys = BaseServer_1.BaseServer.getIncludedKeys(Server);
JSONReviver_1.constructorsForReviver.Server = Server;
