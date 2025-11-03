import type { BladeburnerMultName, BladeburnerSkillName } from "@enums";
import { Bladeburner } from "./Bladeburner";
import { Availability } from "./Types";
import { PositiveInteger, PositiveNumber } from "../types";
import { PartialRecord } from "../Types/Record";
interface SkillParams {
    name: BladeburnerSkillName;
    desc: string;
    baseCost?: number;
    costInc?: number;
    maxLvl?: number;
    mults: PartialRecord<BladeburnerMultName, number>;
}
export declare class Skill {
    name: BladeburnerSkillName;
    desc: string;
    baseCost: number;
    costInc: number;
    maxLvl: number;
    mults: PartialRecord<BladeburnerMultName, number>;
    constructor(params: SkillParams);
    calculateCost(currentLevel: number, count?: PositiveInteger): number;
    calculateMaxUpgradeCount(currentLevel: number, cost: PositiveNumber): number;
    canUpgrade(bladeburner: Bladeburner, count?: number): Availability<{
        actualCount: number;
        cost: number;
    }>;
    getMultiplier(name: BladeburnerMultName): number;
}
export {};
