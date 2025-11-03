export interface IHacknetNode {
    cores: number;
    level: number;
    onlineTimeSeconds: number;
    calculateCoreUpgradeCost: (levels: number, costMult: number) => number;
    calculateLevelUpgradeCost: (levels: number, costMult: number) => number;
    calculateRamUpgradeCost: (levels: number, costMult: number) => number;
    upgradeCore: (levels: number, prodMult: number) => void;
    upgradeLevel: (levels: number, prodMult: number) => void;
    upgradeRam: (levels: number, prodMult: number) => void;
}
