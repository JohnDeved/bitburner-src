/**
 * @param ram Amount of RAM on purchased server (GB)
 * @returns Cost of purchasing the given server. Returns infinity for invalid arguments
 */
export declare function getPurchaseServerCost(ram: number): number;
export declare const getPurchasedServerUpgradeCost: (hostname: string, ram: number) => number;
export declare const upgradePurchasedServer: (hostname: string, ram: number) => void;
export declare const renamePurchasedServer: (hostname: string, newName: string) => void;
export declare function getPurchaseServerLimit(): number;
export declare function getPurchaseServerMaxRam(): number;
export declare function purchaseServer(hostname: string, ram: number): void;
export declare function purchaseRamForHomeComputer(): void;
