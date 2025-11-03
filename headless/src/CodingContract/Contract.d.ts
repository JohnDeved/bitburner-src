import { FactionName, CodingContractName } from "@enums";
import { IReviverValue } from "../utils/JSONReviver";
import { ContractFilePath } from "../Paths/ContractFilePath";
import { Result } from "../types";
/** Enum representing the different types of rewards a Coding Contract can give */
export declare enum CodingContractRewardType {
    FactionReputation = 0,
    FactionReputationAll = 1,
    CompanyReputation = 2,
    Money = 3
}
/** Enum representing the result when trying to solve the Contract */
export declare enum CodingContractResult {
    Success = 0,
    Failure = 1,
    Cancelled = 2,
    InvalidFormat = 3
}
/** A class that represents the type of reward a contract gives */
export type ICodingContractReward = {
    type: CodingContractRewardType.Money;
} | {
    type: CodingContractRewardType.FactionReputationAll;
} | {
    type: CodingContractRewardType.CompanyReputation;
    name: string;
} | {
    type: CodingContractRewardType.FactionReputation;
    name: FactionName;
};
/**
 * A Coding Contract is a file that poses a programming-related problem to the Player.
 * The player receives a reward if the problem is solved correctly
 */
export declare class CodingContract {
    state: unknown;
    fn: ContractFilePath;
    reward: ICodingContractReward | null;
    tries: number;
    type: CodingContractName;
    constructor(fn?: string, type?: any, reward?: ICodingContractReward | null);
    getData(): unknown;
    getDescription(): string;
    getDifficulty(): number;
    getMaxNumTries(): number;
    getType(): CodingContractName;
    /** Checks if the answer is in the correct format. */
    isValid(answer: unknown): Result<{
        answer: unknown;
    }>;
    isSolution(solution: unknown): {
        result: Exclude<CodingContractResult, CodingContractResult.Cancelled>;
        message?: string;
    };
    /** Creates a popup to prompt the player to solve the problem */
    prompt(): Promise<{
        result: CodingContractResult;
        message?: string;
    }>;
    /** Serialize the current file to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a CodingContract from a JSON save state. */
    static fromJSON(value: IReviverValue): CodingContract;
}
