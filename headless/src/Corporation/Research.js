"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Research = void 0;
class Research {
    constructor(p = null) {
        // Name of research. This will be used to identify researches in the Research Tree
        this.name = "AutoBrew";
        // How much scientific research it costs to unlock this
        this.cost = 0;
        // Description of what the Research does
        this.description = "";
        // All possible generic upgrades for the company, in the form of multipliers
        this.advertisingMult = 1;
        this.employeeChaMult = 1;
        this.employeeCreMult = 1;
        this.employeeEffMult = 1;
        this.employeeIntMult = 1;
        this.productionMult = 1;
        this.productProductionMult = 1;
        this.salesMult = 1;
        this.sciResearchMult = 1;
        this.storageMult = 1;
        if (!p)
            return;
        this.name = p.name;
        this.cost = p.cost;
        this.description = p.desc;
        this.advertisingMult = p.advertisingMult ?? 1;
        this.employeeChaMult = p.employeeChaMult ?? 1;
        this.employeeCreMult = p.employeeCreMult ?? 1;
        this.employeeEffMult = p.employeeEffMult ?? 1;
        this.employeeIntMult = p.employeeIntMult ?? 1;
        this.productionMult = p.productionMult ?? 1;
        this.productProductionMult = p.productProductionMult ?? 1;
        this.salesMult = p.salesMult ?? 1;
        this.sciResearchMult = p.sciResearchMult ?? 1;
        this.storageMult = p.storageMult ?? 1;
    }
}
exports.Research = Research;
