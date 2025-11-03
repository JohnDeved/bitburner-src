"use strict";
/**
 * Sleeves are bodies that contain the player's cloned consciousness.
 * The player can use these bodies to perform different tasks synchronously.
 *
 * Each sleeve is its own individual, meaning it has its own stats/exp
 *
 * Sleeves are unlocked in BitNode-10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sleeve = void 0;
const _player_1 = require("@player");
const Person_1 = require("../Person");
const Constants_1 = require("../../Constants");
const _enums_1 = require("@enums");
const Factions_1 = require("../../Faction/Factions");
const JSONReviver_1 = require("../../utils/JSONReviver");
const SleeveClassWork_1 = require("./Work/SleeveClassWork");
const SleeveSynchroWork_1 = require("./Work/SleeveSynchroWork");
const SleeveRecoveryWork_1 = require("./Work/SleeveRecoveryWork");
const SleeveFactionWork_1 = require("./Work/SleeveFactionWork");
const SleeveCompanyWork_1 = require("./Work/SleeveCompanyWork");
const SleeveInfiltrateWork_1 = require("./Work/SleeveInfiltrateWork");
const SleeveSupportWork_1 = require("./Work/SleeveSupportWork");
const SleeveBladeburnerWork_1 = require("./Work/SleeveBladeburnerWork");
const SleeveCrimeWork_1 = require("./Work/SleeveCrimeWork");
const intelligence_1 = require("../formulas/intelligence");
const EnumHelper_1 = require("../../utils/EnumHelper");
const Multipliers_1 = require("../Multipliers");
const FactionHelpers_1 = require("../../Faction/FactionHelpers");
const Augmentations_1 = require("../../Augmentation/Augmentations");
const AugmentationHelpers_1 = require("../../Augmentation/AugmentationHelpers");
class Sleeve extends Person_1.Person {
    constructor() {
        super();
        this.currentWork = null;
        /** Clone retains 'memory' synchronization (and maybe exp?) upon prestige/installing Augs */
        this.memory = 1;
        /**
         * Sleeve shock. Number between 0 and 100
         * Trauma/shock that comes with being in a sleeve. Experience earned
         * is multiplied by shock%. This gets applied before synchronization
         *
         * Reputation earned is also multiplied by shock%
         */
        this.shock = 100;
        /** Stored number of game "loop" cycles */
        this.storedCycles = 0;
        /**
         * Synchronization. Number between 0 and 100
         * When experience is earned  by sleeve, both the player and the sleeve get
         * sync% of the experience earned.
         */
        this.sync = 1;
        this.shockRecovery();
    }
    /** Updates this object's multipliers for the given augmentation */
    applyAugmentation(aug) {
        this.mults = (0, Multipliers_1.mergeMultipliers)(this.mults, aug.mults);
    }
    findPurchasableAugs() {
        // You can only purchase Augmentations that are actually available from
        // your factions. I.e. you must be in a faction that has the Augmentation
        // and you must also have enough rep in that faction in order to purchase it.
        const ownedAugNames = this.augmentations.map((e) => e.name);
        const availableAugs = [];
        // Helper function that helps filter out augs that are already owned
        // and augs that aren't allowed for sleeves
        function isAvailableForSleeve(aug) {
            if (ownedAugNames.includes(aug.name))
                return false;
            if (availableAugs.includes(aug))
                return false;
            if (aug.isSpecial)
                return false;
            const validMults = [
                "hacking",
                "strength",
                "defense",
                "dexterity",
                "agility",
                "charisma",
                "hacking_exp",
                "strength_exp",
                "defense_exp",
                "dexterity_exp",
                "agility_exp",
                "charisma_exp",
                "company_rep",
                "faction_rep",
                "crime_money",
                "crime_success",
                "work_money",
            ];
            for (const mult of validMults) {
                if (aug.mults[mult] !== 1)
                    return true;
            }
            return false;
        }
        // If player is in a gang, then we return all augs that the player
        // has enough reputation for (since that gang offers all augs)
        if (_player_1.Player.gang) {
            const fac = _player_1.Player.getGangFaction();
            const gangAugs = (0, FactionHelpers_1.getFactionAugmentationsFiltered)(fac);
            for (const augName of gangAugs) {
                const aug = Augmentations_1.Augmentations[augName];
                if (!isAvailableForSleeve(aug))
                    continue;
                if (fac.playerReputation > (0, AugmentationHelpers_1.getAugCost)(aug).repCost) {
                    availableAugs.push(aug);
                }
            }
        }
        for (const facName of _player_1.Player.factions) {
            if (facName === _enums_1.FactionName.Bladeburners)
                continue;
            if (facName === _enums_1.FactionName.Netburners)
                continue;
            const fac = Factions_1.Factions[facName];
            if (!fac)
                continue;
            for (const augName of fac.augmentations) {
                const aug = Augmentations_1.Augmentations[augName];
                if (!isAvailableForSleeve(aug))
                    continue;
                if (fac.playerReputation > (0, AugmentationHelpers_1.getAugCost)(aug).repCost) {
                    availableAugs.push(aug);
                }
            }
        }
        // Add the stanek sleeve aug
        if (!ownedAugNames.includes(_enums_1.AugmentationName.ZOE) && _player_1.Player.factions.includes(_enums_1.FactionName.ChurchOfTheMachineGod)) {
            const aug = Augmentations_1.Augmentations[_enums_1.AugmentationName.ZOE];
            availableAugs.push(aug);
        }
        return availableAugs;
    }
    shockBonus() {
        return (100 - this.shock) / 100;
    }
    syncBonus() {
        return this.sync / 100;
    }
    startWork(w) {
        if (this.currentWork)
            this.currentWork.finish();
        this.currentWork = w;
    }
    stopWork() {
        if (this.currentWork)
            this.currentWork.finish();
        this.currentWork = null;
    }
    /** Commit crimes */
    commitCrime(type) {
        this.startWork(new SleeveCrimeWork_1.SleeveCrimeWork(type));
        return true;
    }
    /** Returns the cost of upgrading this sleeve's memory by a certain amount */
    getMemoryUpgradeCost(n) {
        const amt = Math.round(n);
        if (amt < 0) {
            return 0;
        }
        if (this.memory + amt > 100) {
            return this.getMemoryUpgradeCost(100 - this.memory);
        }
        const mult = 1.02;
        const baseCost = 1e12;
        let currCost = 0;
        let currMemory = this.memory - 1;
        for (let i = 0; i < n; ++i) {
            currCost += Math.pow(mult, currMemory);
            ++currMemory;
        }
        return currCost * baseCost;
    }
    installAugmentation(aug) {
        this.exp.hacking = 0;
        this.exp.strength = 0;
        this.exp.defense = 0;
        this.exp.dexterity = 0;
        this.exp.agility = 0;
        this.exp.charisma = 0;
        this.applyAugmentation(aug);
        this.augmentations.push({ name: aug.name, level: 1 });
        this.updateSkillLevels();
    }
    /** Called on every sleeve for a Source File Prestige */
    prestige() {
        // Reset augs and multipliers
        this.augmentations = [];
        this.resetMultipliers();
        // Reset exp
        this.exp.hacking = 0;
        this.exp.strength = 0;
        this.exp.defense = 0;
        this.exp.dexterity = 0;
        this.exp.agility = 0;
        this.exp.charisma = 0;
        this.updateSkillLevels();
        this.hp.current = this.hp.max;
        // Reset task-related stuff
        this.stopWork();
        this.shockRecovery();
        // Reset Location
        this.city = _enums_1.CityName.Sector12;
        // Reset sleeve-related stats
        this.shock = 100;
        this.storedCycles = 0;
        this.sync = Math.max(this.memory, 1);
    }
    /**
     * Process loop
     * Returns an object containing the amount of experience that should be
     * transferred to all other sleeves
     */
    process(numCycles = 1) {
        // Only process once every second (5 cycles)
        const CyclesPerSecond = 1000 / Constants_1.CONSTANTS.MilliPerCycle;
        this.storedCycles += numCycles;
        if (this.storedCycles < CyclesPerSecond || !this.currentWork)
            return;
        const cyclesUsed = Math.min(this.storedCycles, 15);
        this.shock = Math.max(0, this.shock - 0.0001 * (0, intelligence_1.calculateIntelligenceBonus)(this.skills.intelligence, 0.75) * cyclesUsed);
        this.currentWork.process(this, cyclesUsed);
        this.storedCycles -= cyclesUsed;
    }
    shockRecovery() {
        this.startWork(new SleeveRecoveryWork_1.SleeveRecoveryWork());
        return true;
    }
    synchronize() {
        this.startWork(new SleeveSynchroWork_1.SleeveSynchroWork());
        return true;
    }
    /** Take a course at a university */
    takeUniversityCourse(universityName, className) {
        // Set exp/money multipliers based on which university.
        // Also check that the sleeve is in the right city
        let loc;
        switch (universityName) {
            case _enums_1.LocationName.AevumSummitUniversity: {
                if (this.city !== _enums_1.CityName.Aevum)
                    return false;
                loc = _enums_1.LocationName.AevumSummitUniversity;
                break;
            }
            case _enums_1.LocationName.Sector12RothmanUniversity: {
                if (this.city !== _enums_1.CityName.Sector12)
                    return false;
                loc = _enums_1.LocationName.Sector12RothmanUniversity;
                break;
            }
            case _enums_1.LocationName.VolhavenZBInstituteOfTechnology: {
                if (this.city !== _enums_1.CityName.Volhaven)
                    return false;
                loc = _enums_1.LocationName.VolhavenZBInstituteOfTechnology;
                break;
            }
        }
        if (!loc)
            return false;
        // Set experience/money gains based on class
        let classType;
        switch (className) {
            case _enums_1.ClassType.computerScience:
                classType = _enums_1.UniversityClassType.computerScience;
                break;
            case _enums_1.ClassType.dataStructures:
                classType = _enums_1.UniversityClassType.dataStructures;
                break;
            case _enums_1.ClassType.networks:
                classType = _enums_1.UniversityClassType.networks;
                break;
            case _enums_1.ClassType.algorithms:
                classType = _enums_1.UniversityClassType.algorithms;
                break;
            case _enums_1.ClassType.management:
                classType = _enums_1.UniversityClassType.management;
                break;
            case _enums_1.ClassType.leadership:
                classType = _enums_1.UniversityClassType.leadership;
                break;
        }
        if (!classType)
            return false;
        this.startWork(new SleeveClassWork_1.SleeveClassWork({
            classType: classType,
            location: loc,
        }));
        return true;
    }
    tryBuyAugmentation(aug) {
        if (!_player_1.Player.canAfford(aug.baseCost)) {
            return false;
        }
        // Verify that this sleeve does not already have that augmentation.
        if (this.hasAugmentation(aug.name))
            return false;
        // Verify that the augmentation is available for purchase.
        if (!this.findPurchasableAugs().includes(aug))
            return false;
        _player_1.Player.loseMoney(aug.baseCost, "sleeves");
        this.installAugmentation(aug);
        return true;
    }
    upgradeMemory(n) {
        this.memory = Math.min(100, Math.round(this.memory + n));
    }
    /**
     * Start work for one of the player's companies
     * Returns boolean indicating success
     */
    workForCompany(companyName) {
        const companyPositionName = _player_1.Player.jobs[companyName];
        if (!companyPositionName)
            return false;
        this.startWork(new SleeveCompanyWork_1.SleeveCompanyWork(companyName));
        return true;
    }
    workForFaction(factionName, workType) {
        const faction = Factions_1.Factions[factionName];
        const factionInfo = faction.getInfo();
        switch (workType) {
            case _enums_1.FactionWorkType.field:
                if (!factionInfo.offerFieldWork)
                    return false;
                break;
            case _enums_1.FactionWorkType.hacking:
                if (!factionInfo.offerHackingWork)
                    return false;
                break;
            case _enums_1.FactionWorkType.security:
                if (!factionInfo.offerSecurityWork)
                    return false;
                break;
        }
        this.startWork(new SleeveFactionWork_1.SleeveFactionWork({
            factionWorkType: workType,
            factionName: factionName,
        }));
        return true;
    }
    /** Begin a gym workout task */
    workoutAtGym(gymName, stat) {
        // Check that the sleeve is in the right city
        let loc;
        switch (gymName) {
            case _enums_1.LocationName.AevumCrushFitnessGym: {
                if (this.city !== _enums_1.CityName.Aevum)
                    return false;
                loc = _enums_1.LocationName.AevumCrushFitnessGym;
                break;
            }
            case _enums_1.LocationName.AevumSnapFitnessGym: {
                if (this.city !== _enums_1.CityName.Aevum)
                    return false;
                loc = _enums_1.LocationName.AevumSnapFitnessGym;
                break;
            }
            case _enums_1.LocationName.Sector12IronGym: {
                if (this.city !== _enums_1.CityName.Sector12)
                    return false;
                loc = _enums_1.LocationName.Sector12IronGym;
                break;
            }
            case _enums_1.LocationName.Sector12PowerhouseGym: {
                if (this.city !== _enums_1.CityName.Sector12)
                    return false;
                loc = _enums_1.LocationName.Sector12PowerhouseGym;
                break;
            }
            case _enums_1.LocationName.VolhavenMilleniumFitnessGym: {
                if (this.city !== _enums_1.CityName.Volhaven)
                    return false;
                loc = _enums_1.LocationName.VolhavenMilleniumFitnessGym;
                break;
            }
        }
        if (!loc)
            return false;
        this.startWork(new SleeveClassWork_1.SleeveClassWork({
            classType: stat,
            location: loc,
        }));
        return true;
    }
    /** Begin a bladeburner task */
    bladeburner(action, contract) {
        if (!_player_1.Player.bladeburner)
            return false;
        switch (action) {
            case _enums_1.BladeburnerGeneralActionName.Training:
                this.startWork(new SleeveBladeburnerWork_1.SleeveBladeburnerWork({
                    actionId: { type: _enums_1.BladeburnerActionType.General, name: _enums_1.BladeburnerGeneralActionName.Training },
                }));
                return true;
            case _enums_1.BladeburnerGeneralActionName.FieldAnalysis:
                this.startWork(new SleeveBladeburnerWork_1.SleeveBladeburnerWork({
                    actionId: { type: _enums_1.BladeburnerActionType.General, name: _enums_1.BladeburnerGeneralActionName.FieldAnalysis },
                }));
                return true;
            case _enums_1.BladeburnerGeneralActionName.Recruitment:
                this.startWork(new SleeveBladeburnerWork_1.SleeveBladeburnerWork({
                    actionId: { type: _enums_1.BladeburnerActionType.General, name: _enums_1.BladeburnerGeneralActionName.Recruitment },
                }));
                return true;
            case _enums_1.BladeburnerGeneralActionName.Diplomacy:
                this.startWork(new SleeveBladeburnerWork_1.SleeveBladeburnerWork({
                    actionId: { type: _enums_1.BladeburnerActionType.General, name: _enums_1.BladeburnerGeneralActionName.Diplomacy },
                }));
                return true;
            case _enums_1.BladeburnerGeneralActionName.HyperbolicRegen:
                this.startWork(new SleeveBladeburnerWork_1.SleeveBladeburnerWork({
                    actionId: { type: _enums_1.BladeburnerActionType.General, name: _enums_1.BladeburnerGeneralActionName.HyperbolicRegen },
                }));
                return true;
            case _enums_1.SpecialBladeburnerActionTypeForSleeve.InfiltrateSynthoids:
                this.startWork(new SleeveInfiltrateWork_1.SleeveInfiltrateWork());
                return true;
            case _enums_1.SpecialBladeburnerActionTypeForSleeve.SupportMainSleeve:
                this.startWork(new SleeveSupportWork_1.SleeveSupportWork());
                return true;
            case _enums_1.SpecialBladeburnerActionTypeForSleeve.TakeOnContracts:
                if (!(0, EnumHelper_1.getEnumHelper)("BladeburnerContractName").isMember(contract))
                    return false;
                this.startWork(new SleeveBladeburnerWork_1.SleeveBladeburnerWork({ actionId: { type: _enums_1.BladeburnerActionType.Contract, name: contract } }));
                return true;
        }
        return false;
    }
    travelCostMoneySource() {
        return "sleeves";
    }
    /** Sleeves are immortal, but we damage them for max hp so they get shocked */
    kill() {
        return this.takeDamage(this.hp.max);
    }
    takeDamage(amt) {
        if (typeof amt !== "number") {
            console.warn(`Player.takeDamage() called without a numeric argument: ${amt}`);
            return false;
        }
        this.hp.current -= amt;
        if (this.hp.current <= 0) {
            this.shock = Math.min(100, this.shock + 0.5);
            this.hp.current = this.hp.max;
            return true;
        }
        else {
            return false;
        }
    }
    static recalculateNumOwned() {
        /**
         * Don't change sourceFileLvl to activeSourceFileLvl. The number of sleeves is a permanent effect. It's too
         * troublesome for the player if they lose Sleeves and have to go BN10 to buy them again when they override the
         * level of SF 10.
         */
        const numSleeves = Math.min(3, _player_1.Player.sourceFileLvl(10) + (_player_1.Player.bitNodeN === 10 ? 1 : 0)) + _player_1.Player.sleevesFromCovenant;
        while (_player_1.Player.sleeves.length > numSleeves) {
            const destroyedSleeve = _player_1.Player.sleeves.pop();
            // This should not happen, but avoid an infinite loop in case sleevesFromCovenent or sf10 level are somehow negative
            if (!destroyedSleeve)
                return;
            // Stop work, to prevent destroyed sleeves from continuing their tasks in the void
            destroyedSleeve.stopWork();
        }
        while (_player_1.Player.sleeves.length < numSleeves)
            _player_1.Player.sleeves.push(new Sleeve());
    }
    whoAmI() {
        return "Sleeve";
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("Sleeve", this);
    }
    /** Initializes a Sleeve object from a JSON save state. */
    static fromJSON(value) {
        const sleeve = (0, JSONReviver_1.Generic_fromJSON)(Sleeve, value.data);
        if (!sleeve.hp?.current || !sleeve.hp?.max)
            sleeve.hp = { current: 10, max: 10 };
        // Remove any invalid aug names on game load
        sleeve.augmentations = sleeve.augmentations.filter((ownedAug) => (0, EnumHelper_1.getEnumHelper)("AugmentationName").isMember(ownedAug.name));
        sleeve.queuedAugmentations = sleeve.queuedAugmentations.filter((ownedAug) => (0, EnumHelper_1.getEnumHelper)("AugmentationName").isMember(ownedAug.name));
        return sleeve;
    }
}
exports.Sleeve = Sleeve;
JSONReviver_1.constructorsForReviver.Sleeve = Sleeve;
