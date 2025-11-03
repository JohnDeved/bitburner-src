"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficeSpace = void 0;
const _enums_1 = require("@enums");
const corpConstants = __importStar(require("./data/Constants"));
const JSONReviver_1 = require("../utils/JSONReviver");
const getRandomIntInclusive_1 = require("../utils/helpers/getRandomIntInclusive");
const Record_1 = require("../Types/Record");
const throwIfReachable_1 = require("../utils/helpers/throwIfReachable");
class OfficeSpace {
    constructor(params = null) {
        this.city = _enums_1.CityName.Sector12;
        this.size = 1;
        this.maxEnergy = 100;
        this.maxMorale = 100;
        this.avgEnergy = 75;
        this.avgMorale = 75;
        this.avgIntelligence = 75;
        this.avgCharisma = 75;
        this.avgCreativity = 75;
        this.avgEfficiency = 75;
        this.totalExperience = 0;
        this.numEmployees = 0;
        this.totalSalary = 0;
        this.autoTea = false;
        this.autoParty = false;
        this.teaPending = false;
        this.partyMult = 1;
        this.employeeProductionByJob = { total: 0, ...(0, Record_1.createEnumKeyedRecord)(_enums_1.CorpEmployeeJob, () => 0) };
        this.employeeJobs = (0, Record_1.createEnumKeyedRecord)(_enums_1.CorpEmployeeJob, () => 0);
        this.employeeNextJobs = (0, Record_1.createEnumKeyedRecord)(_enums_1.CorpEmployeeJob, () => 0);
        if (!params)
            return;
        this.city = params.city;
        this.size = params.size;
    }
    atCapacity() {
        return this.numEmployees >= this.size;
    }
    process(marketCycles = 1, corporation, industry) {
        // HRBuddy AutoRecruitment and Interning
        if (industry.hasResearch("HRBuddy-Recruitment") && !this.atCapacity()) {
            this.hireRandomEmployee(industry.hasResearch("HRBuddy-Training") ? _enums_1.CorpEmployeeJob.Intern : _enums_1.CorpEmployeeJob.Unassigned);
        }
        // Update employee jobs and job counts
        for (const [pos, jobCount] of Object.entries(this.employeeNextJobs)) {
            this.employeeJobs[pos] = jobCount;
        }
        // Process Office properties
        this.maxEnergy = 100;
        this.maxMorale = 100;
        if (industry.hasResearch("Go-Juice"))
            this.maxEnergy += 10;
        if (industry.hasResearch("Sti.mu"))
            this.maxMorale += 10;
        if (industry.hasResearch("AutoBrew"))
            this.autoTea = true;
        if (industry.hasResearch("AutoPartyManager"))
            this.autoParty = true;
        if (this.numEmployees > 0) {
            /** Multiplier for employee morale/energy based on company performance */
            let perfMult = 1.002;
            if (this.numEmployees >= 9) {
                perfMult = Math.pow(1 +
                    0.002 * Math.min(1 / 9, this.employeeJobs.Intern / this.numEmployees - 1 / 9) * 9 -
                    (corporation.funds < 0 && industry.lastCycleRevenue < industry.lastCycleExpenses ? 0.001 : 0), marketCycles);
            }
            // Flat reduction per cycle.
            // This does not cause a noticable decrease (it's only -.001% per cycle).
            const reduction = 0.002 * marketCycles;
            if (this.autoTea) {
                this.avgEnergy = this.maxEnergy;
            }
            else {
                // Tea gives a flat +2 to energy
                this.avgEnergy = (this.avgEnergy - reduction * Math.random()) * perfMult + (this.teaPending ? 2 : 0);
            }
            if (this.autoParty) {
                this.avgMorale = this.maxMorale;
            }
            else {
                // Each 10% multiplier gives an extra flat +1 to morale to make recovering from low morale easier.
                const increase = this.partyMult > 1 ? (this.partyMult - 1) * 10 : 0;
                this.avgMorale = ((this.avgMorale - reduction * Math.random()) * perfMult + increase) * this.partyMult;
            }
            this.avgEnergy = Math.max(Math.min(this.avgEnergy, this.maxEnergy), corpConstants.minEmployeeDecay);
            this.avgMorale = Math.max(Math.min(this.avgMorale, this.maxMorale), corpConstants.minEmployeeDecay);
            this.teaPending = false;
            this.partyMult = 1;
        }
        // Get experience increase; unassigned employees do not contribute, interning employees contribute 10x
        this.totalExperience +=
            0.0015 *
                marketCycles *
                (this.numEmployees -
                    this.employeeJobs[_enums_1.CorpEmployeeJob.Unassigned] +
                    this.employeeJobs[_enums_1.CorpEmployeeJob.Intern] * 9);
        this.calculateEmployeeProductivity(corporation, industry);
        if (this.numEmployees === 0) {
            this.totalSalary = 0;
        }
        else {
            this.totalSalary =
                corpConstants.employeeSalaryMultiplier *
                    marketCycles *
                    this.numEmployees *
                    (this.avgIntelligence +
                        this.avgCharisma +
                        this.totalExperience / this.numEmployees +
                        this.avgCreativity +
                        this.avgEfficiency);
        }
        return this.totalSalary;
    }
    calculateEmployeeProductivity(corporation, industry) {
        const effCre = this.avgCreativity * corporation.getEmployeeCreMultiplier() * industry.getEmployeeCreMultiplier(), effCha = this.avgCharisma * corporation.getEmployeeChaMult() * industry.getEmployeeChaMultiplier(), effInt = this.avgIntelligence * corporation.getEmployeeIntMult() * industry.getEmployeeIntMultiplier(), effEff = this.avgEfficiency * corporation.getEmployeeEffMult() * industry.getEmployeeEffMultiplier();
        const prodBase = this.avgMorale * this.avgEnergy * 1e-4;
        let total = 0;
        const exp = this.totalExperience / this.numEmployees || 0;
        for (const name of (0, Record_1.getRecordKeys)(this.employeeProductionByJob)) {
            let prodMult = 0;
            switch (name) {
                case _enums_1.CorpEmployeeJob.Operations:
                    prodMult = 0.6 * effInt + 0.1 * effCha + exp + 0.5 * effCre + effEff;
                    break;
                case _enums_1.CorpEmployeeJob.Engineer:
                    prodMult = effInt + 0.1 * effCha + 1.5 * exp + effEff;
                    break;
                case _enums_1.CorpEmployeeJob.Business:
                    prodMult = 0.4 * effInt + effCha + 0.5 * exp;
                    break;
                case _enums_1.CorpEmployeeJob.Management:
                    prodMult = 2 * effCha + exp + 0.2 * effCre + 0.7 * effEff;
                    break;
                case _enums_1.CorpEmployeeJob.RandD:
                    prodMult = 1.5 * effInt + 0.8 * exp + effCre + 0.5 * effEff;
                    break;
                case _enums_1.CorpEmployeeJob.Unassigned:
                case _enums_1.CorpEmployeeJob.Intern:
                case "total":
                    continue;
                default:
                    (0, throwIfReachable_1.throwIfReachable)(name);
            }
            this.employeeProductionByJob[name] = this.employeeJobs[name] * prodMult * prodBase;
            total += this.employeeProductionByJob[name];
        }
        this.employeeProductionByJob.total = total;
    }
    hireRandomEmployee(position) {
        if (this.atCapacity())
            return false;
        this.totalExperience += (0, getRandomIntInclusive_1.getRandomIntInclusive)(50, 100);
        this.avgMorale = (this.avgMorale * this.numEmployees + (0, getRandomIntInclusive_1.getRandomIntInclusive)(50, 100)) / (this.numEmployees + 1);
        this.avgEnergy = (this.avgEnergy * this.numEmployees + (0, getRandomIntInclusive_1.getRandomIntInclusive)(50, 100)) / (this.numEmployees + 1);
        this.avgIntelligence =
            (this.avgIntelligence * this.numEmployees + (0, getRandomIntInclusive_1.getRandomIntInclusive)(50, 100)) / (this.numEmployees + 1);
        this.avgCharisma =
            (this.avgCharisma * this.numEmployees + (0, getRandomIntInclusive_1.getRandomIntInclusive)(50, 100)) / (this.numEmployees + 1);
        this.avgCreativity =
            (this.avgCreativity * this.numEmployees + (0, getRandomIntInclusive_1.getRandomIntInclusive)(50, 100)) / (this.numEmployees + 1);
        this.avgEfficiency =
            (this.avgEfficiency * this.numEmployees + (0, getRandomIntInclusive_1.getRandomIntInclusive)(50, 100)) / (this.numEmployees + 1);
        ++this.numEmployees;
        ++this.employeeJobs[position];
        ++this.employeeNextJobs[position];
        return true;
    }
    autoAssignJob(job, target) {
        if (job === _enums_1.CorpEmployeeJob.Unassigned) {
            throw new Error("internal autoAssignJob function called with EmployeePositions.Unassigned");
        }
        const diff = target - this.employeeNextJobs[job];
        if (diff === 0)
            return true;
        // We are already at the desired number
        else if (diff <= this.employeeNextJobs[_enums_1.CorpEmployeeJob.Unassigned]) {
            // This covers both a negative diff (reducing the amount of employees in position) and a positive (increasing and using up unassigned employees)
            this.employeeNextJobs[_enums_1.CorpEmployeeJob.Unassigned] -= diff;
            this.employeeNextJobs[job] = target;
            return true;
        }
        return false;
    }
    getTeaCost() {
        return corpConstants.teaCostPerEmployee * this.numEmployees;
    }
    setTea() {
        if (!this.teaPending && !this.autoTea && this.numEmployees > 0) {
            this.teaPending = true;
            return true;
        }
        return false;
    }
    setParty(mult) {
        if (mult > 1 && this.partyMult === 1 && !this.autoParty && this.numEmployees > 0) {
            this.partyMult = mult;
            return true;
        }
        return false;
    }
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("OfficeSpace", this);
    }
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(OfficeSpace, value.data);
    }
}
exports.OfficeSpace = OfficeSpace;
JSONReviver_1.constructorsForReviver.OfficeSpace = OfficeSpace;
