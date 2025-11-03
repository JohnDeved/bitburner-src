export interface IMults {
    hack?: number;
    str?: number;
    def?: number;
    dex?: number;
    agi?: number;
    cha?: number;
}
export declare enum UpgradeType {
    Weapon = "w",
    Armor = "a",
    Vehicle = "v",
    Rootkit = "r",
    Augmentation = "g"
}
/**
 * Defines the parameters that can be used to initialize and describe a GangMemberUpgrade
 * (defined in Gang.js)
 */
interface IGangMemberUpgradeMetadata {
    cost: number;
    mults: IMults;
    name: string;
    upgType: UpgradeType;
}
/**
 * Array of metadata for all Gang Member upgrades. Used to construct the global GangMemberUpgrade
 * objects in Gang.js
 */
export declare const gangMemberUpgradesMetadata: IGangMemberUpgradeMetadata[];
export {};
