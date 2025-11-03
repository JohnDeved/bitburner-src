import type { ReactNode } from "react";
import type { HashUpgradeEnum } from "./Enums";
/** Object representing an upgrade that can be purchased with hashes */
export interface HashUpgradeParams {
    cost?: number;
    costPerLevel: number;
    desc: ReactNode;
    hasTargetServer?: boolean;
    hasTargetCompany?: boolean;
    name: HashUpgradeEnum;
    value: number;
    effectText?: (level: number) => JSX.Element | null;
}
export declare class HashUpgrade {
    /**
     * If the upgrade has a flat cost (never increases), it goes here
     * Otherwise, this property should be undefined
     *
     * This property overrides the 'costPerLevel' property
     */
    cost?: number;
    /**
     * Base cost for this upgrade. Every time the upgrade is purchased,
     * its cost increases by this same amount (so its 1x, 2x, 3x, 4x, etc.)
     */
    costPerLevel: number;
    /** Description of what the upgrade does */
    desc: ReactNode;
    /**
     * Boolean indicating that this upgrade's effect affects a single server,
     * the "target" server
     */
    hasTargetServer: boolean;
    /**
     * Boolean indicating that this upgrade's effect affects a single company,
     * the "target" company
     */
    hasTargetCompany: boolean;
    /** Name of upgrade */
    name: HashUpgradeEnum;
    value: number;
    constructor(p: HashUpgradeParams);
    effectText: (level: number) => JSX.Element | null;
    getCost(currentLevel: number, count?: number): number;
}
