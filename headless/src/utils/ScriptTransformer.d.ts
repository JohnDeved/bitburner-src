import * as acorn from "acorn";
import { type ScriptFilePath } from "../Paths/ScriptFilePath";
import type { Script } from "../Script/Script";
export type AcornASTProgram = acorn.Program;
export type BabelASTProgram = object;
export type AST = AcornASTProgram | BabelASTProgram;
export declare enum FileType {
    PLAINTEXT = 0,
    JSON = 1,
    JS = 2,
    JSX = 3,
    TS = 4,
    TSX = 5,
    NS1 = 6
}
export interface FileTypeFeature {
    isReact: boolean;
    isTypeScript: boolean;
}
export declare class ModuleResolutionError extends Error {
}
export declare function getFileType(filename: string): FileType;
export declare function getFileTypeFeature(fileType: FileType): FileTypeFeature;
export declare function parseAST(scriptName: string, hostname: string, code: string, fileType: FileType): AST;
/**
 * Simple module resolution algorithm:
 * - Try each extension in validScriptExtensions
 * - Return the first script found
 */
export declare function getModuleScript(moduleName: string, baseModule: ScriptFilePath, scripts: Map<ScriptFilePath, Script>): Script;
/**
 * This function must be synchronous to avoid race conditions. Check https://github.com/bitburner-official/bitburner-src/pull/1173#issuecomment-2026940461
 * for more information.
 */
export declare function transformScript(code: string, fileType: FileType): {
    scriptCode: string;
    sourceMap: string | undefined;
};
