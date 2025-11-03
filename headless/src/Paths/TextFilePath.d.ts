import { Directory } from "./Directory";
import { FilePath } from "./FilePath";
/** Filepath with the additional constraint of having a text extension */
type WithTextExtension = string & {
    __fileType: "Text";
};
export type TextFilePath = FilePath & WithTextExtension;
/** Check extension only */
export declare function hasTextExtension(path: string): path is WithTextExtension;
/** Sanitize a player input, resolve any relative paths, and for imports add the correct extension if missing */
export declare function resolveTextFilePath(path: string, base?: FilePath | Directory): TextFilePath | null;
export {};
