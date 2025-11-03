import { PartialRecord } from "../Types/Record";
/**
 * Bitnode multipliers influence the difficulty of different aspects of the game.
 * Each Bitnode has a different theme/strategy to achieving the end goal, so these multipliers will can help drive the
 * player toward the intended strategy. Unless they really want to play the long, slow game of waiting...
 */
export declare class BitNodeMultipliers {
    /** Influences how quickly the player's agility level (not exp) scales */
    AgilityLevelMultiplier: number;
    /** Influences the base cost to purchase an augmentation. */
    AugmentationMoneyCost: number;
    /** Influences the base rep the player must have with a faction to purchase an augmentation. */
    AugmentationRepCost: number;
    /** Influences how quickly the player can gain rank within Bladeburner. */
    BladeburnerRank: number;
    /** Influences the cost of skill levels from Bladeburner. */
    BladeburnerSkillCost: number;
    /** Influences how quickly the player's charisma level (not exp) scales */
    CharismaLevelMultiplier: number;
    /** Influences the experience gained for each ability when a player completes a class. */
    ClassGymExpGain: number;
    /** Influences the amount of money gained from completing Coding Contracts. */
    CodingContractMoney: number;
    /** Influences the experience gained for each ability when the player completes working their job. */
    CompanyWorkExpGain: number;
    /** Influences how much money the player earns when completing working their job. */
    CompanyWorkMoney: number;
    /** Influences how much rep the player gains when performing work for a company. */
    CompanyWorkRepGain: number;
    /** Influences the amount of divisions a corporation can have at the same time. */
    CorporationDivisions: number;
    /** Influences profits from corporation dividends and selling shares. */
    CorporationSoftcap: number;
    /** Influences the valuation of corporations created by the player. */
    CorporationValuation: number;
    /** Influences the base experience gained for each ability when the player commits a crime. */
    CrimeExpGain: number;
    /** Influences the base money gained when the player commits a crime. */
    CrimeMoney: number;
    /** Influences the success chance of committing crimes */
    CrimeSuccessRate: number;
    /** Influences how many Augmentations you need in order to get invited to the Daedalus faction */
    DaedalusAugsRequirement: number;
    /** Influences how quickly the player's defense level (not exp) scales */
    DefenseLevelMultiplier: number;
    /** Influences how quickly the player's dexterity level (not exp) scales */
    DexterityLevelMultiplier: number;
    /** Influences how much rep the player gains in each faction simply by being a member. */
    FactionPassiveRepGain: number;
    /** Influences the experience gained for each ability when the player completes work for a Faction. */
    FactionWorkExpGain: number;
    /** Influences how much rep the player gains when performing work for a faction or donating to it. */
    FactionWorkRepGain: number;
    /** Influences how much it costs to unlock the stock market's 4S Market Data API */
    FourSigmaMarketDataApiCost: number;
    /** Influences how much it costs to unlock the stock market's 4S Market Data (NOT API) */
    FourSigmaMarketDataCost: number;
    /** Influences the respect gain and money gain of your gang. */
    GangSoftcap: number;
    /** Percentage of unique augs that the gang has. */
    GangUniqueAugs: number;
    /** Percentage multiplier on the effect of the IPvGO rewards  **/
    GoPower: number;
    /** Influences the experienced gained when hacking a server. */
    HackExpGain: number;
    /** Influences how quickly the player's hacking level (not experience) scales */
    HackingLevelMultiplier: number;
    /** Influences how quickly the player's hack(), grow() and weaken() calls run */
    HackingSpeedMultiplier: number;
    /**
     * Influences how much money is produced by Hacknet Nodes.
     * Influences the hash rate of Hacknet Servers (unlocked in BitNode-9)
     */
    HacknetNodeMoney: number;
    /** Influences how much money it costs to upgrade your home computer's RAM */
    HomeComputerRamCost: number;
    /** Influences how much money is gained when the player infiltrates a company. */
    InfiltrationMoney: number;
    /** Influences how much rep the player can gain from factions when selling stolen documents and secrets */
    InfiltrationRep: number;
    /**
     * Influences how much money the player actually gains when they hack a server via the terminal. This is different
     * from ScriptHackMoney. When the player hacks a server via the terminal, the amount of money in that server is
     * reduced, but they do not gain that same amount.
     */
    ManualHackMoney: number;
    /** Influence how much it costs to purchase a server */
    PurchasedServerCost: number;
    /** Influence how much it costs to purchase a server */
    PurchasedServerSoftcap: number;
    /** Influences the maximum number of purchased servers you can have */
    PurchasedServerLimit: number;
    /** Influences the maximum allowed RAM for a purchased server */
    PurchasedServerMaxRam: number;
    /** Influences the minimum favor the player must have with a faction before they can donate to gain rep. */
    FavorToDonateToFaction: number;
    /** Influences how much money is stolen from a server when the player performs a hack against it. */
    ScriptHackMoney: number;
    /**
     * Influences how much money the player actually gains when a script hacks a server. This is different from
     * ScriptHackMoney. When a script hacks a server, the amount of money in that server is reduced, but the player does
     * not gain that same amount.
     */
    ScriptHackMoneyGain: number;
    /** Influences the growth percentage per cycle against a server. */
    ServerGrowthRate: number;
    /** Influences the maximum money that a server can grow to. */
    ServerMaxMoney: number;
    /** Influences the initial money that a server starts with. */
    ServerStartingMoney: number;
    /** Influences the initial security level (hackDifficulty) of a server. */
    ServerStartingSecurity: number;
    /** Influences the weaken amount per invocation against a server. */
    ServerWeakenRate: number;
    /** Influences how quickly the player's strength level (not exp) scales */
    StrengthLevelMultiplier: number;
    /** Influences the power of the gift. */
    StaneksGiftPowerMultiplier: number;
    /** Influences the size of the gift. */
    StaneksGiftExtraSize: number;
    /** Influences the hacking skill required to backdoor the world daemon. */
    WorldDaemonDifficulty: number;
    constructor(a?: PartialRecord<keyof BitNodeMultipliers, number>);
}
/** The multipliers currently in effect */
export declare let currentNodeMults: BitNodeMultipliers;
export declare function replaceCurrentNodeMults(mults: BitNodeMultipliers): void;
