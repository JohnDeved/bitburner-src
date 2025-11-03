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
exports.config = void 0;
exports.compile = compile;
/**
 * Uses the acorn.js library to parse a script's code into an AST and
 * recursively walk through that AST to replace import urls with blobs
 */
const walk = __importStar(require("acorn-walk"));
const acorn_1 = require("acorn");
const convert_source_map_1 = require("convert-source-map");
const LoadedModule_1 = require("./Script/LoadedModule");
const ScriptTransformer_1 = require("./utils/ScriptTransformer");
// Makes a blob that contains the code of a given script.
function makeScriptBlob(code) {
    return new Blob([code], { type: "text/javascript" });
}
// Webpack likes to turn the import into a require, which sort of
// but not really behaves like import. So we use a "magic comment"
// to disable that and leave it as a dynamic import.
//
// However, we need to be able to replace this implementation in tests. Ideally
// it would be fine, but Jest causes segfaults when using dynamic import: see
// https://github.com/nodejs/node/issues/35889 and
// https://github.com/facebook/jest/issues/11438
// import() is not a function, so it can't be replaced. We need this separate
// config object to provide a hook point.
exports.config = {
    doImport(url) {
        return Promise.resolve(`${url}`).then(s => __importStar(require(s)));
    },
};
// Maps code to LoadedModules, so we can reuse compiled code across servers,
// or possibly across files (if someone makes two copies of the same script,
// or changes a script and then changes it back).
// Modules can never be garbage collected by Javascript, so it's good to try
// to keep from making more than we need.
const moduleCache = new Map();
const cleanup = new FinalizationRegistry((mapKey) => {
    // A new entry can be created with the same key, before this callback is called.
    if (moduleCache.get(mapKey)?.deref() === undefined) {
        moduleCache.delete(mapKey);
    }
});
function compile(script, scripts) {
    // Return the module if it already exists
    if (script.mod)
        return script.mod.module;
    try {
        script.mod = generateLoadedModule(script, scripts, []);
    }
    catch (error) {
        throw new Error(`Cannot generate module ${script.filename}`, { cause: error });
    }
    return script.mod.module;
}
/** Add the necessary dependency relationships for a script.
 * Dependents are used only for passing invalidation up an import tree, so only direct dependents need to be stored.
 * Direct and indirect dependents need to have the current url/script added to their dependency map for error text.
 *
 * This should only be called once the script has a LoadedModule. */
function addDependencyInfo(script, seenStack) {
    if (!script.mod)
        throw new Error(`addDependencyInfo called without a LoadedModule (${script.filename})`);
    if (seenStack.length) {
        script.dependents.add(seenStack[seenStack.length - 1]);
        for (const dependent of seenStack)
            dependent.dependencies.set(script.mod.url, script);
    }
    // Add self to dependencies (it's not part of the stack, since we don't want
    // it in dependents.)
    script.dependencies.set(script.mod.url, script);
}
/**
 * @param script the script that needs a URL assigned
 * @param scripts array of other scripts on the server
 * @param seenStack A stack of scripts that were higher up in the import tree in a recursive call.
 */
function generateLoadedModule(script, scripts, seenStack) {
    // Early return for recursive calls where the script already has a URL
    if (script.mod) {
        addDependencyInfo(script, seenStack);
        return script.mod;
    }
    if (script.code === "") {
        throw new Error(`Script content is an empty string. Filename: ${script.filename}, server: ${script.server}.`);
    }
    let scriptCode;
    let sourceMap;
    const fileType = (0, ScriptTransformer_1.getFileType)(script.filename);
    switch (fileType) {
        case ScriptTransformer_1.FileType.JS:
            scriptCode = script.code;
            break;
        case ScriptTransformer_1.FileType.JSX:
        case ScriptTransformer_1.FileType.TS:
        case ScriptTransformer_1.FileType.TSX:
            ({ scriptCode, sourceMap } = (0, ScriptTransformer_1.transformScript)(script.code, fileType));
            break;
        default:
            throw new Error(`Invalid file type: ${fileType}. Filename: ${script.filename}, server: ${script.server}.`);
    }
    if (!scriptCode) {
        throw new Error(`Cannot transform script. Filename: ${script.filename}, server: ${script.server}.`);
    }
    // Inspired by: https://stackoverflow.com/a/43834063/91401
    const ast = (0, acorn_1.parse)(scriptCode, { sourceType: "module", ecmaVersion: "latest", ranges: true });
    const importNodes = [];
    // Walk the nodes of this tree and find any import declaration statements.
    walk.simple(ast, {
        ImportDeclaration(node) {
            // Push this import onto the stack to replace
            if (!node.source) {
                return;
            }
            if (typeof node.source.value !== "string" || !node.source.range) {
                console.error("Invalid node when walking ImportDeclaration in generateLoadedModule. node:", node);
                return;
            }
            importNodes.push({
                filename: node.source.value,
                start: node.source.range[0] + 1,
                end: node.source.range[1] - 1,
            });
        },
        ExportNamedDeclaration(node) {
            if (!node.source) {
                return;
            }
            if (typeof node.source.value !== "string" || !node.source.range) {
                console.error("Invalid node when walking ExportNamedDeclaration in generateLoadedModule. node:", node);
                return;
            }
            importNodes.push({
                filename: node.source.value,
                start: node.source.range[0] + 1,
                end: node.source.range[1] - 1,
            });
        },
        ExportAllDeclaration(node) {
            if (!node.source) {
                return;
            }
            if (typeof node.source.value !== "string" || !node.source.range) {
                console.error("Invalid node when walking ExportAllDeclaration in generateLoadedModule. node:", node);
                return;
            }
            importNodes.push({
                filename: node.source.value,
                start: node.source.range[0] + 1,
                end: node.source.range[1] - 1,
            });
        },
    });
    // Sort the nodes from last start index to first. This replaces the last import with a blob first,
    // preventing the ranges for other imports from being shifted.
    importNodes.sort((a, b) => b.start - a.start);
    let newCode = scriptCode;
    // Loop through each node and replace the script name with a blob url.
    for (const node of importNodes) {
        const importedScript = (0, ScriptTransformer_1.getModuleScript)(node.filename, script.filename, scripts);
        for (const scriptInSeenStack of seenStack) {
            if (scriptInSeenStack.filename === script.filename) {
                throw new Error(`Circular dependencies detected. ${script.filename} imports ${importedScript.filename}, but ` +
                    `${importedScript.filename} or its dependencies import ${script.filename}.`);
            }
        }
        seenStack.push(script);
        importedScript.mod = generateLoadedModule(importedScript, scripts, seenStack);
        seenStack.pop();
        newCode = newCode.substring(0, node.start) + importedScript.mod.url + newCode.substring(node.end);
    }
    const cachedMod = moduleCache.get(newCode)?.deref();
    if (cachedMod) {
        script.mod = cachedMod;
    }
    else {
        // Add an inline source-map to make debugging nicer. This won't be right
        // in all cases, since we can share the same script across multiple
        // servers; it will be listed under the first server it was compiled for.
        // We don't include this in the cache key, so that other instances of the
        // script dedupe properly.
        const sourceURL = `${script.server}/${script.filename}`;
        let adjustedCode = newCode + `\n//# sourceURL=${sourceURL}`;
        if (sourceMap) {
            let inlineSourceMap;
            try {
                inlineSourceMap = (0, convert_source_map_1.fromObject)({ ...JSON.parse(sourceMap), sources: [sourceURL], sourceRoot: "/" }).toComment();
            }
            catch (error) {
                console.warn(`Cannot generate inline source map for ${script.filename} in ${script.server}`, error);
            }
            if (inlineSourceMap) {
                adjustedCode += `\n${inlineSourceMap}`;
            }
        }
        // At this point we have the full code and can construct a new blob / assign the URL.
        const url = URL.createObjectURL(makeScriptBlob(adjustedCode));
        const module = exports.config.doImport(url).catch((e) => {
            script.invalidateModule();
            console.error(`Error occurred while attempting to compile ${script.filename} on ${script.server}:`);
            console.error(e);
            throw e;
        });
        // We can *immediately* invalidate the Blob, because we've already started the fetch
        // by starting the import. From now on, any imports using the blob's URL *must*
        // directly return the module, without even attempting to fetch, due to the way
        // modules work.
        URL.revokeObjectURL(url);
        script.mod = new LoadedModule_1.LoadedModule(url, module);
        moduleCache.set(newCode, new WeakRef(script.mod));
        cleanup.register(script.mod, newCode);
    }
    addDependencyInfo(script, seenStack);
    return script.mod;
}
