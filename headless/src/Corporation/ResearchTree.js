"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResearchTree = exports.Node = void 0;
const ResearchMap_1 = require("./ResearchMap");
class Node {
    constructor(p) {
        // All child Nodes in the tree
        // The Research held in this Node is a prerequisite for all Research in
        // child Nodes
        this.children = [];
        // How much Scientific Research is needed for this
        // Necessary to show it on the UI
        this.cost = 0;
        // Whether or not this Research has been unlocked
        this.researched = false;
        // Parent node in the tree
        // The parent node defines the prerequisite Research (there can only be one)
        // Set as null for no prerequisites
        this.parent = null;
        this.researchName = p.researchName;
        this.cost = p.cost;
        if (p.children && p.children.length > 0) {
            this.children = p.children;
        }
        if (p.parent != null) {
            this.parent = p.parent;
        }
    }
    addChild(n) {
        this.children.push(n);
        n.parent = this;
    }
    // Recursive function for finding a Node with the specified text
    findNode(name) {
        // Is this the Node?
        if (this.researchName === name) {
            return this;
        }
        // Recursively search children
        let res = null;
        for (let i = 0; i < this.children.length; ++i) {
            res = this.children[i].findNode(name);
            if (res != null) {
                return res;
            }
        }
        return null;
    }
    setParent(n) {
        this.parent = n;
    }
}
exports.Node = Node;
// A ResearchTree defines all available Research in an Industry
// The root node in a Research Tree must always be the "Hi-Tech R&D Laboratory"
class ResearchTree {
    constructor() {
        // Object containing names of all acquired Research by name
        this.researched = new Set();
        // Root Node
        this.root = null;
    }
    // Gets an array with the 'text' values of ALL Nodes in the Research Tree
    getAllNodes() {
        const res = [];
        const queue = [];
        if (this.root == null) {
            return res;
        }
        queue.push(this.root);
        while (queue.length !== 0) {
            const node = queue.shift();
            if (node == null) {
                continue;
            }
            res.push(node.researchName);
            for (let i = 0; i < node.children.length; ++i) {
                queue.push(node.children[i]);
            }
        }
        return res;
    }
    // Get total multipliers from this Research Tree
    getAdvertisingMultiplier() {
        return this.getMultiplierHelper("advertisingMult");
    }
    getEmployeeChaMultiplier() {
        return this.getMultiplierHelper("employeeChaMult");
    }
    getEmployeeCreMultiplier() {
        return this.getMultiplierHelper("employeeCreMult");
    }
    getEmployeeEffMultiplier() {
        return this.getMultiplierHelper("employeeEffMult");
    }
    getEmployeeIntMultiplier() {
        return this.getMultiplierHelper("employeeIntMult");
    }
    getProductionMultiplier() {
        return this.getMultiplierHelper("productionMult");
    }
    getProductProductionMultiplier() {
        return this.getMultiplierHelper("productProductionMult");
    }
    getSalesMultiplier() {
        return this.getMultiplierHelper("salesMult");
    }
    getScientificResearchMultiplier() {
        return this.getMultiplierHelper("sciResearchMult");
    }
    getStorageMultiplier() {
        return this.getMultiplierHelper("storageMult");
    }
    // Helper function for all the multiplier getter fns
    getMultiplierHelper(propName) {
        let res = 1;
        if (this.root == null) {
            return res;
        }
        const queue = [];
        queue.push(this.root);
        while (queue.length !== 0) {
            const node = queue.shift();
            // If the Node has not been researched, there's no need to
            // process it or its children
            if (node == null || !node.researched) {
                continue;
            }
            const research = ResearchMap_1.ResearchMap[node.researchName];
            // Safety checks
            if (research == null) {
                console.warn(`Invalid Research name in node: ${node.researchName}`);
                continue;
            }
            const mult = {
                advertisingMult: research.advertisingMult,
                employeeChaMult: research.employeeChaMult,
                employeeCreMult: research.employeeCreMult,
                employeeEffMult: research.employeeEffMult,
                employeeIntMult: research.employeeIntMult,
                productionMult: research.productionMult,
                productProductionMult: research.productProductionMult,
                salesMult: research.salesMult,
                sciResearchMult: research.sciResearchMult,
                storageMult: research.storageMult,
            }[propName] ?? null;
            if (mult === null) {
                console.warn(`Invalid propName specified in ResearchTree.getMultiplierHelper: ${propName}`);
                continue;
            }
            res *= mult;
            for (let i = 0; i < node.children.length; ++i) {
                queue.push(node.children[i]);
            }
        }
        return res;
    }
    // Search for a Node with the given name ('text' property on the Node)
    // Returns 'null' if it cannot be found
    findNode(name) {
        if (this.root == null) {
            return null;
        }
        return this.root.findNode(name);
    }
    // Marks a Node as researched
    research(name) {
        if (!this.root || this.researched.has(name))
            return;
        const queue = [];
        queue.push(this.root);
        while (queue.length !== 0) {
            const node = queue.shift();
            if (!node)
                continue;
            if (node.researchName === name) {
                node.researched = true;
                this.researched.add(name);
                return;
            }
            queue.push(...node.children);
        }
        console.warn(`ResearchTree.research() did not find the specified Research node for: ${name}`);
    }
    // Set the tree's Root Node
    setRoot(root) {
        this.root = root;
    }
}
exports.ResearchTree = ResearchTree;
