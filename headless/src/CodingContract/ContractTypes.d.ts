import { CodingContractName } from "@enums";
import { CodingContractSignatures } from "@nsdefs";
interface CodingContractType<Data, Answer, State = Data> {
    /**
     * Function that returns a string with the problem's description.
     * Requires the 'data' of a Contract as input
     */
    desc: (data: Data) => string;
    /** Difficulty of the contract. Higher is harder. */
    difficulty: number;
    /** Function that generates a valid 'state' for a contract type */
    generate: () => State;
    /**
     * Transforms the 'state' for a contract into its 'data'. The state is
     * stored persistently as JSON, so it must be serializable. The data is what
     * is given to the user and shown in the description. If this function is
     * ommitted, it will be the identity function (i.e. State == Data).
     * You can use this to make problems where the "solver" is not a function
     * that can be copy-pasted to user code to solve the problem.
     */
    getData?: (state: State) => Data;
    /** How many tries you get. Defaults to 10. */
    numTries?: number;
    /** Function that checks whether the players answer is correct. */
    solver: (state: State, answer: Answer) => boolean;
    /** Function that converts string answers to the expected answer format. */
    convertAnswer: (answer: string) => Answer | null;
    /** Function that validates the format of the provided answer. */
    validateAnswer: (answer: unknown) => answer is Answer;
}
type CodingContractSimpleType<Data, Answer> = Omit<CodingContractType<Data, Answer, Data>, "getData">;
type CodingContractComplexType<Data, Answer, State> = Omit<CodingContractType<Data, Answer, State>, "getData"> & {
    getData: (state: State) => Data;
};
type CodingContractDefinitions<Signatures extends Record<string, [unknown, unknown] | [unknown, unknown, unknown]>> = {
    [T in keyof Signatures]: Signatures[T] extends [unknown, unknown, unknown] ? CodingContractComplexType<Signatures[T][0], Signatures[T][1], Signatures[T][2]> : CodingContractSimpleType<Signatures[T][0], Signatures[T][1]>;
};
export type CodingContractTypes = CodingContractDefinitions<CodingContractSignatures>;
export declare function removeBracketsFromArrayString(str: string): string;
export declare function removeQuotesFromString(str: string): string;
export declare function convert2DArrayToString(arr: number[][]): string;
export declare const CodingContractDefinitions: CodingContractTypes;
export declare const CodingContractTypes: Record<CodingContractName, CodingContractType<unknown, unknown, unknown>>;
export {};
