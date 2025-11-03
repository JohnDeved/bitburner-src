"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delayedCondition = exports.everyCondition = exports.someCondition = exports.notCondition = exports.unsatisfiable = exports.haveFile = exports.haveSomeSourceFile = exports.haveSourceFile = exports.inBitNode = exports.haveBladeburnerRank = exports.totalHacknetLevels = exports.totalHacknetCores = exports.totalHacknetRam = exports.locatedInSomeCity = exports.locatedInCity = exports.haveKilledPeople = exports.haveKarma = exports.haveCombatSkills = exports.haveSkill = exports.haveMoney = exports.haveAugmentations = exports.notEmployedBy = exports.executiveEmployee = exports.haveJobTitle = exports.haveCompanyRep = exports.employedBy = exports.haveBackdooredServer = void 0;
const _enums_1 = require("@enums");
const Server_1 = require("../Server/Server");
const AllServers_1 = require("../Server/AllServers");
const HacknetServer_1 = require("../Hacknet/HacknetServer");
const Companies_1 = require("../Company/Companies");
const formatNumber_1 = require("../ui/formatNumber");
const utils_1 = require("../Company/utils");
const haveBackdooredServer = (hostname) => ({
    toString() {
        return `Backdoor access to ${hostname} server`;
    },
    toJSON() {
        return { type: "backdoorInstalled", server: hostname };
    },
    isSatisfied() {
        const server = (0, AllServers_1.GetServer)(hostname);
        if (!(server instanceof Server_1.Server)) {
            throw new Error(`${hostname} should be a normal server`);
        }
        return server.backdoorInstalled;
    },
});
exports.haveBackdooredServer = haveBackdooredServer;
const employedBy = (companyName) => ({
    toString() {
        return `Employed at ${companyName}`;
    },
    toJSON() {
        return { type: "employedBy", company: companyName };
    },
    isSatisfied(p) {
        return Object.hasOwn(p.jobs, companyName);
    },
});
exports.employedBy = employedBy;
const haveCompanyRep = (companyName, rep) => ({
    toString() {
        return `${(0, formatNumber_1.formatReputation)((0, utils_1.calculateEffectiveRequiredReputation)(companyName, rep))} reputation with ${companyName}`;
    },
    toJSON() {
        return {
            type: "companyReputation",
            company: companyName,
            reputation: (0, utils_1.calculateEffectiveRequiredReputation)(companyName, rep),
        };
    },
    isSatisfied() {
        const company = Companies_1.Companies[companyName];
        if (!company)
            return false;
        return company.playerReputation >= (0, utils_1.calculateEffectiveRequiredReputation)(companyName, rep);
    },
});
exports.haveCompanyRep = haveCompanyRep;
const haveJobTitle = (jobTitle) => ({
    toString() {
        return `Employed as a ${jobTitle}`;
    },
    toJSON() {
        return { type: "jobTitle", jobTitle: jobTitle };
    },
    isSatisfied(p) {
        const allPositions = Object.values(p.jobs);
        return allPositions.includes(jobTitle);
    },
});
exports.haveJobTitle = haveJobTitle;
const executiveEmployee = () => ({
    ...(0, exports.someCondition)([_enums_1.JobName.software7, _enums_1.JobName.business4, _enums_1.JobName.business5].map((jobTitle) => (0, exports.haveJobTitle)(jobTitle))),
    toString() {
        return `CTO, CFO, or CEO of a company`;
    },
});
exports.executiveEmployee = executiveEmployee;
const notEmployedBy = (companyName) => ({
    ...(0, exports.notCondition)((0, exports.employedBy)(companyName)),
    toString() {
        return `Not working for the ${companyName}`;
    },
});
exports.notEmployedBy = notEmployedBy;
const haveAugmentations = (n) => ({
    toString() {
        return `${n || "No"} augmentations installed`;
    },
    toJSON() {
        return { type: "numAugmentations", numAugmentations: n };
    },
    isSatisfied(p) {
        if (n === 0) {
            const augs = [...p.augmentations, ...p.queuedAugmentations].filter((a) => a.name !== _enums_1.AugmentationName.NeuroFluxGovernor);
            return augs.length === 0;
        }
        return p.augmentations.length >= n;
    },
});
exports.haveAugmentations = haveAugmentations;
const haveMoney = (n) => ({
    toString() {
        return `Have ${(0, formatNumber_1.formatMoney)(n)}`;
    },
    toJSON() {
        return { type: "money", money: n };
    },
    isSatisfied(p) {
        return p.money >= n;
    },
});
exports.haveMoney = haveMoney;
const haveSkill = (skill, n) => ({
    toString() {
        return `${capitalize(skill)} level ${n}`;
    },
    toJSON() {
        return { type: "skills", skills: { [skill]: n } };
    },
    isSatisfied(p) {
        return p.skills[skill] >= n;
    },
});
exports.haveSkill = haveSkill;
const haveCombatSkills = (n) => ({
    ...(0, exports.everyCondition)(["strength", "defense", "dexterity", "agility"].map((s) => (0, exports.haveSkill)(s, n))),
    toString() {
        return `All combat skills level ${n}`;
    },
    toJSON() {
        return { type: "skills", skills: { strength: n, defense: n, dexterity: n, agility: n } };
    },
});
exports.haveCombatSkills = haveCombatSkills;
const haveKarma = (n) => ({
    toString() {
        if (n < -1000)
            return "An extensive criminal record";
        else if (n < -40)
            return "A criminal reputation";
        else if (n < -20)
            return "A disregard for the law";
        else if (n < -10)
            return "A history of violence";
        else
            return "Street cred";
    },
    toJSON() {
        return { type: "karma", karma: n };
    },
    isSatisfied(p) {
        return p.karma <= n;
    },
});
exports.haveKarma = haveKarma;
const haveKilledPeople = (n) => ({
    toString() {
        return `${n} people killed`;
    },
    toJSON() {
        return { type: "numPeopleKilled", numPeopleKilled: n };
    },
    isSatisfied(p) {
        return p.numPeopleKilled >= n;
    },
});
exports.haveKilledPeople = haveKilledPeople;
const locatedInCity = (city) => ({
    toString() {
        return `Located in ${city}`;
    },
    toJSON() {
        return { type: "city", city: city };
    },
    isSatisfied(p) {
        return p.city === city;
    },
});
exports.locatedInCity = locatedInCity;
const locatedInSomeCity = (...cities) => ({
    ...(0, exports.someCondition)(cities.map((city) => (0, exports.locatedInCity)(city))),
    toString() {
        return `Located in ${joinList(cities)}`;
    },
});
exports.locatedInSomeCity = locatedInSomeCity;
const totalHacknetRam = (n) => ({
    toString() {
        return `Total Hacknet RAM of ${(0, formatNumber_1.formatRam)(n)}`;
    },
    toJSON() {
        return { type: "hacknetRAM", hacknetRAM: n };
    },
    isSatisfied(p) {
        let total = 0;
        for (const node of iterateHacknet(p)) {
            total += node.ram;
            if (total >= n)
                return true;
        }
        return false;
    },
});
exports.totalHacknetRam = totalHacknetRam;
const totalHacknetCores = (n) => ({
    toString() {
        return `Total Hacknet cores of ${n}`;
    },
    toJSON() {
        return { type: "hacknetCores", hacknetCores: n };
    },
    isSatisfied(p) {
        let total = 0;
        for (const node of iterateHacknet(p)) {
            total += node.cores;
            if (total >= n)
                return true;
        }
        return false;
    },
});
exports.totalHacknetCores = totalHacknetCores;
const totalHacknetLevels = (n) => ({
    toString() {
        return `Total Hacknet levels of ${n}`;
    },
    toJSON() {
        return { type: "hacknetLevels", hacknetLevels: n };
    },
    isSatisfied(p) {
        let total = 0;
        for (const node of iterateHacknet(p)) {
            total += node.level;
            if (total >= n)
                return true;
        }
        return false;
    },
});
exports.totalHacknetLevels = totalHacknetLevels;
const haveBladeburnerRank = (n) => ({
    toString() {
        return `Rank ${n} in the Bladeburner Division`;
    },
    toJSON() {
        return { type: "bladeburnerRank", bladeburnerRank: n };
    },
    isSatisfied(p) {
        const rank = p.bladeburner?.rank || 0;
        return rank >= n;
    },
});
exports.haveBladeburnerRank = haveBladeburnerRank;
const inBitNode = (n) => ({
    toString() {
        return `In BitNode ${n}`;
    },
    toJSON() {
        return { type: "bitNodeN", bitNodeN: n };
    },
    isSatisfied(p) {
        return p.bitNodeN === n;
    },
});
exports.inBitNode = inBitNode;
const haveSourceFile = (n) => ({
    toString() {
        return `In BitNode ${n} or have SourceFile ${n}`;
    },
    toJSON() {
        return {
            type: "someCondition",
            conditions: [
                { type: "bitNodeN", bitNodeN: n },
                { type: "sourceFile", sourceFile: n },
            ],
        };
    },
    isSatisfied(p) {
        return p.bitNodeN === n || p.activeSourceFileLvl(n) > 0;
    },
});
exports.haveSourceFile = haveSourceFile;
const haveSomeSourceFile = (...nodeNums) => ({
    ...(0, exports.someCondition)(nodeNums.map((n) => (0, exports.haveSourceFile)(n))),
    toString() {
        return `In BitNode ${joinList(nodeNums)} or have SourceFile ${joinList(nodeNums)}`;
    },
});
exports.haveSomeSourceFile = haveSomeSourceFile;
const haveFile = (fileName) => ({
    toString() {
        return `Have the file '${fileName}'`;
    },
    toJSON() {
        return { type: "file", file: fileName };
    },
    isSatisfied(p) {
        const homeComputer = p.getHomeComputer();
        return homeComputer.messages.includes(fileName);
    },
});
exports.haveFile = haveFile;
exports.unsatisfiable = {
    toString() {
        return "(unsatisfiable)";
    },
    toJSON() {
        return { type: "someCondition", conditions: [] };
    },
    isSatisfied() {
        return false;
    },
};
const notCondition = (condition) => ({
    toString() {
        return `Not ${condition.toString()}`;
    },
    toJSON() {
        return { type: "not", condition: condition.toJSON() };
    },
    isSatisfied(p) {
        return !condition.isSatisfied(p);
    },
});
exports.notCondition = notCondition;
const someCondition = (conditions) => ({
    type: "someCondition",
    toString() {
        return joinList(conditions.map((c) => c.toString()));
    },
    toJSON() {
        return { type: "someCondition", conditions: conditions.map((c) => c.toJSON()) };
    },
    isSatisfied(p) {
        return conditions.some((c) => c.isSatisfied(p));
    },
    *[Symbol.iterator]() {
        for (const cond of conditions) {
            if ("type" in cond && cond.type === "someCondition") {
                // automatically flatten nested OR lists
                yield* cond;
            }
            else {
                yield cond;
            }
        }
    },
});
exports.someCondition = someCondition;
const everyCondition = (conditions) => ({
    type: "everyCondition",
    toString() {
        return joinList(conditions.map((c) => c.toString()), "and");
    },
    toJSON() {
        return { type: "everyCondition", conditions: conditions.map((c) => c.toJSON()) };
    },
    isSatisfied(p) {
        return conditions.every((c) => c.isSatisfied(p));
    },
    *[Symbol.iterator]() {
        for (const cond of conditions) {
            if ("type" in cond && cond.type === "everyCondition") {
                // automatically flatten nested AND lists
                yield* cond;
            }
            else {
                yield cond;
            }
        }
    },
});
exports.everyCondition = everyCondition;
const delayedCondition = (arg) => ({
    toString: () => arg().toString(),
    toJSON: () => arg().toJSON(),
    isSatisfied: (p) => arg().isSatisfied(p),
});
exports.delayedCondition = delayedCondition;
/* helpers */
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
function joinList(list, conjunction = "or", separator = ", ") {
    if (list.length < 3) {
        return list.join(` ${conjunction} `);
    }
    list = [...list];
    list[list.length - 1] = `${conjunction} ${list[list.length - 1]}`;
    return list.join(`${separator}`);
}
function* iterateHacknet(p) {
    for (let i = 0; i < p.hacknetNodes.length; ++i) {
        const v = p.hacknetNodes[i];
        if (typeof v === "string") {
            const hserver = (0, AllServers_1.GetServer)(v);
            if (hserver === null || !(hserver instanceof HacknetServer_1.HacknetServer))
                throw new Error("player hacknet server was not HacknetServer");
            yield {
                ram: hserver.maxRam,
                cores: hserver.cores,
                level: hserver.level,
            };
        }
        else {
            yield {
                ram: v.ram,
                cores: v.cores,
                level: v.level,
            };
        }
    }
}
