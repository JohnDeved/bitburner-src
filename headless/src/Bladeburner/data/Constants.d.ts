export declare const BladeburnerConstants: {
    readonly CyclesPerSecond: 5;
    readonly StaminaGainPerSecond: 0.0085;
    readonly BaseStaminaLoss: 0.285;
    readonly MaxStaminaToGainFactor: 70000;
    readonly DifficultyToTimeFactor: 10;
    /**
     * The difficulty multiplier affects stamina loss and hp loss of an action. Also affects
     * experience gain. Its formula is:
     * difficulty ^ exponentialFactor + difficulty / linearFactor
     */
    readonly DiffMultExponentialFactor: 0.28;
    readonly DiffMultLinearFactor: 650;
    /**
     * These factors are used to calculate action time.
     * They affect how much action time is reduced based on your agility and dexterity
     */
    readonly EffAgiLinearFactor: 10000;
    readonly EffDexLinearFactor: 10000;
    readonly EffAgiExponentialFactor: 0.04;
    readonly EffDexExponentialFactor: 0.035;
    readonly BaseRecruitmentTimeNeeded: 300;
    readonly PopulationThreshold: 1000000000;
    readonly PopulationExponent: 0.7;
    readonly ChaosThreshold: 50;
    readonly BaseStatGain: 1;
    readonly BaseIntGain: 0.003;
    readonly BasePopGrowth: 100;
    readonly PopGrowthCeiling: 1500000000;
    readonly ActionCountGrowthPeriod: 480;
    readonly RankToFactionRepFactor: 2;
    readonly RankNeededForFaction: 25;
    readonly ContractSuccessesPerLevel: 3;
    readonly OperationSuccessesPerLevel: 2.5;
    readonly RanksPerSkillPoint: 3;
    readonly ContractBaseMoneyGain: 250000;
    readonly HrcHpGain: 2;
    readonly HrcStaminaGain: 1;
};
