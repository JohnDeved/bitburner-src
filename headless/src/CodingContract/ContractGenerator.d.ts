import { CodingContractName } from "@enums";
import { ContractFilePath } from "../Paths/ContractFilePath";
export declare function tryGeneratingRandomContract(numberOfTries: number): void;
export declare function generateRandomContract(): void;
export declare function generateRandomContractOnHome(): void;
export declare const generateDummyContract: (problemType: CodingContractName) => string;
interface IGenerateContractParams {
    problemType?: CodingContractName;
    server?: string;
    fn?: ContractFilePath;
}
export declare function generateContract(params: IGenerateContractParams): void;
export {};
