"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentNodeMults = exports.BitNodeMultipliers = void 0;
exports.replaceCurrentNodeMults = replaceCurrentNodeMults;
const Record_1 = require("../Types/Record");
const clampNumber_1 = require("../utils/helpers/clampNumber");
/**
 * Bitnode multipliers influence the difficulty of different aspects of the game.
 * Each Bitnode has a different theme/strategy to achieving the end goal, so these multipliers will can help drive the
 * player toward the intended strategy. Unless they really want to play the long, slow game of waiting...
 */
class BitNodeMultipliers {
    constructor(a = {}) {
        /** Influences how quickly the player's agility level (not exp) scales */
        this.AgilityLevelMultiplier = 1;
        /** Influences the base cost to purchase an augmentation. */
        this.AugmentationMoneyCost = 1;
        /** Influences the base rep the player must have with a faction to purchase an augmentation. */
        this.AugmentationRepCost = 1;
        /** Influences how quickly the player can gain rank within Bladeburner. */
        this.BladeburnerRank = 1;
        /** Influences the cost of skill levels from Bladeburner. */
        this.BladeburnerSkillCost = 1;
        /** Influences how quickly the player's charisma level (not exp) scales */
        this.CharismaLevelMultiplier = 1;
        /** Influences the experience gained for each ability when a player completes a class. */
        this.ClassGymExpGain = 1;
        /** Influences the amount of money gained from completing Coding Contracts. */
        this.CodingContractMoney = 1;
        /** Influences the experience gained for each ability when the player completes working their job. */
        this.CompanyWorkExpGain = 1;
        /** Influences how much money the player earns when completing working their job. */
        this.CompanyWorkMoney = 1;
        /** Influences how much rep the player gains when performing work for a company. */
        this.CompanyWorkRepGain = 1;
        /** Influences the amount of divisions a corporation can have at the same time. */
        this.CorporationDivisions = 1;
        /** Influences profits from corporation dividends and selling shares. */
        this.CorporationSoftcap = 1;
        /** Influences the valuation of corporations created by the player. */
        this.CorporationValuation = 1;
        /** Influences the base experience gained for each ability when the player commits a crime. */
        this.CrimeExpGain = 1;
        /** Influences the base money gained when the player commits a crime. */
        this.CrimeMoney = 1;
        /** Influences the success chance of committing crimes */
        this.CrimeSuccessRate = 1;
        /** Influences how many Augmentations you need in order to get invited to the Daedalus faction */
        this.DaedalusAugsRequirement = 30;
        /** Influences how quickly the player's defense level (not exp) scales */
        this.DefenseLevelMultiplier = 1;
        /** Influences how quickly the player's dexterity level (not exp) scales */
        this.DexterityLevelMultiplier = 1;
        /** Influences how much rep the player gains in each faction simply by being a member. */
        this.FactionPassiveRepGain = 1;
        /** Influences the experience gained for each ability when the player completes work for a Faction. */
        this.FactionWorkExpGain = 1;
        /** Influences how much rep the player gains when performing work for a faction or donating to it. */
        this.FactionWorkRepGain = 1;
        /** Influences how much it costs to unlock the stock market's 4S Market Data API */
        this.FourSigmaMarketDataApiCost = 1;
        /** Influences how much it costs to unlock the stock market's 4S Market Data (NOT API) */
        this.FourSigmaMarketDataCost = 1;
        /** Influences the respect gain and money gain of your gang. */
        this.GangSoftcap = 1;
        /** Percentage of unique augs that the gang has. */
        this.GangUniqueAugs = 1;
        /** Percentage multiplier on the effect of the IPvGO rewards  **/
        this.GoPower = 1;
        /** Influences the experienced gained when hacking a server. */
        this.HackExpGain = 1;
        /** Influences how quickly the player's hacking level (not experience) scales */
        this.HackingLevelMultiplier = 1;
        /** Influences how quickly the player's hack(), grow() and weaken() calls run */
        this.HackingSpeedMultiplier = 1;
        /**
         * Influences how much money is produced by Hacknet Nodes.
         * Influences the hash rate of Hacknet Servers (unlocked in BitNode-9)
         */
        this.HacknetNodeMoney = 1;
        /** Influences how much money it costs to upgrade your home computer's RAM */
        this.HomeComputerRamCost = 1;
        /** Influences how much money is gained when the player infiltrates a company. */
        this.InfiltrationMoney = 1;
        /** Influences how much rep the player can gain from factions when selling stolen documents and secrets */
        this.InfiltrationRep = 1;
        /**
         * Influences how much money the player actually gains when they hack a server via the terminal. This is different
         * from ScriptHackMoney. When the player hacks a server via the terminal, the amount of money in that server is
         * reduced, but they do not gain that same amount.
         */
        this.ManualHackMoney = 1;
        /** Influence how much it costs to purchase a server */
        this.PurchasedServerCost = 1;
        /** Influence how much it costs to purchase a server */
        this.PurchasedServerSoftcap = 1;
        /** Influences the maximum number of purchased servers you can have */
        this.PurchasedServerLimit = 1;
        /** Influences the maximum allowed RAM for a purchased server */
        this.PurchasedServerMaxRam = 1;
        /** Influences the minimum favor the player must have with a faction before they can donate to gain rep. */
        this.FavorToDonateToFaction = 1;
        /** Influences how much money is stolen from a server when the player performs a hack against it. */
        this.ScriptHackMoney = 1;
        /**
         * Influences how much money the player actually gains when a script hacks a server. This is different from
         * ScriptHackMoney. When a script hacks a server, the amount of money in that server is reduced, but the player does
         * not gain that same amount.
         */
        this.ScriptHackMoneyGain = 1;
        /** Influences the growth percentage per cycle against a server. */
        this.ServerGrowthRate = 1;
        /** Influences the maximum money that a server can grow to. */
        this.ServerMaxMoney = 1;
        /** Influences the initial money that a server starts with. */
        this.ServerStartingMoney = 1;
        /** Influences the initial security level (hackDifficulty) of a server. */
        this.ServerStartingSecurity = 1;
        /** Influences the weaken amount per invocation against a server. */
        this.ServerWeakenRate = 1;
        /** Influences how quickly the player's strength level (not exp) scales */
        this.StrengthLevelMultiplier = 1;
        /** Influences the power of the gift. */
        this.StaneksGiftPowerMultiplier = 1;
        /** Influences the size of the gift. */
        this.StaneksGiftExtraSize = 0;
        /** Influences the hacking skill required to backdoor the world daemon. */
        this.WorldDaemonDifficulty = 1;
        for (const [key, value] of (0, Record_1.getRecordEntries)(a))
            this[key] = (0, clampNumber_1.clampNumber)(value);
    }
}
exports.BitNodeMultipliers = BitNodeMultipliers;
/** The multipliers currently in effect */
exports.currentNodeMults = new BitNodeMultipliers();
function replaceCurrentNodeMults(mults) {
    exports.currentNodeMults = mults;
}
