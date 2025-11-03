"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetscriptStanek = NetscriptStanek;
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const Helper_1 = require("../CotMG/Helper");
const Fragment_1 = require("../CotMG/Fragment");
const FragmentType_1 = require("../CotMG/FragmentType");
const AugmentationHelpers_1 = require("../Augmentation/AugmentationHelpers");
const FactionHelpers_1 = require("../Faction/FactionHelpers");
const Factions_1 = require("../Faction/Factions");
const NetscriptHelpers_1 = require("../Netscript/NetscriptHelpers");
const ServerHelpers_1 = require("../Server/ServerHelpers");
function NetscriptStanek() {
    function checkStanekAPIAccess(ctx) {
        if (!_player_1.Player.hasAugmentation(_enums_1.AugmentationName.StaneksGift1, true)) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, "Stanek's Gift is not installed");
        }
    }
    return {
        giftWidth: (ctx) => () => {
            checkStanekAPIAccess(ctx);
            return Helper_1.staneksGift.width();
        },
        giftHeight: (ctx) => () => {
            checkStanekAPIAccess(ctx);
            return Helper_1.staneksGift.height();
        },
        chargeFragment: (ctx) => (_rootX, _rootY) => {
            //Get the fragment object using the given coordinates
            const rootX = NetscriptHelpers_1.helpers.number(ctx, "rootX", _rootX);
            const rootY = NetscriptHelpers_1.helpers.number(ctx, "rootY", _rootY);
            checkStanekAPIAccess(ctx);
            const fragment = Helper_1.staneksGift.findFragment(rootX, rootY);
            //Check whether the selected fragment can ge charged
            if (!fragment)
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `No fragment with root (${rootX}, ${rootY}).`);
            if (fragment.fragment().type == FragmentType_1.FragmentTypeEnum.Booster) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `The fragment with root (${rootX}, ${rootY}) is a Booster Fragment and thus cannot be charged.`);
            }
            //Charge the fragment
            const cores = NetscriptHelpers_1.helpers.getServer(ctx, ctx.workerScript.hostname).cpuCores;
            const coreBonus = (0, ServerHelpers_1.getCoreBonus)(cores);
            const inBonus = Helper_1.staneksGift.inBonus();
            const time = inBonus ? 200 : 1000;
            if (inBonus)
                Helper_1.staneksGift.isBonusCharging = true;
            return NetscriptHelpers_1.helpers.netscriptDelay(ctx, time).then(function () {
                Helper_1.staneksGift.charge(fragment, ctx.workerScript.scriptRef.threads * coreBonus);
                NetscriptHelpers_1.helpers.log(ctx, () => `Charged fragment with ${ctx.workerScript.scriptRef.threads} threads.`);
                return Promise.resolve();
            });
        },
        fragmentDefinitions: (ctx) => () => {
            checkStanekAPIAccess(ctx);
            NetscriptHelpers_1.helpers.log(ctx, () => `Returned ${Fragment_1.Fragments.length} fragments`);
            return Fragment_1.Fragments.map((f) => f.copy());
        },
        activeFragments: (ctx) => () => {
            checkStanekAPIAccess(ctx);
            NetscriptHelpers_1.helpers.log(ctx, () => `Returned ${Helper_1.staneksGift.fragments.length} fragments`);
            return Helper_1.staneksGift.fragments.map((activeFragment) => {
                return { ...activeFragment.copy(), ...activeFragment.fragment().copy() };
            });
        },
        clearGift: (ctx) => () => {
            checkStanekAPIAccess(ctx);
            NetscriptHelpers_1.helpers.log(ctx, () => `Cleared Stanek's Gift.`);
            Helper_1.staneksGift.clear();
        },
        canPlaceFragment: (ctx) => (_rootX, _rootY, _rotation, _fragmentId) => {
            const rootX = NetscriptHelpers_1.helpers.number(ctx, "rootX", _rootX);
            const rootY = NetscriptHelpers_1.helpers.number(ctx, "rootY", _rootY);
            const rotation = NetscriptHelpers_1.helpers.number(ctx, "rotation", _rotation);
            const fragmentId = NetscriptHelpers_1.helpers.number(ctx, "fragmentId", _fragmentId);
            checkStanekAPIAccess(ctx);
            const fragment = (0, Fragment_1.FragmentById)(fragmentId);
            if (!fragment)
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid fragment id: ${fragmentId}`);
            const can = Helper_1.staneksGift.canPlace(rootX, rootY, rotation, fragment);
            return can;
        },
        placeFragment: (ctx) => (_rootX, _rootY, _rotation, _fragmentId) => {
            const rootX = NetscriptHelpers_1.helpers.number(ctx, "rootX", _rootX);
            const rootY = NetscriptHelpers_1.helpers.number(ctx, "rootY", _rootY);
            const rotation = NetscriptHelpers_1.helpers.number(ctx, "rotation", _rotation);
            const fragmentId = NetscriptHelpers_1.helpers.number(ctx, "fragmentId", _fragmentId);
            checkStanekAPIAccess(ctx);
            const fragment = (0, Fragment_1.FragmentById)(fragmentId);
            if (!fragment)
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid fragment id: ${fragmentId}`);
            return Helper_1.staneksGift.place(rootX, rootY, rotation, fragment);
        },
        getFragment: (ctx) => (_rootX, _rootY) => {
            const rootX = NetscriptHelpers_1.helpers.number(ctx, "rootX", _rootX);
            const rootY = NetscriptHelpers_1.helpers.number(ctx, "rootY", _rootY);
            checkStanekAPIAccess(ctx);
            const activeFragment = Helper_1.staneksGift.findFragment(rootX, rootY);
            if (activeFragment !== undefined) {
                return { ...activeFragment.copy(), ...activeFragment.fragment().copy() };
            }
            return undefined;
        },
        removeFragment: (ctx) => (_rootX, _rootY) => {
            const rootX = NetscriptHelpers_1.helpers.number(ctx, "rootX", _rootX);
            const rootY = NetscriptHelpers_1.helpers.number(ctx, "rootY", _rootY);
            checkStanekAPIAccess(ctx);
            return Helper_1.staneksGift.delete(rootX, rootY);
        },
        acceptGift: (ctx) => () => {
            const cotmgFaction = Factions_1.Factions[_enums_1.FactionName.ChurchOfTheMachineGod];
            // Check if the player is eligible to join the church
            const checkResult = (0, Helper_1.canAcceptStaneksGift)();
            if (checkResult.success) {
                // Join the CotMG factionn
                (0, FactionHelpers_1.joinFaction)(cotmgFaction);
                // Install the first Stanek aug
                (0, AugmentationHelpers_1.applyAugmentation)({ name: _enums_1.AugmentationName.StaneksGift1, level: 1 });
                NetscriptHelpers_1.helpers.log(ctx, () => `You joined '${_enums_1.FactionName.ChurchOfTheMachineGod}' and have '${_enums_1.AugmentationName.StaneksGift1}' installed.`);
            }
            else {
                NetscriptHelpers_1.helpers.log(ctx, () => checkResult.message);
            }
            // Return true if the player is in CotMG and has the first Stanek aug installed
            return cotmgFaction.isMember && _player_1.Player.hasAugmentation(_enums_1.AugmentationName.StaneksGift1, true);
        },
    };
}
