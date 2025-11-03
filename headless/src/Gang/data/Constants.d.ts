export declare const GangConstants: {
    /** Number of members that can be recruited with 0 respect. */
    readonly numFreeMembers: 3;
    /** Exponential base used in determining the respect threshold for recruiting a new member. */
    readonly recruitThresholdBase: 5;
    readonly GangRespectToReputationRatio: 75;
    readonly MaximumGangMembers: 12;
    readonly CyclesPerTerritoryAndPowerUpdate: 100;
    readonly AscensionMultiplierRatio: 0.15;
    readonly InstallAscensionPenalty: 0.95;
    readonly Names: string[];
    readonly GangKarmaRequirement: -54000;
    /** Normal number of game cycles processed at once (2 seconds) */
    readonly minCyclesToProcess: number;
    /** Maximum number of cycles to process at once during bonus time (5 seconds) */
    readonly maxCyclesToProcess: number;
};
