"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerObject = void 0;
const augmentationMethods = __importStar(require("./PlayerObjectAugmentationMethods"));
const bladeburnerMethods = __importStar(require("./PlayerObjectBladeburnerMethods"));
const corporationMethods = __importStar(require("./PlayerObjectCorporationMethods"));
const gangMethods = __importStar(require("./PlayerObjectGangMethods"));
const generalMethods = __importStar(require("./PlayerObjectGeneralMethods"));
const serverMethods = __importStar(require("./PlayerObjectServerMethods"));
const workMethods = __importStar(require("./PlayerObjectWorkMethods"));
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const HashManager_1 = require("../../Hacknet/HashManager");
const MoneySourceTracker_1 = require("../../utils/MoneySourceTracker");
const JSONReviver_1 = require("../../utils/JSONReviver");
const Jsonable_1 = require("../../Types/Jsonable");
const HashUtils_1 = require("../../utils/HashUtils");
const getRandomIntInclusive_1 = require("../../utils/helpers/getRandomIntInclusive");
const Constants_1 = require("../../Constants");
const Person_1 = require("../Person");
const EnumHelper_1 = require("../../utils/EnumHelper");
const SleeveSupportWork_1 = require("../Sleeve/Work/SleeveSupportWork");
class PlayerObject extends Person_1.Person {
    get activeSourceFiles() {
        return new Jsonable_1.JSONMap([...this.sourceFiles, ...this.bitNodeOptions.sourceFileOverrides]);
    }
    constructor() {
        super();
        // Player-specific properties
        this.bitNodeN = 1; //current bitnode
        this.corporation = null;
        this.gang = null;
        this.bladeburner = null;
        this.currentServer = "";
        this.factions = [];
        this.factionInvitations = [];
        this.factionRumors = new Jsonable_1.JSONSet();
        this.hacknetNodes = []; // HacknetNode object or hostname of Hacknet Server
        this.has4SData = false;
        this.has4SDataTixApi = false;
        this.hashManager = new HashManager_1.HashManager();
        this.hasTixApiAccess = false;
        this.hasWseAccount = false;
        this.jobs = {};
        this.karma = 0;
        this.numPeopleKilled = 0;
        this.location = _enums_1.LocationName.TravelAgency;
        this.money = 1000 + Constants_1.CONSTANTS.Donations;
        this.moneySourceA = new MoneySourceTracker_1.MoneySourceTracker();
        this.moneySourceB = new MoneySourceTracker_1.MoneySourceTracker();
        this.playtimeSinceLastAug = 0;
        this.playtimeSinceLastBitnode = 0;
        this.lastAugReset = -1;
        this.lastNodeReset = -1;
        this.purchasedServers = [];
        this.scriptProdSinceLastAug = 0;
        this.sleeves = [];
        this.sleevesFromCovenant = 0;
        this.sourceFiles = new Jsonable_1.JSONMap();
        this.exploits = [];
        this.achievements = [];
        this.terminalCommandHistory = [];
        this.lastUpdate = 0;
        this.lastSave = 0;
        this.totalPlaytime = 0;
        this.currentWork = null;
        this.focus = false;
        this.entropy = 0;
        this.bitNodeOptions = {
            sourceFileOverrides: new Jsonable_1.JSONMap(),
            intelligenceOverride: undefined,
            restrictHomePCUpgrade: false,
            disableGang: false,
            disableCorporation: false,
            disableBladeburner: false,
            disable4SData: false,
            disableHacknetServer: false,
            disableSleeveExpAndAugmentation: false,
        };
        // Player-specific methods
        this.init = generalMethods.init;
        this.startWork = workMethods.startWork;
        this.processWork = workMethods.processWork;
        this.finishWork = workMethods.finishWork;
        this.applyForJob = generalMethods.applyForJob;
        this.canAccessBladeburner = bladeburnerMethods.canAccessBladeburner;
        this.canAccessCorporation = corporationMethods.canAccessCorporation;
        this.canAccessGang = gangMethods.canAccessGang;
        this.canAccessGrafting = generalMethods.canAccessGrafting;
        this.canAfford = generalMethods.canAfford;
        this.gainMoney = generalMethods.gainMoney;
        this.getCurrentServer = serverMethods.getCurrentServer;
        this.getGangFaction = gangMethods.getGangFaction;
        this.getGangName = gangMethods.getGangName;
        this.getHomeComputer = serverMethods.getHomeComputer;
        this.getNextCompanyPosition = generalMethods.getNextCompanyPosition;
        this.getUpgradeHomeRamCost = serverMethods.getUpgradeHomeRamCost;
        this.getUpgradeHomeCoresCost = serverMethods.getUpgradeHomeCoresCost;
        this.gotoLocation = generalMethods.gotoLocation;
        this.hasGangWith = gangMethods.hasGangWith;
        this.hasTorRouter = serverMethods.hasTorRouter;
        this.hasProgram = generalMethods.hasProgram;
        this.inGang = gangMethods.inGang;
        this.isAwareOfGang = gangMethods.isAwareOfGang;
        this.isQualified = generalMethods.isQualified;
        this.loseMoney = generalMethods.loseMoney;
        this.reapplyAllAugmentations = generalMethods.reapplyAllAugmentations;
        this.reapplyAllSourceFiles = generalMethods.reapplyAllSourceFiles;
        this.recordMoneySource = generalMethods.recordMoneySource;
        this.setMoney = generalMethods.setMoney;
        this.startBladeburner = bladeburnerMethods.startBladeburner;
        this.startCorporation = corporationMethods.startCorporation;
        this.startFocusing = generalMethods.startFocusing;
        this.startGang = gangMethods.startGang;
        this.takeDamage = generalMethods.takeDamage;
        this.giveExploit = generalMethods.giveExploit;
        this.giveAchievement = generalMethods.giveAchievement;
        this.getCasinoWinnings = generalMethods.getCasinoWinnings;
        this.quitJob = generalMethods.quitJob;
        this.hasJob = generalMethods.hasJob;
        this.createHacknetServer = serverMethods.createHacknetServer;
        this.queueAugmentation = generalMethods.queueAugmentation;
        this.receiveInvite = generalMethods.receiveInvite;
        this.receiveRumor = generalMethods.receiveRumor;
        this.gainCodingContractReward = generalMethods.gainCodingContractReward;
        this.stopFocusing = generalMethods.stopFocusing;
        this.prestigeAugmentation = generalMethods.prestigeAugmentation;
        this.prestigeSourceFile = generalMethods.prestigeSourceFile;
        this.calculateSkillProgress = generalMethods.calculateSkillProgress;
        this.hospitalize = generalMethods.hospitalize;
        this.checkForFactionInvitations = generalMethods.checkForFactionInvitations;
        this.setBitNodeNumber = generalMethods.setBitNodeNumber;
        this.canAccessCotMG = generalMethods.canAccessCotMG;
        this.sourceFileLvl = generalMethods.sourceFileLvl;
        this.activeSourceFileLvl = generalMethods.activeSourceFileLvl;
        this.applyEntropy = augmentationMethods.applyEntropy;
        this.focusPenalty = generalMethods.focusPenalty;
        // Let's get a hash of some semi-random stuff so we have something unique.
        this.identifier = (0, HashUtils_1.cyrb53)("I-" +
            new Date().getTime() +
            navigator.userAgent +
            window.innerWidth +
            window.innerHeight +
            (0, getRandomIntInclusive_1.getRandomIntInclusive)(100, 999));
        this.lastAugReset = this.lastNodeReset = Date.now();
    }
    travelCostMoneySource() {
        return "other";
    }
    whoAmI() {
        return "Player";
    }
    sleevesSupportingBladeburner() {
        return this.sleeves.filter((s) => (0, SleeveSupportWork_1.isSleeveSupportWork)(s.currentWork));
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("PlayerObject", this);
    }
    /** Initializes a PlayerObject object from a JSON save state. */
    static fromJSON(value) {
        const player = (0, JSONReviver_1.Generic_fromJSON)(PlayerObject, value.data);
        // Any statistics that could be infinite would be serialized as null (JSON.stringify(Infinity) is "null")
        player.hp = { current: player.hp?.current ?? 10, max: player.hp?.max ?? 10 };
        player.money ?? (player.money = 0);
        // Just remove from the save file any augs that have invalid name
        player.augmentations = player.augmentations.filter((ownedAug) => (0, EnumHelper_1.isMember)("AugmentationName", ownedAug.name));
        player.queuedAugmentations = player.queuedAugmentations.filter((ownedAug) => (0, EnumHelper_1.isMember)("AugmentationName", ownedAug.name));
        player.updateSkillLevels();
        // Conversion code for Player.sourceFiles is here instead of normal save conversion area because it needs
        // to happen earlier for use in the savegame comparison tool.
        if (Array.isArray(player.sourceFiles)) {
            player.sourceFiles = new Jsonable_1.JSONMap(player.sourceFiles.map(({ n, lvl }) => [n, lvl]));
        }
        // Remove any invalid jobs
        for (const [loadedCompanyName, loadedJobName] of Object.entries(player.jobs)) {
            if (!(0, EnumHelper_1.isMember)("CompanyName", loadedCompanyName) || !(0, EnumHelper_1.isMember)("JobName", loadedJobName)) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete player.jobs[loadedCompanyName];
            }
        }
        return player;
    }
}
exports.PlayerObject = PlayerObject;
(0, _player_1.setPlayer)(new PlayerObject());
JSONReviver_1.constructorsForReviver.PlayerObject = PlayerObject;
