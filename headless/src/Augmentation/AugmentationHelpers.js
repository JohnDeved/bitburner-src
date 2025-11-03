"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseAugmentationPriceMultiplier = getBaseAugmentationPriceMultiplier;
exports.getGenericAugmentationPriceMultiplier = getGenericAugmentationPriceMultiplier;
exports.applyAugmentation = applyAugmentation;
exports.installAugmentations = installAugmentations;
exports.isRepeatableAug = isRepeatableAug;
exports.getAugCost = getAugCost;
const Augmentations_1 = require("./Augmentations");
const PlayerOwnedAugmentation_1 = require("./PlayerOwnedAugmentation");
const _enums_1 = require("@enums");
const Constants_1 = require("../Constants");
const _player_1 = require("@player");
const Prestige_1 = require("../Prestige");
const DialogBox_1 = require("../ui/React/DialogBox");
const GameRoot_1 = require("../ui/GameRoot");
const Router_1 = require("../ui/Router");
const Multipliers_1 = require("../PersonObjects/Multipliers");
const BitNodeMultipliers_1 = require("../BitNode/BitNodeMultipliers");
const NetscriptWorker_1 = require("../NetscriptWorker");
const soaAugmentationNames = [
    _enums_1.AugmentationName.BeautyOfAphrodite,
    _enums_1.AugmentationName.ChaosOfDionysus,
    _enums_1.AugmentationName.FloodOfPoseidon,
    _enums_1.AugmentationName.HuntOfArtemis,
    _enums_1.AugmentationName.KnowledgeOfApollo,
    _enums_1.AugmentationName.MightOfAres,
    _enums_1.AugmentationName.TrickeryOfHermes,
    _enums_1.AugmentationName.WKSharmonizer,
    _enums_1.AugmentationName.WisdomOfAthena,
];
function getBaseAugmentationPriceMultiplier() {
    return Constants_1.CONSTANTS.MultipleAugMultiplier * [1, 0.96, 0.94, 0.93][_player_1.Player.activeSourceFileLvl(11)];
}
function getGenericAugmentationPriceMultiplier() {
    const queuedNonSoAAugmentationList = _player_1.Player.queuedAugmentations.filter((augmentation) => {
        return !soaAugmentationNames.includes(augmentation.name);
    });
    return Math.pow(getBaseAugmentationPriceMultiplier(), queuedNonSoAAugmentationList.length);
}
function applyAugmentation(aug, reapply = false) {
    const staticAugmentation = Augmentations_1.Augmentations[aug.name];
    // Apply multipliers
    _player_1.Player.mults = (0, Multipliers_1.mergeMultipliers)(_player_1.Player.mults, staticAugmentation.mults);
    // Special logic for Congruity Implant
    if (aug.name === _enums_1.AugmentationName.CongruityImplant && !reapply) {
        _player_1.Player.entropy = 0;
        _player_1.Player.applyEntropy(_player_1.Player.entropy);
    }
    // Recalculate skill levels after applying multipliers.
    _player_1.Player.updateSkillLevels();
    // Special logic for NeuroFlux Governor
    const ownedNfg = _player_1.Player.augmentations.find((pAug) => pAug.name === _enums_1.AugmentationName.NeuroFluxGovernor);
    if (aug.name === _enums_1.AugmentationName.NeuroFluxGovernor && !reapply && ownedNfg) {
        ownedNfg.level = aug.level;
        return;
    }
    // Push onto Player's Augmentation list
    if (!reapply) {
        const ownedAug = new PlayerOwnedAugmentation_1.PlayerOwnedAugmentation(aug.name);
        _player_1.Player.augmentations.push(ownedAug);
    }
}
function installAugmentations(force) {
    if (_player_1.Player.queuedAugmentations.length == 0 && !force) {
        (0, DialogBox_1.dialogBoxCreate)("You have not purchased any Augmentations to install!");
        return false;
    }
    // We must kill all scripts before installing augmentations.
    (0, NetscriptWorker_1.prestigeWorkerScripts)();
    let augmentationList = "";
    let nfgIndex = -1;
    for (let i = _player_1.Player.queuedAugmentations.length - 1; i >= 0; i--) {
        if (_player_1.Player.queuedAugmentations[i].name === _enums_1.AugmentationName.NeuroFluxGovernor) {
            nfgIndex = i;
            break;
        }
    }
    for (let i = 0; i < _player_1.Player.queuedAugmentations.length; ++i) {
        const ownedAug = _player_1.Player.queuedAugmentations[i];
        const aug = Augmentations_1.Augmentations[ownedAug.name];
        if (aug == null) {
            console.error(`Invalid augmentation: ${ownedAug.name}`);
            continue;
        }
        applyAugmentation(_player_1.Player.queuedAugmentations[i]);
        if (ownedAug.name === _enums_1.AugmentationName.NeuroFluxGovernor && i !== nfgIndex)
            continue;
        let level = "";
        if (ownedAug.name === _enums_1.AugmentationName.NeuroFluxGovernor) {
            level = ` - ${ownedAug.level}`;
        }
        augmentationList += aug.name + level + "\n";
    }
    _player_1.Player.queuedAugmentations = [];
    if (!force && augmentationList !== "") {
        (0, DialogBox_1.dialogBoxCreate)("You slowly drift to sleep as scientists put you under in order " +
            "to install the following Augmentations:\n" +
            augmentationList +
            "\nYou wake up in your home...you feel different...");
    }
    (0, Prestige_1.prestigeAugmentation)();
    GameRoot_1.Router.toPage(Router_1.Page.Terminal);
    return true;
}
function isRepeatableAug(aug) {
    const augName = typeof aug === "string" ? aug : aug.name;
    return augName === _enums_1.AugmentationName.NeuroFluxGovernor;
}
function getAugCost(aug) {
    let moneyCost = aug.baseCost;
    let repCost = aug.baseRepRequirement;
    switch (aug.name) {
        // Special cost for NFG
        case _enums_1.AugmentationName.NeuroFluxGovernor: {
            const multiplier = Math.pow(Constants_1.CONSTANTS.NeuroFluxGovernorLevelMult, aug.getLevel());
            repCost = aug.baseRepRequirement * multiplier * BitNodeMultipliers_1.currentNodeMults.AugmentationRepCost;
            moneyCost = aug.baseCost * multiplier * BitNodeMultipliers_1.currentNodeMults.AugmentationMoneyCost;
            moneyCost *= getGenericAugmentationPriceMultiplier();
            break;
        }
        // SOA Augments use a unique cost method
        case _enums_1.AugmentationName.BeautyOfAphrodite:
        case _enums_1.AugmentationName.ChaosOfDionysus:
        case _enums_1.AugmentationName.FloodOfPoseidon:
        case _enums_1.AugmentationName.HuntOfArtemis:
        case _enums_1.AugmentationName.KnowledgeOfApollo:
        case _enums_1.AugmentationName.MightOfAres:
        case _enums_1.AugmentationName.TrickeryOfHermes:
        case _enums_1.AugmentationName.WKSharmonizer:
        case _enums_1.AugmentationName.WisdomOfAthena: {
            const soaAugCount = soaAugmentationNames.filter((augName) => _player_1.Player.hasAugmentation(augName)).length;
            moneyCost = aug.baseCost * Math.pow(Constants_1.CONSTANTS.SoACostMult, soaAugCount);
            repCost = aug.baseRepRequirement * Math.pow(Constants_1.CONSTANTS.SoARepMult, soaAugCount);
            break;
        }
        // Standard cost
        default:
            moneyCost = aug.baseCost * getGenericAugmentationPriceMultiplier() * BitNodeMultipliers_1.currentNodeMults.AugmentationMoneyCost;
            repCost = aug.baseRepRequirement * BitNodeMultipliers_1.currentNodeMults.AugmentationRepCost;
    }
    return { moneyCost, repCost };
}
