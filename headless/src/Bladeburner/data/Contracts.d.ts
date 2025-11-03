import { BladeburnerContractName } from "@enums";
import { Contract } from "../Actions/Contract";
export declare function createContracts(): Record<BladeburnerContractName, Contract>;
export declare function loadContractsData(data: unknown, contracts: Record<BladeburnerContractName, Contract>): void;
