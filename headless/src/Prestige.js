"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prestigeAugmentation = prestigeAugmentation;
exports.prestigeSourceFile = prestigeSourceFile;
const _enums_1 = require("@enums");
const Augmentations_1 = require("./Augmentation/Augmentations");
const BitNode_1 = require("./BitNode/BitNode");
const Companies_1 = require("./Company/Companies");
const IndustryData_1 = require("./Corporation/data/IndustryData");
const Factions_1 = require("./Faction/Factions");
const FactionHelpers_1 = require("./Faction/FactionHelpers");
const HacknetHelpers_1 = require("./Hacknet/HacknetHelpers");
const NetscriptWorker_1 = require("./NetscriptWorker");
const _player_1 = require("@player");
const RecentScripts_1 = require("./Netscript/RecentScripts");
const Pid_1 = require("./Netscript/Pid");
const AllServers_1 = require("./Server/AllServers");
const ServerHelpers_1 = require("./Server/ServerHelpers");
const SpecialServers_1 = require("./Server/data/SpecialServers");
const StockMarket_1 = require("./StockMarket/StockMarket");
const Terminal_1 = require("./Terminal");
const DialogBox_1 = require("./ui/React/DialogBox");
const Helper_1 = require("./CotMG/Helper");
const ProgramsRoot_1 = require("./Programs/ui/ProgramsRoot");
const FactionsRoot_1 = require("./Faction/ui/FactionsRoot");
const Constants_1 = require("./Constants");
const LogBoxManager_1 = require("./ui/React/LogBoxManager");
const Augmentations_2 = require("./Augmentation/Augmentations");
const Go_1 = require("./Go/Go");
const skill_1 = require("./PersonObjects/formulas/skill");
const BitNodeMultipliers_1 = require("./BitNode/BitNodeMultipliers");
const BitNodeUtils_1 = require("./BitNode/BitNodeUtils");
const Share_1 = require("./NetworkShare/Share");
const CodingContractEventEmitter_1 = require("./CodingContract/CodingContractEventEmitter");
const BitNode8StartingMoney = 250e6;
function delayedDialog(message, canBeDismissedEasily = true) {
    setTimeout(() => (0, DialogBox_1.dialogBoxCreate)(message, { html: false, canBeDismissedEasily }), 200);
}
function setInitialExpForPlayer() {
    _player_1.Player.exp.hacking = (0, skill_1.calculateExp)(1, _player_1.Player.mults.hacking * BitNodeMultipliers_1.currentNodeMults.HackingLevelMultiplier);
    _player_1.Player.exp.strength = (0, skill_1.calculateExp)(1, _player_1.Player.mults.strength * BitNodeMultipliers_1.currentNodeMults.StrengthLevelMultiplier);
    _player_1.Player.exp.defense = (0, skill_1.calculateExp)(1, _player_1.Player.mults.defense * BitNodeMultipliers_1.currentNodeMults.DefenseLevelMultiplier);
    _player_1.Player.exp.dexterity = (0, skill_1.calculateExp)(1, _player_1.Player.mults.dexterity * BitNodeMultipliers_1.currentNodeMults.DexterityLevelMultiplier);
    _player_1.Player.exp.agility = (0, skill_1.calculateExp)(1, _player_1.Player.mults.agility * BitNodeMultipliers_1.currentNodeMults.AgilityLevelMultiplier);
    _player_1.Player.exp.charisma = (0, skill_1.calculateExp)(1, _player_1.Player.mults.charisma * BitNodeMultipliers_1.currentNodeMults.CharismaLevelMultiplier);
    _player_1.Player.updateSkillLevels();
    _player_1.Player.hp.current = _player_1.Player.hp.max;
}
// Prestige by purchasing augmentation
function prestigeAugmentation() {
    // We must kill all scripts before doing anything else.
    (0, NetscriptWorker_1.prestigeWorkerScripts)();
    (0, BitNode_1.initBitNodeMultipliers)();
    // Maintain invites to factions with the 'keepOnInstall' flag, and rumors about others
    const maintainInvites = new Set();
    const maintainRumors = new Set();
    for (const facName of [..._player_1.Player.factions, ..._player_1.Player.factionInvitations]) {
        if (Factions_1.Factions[facName].getInfo().keep) {
            maintainInvites.add(facName);
        }
        else {
            maintainRumors.add(facName);
        }
    }
    _player_1.Player.prestigeAugmentation();
    Go_1.Go.prestigeAugmentation();
    const homeComp = _player_1.Player.getHomeComputer();
    // Delete all servers except home computer
    (0, AllServers_1.prestigeAllServers)();
    // Reset home computer (only the programs) and add to AllServers
    (0, AllServers_1.AddToAllServers)(homeComp);
    (0, ServerHelpers_1.prestigeHomeComputer)(homeComp);
    // Clear all pending share jobs created via UI
    Share_1.pendingUIShareJobIds.length = 0;
    // Receive starting money and programs from installed augmentations
    for (const ownedAug of _player_1.Player.augmentations) {
        const aug = Augmentations_1.Augmentations[ownedAug.name];
        _player_1.Player.gainMoney(aug.startingMoney, "other");
        for (const program of aug.programs) {
            homeComp.pushProgram(program);
        }
    }
    if ((0, BitNodeUtils_1.canAccessBitNodeFeature)(5)) {
        homeComp.pushProgram(_enums_1.CompletedProgramName.formulas);
    }
    // Re-create foreign servers
    (0, AllServers_1.initForeignServers)(_player_1.Player.getHomeComputer());
    // Gain favor for Companies and Factions
    for (const company of Object.values(Companies_1.Companies))
        company.prestigeAugmentation();
    for (const faction of Object.values(Factions_1.Factions))
        faction.prestigeAugmentation();
    // Stop a Terminal action if there is one.
    if (Terminal_1.Terminal.action !== null) {
        Terminal_1.Terminal.finishAction(true);
    }
    Terminal_1.Terminal.clear();
    LogBoxManager_1.LogBoxClearEvents.emit();
    // Close coding contract modal
    CodingContractEventEmitter_1.CodingContractEventEmitter.emit({ type: "close" });
    // Recalculate the bonus for circadian modulator aug
    (0, Augmentations_2.initCircadianModulator)();
    _player_1.Player.factionInvitations = _player_1.Player.factionInvitations.concat([...maintainInvites]);
    for (const factionName of maintainInvites) {
        Factions_1.Factions[factionName].alreadyInvited = true;
    }
    _player_1.Player.reapplyAllAugmentations();
    _player_1.Player.reapplyAllSourceFiles();
    Helper_1.staneksGift.prestigeAugmentation();
    // Apply entropy from grafting
    _player_1.Player.applyEntropy(_player_1.Player.entropy);
    // Gang
    const gang = _player_1.Player.gang;
    if (gang) {
        const faction = Factions_1.Factions[gang.facName];
        if (faction)
            (0, FactionHelpers_1.joinFaction)(faction);
        for (const m of gang.members) {
            const results = m.getPostInstallPoints();
            m.hack_asc_points = results.hack;
            m.str_asc_points = results.str;
            m.def_asc_points = results.def;
            m.dex_asc_points = results.dex;
            m.agi_asc_points = results.agi;
            m.cha_asc_points = results.cha;
        }
    }
    // BitNode 3: Corporatocracy
    if (_player_1.Player.bitNodeN === 3) {
        // Easiest way to comply with type constraint, instead of revalidating the enum member's file path
        homeComp.messages.push(_enums_1.LiteratureName.CorporationManagementHandbook);
    }
    // Cancel Bladeburner action
    if (_player_1.Player.bladeburner) {
        _player_1.Player.bladeburner.prestigeAugmentation();
    }
    // BitNode 8: Ghost of Wall Street
    if (_player_1.Player.bitNodeN === 8) {
        _player_1.Player.money = BitNode8StartingMoney;
    }
    if ((0, BitNodeUtils_1.canAccessBitNodeFeature)(8)) {
        _player_1.Player.hasWseAccount = true;
        _player_1.Player.hasTixApiAccess = true;
    }
    // Reset Stock market
    if ((0, StockMarket_1.canAccessStockMarket)()) {
        (0, StockMarket_1.initStockMarket)();
    }
    // Red Pill
    if (_player_1.Player.hasAugmentation(_enums_1.AugmentationName.TheRedPill, true)) {
        const WorldDaemon = (0, AllServers_1.GetServer)(SpecialServers_1.SpecialServers.WorldDaemon);
        const DaedalusServer = (0, AllServers_1.GetServer)(SpecialServers_1.SpecialServers.DaedalusServer);
        if (WorldDaemon && DaedalusServer) {
            WorldDaemon.serversOnNetwork.push(DaedalusServer.hostname);
            DaedalusServer.serversOnNetwork.push(WorldDaemon.hostname);
        }
    }
    // Bitnode 13: Church of the Machine God
    if (_player_1.Player.hasAugmentation(_enums_1.AugmentationName.StaneksGift1, true)) {
        (0, FactionHelpers_1.joinFaction)(Factions_1.Factions[_enums_1.FactionName.ChurchOfTheMachineGod]);
    }
    else if (_player_1.Player.bitNodeN !== 13) {
        if (_player_1.Player.augmentations.some((a) => a.name !== _enums_1.AugmentationName.NeuroFluxGovernor)) {
            Factions_1.Factions[_enums_1.FactionName.ChurchOfTheMachineGod].isBanned = true;
        }
    }
    // Hear rumors after all invites/bans
    for (const factionName of maintainRumors)
        _player_1.Player.receiveRumor(factionName);
    (0, Pid_1.resetPidCounter)();
    ProgramsRoot_1.ProgramsSeen.clear();
    FactionsRoot_1.InvitationsSeen.clear();
    setInitialExpForPlayer();
}
// Prestige by destroying Bit Node and gaining a Source File
function prestigeSourceFile(isFlume) {
    // We must kill all scripts before doing anything else.
    (0, NetscriptWorker_1.prestigeWorkerScripts)();
    (0, BitNode_1.initBitNodeMultipliers)();
    _player_1.Player.prestigeSourceFile();
    Go_1.Go.prestigeSourceFile();
    const homeComp = _player_1.Player.getHomeComputer();
    // Stop a Terminal action if there is one.
    if (Terminal_1.Terminal.action !== null) {
        Terminal_1.Terminal.finishAction(true);
    }
    Terminal_1.Terminal.clear();
    LogBoxManager_1.LogBoxClearEvents.emit();
    // Close coding contract modal
    CodingContractEventEmitter_1.CodingContractEventEmitter.emit({ type: "close" });
    // Delete all servers except home computer
    (0, AllServers_1.prestigeAllServers)(); // Must be done before initForeignServers()
    // Reset home computer (only the programs) and add to AllServers
    (0, AllServers_1.AddToAllServers)(homeComp);
    (0, ServerHelpers_1.prestigeHomeComputer)(homeComp);
    // Clear all pending share jobs created via UI
    Share_1.pendingUIShareJobIds.length = 0;
    // Ram usage needs to be cleared for bitnode-level resets, due to possible change in singularity cost.
    for (const script of homeComp.scripts.values())
        script.ramUsage = null;
    // Re-create foreign servers
    (0, AllServers_1.initForeignServers)(_player_1.Player.getHomeComputer());
    if (_player_1.Player.activeSourceFileLvl(9) >= 2) {
        homeComp.setMaxRam(128);
    }
    else if (_player_1.Player.activeSourceFileLvl(1) > 0) {
        homeComp.setMaxRam(32);
    }
    else {
        homeComp.setMaxRam(8);
    }
    homeComp.cpuCores = 1;
    // Reset favor for Companies and Factions
    for (const company of Object.values(Companies_1.Companies))
        company.prestigeSourceFile();
    for (const faction of Object.values(Factions_1.Factions))
        faction.prestigeSourceFile();
    // Stop a Terminal action if there is one
    if (Terminal_1.Terminal.action !== null) {
        Terminal_1.Terminal.finishAction(true);
    }
    // Give levels of NeuroFluxGovernor for Source-File 12. Must be done here before Augmentations are recalculated
    if (_player_1.Player.activeSourceFileLvl(12) > 0) {
        _player_1.Player.augmentations.push({
            name: _enums_1.AugmentationName.NeuroFluxGovernor,
            level: _player_1.Player.activeSourceFileLvl(12),
        });
    }
    (0, Augmentations_2.initCircadianModulator)();
    _player_1.Player.reapplyAllAugmentations();
    _player_1.Player.reapplyAllSourceFiles();
    if ((0, BitNodeUtils_1.canAccessBitNodeFeature)(5)) {
        homeComp.pushProgram(_enums_1.CompletedProgramName.formulas);
    }
    // BitNode 3: Corporatocracy
    if (_player_1.Player.bitNodeN === 3) {
        // Easiest way to comply with type constraint, instead of revalidating the enum member's file path
        homeComp.messages.push(_enums_1.LiteratureName.CorporationManagementHandbook);
        delayedDialog("You received a copy of the Corporation Management Handbook on your home computer. It's a short introduction for " +
            "managing Corporation.\n\nYou should check the in-game Corporation documentation in the Documentation tab " +
            "(Documentation -> Advanced Mechanics -> Corporation). It's the most useful and up-to-date resource for managing Corporation.", false);
    }
    // BitNode 6: Bladeburners and BitNode 7: Bladeburners 2079
    if (_player_1.Player.bitNodeN === 6 || _player_1.Player.bitNodeN === 7) {
        delayedDialog(`The ${_enums_1.CompanyName.NSA} would like to have a word with you once you're ready. You should train your combat stats to level 100 before going there.`, false);
    }
    // BitNode 8: Ghost of Wall Street
    if (_player_1.Player.bitNodeN === 8) {
        _player_1.Player.money = BitNode8StartingMoney;
    }
    if ((0, BitNodeUtils_1.canAccessBitNodeFeature)(8)) {
        _player_1.Player.hasWseAccount = true;
        _player_1.Player.hasTixApiAccess = true;
    }
    // BitNode 10: Digital Carbon
    if (_player_1.Player.bitNodeN === 10) {
        delayedDialog(`Seek out ${_enums_1.FactionName.TheCovenant} if you'd like to purchase a new sleeve or two! And see what ${_enums_1.CompanyName.VitaLife} in ${_enums_1.CityName.NewTokyo} has to offer for you`, false);
    }
    // BitNode 12: The Recursion
    if (_player_1.Player.bitNodeN === 12 && _player_1.Player.activeSourceFileLvl(12) > 100) {
        delayedDialog("Saynt_Garmo is watching you");
    }
    if (_player_1.Player.bitNodeN === 13) {
        delayedDialog(`Trouble is brewing in ${_enums_1.CityName.Chongqing}`, false);
    }
    // Reset Stock market, gang, and corporation
    if ((0, StockMarket_1.canAccessStockMarket)()) {
        (0, StockMarket_1.initStockMarket)();
    }
    else {
        (0, StockMarket_1.deleteStockMarket)();
    }
    (0, IndustryData_1.resetIndustryResearchTrees)();
    // Source-File 9 (level 3) effect
    // also now applies when entering bn9 until install
    if ((_player_1.Player.activeSourceFileLvl(9) >= 3 || _player_1.Player.bitNodeN === 9) && !_player_1.Player.bitNodeOptions.disableHacknetServer) {
        const hserver = _player_1.Player.createHacknetServer();
        hserver.level = 100;
        hserver.cores = 10;
        hserver.cpuCores = 10;
        hserver.cache = 5;
        hserver.updateHashRate(_player_1.Player.mults.hacknet_node_money);
        hserver.updateHashCapacity();
        (0, HacknetHelpers_1.updateHashManagerCapacity)();
    }
    if (_player_1.Player.bitNodeN === 13) {
        _player_1.Player.money = Constants_1.CONSTANTS.TravelCost;
    }
    Helper_1.staneksGift.prestigeSourceFile();
    // Gain int exp
    if (_player_1.Player.activeSourceFileLvl(5) !== 0 && !isFlume) {
        _player_1.Player.gainIntelligenceExp(300);
    }
    // Clear recent scripts
    RecentScripts_1.recentScripts.splice(0, RecentScripts_1.recentScripts.length);
    (0, Pid_1.resetPidCounter)();
    setInitialExpForPlayer();
    if (!isFlume && _player_1.Player.sourceFiles.size === 1 && _player_1.Player.sourceFileLvl(1) === 1) {
        delayedDialog("Congratulations on destroying your first BitNode! Make sure to check the Documentation tab. Many pages are unlocked now.", false);
    }
}
