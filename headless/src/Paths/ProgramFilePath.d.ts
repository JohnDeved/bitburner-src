import { Directory } from "./Directory";
import { FilePath } from "./FilePath";
/** Filepath with the additional constraint of having a .exe extension */
type WithProgramExtension = string & {
    __fileType: "Program";
};
export type ProgramFilePath = FilePath & WithProgramExtension;
/** Check extension only. Programs are a bit different than others because of incomplete programs. */
export declare function hasProgramExtension(path: string): path is WithProgramExtension;
/** Sanitize a player input, resolve any relative paths, and for imports add the correct extension if missing */
export declare function resolveProgramFilePath(path: string, base?: FilePath | Directory): ProgramFilePath | null;
export declare function asProgramFilePath<T extends string>(path: T): T & ProgramFilePath;
export {};
