import { CorpResearchName } from "@nsdefs";
interface IConstructorParams {
    children?: Node[];
    cost: number;
    researchName: CorpResearchName;
    parent?: Node | null;
}
export declare class Node {
    children: Node[];
    cost: number;
    researched: boolean;
    parent: Node | null;
    researchName: CorpResearchName;
    constructor(p: IConstructorParams);
    addChild(n: Node): void;
    findNode(name: CorpResearchName): Node | null;
    setParent(n: Node): void;
}
export declare class ResearchTree {
    researched: Set<CorpResearchName>;
    root: Node | null;
    getAllNodes(): CorpResearchName[];
    getAdvertisingMultiplier(): number;
    getEmployeeChaMultiplier(): number;
    getEmployeeCreMultiplier(): number;
    getEmployeeEffMultiplier(): number;
    getEmployeeIntMultiplier(): number;
    getProductionMultiplier(): number;
    getProductProductionMultiplier(): number;
    getSalesMultiplier(): number;
    getScientificResearchMultiplier(): number;
    getStorageMultiplier(): number;
    getMultiplierHelper(propName: string): number;
    findNode(name: CorpResearchName): Node | null;
    research(name: CorpResearchName): void;
    setRoot(root: Node): void;
}
export {};
