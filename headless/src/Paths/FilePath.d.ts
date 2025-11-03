import { Directory, AbsolutePath } from "./Directory";
/** Filepath Rules:
 * 1. File extension cannot contain a "/"
 * 2. Last character before the extension cannot be a "/" as this would be a blank filename
 * 3. Must not contain a leading "/"
 * 4. Directory names cannot be 0-length (no "//")
 * 5. The characters *, ?, [, and ]  cannot exist in the filepath*/
type BasicFilePath = string & {
    __type: "FilePath";
};
/** A file path that is also an absolute path. Additional absolute rules:
 * 1. Specific directory names "." and ".." are disallowed
 * Absoluteness is typechecked with isAbsolutePath in DirectoryPath.ts */
export type FilePath = BasicFilePath & AbsolutePath;
/** Simple validation function with no modification. Can be combined with isAbsolutePath to get a real FilePath */
export declare function isBasicFilePath(path: string): path is BasicFilePath;
export declare function isFilePath(path: string): path is FilePath;
export declare function asFilePath<T extends string>(input: T): T & FilePath;
export declare function getFilenameOnly<T extends BasicFilePath>(path: T): T & FilePath;
/** Sanitizes a player input and resolves a relative file path to an absolute one.
 * @param path The player-provided path string. Can include relative directories.
 * @param base The absolute base for resolving a relative path. */
export declare function resolveFilePath(path: string, base?: FilePath | Directory): FilePath | null;
/** Combine an absolute DirectoryPath and FilePath to create a new FilePath */
export declare function combinePath<T extends FilePath>(directory: Directory, file: T): T;
export declare function removeDirectoryFromPath(directory: Directory, path: FilePath): FilePath | null;
export {};
