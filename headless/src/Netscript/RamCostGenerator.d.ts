import { NSFull } from "../NetscriptFunctions";
/** The API does not include enums, args, or pid. */
export type RamCostTree<API> = {
    [key in keyof API]: API[key] extends () => unknown ? number | (() => number) : RamCostTree<API[key]>;
};
/** Constants for assigning costs to ns functions */
export declare const RamCostConstants: {
    readonly Base: 1.6;
    readonly Dom: 25;
    readonly CorporationInfo: 10;
    readonly CorporationAction: 20;
    readonly Max: 1024;
    readonly Hack: 0.1;
    readonly HackAnalyze: 1;
    readonly Grow: 0.15;
    readonly GrowthAnalyze: 1;
    readonly Weaken: 0.15;
    readonly WeakenAnalyze: 1;
    readonly Scan: 0.2;
    readonly RecentScripts: 0.2;
    readonly PortProgram: 0.05;
    readonly Run: 1;
    readonly Exec: 1.3;
    readonly Spawn: 2;
    readonly Scp: 0.6;
    readonly Kill: 0.5;
    readonly HasRootAccess: 0.05;
    readonly GetHostname: 0.05;
    readonly GetHackingLevel: 0.05;
    readonly GetServer: 0.1;
    readonly GetServerMaxRam: 0.05;
    readonly GetServerUsedRam: 0.05;
    readonly FileExists: 0.1;
    readonly IsRunning: 0.1;
    readonly HacknetNodes: 4;
    readonly HNUpgLevel: 0.4;
    readonly HNUpgRam: 0.6;
    readonly HNUpgCore: 0.8;
    readonly GetStock: 2;
    readonly BuySellStock: 2.5;
    readonly GetPurchaseServer: 0.25;
    readonly PurchaseServer: 2.25;
    readonly GetPurchasedServerLimit: 0.05;
    readonly GetPurchasedServerMaxRam: 0.05;
    readonly Round: 0.05;
    readonly ReadWrite: 1;
    readonly ArbScript: 1;
    readonly GetScript: 0.1;
    readonly GetRunningScript: 0.3;
    readonly GetHackTime: 0.05;
    readonly GetFavorToDonate: 0.1;
    readonly CodingContractBase: 10;
    readonly SleeveBase: 4;
    readonly ClearTerminalCost: 0.2;
    readonly GetMoneySourcesCost: 1;
    readonly SingularityFn1: 2;
    readonly SingularityFn2: 3;
    readonly SingularityFn3: 5;
    readonly GangApiBase: 4;
    readonly BladeburnerApiBase: 4;
    readonly StanekWidth: 0.4;
    readonly StanekHeight: 0.4;
    readonly StanekCharge: 0.4;
    readonly StanekFragmentDefinitions: 0;
    readonly StanekPlacedFragments: 5;
    readonly StanekClear: 0;
    readonly StanekCanPlace: 0.5;
    readonly StanekPlace: 5;
    readonly StanekFragmentAt: 2;
    readonly StanekDeleteAt: 0.15;
    readonly StanekAcceptGift: 2;
    readonly InfiltrationCalculateDifficulty: 2.5;
    readonly InfiltrationCalculateRewards: 2.5;
    readonly InfiltrationGetInfiltrations: 15;
    readonly CycleTiming: 1;
};
/** RamCosts guaranteed to match ns structure 1:1 (aside from args and enums).
 *  An error will be generated if there are missing OR additional ram costs defined.
 *  To avoid errors, define every function in NetscriptDefinition.d.ts and NetscriptFunctions,
 *  and have a ram cost associated here. */
export declare const RamCosts: RamCostTree<NSFull>;
export declare function getRamCost(tree: string[], throwOnUndefined?: boolean): number;
