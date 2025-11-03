"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetscriptGang = NetscriptGang;
const Gang_1 = require("../Gang/Gang");
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const Constants_1 = require("../Gang/data/Constants");
const AllGangs_1 = require("../Gang/AllGangs");
const GangMemberTasks_1 = require("../Gang/GangMemberTasks");
const GangMemberUpgrades_1 = require("../Gang/GangMemberUpgrades");
const NetscriptHelpers_1 = require("../Netscript/NetscriptHelpers");
const EnumHelper_1 = require("../utils/EnumHelper");
function NetscriptGang() {
    /** Functions as an API check and also returns the gang object */
    const getGang = function (ctx) {
        if (!_player_1.Player.gang)
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, "Must have joined gang", "API ACCESS");
        return _player_1.Player.gang;
    };
    const getGangMember = function (ctx, name) {
        const gang = getGang(ctx);
        for (const member of gang.members)
            if (member.name === name)
                return member;
        throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid gang member: '${name}'`);
    };
    const getGangTask = function (ctx, name) {
        const task = GangMemberTasks_1.GangMemberTasks[name];
        if (!task) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid task: '${name}'`);
        }
        return task;
    };
    return {
        createGang: (ctx) => (_faction) => {
            const faction = (0, EnumHelper_1.getEnumHelper)("FactionName").nsGetMember(ctx, _faction);
            if (_player_1.Player.gang) {
                return false;
            }
            const checkResult = _player_1.Player.canAccessGang();
            if (!checkResult.success) {
                NetscriptHelpers_1.helpers.log(ctx, () => checkResult.message);
                return false;
            }
            if (!Constants_1.GangConstants.Names.includes(faction)) {
                NetscriptHelpers_1.helpers.log(ctx, () => `${faction} does not allow creating a gang. You can only do that with ${Constants_1.GangConstants.Names.join(", ")}.`);
                return false;
            }
            if (!_player_1.Player.factions.includes(faction)) {
                NetscriptHelpers_1.helpers.log(ctx, () => `You are not a member of ${faction}.`);
                return false;
            }
            const isHacking = faction === _enums_1.FactionName.NiteSec || faction === _enums_1.FactionName.TheBlackHand;
            _player_1.Player.startGang(faction, isHacking);
            return true;
        },
        inGang: () => () => {
            return _player_1.Player.gang ? true : false;
        },
        getMemberNames: (ctx) => () => {
            const gang = getGang(ctx);
            return gang.members.map((member) => member.name);
        },
        renameMember: (ctx) => (_memberName, _newName) => {
            const gang = getGang(ctx);
            const memberName = NetscriptHelpers_1.helpers.string(ctx, "memberName", _memberName);
            const newName = NetscriptHelpers_1.helpers.string(ctx, "newName", _newName);
            const member = gang.members.find((m) => m.name === memberName);
            if (!memberName) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid memberName: "" (empty string)`);
            }
            if (!newName) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid newName: "" (empty string)`);
            }
            if (newName === memberName) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `newName and memberName must be different, but both were: ${newName}`);
            }
            if (!member) {
                NetscriptHelpers_1.helpers.log(ctx, () => `Failed to rename member: No member exists with memberName: ${memberName}`);
                return false;
            }
            if (gang.members.map((m) => m.name).includes(newName)) {
                NetscriptHelpers_1.helpers.log(ctx, () => `Failed to rename member: A different member already has the newName: ${newName}`);
                return false;
            }
            member.name = newName;
            NetscriptHelpers_1.helpers.log(ctx, () => `Renamed member from memberName: ${memberName} to newName: ${newName}`);
            return true;
        },
        getGangInformation: (ctx) => () => {
            const gang = getGang(ctx);
            return {
                faction: gang.facName,
                isHacking: gang.isHackingGang,
                moneyGainRate: gang.moneyGainRate,
                power: gang.getPower(),
                respect: gang.respect,
                respectGainRate: gang.respectGainRate,
                respectForNextRecruit: gang.respectForNextRecruit(),
                territory: gang.getTerritory(),
                territoryClashChance: gang.territoryClashChance,
                territoryWarfareEngaged: gang.territoryWarfareEngaged,
                wantedLevel: gang.wanted,
                wantedLevelGainRate: gang.wantedGainRate,
                wantedPenalty: gang.getWantedPenalty(),
                equipmentCostMult: 1 / gang.getDiscount(),
            };
        },
        getOtherGangInformation: (ctx) => () => {
            getGang(ctx);
            const cpy = {};
            for (const gang of Object.keys(AllGangs_1.AllGangs)) {
                cpy[gang] = Object.assign({}, AllGangs_1.AllGangs[gang]);
            }
            return cpy;
        },
        getMemberInformation: (ctx) => (_memberName) => {
            const memberName = NetscriptHelpers_1.helpers.string(ctx, "memberName", _memberName);
            const gang = getGang(ctx);
            const member = getGangMember(ctx, memberName);
            return {
                name: member.name,
                task: member.task,
                earnedRespect: member.earnedRespect,
                hack: member.hack,
                str: member.str,
                def: member.def,
                dex: member.dex,
                agi: member.agi,
                cha: member.cha,
                hack_exp: member.hack_exp,
                str_exp: member.str_exp,
                def_exp: member.def_exp,
                dex_exp: member.dex_exp,
                agi_exp: member.agi_exp,
                cha_exp: member.cha_exp,
                hack_mult: member.hack_mult,
                str_mult: member.str_mult,
                def_mult: member.def_mult,
                dex_mult: member.dex_mult,
                agi_mult: member.agi_mult,
                cha_mult: member.cha_mult,
                hack_asc_mult: member.calculateAscensionMult(member.hack_asc_points),
                str_asc_mult: member.calculateAscensionMult(member.str_asc_points),
                def_asc_mult: member.calculateAscensionMult(member.def_asc_points),
                dex_asc_mult: member.calculateAscensionMult(member.dex_asc_points),
                agi_asc_mult: member.calculateAscensionMult(member.agi_asc_points),
                cha_asc_mult: member.calculateAscensionMult(member.cha_asc_points),
                hack_asc_points: member.hack_asc_points,
                str_asc_points: member.str_asc_points,
                def_asc_points: member.def_asc_points,
                dex_asc_points: member.dex_asc_points,
                agi_asc_points: member.agi_asc_points,
                cha_asc_points: member.cha_asc_points,
                upgrades: member.upgrades.slice(),
                augmentations: member.augmentations.slice(),
                respectGain: member.calculateRespectGain(gang),
                wantedLevelGain: member.calculateWantedLevelGain(gang),
                moneyGain: member.calculateMoneyGain(gang),
                expGain: member.calculateExpGain(),
            };
        },
        canRecruitMember: (ctx) => () => {
            const gang = getGang(ctx);
            return gang.canRecruitMember() === Gang_1.RecruitmentResult.Success;
        },
        getRecruitsAvailable: (ctx) => () => {
            const gang = getGang(ctx);
            return gang.getRecruitsAvailable();
        },
        respectForNextRecruit: (ctx) => () => {
            const gang = getGang(ctx);
            return gang.respectForNextRecruit();
        },
        recruitMember: (ctx) => (_memberName) => {
            const memberName = NetscriptHelpers_1.helpers.string(ctx, "memberName", _memberName);
            const gang = getGang(ctx);
            const result = gang.recruitMember(memberName);
            if (result !== Gang_1.RecruitmentResult.Success) {
                ctx.workerScript.log("gang.recruitMember", () => `Failed to recruit gang member '${memberName}'. ${result}.`);
                return false;
            }
            ctx.workerScript.log("gang.recruitMember", () => `Successfully recruited gang member '${memberName}'`);
            return true;
        },
        getTaskNames: (ctx) => () => {
            const gang = getGang(ctx);
            const tasks = gang.getAllTaskNames();
            tasks.unshift("Unassigned");
            return tasks;
        },
        setMemberTask: (ctx) => (_memberName, _taskName) => {
            const memberName = NetscriptHelpers_1.helpers.string(ctx, "memberName", _memberName);
            const taskName = NetscriptHelpers_1.helpers.string(ctx, "taskName", _taskName);
            const gang = getGang(ctx);
            const member = getGangMember(ctx, memberName);
            if (!gang.getAllTaskNames().includes(taskName)) {
                ctx.workerScript.log("gang.setMemberTask", () => `Failed to assign Gang Member '${memberName}' to Invalid task '${taskName}'. '${memberName}' is now Unassigned`);
                return member.assignToTask("Unassigned");
            }
            const success = member.assignToTask(taskName);
            if (success) {
                ctx.workerScript.log("gang.setMemberTask", () => `Successfully assigned Gang Member '${memberName}' to '${taskName}' task`);
            }
            else {
                ctx.workerScript.log("gang.setMemberTask", () => `Failed to assign Gang Member '${memberName}' to '${taskName}' task. '${memberName}' is now Unassigned`);
            }
            return success;
        },
        getTaskStats: (ctx) => (_taskName) => {
            const taskName = NetscriptHelpers_1.helpers.string(ctx, "taskName", _taskName);
            getGang(ctx);
            const task = getGangTask(ctx, taskName);
            const copy = Object.assign({}, task);
            copy.territory = Object.assign({}, task.territory);
            return copy;
        },
        getEquipmentNames: (ctx) => () => {
            getGang(ctx);
            return Object.keys(GangMemberUpgrades_1.GangMemberUpgrades);
        },
        getEquipmentCost: (ctx) => (_equipName) => {
            const equipName = NetscriptHelpers_1.helpers.string(ctx, "equipName", _equipName);
            const gang = getGang(ctx);
            const upg = GangMemberUpgrades_1.GangMemberUpgrades[equipName];
            if (upg === null)
                return Infinity;
            return gang.getUpgradeCost(upg);
        },
        getEquipmentType: (ctx) => (_equipName) => {
            const equipName = NetscriptHelpers_1.helpers.string(ctx, "equipName", _equipName);
            getGang(ctx);
            const upg = GangMemberUpgrades_1.GangMemberUpgrades[equipName];
            if (upg == null)
                return "";
            return upg.getType();
        },
        getEquipmentStats: (ctx) => (_equipName) => {
            const equipName = NetscriptHelpers_1.helpers.string(ctx, "equipName", _equipName);
            getGang(ctx);
            const equipment = GangMemberUpgrades_1.GangMemberUpgrades[equipName];
            if (!equipment) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid equipment: ${equipName}`);
            }
            const typecheck = equipment.mults;
            return Object.assign({}, typecheck);
        },
        purchaseEquipment: (ctx) => (_memberName, _equipName) => {
            const memberName = NetscriptHelpers_1.helpers.string(ctx, "memberName", _memberName);
            const equipName = NetscriptHelpers_1.helpers.string(ctx, "equipName", _equipName);
            getGang(ctx);
            const member = getGangMember(ctx, memberName);
            const equipment = GangMemberUpgrades_1.GangMemberUpgrades[equipName];
            if (!equipment) {
                ctx.workerScript.log("gang.purchaseEquipment", () => `'${equipName}' is not a valid equipment`);
                return false;
            }
            const res = member.buyUpgrade(equipment);
            if (res) {
                ctx.workerScript.log("gang.purchaseEquipment", () => `Purchased '${equipName}' for Gang member '${memberName}'`);
            }
            else {
                ctx.workerScript.log("gang.purchaseEquipment", () => `Failed to purchase '${equipName}' for Gang member '${memberName}'`);
            }
            return res;
        },
        ascendMember: (ctx) => (_memberName) => {
            const memberName = NetscriptHelpers_1.helpers.string(ctx, "memberName", _memberName);
            const gang = getGang(ctx);
            const member = getGangMember(ctx, memberName);
            if (!member.canAscend())
                return;
            return gang.ascendMember(member, ctx.workerScript);
        },
        getAscensionResult: (ctx) => (_memberName) => {
            const memberName = NetscriptHelpers_1.helpers.string(ctx, "memberName", _memberName);
            getGang(ctx);
            const member = getGangMember(ctx, memberName);
            if (!member.canAscend())
                return;
            return {
                respect: member.earnedRespect,
                ...member.getAscensionResults(),
            };
        },
        getInstallResult: (ctx) => (_memberName) => {
            const memberName = NetscriptHelpers_1.helpers.string(ctx, "memberName", _memberName);
            getGang(ctx);
            const member = getGangMember(ctx, memberName);
            if (!member.canAscend())
                return;
            const preInstall = member.getCurrentAscensionMults();
            const postInstall = member.getPostInstallPoints();
            return {
                hack: member.calculateAscensionMult(postInstall.hack) / preInstall.hack,
                str: member.calculateAscensionMult(postInstall.str) / preInstall.str,
                def: member.calculateAscensionMult(postInstall.def) / preInstall.def,
                dex: member.calculateAscensionMult(postInstall.dex) / preInstall.dex,
                agi: member.calculateAscensionMult(postInstall.agi) / preInstall.agi,
                cha: member.calculateAscensionMult(postInstall.cha) / preInstall.cha,
            };
        },
        setTerritoryWarfare: (ctx) => (_engage) => {
            const engage = !!_engage;
            const gang = getGang(ctx);
            if (engage) {
                gang.territoryWarfareEngaged = true;
                ctx.workerScript.log("gang.setTerritoryWarfare", () => "Engaging in Gang Territory Warfare");
            }
            else {
                gang.territoryWarfareEngaged = false;
                ctx.workerScript.log("gang.setTerritoryWarfare", () => "Disengaging in Gang Territory Warfare");
            }
        },
        getChanceToWinClash: (ctx) => (_otherGang) => {
            const otherGang = NetscriptHelpers_1.helpers.string(ctx, "otherGang", _otherGang);
            const gang = getGang(ctx);
            if (AllGangs_1.AllGangs[otherGang] == null) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid gang: ${otherGang}`);
            }
            const playerPower = AllGangs_1.AllGangs[gang.facName].power;
            const otherPower = AllGangs_1.AllGangs[otherGang].power;
            return playerPower / (otherPower + playerPower);
        },
        getBonusTime: (ctx) => () => {
            const gang = getGang(ctx);
            return gang.storedCycles * 200;
        },
        nextUpdate: (ctx) => () => {
            getGang(ctx);
            if (!Gang_1.GangPromise.promise)
                Gang_1.GangPromise.promise = new Promise((res) => (Gang_1.GangPromise.resolve = res));
            return Gang_1.GangPromise.promise;
        },
    };
}
