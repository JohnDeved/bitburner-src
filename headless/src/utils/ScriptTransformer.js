"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleResolutionError = exports.FileType = void 0;
exports.getFileType = getFileType;
exports.getFileTypeFeature = getFileTypeFeature;
exports.parseAST = parseAST;
exports.getModuleScript = getModuleScript;
exports.transformScript = transformScript;
const babel = __importStar(require("@babel/standalone"));
const wasm_web_1 = require("@swc/wasm-web");
const acorn = __importStar(require("acorn"));
const ScriptFilePath_1 = require("../Paths/ScriptFilePath");
var FileType;
(function (FileType) {
    FileType[FileType["PLAINTEXT"] = 0] = "PLAINTEXT";
    FileType[FileType["JSON"] = 1] = "JSON";
    FileType[FileType["JS"] = 2] = "JS";
    FileType[FileType["JSX"] = 3] = "JSX";
    FileType[FileType["TS"] = 4] = "TS";
    FileType[FileType["TSX"] = 5] = "TSX";
    FileType[FileType["NS1"] = 6] = "NS1";
})(FileType || (exports.FileType = FileType = {}));
class ModuleResolutionError extends Error {
}
exports.ModuleResolutionError = ModuleResolutionError;
const supportedFileTypes = [FileType.JSX, FileType.TS, FileType.TSX];
function getFileType(filename) {
    const extension = filename.substring(filename.lastIndexOf(".") + 1);
    switch (extension) {
        case "txt":
            return FileType.PLAINTEXT;
        case "json":
            return FileType.JSON;
        case "js":
            return FileType.JS;
        case "jsx":
            return FileType.JSX;
        case "ts":
            return FileType.TS;
        case "tsx":
            return FileType.TSX;
        case "script":
            return FileType.NS1;
        default:
            throw new Error(`Invalid extension: ${extension}. Filename: ${filename}.`);
    }
}
function getFileTypeFeature(fileType) {
    const result = {
        isReact: false,
        isTypeScript: false,
    };
    if (fileType === FileType.JSX || fileType === FileType.TSX) {
        result.isReact = true;
    }
    if (fileType === FileType.TS || fileType === FileType.TSX) {
        result.isTypeScript = true;
    }
    return result;
}
function parseAST(scriptName, hostname, code, fileType) {
    const fileTypeFeature = getFileTypeFeature(fileType);
    let ast;
    try {
        /**
         * acorn is much faster than babel-parser, especially when parsing many big JS files, so we use it to parse the AST of
         * JS code. babel-parser is only useful when we have to parse JSX and TypeScript.
         */
        if (fileType === FileType.JS) {
            ast = acorn.parse(code, { sourceType: "module", ecmaVersion: "latest" });
        }
        else {
            const plugins = [];
            if (fileTypeFeature.isReact) {
                plugins.push("jsx");
            }
            if (fileTypeFeature.isTypeScript) {
                plugins.push("typescript");
            }
            ast = babel.packages.parser.parse(code, {
                sourceType: "module",
                /**
                 * The usage of the "estree" plugin is mandatory. We use acorn-walk to walk the AST. acorn-walk only supports the
                 * ESTree AST format, but babel-parser uses the Babel AST format by default.
                 */
                plugins: [["estree", { classFeatures: true }], ...plugins],
            }).program;
        }
    }
    catch (error) {
        /**
         * The message of syntax errors may be cryptic for players without programming experience. For example, some players
         * asked us what "Unexpected token" means. Therefore, we will catch the error here and provide a user-friendly error
         * message.
         */
        if (error instanceof SyntaxError) {
            let errorLocation = "unknown";
            /**
             * Some browsers (e.g., Firefox, Chrome) add the "loc" property to the error object. This property provides the
             * line and column numbers of the error.
             */
            if ("loc" in error &&
                error.loc &&
                typeof error.loc === "object" &&
                "line" in error.loc &&
                "column" in error.loc) {
                errorLocation = `Line ${error.loc.line}, Column: ${error.loc.column}`;
            }
            throw new Error(`Syntax error in ${scriptName}, server: ${hostname}. Error location: ${errorLocation}. Error message: ${error.message}.`, {
                cause: error,
            });
        }
        else {
            throw error;
        }
    }
    return ast;
}
/**
 * Simple module resolution algorithm:
 * - Try each extension in validScriptExtensions
 * - Return the first script found
 */
function getModuleScript(moduleName, baseModule, scripts) {
    let script;
    for (const extension of ScriptFilePath_1.validScriptExtensions) {
        const filename = (0, ScriptFilePath_1.resolveScriptFilePath)(moduleName, baseModule, extension);
        if (!filename) {
            throw new ModuleResolutionError(`Invalid module: "${moduleName}". Base module: "${baseModule}".`);
        }
        script = scripts.get(filename);
        if (script) {
            break;
        }
    }
    if (!script) {
        throw new ModuleResolutionError(`Invalid module: "${moduleName}". Base module: "${baseModule}".`);
    }
    return script;
}
/**
 * This function must be synchronous to avoid race conditions. Check https://github.com/bitburner-official/bitburner-src/pull/1173#issuecomment-2026940461
 * for more information.
 */
function transformScript(code, fileType) {
    if (supportedFileTypes.every((v) => v !== fileType)) {
        throw new Error(`Invalid file type: ${fileType}`);
    }
    const fileTypeFeature = getFileTypeFeature(fileType);
    let parserConfig;
    if (fileTypeFeature.isTypeScript) {
        parserConfig = {
            syntax: "typescript",
        };
        if (fileTypeFeature.isReact) {
            parserConfig.tsx = true;
        }
    }
    else {
        parserConfig = {
            syntax: "ecmascript",
        };
        if (fileTypeFeature.isReact) {
            parserConfig.jsx = true;
        }
    }
    const result = (0, wasm_web_1.transformSync)(code, {
        jsc: {
            parser: parserConfig,
            // @ts-expect-error -- jsc supports "esnext" target, but the definition in wasm-web.d.ts is outdated. Ref: https://github.com/swc-project/swc/issues/9495
            target: "esnext",
        },
        sourceMaps: true,
    });
    return {
        scriptCode: result.code,
        sourceMap: result.map,
    };
}
