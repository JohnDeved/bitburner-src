/**
 * Given an experience amount and stat multiplier, calculates the
 * stat level. Stat-agnostic (same formula for every stat)
 */
export declare function calculateSkill(exp: number, mult?: number): number;
export declare function calculateExp(skill: number, mult?: number): number;
export declare function calculateSkillProgress(exp: number, mult?: number): ISkillProgress;
export interface ISkillProgress {
    currentSkill: number;
    nextSkill: number;
    baseExperience: number;
    experience: number;
    nextExperience: number;
    currentExperience: number;
    remainingExperience: number;
    progress: number;
}
export declare function getEmptySkillProgress(): ISkillProgress;
