"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCompanyWorkStats = exports.calculateFactionRep = exports.FactionWorkStats = void 0;
exports.calculateCrimeWorkStats = calculateCrimeWorkStats;
exports.calculateFactionExp = calculateFactionExp;
exports.calculateCost = calculateCost;
exports.calculateClassEarnings = calculateClassEarnings;
const BitNodeMultipliers_1 = require("../BitNode/BitNodeMultipliers");
const WorkStats_1 = require("./WorkStats");
const Constants_1 = require("../Constants");
const _enums_1 = require("@enums");
const reputation_1 = require("../PersonObjects/formulas/reputation");
const Locations_1 = require("../Locations/Locations");
const _player_1 = require("@player");
const ClassWork_1 = require("./ClassWork");
const AllServers_1 = require("../Server/AllServers");
const servers_1 = require("../Server/data/servers");
const EnumHelper_1 = require("../utils/EnumHelper");
function processWorkStats(person, workStats) {
    // "person" can be a normal object that the player passes to NS APIs, so we cannot use `person instanceof Sleeve`.
    if (_player_1.Player.bitNodeOptions.disableSleeveExpAndAugmentation && "shock" in person) {
        workStats.hackExp = 0;
        workStats.strExp = 0;
        workStats.defExp = 0;
        workStats.dexExp = 0;
        workStats.agiExp = 0;
        workStats.chaExp = 0;
        workStats.intExp = 0;
    }
    return workStats;
}
const gameCPS = 1000 / Constants_1.CONSTANTS.MilliPerCycle; // 5 cycles per second
exports.FactionWorkStats = {
    [_enums_1.FactionWorkType.hacking]: (0, WorkStats_1.newWorkStats)({ hackExp: 2 }),
    [_enums_1.FactionWorkType.field]: (0, WorkStats_1.newWorkStats)({
        hackExp: 1,
        strExp: 1,
        defExp: 1,
        dexExp: 1,
        agiExp: 1,
        chaExp: 1,
    }),
    [_enums_1.FactionWorkType.security]: (0, WorkStats_1.newWorkStats)({
        hackExp: 0.5,
        strExp: 1.5,
        defExp: 1.5,
        dexExp: 1.5,
        agiExp: 1.5,
    }),
};
function calculateCrimeWorkStats(person, crime) {
    const gains = (0, WorkStats_1.scaleWorkStats)((0, WorkStats_1.multWorkStats)(
    //Todo: rework crime and workstats interfaces to use the same naming convention for exp values, then we can just make a workStats directly from a crime.
    (0, WorkStats_1.newWorkStats)({
        money: crime.money,
        hackExp: crime.hacking_exp,
        strExp: crime.strength_exp,
        defExp: crime.defense_exp,
        dexExp: crime.dexterity_exp,
        agiExp: crime.agility_exp,
        chaExp: crime.charisma_exp,
        intExp: crime.intelligence_exp,
    }), person.mults, person.mults.crime_money * BitNodeMultipliers_1.currentNodeMults.CrimeMoney), BitNodeMultipliers_1.currentNodeMults.CrimeExpGain, false);
    return processWorkStats(person, gains);
}
/** @returns faction rep rate per cycle */
const calculateFactionRep = (person, type, favor) => {
    const repFormulas = {
        [_enums_1.FactionWorkType.hacking]: reputation_1.getHackingWorkRepGain,
        [_enums_1.FactionWorkType.field]: reputation_1.getFactionFieldWorkRepGain,
        [_enums_1.FactionWorkType.security]: reputation_1.getFactionSecurityWorkRepGain,
    };
    return repFormulas[type](person, favor);
};
exports.calculateFactionRep = calculateFactionRep;
/** @returns per-cycle WorkStats */
function calculateFactionExp(person, type) {
    return processWorkStats(person, (0, WorkStats_1.scaleWorkStats)((0, WorkStats_1.multWorkStats)(exports.FactionWorkStats[type], person.mults), BitNodeMultipliers_1.currentNodeMults.FactionWorkExpGain / gameCPS));
}
/** Calculate cost for a class */
function calculateCost(classs, location) {
    const serverMeta = servers_1.serverMetadata.find((s) => s.specialName === location.name);
    const server = (0, AllServers_1.GetServer)(serverMeta ? serverMeta.hostname : "");
    const discount = server?.backdoorInstalled ? 0.9 : 1;
    return classs.earnings.money * location.costMult * discount;
}
/** @returns per-cycle WorkStats */
function calculateClassEarnings(person, type, locationName) {
    const hashManager = _player_1.Player.hashManager;
    const classs = ClassWork_1.Classes[type];
    const location = Locations_1.Locations[locationName];
    const hashMult = (0, EnumHelper_1.isMember)("GymType", type) ? hashManager.getTrainingMult() : hashManager.getStudyMult();
    const earnings = (0, WorkStats_1.multWorkStats)((0, WorkStats_1.scaleWorkStats)(classs.earnings, (location.expMult / gameCPS) * hashMult, false), person.mults);
    earnings.money = calculateCost(classs, location) / gameCPS;
    return processWorkStats(person, earnings);
}
/** @returns per-cycle WorkStats */
const calculateCompanyWorkStats = (worker, company, companyPosition, favor) => {
    // If player has SF-11, calculate salary multiplier from favor
    const favorMult = isNaN(favor) ? 1 : 1 + favor / 100;
    const bn11Mult = _player_1.Player.activeSourceFileLvl(11) > 0 ? favorMult : 1;
    const gains = (0, WorkStats_1.scaleWorkStats)((0, WorkStats_1.multWorkStats)({
        money: companyPosition.baseSalary * company.salaryMultiplier * bn11Mult * BitNodeMultipliers_1.currentNodeMults.CompanyWorkMoney,
        hackExp: companyPosition.hackingExpGain,
        strExp: companyPosition.strengthExpGain,
        defExp: companyPosition.defenseExpGain,
        dexExp: companyPosition.dexterityExpGain,
        agiExp: companyPosition.agilityExpGain,
        chaExp: companyPosition.charismaExpGain,
    }, worker.mults, worker.mults.work_money), company.expMultiplier * BitNodeMultipliers_1.currentNodeMults.CompanyWorkExpGain, false);
    const jobPerformance = companyPosition.calculateJobPerformance(worker);
    gains.reputation = jobPerformance * worker.mults.company_rep * favorMult * BitNodeMultipliers_1.currentNodeMults.CompanyWorkRepGain;
    return processWorkStats(worker, gains);
};
exports.calculateCompanyWorkStats = calculateCompanyWorkStats;
