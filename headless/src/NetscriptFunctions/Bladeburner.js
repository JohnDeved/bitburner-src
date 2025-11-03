"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetscriptBladeburner = NetscriptBladeburner;
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const Bladeburner_1 = require("../Bladeburner/Bladeburner");
const BitNodeMultipliers_1 = require("../BitNode/BitNodeMultipliers");
const NetscriptHelpers_1 = require("../Netscript/NetscriptHelpers");
const EnumHelper_1 = require("../utils/EnumHelper");
const Skills_1 = require("../Bladeburner/data/Skills");
const TypeAssertion_1 = require("../Netscript/TypeAssertion");
const BlackOperations_1 = require("../Bladeburner/data/BlackOperations");
const Sleeve_1 = require("../NetscriptFunctions/Sleeve");
const BitNodeUtils_1 = require("../BitNode/BitNodeUtils");
const Formulas_1 = require("../Bladeburner/Formulas");
function NetscriptBladeburner() {
    const checkBladeburnerAccess = function (ctx) {
        getBladeburner(ctx);
        return;
    };
    const getBladeburner = function (ctx) {
        const apiAccess = (0, BitNodeUtils_1.canAccessBitNodeFeature)(7) || (0, BitNodeUtils_1.canAccessBitNodeFeature)(6);
        if (!apiAccess) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, "You have not unlocked the Bladeburner API.", "API ACCESS");
        }
        const bladeburner = _player_1.Player.bladeburner;
        if (!bladeburner)
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, "You must be a member of the Bladeburner division to use this API.");
        return bladeburner;
    };
    function getAction(ctx, _type, name) {
        const bladeburner = _player_1.Player.bladeburner;
        const type = (0, EnumHelper_1.getEnumHelper)("BladeburnerActionType").nsGetMember(ctx, _type);
        (0, TypeAssertion_1.assertStringWithNSContext)(ctx, "name", name);
        if (bladeburner === null) {
            throw new Error("Must have joined bladeburner");
        }
        const action = bladeburner.getActionFromTypeAndName(type, name);
        if (!action) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid action type='${_type}', name='${name}'`);
        }
        return action;
    }
    function isLevelableAction(action) {
        return action.type === _enums_1.BladeburnerActionType.Contract || action.type === _enums_1.BladeburnerActionType.Operation;
    }
    function getLevelableAction(ctx, type, name) {
        const action = getAction(ctx, type, name);
        if (!isLevelableAction(action)) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Actions of type ${action.type} are not levelable, ${ctx.functionPath} requires a levelable action`);
        }
        return action;
    }
    return {
        inBladeburner: () => () => !!_player_1.Player.bladeburner,
        getContractNames: (ctx) => () => {
            getBladeburner(ctx);
            return Object.values(_enums_1.BladeburnerContractName);
        },
        getOperationNames: (ctx) => () => {
            getBladeburner(ctx);
            return Object.values(_enums_1.BladeburnerOperationName);
        },
        getBlackOpNames: (ctx) => () => {
            getBladeburner(ctx);
            // Ensures they are sent in the correct order
            return BlackOperations_1.blackOpsArray.map((blackOp) => blackOp.name);
        },
        getNextBlackOp: (ctx) => () => {
            const bladeburner = getBladeburner(ctx);
            if (bladeburner.numBlackOpsComplete >= BlackOperations_1.blackOpsArray.length)
                return null;
            const blackOp = BlackOperations_1.blackOpsArray[bladeburner.numBlackOpsComplete];
            return { name: blackOp.name, rank: blackOp.reqdRank };
        },
        getBlackOpRank: (ctx) => (_blackOpName) => {
            checkBladeburnerAccess(ctx);
            const blackOpName = (0, EnumHelper_1.getEnumHelper)("BladeburnerBlackOpName").nsGetMember(ctx, _blackOpName);
            return BlackOperations_1.BlackOperations[blackOpName].reqdRank;
        },
        getGeneralActionNames: (ctx) => () => {
            getBladeburner(ctx);
            return Object.values(_enums_1.BladeburnerGeneralActionName);
        },
        getSkillNames: (ctx) => () => {
            getBladeburner(ctx);
            return Object.values(_enums_1.BladeburnerSkillName);
        },
        startAction: (ctx) => (type, name) => {
            const bladeburner = getBladeburner(ctx);
            const action = getAction(ctx, type, name);
            const attempt = bladeburner.startAction(action.id);
            NetscriptHelpers_1.helpers.log(ctx, () => attempt.message);
            return !!attempt.success;
        },
        stopBladeburnerAction: (ctx) => () => {
            const bladeburner = getBladeburner(ctx);
            NetscriptHelpers_1.helpers.log(ctx, () => `Stopping current Bladeburner action.`);
            return bladeburner.resetAction();
        },
        getCurrentAction: (ctx) => () => {
            const bladeburner = getBladeburner(ctx);
            if (!bladeburner.action)
                return null;
            return { ...bladeburner.action };
        },
        getActionTime: (ctx) => (type, name) => {
            const bladeburner = getBladeburner(ctx);
            const action = getAction(ctx, type, name);
            // return ms instead of seconds
            return action.getActionTime(bladeburner, _player_1.Player) * 1000;
        },
        getActionCurrentTime: (ctx) => () => {
            const bladeburner = getBladeburner(ctx);
            return (Math.min(bladeburner.actionTimeCurrent + bladeburner.actionTimeOverflow, bladeburner.actionTimeToComplete) *
                1000);
        },
        getActionEstimatedSuccessChance: (ctx) => (type, name, _sleeve) => {
            const bladeburner = getBladeburner(ctx);
            const action = getAction(ctx, type, name);
            if (_sleeve == null) {
                return action.getSuccessRange(bladeburner, _player_1.Player);
            }
            (0, Sleeve_1.checkSleeveAPIAccess)(ctx);
            const sleeveNumber = NetscriptHelpers_1.helpers.number(ctx, "sleeve", _sleeve);
            (0, Sleeve_1.checkSleeveNumber)(ctx, sleeveNumber);
            switch (action.type) {
                case _enums_1.BladeburnerActionType.General:
                case _enums_1.BladeburnerActionType.Contract: {
                    const sleevePerson = _player_1.Player.sleeves[sleeveNumber];
                    return action.getSuccessRange(bladeburner, sleevePerson);
                }
                default:
                    return [0, 0];
            }
        },
        getActionRepGain: (ctx) => (type, name, _level) => {
            checkBladeburnerAccess(ctx);
            const action = getAction(ctx, type, name);
            const level = isLevelableAction(action) ? NetscriptHelpers_1.helpers.number(ctx, "level", _level ?? action.level) : 1;
            const rankGain = (0, Formulas_1.calculateActionRankGain)(action, level);
            return (0, Formulas_1.calculateActionReputationGain)(_player_1.Player, rankGain);
        },
        getActionCountRemaining: (ctx) => (type, name) => {
            const bladeburner = getBladeburner(ctx);
            const action = getAction(ctx, type, name);
            switch (action.type) {
                case _enums_1.BladeburnerActionType.General:
                    return Infinity;
                case _enums_1.BladeburnerActionType.BlackOp:
                    return bladeburner.numBlackOpsComplete > action.n ? 0 : 1;
                case _enums_1.BladeburnerActionType.Contract:
                case _enums_1.BladeburnerActionType.Operation:
                    return action.count;
            }
        },
        getActionMaxLevel: (ctx) => (type, name) => {
            checkBladeburnerAccess(ctx);
            const action = getLevelableAction(ctx, type, name);
            return action.maxLevel;
        },
        getActionCurrentLevel: (ctx) => (type, name) => {
            checkBladeburnerAccess(ctx);
            const action = getLevelableAction(ctx, type, name);
            return action.level;
        },
        getActionAutolevel: (ctx) => (type, name) => {
            checkBladeburnerAccess(ctx);
            const action = getLevelableAction(ctx, type, name);
            return action.autoLevel;
        },
        getActionSuccesses: (ctx) => (type, name) => {
            checkBladeburnerAccess(ctx);
            const action = getLevelableAction(ctx, type, name);
            return action.successes;
        },
        setActionAutolevel: (ctx) => (type, name, _autoLevel = true) => {
            const autoLevel = !!_autoLevel;
            checkBladeburnerAccess(ctx);
            const action = getLevelableAction(ctx, type, name);
            action.autoLevel = autoLevel;
            NetscriptHelpers_1.helpers.log(ctx, () => `Autolevel for ${action.name} has been ${autoLevel ? "enabled" : "disabled"}`);
        },
        setActionLevel: (ctx) => (type, name, _level) => {
            const level = NetscriptHelpers_1.helpers.positiveInteger(ctx, "level", _level ?? 1);
            checkBladeburnerAccess(ctx);
            const action = getLevelableAction(ctx, type, name);
            if (level < 1 || level > action.maxLevel) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Level must be between 1 and ${action.maxLevel}, is ${level}`);
            }
            action.level = level;
            NetscriptHelpers_1.helpers.log(ctx, () => `Set level for ${action.name} to ${level}`);
        },
        getRank: (ctx) => () => {
            const bladeburner = getBladeburner(ctx);
            return bladeburner.rank;
        },
        getSkillPoints: (ctx) => () => {
            const bladeburner = getBladeburner(ctx);
            return bladeburner.skillPoints;
        },
        getSkillLevel: (ctx) => (_skillName) => {
            const bladeburner = getBladeburner(ctx);
            const skillName = (0, EnumHelper_1.getEnumHelper)("BladeburnerSkillName").nsGetMember(ctx, _skillName, "skillName");
            return bladeburner.getSkillLevel(skillName);
        },
        getSkillUpgradeCost: (ctx) => (_skillName, _count) => {
            const bladeburner = getBladeburner(ctx);
            const skillName = (0, EnumHelper_1.getEnumHelper)("BladeburnerSkillName").nsGetMember(ctx, _skillName, "skillName");
            const count = NetscriptHelpers_1.helpers.positiveInteger(ctx, "count", _count ?? 1);
            const currentLevel = bladeburner.getSkillLevel(skillName);
            const skill = Skills_1.Skills[skillName];
            if (currentLevel + count > skill.maxLvl) {
                return Infinity;
            }
            return skill.calculateCost(currentLevel, count);
        },
        upgradeSkill: (ctx) => (_skillName, _count) => {
            const bladeburner = getBladeburner(ctx);
            const skillName = (0, EnumHelper_1.getEnumHelper)("BladeburnerSkillName").nsGetMember(ctx, _skillName, "skillName");
            const count = NetscriptHelpers_1.helpers.positiveInteger(ctx, "count", _count ?? 1);
            const attempt = bladeburner.upgradeSkill(skillName, count);
            NetscriptHelpers_1.helpers.log(ctx, () => attempt.message);
            return !!attempt.success;
        },
        getTeamSize: (ctx) => (type, name) => {
            const bladeburner = getBladeburner(ctx);
            if (!type && !name)
                return bladeburner.teamSize;
            const action = getAction(ctx, type, name);
            switch (action.type) {
                case _enums_1.BladeburnerActionType.General:
                case _enums_1.BladeburnerActionType.Contract:
                    return 0;
                case _enums_1.BladeburnerActionType.BlackOp:
                case _enums_1.BladeburnerActionType.Operation:
                    return action.teamCount;
            }
        },
        setTeamSize: (ctx) => (type, name, _size) => {
            const bladeburner = getBladeburner(ctx);
            const action = getAction(ctx, type, name);
            const size = NetscriptHelpers_1.helpers.integer(ctx, "size", _size);
            if (size < 0) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, "size must be a non-negative integer", "TYPE");
            }
            if (size > bladeburner.teamSize) {
                NetscriptHelpers_1.helpers.log(ctx, () => `Failed to set team size due to not enough team members.`);
                return -1;
            }
            switch (action.type) {
                case _enums_1.BladeburnerActionType.Contract:
                case _enums_1.BladeburnerActionType.General:
                    NetscriptHelpers_1.helpers.log(ctx, () => "Only valid for Operations and Black Operations");
                    return -1;
                case _enums_1.BladeburnerActionType.BlackOp:
                case _enums_1.BladeburnerActionType.Operation: {
                    action.teamCount = size;
                    NetscriptHelpers_1.helpers.log(ctx, () => `Set team size for ${action.name} to ${size}`);
                    return size;
                }
            }
        },
        getCityEstimatedPopulation: (ctx) => (_cityName) => {
            const bladeburner = getBladeburner(ctx);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            return bladeburner.cities[cityName].popEst;
        },
        getCityCommunities: (ctx) => (_cityName) => {
            const bladeburner = getBladeburner(ctx);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            return bladeburner.cities[cityName].comms;
        },
        getCityChaos: (ctx) => (_cityName) => {
            const bladeburner = getBladeburner(ctx);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            return bladeburner.cities[cityName].chaos;
        },
        getCity: (ctx) => () => {
            const bladeburner = getBladeburner(ctx);
            return bladeburner.city;
        },
        switchCity: (ctx) => (_cityName) => {
            const bladeburner = getBladeburner(ctx);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            bladeburner.city = cityName;
            return true;
        },
        getStamina: (ctx) => () => {
            const bladeburner = getBladeburner(ctx);
            return [bladeburner.stamina, bladeburner.maxStamina];
        },
        joinBladeburnerFaction: (ctx) => () => {
            const bladeburner = getBladeburner(ctx);
            const attempt = bladeburner.joinFaction();
            NetscriptHelpers_1.helpers.log(ctx, () => attempt.message);
            return !!attempt.success;
        },
        joinBladeburnerDivision: (ctx) => () => {
            if (!(0, BitNodeUtils_1.canAccessBitNodeFeature)(7) && !(0, BitNodeUtils_1.canAccessBitNodeFeature)(6)) {
                NetscriptHelpers_1.helpers.log(ctx, () => "You do not have Source-File 6 or Source-File 7.");
                return false;
            }
            if (_player_1.Player.bitNodeOptions.disableBladeburner) {
                NetscriptHelpers_1.helpers.log(ctx, () => "Bladeburner is disabled by advanced options.");
                return false;
            }
            if (BitNodeMultipliers_1.currentNodeMults.BladeburnerRank === 0) {
                NetscriptHelpers_1.helpers.log(ctx, () => "Bladeburner is disabled in this BitNode.");
                return false;
            }
            // Already member
            if (_player_1.Player.bladeburner) {
                return true;
            }
            if (_player_1.Player.skills.strength < 100 ||
                _player_1.Player.skills.defense < 100 ||
                _player_1.Player.skills.dexterity < 100 ||
                _player_1.Player.skills.agility < 100) {
                NetscriptHelpers_1.helpers.log(ctx, () => "You do not meet the requirements for joining the Bladeburner division. All combat stats must be at least level 100.");
                return false;
            }
            _player_1.Player.startBladeburner();
            NetscriptHelpers_1.helpers.log(ctx, () => "You have been accepted into the Bladeburner division.");
            return true;
        },
        getBonusTime: (ctx) => () => {
            const bladeburner = getBladeburner(ctx);
            return bladeburner.storedCycles * 200;
        },
        nextUpdate: (ctx) => () => {
            checkBladeburnerAccess(ctx);
            if (!Bladeburner_1.BladeburnerPromise.promise)
                Bladeburner_1.BladeburnerPromise.promise = new Promise((res) => (Bladeburner_1.BladeburnerPromise.resolve = res));
            return Bladeburner_1.BladeburnerPromise.promise;
        },
    };
}
