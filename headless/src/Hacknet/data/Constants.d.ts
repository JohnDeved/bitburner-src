export declare const HacknetNodeConstants: {
    readonly MoneyGainPerLevel: 1.5;
    readonly BaseCost: 1000;
    readonly LevelBaseCost: 500;
    readonly RamBaseCost: 30000;
    readonly CoreBaseCost: 500000;
    readonly PurchaseNextMult: 1.85;
    readonly UpgradeLevelMult: 1.04;
    readonly UpgradeRamMult: 1.28;
    readonly UpgradeCoreMult: 1.48;
    readonly MaxLevel: 200;
    readonly MaxRam: 64;
    readonly MaxCores: 16;
};
export declare const PurchaseMultipliers: {
    [key: string]: number | "MAX" | undefined;
    x1: number;
    x5: number;
    x10: number;
    MAX: "MAX";
};
export declare const HacknetServerConstants: {
    readonly HashesPerLevel: 0.001;
    readonly BaseCost: 50000;
    readonly RamBaseCost: 200000;
    readonly CoreBaseCost: 1000000;
    readonly CacheBaseCost: 10000000;
    readonly PurchaseMult: 3.2;
    readonly UpgradeLevelMult: 1.1;
    readonly UpgradeRamMult: 1.4;
    readonly UpgradeCoreMult: 1.55;
    readonly UpgradeCacheMult: 1.85;
    readonly MaxServers: 20;
    readonly MaxLevel: 300;
    readonly MaxRam: 8192;
    readonly MaxCores: 128;
    readonly MaxCache: 15;
};
