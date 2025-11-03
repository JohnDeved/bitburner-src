"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bladeburner = exports.BladeburnerPromise = void 0;
const _enums_1 = require("@enums");
const getKeyList_1 = require("../utils/helpers/getKeyList");
const JSONReviver_1 = require("../utils/JSONReviver");
const formatNumber_1 = require("../ui/formatNumber");
const Skills_1 = require("./data/Skills");
const City_1 = require("./City");
const _player_1 = require("@player");
const GameRoot_1 = require("../ui/GameRoot");
const Router_1 = require("../ui/Router");
const Help_1 = require("./data/Help");
const exceptionAlert_1 = require("../utils/helpers/exceptionAlert");
const getRandomIntInclusive_1 = require("../utils/helpers/getRandomIntInclusive");
const Constants_1 = require("./data/Constants");
const formatNumber_2 = require("../ui/formatNumber");
const addOffset_1 = require("../utils/helpers/addOffset");
const Factions_1 = require("../Faction/Factions");
const Hospital_1 = require("../Hospital/Hospital");
const DialogBox_1 = require("../ui/React/DialogBox");
const Settings_1 = require("../Settings/Settings");
const formatTime_1 = require("../utils/helpers/formatTime");
const FactionHelpers_1 = require("../Faction/FactionHelpers");
const SleeveInfiltrateWork_1 = require("../PersonObjects/Sleeve/Work/SleeveInfiltrateWork");
const WorkStats_1 = require("../Work/WorkStats");
const EnumHelper_1 = require("../utils/EnumHelper");
const Record_1 = require("../Types/Record");
const Contracts_1 = require("./data/Contracts");
const Operations_1 = require("./data/Operations");
const clampNumber_1 = require("../utils/helpers/clampNumber");
const Parser_1 = require("../Terminal/Parser");
const BlackOperations_1 = require("./data/BlackOperations");
const GeneralActions_1 = require("./data/GeneralActions");
const PlayerObject_1 = require("../PersonObjects/Player/PlayerObject");
const Sleeve_1 = require("../PersonObjects/Sleeve/Sleeve");
const terminalShorthands_1 = require("./utils/terminalShorthands");
const TeamCasualties_1 = require("./Actions/TeamCasualties");
const BribeGame_1 = require("../Infiltration/ui/BribeGame");
const TypeAssertion_1 = require("../utils/TypeAssertion");
const throwIfReachable_1 = require("../utils/helpers/throwIfReachable");
const loadActionIdentifier_1 = require("./utils/loadActionIdentifier");
const I18nUtils_1 = require("../utils/I18nUtils");
const Formulas_1 = require("./Formulas");
exports.BladeburnerPromise = { promise: null, resolve: null };
class Bladeburner {
    get sleeveSize() {
        return _player_1.Player.sleevesSupportingBladeburner().length;
    }
    constructor() {
        this.numHosp = 0;
        this.moneyLost = 0;
        this.rank = 0;
        this.maxRank = 0;
        this.skillPoints = 0;
        this.totalSkillPoints = 0;
        this.teamSize = 0;
        this.teamLost = 0;
        this.storedCycles = 0;
        this.randomEventCounter = (0, getRandomIntInclusive_1.getRandomIntInclusive)(240, 600);
        this.actionTimeToComplete = 0;
        this.actionTimeCurrent = 0;
        this.actionTimeOverflow = 0;
        this.action = null;
        this.cities = (0, Record_1.createEnumKeyedRecord)(_enums_1.CityName, (name) => new City_1.City(name));
        this.city = _enums_1.CityName.Sector12;
        // Todo: better types for all these Record<string, etc> types. Will need custom types or enums for the named string categories (e.g. skills).
        this.skills = {};
        this.skillMultipliers = {};
        this.staminaBonus = 0;
        this.maxStamina = 1;
        this.stamina = 1;
        this.numBlackOpsComplete = 0;
        this.logging = {
            general: true,
            contracts: true,
            ops: true,
            blackops: true,
            events: true,
        };
        this.automateEnabled = false;
        this.automateActionHigh = null;
        this.automateThreshHigh = 0;
        this.automateActionLow = null;
        this.automateThreshLow = 0;
        this.consoleHistory = [];
        this.consoleLogs = ["Bladeburner Console", "Type 'help' to see console commands"];
        this.getTeamCasualtiesRoll = getRandomIntInclusive_1.getRandomIntInclusive;
        this.contracts = (0, Contracts_1.createContracts)();
        this.operations = (0, Operations_1.createOperations)();
    }
    // Initialization code that is dependent on Player is here instead of in the constructor
    init() {
        this.calculateMaxStamina();
        this.stamina = this.maxStamina;
    }
    getCurrentCity() {
        return this.cities[this.city];
    }
    calculateStaminaPenalty() {
        return Math.min(1, this.stamina / (0.5 * this.maxStamina));
    }
    /** This function is for the player. Sleeves use their own functions to perform blade work.
     * Note that this function does not ensure the action is valid, that should be checked before starting */
    startAction(actionId) {
        if (!actionId) {
            this.resetAction();
            return { success: true, message: "Stopped current Bladeburner action" };
        }
        if (!_player_1.Player.hasAugmentation(_enums_1.AugmentationName.BladesSimulacrum, true)) {
            _player_1.Player.finishWork(true);
        }
        const action = this.getActionObject(actionId);
        const availability = action.getAvailability(this);
        if (!availability.available) {
            return { message: `Could not start action ${action.name}: ${availability.error}` };
        }
        this.action = actionId;
        this.actionTimeCurrent = 0;
        this.actionTimeToComplete = action.getActionTime(this, _player_1.Player);
        return { success: true, message: `Started action ${action.name}` };
    }
    /** Directly sets a skill level, with no validation */
    setSkillLevel(skillName, value) {
        this.skills[skillName] = (0, clampNumber_1.clampInteger)(value, 0, Number.MAX_VALUE);
        this.updateSkillMultipliers();
    }
    /** Attempts to perform a skill upgrade, gives a message on both success and failure */
    upgradeSkill(skillName, count = 1) {
        const currentSkillLevel = this.skills[skillName] ?? 0;
        const availability = Skills_1.Skills[skillName].canUpgrade(this, count);
        if (!availability.available) {
            return { message: `Cannot upgrade ${skillName}: ${availability.error}` };
        }
        this.skillPoints -= availability.cost;
        this.setSkillLevel(skillName, currentSkillLevel + availability.actualCount);
        return {
            success: true,
            message: `Upgraded skill ${skillName} by ${(0, I18nUtils_1.pluralize)(availability.actualCount, "level")}`,
        };
    }
    executeConsoleCommands(commands) {
        try {
            // Console History
            if (this.consoleHistory[this.consoleHistory.length - 1] != commands) {
                this.consoleHistory.push(commands);
                if (this.consoleHistory.length > 50) {
                    this.consoleHistory.splice(0, 1);
                }
            }
            const arrayOfCommands = commands.split(";");
            for (let i = 0; i < arrayOfCommands.length; ++i) {
                this.executeConsoleCommand(arrayOfCommands[i]);
            }
        }
        catch (e) {
            (0, exceptionAlert_1.exceptionAlert)(e);
        }
    }
    postToConsole(input, saveToLogs = true) {
        const MaxConsoleEntries = 100;
        if (saveToLogs) {
            this.consoleLogs.push(input);
            if (this.consoleLogs.length > MaxConsoleEntries) {
                this.consoleLogs.shift();
            }
        }
    }
    log(input) {
        // Adds a timestamp and then just calls postToConsole
        this.postToConsole(`[${(0, formatTime_1.formatTime)(Settings_1.Settings.TimestampsFormat !== "" ? Settings_1.Settings.TimestampsFormat : "yyyy-MM-dd HH:mm:ss")}] ${input}`);
    }
    resetAction() {
        this.action = null;
        this.actionTimeCurrent = 0;
        this.actionTimeToComplete = 0;
    }
    clearConsole() {
        this.consoleLogs.length = 0;
    }
    prestigeAugmentation() {
        this.resetAction();
        // Attempt to join the faction, this will silently fail if we have insufficient rank
        this.joinFaction();
    }
    joinFaction() {
        const faction = Factions_1.Factions[_enums_1.FactionName.Bladeburners];
        if (faction.isMember)
            return { success: true, message: `Already a member of ${_enums_1.FactionName.Bladeburners} faction` };
        if (this.rank >= Constants_1.BladeburnerConstants.RankNeededForFaction) {
            (0, FactionHelpers_1.joinFaction)(faction);
            return { success: true, message: `Joined ${_enums_1.FactionName.Bladeburners} faction` };
        }
        return { message: `Insufficient rank (${this.rank} / ${Constants_1.BladeburnerConstants.RankNeededForFaction})` };
    }
    storeCycles(numCycles = 0) {
        this.storedCycles = (0, clampNumber_1.clampInteger)(this.storedCycles + numCycles, 0);
    }
    executeStartConsoleCommand(args) {
        if (args.length !== 3) {
            this.postToConsole("Invalid usage of 'start' console command: start [type] [name]");
            this.postToConsole("Use 'help start' for more info");
            return;
        }
        const type = args[1];
        const name = args[2];
        const action = this.guessActionFromTypeAndName(type, name);
        if (!action) {
            this.postToConsole(`Invalid action type / name specified: type: ${type}, name: ${name}`);
            return;
        }
        const attempt = this.startAction(action.id);
        this.postToConsole(attempt.message);
    }
    getSkillMultsDisplay() {
        const display = [];
        for (const [multName, mult] of (0, Record_1.getRecordEntries)(this.skillMultipliers)) {
            display.push(`${multName}: x${(0, formatNumber_2.formatBigNumber)(mult)}`);
        }
        return display;
    }
    executeSkillConsoleCommand(args) {
        switch (args.length) {
            case 1: {
                // Display Skill Help Command
                this.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
                this.postToConsole("Use 'help skill' for more info");
                break;
            }
            case 2: {
                if (args[1].toLowerCase() === "list") {
                    // List all skills and their level
                    this.postToConsole("Skills: ");
                    for (const skill of Object.values(Skills_1.Skills)) {
                        const skillLevel = this.getSkillLevel(skill.name);
                        this.postToConsole(`${skill.name}: Level ${(0, formatNumber_1.formatNumberNoSuffix)(skillLevel, 0)}\n\nEffects: `);
                    }
                    for (const logEntry of this.getSkillMultsDisplay())
                        this.postToConsole(logEntry);
                }
                else {
                    this.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
                    this.postToConsole("Use 'help skill' for more info");
                }
                break;
            }
            case 3: {
                const skillName = args[2];
                if (!(0, EnumHelper_1.getEnumHelper)("BladeburnerSkillName").isMember(skillName)) {
                    this.postToConsole("Invalid skill name (Note that it is case-sensitive): " + skillName);
                    return;
                }
                const level = this.getSkillLevel(skillName);
                if (args[1].toLowerCase() === "list") {
                    this.postToConsole(skillName + ": Level " + (0, formatNumber_1.formatNumberNoSuffix)(level));
                }
                else if (args[1].toLowerCase() === "level") {
                    const attempt = this.upgradeSkill(skillName);
                    this.postToConsole(attempt.message);
                }
                else {
                    this.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
                    this.postToConsole("Use 'help skill' for more info");
                }
                break;
            }
            default: {
                this.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
                this.postToConsole("Use 'help skill' for more info");
                break;
            }
        }
    }
    executeLogConsoleCommand(args) {
        if (args.length < 3) {
            this.postToConsole("Invalid usage of log command: log [enable/disable] [action/event]");
            this.postToConsole("Use 'help log' for more details and examples");
            return;
        }
        let flag = true;
        if (args[1].toLowerCase().includes("d")) {
            flag = false;
        } // d for disable
        switch (args[2].toLowerCase()) {
            case "general":
            case "gen":
                this.logging.general = flag;
                this.log("Logging " + (flag ? "enabled" : "disabled") + " for general actions");
                break;
            case "contract":
            case "contracts":
                this.logging.contracts = flag;
                this.log("Logging " + (flag ? "enabled" : "disabled") + " for Contracts");
                break;
            case "ops":
            case "op":
            case "operations":
            case "operation":
                this.logging.ops = flag;
                this.log("Logging " + (flag ? "enabled" : "disabled") + " for Operations");
                break;
            case "blackops":
            case "blackop":
            case "black operations":
            case "black operation":
                this.logging.blackops = flag;
                this.log("Logging " + (flag ? "enabled" : "disabled") + " for BlackOps");
                break;
            case "event":
            case "events":
                this.logging.events = flag;
                this.log("Logging " + (flag ? "enabled" : "disabled") + " for events");
                break;
            case "all":
                this.logging.general = flag;
                this.logging.contracts = flag;
                this.logging.ops = flag;
                this.logging.blackops = flag;
                this.logging.events = flag;
                this.log("Logging " + (flag ? "enabled" : "disabled") + " for everything");
                break;
            default:
                this.postToConsole("Invalid action/event type specified: " + args[2]);
                this.postToConsole("Examples of valid action/event identifiers are: [general, contracts, ops, blackops, events]");
                break;
        }
    }
    executeHelpConsoleCommand(args) {
        if (args.length === 1) {
            for (const line of Help_1.ConsoleHelpText.helpList) {
                this.postToConsole(line);
            }
        }
        else {
            for (let i = 1; i < args.length; ++i) {
                if (!(args[i] in Help_1.ConsoleHelpText))
                    continue;
                const helpText = Help_1.ConsoleHelpText[args[i]];
                for (const line of helpText) {
                    this.postToConsole(line);
                }
            }
        }
    }
    executeAutomateConsoleCommand(args) {
        if (args.length !== 2 && args.length !== 4) {
            this.postToConsole("Invalid use of 'automate' command: automate [var] [val] [hi/low]. Use 'help automate' for more info");
            return;
        }
        // Enable/Disable
        if (args.length === 2) {
            const flag = args[1];
            if (flag.toLowerCase() === "status") {
                this.postToConsole("Automation: " + (this.automateEnabled ? "enabled" : "disabled"));
                this.postToConsole("When your stamina drops to " +
                    (0, formatNumber_1.formatNumberNoSuffix)(this.automateThreshLow, 0) +
                    ", you will automatically switch to " +
                    (this.automateActionLow?.name ?? "Idle") +
                    ". When your stamina recovers to " +
                    (0, formatNumber_1.formatNumberNoSuffix)(this.automateThreshHigh, 0) +
                    ", you will automatically " +
                    "switch to " +
                    (this.automateActionHigh?.name ?? "Idle") +
                    ".");
            }
            else if (flag.toLowerCase().includes("en")) {
                if (!this.automateActionLow || !this.automateActionHigh) {
                    return this.log("Failed to enable automation. Actions were not set");
                }
                this.automateEnabled = true;
                this.log("Bladeburner automation enabled");
            }
            else if (flag.toLowerCase().includes("d")) {
                this.automateEnabled = false;
                this.log("Bladeburner automation disabled");
            }
            else {
                this.log("Invalid argument for 'automate' console command: " + args[1]);
            }
            return;
        }
        // Set variables
        if (args.length === 4) {
            const type = args[1].toLowerCase(); // allows Action Type to be with or without capitalization.
            const name = args[2];
            let highLow = false; // True for high, false for low
            if (args[3].toLowerCase().includes("hi")) {
                highLow = true;
            }
            if (type === "stamina") {
                // For stamina, the "name" variable is actually the stamina threshold
                if (isNaN(parseFloat(name))) {
                    this.postToConsole("Invalid value specified for stamina threshold (must be numeric): " + name);
                }
                else {
                    if (highLow) {
                        this.automateThreshHigh = Number(name);
                    }
                    else {
                        this.automateThreshLow = Number(name);
                    }
                    this.log("Automate (" + (highLow ? "HIGH" : "LOW") + ") stamina threshold set to " + name);
                }
                return;
            }
            const actionId = (0, terminalShorthands_1.autoCompleteTypeShorthand)(type, name);
            if (actionId === null) {
                switch (type) {
                    case "general":
                    case "gen": {
                        this.postToConsole("Invalid General Action name specified: " + name);
                        return;
                    }
                    case "contract":
                    case "contracts": {
                        this.postToConsole("Invalid Contract name specified: " + name);
                        return;
                    }
                    case "ops":
                    case "op":
                    case "operations":
                    case "operation":
                        this.postToConsole("Invalid Operation name specified: " + name);
                        return;
                    default:
                        this.postToConsole("Invalid use of automate command.");
                        return;
                }
            }
            if (highLow) {
                this.automateActionHigh = actionId;
            }
            else {
                this.automateActionLow = actionId;
            }
            this.log("Automate (" + (highLow ? "HIGH" : "LOW") + ") action set to " + name);
        }
    }
    executeConsoleCommand(command) {
        command = command.trim();
        command = command.replace(/\s\s+/g, " "); // Replace all whitespace w/ a single space
        const args = (0, Parser_1.parseCommand)(command).map(String);
        if (args.length <= 0)
            return; // Log an error?
        switch (args[0].toLowerCase()) {
            case "automate":
                this.executeAutomateConsoleCommand(args);
                break;
            case "clear":
            case "cls":
                this.clearConsole();
                break;
            case "help":
                this.executeHelpConsoleCommand(args);
                break;
            case "log":
                this.executeLogConsoleCommand(args);
                break;
            case "skill":
                this.executeSkillConsoleCommand(args);
                break;
            case "start":
                this.executeStartConsoleCommand(args);
                break;
            case "stop":
                this.resetAction();
                break;
            default:
                this.postToConsole("Invalid console command");
                break;
        }
    }
    triggerMigration(sourceCityName) {
        const cityHelper = (0, EnumHelper_1.getEnumHelper)("CityName");
        let destCityName = cityHelper.random();
        while (destCityName === sourceCityName)
            destCityName = cityHelper.random();
        const destCity = this.cities[destCityName];
        const sourceCity = this.cities[sourceCityName];
        const rand = Math.random();
        let percentage = (0, getRandomIntInclusive_1.getRandomIntInclusive)(3, 15) / 100;
        if (rand < 0.05 && sourceCity.comms > 0) {
            // 5% chance for community migration
            percentage *= (0, getRandomIntInclusive_1.getRandomIntInclusive)(2, 4); // Migration increases population change
            --sourceCity.comms;
            ++destCity.comms;
        }
        const count = Math.round(sourceCity.pop * percentage);
        sourceCity.pop -= count;
        destCity.pop += count;
        if (destCity.pop < Constants_1.BladeburnerConstants.PopGrowthCeiling) {
            destCity.pop += Constants_1.BladeburnerConstants.BasePopGrowth;
        }
    }
    triggerPotentialMigration(sourceCityName, chance) {
        if (chance == null || isNaN(chance)) {
            console.error("Invalid 'chance' parameter passed into Bladeburner.triggerPotentialMigration()");
        }
        if (chance > 1) {
            chance /= 100;
        }
        if (Math.random() < chance) {
            this.triggerMigration(sourceCityName);
        }
    }
    randomEvent() {
        const chance = Math.random();
        const cityHelper = (0, EnumHelper_1.getEnumHelper)("CityName");
        // Choose random source/destination city for events
        const sourceCityName = cityHelper.random();
        const sourceCity = this.cities[sourceCityName];
        let destCityName = cityHelper.random();
        while (destCityName === sourceCityName)
            destCityName = cityHelper.random();
        const destCity = this.cities[destCityName];
        if (chance <= 0.05) {
            // New Synthoid Community, 5%
            ++sourceCity.comms;
            const percentage = (0, getRandomIntInclusive_1.getRandomIntInclusive)(10, 20) / 100;
            const count = Math.round(sourceCity.pop * percentage);
            sourceCity.pop += count;
            if (sourceCity.pop < Constants_1.BladeburnerConstants.PopGrowthCeiling) {
                sourceCity.pop += Constants_1.BladeburnerConstants.BasePopGrowth;
            }
            if (this.logging.events) {
                this.log("Intelligence indicates that a new Synthoid community was formed in a city");
            }
        }
        else if (chance <= 0.1) {
            // Synthoid Community Migration, 5%
            if (sourceCity.comms <= 0) {
                // If no comms in source city, then instead trigger a new Synthoid community event
                ++sourceCity.comms;
                const percentage = (0, getRandomIntInclusive_1.getRandomIntInclusive)(10, 20) / 100;
                const count = Math.round(sourceCity.pop * percentage);
                sourceCity.pop += count;
                if (sourceCity.pop < Constants_1.BladeburnerConstants.PopGrowthCeiling) {
                    sourceCity.pop += Constants_1.BladeburnerConstants.BasePopGrowth;
                }
                if (this.logging.events) {
                    this.log("Intelligence indicates that a new Synthoid community was formed in a city");
                }
            }
            else {
                --sourceCity.comms;
                ++destCity.comms;
                // Change pop
                const percentage = (0, getRandomIntInclusive_1.getRandomIntInclusive)(10, 20) / 100;
                const count = Math.round(sourceCity.pop * percentage);
                sourceCity.pop -= count;
                destCity.pop += count;
                if (destCity.pop < Constants_1.BladeburnerConstants.PopGrowthCeiling) {
                    destCity.pop += Constants_1.BladeburnerConstants.BasePopGrowth;
                }
                if (this.logging.events) {
                    this.log("Intelligence indicates that a Synthoid community migrated from " + sourceCityName + " to some other city");
                }
            }
        }
        else if (chance <= 0.3) {
            // New Synthoids (non community), 20%
            const percentage = (0, getRandomIntInclusive_1.getRandomIntInclusive)(8, 24) / 100;
            const count = Math.round(sourceCity.pop * percentage);
            sourceCity.pop += count;
            if (sourceCity.pop < Constants_1.BladeburnerConstants.PopGrowthCeiling) {
                sourceCity.pop += Constants_1.BladeburnerConstants.BasePopGrowth;
            }
            if (this.logging.events) {
                this.log("Intelligence indicates that the Synthoid population of " + sourceCityName + " just changed significantly");
            }
        }
        else if (chance <= 0.5) {
            // Synthoid migration (non community) 20%
            this.triggerMigration(sourceCityName);
            if (this.logging.events) {
                this.log("Intelligence indicates that a large number of Synthoids migrated from " +
                    sourceCityName +
                    " to some other city");
            }
        }
        else if (chance <= 0.7) {
            // Synthoid Riots (+chaos), 20%
            sourceCity.changeChaosByCount(1);
            sourceCity.changeChaosByPercentage((0, getRandomIntInclusive_1.getRandomIntInclusive)(5, 20));
            if (this.logging.events) {
                this.log("Tensions between Synthoids and humans lead to riots in " + sourceCityName + "! Chaos increased");
            }
        }
        else if (chance <= 0.9) {
            // Less Synthoids, 20%
            const percentage = (0, getRandomIntInclusive_1.getRandomIntInclusive)(8, 20) / 100;
            const count = Math.round(sourceCity.pop * percentage);
            sourceCity.pop -= count;
            if (this.logging.events) {
                this.log("Intelligence indicates that the Synthoid population of " + sourceCityName + " just changed significantly");
            }
        }
        // 10% chance of nothing happening
    }
    /**
     * Return stat to be gained from Contracts, Operations, and Black Operations
     * @param action(Action obj) - Derived action class
     * @param success(bool) - Whether action was successful
     */
    getActionStats(action, person, success) {
        const difficulty = action.getDifficulty();
        /**
         * Gain multiplier based on difficulty. If it changes then the
         * same variable calculated in completeAction() needs to change too
         */
        const difficultyMult = Math.pow(difficulty, Constants_1.BladeburnerConstants.DiffMultExponentialFactor) +
            difficulty / Constants_1.BladeburnerConstants.DiffMultLinearFactor;
        const time = action.getActionTime(this, person);
        const successMult = success ? 1 : 0.5;
        const unweightedGain = time * Constants_1.BladeburnerConstants.BaseStatGain * successMult * difficultyMult;
        const unweightedIntGain = time * Constants_1.BladeburnerConstants.BaseIntGain * successMult * difficultyMult;
        const skillMult = this.getSkillMult(_enums_1.BladeburnerMultName.ExpGain);
        return {
            hackExp: unweightedGain * action.weights.hacking * skillMult,
            strExp: unweightedGain * action.weights.strength * skillMult,
            defExp: unweightedGain * action.weights.defense * skillMult,
            dexExp: unweightedGain * action.weights.dexterity * skillMult,
            agiExp: unweightedGain * action.weights.agility * skillMult,
            chaExp: unweightedGain * action.weights.charisma * skillMult,
            intExp: unweightedIntGain * action.weights.intelligence * skillMult,
            money: 0,
            reputation: 0,
        };
    }
    getDiplomacyPercentage(person) {
        // Returns a percentage by which the city's chaos level should be modified (e.g. 2 for 2%)
        const CharismaLinearFactor = 1e3;
        const CharismaExponentialFactor = 0.045;
        const charismaEff = Math.pow(person.skills.charisma, CharismaExponentialFactor) + person.skills.charisma / CharismaLinearFactor;
        return charismaEff;
    }
    sleeveSupport(joining) {
        if (joining) {
            this.teamSize += 1;
        }
        else {
            this.teamSize -= 1;
        }
    }
    getSkillMult(name) {
        return this.skillMultipliers[name] ?? 1;
    }
    getEffectiveSkillLevel(person, name) {
        switch (name) {
            case "strength":
                return person.skills.strength * this.getSkillMult(_enums_1.BladeburnerMultName.EffStr);
            case "defense":
                return person.skills.defense * this.getSkillMult(_enums_1.BladeburnerMultName.EffDef);
            case "dexterity":
                return person.skills.dexterity * this.getSkillMult(_enums_1.BladeburnerMultName.EffDex);
            case "agility":
                return person.skills.agility * this.getSkillMult(_enums_1.BladeburnerMultName.EffAgi);
            case "charisma":
                return person.skills.charisma * this.getSkillMult(_enums_1.BladeburnerMultName.EffCha);
            default:
                return person.skills[name];
        }
    }
    updateSkillMultipliers() {
        this.skillMultipliers = {};
        for (const skill of Object.values(Skills_1.Skills)) {
            const level = this.getSkillLevel(skill.name);
            if (!level)
                continue;
            for (const [name, baseMult] of (0, Record_1.getRecordEntries)(skill.mults)) {
                const mult = 1 + (baseMult * level) / 100;
                this.skillMultipliers[name] = (0, clampNumber_1.clampNumber)(this.getSkillMult(name) * mult, 0);
            }
        }
    }
    killRandomSupportingSleeves(n) {
        const sup = [..._player_1.Player.sleevesSupportingBladeburner()]; // Explicit shallow copy
        (0, BribeGame_1.shuffleArray)(sup);
        sup.slice(0, Math.min(sup.length, n)).forEach((sleeve) => sleeve.kill());
    }
    completeOperation(success) {
        if (this.action?.type !== _enums_1.BladeburnerActionType.Operation) {
            throw new Error("completeOperation() called even though current action is not an Operation");
        }
        const action = this.getActionObject(this.action);
        const deaths = (0, TeamCasualties_1.resolveTeamCasualties)(action, this, success);
        if (this.logging.ops && deaths > 0) {
            this.log("Lost " + (0, formatNumber_1.formatNumberNoSuffix)(deaths, 0) + " team members during this " + action.name);
        }
        const city = this.getCurrentCity();
        switch (action.name) {
            case _enums_1.BladeburnerOperationName.Investigation:
                if (success) {
                    city.improvePopulationEstimateByPercentage(0.4 * this.getSkillMult(_enums_1.BladeburnerMultName.SuccessChanceEstimate));
                }
                else {
                    this.triggerPotentialMigration(this.city, 0.1);
                }
                break;
            case _enums_1.BladeburnerOperationName.Undercover:
                if (success) {
                    city.improvePopulationEstimateByPercentage(0.8 * this.getSkillMult(_enums_1.BladeburnerMultName.SuccessChanceEstimate));
                }
                else {
                    this.triggerPotentialMigration(this.city, 0.15);
                }
                break;
            case _enums_1.BladeburnerOperationName.Sting:
                if (success) {
                    city.changePopulationByPercentage(-0.1, {
                        changeEstEqually: true,
                        nonZero: true,
                    });
                }
                city.changeChaosByCount(0.1);
                break;
            case _enums_1.BladeburnerOperationName.Raid:
                if (success) {
                    city.changePopulationByPercentage(-1, {
                        changeEstEqually: true,
                        nonZero: true,
                    });
                    --city.comms;
                }
                else {
                    const change = (0, getRandomIntInclusive_1.getRandomIntInclusive)(-10, -5) / 10;
                    city.changePopulationByPercentage(change, {
                        nonZero: true,
                        changeEstEqually: false,
                    });
                }
                city.changeChaosByPercentage((0, getRandomIntInclusive_1.getRandomIntInclusive)(1, 5));
                break;
            case _enums_1.BladeburnerOperationName.StealthRetirement:
                if (success) {
                    city.changePopulationByPercentage(-0.5, {
                        changeEstEqually: true,
                        nonZero: true,
                    });
                }
                city.changeChaosByPercentage((0, getRandomIntInclusive_1.getRandomIntInclusive)(-3, -1));
                break;
            case _enums_1.BladeburnerOperationName.Assassination:
                if (success) {
                    city.changePopulationByCount(-1, { estChange: -1, estOffset: 0 });
                }
                city.changeChaosByPercentage((0, getRandomIntInclusive_1.getRandomIntInclusive)(-5, 5));
                break;
            default:
                (0, throwIfReachable_1.throwIfReachable)(action.name);
        }
    }
    completeContract(success, action) {
        if (!success) {
            return;
        }
        const city = this.getCurrentCity();
        switch (action.name) {
            case _enums_1.BladeburnerContractName.Tracking:
                // Increase estimate accuracy by a relatively small amount
                city.improvePopulationEstimateByCount((0, getRandomIntInclusive_1.getRandomIntInclusive)(100, 1e3) * this.getSkillMult(_enums_1.BladeburnerMultName.SuccessChanceEstimate));
                break;
            case _enums_1.BladeburnerContractName.BountyHunter:
                city.changePopulationByCount(-1, { estChange: -1, estOffset: 0 });
                city.changeChaosByCount(0.02);
                break;
            case _enums_1.BladeburnerContractName.Retirement:
                city.changePopulationByCount(-1, { estChange: -1, estOffset: 0 });
                city.changeChaosByCount(0.04);
                break;
        }
    }
    completeAction(person, actionIdent, isPlayer = true) {
        const currentHp = person.hp.current;
        const getExtraLogAfterTakingDamage = (damage) => {
            let extraLog = "";
            if (currentHp <= damage) {
                if (person instanceof PlayerObject_1.PlayerObject) {
                    extraLog += ` ${person.whoAmI()} was hospitalized. Current HP is ${(0, formatNumber_1.formatHp)(person.hp.current)}.`;
                }
                else if (person instanceof Sleeve_1.Sleeve) {
                    extraLog += ` ${person.whoAmI()} was shocked. Current shock is ${(0, formatNumber_1.formatSleeveShock)(person.shock)}. Current HP is ${(0, formatNumber_1.formatHp)(person.hp.current)}.`;
                }
            }
            else {
                extraLog += ` HP reduced from ${(0, formatNumber_1.formatHp)(currentHp)} to ${(0, formatNumber_1.formatHp)(person.hp.current)}.`;
            }
            return extraLog;
        };
        let retValue = (0, WorkStats_1.newWorkStats)();
        const action = this.getActionObject(actionIdent);
        switch (action.type) {
            case _enums_1.BladeburnerActionType.Contract:
            case _enums_1.BladeburnerActionType.Operation: {
                try {
                    const isOperation = action.type === _enums_1.BladeburnerActionType.Operation;
                    const difficulty = action.getDifficulty();
                    const difficultyMultiplier = Math.pow(difficulty, Constants_1.BladeburnerConstants.DiffMultExponentialFactor) +
                        difficulty / Constants_1.BladeburnerConstants.DiffMultLinearFactor;
                    const rewardMultiplier = Math.pow(action.rewardFac, action.level - 1);
                    if (isPlayer) {
                        // Stamina loss is based on difficulty
                        this.stamina -= Constants_1.BladeburnerConstants.BaseStaminaLoss * difficultyMultiplier;
                        if (this.stamina < 0) {
                            this.stamina = 0;
                        }
                    }
                    // Process Contract/Operation success/failure
                    if (action.attempt(this, person)) {
                        retValue = this.getActionStats(action, person, true);
                        ++action.successes;
                        --action.count;
                        // Earn money for contracts
                        let moneyGain = 0;
                        if (!isOperation) {
                            moneyGain =
                                Constants_1.BladeburnerConstants.ContractBaseMoneyGain *
                                    rewardMultiplier *
                                    this.getSkillMult(_enums_1.BladeburnerMultName.Money);
                            retValue.money = moneyGain;
                        }
                        if (isOperation) {
                            action.setMaxLevel(Constants_1.BladeburnerConstants.OperationSuccessesPerLevel);
                        }
                        else {
                            action.setMaxLevel(Constants_1.BladeburnerConstants.ContractSuccessesPerLevel);
                        }
                        if (action.rankGain) {
                            const gain = (0, addOffset_1.addOffset)((0, Formulas_1.calculateActionRankGain)(action), 10);
                            this.changeRank(person, gain);
                            if (isOperation && this.logging.ops) {
                                this.log(`${person.whoAmI()}: ${action.name} successfully completed! Gained ${(0, formatNumber_2.formatBigNumber)(gain)} rank.`);
                            }
                            else if (!isOperation && this.logging.contracts) {
                                this.log(`${person.whoAmI()}: ${action.name} contract successfully completed! Gained ` +
                                    `${(0, formatNumber_2.formatBigNumber)(gain)} rank and ${(0, formatNumber_2.formatMoney)(moneyGain)}.`);
                            }
                        }
                        isOperation ? this.completeOperation(true) : this.completeContract(true, action);
                        /**
                         * If the player successfully completes a contract/operation involving killing, we deduct their karma by 1.
                         * The amount of reduction must be a small, flat value because the action time of contract/operation can be
                         * reduced to 1 second.
                         */
                        if (action.isKill) {
                            _player_1.Player.karma -= 1;
                        }
                    }
                    else {
                        retValue = this.getActionStats(action, person, false);
                        ++action.failures;
                        --action.count;
                        let loss = 0, damage = 0;
                        if (action.rankLoss) {
                            loss = (0, addOffset_1.addOffset)(action.rankLoss * rewardMultiplier, 10);
                            this.changeRank(person, -1 * loss);
                        }
                        if (action.hpLoss) {
                            damage = action.hpLoss * difficultyMultiplier;
                            damage = Math.ceil((0, addOffset_1.addOffset)(damage, 10));
                            const cost = (0, Hospital_1.calculateHospitalizationCost)(damage);
                            if (person.takeDamage(damage)) {
                                ++this.numHosp;
                                this.moneyLost += cost;
                            }
                        }
                        let logLossText = "";
                        if (loss > 0) {
                            logLossText += ` Lost ${(0, formatNumber_1.formatNumberNoSuffix)(loss, 3)} rank.`;
                        }
                        if (damage > 0) {
                            logLossText += ` Took ${(0, formatNumber_1.formatNumberNoSuffix)(damage, 0)} damage.${getExtraLogAfterTakingDamage(damage)}`;
                        }
                        if (isOperation && this.logging.ops) {
                            this.log(`${person.whoAmI()}: ${action.name} failed!${logLossText}`);
                        }
                        else if (!isOperation && this.logging.contracts) {
                            this.log(`${person.whoAmI()}: ${action.name} contract failed!${logLossText}`);
                        }
                        isOperation ? this.completeOperation(false) : this.completeContract(false, action);
                    }
                    if (action.autoLevel) {
                        action.level = action.maxLevel;
                    } // Autolevel
                }
                catch (e) {
                    (0, exceptionAlert_1.exceptionAlert)(e);
                }
                break;
            }
            case _enums_1.BladeburnerActionType.BlackOp: {
                const difficulty = action.getDifficulty();
                const difficultyMultiplier = Math.pow(difficulty, Constants_1.BladeburnerConstants.DiffMultExponentialFactor) +
                    difficulty / Constants_1.BladeburnerConstants.DiffMultLinearFactor;
                // Stamina loss is based on difficulty
                this.stamina -= Constants_1.BladeburnerConstants.BaseStaminaLoss * difficultyMultiplier;
                if (this.stamina < 0) {
                    this.stamina = 0;
                }
                let deaths;
                if (action.attempt(this, person)) {
                    retValue = this.getActionStats(action, person, true);
                    this.numBlackOpsComplete++;
                    let rankGain = 0;
                    if (action.rankGain) {
                        rankGain = (0, addOffset_1.addOffset)((0, Formulas_1.calculateActionRankGain)(action), 10);
                        this.changeRank(person, rankGain);
                    }
                    deaths = (0, TeamCasualties_1.resolveTeamCasualties)(action, this, true);
                    if (this.logging.blackops) {
                        this.log(`${person.whoAmI()}: ${action.name} successful! Gained ${(0, formatNumber_1.formatNumberNoSuffix)(rankGain, 1)} rank.`);
                    }
                    /**
                     * If the player successfully completes a BlackOp involving killing, we deduct their karma by 15. The amount
                     * of reduction is higher than contract/operation because the number of BlackOps is small. It won't affect the
                     * balance. -15 karma is the same amount of karma for "heist" crime, which is the crime giving the highest
                     * "negative karma".
                     */
                    if (action.isKill) {
                        _player_1.Player.karma -= 15;
                    }
                }
                else {
                    retValue = this.getActionStats(action, person, false);
                    let rankLoss = 0;
                    let damage = 0;
                    if (action.rankLoss) {
                        rankLoss = (0, addOffset_1.addOffset)(action.rankLoss, 10);
                        this.changeRank(person, -1 * rankLoss);
                    }
                    if (action.hpLoss) {
                        damage = action.hpLoss * difficultyMultiplier;
                        damage = Math.ceil((0, addOffset_1.addOffset)(damage, 10));
                        const cost = (0, Hospital_1.calculateHospitalizationCost)(damage);
                        if (person.takeDamage(damage)) {
                            ++this.numHosp;
                            this.moneyLost += cost;
                        }
                    }
                    deaths = (0, TeamCasualties_1.resolveTeamCasualties)(action, this, false);
                    if (this.logging.blackops) {
                        this.log(`${person.whoAmI()}: ${action.name} failed! Lost ${(0, formatNumber_1.formatNumberNoSuffix)(rankLoss, 1)} rank. Took ${(0, formatNumber_1.formatNumberNoSuffix)(damage, 0)} damage.${getExtraLogAfterTakingDamage(damage)}`);
                    }
                }
                this.resetAction(); // Stop regardless of success or fail
                if (this.logging.blackops && deaths > 0) {
                    this.log(`${person.whoAmI()}:  You lost ${(0, formatNumber_1.formatNumberNoSuffix)(deaths, 0)} team members during ${action.name}.`);
                }
                break;
            }
            case _enums_1.BladeburnerActionType.General:
                switch (action.name) {
                    case _enums_1.BladeburnerGeneralActionName.Training: {
                        this.stamina -= 0.5 * Constants_1.BladeburnerConstants.BaseStaminaLoss;
                        const strExpGain = 30 * person.mults.strength_exp, defExpGain = 30 * person.mults.defense_exp, dexExpGain = 30 * person.mults.dexterity_exp, agiExpGain = 30 * person.mults.agility_exp, staminaGain = 0.04 * this.getSkillMult(_enums_1.BladeburnerMultName.Stamina);
                        retValue.strExp = strExpGain;
                        retValue.defExp = defExpGain;
                        retValue.dexExp = dexExpGain;
                        retValue.agiExp = agiExpGain;
                        this.staminaBonus += staminaGain;
                        if (this.logging.general) {
                            this.log(`${person.whoAmI()}: ` +
                                "Training completed. Gained: " +
                                (0, formatNumber_2.formatExp)(strExpGain) +
                                " str exp, " +
                                (0, formatNumber_2.formatExp)(defExpGain) +
                                " def exp, " +
                                (0, formatNumber_2.formatExp)(dexExpGain) +
                                " dex exp, " +
                                (0, formatNumber_2.formatExp)(agiExpGain) +
                                " agi exp, " +
                                (0, formatNumber_2.formatBigNumber)(staminaGain) +
                                " max stamina.");
                        }
                        break;
                    }
                    case _enums_1.BladeburnerGeneralActionName.FieldAnalysis: {
                        // Does not use stamina. Effectiveness depends on hacking, int, and cha
                        let eff = 0.04 * Math.pow(person.skills.hacking, 0.3) +
                            0.04 * Math.pow(person.skills.intelligence, 0.9) +
                            0.02 * Math.pow(person.skills.charisma, 0.3);
                        eff *= person.mults.bladeburner_analysis;
                        if (isNaN(eff) || eff < 0) {
                            throw new Error("Field Analysis Effectiveness calculated to be NaN or negative");
                        }
                        const hackingExpGain = 20 * person.mults.hacking_exp;
                        const charismaExpGain = 20 * person.mults.charisma_exp;
                        const rankGain = (0, Formulas_1.calculateActionRankGain)(action);
                        retValue.hackExp = hackingExpGain;
                        retValue.chaExp = charismaExpGain;
                        retValue.intExp = Constants_1.BladeburnerConstants.BaseIntGain;
                        this.changeRank(person, rankGain);
                        this.getCurrentCity().improvePopulationEstimateByPercentage(eff * this.getSkillMult(_enums_1.BladeburnerMultName.SuccessChanceEstimate));
                        if (this.logging.general) {
                            this.log(`${person.whoAmI()}: ` +
                                `Field analysis completed. Gained ${(0, formatNumber_2.formatBigNumber)(rankGain)} rank, ` +
                                `${(0, formatNumber_2.formatExp)(hackingExpGain)} hacking exp, and ` +
                                `${(0, formatNumber_2.formatExp)(charismaExpGain)} charisma exp.`);
                        }
                        break;
                    }
                    case _enums_1.BladeburnerGeneralActionName.Recruitment: {
                        const actionTime = action.getActionTime(this, person) * 1000;
                        if (action.attempt(this, person)) {
                            const expGain = 2 * Constants_1.BladeburnerConstants.BaseStatGain * actionTime;
                            retValue.chaExp = expGain;
                            ++this.teamSize;
                            if (this.logging.general) {
                                this.log(`${person.whoAmI()}: ` +
                                    "Successfully recruited a team member! Gained " +
                                    (0, formatNumber_2.formatExp)(expGain) +
                                    " charisma exp.");
                            }
                        }
                        else {
                            const expGain = Constants_1.BladeburnerConstants.BaseStatGain * actionTime;
                            retValue.chaExp = expGain;
                            if (this.logging.general) {
                                this.log(`${person.whoAmI()}: ` +
                                    "Failed to recruit a team member. Gained " +
                                    (0, formatNumber_2.formatExp)(expGain) +
                                    " charisma exp.");
                            }
                        }
                        break;
                    }
                    case _enums_1.BladeburnerGeneralActionName.Diplomacy: {
                        const diplomacyPct = this.getDiplomacyPercentage(person);
                        this.getCurrentCity().changeChaosByPercentage(-diplomacyPct);
                        if (this.logging.general) {
                            this.log(`${person.whoAmI()}: Diplomacy completed. Chaos levels in the current city fell by ${(0, formatNumber_2.formatPercent)(diplomacyPct / 100)}.`);
                        }
                        break;
                    }
                    case _enums_1.BladeburnerGeneralActionName.HyperbolicRegen: {
                        person.regenerateHp(Constants_1.BladeburnerConstants.HrcHpGain);
                        const currentStamina = this.stamina;
                        const staminaGain = this.maxStamina * (Constants_1.BladeburnerConstants.HrcStaminaGain / 100);
                        this.stamina = Math.min(this.maxStamina, this.stamina + staminaGain);
                        if (this.logging.general) {
                            let extraLog = "";
                            if (_player_1.Player.hp.current > currentHp) {
                                extraLog += ` Restored ${(0, formatNumber_1.formatHp)(Constants_1.BladeburnerConstants.HrcHpGain)} HP. Current HP is ${(0, formatNumber_1.formatHp)(_player_1.Player.hp.current)}.`;
                            }
                            if (this.stamina > currentStamina) {
                                extraLog += ` Restored ${(0, formatNumber_2.formatStamina)(staminaGain)} stamina. Current stamina is ${(0, formatNumber_2.formatStamina)(this.stamina)}.`;
                            }
                            this.log(`${person.whoAmI()}: Rested in Hyperbolic Regeneration Chamber.${extraLog}`);
                        }
                        break;
                    }
                    case _enums_1.BladeburnerGeneralActionName.InciteViolence: {
                        for (const contract of Object.values(this.contracts)) {
                            contract.count += (60 * 3 * contract.growthFunction()) / Constants_1.BladeburnerConstants.ActionCountGrowthPeriod;
                        }
                        for (const operation of Object.values(this.operations)) {
                            operation.count += (60 * 3 * operation.growthFunction()) / Constants_1.BladeburnerConstants.ActionCountGrowthPeriod;
                        }
                        if (this.logging.general) {
                            this.log(`${person.whoAmI()}: Incited violence in the synthoid communities.`);
                        }
                        for (const cityName of Object.values(_enums_1.CityName)) {
                            const city = this.cities[cityName];
                            city.changeChaosByCount(10);
                            city.changeChaosByCount(city.chaos / Math.log10(city.chaos));
                        }
                        break;
                    }
                    default: {
                        // Verify general actions switch statement is exhaustive
                        const __a = action;
                    }
                }
                break;
            default: {
                // Verify type switch statement is exhaustive
                const __a = action;
            }
        }
        return retValue;
    }
    infiltrateSynthoidCommunities() {
        const infilSleeves = _player_1.Player.sleeves.filter((s) => (0, SleeveInfiltrateWork_1.isSleeveInfiltrateWork)(s.currentWork)).length;
        const amt = Math.pow(infilSleeves, -0.5) / 2;
        for (const contract of Object.values(_enums_1.BladeburnerContractName)) {
            this.contracts[contract].count += amt;
        }
        for (const operation of Object.values(_enums_1.BladeburnerOperationName)) {
            this.operations[operation].count += amt;
        }
        if (this.logging.general) {
            this.log(`Sleeve: Infiltrate the synthoid communities.`);
        }
    }
    changeRank(person, change) {
        if (isNaN(change)) {
            throw new Error("NaN passed into Bladeburner.changeRank()");
        }
        this.rank += change;
        if (this.rank < 0) {
            this.rank = 0;
        }
        this.maxRank = Math.max(this.rank, this.maxRank);
        const bladeburnerFaction = Factions_1.Factions[_enums_1.FactionName.Bladeburners];
        if (bladeburnerFaction.isMember) {
            bladeburnerFaction.playerReputation += (0, Formulas_1.calculateActionReputationGain)(person, change);
        }
        // Gain skill points
        const rankNeededForSp = (this.totalSkillPoints + 1) * Constants_1.BladeburnerConstants.RanksPerSkillPoint;
        if (this.maxRank >= rankNeededForSp) {
            // Calculate how many skill points to gain
            const gainedSkillPoints = Math.floor((this.maxRank - rankNeededForSp) / Constants_1.BladeburnerConstants.RanksPerSkillPoint + 1);
            this.skillPoints += gainedSkillPoints;
            this.totalSkillPoints += gainedSkillPoints;
        }
    }
    processAction(seconds) {
        // Store action to avoid losing reference to it is action is reset during this function
        if (!this.action)
            return; // Idle
        const action = this.getActionObject(this.action);
        // If the action is no longer valid, discontinue the action
        if (!action.getAvailability(this).available)
            return this.resetAction();
        // If the previous action went past its completion time, add to the next action
        // This is not added immediately in case the automation changes the action
        this.actionTimeCurrent += seconds + this.actionTimeOverflow;
        this.actionTimeOverflow = 0;
        // Complete the task if it's complete
        if (this.actionTimeCurrent >= this.actionTimeToComplete) {
            this.actionTimeOverflow = this.actionTimeCurrent - this.actionTimeToComplete;
            const retValue = this.completeAction(_player_1.Player, action.id);
            _player_1.Player.gainMoney(retValue.money, "bladeburner");
            _player_1.Player.gainStats(retValue);
            if (action.type != _enums_1.BladeburnerActionType.BlackOp) {
                this.startAction(action.id); // Attempt to repeat action
            }
        }
    }
    calculateStaminaGainPerSecond() {
        const effAgility = this.getEffectiveSkillLevel(_player_1.Player, "agility");
        const maxStaminaBonus = this.maxStamina / Constants_1.BladeburnerConstants.MaxStaminaToGainFactor;
        const gain = (Constants_1.BladeburnerConstants.StaminaGainPerSecond + maxStaminaBonus) * Math.pow(effAgility, 0.17);
        return (0, clampNumber_1.clampNumber)(gain * (this.getSkillMult(_enums_1.BladeburnerMultName.Stamina) * _player_1.Player.mults.bladeburner_stamina_gain), 0);
    }
    calculateMaxStamina() {
        const baseStamina = Math.pow(this.getEffectiveSkillLevel(_player_1.Player, "agility"), 0.8);
        // Min value of maxStamina is an arbitrarily small positive value. It must not be 0 to avoid NaN stamina penalty.
        const maxStamina = (0, clampNumber_1.clampNumber)((baseStamina + this.staminaBonus) *
            this.getSkillMult(_enums_1.BladeburnerMultName.Stamina) *
            _player_1.Player.mults.bladeburner_max_stamina, 1e-9);
        if (this.maxStamina === maxStamina) {
            return;
        }
        // If max stamina changed, adjust stamina accordingly
        const oldMax = this.maxStamina;
        this.maxStamina = maxStamina;
        this.stamina = (0, clampNumber_1.clampNumber)((this.maxStamina * this.stamina) / oldMax, 0, maxStamina);
    }
    getSkillLevel(skillName) {
        return this.skills[skillName] ?? 0;
    }
    process() {
        // Edge race condition when the engine checks the processing counters and attempts to route before the router is initialized.
        if (GameRoot_1.Router.page() === Router_1.Page.LoadingScreen)
            return;
        // If the Player starts doing some other actions, set action to idle and alert
        if (!_player_1.Player.hasAugmentation(_enums_1.AugmentationName.BladesSimulacrum, true) && _player_1.Player.currentWork) {
            if (this.action) {
                let msg = "Your Bladeburner action was cancelled because you started doing something else.";
                if (this.automateEnabled) {
                    msg += `\n\nYour automation was disabled as well. You will have to re-enable it through the Bladeburner console`;
                    this.automateEnabled = false;
                }
                if (!Settings_1.Settings.SuppressBladeburnerPopup) {
                    (0, DialogBox_1.dialogBoxCreate)(msg);
                }
            }
            this.resetAction();
        }
        // If the Player has no Stamina, set action to idle
        if (this.stamina <= 0) {
            this.log("Your Bladeburner action was cancelled because your stamina hit 0");
            this.resetAction();
        }
        // A 'tick' for this mechanic is one second (= 5 game cycles)
        if (this.storedCycles >= Constants_1.BladeburnerConstants.CyclesPerSecond) {
            let seconds = Math.floor(this.storedCycles / Constants_1.BladeburnerConstants.CyclesPerSecond);
            seconds = Math.min(seconds, 5); // Max of 5 'ticks'
            this.storedCycles -= seconds * Constants_1.BladeburnerConstants.CyclesPerSecond;
            // Stamina
            this.calculateMaxStamina();
            this.stamina += this.calculateStaminaGainPerSecond() * seconds;
            this.stamina = Math.min(this.maxStamina, this.stamina);
            // Count increase for contracts/operations
            for (const contract of Object.values(this.contracts)) {
                contract.count += (seconds * contract.growthFunction()) / Constants_1.BladeburnerConstants.ActionCountGrowthPeriod;
            }
            for (const op of Object.values(this.operations)) {
                op.count += (seconds * op.growthFunction()) / Constants_1.BladeburnerConstants.ActionCountGrowthPeriod;
            }
            // Chaos goes down very slowly
            for (const cityName of Object.values(_enums_1.CityName)) {
                const city = this.cities[cityName];
                if (!city)
                    throw new Error("Invalid city when processing passive chaos reduction in Bladeburner.process");
                city.chaos -= 0.0001 * seconds;
                city.chaos = Math.max(0, city.chaos);
            }
            // Random Events
            this.randomEventCounter -= seconds;
            if (this.randomEventCounter <= 0) {
                this.randomEvent();
                // Add instead of setting because we might have gone over the required time for the event
                this.randomEventCounter += (0, getRandomIntInclusive_1.getRandomIntInclusive)(240, 600);
            }
            this.processAction(seconds);
            // Automation
            if (this.automateEnabled) {
                // Note: Do NOT set this.action = this.automateActionHigh/Low since it creates a reference
                if (this.stamina <= this.automateThreshLow && this.action?.name !== this.automateActionLow?.name) {
                    this.startAction(this.automateActionLow);
                }
                else if (this.stamina >= this.automateThreshHigh && this.action?.name !== this.automateActionHigh?.name) {
                    this.startAction(this.automateActionHigh);
                }
            }
            // Handle "nextUpdate" resolver after this update
            if (exports.BladeburnerPromise.resolve) {
                exports.BladeburnerPromise.resolve(seconds * 1000);
                exports.BladeburnerPromise.resolve = null;
                exports.BladeburnerPromise.promise = null;
            }
        }
    }
    getActionObject(actionId) {
        switch (actionId.type) {
            case _enums_1.BladeburnerActionType.Contract:
                return this.contracts[actionId.name];
            case _enums_1.BladeburnerActionType.Operation:
                return this.operations[actionId.name];
            case _enums_1.BladeburnerActionType.BlackOp:
                return BlackOperations_1.BlackOperations[actionId.name];
            case _enums_1.BladeburnerActionType.General:
                return GeneralActions_1.GeneralActions[actionId.name];
        }
    }
    getActionFromTypeAndName(type, name) {
        /**
         * Typecasting "name" instead of checking it with getEnumHelper().isMember() is intentional. The callers will handle
         * the undefined value if "name" is invalid.
         */
        switch (type) {
            case _enums_1.BladeburnerActionType.General:
                return GeneralActions_1.GeneralActions[name];
            case _enums_1.BladeburnerActionType.Contract:
                return this.contracts[name];
            case _enums_1.BladeburnerActionType.Operation:
                return this.operations[name];
            case _enums_1.BladeburnerActionType.BlackOp:
                return BlackOperations_1.BlackOperations[name];
        }
    }
    /** Fuzzy matching for action identifiers. Do not use this function for anything except BB console. */
    guessActionFromTypeAndName(type, name) {
        if (!type || !name)
            return null;
        const id = (0, terminalShorthands_1.autoCompleteTypeShorthand)(type, name);
        return id ? this.getActionObject(id) : null;
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("Bladeburner", this, Bladeburner.keysToSave);
    }
    /** Initializes a Bladeburner object from a JSON save state. */
    static fromJSON(value) {
        (0, TypeAssertion_1.assertObject)(value.data);
        // operations and contracts are not loaded directly from the save, we load them in using a different method
        const contractsData = value.data.contracts;
        const operationsData = value.data.operations;
        const bladeburner = (0, JSONReviver_1.Generic_fromJSON)(Bladeburner, value.data, Bladeburner.keysToLoad);
        /**
         * Handle migration from pre-v2.6.1 versions:
         * - pre-v2.6.1:
         *   - action is an instance of the ActionIdentifier class. It cannot be null.
         *   - action.type is a number.
         * - 2.6.1:
         *   - action is a nullable plain object. ActionIdentifier is a "type".
         *   - action.type is a string.
         */
        if (bladeburner.action && typeof bladeburner.action.type === "number") {
            bladeburner.action = (0, loadActionIdentifier_1.loadActionIdentifier)(bladeburner.action);
            if (bladeburner.automateActionHigh) {
                bladeburner.automateActionHigh = (0, loadActionIdentifier_1.loadActionIdentifier)(bladeburner.automateActionHigh);
            }
            if (bladeburner.automateActionLow) {
                bladeburner.automateActionLow = (0, loadActionIdentifier_1.loadActionIdentifier)(bladeburner.automateActionLow);
            }
        }
        // Loading this way allows better typesafety and also allows faithfully reconstructing contracts/operations
        // even from save data that is missing a lot of static info about the objects.
        (0, Contracts_1.loadContractsData)(contractsData, bladeburner.contracts);
        (0, Operations_1.loadOperationsData)(operationsData, bladeburner.operations);
        // Regenerate skill multiplier data, which is not included in savedata
        bladeburner.updateSkillMultipliers();
        // If stamina or maxStamina is invalid, we set both of them to 1 and recalculate them.
        if (!Number.isFinite(bladeburner.stamina) ||
            !Number.isFinite(bladeburner.maxStamina) ||
            bladeburner.maxStamina === 0) {
            bladeburner.stamina = 1;
            bladeburner.maxStamina = 1;
            bladeburner.calculateMaxStamina();
        }
        return bladeburner;
    }
}
exports.Bladeburner = Bladeburner;
Bladeburner.keysToSave = (0, getKeyList_1.getKeyList)(Bladeburner, { removedKeys: ["skillMultipliers"] });
// Don't load contracts or operations because of the special loading method they use, see fromJSON
Bladeburner.keysToLoad = (0, getKeyList_1.getKeyList)(Bladeburner, { removedKeys: ["skillMultipliers", "contracts", "operations"] });
JSONReviver_1.constructorsForReviver.Bladeburner = Bladeburner;
