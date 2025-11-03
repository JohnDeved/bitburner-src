"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetscriptGrafting = NetscriptGrafting;
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const Augmentations_1 = require("../Augmentation/Augmentations");
const FactionHelpers_1 = require("../Faction/FactionHelpers");
const GraftableAugmentation_1 = require("../PersonObjects/Grafting/GraftableAugmentation");
const GraftingHelpers_1 = require("../PersonObjects/Grafting/GraftingHelpers");
const GameRoot_1 = require("../ui/GameRoot");
const Router_1 = require("../ui/Router");
const GraftingWork_1 = require("../Work/GraftingWork");
const NetscriptHelpers_1 = require("../Netscript/NetscriptHelpers");
const EnumHelper_1 = require("../utils/EnumHelper");
function NetscriptGrafting() {
    const checkGraftingAPIAccess = (ctx) => {
        if (!_player_1.Player.canAccessGrafting()) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, "You do not currently have access to the Grafting API. This is either because you are not in BitNode 10 or because you do not have Source-File 10");
        }
    };
    const isValidGraftingAugName = (augName) => (0, GraftingHelpers_1.getGraftingAvailableAugs)().includes(augName);
    return {
        getAugmentationGraftPrice: (ctx) => (_augName) => {
            const augName = (0, EnumHelper_1.getEnumHelper)("AugmentationName").nsGetMember(ctx, _augName);
            checkGraftingAPIAccess(ctx);
            if (!isValidGraftingAugName(augName)) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid aug: ${augName}`);
            }
            const graftableAug = new GraftableAugmentation_1.GraftableAugmentation(Augmentations_1.Augmentations[augName]);
            return graftableAug.cost;
        },
        getAugmentationGraftTime: (ctx) => (_augName) => {
            const augName = (0, EnumHelper_1.getEnumHelper)("AugmentationName").nsGetMember(ctx, _augName);
            checkGraftingAPIAccess(ctx);
            if (!isValidGraftingAugName(augName)) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid aug: ${augName}`);
            }
            const graftableAug = new GraftableAugmentation_1.GraftableAugmentation(Augmentations_1.Augmentations[augName]);
            return (0, GraftingHelpers_1.calculateGraftingTimeWithBonus)(graftableAug);
        },
        getGraftableAugmentations: (ctx) => () => {
            checkGraftingAPIAccess(ctx);
            return (0, GraftingHelpers_1.getGraftingAvailableAugs)();
        },
        graftAugmentation: (ctx) => (_augName, _focus = true) => {
            const augName = (0, EnumHelper_1.getEnumHelper)("AugmentationName").nsGetMember(ctx, _augName);
            const focus = !!_focus;
            checkGraftingAPIAccess(ctx);
            if (_player_1.Player.city !== _enums_1.CityName.NewTokyo) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, "You must be in New Tokyo to begin grafting an Augmentation.");
            }
            if (!isValidGraftingAugName(augName)) {
                NetscriptHelpers_1.helpers.log(ctx, () => `Invalid aug: ${augName}`);
                return false;
            }
            const wasFocusing = _player_1.Player.focus;
            const craftableAug = new GraftableAugmentation_1.GraftableAugmentation(Augmentations_1.Augmentations[augName]);
            if (_player_1.Player.money < craftableAug.cost) {
                NetscriptHelpers_1.helpers.log(ctx, () => `You don't have enough money to craft ${augName}`);
                return false;
            }
            if (!(0, FactionHelpers_1.hasAugmentationPrereqs)(craftableAug.augmentation)) {
                NetscriptHelpers_1.helpers.log(ctx, () => `You don't have the pre-requisites for ${augName}`);
                return false;
            }
            _player_1.Player.startWork(new GraftingWork_1.GraftingWork({
                singularity: true,
                augmentation: augName,
            }));
            if (focus) {
                _player_1.Player.startFocusing();
                GameRoot_1.Router.toPage(Router_1.Page.Work);
            }
            else if (wasFocusing) {
                _player_1.Player.stopFocusing();
                GameRoot_1.Router.toPage(Router_1.Page.Terminal);
            }
            NetscriptHelpers_1.helpers.log(ctx, () => `Began grafting Augmentation ${augName}.`);
            return true;
        },
        waitForOngoingGrafting: (ctx) => () => {
            checkGraftingAPIAccess(ctx);
            if (!_player_1.Player.currentWork) {
                return Promise.resolve();
            }
            if (!(_player_1.Player.currentWork instanceof GraftingWork_1.GraftingWork)) {
                return Promise.reject(`The current work is not a grafting work. Type of current work: ${_player_1.Player.currentWork.type}.`);
            }
            return _player_1.Player.currentWork.completion;
        },
    };
}
