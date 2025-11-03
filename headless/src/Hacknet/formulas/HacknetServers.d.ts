export declare function calculateHashGainRate(level: number, ramUsed: number, maxRam: number, cores: number, mult: number): number;
export declare function calculateLevelUpgradeCost(startingLevel: number, extraLevels?: number, costMult?: number): number;
export declare function calculateRamUpgradeCost(startingRam: number, extraLevels?: number, costMult?: number): number;
export declare function calculateCoreUpgradeCost(startingCores: number, extraLevels?: number, costMult?: number): number;
export declare function calculateCacheUpgradeCost(startingCache: number, extraLevels?: number): number;
export declare function calculateServerCost(n: number, mult?: number): number;
