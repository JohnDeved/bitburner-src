"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseResearchTreeCopy = getBaseResearchTreeCopy;
exports.getProductIndustryResearchTreeCopy = getProductIndustryResearchTreeCopy;
const ResearchMap_1 = require("../ResearchMap");
const ResearchTree_1 = require("../ResearchTree");
function makeNode(name) {
    const research = ResearchMap_1.ResearchMap[name];
    return new ResearchTree_1.Node({ researchName: research.name, cost: research.cost });
}
// Creates the Nodes for the BaseResearchTree.
// Return the Root Node
function createBaseResearchTreeNodes() {
    const rootNode = makeNode("Hi-Tech R&D Laboratory");
    const autoBrew = makeNode("AutoBrew");
    const autoParty = makeNode("AutoPartyManager");
    const autoDrugs = makeNode("Automatic Drug Administration");
    const cph4 = makeNode("CPH4 Injections");
    const drones = makeNode("Drones");
    const dronesAssembly = makeNode("Drones - Assembly");
    const dronesTransport = makeNode("Drones - Transport");
    const goJuice = makeNode("Go-Juice");
    const hrRecruitment = makeNode("HRBuddy-Recruitment");
    const hrTraining = makeNode("HRBuddy-Training");
    const marketta1 = makeNode("Market-TA.I");
    const marketta2 = makeNode("Market-TA.II");
    const overclock = makeNode("Overclock");
    const scAssemblers = makeNode("Self-Correcting Assemblers");
    const stimu = makeNode("Sti.mu");
    autoDrugs.addChild(goJuice);
    autoDrugs.addChild(cph4);
    drones.addChild(dronesAssembly);
    drones.addChild(dronesTransport);
    hrRecruitment.addChild(hrTraining);
    marketta1.addChild(marketta2);
    overclock.addChild(stimu);
    rootNode.addChild(autoBrew);
    rootNode.addChild(autoParty);
    rootNode.addChild(autoDrugs);
    rootNode.addChild(drones);
    rootNode.addChild(hrRecruitment);
    rootNode.addChild(marketta1);
    rootNode.addChild(overclock);
    rootNode.addChild(scAssemblers);
    return rootNode;
}
function getBaseResearchTreeCopy() {
    const baseResearchTree = new ResearchTree_1.ResearchTree();
    baseResearchTree.setRoot(createBaseResearchTreeNodes());
    return baseResearchTree;
}
// Base Research Tree for Industry's that make products
function getProductIndustryResearchTreeCopy() {
    const researchTree = new ResearchTree_1.ResearchTree();
    const root = createBaseResearchTreeNodes();
    const upgradeFulcrum = makeNode("uPgrade: Fulcrum");
    const upgradeCapacity1 = makeNode("uPgrade: Capacity.I");
    const upgradeCapacity2 = makeNode("uPgrade: Capacity.II");
    const upgradeDashboard = makeNode("uPgrade: Dashboard");
    upgradeCapacity1.addChild(upgradeCapacity2);
    upgradeFulcrum.addChild(upgradeCapacity1);
    upgradeFulcrum.addChild(upgradeDashboard);
    root.addChild(upgradeFulcrum);
    researchTree.setRoot(root);
    return researchTree;
}
