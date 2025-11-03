"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatingCorporationCheckResultEnum = exports.CorpResearchName = exports.CorpProductResearchName = exports.CorpBaseResearchName = exports.SmartSupplyOption = exports.CorpMaterialName = exports.CorpUpgradeName = exports.CorpUnlockName = exports.CorpEmployeeJob = exports.IndustryType = void 0;
var IndustryType;
(function (IndustryType) {
    IndustryType["Water"] = "Water Utilities";
    IndustryType["Agriculture"] = "Agriculture";
    IndustryType["Fishing"] = "Fishing";
    IndustryType["Mining"] = "Mining";
    IndustryType["Refinery"] = "Refinery";
    IndustryType["Restaurant"] = "Restaurant";
    IndustryType["Tobacco"] = "Tobacco";
    IndustryType["Chemical"] = "Chemical";
    IndustryType["Pharmaceutical"] = "Pharmaceutical";
    IndustryType["Computers"] = "Computer Hardware";
    IndustryType["Robotics"] = "Robotics";
    IndustryType["Software"] = "Software";
    IndustryType["Healthcare"] = "Healthcare";
    IndustryType["RealEstate"] = "Real Estate";
})(IndustryType || (exports.IndustryType = IndustryType = {}));
var CorpEmployeeJob;
(function (CorpEmployeeJob) {
    CorpEmployeeJob["Operations"] = "Operations";
    CorpEmployeeJob["Engineer"] = "Engineer";
    CorpEmployeeJob["Business"] = "Business";
    CorpEmployeeJob["Management"] = "Management";
    CorpEmployeeJob["RandD"] = "Research & Development";
    CorpEmployeeJob["Intern"] = "Intern";
    CorpEmployeeJob["Unassigned"] = "Unassigned";
})(CorpEmployeeJob || (exports.CorpEmployeeJob = CorpEmployeeJob = {}));
var CorpUnlockName;
(function (CorpUnlockName) {
    CorpUnlockName["Export"] = "Export";
    CorpUnlockName["SmartSupply"] = "Smart Supply";
    CorpUnlockName["MarketResearchDemand"] = "Market Research - Demand";
    CorpUnlockName["MarketDataCompetition"] = "Market Data - Competition";
    CorpUnlockName["ShadyAccounting"] = "Shady Accounting";
    CorpUnlockName["GovernmentPartnership"] = "Government Partnership";
    CorpUnlockName["WarehouseAPI"] = "Warehouse API";
    CorpUnlockName["OfficeAPI"] = "Office API";
})(CorpUnlockName || (exports.CorpUnlockName = CorpUnlockName = {}));
var CorpUpgradeName;
(function (CorpUpgradeName) {
    CorpUpgradeName["SmartFactories"] = "Smart Factories";
    CorpUpgradeName["SmartStorage"] = "Smart Storage";
    CorpUpgradeName["WilsonAnalytics"] = "Wilson Analytics";
    CorpUpgradeName["NuoptimalNootropicInjectorImplants"] = "Nuoptimal Nootropic Injector Implants";
    CorpUpgradeName["SpeechProcessorImplants"] = "Speech Processor Implants";
    CorpUpgradeName["NeuralAccelerators"] = "Neural Accelerators";
    CorpUpgradeName["FocusWires"] = "FocusWires";
    CorpUpgradeName["ABCSalesBots"] = "ABC SalesBots";
    CorpUpgradeName["ProjectInsight"] = "Project Insight";
})(CorpUpgradeName || (exports.CorpUpgradeName = CorpUpgradeName = {}));
// As const + type for now, convert to enum later
exports.CorpMaterialName = {
    Water: "Water",
    Ore: "Ore",
    Minerals: "Minerals",
    Food: "Food",
    Plants: "Plants",
    Metal: "Metal",
    Hardware: "Hardware",
    Chemicals: "Chemicals",
    Drugs: "Drugs",
    Robots: "Robots",
    AiCores: "AI Cores",
    RealEstate: "Real Estate",
};
// As const + type for now, convert to enum later
exports.SmartSupplyOption = {
    leftovers: "leftovers",
    imports: "imports",
    none: "none",
};
// As const + type for now, convert to enum later
exports.CorpBaseResearchName = {
    Lab: "Hi-Tech R&D Laboratory",
    AutoBrew: "AutoBrew",
    AutoParty: "AutoPartyManager",
    AutoDrug: "Automatic Drug Administration",
    CPH4Inject: "CPH4 Injections",
    Drones: "Drones",
    DronesAssembly: "Drones - Assembly",
    DronesTransport: "Drones - Transport",
    GoJuice: "Go-Juice",
    RecruitHR: "HRBuddy-Recruitment",
    TrainingHR: "HRBuddy-Training",
    MarketTa1: "Market-TA.I",
    MarketTa2: "Market-TA.II",
    Overclock: "Overclock",
    SelfCorrectAssemblers: "Self-Correcting Assemblers",
    Stimu: "Sti.mu",
};
exports.CorpProductResearchName = {
    Capacity1: "uPgrade: Capacity.I",
    Capacity2: "uPgrade: Capacity.II",
    Dashboard: "uPgrade: Dashboard",
    Fulcrum: "uPgrade: Fulcrum",
};
exports.CorpResearchName = { ...exports.CorpProductResearchName, ...exports.CorpBaseResearchName };
exports.CreatingCorporationCheckResultEnum = {
    Success: "Success",
    NoSf3OrDisabled: "NoSf3OrDisabled",
    CorporationExists: "CorporationExists",
    UseSeedMoneyOutsideBN3: "UseSeedMoneyOutsideBN3",
    DisabledBySoftCap: "DisabledBySoftCap",
};
