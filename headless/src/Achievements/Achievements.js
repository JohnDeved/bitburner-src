"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.achievements = void 0;
exports.calculateAchievements = calculateAchievements;
const _enums_1 = require("@enums");
const Skills_1 = require("../Bladeburner/data/Skills");
const Constants_1 = require("../Constants");
const Exploit_1 = require("../Exploits/Exploit");
const Factions_1 = require("../Faction/Factions");
const AllGangs_1 = require("../Gang/AllGangs");
const Constants_2 = require("../Gang/data/Constants");
const Constants_3 = require("../Hacknet/data/Constants");
const HacknetHelpers_1 = require("../Hacknet/HacknetHelpers");
const HacknetNode_1 = require("../Hacknet/HacknetNode");
const HacknetServer_1 = require("../Hacknet/HacknetServer");
const _player_1 = require("@player");
const AllServers_1 = require("../Server/AllServers");
const Server_1 = require("../Server/Server");
const GameRoot_1 = require("../ui/GameRoot");
const Router_1 = require("../ui/Router");
const AchievementData_json_1 = __importDefault(require("./AchievementData.json"));
const ClassWork_1 = require("../Work/ClassWork");
const BitNodeMultipliers_1 = require("../BitNode/BitNodeMultipliers");
const WorkerScripts_1 = require("../Netscript/WorkerScripts");
const Record_1 = require("../Types/Record");
const Constants_4 = require("../Server/data/Constants");
const BitNodeUtils_1 = require("../BitNode/BitNodeUtils");
const Constants_5 = require("../BitNode/Constants");
const ScriptFilePath_1 = require("../Paths/ScriptFilePath");
const Settings_1 = require("../Settings/Settings");
const Electron_1 = require("../Electron");
const Go_1 = require("../Go/Go");
const Types_1 = require("./Types");
function assertAchievements(achievements) {
    for (const [key, value] of Object.entries(achievements)) {
        if (key !== value.ID) {
            throw new Error(`Invalid achievement ID. Key: ${key}. Value: ${value.ID}`);
        }
    }
}
/**
 * The type of data.achievements is:
  {
    CYBERSEC: {
        ID: string;
        Name: string;
        Description: string;
    };
    NITESEC: {
        ID: string;
        Name: string;
        Description: string;
    };
    ...
  }
 * However, we want:
 * - Typechecking at compile time: ID must be AchievementId, not string.
 * - Runtime check: The value of ID must be the same as the key of the achievement. For example, with "CYBERSEC"
 * achievement, the key is "CYBERSEC", so its ID must also be "CYBERSEC".
 *
 * We use assertAchievements to do the runtime check and assert the type.
 */
const achievementData = AchievementData_json_1.default.achievements;
assertAchievements(achievementData);
function sfAchievements() {
    const achievements = {};
    for (const id of Types_1.SFAchievementIds) {
        const matchResult = id.match(/SF(\d{1,2})\.1/);
        if (!matchResult) {
            throw new Error(`Unexpected SFAchievementId: ${id}`);
        }
        const bn = Number.parseInt(matchResult[1]);
        if (!Constants_5.validBitNodes.includes(bn)) {
            throw new Error(`Unexpected BN value in SFAchievementId: ${id}`);
        }
        achievements[id] = {
            /**
             * The type of achievementData is still the original type (CYBERSEC: { ID: string; Name: string; Description: string; }).
             * We have to typecast it here.
             */
            ...achievementData[id],
            Icon: id,
            Visible: BitNodeUtils_1.knowAboutBitverse,
            Condition: () => _player_1.Player.sourceFileLvl(bn) >= 1,
            NotInSteam: bn >= 13,
        };
    }
    return achievements;
}
exports.achievements = {
    CYBERSEC: {
        ...achievementData.CYBERSEC,
        Icon: "CSEC",
        Condition: () => _player_1.Player.factions.includes(_enums_1.FactionName.CyberSec),
    },
    NITESEC: {
        ...achievementData.NITESEC,
        Icon: "NiteSec",
        Condition: () => _player_1.Player.factions.includes(_enums_1.FactionName.NiteSec),
    },
    THE_BLACK_HAND: {
        ...achievementData.THE_BLACK_HAND,
        Icon: "TBH",
        Condition: () => _player_1.Player.factions.includes(_enums_1.FactionName.TheBlackHand),
    },
    BITRUNNERS: {
        ...achievementData.BITRUNNERS,
        Icon: "bitrunners",
        Condition: () => _player_1.Player.factions.includes(_enums_1.FactionName.BitRunners),
    },
    DAEDALUS: {
        ...achievementData.DAEDALUS,
        Icon: "daedalus",
        Condition: () => _player_1.Player.factions.includes(_enums_1.FactionName.Daedalus),
    },
    THE_COVENANT: {
        ...achievementData.THE_COVENANT,
        Icon: "thecovenant",
        Condition: () => _player_1.Player.factions.includes(_enums_1.FactionName.TheCovenant),
    },
    ILLUMINATI: {
        ...achievementData.ILLUMINATI,
        Icon: "illuminati",
        Condition: () => _player_1.Player.factions.includes(_enums_1.FactionName.Illuminati),
    },
    "BRUTESSH.EXE": {
        ...achievementData["BRUTESSH.EXE"],
        Icon: "p0",
        Condition: () => _player_1.Player.getHomeComputer().programs.includes(_enums_1.CompletedProgramName.bruteSsh),
    },
    "FTPCRACK.EXE": {
        ...achievementData["FTPCRACK.EXE"],
        Icon: "p1",
        Condition: () => _player_1.Player.getHomeComputer().programs.includes(_enums_1.CompletedProgramName.ftpCrack),
    },
    //-----------------------------------------------------
    "RELAYSMTP.EXE": {
        ...achievementData["RELAYSMTP.EXE"],
        Icon: "p2",
        Condition: () => _player_1.Player.getHomeComputer().programs.includes(_enums_1.CompletedProgramName.relaySmtp),
    },
    "HTTPWORM.EXE": {
        ...achievementData["HTTPWORM.EXE"],
        Icon: "p3",
        Condition: () => _player_1.Player.getHomeComputer().programs.includes(_enums_1.CompletedProgramName.httpWorm),
    },
    "SQLINJECT.EXE": {
        ...achievementData["SQLINJECT.EXE"],
        Icon: "p4",
        Condition: () => _player_1.Player.getHomeComputer().programs.includes(_enums_1.CompletedProgramName.sqlInject),
    },
    "FORMULAS.EXE": {
        ...achievementData["FORMULAS.EXE"],
        Icon: "formulas",
        Condition: () => _player_1.Player.getHomeComputer().programs.includes(_enums_1.CompletedProgramName.formulas),
    },
    ...sfAchievements(),
    MONEY_1Q: {
        ...achievementData.MONEY_1Q,
        Icon: "$1Q",
        Condition: () => _player_1.Player.money >= 1e18,
    },
    MONEY_M1B: {
        ...achievementData.MONEY_M1B,
        Icon: "-1b",
        Secret: true,
        Condition: () => _player_1.Player.money <= -1e9,
    },
    INSTALL_1: {
        ...achievementData.INSTALL_1,
        Icon: "install",
        Condition: () => _player_1.Player.augmentations.length >= 1,
    },
    INSTALL_100: {
        ...achievementData.INSTALL_100,
        Icon: "install_100",
        Condition: () => _player_1.Player.augmentations.length >= 100,
    },
    QUEUE_40: {
        ...achievementData.QUEUE_40,
        Icon: "queue40",
        Condition: () => _player_1.Player.queuedAugmentations.length >= 40,
    },
    HACKING_100000: {
        ...achievementData.HACKING_100000,
        Icon: "hack100000",
        Condition: () => _player_1.Player.skills.hacking >= 100000,
    },
    COMBAT_3000: {
        ...achievementData.COMBAT_3000,
        Icon: "combat3000",
        Condition: () => _player_1.Player.skills.strength >= 3000 &&
            _player_1.Player.skills.defense >= 3000 &&
            _player_1.Player.skills.dexterity >= 3000 &&
            _player_1.Player.skills.agility >= 3000,
    },
    NEUROFLUX_255: {
        ...achievementData.NEUROFLUX_255,
        Icon: "nfg255",
        Condition: () => _player_1.Player.augmentations.some((a) => a.name === _enums_1.AugmentationName.NeuroFluxGovernor && a.level >= 255),
    },
    NS2: {
        ...achievementData.NS2,
        Icon: "ns2",
        Condition: () => [..._player_1.Player.getHomeComputer().scripts.values()].some((s) => !(0, ScriptFilePath_1.isLegacyScript)(s.filename)),
    },
    FROZE: {
        ...achievementData.FROZE,
        Icon: "frozen",
        Condition: () => location.href.includes("noScripts"),
    },
    RUNNING_SCRIPTS_1000: {
        ...achievementData.RUNNING_SCRIPTS_1000,
        Icon: "run1000",
        Condition: () => WorkerScripts_1.workerScripts.size >= 1000,
    },
    DRAIN_SERVER: {
        ...achievementData.DRAIN_SERVER,
        Icon: "drain",
        Condition: () => {
            for (const s of (0, AllServers_1.GetAllServers)()) {
                if (s instanceof Server_1.Server) {
                    if (s.moneyMax > 0 && s.moneyAvailable === 0)
                        return true;
                }
            }
            return false;
        },
    },
    MAX_RAM: {
        ...achievementData.MAX_RAM,
        Icon: "maxram",
        Condition: () => _player_1.Player.getHomeComputer().maxRam === Constants_4.ServerConstants.HomeComputerMaxRam,
    },
    MAX_CORES: {
        ...achievementData.MAX_CORES,
        Icon: "maxcores",
        Condition: () => _player_1.Player.getHomeComputer().cpuCores === 8,
    },
    SCRIPTS_30: {
        ...achievementData.SCRIPTS_30,
        Icon: "folders",
        Condition: () => _player_1.Player.getHomeComputer().scripts.size >= 30,
    },
    KARMA_1000000: {
        ...achievementData.KARMA_1000000,
        Icon: "karma",
        Secret: true,
        Condition: () => _player_1.Player.karma <= -1e6,
    },
    STOCK_1q: {
        ...achievementData.STOCK_1q,
        Icon: "$1Q",
        Condition: () => _player_1.Player.moneySourceB.stock >= 1e15,
    },
    DISCOUNT: {
        ...achievementData.DISCOUNT,
        Icon: "discount",
        Condition: () => {
            const p = (0, AllServers_1.GetServer)("powerhouse-fitness");
            if (!(p instanceof Server_1.Server))
                return false;
            return p.backdoorInstalled;
        },
    },
    SCRIPT_32GB: {
        ...achievementData.SCRIPT_32GB,
        Icon: "bigcost",
        Condition: () => [..._player_1.Player.getHomeComputer().scripts.values()].some((s) => (s.ramUsage ?? 0) >= 32),
    },
    FIRST_HACKNET_NODE: {
        ...achievementData.FIRST_HACKNET_NODE,
        Icon: "node",
        Condition: () => !(0, HacknetHelpers_1.hasHacknetServers)() && _player_1.Player.hacknetNodes.length > 0,
    },
    "30_HACKNET_NODE": {
        ...achievementData["30_HACKNET_NODE"],
        Icon: "hacknet-all",
        Condition: () => !(0, HacknetHelpers_1.hasHacknetServers)() && _player_1.Player.hacknetNodes.length >= 30,
    },
    MAX_HACKNET_NODE: {
        ...achievementData.MAX_HACKNET_NODE,
        Icon: "hacknet-max",
        Condition: () => {
            if ((0, HacknetHelpers_1.hasHacknetServers)())
                return false;
            for (const h of _player_1.Player.hacknetNodes) {
                if (!(h instanceof HacknetNode_1.HacknetNode))
                    return false;
                if (h.ram === Constants_3.HacknetNodeConstants.MaxRam &&
                    h.cores === Constants_3.HacknetNodeConstants.MaxCores &&
                    h.level === Constants_3.HacknetNodeConstants.MaxLevel)
                    return true;
            }
            return false;
        },
    },
    HACKNET_NODE_10M: {
        ...achievementData.HACKNET_NODE_10M,
        Icon: "hacknet-10m",
        Condition: () => !(0, HacknetHelpers_1.hasHacknetServers)() && _player_1.Player.moneySourceB.hacknet >= 10e6,
    },
    REPUTATION_10M: {
        ...achievementData.REPUTATION_10M,
        Icon: "reputation",
        Condition: () => Object.values(Factions_1.Factions).some((f) => f.playerReputation >= 10e6),
    },
    DONATION: {
        ...achievementData.DONATION,
        Icon: "donation",
        Condition: () => Object.values(Factions_1.Factions).some((f) => f.favor >= Math.floor(Constants_1.CONSTANTS.BaseFavorToDonate * BitNodeMultipliers_1.currentNodeMults.FavorToDonateToFaction)),
    },
    TRAVEL: {
        ...achievementData.TRAVEL,
        Icon: "TRAVEL",
        Condition: () => _player_1.Player.city !== _enums_1.CityName.Sector12,
    },
    WORKOUT: {
        ...achievementData.WORKOUT,
        Icon: "WORKOUT",
        Condition: () => (0, ClassWork_1.isClassWork)(_player_1.Player.currentWork) && _player_1.Player.currentWork.isGym(),
    },
    TOR: {
        ...achievementData.TOR,
        Icon: "TOR",
        Condition: () => _player_1.Player.hasTorRouter(),
    },
    HOSPITALIZED: {
        ...achievementData.HOSPITALIZED,
        Icon: "OUCH",
        Condition: () => _player_1.Player.moneySourceB.hospitalization !== 0,
    },
    GANG: {
        ...achievementData.GANG,
        Icon: "GANG",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(2),
        Condition: () => _player_1.Player.gang !== null,
    },
    FULL_GANG: {
        ...achievementData.FULL_GANG,
        Icon: "GANGMAX",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(2),
        Condition: () => _player_1.Player.gang !== null && _player_1.Player.gang.members.length === Constants_2.GangConstants.MaximumGangMembers,
    },
    GANG_TERRITORY: {
        ...achievementData.GANG_TERRITORY,
        Icon: "GANG100%",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(2),
        Condition: () => _player_1.Player.gang !== null && AllGangs_1.AllGangs[_player_1.Player.gang.facName].territory >= 0.999,
    },
    GANG_MEMBER_POWER: {
        ...achievementData.GANG_MEMBER_POWER,
        Icon: "GANG10000",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(2),
        Condition: () => _player_1.Player.gang !== null &&
            _player_1.Player.gang.members.some((m) => m.hack >= 10000 || m.str >= 10000 || m.def >= 10000 || m.dex >= 10000 || m.agi >= 10000 || m.cha >= 10000),
    },
    CORPORATION: {
        ...achievementData.CORPORATION,
        Icon: "CORP",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(3),
        Condition: () => _player_1.Player.corporation !== null,
    },
    CORPORATION_BRIBE: {
        ...achievementData.CORPORATION_BRIBE,
        Icon: "CORPLOBBY",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(3),
        Condition: () => !!_player_1.Player.corporation && _player_1.Player.corporation.unlocks.has(_enums_1.CorpUnlockName.GovernmentPartnership),
    },
    CORPORATION_PROD_1000: {
        ...achievementData.CORPORATION_PROD_1000,
        Icon: "CORP1000",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(3),
        Condition: () => {
            if (!_player_1.Player.corporation)
                return false;
            for (const division of _player_1.Player.corporation.divisions.values()) {
                if (division.productionMult >= 1000)
                    return true;
            }
            return false;
        },
    },
    CORPORATION_EMPLOYEE_3000: {
        ...achievementData.CORPORATION_EMPLOYEE_3000,
        Icon: "CORPCITY",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(3),
        Condition: () => {
            if (!_player_1.Player.corporation)
                return false;
            for (const division of _player_1.Player.corporation.divisions.values()) {
                const totalEmployees = (0, Record_1.getRecordValues)(division.offices).reduce((a, b) => a + b.numEmployees, 0);
                if (totalEmployees >= 3000)
                    return true;
            }
            return false;
        },
    },
    CORPORATION_REAL_ESTATE: {
        ...achievementData.CORPORATION_REAL_ESTATE,
        Icon: "CORPRE",
        Name: "Own the land",
        Description: "Expand to the Real Estate division.",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(3),
        Condition: () => {
            if (!_player_1.Player.corporation)
                return false;
            for (const division of _player_1.Player.corporation.divisions.values()) {
                if (division.industry === _enums_1.IndustryType.RealEstate)
                    return true;
            }
            return false;
        },
    },
    INTELLIGENCE_255: {
        ...achievementData.INTELLIGENCE_255,
        Icon: "INT255",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(5),
        Condition: () => _player_1.Player.skills.intelligence >= 255,
    },
    BLADEBURNER_DIVISION: {
        ...achievementData.BLADEBURNER_DIVISION,
        Icon: "BLADE",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(6),
        Condition: () => _player_1.Player.bladeburner !== null,
    },
    BLADEBURNER_OVERCLOCK: {
        ...achievementData.BLADEBURNER_OVERCLOCK,
        Icon: "BLADEOVERCLOCK",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(6),
        Condition: () => _player_1.Player.bladeburner?.getSkillLevel(_enums_1.BladeburnerSkillName.Overclock) ===
            Skills_1.Skills[_enums_1.BladeburnerSkillName.Overclock].maxLvl,
    },
    BLADEBURNER_UNSPENT_100000: {
        ...achievementData.BLADEBURNER_UNSPENT_100000,
        Icon: "BLADE100K",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(6),
        Condition: () => _player_1.Player.bladeburner !== null && _player_1.Player.bladeburner.skillPoints >= 100000,
    },
    "4S": {
        ...achievementData["4S"],
        Icon: "4S",
        Condition: () => _player_1.Player.has4SData,
    },
    FIRST_HACKNET_SERVER: {
        ...achievementData.FIRST_HACKNET_SERVER,
        Icon: "HASHNET",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(9),
        Condition: () => (0, HacknetHelpers_1.hasHacknetServers)() && _player_1.Player.hacknetNodes.length > 0,
        AdditionalUnlock: [achievementData.FIRST_HACKNET_NODE.ID],
    },
    ALL_HACKNET_SERVER: {
        ...achievementData.ALL_HACKNET_SERVER,
        Icon: "HASHNETALL",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(9),
        Condition: () => (0, HacknetHelpers_1.hasHacknetServers)() && _player_1.Player.hacknetNodes.length === Constants_3.HacknetServerConstants.MaxServers,
        AdditionalUnlock: [achievementData["30_HACKNET_NODE"].ID],
    },
    MAX_HACKNET_SERVER: {
        ...achievementData.MAX_HACKNET_SERVER,
        Icon: "HASHNETALL",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(9),
        Condition: () => {
            if (!(0, HacknetHelpers_1.hasHacknetServers)())
                return false;
            for (const h of _player_1.Player.hacknetNodes) {
                if (typeof h !== "string")
                    return false;
                const hs = (0, AllServers_1.GetServer)(h);
                if (!(hs instanceof HacknetServer_1.HacknetServer))
                    return false;
                if (hs.maxRam === Constants_3.HacknetServerConstants.MaxRam &&
                    hs.cores === Constants_3.HacknetServerConstants.MaxCores &&
                    hs.level === Constants_3.HacknetServerConstants.MaxLevel &&
                    hs.cache === Constants_3.HacknetServerConstants.MaxCache)
                    return true;
            }
            return false;
        },
        AdditionalUnlock: [achievementData.MAX_HACKNET_NODE.ID],
    },
    HACKNET_SERVER_1B: {
        ...achievementData.HACKNET_SERVER_1B,
        Icon: "HASHNETMONEY",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(9),
        Condition: () => (0, HacknetHelpers_1.hasHacknetServers)() && _player_1.Player.moneySourceB.hacknet >= 1e9,
        AdditionalUnlock: [achievementData.HACKNET_NODE_10M.ID],
    },
    MAX_CACHE: {
        ...achievementData.MAX_CACHE,
        Icon: "HASHNETCAP",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(9),
        Condition: () => (0, HacknetHelpers_1.hasHacknetServers)() &&
            _player_1.Player.hashManager.hashes === _player_1.Player.hashManager.capacity &&
            _player_1.Player.hashManager.capacity > 0,
    },
    SLEEVE_8: {
        ...achievementData.SLEEVE_8,
        Icon: "SLEEVE8",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(10),
        Condition: () => _player_1.Player.sleeves.length === 8 && _player_1.Player.sourceFileLvl(10) === 3,
    },
    INDECISIVE: {
        ...achievementData.INDECISIVE,
        Icon: "1H",
        Visible: BitNodeUtils_1.knowAboutBitverse,
        Condition: (function () {
            let c = 0;
            setInterval(() => {
                if (GameRoot_1.Router.page() === Router_1.Page.BitVerse) {
                    c++;
                }
                else {
                    c = 0;
                }
            }, 60 * 1000);
            return () => c > 60;
        })(),
    },
    FAST_BN: {
        ...achievementData.FAST_BN,
        Icon: "2DAYS",
        Visible: BitNodeUtils_1.knowAboutBitverse,
        Condition: () => (0, BitNodeUtils_1.isBitNodeFinished)() && _player_1.Player.playtimeSinceLastBitnode < 1000 * 60 * 60 * 24 * 2,
    },
    BN_DESTROYER: {
        ...achievementData.BN_DESTROYER,
        Icon: "bn-destroyer",
        Visible: BitNodeUtils_1.knowAboutBitverse,
        Condition: () => Constants_5.validBitNodes.every((bn) => _player_1.Player.sourceFileLvl(bn) >= 3),
        NotInSteam: true,
    },
    IPVGO_ANTICHEAT: {
        ...achievementData.IPVGO_ANTICHEAT,
        Icon: "ipvgo-anticheat",
        Visible: BitNodeUtils_1.knowAboutBitverse,
        Condition: () => false,
        NotInSteam: true,
    },
    IPVGO_WINNING_STREAK: {
        ...achievementData.IPVGO_WINNING_STREAK,
        Icon: "ipvgo-winning-streak",
        Visible: BitNodeUtils_1.knowAboutBitverse,
        Condition: () => false,
        NotInSteam: true,
    },
    CHALLENGE_BN1: {
        ...achievementData.CHALLENGE_BN1,
        Icon: "BN1+",
        Visible: BitNodeUtils_1.knowAboutBitverse,
        Condition: () => _player_1.Player.bitNodeN === 1 &&
            (0, BitNodeUtils_1.isBitNodeFinished)() &&
            _player_1.Player.getHomeComputer().maxRam <= 128 &&
            _player_1.Player.getHomeComputer().cpuCores === 1,
    },
    CHALLENGE_BN2: {
        ...achievementData.CHALLENGE_BN2,
        Icon: "BN2+",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(2),
        Condition: () => _player_1.Player.bitNodeN === 2 && (0, BitNodeUtils_1.isBitNodeFinished)() && _player_1.Player.gang === null,
    },
    CHALLENGE_BN3: {
        ...achievementData.CHALLENGE_BN3,
        Icon: "BN3+",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(3),
        Condition: () => _player_1.Player.bitNodeN === 3 && (0, BitNodeUtils_1.isBitNodeFinished)() && _player_1.Player.corporation === null,
    },
    CHALLENGE_BN6: {
        ...achievementData.CHALLENGE_BN6,
        Icon: "BN6+",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(6),
        Condition: () => _player_1.Player.bitNodeN === 6 && (0, BitNodeUtils_1.isBitNodeFinished)() && _player_1.Player.bladeburner === null,
    },
    CHALLENGE_BN7: {
        ...achievementData.CHALLENGE_BN7,
        Icon: "BN7+",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(7),
        Condition: () => _player_1.Player.bitNodeN === 7 && (0, BitNodeUtils_1.isBitNodeFinished)() && _player_1.Player.bladeburner === null,
    },
    CHALLENGE_BN8: {
        ...achievementData.CHALLENGE_BN8,
        Icon: "BN8+",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(8),
        Condition: () => _player_1.Player.bitNodeN === 8 && (0, BitNodeUtils_1.isBitNodeFinished)() && !_player_1.Player.has4SData && !_player_1.Player.has4SDataTixApi,
    },
    CHALLENGE_BN9: {
        ...achievementData.CHALLENGE_BN9,
        Icon: "BN9+",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(9),
        Condition: () => _player_1.Player.bitNodeN === 9 &&
            (0, BitNodeUtils_1.isBitNodeFinished)() &&
            _player_1.Player.moneySourceB.hacknet === 0 &&
            _player_1.Player.moneySourceB.hacknet_expenses === 0,
    },
    CHALLENGE_BN10: {
        ...achievementData.CHALLENGE_BN10,
        Icon: "BN10+",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(10),
        Condition: () => _player_1.Player.bitNodeN === 10 &&
            (0, BitNodeUtils_1.isBitNodeFinished)() &&
            !_player_1.Player.sleeves.some((s) => s.augmentations.length > 0 ||
                s.exp.hacking > 0 ||
                s.exp.strength > 0 ||
                s.exp.defense > 0 ||
                s.exp.agility > 0 ||
                s.exp.dexterity > 0 ||
                s.exp.charisma > 0),
    },
    CHALLENGE_BN12: {
        ...achievementData.CHALLENGE_BN12,
        Icon: "BN12+",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(12),
        Condition: () => _player_1.Player.sourceFileLvl(12) >= 50,
    },
    CHALLENGE_BN13: {
        ...achievementData.CHALLENGE_BN13,
        Icon: "BN13+",
        Visible: () => (0, BitNodeUtils_1.canAccessBitNodeFeature)(13),
        Condition: () => _player_1.Player.bitNodeN === 13 &&
            (0, BitNodeUtils_1.isBitNodeFinished)() &&
            !_player_1.Player.augmentations.some((a) => a.name === _enums_1.AugmentationName.StaneksGift1),
    },
    CHALLENGE_BN14: {
        ...achievementData.CHALLENGE_BN14,
        Icon: "BN14+",
        Visible: BitNodeUtils_1.knowAboutBitverse,
        Condition: () => _player_1.Player.bitNodeN === 14 && (0, BitNodeUtils_1.isBitNodeFinished)() && !Go_1.Go.moveOrCheatViaApi,
        NotInSteam: true,
    },
    BYPASS: {
        ...achievementData.BYPASS,
        Icon: "SF-1",
        Secret: true,
        Condition: () => _player_1.Player.exploits.includes(Exploit_1.Exploit.Bypass),
    },
    PROTOTYPETAMPERING: {
        ...achievementData.PROTOTYPETAMPERING,
        Icon: "SF-1",
        Secret: true,
        Condition: () => _player_1.Player.exploits.includes(Exploit_1.Exploit.PrototypeTampering),
    },
    UNCLICKABLE: {
        ...achievementData.UNCLICKABLE,
        Icon: "SF-1",
        Secret: true,
        Condition: () => _player_1.Player.exploits.includes(Exploit_1.Exploit.Unclickable),
    },
    UNDOCUMENTEDFUNCTIONCALL: {
        ...achievementData.UNDOCUMENTEDFUNCTIONCALL,
        Icon: "SF-1",
        Secret: true,
        Condition: () => _player_1.Player.exploits.includes(Exploit_1.Exploit.UndocumentedFunctionCall),
    },
    TIMECOMPRESSION: {
        ...achievementData.TIMECOMPRESSION,
        Icon: "SF-1",
        Secret: true,
        Condition: () => _player_1.Player.exploits.includes(Exploit_1.Exploit.TimeCompression),
    },
    REALITYALTERATION: {
        ...achievementData.REALITYALTERATION,
        Icon: "SF-1",
        Secret: true,
        Condition: () => _player_1.Player.exploits.includes(Exploit_1.Exploit.RealityAlteration),
    },
    N00DLES: {
        ...achievementData.N00DLES,
        Icon: "SF-1",
        Secret: true,
        Condition: () => _player_1.Player.exploits.includes(Exploit_1.Exploit.N00dles),
    },
    EDITSAVEFILE: {
        ...achievementData.EDITSAVEFILE,
        Icon: "SF-1",
        Secret: true,
        Condition: () => _player_1.Player.exploits.includes(Exploit_1.Exploit.EditSaveFile),
    },
    UNACHIEVABLE: {
        ...achievementData.UNACHIEVABLE,
        Icon: "SF-1",
        Secret: true,
        // Hey Players! Yes, you're supposed to modify this to get the achievement!
        Condition: () => false,
    },
    DEVMENU: {
        ...achievementData.DEVMENU,
        Icon: "SF-1",
        Secret: true,
        Condition: () => _player_1.Player.exploits.includes(Exploit_1.Exploit.YoureNotMeantToAccessThis),
    },
    RAINBOW: {
        ...achievementData.RAINBOW,
        Icon: "SF-1",
        Secret: true,
        Condition: () => _player_1.Player.exploits.includes(Exploit_1.Exploit.INeedARainbow),
    },
    TRUE_RECURSION: {
        ...achievementData.TRUE_RECURSION,
        Icon: "SF-1",
        Secret: true,
        Condition: () => _player_1.Player.exploits.includes(Exploit_1.Exploit.TrueRecursion),
    },
};
// Steam has a limit of 100 achievement. So these were planned but commented for now.
// { ID: FactionNames.ECorp.toUpperCase(), Condition: () => Player.factions.includes(FactionNames.ECorp) },
// { ID: FactionNames.MegaCorp.toUpperCase(), Condition: () => Player.factions.includes(FactionNames.MegaCorp) },
// { ID: "BACHMAN_&_ASSOCIATES", Condition: () => Player.factions.includes(FactionNames.BachmanAndAssociates) },
// { ID: "BLADE_INDUSTRIES", Condition: () => Player.factions.includes(FactionNames.BladeIndustries) },
// { ID: FactionNames.NWO.toUpperCase(), Condition: () => Player.factions.includes(FactionNames.NWO) },
// { ID: "CLARKE_INCORPORATED", Condition: () => Player.factions.includes(FactionNames.ClarkeIncorporated) },
// { ID: "OMNITEK_INCORPORATED", Condition: () => Player.factions.includes(FactionNames.OmniTekIncorporated) },
// { ID: "FOUR_SIGMA", Condition: () => Player.factions.includes(FactionNames.FourSigma) },
// { ID: "KUAIGONG_INTERNATIONAL", Condition: () => Player.factions.includes(FactionNames.KuaiGongInternational) },
// { ID: "FULCRUM_SECRET_TECHNOLOGIES", Condition: () => Player.factions.includes(FactionNames.FulcrumSecretTechnologies) },
// { ID: FactionNames.Aevum.toUpperCase(), Condition: () => Player.factions.includes(FactionNames.Aevum) },
// { ID: FactionNames.Chongqing.toUpperCase(), Condition: () => Player.factions.includes(FactionNames.Chongqing) },
// { ID: FactionNames.Ishima.toUpperCase(), Condition: () => Player.factions.includes(FactionNames.Ishima) },
// { ID: "NEW_TOKYO", Condition: () => Player.factions.includes(FactionNames.NewTokyo) },
// { ID: "SECTOR-12", Condition: () => Player.factions.includes(FactionNames.Sector12) },
// { ID: FactionNames.Volhaven.toUpperCase(), Condition: () => Player.factions.includes(FactionNames.Volhaven) },
// { ID: "SPEAKERS_FOR_THE_DEAD", Condition: () => Player.factions.includes(FactionNames.SpeakersForTheDead) },
// { ID: "THE_DARK_ARMY", Condition: () => Player.factions.includes(FactionNames.TheDarkArmy) },
// { ID: "THE_SYNDICATE", Condition: () => Player.factions.includes(FactionNames.TheSyndicate) },
// { ID: FactionNames.Silhouette.toUpperCase(), Condition: () => Player.factions.includes(FactionNames.Silhouette) },
// { ID: FactionNames.Tetrads.toUpperCase(), Condition: () => Player.factions.includes(FactionNames.Tetrads) },
// { ID: "SLUM_SNAKES", Condition: () => Player.factions.includes(FactionNames.SlumSnakes) },
// { ID: FactionNames.Netburners.toUpperCase(), Condition: () => Player.factions.includes(FactionNames.Netburners) },
// { ID: "TIAN_DI_HUI", Condition: () => Player.factions.includes(FactionNames.TianDiHui) },
// { ID: FactionNames.Bladeburners.toUpperCase(), Condition: () => Player.factions.includes(FactionNames.Bladeburners) },
// { ID: "DEEPSCANV1.EXE", Condition: () => Player.getHomeComputer().programs.includes(Programs.DeepscanV1.name) },
// { ID: "DEEPSCANV2.EXE", Condition: () => Player.getHomeComputer().programs.includes(Programs.DeepscanV2.name) },
// { ID: "INFILTRATORS", Condition: () => Player.factions.includes(FactionNames.Infiltrators) },
// {
//   ID: "SERVERPROFILER.EXE",
//   Condition: () => Player.getHomeComputer().programs.includes(Programs.ServerProfiler.name),
// },
// { ID: "AUTOLINK.EXE", Condition: () => Player.getHomeComputer().programs.includes(Programs.AutoLink.name) },
// { ID: "FLIGHT.EXE", Condition: () => Player.getHomeComputer().programs.includes(Programs.Flight.name) },
function calculateAchievements() {
    const playerAchievements = _player_1.Player.achievements.map((a) => a.ID);
    const missingAchievements = Object.values(exports.achievements)
        .filter((a) => !playerAchievements.includes(a.ID) && a.Condition())
        // callback returns array of achievement id and id of any in the additional list, flatmap means we have only a 1D array
        .flatMap((a) => [a.ID, ...(a.AdditionalUnlock || [])]);
    for (const id of missingAchievements) {
        _player_1.Player.giveAchievement(id);
    }
    if (Settings_1.Settings.SyncSteamAchievements) {
        (0, Electron_1.activateSteamAchievements)(_player_1.Player.achievements
            .map((a) => a.ID)
            .filter((name) => {
            if (!exports.achievements[name]) {
                return false;
            }
            return !exports.achievements[name].NotInSteam;
        }));
    }
}
