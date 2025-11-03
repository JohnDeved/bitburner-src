import type { Bladeburner } from "../Bladeburner";
import type { Person } from "../../PersonObjects/Person";
import type { Availability, SuccessChanceParams } from "../Types";
import type { Skills as PersonSkills } from "../../PersonObjects/Skills";
export interface ActionParams {
    desc: string;
    warning?: string;
    successScaling?: string;
    baseDifficulty?: number;
    rewardFac?: number;
    rankGain?: number;
    rankLoss?: number;
    hpLoss?: number;
    isStealth?: boolean;
    isKill?: boolean;
    weights?: PersonSkills;
    decays?: PersonSkills;
}
export declare abstract class ActionClass {
    desc: string;
    warning: string;
    successScaling: string;
    baseDifficulty: number;
    rankGain: number;
    rankLoss: number;
    hpLoss: number;
    isStealth: boolean;
    isKill: boolean;
    weights: PersonSkills;
    decays: PersonSkills;
    constructor(params?: ActionParams | null);
    /** Tests for success. Should be called when an action has completed */
    attempt(bladeburner: Bladeburner, person: Person): boolean;
    getPopulationSuccessFactor(bladeburner: Bladeburner, { est }: SuccessChanceParams): number;
    getChaosSuccessFactor(bladeburner: Bladeburner): number;
    getActionTime(bladeburner: Bladeburner, person: Person): number;
    getTeamSuccessBonus(__bladeburner: Bladeburner): number;
    getActionTypeSkillSuccessBonus(__bladeburner: Bladeburner): number;
    getAvailability(__bladeburner: Bladeburner): Availability;
    getActionTimePenalty(): number;
    getDifficulty(): number;
    getSuccessRange(bladeburner: Bladeburner, person: Person): [minChance: number, maxChance: number];
    getSuccessChance(inst: Bladeburner, person: Person, { est }?: SuccessChanceParams): number;
}
