import { GangMember } from "../GangMember";
import { GangMemberTask } from "../GangMemberTask";
export interface FormulaGang {
    respect: number;
    territory: number;
    wantedLevel: number;
}
export declare function calculateWantedPenalty(gang: FormulaGang): number;
export declare function calculateRespectGain(gang: FormulaGang, member: GangMember, task: GangMemberTask): number;
export declare function calculateWantedLevelGain(gang: FormulaGang, member: GangMember, task: GangMemberTask): number;
export declare function calculateMoneyGain(gang: FormulaGang, member: GangMember, task: GangMemberTask): number;
export declare function calculateAscensionPointsGain(exp: number): number;
export declare function calculateAscensionMult(points: number): number;
