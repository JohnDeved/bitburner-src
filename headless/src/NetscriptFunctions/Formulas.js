"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetscriptFormulas = NetscriptFormulas;
const _player_1 = require("@player");
const grow_1 = require("../Server/formulas/grow");
const ServerHelpers_1 = require("../Server/ServerHelpers");
const HacknetNodes_1 = require("../Hacknet/formulas/HacknetNodes");
const HacknetServers_1 = require("../Hacknet/formulas/HacknetServers");
const Constants_1 = require("../Hacknet/data/Constants");
const skill_1 = require("../PersonObjects/formulas/skill");
const Hacking_1 = require("../Hacking");
const _enums_1 = require("@enums");
const formulas_1 = require("../Gang/formulas/formulas");
const favor_1 = require("../Faction/formulas/favor");
const donation_1 = require("../Faction/formulas/donation");
const APIWrapper_1 = require("../Netscript/APIWrapper");
const NetscriptHelpers_1 = require("../Netscript/NetscriptHelpers");
const Formulas_1 = require("../Work/Formulas");
const Formulas_2 = require("../Work/Formulas");
const Companies_1 = require("../Company/Companies");
const Formulas_3 = require("../Work/Formulas");
const Formulas_4 = require("../Work/Formulas");
const Multipliers_1 = require("../PersonObjects/Multipliers");
const EnumHelper_1 = require("../utils/EnumHelper");
const CompanyPositions_1 = require("../Company/CompanyPositions");
const Skills_1 = require("../Bladeburner/data/Skills");
const Crimes_1 = require("../Crime/Crimes");
const Share_1 = require("../NetworkShare/Share");
function NetscriptFormulas() {
    const checkFormulasAccess = function (ctx) {
        if (!_player_1.Player.hasProgram(_enums_1.CompletedProgramName.formulas)) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Requires Formulas.exe to run.`);
        }
    };
    const formulasFunctions = {
        mockServer: () => () => ({
            cpuCores: 0,
            ftpPortOpen: false,
            hasAdminRights: false,
            hostname: "",
            httpPortOpen: false,
            ip: "",
            isConnectedTo: false,
            maxRam: 0,
            organizationName: "",
            ramUsed: 0,
            smtpPortOpen: false,
            sqlPortOpen: false,
            sshPortOpen: false,
            purchasedByPlayer: false,
            backdoorInstalled: false,
            baseDifficulty: 0,
            hackDifficulty: 0,
            minDifficulty: 0,
            moneyAvailable: 0,
            moneyMax: 0,
            numOpenPortsRequired: 0,
            openPortCount: 0,
            requiredHackingSkill: 0,
            serverGrowth: 0,
        }),
        mockPlayer: () => () => ({
            // Person
            hp: { current: 0, max: 0 },
            skills: { hacking: 0, strength: 0, defense: 0, dexterity: 0, agility: 0, charisma: 0, intelligence: 0 },
            exp: { hacking: 0, strength: 0, defense: 0, dexterity: 0, agility: 0, charisma: 0, intelligence: 0 },
            mults: (0, Multipliers_1.defaultMultipliers)(),
            city: _enums_1.CityName.Sector12,
            // Player-specific
            numPeopleKilled: 0,
            money: 0,
            location: _enums_1.LocationName.TravelAgency,
            totalPlaytime: 0,
            jobs: {},
            factions: [],
            entropy: 0,
            karma: 0,
        }),
        mockPerson: () => () => ({
            hp: { current: 0, max: 0 },
            skills: { hacking: 0, strength: 0, defense: 0, dexterity: 0, agility: 0, charisma: 0, intelligence: 0 },
            exp: { hacking: 0, strength: 0, defense: 0, dexterity: 0, agility: 0, charisma: 0, intelligence: 0 },
            mults: (0, Multipliers_1.defaultMultipliers)(),
            city: _enums_1.CityName.Sector12,
        }),
        reputation: {
            calculateFavorToRep: (ctx) => (_favor) => {
                const favor = NetscriptHelpers_1.helpers.number(ctx, "favor", _favor);
                checkFormulasAccess(ctx);
                return (0, favor_1.favorToRep)(favor);
            },
            calculateRepToFavor: (ctx) => (_rep) => {
                const rep = NetscriptHelpers_1.helpers.number(ctx, "rep", _rep);
                checkFormulasAccess(ctx);
                return (0, favor_1.repToFavor)(rep);
            },
            repFromDonation: (ctx) => (_amount, _player) => {
                const amount = NetscriptHelpers_1.helpers.number(ctx, "amount", _amount);
                const person = NetscriptHelpers_1.helpers.person(ctx, _player);
                checkFormulasAccess(ctx);
                return (0, donation_1.repFromDonation)(amount, person);
            },
            donationForRep: (ctx) => (_reputation, _player) => {
                const reputation = NetscriptHelpers_1.helpers.number(ctx, "reputation", _reputation);
                const person = NetscriptHelpers_1.helpers.person(ctx, _player);
                checkFormulasAccess(ctx);
                return (0, donation_1.donationForRep)(reputation, person);
            },
            sharePower: (ctx) => (_threads, _cpuCores = 1) => {
                const threads = NetscriptHelpers_1.helpers.positiveInteger(ctx, "threads", _threads);
                const cpuCores = NetscriptHelpers_1.helpers.positiveInteger(ctx, "cpuCores", _cpuCores);
                checkFormulasAccess(ctx);
                return (0, Share_1.calculateShareBonus)((0, Share_1.calculateEffectiveSharedThreads)(threads, cpuCores));
            },
        },
        skills: {
            calculateSkill: (ctx) => (_exp, _mult = 1) => {
                const exp = NetscriptHelpers_1.helpers.number(ctx, "exp", _exp);
                const mult = NetscriptHelpers_1.helpers.number(ctx, "mult", _mult);
                checkFormulasAccess(ctx);
                return (0, skill_1.calculateSkill)(exp, mult);
            },
            calculateExp: (ctx) => (_skill, _mult = 1) => {
                const skill = NetscriptHelpers_1.helpers.number(ctx, "skill", _skill);
                const mult = NetscriptHelpers_1.helpers.number(ctx, "mult", _mult);
                checkFormulasAccess(ctx);
                return (0, skill_1.calculateExp)(skill, mult);
            },
        },
        hacking: {
            hackChance: (ctx) => (_server, _player) => {
                const server = NetscriptHelpers_1.helpers.server(ctx, _server);
                const person = NetscriptHelpers_1.helpers.person(ctx, _player);
                checkFormulasAccess(ctx);
                return (0, Hacking_1.calculateHackingChance)(server, person);
            },
            hackExp: (ctx) => (_server, _player) => {
                const server = NetscriptHelpers_1.helpers.server(ctx, _server);
                const person = NetscriptHelpers_1.helpers.person(ctx, _player);
                checkFormulasAccess(ctx);
                return (0, Hacking_1.calculateHackingExpGain)(server, person);
            },
            hackPercent: (ctx) => (_server, _player) => {
                const server = NetscriptHelpers_1.helpers.server(ctx, _server);
                const person = NetscriptHelpers_1.helpers.person(ctx, _player);
                checkFormulasAccess(ctx);
                return (0, Hacking_1.calculatePercentMoneyHacked)(server, person);
            },
            /* TODO 2.3: Remove growPercent, add growMultiplier function?
            Much better name given the output. Not sure if removedFunction error dialog/editing script will be too annoying.
            Changing the function name also allows reordering params as server, player, etc. like other formulas functions */
            growPercent: (ctx) => (_server, _threads, _player, _cores = 1) => {
                const server = NetscriptHelpers_1.helpers.server(ctx, _server);
                const person = NetscriptHelpers_1.helpers.person(ctx, _player);
                const threads = NetscriptHelpers_1.helpers.number(ctx, "threads", _threads);
                const cores = NetscriptHelpers_1.helpers.number(ctx, "cores", _cores);
                checkFormulasAccess(ctx);
                return (0, grow_1.calculateServerGrowth)(server, threads, person, cores);
            },
            growThreads: (ctx) => (_server, _player, _targetMoney, _cores = 1) => {
                const server = NetscriptHelpers_1.helpers.server(ctx, _server);
                const player = NetscriptHelpers_1.helpers.person(ctx, _player);
                const targetMoney = NetscriptHelpers_1.helpers.number(ctx, "targetMoney", _targetMoney);
                const startMoney = NetscriptHelpers_1.helpers.number(ctx, "server.moneyAvailable", server.moneyAvailable);
                const cores = NetscriptHelpers_1.helpers.number(ctx, "cores", _cores);
                checkFormulasAccess(ctx);
                return (0, ServerHelpers_1.numCycleForGrowthCorrected)(server, targetMoney, startMoney, cores, player);
            },
            growAmount: (ctx) => (_server, _player, _threads, _cores = 1) => {
                const server = NetscriptHelpers_1.helpers.server(ctx, _server);
                const person = NetscriptHelpers_1.helpers.person(ctx, _player);
                const threads = NetscriptHelpers_1.helpers.number(ctx, "threads", _threads);
                const cores = NetscriptHelpers_1.helpers.number(ctx, "cores", _cores);
                checkFormulasAccess(ctx);
                return (0, grow_1.calculateGrowMoney)(server, threads, person, cores);
            },
            hackTime: (ctx) => (_server, _player) => {
                const server = NetscriptHelpers_1.helpers.server(ctx, _server);
                const person = NetscriptHelpers_1.helpers.person(ctx, _player);
                checkFormulasAccess(ctx);
                return (0, Hacking_1.calculateHackingTime)(server, person) * 1000;
            },
            growTime: (ctx) => (_server, _player) => {
                const server = NetscriptHelpers_1.helpers.server(ctx, _server);
                const person = NetscriptHelpers_1.helpers.person(ctx, _player);
                checkFormulasAccess(ctx);
                return (0, Hacking_1.calculateGrowTime)(server, person) * 1000;
            },
            weakenTime: (ctx) => (_server, _player) => {
                const server = NetscriptHelpers_1.helpers.server(ctx, _server);
                const person = NetscriptHelpers_1.helpers.person(ctx, _player);
                checkFormulasAccess(ctx);
                return (0, Hacking_1.calculateWeakenTime)(server, person) * 1000;
            },
        },
        hacknetNodes: {
            moneyGainRate: (ctx) => (_level, _ram, _cores, _mult = 1) => {
                const level = NetscriptHelpers_1.helpers.number(ctx, "level", _level);
                const ram = NetscriptHelpers_1.helpers.number(ctx, "ram", _ram);
                const cores = NetscriptHelpers_1.helpers.number(ctx, "cores", _cores);
                const mult = NetscriptHelpers_1.helpers.number(ctx, "mult", _mult);
                checkFormulasAccess(ctx);
                return (0, HacknetNodes_1.calculateMoneyGainRate)(level, ram, cores, mult);
            },
            levelUpgradeCost: (ctx) => (_startingLevel, _extraLevels = 1, _costMult = 1) => {
                const startingLevel = NetscriptHelpers_1.helpers.number(ctx, "startingLevel", _startingLevel);
                const extraLevels = NetscriptHelpers_1.helpers.number(ctx, "extraLevels", _extraLevels);
                const costMult = NetscriptHelpers_1.helpers.number(ctx, "costMult", _costMult);
                checkFormulasAccess(ctx);
                return (0, HacknetNodes_1.calculateLevelUpgradeCost)(startingLevel, extraLevels, costMult);
            },
            ramUpgradeCost: (ctx) => (_startingRam, _extraLevels = 1, _costMult = 1) => {
                const startingRam = NetscriptHelpers_1.helpers.number(ctx, "startingRam", _startingRam);
                const extraLevels = NetscriptHelpers_1.helpers.number(ctx, "extraLevels", _extraLevels);
                const costMult = NetscriptHelpers_1.helpers.number(ctx, "costMult", _costMult);
                checkFormulasAccess(ctx);
                return (0, HacknetNodes_1.calculateRamUpgradeCost)(startingRam, extraLevels, costMult);
            },
            coreUpgradeCost: (ctx) => (_startingCore, _extraCores = 1, _costMult = 1) => {
                const startingCore = NetscriptHelpers_1.helpers.number(ctx, "startingCore", _startingCore);
                const extraCores = NetscriptHelpers_1.helpers.number(ctx, "extraCores", _extraCores);
                const costMult = NetscriptHelpers_1.helpers.number(ctx, "costMult", _costMult);
                checkFormulasAccess(ctx);
                return (0, HacknetNodes_1.calculateCoreUpgradeCost)(startingCore, extraCores, costMult);
            },
            hacknetNodeCost: (ctx) => (_n, _mult) => {
                const n = NetscriptHelpers_1.helpers.number(ctx, "n", _n);
                const mult = NetscriptHelpers_1.helpers.number(ctx, "mult", _mult);
                checkFormulasAccess(ctx);
                return (0, HacknetNodes_1.calculateNodeCost)(n, mult);
            },
            constants: (ctx) => () => {
                checkFormulasAccess(ctx);
                return Object.assign({}, Constants_1.HacknetNodeConstants);
            },
        },
        hacknetServers: {
            hashGainRate: (ctx) => (_level, _ramUsed, _maxRam, _cores, _mult = 1) => {
                const level = NetscriptHelpers_1.helpers.number(ctx, "level", _level);
                const ramUsed = NetscriptHelpers_1.helpers.number(ctx, "ramUsed", _ramUsed);
                const maxRam = NetscriptHelpers_1.helpers.number(ctx, "maxRam", _maxRam);
                const cores = NetscriptHelpers_1.helpers.number(ctx, "cores", _cores);
                const mult = NetscriptHelpers_1.helpers.number(ctx, "mult", _mult);
                checkFormulasAccess(ctx);
                return (0, HacknetServers_1.calculateHashGainRate)(level, ramUsed, maxRam, cores, mult);
            },
            levelUpgradeCost: (ctx) => (_startingLevel, _extraLevels = 1, _costMult = 1) => {
                const startingLevel = NetscriptHelpers_1.helpers.number(ctx, "startingLevel", _startingLevel);
                const extraLevels = NetscriptHelpers_1.helpers.number(ctx, "extraLevels", _extraLevels);
                const costMult = NetscriptHelpers_1.helpers.number(ctx, "costMult", _costMult);
                checkFormulasAccess(ctx);
                return (0, HacknetServers_1.calculateLevelUpgradeCost)(startingLevel, extraLevels, costMult);
            },
            ramUpgradeCost: (ctx) => (_startingRam, _extraLevels = 1, _costMult = 1) => {
                const startingRam = NetscriptHelpers_1.helpers.number(ctx, "startingRam", _startingRam);
                const extraLevels = NetscriptHelpers_1.helpers.number(ctx, "extraLevels", _extraLevels);
                const costMult = NetscriptHelpers_1.helpers.number(ctx, "costMult", _costMult);
                checkFormulasAccess(ctx);
                return (0, HacknetServers_1.calculateRamUpgradeCost)(startingRam, extraLevels, costMult);
            },
            coreUpgradeCost: (ctx) => (_startingCore, _extraCores = 1, _costMult = 1) => {
                const startingCore = NetscriptHelpers_1.helpers.number(ctx, "startingCore", _startingCore);
                const extraCores = NetscriptHelpers_1.helpers.number(ctx, "extraCores", _extraCores);
                const costMult = NetscriptHelpers_1.helpers.number(ctx, "costMult", _costMult);
                checkFormulasAccess(ctx);
                return (0, HacknetServers_1.calculateCoreUpgradeCost)(startingCore, extraCores, costMult);
            },
            cacheUpgradeCost: (ctx) => (_startingCache, _extraCache = 1) => {
                const startingCache = NetscriptHelpers_1.helpers.number(ctx, "startingCache", _startingCache);
                const extraCache = NetscriptHelpers_1.helpers.number(ctx, "extraCache", _extraCache);
                checkFormulasAccess(ctx);
                return (0, HacknetServers_1.calculateCacheUpgradeCost)(startingCache, extraCache);
            },
            hashUpgradeCost: (ctx) => (_upgName, _level) => {
                const upgName = (0, EnumHelper_1.getEnumHelper)("HashUpgradeEnum").nsGetMember(ctx, _upgName);
                const level = NetscriptHelpers_1.helpers.number(ctx, "level", _level);
                checkFormulasAccess(ctx);
                const upg = _player_1.Player.hashManager.getUpgrade(upgName);
                if (!upg) {
                    throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid Hash Upgrade: ${upgName}`);
                }
                return upg.getCost(level);
            },
            hacknetServerCost: (ctx) => (_n, _mult = 1) => {
                const n = NetscriptHelpers_1.helpers.number(ctx, "n", _n);
                const mult = NetscriptHelpers_1.helpers.number(ctx, "mult", _mult);
                checkFormulasAccess(ctx);
                return (0, HacknetServers_1.calculateServerCost)(n, mult);
            },
            constants: (ctx) => () => {
                checkFormulasAccess(ctx);
                return Object.assign({}, Constants_1.HacknetServerConstants);
            },
        },
        gang: {
            wantedPenalty: (ctx) => (_gang) => {
                const gang = NetscriptHelpers_1.helpers.gang(ctx, _gang);
                checkFormulasAccess(ctx);
                return (0, formulas_1.calculateWantedPenalty)(gang);
            },
            respectGain: (ctx) => (_gang, _member, _task) => {
                const gang = NetscriptHelpers_1.helpers.gang(ctx, _gang);
                const member = NetscriptHelpers_1.helpers.gangMember(ctx, _member);
                const task = NetscriptHelpers_1.helpers.gangTask(ctx, _task);
                checkFormulasAccess(ctx);
                return (0, formulas_1.calculateRespectGain)(gang, member, task);
            },
            wantedLevelGain: (ctx) => (_gang, _member, _task) => {
                const gang = NetscriptHelpers_1.helpers.gang(ctx, _gang);
                const member = NetscriptHelpers_1.helpers.gangMember(ctx, _member);
                const task = NetscriptHelpers_1.helpers.gangTask(ctx, _task);
                checkFormulasAccess(ctx);
                return (0, formulas_1.calculateWantedLevelGain)(gang, member, task);
            },
            moneyGain: (ctx) => (_gang, _member, _task) => {
                const gang = NetscriptHelpers_1.helpers.gang(ctx, _gang);
                const member = NetscriptHelpers_1.helpers.gangMember(ctx, _member);
                const task = NetscriptHelpers_1.helpers.gangTask(ctx, _task);
                checkFormulasAccess(ctx);
                return (0, formulas_1.calculateMoneyGain)(gang, member, task);
            },
            ascensionPointsGain: (ctx) => (_exp) => {
                const exp = NetscriptHelpers_1.helpers.number(ctx, "exp", _exp);
                checkFormulasAccess(ctx);
                return (0, formulas_1.calculateAscensionPointsGain)(exp);
            },
            ascensionMultiplier: (ctx) => (_points) => {
                const points = NetscriptHelpers_1.helpers.number(ctx, "points", _points);
                checkFormulasAccess(ctx);
                return (0, formulas_1.calculateAscensionMult)(points);
            },
        },
        work: {
            crimeSuccessChance: (ctx) => (_person, _crimeType) => {
                checkFormulasAccess(ctx);
                const person = NetscriptHelpers_1.helpers.person(ctx, _person);
                const crime = Crimes_1.Crimes[(0, EnumHelper_1.getEnumHelper)("CrimeType").nsGetMember(ctx, _crimeType)];
                if (!crime) {
                    throw new Error(`Invalid crime type: ${_crimeType}`);
                }
                return crime.successRate(person);
            },
            crimeGains: (ctx) => (_person, _crimeType) => {
                checkFormulasAccess(ctx);
                const person = NetscriptHelpers_1.helpers.person(ctx, _person);
                const crime = Crimes_1.Crimes[(0, EnumHelper_1.getEnumHelper)("CrimeType").nsGetMember(ctx, _crimeType)];
                if (!crime) {
                    throw new Error(`Invalid crime type: ${_crimeType}`);
                }
                return (0, Formulas_1.calculateCrimeWorkStats)(person, crime);
            },
            gymGains: (ctx) => (_person, _classType, _locationName) => {
                checkFormulasAccess(ctx);
                const person = NetscriptHelpers_1.helpers.person(ctx, _person);
                const classType = (0, EnumHelper_1.getEnumHelper)("GymType").nsGetMember(ctx, _classType);
                const locationName = (0, EnumHelper_1.getEnumHelper)("LocationName").nsGetMember(ctx, _locationName);
                return (0, Formulas_3.calculateClassEarnings)(person, classType, locationName);
            },
            universityGains: (ctx) => (_person, _classType, _locationName) => {
                checkFormulasAccess(ctx);
                const person = NetscriptHelpers_1.helpers.person(ctx, _person);
                const classType = (0, EnumHelper_1.getEnumHelper)("UniversityClassType").nsGetMember(ctx, _classType);
                const locationName = (0, EnumHelper_1.getEnumHelper)("LocationName").nsGetMember(ctx, _locationName);
                return (0, Formulas_3.calculateClassEarnings)(person, classType, locationName);
            },
            factionGains: (ctx) => (_player, _workType, _favor) => {
                checkFormulasAccess(ctx);
                const player = NetscriptHelpers_1.helpers.person(ctx, _player);
                const workType = (0, EnumHelper_1.getEnumHelper)("FactionWorkType").nsGetMember(ctx, _workType);
                const favor = NetscriptHelpers_1.helpers.number(ctx, "favor", _favor);
                const exp = (0, Formulas_4.calculateFactionExp)(player, workType);
                const rep = (0, Formulas_4.calculateFactionRep)(player, workType, favor);
                exp.reputation = rep;
                return exp;
            },
            companyGains: (ctx) => (_person, _companyName, _positionName, _favor) => {
                checkFormulasAccess(ctx);
                const person = NetscriptHelpers_1.helpers.person(ctx, _person);
                const companyName = (0, EnumHelper_1.getEnumHelper)("CompanyName").nsGetMember(ctx, _companyName);
                const company = Companies_1.Companies[companyName];
                const positionName = (0, EnumHelper_1.getEnumHelper)("JobName").nsGetMember(ctx, _positionName);
                const position = CompanyPositions_1.CompanyPositions[positionName];
                const favor = NetscriptHelpers_1.helpers.number(ctx, "favor", _favor);
                return (0, Formulas_2.calculateCompanyWorkStats)(person, company, position, favor);
            },
        },
        bladeburner: {
            skillMaxUpgradeCount: (ctx) => (_name, _level, _skillPoints) => {
                checkFormulasAccess(ctx);
                const name = (0, EnumHelper_1.getEnumHelper)("BladeburnerSkillName").nsGetMember(ctx, _name, "name");
                const level = NetscriptHelpers_1.helpers.number(ctx, "level", _level);
                if (!Number.isFinite(level) || level < 0) {
                    throw new Error(`Level must be a finite, non-negative number. Its value is ${level}.`);
                }
                const skillPoints = NetscriptHelpers_1.helpers.number(ctx, "skillPoints", _skillPoints);
                if (!Number.isFinite(skillPoints) || skillPoints < 0) {
                    throw new Error(`SkillPoints must be a finite, non-negative number. Its value is ${skillPoints}.`);
                }
                const skill = Skills_1.Skills[name];
                if (level >= skill.maxLvl) {
                    return 0;
                }
                if (skillPoints === 0) {
                    return 0;
                }
                return skill.calculateMaxUpgradeCount(level, skillPoints);
            },
        },
    };
    // Removed functions
    (0, APIWrapper_1.setRemovedFunctions)(formulasFunctions.work, {
        classGains: { version: "2.2.0", replacement: "formulas.work.universityGains or formulas.work.gymGains" },
    });
    return formulasFunctions;
}
