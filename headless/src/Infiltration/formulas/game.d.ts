export declare const MaxDifficultyForInfiltration = 3.5;
export declare const InfiltrationStateDefault: {
    lastChangeTimestamp: number;
    floors: number;
};
export declare const InfiltrationState: {
    lastChangeTimestamp: number;
    floors: number;
};
export declare function calculateMarketDemandMultiplier(timestamp: number, clamp?: boolean): number;
export declare function decreaseMarketDemandMultiplier(timestamp: number, floors: number): void;
export declare function calculateDifficulty(startingSecurityLevel: number): number;
export declare function calculateReward(startingSecurityLevel: number): number;
