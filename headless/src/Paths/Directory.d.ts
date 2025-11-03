import type { BaseServer } from "../Server/BaseServer";
import type { FilePath } from "./FilePath";
/** The directory part of a BasicFilePath. Everything up to and including the last /
 * e.g. "file.js" => "", or "dir/file.js" => "dir/", or "../test.js" => "../" */
export type BasicDirectory = string & {
    __type: "Directory";
};
/** Type for use in Directory and FilePath to indicate path is absolute */
export type AbsolutePath = string & {
    __absolutePath: true;
};
/** A directory path that is also absolute. Absolute Rules (FilePath and DirectoryPath):
 * 1. Specific directory names "." and ".." are disallowed */
export type Directory = BasicDirectory & AbsolutePath;
export declare const root: Directory;
/** A valid character is any character that is not one of the invalid characters */
export declare const oneValidCharacter: string;
/** Regex string for matching the directory part of a valid filepath */
export declare const directoryRegexString: string;
export declare function isDirectoryPath(path: string): path is BasicDirectory;
export declare function isAbsolutePath(path: string): path is AbsolutePath;
/** Sanitize and resolve a player-provided potentially-relative path to an absolute path.
 * @param path The player-provided directory path, e.g. 2nd argument for terminal cp command
 * @param base The starting directory. */
export declare function resolveDirectory(path: string, base?: Directory): Directory | null;
/** Resolve an already-typechecked directory path with respect to an absolute path */
export declare function resolveValidatedDirectory(relative: BasicDirectory, absolute: Directory): Directory | null;
/** Check if a given directory exists on a server, e.g. for checking if the player can CD into that directory */
export declare function directoryExistsOnServer(directory: Directory, server: BaseServer): boolean;
/** Returns the first directory, other than root, in a file path. If in root, returns null. */
export declare function getFirstDirectoryInPath(path: FilePath | Directory): Directory | null;
export declare function getAllDirectories(server: BaseServer): Set<Directory>;
