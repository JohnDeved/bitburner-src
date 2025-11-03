import { CorpUpgradeName } from "@enums";
export interface CorpUpgrade {
    name: CorpUpgradeName;
    basePrice: number;
    priceMult: number;
    benefit: number;
    desc: string;
}
/** Levelable upgrades that affect the entire corporation */
export declare const CorpUpgrades: Record<CorpUpgradeName, CorpUpgrade>;
