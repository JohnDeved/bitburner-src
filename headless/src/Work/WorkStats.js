"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyWorkStatsExp = exports.applyWorkStats = exports.scaleWorkStats = exports.sumWorkStats = exports.newWorkStats = void 0;
exports.multWorkStats = multWorkStats;
const _player_1 = require("@player");
const newWorkStats = (params) => {
    return {
        money: params?.money ?? 0,
        reputation: params?.reputation ?? 0,
        hackExp: params?.hackExp ?? 0,
        strExp: params?.strExp ?? 0,
        defExp: params?.defExp ?? 0,
        dexExp: params?.dexExp ?? 0,
        agiExp: params?.agiExp ?? 0,
        chaExp: params?.chaExp ?? 0,
        intExp: params?.intExp ?? 0,
    };
};
exports.newWorkStats = newWorkStats;
/** Add two workStats objects */
const sumWorkStats = (w0, w1) => {
    return {
        money: w0.money + w1.money,
        reputation: w0.reputation + w1.reputation,
        hackExp: w0.hackExp + w1.hackExp,
        strExp: w0.strExp + w1.strExp,
        defExp: w0.defExp + w1.defExp,
        dexExp: w0.dexExp + w1.dexExp,
        agiExp: w0.agiExp + w1.agiExp,
        chaExp: w0.chaExp + w1.chaExp,
        intExp: w0.intExp + w1.intExp,
    };
};
exports.sumWorkStats = sumWorkStats;
/** Scale all stats on a WorkStats object by a number. Money scaling optional but defaults to true. */
const scaleWorkStats = (w, n, scaleMoney = true) => {
    const m = scaleMoney ? n : 1;
    return {
        money: w.money * m,
        reputation: w.reputation * n,
        hackExp: w.hackExp * n,
        strExp: w.strExp * n,
        defExp: w.defExp * n,
        dexExp: w.dexExp * n,
        agiExp: w.agiExp * n,
        chaExp: w.chaExp * n,
        intExp: w.intExp * n,
    };
};
exports.scaleWorkStats = scaleWorkStats;
const applyWorkStats = (target, workStats, cycles, source) => {
    const expStats = (0, exports.applyWorkStatsExp)(target, workStats, cycles);
    const gains = {
        money: workStats.money * cycles,
        reputation: 0,
        hackExp: expStats.hackExp,
        strExp: expStats.strExp,
        defExp: expStats.defExp,
        dexExp: expStats.dexExp,
        agiExp: expStats.agiExp,
        chaExp: expStats.chaExp,
        intExp: expStats.intExp,
    };
    _player_1.Player.gainMoney(gains.money, source);
    return gains;
};
exports.applyWorkStats = applyWorkStats;
const applyWorkStatsExp = (target, workStats, mult = 1) => {
    const gains = (0, exports.scaleWorkStats)(workStats, mult, false);
    gains.money = 0;
    gains.reputation = 0;
    target.gainHackingExp(gains.hackExp);
    target.gainStrengthExp(gains.strExp);
    target.gainDefenseExp(gains.defExp);
    target.gainDexterityExp(gains.dexExp);
    target.gainAgilityExp(gains.agiExp);
    target.gainCharismaExp(gains.chaExp);
    target.gainIntelligenceExp(gains.intExp);
    return gains;
};
exports.applyWorkStatsExp = applyWorkStatsExp;
/** Calculate the application of a person's multipliers to a WorkStats object */
function multWorkStats(workStats, mults, moneyMult = 1, repMult = 1) {
    return {
        money: (workStats.money ?? 0) * moneyMult,
        reputation: (workStats.reputation ?? 0) * repMult,
        hackExp: (workStats.hackExp ?? 0) * mults.hacking_exp,
        strExp: (workStats.strExp ?? 0) * mults.strength_exp,
        defExp: (workStats.defExp ?? 0) * mults.defense_exp,
        dexExp: (workStats.dexExp ?? 0) * mults.dexterity_exp,
        agiExp: (workStats.agiExp ?? 0) * mults.agility_exp,
        chaExp: (workStats.chaExp ?? 0) * mults.charisma_exp,
        intExp: workStats.intExp ?? 0,
    };
}
