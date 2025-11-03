export declare enum CasualtyFactor {
    LOW_CASUALTIES = 0.5,// 50%
    HIGH_CASUALTIES = 1
}
export interface OperationTeam {
    /** teamSize = Human Team + Supporting Sleeves */
    teamSize: number;
    teamLost: number;
    /** number of supporting sleeves at time of action completion */
    sleeveSize: number;
    getTeamCasualtiesRoll(low: number, high: number): number;
    killRandomSupportingSleeves(sleeveDeaths: number): void;
}
export interface TeamActionWithCasualties {
    teamCount: number;
    getMinimumCasualties(): number;
}
/**
 * Some actions (Operations and Black Operations) use teams for success bonus
 * and may result in casualties, reducing the player's hp, killing team members
 * and killing sleeves (to shock them, sleeves are immortal)
 */
export declare function resolveTeamCasualties(action: TeamActionWithCasualties, team: OperationTeam, success: boolean): number;
