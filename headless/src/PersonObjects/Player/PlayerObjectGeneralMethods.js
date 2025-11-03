"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = init;
exports.prestigeAugmentation = prestigeAugmentation;
exports.prestigeSourceFile = prestigeSourceFile;
exports.receiveInvite = receiveInvite;
exports.receiveRumor = receiveRumor;
exports.calculateSkillProgress = calculateSkillProgress;
exports.hasProgram = hasProgram;
exports.setMoney = setMoney;
exports.gainMoney = gainMoney;
exports.loseMoney = loseMoney;
exports.canAfford = canAfford;
exports.recordMoneySource = recordMoneySource;
exports.startFocusing = startFocusing;
exports.stopFocusing = stopFocusing;
exports.takeDamage = takeDamage;
exports.hospitalize = hospitalize;
exports.applyForJob = applyForJob;
exports.getNextCompanyPosition = getNextCompanyPosition;
exports.quitJob = quitJob;
exports.hasJob = hasJob;
exports.isQualified = isQualified;
exports.reapplyAllAugmentations = reapplyAllAugmentations;
exports.reapplyAllSourceFiles = reapplyAllSourceFiles;
exports.checkForFactionInvitations = checkForFactionInvitations;
exports.setBitNodeNumber = setBitNodeNumber;
exports.queueAugmentation = queueAugmentation;
exports.gainCodingContractReward = gainCodingContractReward;
exports.gotoLocation = gotoLocation;
exports.canAccessGrafting = canAccessGrafting;
exports.giveExploit = giveExploit;
exports.giveAchievement = giveAchievement;
exports.getCasinoWinnings = getCasinoWinnings;
exports.canAccessCotMG = canAccessCotMG;
exports.sourceFileLvl = sourceFileLvl;
exports.activeSourceFileLvl = activeSourceFileLvl;
exports.focusPenalty = focusPenalty;
const _enums_1 = require("@enums");
const AugmentationHelpers_1 = require("../../Augmentation/AugmentationHelpers");
const PlayerOwnedAugmentation_1 = require("../../Augmentation/PlayerOwnedAugmentation");
const BitNodeMultipliers_1 = require("../../BitNode/BitNodeMultipliers");
const Contract_1 = require("../../CodingContract/Contract");
const Companies_1 = require("../../Company/Companies");
const GetNextCompanyPosition_1 = require("../../Company/GetNextCompanyPosition");
const GetJobRequirements_1 = require("../../Company/GetJobRequirements");
const Constants_1 = require("../../Constants");
const Factions_1 = require("../../Faction/Factions");
const FactionInvitationManager_1 = require("../../Faction/ui/FactionInvitationManager");
const AllGangs_1 = require("../../Gang/AllGangs");
const Sleeve_1 = require("../Sleeve/Sleeve");
const Work_1 = require("../Sleeve/Work/Work");
const skill_1 = require("../formulas/skill");
const AllServers_1 = require("../../Server/AllServers");
const ServerHelpers_1 = require("../../Server/ServerHelpers");
const SpecialServers_1 = require("../../Server/data/SpecialServers");
const applySourceFile_1 = require("../../SourceFile/applySourceFile");
const applyExploits_1 = require("../../Exploits/applyExploits");
const SourceFiles_1 = require("../../SourceFile/SourceFiles");
const Hospital_1 = require("../../Hospital/Hospital");
const formatNumber_1 = require("../../ui/formatNumber");
const MoneySourceTracker_1 = require("../../utils/MoneySourceTracker");
const DialogBox_1 = require("../../ui/React/DialogBox");
const Snackbar_1 = require("../../ui/React/Snackbar");
const Achievements_1 = require("../../Achievements/Achievements");
const CompanyWork_1 = require("../../Work/CompanyWork");
const EnumHelper_1 = require("../../utils/EnumHelper");
const BitNodeUtils_1 = require("../../BitNode/BitNodeUtils");
const AlertManager_1 = require("../../ui/React/AlertManager");
const Augmentations_1 = require("../../Augmentation/Augmentations");
const PlayerEvents_1 = require("./PlayerEvents");
function init() {
    /* Initialize Player's home computer */
    const t_homeComp = (0, ServerHelpers_1.safelyCreateUniqueServer)({
        adminRights: true,
        hostname: "home",
        ip: (0, AllServers_1.createUniqueRandomIp)(),
        isConnectedTo: true,
        maxRam: 8,
        organizationName: "Home PC",
        purchasedByPlayer: true,
    });
    this.currentServer = SpecialServers_1.SpecialServers.Home;
    (0, AllServers_1.AddToAllServers)(t_homeComp);
    this.getHomeComputer().pushProgram(_enums_1.CompletedProgramName.nuke);
}
function prestigeAugmentation() {
    this.currentServer = SpecialServers_1.SpecialServers.Home;
    this.numPeopleKilled = 0;
    //Reset stats
    this.skills.hacking = 1;
    this.skills.strength = 1;
    this.skills.defense = 1;
    this.skills.dexterity = 1;
    this.skills.agility = 1;
    this.skills.charisma = 1;
    this.exp.hacking = 0;
    this.exp.strength = 0;
    this.exp.defense = 0;
    this.exp.dexterity = 0;
    this.exp.agility = 0;
    this.exp.charisma = 0;
    this.money = 1000 + Constants_1.CONSTANTS.Donations;
    this.city = _enums_1.CityName.Sector12;
    this.location = _enums_1.LocationName.TravelAgency;
    this.jobs = {};
    this.purchasedServers = [];
    this.factions = [];
    this.factionInvitations = [];
    this.factionRumors.clear();
    // Clear any pending invitation modals
    FactionInvitationManager_1.FactionInvitationEvents.emit({ type: "ClearAll" });
    this.queuedAugmentations = [];
    Sleeve_1.Sleeve.recalculateNumOwned();
    this.sleeves.forEach((sleeve) => (sleeve.shock <= 0 ? sleeve.synchronize() : sleeve.shockRecovery()));
    this.lastUpdate = new Date().getTime();
    // Statistics Trackers
    this.playtimeSinceLastAug = 0;
    this.lastAugReset = this.lastUpdate;
    this.scriptProdSinceLastAug = 0;
    this.moneySourceA.reset();
    this.hacknetNodes.length = 0;
    this.hashManager.prestige();
    // Reapply augs, re-calculate skills and reset HP
    this.reapplyAllAugmentations(true);
    this.hp.current = this.hp.max;
    this.finishWork(true, true);
}
function prestigeSourceFile() {
    this.entropy = 0;
    this.prestigeAugmentation();
    this.karma = 0;
    // Duplicate sleeves are reset to level 1 every Bit Node (but the number of sleeves you have persists)
    this.sleeves.forEach((sleeve) => sleeve.prestige());
    if (this.bitNodeN === 10) {
        for (let i = 0; i < this.sleeves.length; i++) {
            this.sleeves[i].shock = Math.min(25, this.sleeves[i].shock);
            this.sleeves[i].sync = Math.max(25, this.sleeves[i].sync);
        }
    }
    this.gang = null;
    (0, AllGangs_1.resetGangs)();
    this.corporation = null;
    this.bladeburner = null;
    // Reset Stock market
    this.hasWseAccount = false;
    this.hasTixApiAccess = false;
    this.has4SData = false;
    this.has4SDataTixApi = false;
    // BitNode 3: Corporatocracy
    this.corporation = null;
    this.moneySourceB.reset();
    this.playtimeSinceLastBitnode = 0;
    this.lastNodeReset = this.lastUpdate;
    this.augmentations = [];
}
function receiveInvite(factionName) {
    const faction = Factions_1.Factions[factionName];
    if (this.factionInvitations.includes(factionName) || faction.alreadyInvited || faction.isMember || faction.isBanned)
        return;
    this.factionInvitations.push(factionName);
    this.factionRumors.delete(factionName);
    faction.discovery = _enums_1.FactionDiscovery.known;
}
function receiveRumor(factionName) {
    const faction = Factions_1.Factions[factionName];
    if (faction.discovery === _enums_1.FactionDiscovery.unknown)
        faction.discovery = _enums_1.FactionDiscovery.rumored;
    if (this.factionRumors.has(factionName) || faction.isMember || faction.isBanned || faction.alreadyInvited)
        return;
    this.factionRumors.add(factionName);
}
//Calculates skill level progress based on experience. The same formula will be used for every skill
function calculateSkillProgress(exp, mult = 1) {
    return (0, skill_1.calculateSkillProgress)(exp, mult);
}
function hasProgram(programName) {
    const home = this.getHomeComputer();
    return home.programs.includes(programName);
}
function setMoney(money) {
    if (isNaN(money)) {
        console.error("NaN passed into Player.setMoney()");
        return;
    }
    this.money = money;
}
function gainMoney(money, source) {
    if (isNaN(money)) {
        console.error("NaN passed into Player.gainMoney()");
        return;
    }
    this.money = this.money + money;
    this.recordMoneySource(money, source);
}
function loseMoney(money, source) {
    if (isNaN(money)) {
        console.error("NaN passed into Player.loseMoney()");
        return;
    }
    if (this.money === Infinity && money === Infinity)
        return;
    this.money = this.money - money;
    this.recordMoneySource(-1 * money, source);
}
function canAfford(cost) {
    if (isNaN(cost)) {
        console.error(`NaN passed into Player.canAfford()`);
        return false;
    }
    return this.money >= cost;
}
function recordMoneySource(amt, source) {
    if (!(this.moneySourceA instanceof MoneySourceTracker_1.MoneySourceTracker)) {
        console.warn(`Player.moneySourceA was not properly initialized. Resetting`);
        this.moneySourceA = new MoneySourceTracker_1.MoneySourceTracker();
    }
    if (!(this.moneySourceB instanceof MoneySourceTracker_1.MoneySourceTracker)) {
        console.warn(`Player.moneySourceB was not properly initialized. Resetting`);
        this.moneySourceB = new MoneySourceTracker_1.MoneySourceTracker();
    }
    this.moneySourceA.record(amt, source);
    this.moneySourceB.record(amt, source);
}
function startFocusing() {
    this.focus = true;
}
function stopFocusing() {
    this.focus = false;
}
// Returns true if hospitalized, false otherwise
function takeDamage(amt) {
    if (typeof amt !== "number") {
        console.warn(`Player.takeDamage() called without a numeric argument: ${amt}`);
        return false;
    }
    this.hp.current -= amt;
    if (this.hp.current <= 0) {
        this.hospitalize(false);
        return true;
    }
    else {
        return false;
    }
}
function hospitalize(suppressNotification) {
    const cost = (0, Hospital_1.getHospitalizationCost)();
    this.loseMoney(cost, "hospitalization");
    this.hp.current = this.hp.max;
    if (!suppressNotification) {
        Snackbar_1.SnackbarEvents.emit(`You've been hospitalized for ${(0, formatNumber_1.formatMoney)(cost)}`, _enums_1.ToastVariant.SUCCESS, 2000);
    }
    PlayerEvents_1.PlayerEvents.emit(PlayerEvents_1.PlayerEventType.Hospitalized);
    return cost;
}
/**
 * Company job application. Determines the job that the Player should get (if any) at the given company.
 * @param this The player instance
 * @param company The company being applied to
 * @param position A specific position
 * @param sing Whether this is being called from the applyToCompany() Netscript Singularity function
 * @returns The name of the Job received (if any). May be higher or lower than the job applied to.
 */
function applyForJob(company, position) {
    if (!company) {
        return { success: false, message: `Invalid company: ${company}.` };
    }
    // Start searching the job track from the provided point (which may not be the entry position)
    let pos = position;
    if (!this.isQualified(company, pos)) {
        return {
            success: false,
            message: `Unfortunately, you do not qualify for this position.\n${(0, GetJobRequirements_1.getJobRequirementText)(company, pos)}`,
        };
    }
    if (!company.hasPosition(pos)) {
        return {
            success: false,
            message: `Company ${company.name} does not have position ${pos.name}.`,
        };
    }
    let nextPos = (0, GetNextCompanyPosition_1.getNextCompanyPositionHelper)(pos);
    while (nextPos && company.hasPosition(nextPos) && this.isQualified(company, nextPos)) {
        pos = nextPos;
        nextPos = (0, GetNextCompanyPosition_1.getNextCompanyPositionHelper)(pos);
    }
    // Check if player already has the assigned job
    if (this.jobs[company.name] === pos.name) {
        let errorMessage;
        const nextPos = (0, GetNextCompanyPosition_1.getNextCompanyPositionHelper)(pos);
        if (nextPos === null) {
            errorMessage = `You are already ${pos.name}! No promotion available.`;
        }
        else if (!company.hasPosition(nextPos)) {
            errorMessage = `You already have the highest ${pos.field} position available at ${company.name}! No promotion available.`;
        }
        else {
            errorMessage = `Unfortunately, you do not qualify for a promotion.\n${(0, GetJobRequirements_1.getJobRequirementText)(company, nextPos)}`;
        }
        return { success: false, message: errorMessage };
    }
    this.jobs[company.name] = pos.name;
    return {
        success: true,
        message: `${pos.hiredText} at ${company.name}!`,
        jobName: pos.name,
    };
}
/**
 * Get a job position that the player can apply for.
 * @param this The player instance
 * @param company The Company being applied to
 * @param entryPosType Job field (Software, Business, etc)
 * @returns The highest job the player can apply for at this company, if any
 */
function getNextCompanyPosition(company, entryPosType) {
    let pos = entryPosType;
    let nextPos = (0, GetNextCompanyPosition_1.getNextCompanyPositionHelper)(pos);
    // Find the highest-level job in this category that the player is currently able to apply for.
    while (nextPos && company.hasPosition(nextPos) && this.isQualified(company, nextPos)) {
        pos = nextPos;
        nextPos = (0, GetNextCompanyPosition_1.getNextCompanyPositionHelper)(pos);
    }
    // If the player already has this position, return the one after that (if any).
    if (this.jobs[company.name] == pos.name) {
        pos = nextPos;
    }
    return pos;
}
function quitJob(company, suppressDialog) {
    if ((0, CompanyWork_1.isCompanyWork)(this.currentWork) && this.currentWork.companyName === company) {
        this.finishWork(true);
    }
    for (const sleeve of this.sleeves) {
        if (sleeve.currentWork?.type === Work_1.SleeveWorkType.COMPANY && sleeve.currentWork.companyName === company) {
            sleeve.stopWork();
            if (!suppressDialog) {
                (0, DialogBox_1.dialogBoxCreate)(`You quit ${company} while one of your sleeves was working there. The sleeve is now idle.`);
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.jobs[company];
}
/**
 * Method to see if the player has at least one job assigned to them
 * @param this The player instance
 * @returns Whether the user has at least one job
 */
function hasJob() {
    return Boolean(Object.keys(this.jobs).length);
}
//Checks if the Player is qualified for a certain position
function isQualified(company, position) {
    const reqs = (0, GetJobRequirements_1.getJobRequirements)(company, position);
    return reqs.every((req) => req.isSatisfied(this));
}
/********** Reapplying Augmentations and Source File ***********/
function reapplyAllAugmentations(resetMultipliers = true) {
    if (resetMultipliers) {
        this.resetMultipliers();
    }
    for (const playerAug of this.augmentations) {
        const augName = playerAug.name;
        if (augName == _enums_1.AugmentationName.NeuroFluxGovernor) {
            for (let i = 0; i < playerAug.level; ++i) {
                (0, AugmentationHelpers_1.applyAugmentation)(playerAug, true);
            }
            continue;
        }
        (0, AugmentationHelpers_1.applyAugmentation)(playerAug, true);
    }
    this.updateSkillLevels();
}
function reapplyAllSourceFiles() {
    //Will always be called after reapplyAllAugmentations() so multipliers do not have to be reset
    //this.resetMultipliers();
    for (const [bn, lvl] of this.activeSourceFiles) {
        const srcFileKey = "SourceFile" + bn;
        const sourceFileObject = SourceFiles_1.SourceFiles[srcFileKey];
        if (!sourceFileObject) {
            console.error(`Invalid source file number: ${bn}`);
            continue;
        }
        (0, applySourceFile_1.applySourceFile)(bn, lvl);
    }
    (0, applyExploits_1.applyExploit)();
    this.updateSkillLevels();
}
/**
 * Checks whether a player meets the requirements for joining each faction, and returns an array of all invitations the player should receive.
 * Also handles receiving rumors for factions if the rumor requirements are met.
 */
function checkForFactionInvitations() {
    const invitedFactions = [];
    for (const faction of Object.values(Factions_1.Factions)) {
        if (faction.isBanned)
            continue;
        if (faction.isMember)
            continue;
        if (faction.alreadyInvited)
            continue;
        // Handle invites
        const { inviteReqs, rumorReqs } = faction.getInfo();
        if (inviteReqs.isSatisfied(this))
            invitedFactions.push(faction);
        // Handle rumors
        if (this.factionRumors.has(faction.name))
            continue;
        if (rumorReqs.isSatisfied(this))
            this.receiveRumor(faction.name);
    }
    return invitedFactions;
}
/************* BitNodes **************/
function setBitNodeNumber(n) {
    this.bitNodeN = n;
}
function queueAugmentation(name) {
    if (name !== _enums_1.AugmentationName.NeuroFluxGovernor) {
        for (const aug of this.queuedAugmentations) {
            if (name === aug.name) {
                AlertManager_1.AlertEvents.emit(`Tried to queue ${name} twice. This is a bug. Please contact developers.`);
                return;
            }
        }
        for (const aug of this.augmentations) {
            if (aug.name === name) {
                AlertManager_1.AlertEvents.emit(`Tried to queue ${name}, but this augmentation was installed. This is a bug. Please contact developers.`);
                return;
            }
        }
    }
    const queuedAugmentation = new PlayerOwnedAugmentation_1.PlayerOwnedAugmentation(name);
    if (name === _enums_1.AugmentationName.NeuroFluxGovernor) {
        const augmentation = Augmentations_1.Augmentations[name];
        queuedAugmentation.level = augmentation.getNextLevel();
    }
    this.queuedAugmentations.push(queuedAugmentation);
}
/************* Coding Contracts **************/
function gainCodingContractReward(reward, difficulty = 1) {
    if (!reward)
        return `No reward for this contract`;
    switch (reward.type) {
        case Contract_1.CodingContractRewardType.FactionReputation: {
            if (!Factions_1.Factions[reward.name]) {
                return this.gainCodingContractReward({ type: Contract_1.CodingContractRewardType.FactionReputationAll });
            }
            const repGain = Constants_1.CONSTANTS.CodingContractBaseFactionRepGain * difficulty;
            Factions_1.Factions[reward.name].playerReputation += repGain;
            return `Gained ${repGain} faction reputation for ${reward.name}`;
        }
        case Contract_1.CodingContractRewardType.FactionReputationAll: {
            const totalGain = Constants_1.CONSTANTS.CodingContractBaseFactionRepGain * difficulty;
            // Ignore Bladeburners and other special factions for this calculation
            const specialFactions = [
                _enums_1.FactionName.Bladeburners,
                _enums_1.FactionName.ShadowsOfAnarchy,
                _enums_1.FactionName.ChurchOfTheMachineGod,
            ];
            const factions = this.factions.slice().filter((f) => {
                return !specialFactions.includes(f);
            });
            // If the player was only part of the special factions, we'll just give money
            if (factions.length == 0) {
                return this.gainCodingContractReward({ type: Contract_1.CodingContractRewardType.Money }, difficulty);
            }
            const gainPerFaction = Math.floor(totalGain / factions.length);
            for (const facName of factions) {
                if (!Factions_1.Factions[facName])
                    continue;
                Factions_1.Factions[facName].playerReputation += gainPerFaction;
            }
            return `Gained ${gainPerFaction} reputation for each of the following factions: ${factions.join(", ")}`;
        }
        case Contract_1.CodingContractRewardType.CompanyReputation: {
            if (!(0, EnumHelper_1.isMember)("CompanyName", reward.name)) {
                return this.gainCodingContractReward({ type: Contract_1.CodingContractRewardType.FactionReputationAll });
            }
            const repGain = Constants_1.CONSTANTS.CodingContractBaseCompanyRepGain * difficulty;
            Companies_1.Companies[reward.name].playerReputation += repGain;
            return `Gained ${repGain} company reputation for ${reward.name}`;
        }
        case Contract_1.CodingContractRewardType.Money:
        default: {
            const moneyGain = Constants_1.CONSTANTS.CodingContractBaseMoneyGain * difficulty * BitNodeMultipliers_1.currentNodeMults.CodingContractMoney;
            this.gainMoney(moneyGain, "codingcontract");
            return `Gained ${(0, formatNumber_1.formatMoney)(moneyGain)}`;
        }
    }
}
function gotoLocation(to) {
    this.location = to;
    return true;
}
function canAccessGrafting() {
    return (0, BitNodeUtils_1.canAccessBitNodeFeature)(10);
}
function giveExploit(exploit) {
    if (!this.exploits.includes(exploit)) {
        this.exploits.push(exploit);
        Snackbar_1.SnackbarEvents.emit("SF -1 acquired!", _enums_1.ToastVariant.SUCCESS, 2000);
    }
}
function giveAchievement(achievementId) {
    const achievement = Achievements_1.achievements[achievementId];
    if (!achievement) {
        return;
    }
    if (!this.achievements.map((a) => a.ID).includes(achievementId)) {
        this.achievements.push({ ID: achievementId, unlockedOn: new Date().getTime() });
        Snackbar_1.SnackbarEvents.emit(`Unlocked Achievement: "${achievement.Name}"`, _enums_1.ToastVariant.SUCCESS, 2000);
    }
}
function getCasinoWinnings() {
    return this.moneySourceA.casino;
}
function canAccessCotMG() {
    return (0, BitNodeUtils_1.canAccessBitNodeFeature)(13);
}
function sourceFileLvl(n) {
    return this.sourceFiles.get(n) ?? 0;
}
function activeSourceFileLvl(n) {
    if (this.bitNodeOptions.sourceFileOverrides.has(n)) {
        return this.bitNodeOptions.sourceFileOverrides.get(n) ?? 0;
    }
    return this.sourceFiles.get(n) ?? 0;
}
function focusPenalty() {
    let focus = 1;
    if (!this.hasAugmentation(_enums_1.AugmentationName.NeuroreceptorManager, true)) {
        focus = this.focus ? 1 : Constants_1.CONSTANTS.BaseFocusBonus;
    }
    return focus;
}
