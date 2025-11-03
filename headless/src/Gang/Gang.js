"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gang = exports.GangPromise = exports.RecruitmentResult = void 0;
const Factions_1 = require("../Faction/Factions");
const DialogBox_1 = require("../ui/React/DialogBox");
const JSONReviver_1 = require("../utils/JSONReviver");
const exceptionAlert_1 = require("../utils/helpers/exceptionAlert");
const getRandomIntInclusive_1 = require("../utils/helpers/getRandomIntInclusive");
const Constants_1 = require("./data/Constants");
const GangMemberTasks_1 = require("./GangMemberTasks");
const AllGangs_1 = require("./AllGangs");
const GangMember_1 = require("./GangMember");
const _player_1 = require("@player");
const power_1 = require("./data/power");
const _enums_1 = require("@enums");
const Constants_2 = require("../Constants");
var RecruitmentResult;
(function (RecruitmentResult) {
    RecruitmentResult["Success"] = "Success";
    RecruitmentResult["EmptyName"] = "Member name cannot be an empty string";
    RecruitmentResult["DuplicatedName"] = "This name was used";
    RecruitmentResult["ExceedMaxNumber"] = "Your gang recruited maximum number of members";
    RecruitmentResult["NotEnoughRespect"] = "Your gang does not have enough respect to recruit more members";
})(RecruitmentResult || (exports.RecruitmentResult = RecruitmentResult = {}));
exports.GangPromise = { promise: null, resolve: null };
class Gang {
    constructor(facName = _enums_1.FactionName.SlumSnakes, hacking = false) {
        this.facName = facName;
        this.members = [];
        this.wanted = 1;
        this.respect = 1;
        this.isHackingGang = hacking;
        this.respectGainRate = 0;
        this.wantedGainRate = 0;
        this.moneyGainRate = 0;
        // When processing gains, this stores the number of cycles until some
        // limit is reached, and then calculates and applies the gains only at that limit
        this.storedCycles = 0;
        // Separate variable to keep track of cycles for Territory + Power gang, which
        // happens on a slower "clock" than normal processing
        this.storedTerritoryAndPowerCycles = 0;
        this.territoryClashChance = 0;
        this.territoryWarfareEngaged = false;
        this.notifyMemberDeath = true;
    }
    getPower() {
        return AllGangs_1.AllGangs[this.facName].power;
    }
    getTerritory() {
        return AllGangs_1.AllGangs[this.facName].territory;
    }
    /** Main process function called by the engine loop every game cycle */
    process(numCycles = 1) {
        this.storedCycles += numCycles;
        if (this.storedCycles < Constants_1.GangConstants.minCyclesToProcess)
            return;
        // Calculate how many cycles to actually process.
        const cycles = Math.min(this.storedCycles, Constants_1.GangConstants.maxCyclesToProcess);
        try {
            this.processGains(cycles);
            this.processExperienceGains(cycles);
            this.processTerritoryAndPowerGains(cycles);
            this.storedCycles -= cycles;
        }
        catch (e) {
            (0, exceptionAlert_1.exceptionAlert)(e, true);
        }
        // Handle "nextUpdate" resolver after this update
        if (exports.GangPromise.resolve) {
            exports.GangPromise.resolve(cycles * Constants_2.CONSTANTS.MilliPerCycle);
            exports.GangPromise.resolve = null;
            exports.GangPromise.promise = null;
        }
    }
    /** Process respect/wanted/money gains
     * @param numCycles The number of cycles to process. */
    processGains(numCycles) {
        let moneyGainPerCycle = 0;
        let wantedLevelGainPerCycle = 0;
        let respectGainsTotal = 0;
        /** Number of members performing actions that lower wanted level */
        let justice = 0;
        for (const member of this.members) {
            respectGainsTotal += member.earnRespect(numCycles, this);
            moneyGainPerCycle += member.calculateMoneyGain(this);
            wantedLevelGainPerCycle += member.calculateWantedLevelGain(this);
            if (member.getTask().baseWanted < 0)
                justice++;
        }
        this.respectGainRate = respectGainsTotal / numCycles;
        this.wantedGainRate = wantedLevelGainPerCycle;
        this.moneyGainRate = moneyGainPerCycle;
        this.respect += respectGainsTotal;
        // Faction reputation gains is respect gain divided by some constant
        const gangFaction = Factions_1.Factions[this.facName];
        if (!gangFaction) {
            (0, DialogBox_1.dialogBoxCreate)("ERROR: Could not get Faction associates with your gang. This is a bug, please report to game dev");
            throw new Error("Could not find the faction associated with this gang.");
        }
        const favorMult = 1 + gangFaction.favor / 100;
        gangFaction.playerReputation +=
            (_player_1.Player.mults.faction_rep * respectGainsTotal * favorMult) / Constants_1.GangConstants.GangRespectToReputationRatio;
        if (this.wanted !== 1 || wantedLevelGainPerCycle >= 0) {
            const oldWanted = this.wanted;
            const newWanted = oldWanted + wantedLevelGainPerCycle * numCycles;
            // Allows recovery when wanted / respect ratio is too high
            this.wanted = newWanted * (1 - justice * 0.001);
            this.wantedGainRate = (this.wanted - oldWanted) / numCycles;
            // Prevent overflow
            if (this.wanted < 1 || (wantedLevelGainPerCycle <= 0 && this.wanted > oldWanted)) {
                this.wanted = 1;
            }
        }
        _player_1.Player.gainMoney(moneyGainPerCycle * numCycles, "gang");
    }
    /** Process Territory and Power
     * @param numCycles The number of cycles to process. */
    processTerritoryAndPowerGains(numCycles) {
        function calculateTerritoryGain(winGang, loseGang) {
            const powerBonus = Math.max(1, 1 + Math.log(AllGangs_1.AllGangs[winGang].power / AllGangs_1.AllGangs[loseGang].power) / Math.log(50));
            const gains = Math.min(AllGangs_1.AllGangs[loseGang].territory, powerBonus * 0.0001 * (Math.random() + 0.5));
            return gains;
        }
        this.storedTerritoryAndPowerCycles += numCycles;
        if (this.storedTerritoryAndPowerCycles < Constants_1.GangConstants.CyclesPerTerritoryAndPowerUpdate)
            return;
        this.storedTerritoryAndPowerCycles -= Constants_1.GangConstants.CyclesPerTerritoryAndPowerUpdate;
        // Process power first
        const gangName = this.facName;
        for (const name of Object.keys(AllGangs_1.AllGangs)) {
            if (Object.hasOwn(AllGangs_1.AllGangs, name)) {
                if (name == gangName) {
                    AllGangs_1.AllGangs[name].power += this.calculatePower();
                }
                else {
                    // All NPC gangs get random power gains
                    const gainRoll = Math.random();
                    if (gainRoll < 0.5) {
                        // Multiplicative gain (50% chance)
                        // This is capped per cycle, to prevent it from getting out of control
                        const multiplicativeGain = AllGangs_1.AllGangs[name].power * 0.005;
                        AllGangs_1.AllGangs[name].power += Math.min(0.85, multiplicativeGain);
                    }
                    else {
                        // Additive gain (50% chance)
                        const powerMult = power_1.PowerMultiplier[name];
                        if (powerMult === undefined)
                            throw new Error("Should not be undefined");
                        const additiveGain = 0.75 * gainRoll * AllGangs_1.AllGangs[name].territory * powerMult;
                        AllGangs_1.AllGangs[name].power += additiveGain;
                    }
                }
            }
        }
        // Determine if territory should be processed
        if (this.territoryWarfareEngaged) {
            this.territoryClashChance = 1;
        }
        else if (this.territoryClashChance > 0) {
            // Engagement turned off, but still a positive clash chance. So there's
            // still a chance of clashing but it slowly goes down over time
            this.territoryClashChance = Math.max(0, this.territoryClashChance - 0.01);
        }
        // Then process territory
        const gangs = Constants_1.GangConstants.Names.filter((g) => AllGangs_1.AllGangs[g].territory > 0 || g === gangName);
        if (gangs.length > 1) {
            for (let i = 0; i < gangs.length; ++i) {
                const others = gangs.filter((e) => {
                    return e !== gangs[i];
                });
                const other = (0, getRandomIntInclusive_1.getRandomIntInclusive)(0, others.length - 1);
                const thisGang = gangs[i];
                const otherGang = others[other];
                // If either of the gangs involved in this clash is the player, determine
                // whether to skip or process it using the clash chance
                if (thisGang === gangName || otherGang === gangName) {
                    if (!(Math.random() < this.territoryClashChance))
                        continue;
                }
                if (Math.random() < (0, AllGangs_1.getClashWinChance)(thisGang, otherGang)) {
                    if (AllGangs_1.AllGangs[otherGang].territory <= 0)
                        return;
                    const territoryGain = calculateTerritoryGain(thisGang, otherGang);
                    AllGangs_1.AllGangs[thisGang].territory += territoryGain;
                    AllGangs_1.AllGangs[otherGang].territory -= territoryGain;
                    if (thisGang === gangName) {
                        this.clash(true); // Player won
                        AllGangs_1.AllGangs[otherGang].power *= 1 / 1.01;
                    }
                    else if (otherGang === gangName) {
                        this.clash(false); // Player lost
                    }
                    else {
                        AllGangs_1.AllGangs[otherGang].power *= 1 / 1.01;
                    }
                }
                else {
                    if (AllGangs_1.AllGangs[thisGang].territory <= 0)
                        return;
                    const territoryGain = calculateTerritoryGain(otherGang, thisGang);
                    AllGangs_1.AllGangs[thisGang].territory -= territoryGain;
                    AllGangs_1.AllGangs[otherGang].territory += territoryGain;
                    if (thisGang === gangName) {
                        this.clash(false); // Player lost
                    }
                    else if (otherGang === gangName) {
                        this.clash(true); // Player won
                        AllGangs_1.AllGangs[thisGang].power *= 1 / 1.01;
                    }
                    else {
                        AllGangs_1.AllGangs[thisGang].power *= 1 / 1.01;
                    }
                }
                const total = Object.values(AllGangs_1.AllGangs)
                    .map((g) => g.territory)
                    .reduce((p, c) => p + c, 0);
                Object.values(AllGangs_1.AllGangs).forEach((g) => (g.territory /= total));
            }
        }
    }
    /** Process member experience gain
     * @param numCycles The number of cycles to process. */
    processExperienceGains(numCycles) {
        for (const member of this.members) {
            member.gainExperience(numCycles);
            member.updateSkillLevels();
        }
    }
    clash(won = false) {
        // Determine if a gang member should die
        let baseDeathChance = 0.01;
        if (won)
            baseDeathChance /= 2;
        // If the clash was lost, the player loses a small percentage of power
        else
            AllGangs_1.AllGangs[this.facName].power *= 1 / 1.008;
        // Deaths can only occur during X% of clashes
        if (Math.random() < 0.65)
            return;
        for (let i = this.members.length - 1; i >= 0; --i) {
            const member = this.members[i];
            // Only members assigned to Territory Warfare can die
            if (member.task !== "Territory Warfare")
                continue;
            // Chance to die is decreased based on defense
            const modifiedDeathChance = baseDeathChance / Math.pow(member.def, 0.6);
            if (Math.random() < modifiedDeathChance) {
                this.killMember(member);
            }
        }
    }
    canRecruitMember() {
        if (this.members.length >= Constants_1.GangConstants.MaximumGangMembers) {
            return RecruitmentResult.ExceedMaxNumber;
        }
        if (this.respect < this.respectForNextRecruit()) {
            return RecruitmentResult.NotEnoughRespect;
        }
        return RecruitmentResult.Success;
    }
    /** @returns The respect threshold needed for the next member recruitment. Infinity if already at or above max members. */
    respectForNextRecruit() {
        if (this.members.length < Constants_1.GangConstants.numFreeMembers)
            return 0;
        if (this.members.length >= Constants_1.GangConstants.MaximumGangMembers) {
            return Infinity;
        }
        const exponent = this.members.length - Constants_1.GangConstants.numFreeMembers + 1;
        return Math.pow(Constants_1.GangConstants.recruitThresholdBase, exponent);
    }
    getRecruitsAvailable() {
        if (this.members.length >= Constants_1.GangConstants.MaximumGangMembers) {
            return 0;
        }
        const numFreeMembers = Constants_1.GangConstants.numFreeMembers;
        const recruitCostBase = Constants_1.GangConstants.recruitThresholdBase;
        const membersRecruitabile = Math.floor(Math.max(Math.log(this.respect), 0) / Math.log(recruitCostBase)) + numFreeMembers;
        return Math.min(membersRecruitabile, Constants_1.GangConstants.MaximumGangMembers) - this.members.length;
    }
    recruitMember(name) {
        if (name === "") {
            return RecruitmentResult.EmptyName;
        }
        const resultOfCheckingIfGangCanRecruitMember = this.canRecruitMember();
        if (resultOfCheckingIfGangCanRecruitMember !== RecruitmentResult.Success) {
            return resultOfCheckingIfGangCanRecruitMember;
        }
        // Check for already-existing names
        if (this.members.some((m) => m.name === name)) {
            return RecruitmentResult.DuplicatedName;
        }
        const member = new GangMember_1.GangMember(name);
        this.members.push(member);
        return RecruitmentResult.Success;
    }
    // Money and Respect gains multiplied by this number (< 1)
    getWantedPenalty() {
        return this.respect / (this.respect + this.wanted);
    }
    //Calculates power GAIN, which is added onto the Gang's existing power
    calculatePower() {
        let memberTotal = 0;
        for (let i = 0; i < this.members.length; ++i) {
            if (this.members[i].task !== "Territory Warfare")
                continue;
            memberTotal += this.members[i].calculatePower();
        }
        return 0.015 * Math.max(0.002, this.getTerritory()) * memberTotal;
    }
    killMember(member) {
        // Player loses a percentage of total respect, plus whatever respect that member has earned
        const totalRespect = this.respect;
        const lostRespect = 0.05 * totalRespect + member.earnedRespect;
        this.respect = Math.max(1, totalRespect - lostRespect);
        for (let i = 0; i < this.members.length; ++i) {
            if (member.name === this.members[i].name) {
                this.members.splice(i, 1);
                break;
            }
        }
        // Notify of death
        if (this.notifyMemberDeath) {
            (0, DialogBox_1.dialogBoxCreate)(`${member.name} was killed in a gang clash! You lost ${lostRespect} respect`);
        }
    }
    ascendMember(member, workerScript) {
        try {
            const res = member.ascend();
            this.respect = Math.max(1, this.respect - res.respect);
            if (workerScript) {
                workerScript.log("gang.ascendMember", () => `Ascended Gang member ${member.name}`);
            }
            return res;
        }
        catch (e) {
            if (workerScript == null) {
                (0, exceptionAlert_1.exceptionAlert)(e);
            }
            throw e; // Re-throw, will be caught in the Netscript Function
        }
    }
    // Cost of upgrade gets cheaper as gang increases in respect + power
    getDiscount() {
        const power = this.getPower();
        const respect = this.respect;
        const respectLinearFac = 5e6;
        const powerLinearFac = 1e6;
        const discount = Math.pow(respect, 0.01) + respect / respectLinearFac + Math.pow(power, 0.01) + power / powerLinearFac - 1;
        return Math.max(1, discount);
    }
    /** Returns only valid tasks for this gang. Excludes 'Unassigned' */
    getAllTaskNames() {
        return Object.keys(GangMemberTasks_1.GangMemberTasks).filter((taskName) => {
            const task = GangMemberTasks_1.GangMemberTasks[taskName];
            if (task == null)
                return false;
            if (task.name === "Unassigned")
                return false;
            // yes you need both checks
            return this.isHackingGang === task.isHacking || !this.isHackingGang === task.isCombat;
        });
    }
    getUpgradeCost(upg) {
        if (upg == null) {
            return Infinity;
        }
        return upg.cost / this.getDiscount();
    }
    /** Serialize the current object to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("Gang", this);
    }
    /** Initializes a Gang object from a JSON save state. */
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(Gang, value.data);
    }
}
exports.Gang = Gang;
JSONReviver_1.constructorsForReviver.Gang = Gang;
