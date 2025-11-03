import { IMults, UpgradeType } from "./data/upgrades";
export declare class GangMemberUpgrade {
    name: string;
    cost: number;
    type: UpgradeType;
    desc: string;
    mults: IMults;
    constructor(name?: string, cost?: number, type?: UpgradeType, mults?: IMults);
    createDescription(): string;
    getType(): string;
}
