import { Directory } from "./Directory";
import { FilePath } from "./FilePath";
/** Filepath with the additional constraint of having a .cct extension */
type WithContractExtension = string & {
    __fileType: "Contract";
};
export type ContractFilePath = FilePath & WithContractExtension;
/** Check extension only */
export declare function hasContractExtension(path: string): path is WithContractExtension;
/** Sanitize a player input, resolve any relative paths, and for imports add the correct extension if missing */
export declare function resolveContractFilePath(path: string, base?: FilePath | Directory): ContractFilePath | null;
export {};
