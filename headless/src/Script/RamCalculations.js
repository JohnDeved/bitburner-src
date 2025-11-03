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
exports.checkInfiniteLoop = checkInfiniteLoop;
exports.calculateRamUsage = calculateRamUsage;
/**
 * Implements RAM Calculation functionality.
 *
 * Uses acorn-walk to recursively walk through the AST, calculating RAM usage along the way.
 */
const walk = __importStar(require("acorn-walk"));
const acorn_typescript_walk_1 = require("../ThirdParty/acorn-typescript-walk");
const acorn_jsx_walk_1 = require("acorn-jsx-walk");
const RamCalculationErrorCodes_1 = require("./RamCalculationErrorCodes");
const RamCostGenerator_1 = require("../Netscript/RamCostGenerator");
const roundToTwo_1 = require("../utils/helpers/roundToTwo");
const ScriptTransformer_1 = require("../utils/ScriptTransformer");
// Extend acorn-walk to support TypeScript nodes.
(0, acorn_typescript_walk_1.extendAcornWalkForTypeScriptNodes)(walk.base);
// Extend acorn-walk to support JSX nodes.
(0, acorn_jsx_walk_1.extend)(walk.base);
// These special strings are used to reference the presence of a given logical
// construct within a user script.
const specialReferenceIF = "__SPECIAL_referenceIf";
const specialReferenceFOR = "__SPECIAL_referenceFor";
const specialReferenceWHILE = "__SPECIAL_referenceWhile";
// This special string is used to signal that RAM is being overriden for a script.
// It doesn't apply when importing that script.
// The nature of the name guarantees it can never be conflated with a valid identifier.
const specialReferenceRAM = ".^SPECIAL_ramOverride";
// The global scope of a script is registered under this key during parsing.
const memCheckGlobalKey = ".__GLOBAL__";
/** Function for getting a function's ram cost, either from the ramcost function (singularity) or the static cost */
function getNumericCost(cost) {
    return typeof cost === "function" ? cost() : cost;
}
/**
 * Parses code into an AST and walks through it recursively to calculate
 * RAM usage. Also accounts for imported modules.
 * @param ast - AST of the code being parsed
 * @param scriptName - The name of the script that ram needs to be added to
 * @param server - Servername of the scripts for Error Message
 * @param fileTypeFeature
 * @param otherScripts - All other scripts on the server. Used to account for imported scripts
 * */
function parseOnlyRamCalculate(ast, scriptName, server, fileTypeFeature, otherScripts) {
    /**
     * Maps dependent identifiers to their dependencies.
     *
     * The initial identifier is <name of the main script>.__GLOBAL__.
     * It depends on all the functions declared in the module, all the global scopes
     * of its imports, and any identifiers referenced in this global scope. Each
     * function depends on all the identifiers referenced internally.
     * We walk the dependency graph to calculate RAM usage, given that some identifiers
     * reference Netscript functions which have a RAM cost.
     */
    let dependencyMap = {};
    // Scripts we've parsed.
    const completedParses = new Set();
    // Scripts we've discovered that need to be parsed.
    const parseQueue = [];
    // Parses a chunk of code with a given module name, and updates parseQueue and dependencyMap.
    function parseCode(ast, moduleName, fileTypeFeatureOfModule) {
        const result = parseOnlyCalculateDeps(ast, moduleName, fileTypeFeatureOfModule, otherScripts);
        completedParses.add(moduleName);
        // Add any additional modules to the parse queue;
        for (const additionalModule of result.additionalModules) {
            if (!completedParses.has(additionalModule) && !parseQueue.includes(additionalModule)) {
                parseQueue.push(additionalModule);
            }
        }
        // Splice all the references in
        dependencyMap = Object.assign(dependencyMap, result.dependencyMap);
    }
    // Parse the initial module, which is the "main" script that is being run
    const initialModule = scriptName;
    parseCode(ast, initialModule, fileTypeFeature);
    // Process additional modules, which occurs if the "main" script has any imports
    while (parseQueue.length > 0) {
        const nextModule = parseQueue.shift();
        if (nextModule === undefined) {
            throw new Error("nextModule should not be undefined");
        }
        if (nextModule.startsWith("https://") || nextModule.startsWith("http://")) {
            continue;
        }
        const script = otherScripts.get(nextModule);
        if (!script) {
            return {
                errorCode: RamCalculationErrorCodes_1.RamCalculationErrorCode.ImportError,
                errorMessage: `"${nextModule}" does not exist on server: ${server}`,
            };
        }
        const scriptFileType = (0, ScriptTransformer_1.getFileType)(script.filename);
        let moduleAST;
        try {
            moduleAST = (0, ScriptTransformer_1.parseAST)(script.filename, script.server, script.code, scriptFileType);
        }
        catch (error) {
            return {
                errorCode: RamCalculationErrorCodes_1.RamCalculationErrorCode.ImportError,
                errorMessage: `Cannot parse module: ${nextModule}. Filename: ${script.filename}. Reason: ${error instanceof Error ? error.message : String(error)}.`,
            };
        }
        parseCode(moduleAST, nextModule, (0, ScriptTransformer_1.getFileTypeFeature)(scriptFileType));
    }
    // Finally, walk the reference map and generate a ram cost. The initial set of keys to scan
    // are those that start with the name of the main script.
    let ram = RamCostGenerator_1.RamCostConstants.Base;
    const detailedCosts = [{ type: "misc", name: "baseCost", cost: RamCostGenerator_1.RamCostConstants.Base }];
    const unresolvedRefs = Object.keys(dependencyMap).filter((s) => s.startsWith(initialModule));
    const resolvedRefs = new Set();
    const loadedFns = {};
    while (unresolvedRefs.length > 0) {
        const ref = unresolvedRefs.shift();
        if (ref === undefined) {
            throw new Error("ref should not be undefined");
        }
        if (ref.endsWith(specialReferenceRAM)) {
            if (ref !== initialModule + specialReferenceRAM) {
                // All RAM override tokens that *aren't* for the main module should be discarded.
                continue;
            }
            // This is a RAM override for the main module. We can end ram calculation immediately.
            const [first] = dependencyMap[ref];
            const override = Number(first);
            return { cost: override, entries: [{ type: "misc", name: "override", cost: override }] };
        }
        // Check if this is one of the special keys, and add the appropriate ram cost if so.
        if (ref === "hacknet" && !resolvedRefs.has("hacknet")) {
            ram += RamCostGenerator_1.RamCostConstants.HacknetNodes;
            detailedCosts.push({ type: "ns", name: "hacknet", cost: RamCostGenerator_1.RamCostConstants.HacknetNodes });
        }
        if (ref === "document" && !resolvedRefs.has("document")) {
            ram += RamCostGenerator_1.RamCostConstants.Dom;
            detailedCosts.push({ type: "dom", name: "document", cost: RamCostGenerator_1.RamCostConstants.Dom });
        }
        if (ref === "window" && !resolvedRefs.has("window")) {
            ram += RamCostGenerator_1.RamCostConstants.Dom;
            detailedCosts.push({ type: "dom", name: "window", cost: RamCostGenerator_1.RamCostConstants.Dom });
        }
        resolvedRefs.add(ref);
        if (ref.endsWith(".*")) {
            // A prefix reference. We need to find all matching identifiers.
            const prefix = ref.slice(0, ref.length - 2);
            for (const ident of Object.keys(dependencyMap).filter((k) => k.startsWith(prefix))) {
                for (const dep of dependencyMap[ident] || []) {
                    if (!resolvedRefs.has(dep)) {
                        unresolvedRefs.push(dep);
                    }
                }
            }
        }
        else {
            // An exact reference. Add all dependencies of this ref.
            for (const dep of dependencyMap[ref] || []) {
                if (!resolvedRefs.has(dep)) {
                    unresolvedRefs.push(dep);
                }
            }
        }
        // Check if this identifier is a function in the workerScript environment.
        // If it is, then we need to get its RAM cost.
        try {
            // Only count each function once
            if (loadedFns[ref]) {
                continue;
            }
            loadedFns[ref] = true;
            // This accounts for namespaces (Bladeburner, CodingContract, etc.)
            const findFunc = (prefix, obj, ref) => {
                if (!obj) {
                    return;
                }
                const elem = Object.entries(obj).find(([key]) => key === ref);
                if (elem !== undefined && (typeof elem[1] === "function" || typeof elem[1] === "number")) {
                    return { func: elem[1], refDetail: `${prefix}${ref}` };
                }
                for (const [key, value] of Object.entries(obj)) {
                    const found = findFunc(`${key}.`, value, ref);
                    if (found) {
                        return found;
                    }
                }
                return undefined;
            };
            const details = findFunc("", RamCostGenerator_1.RamCosts, ref);
            const fnRam = getNumericCost(details?.func ?? 0);
            ram += fnRam;
            detailedCosts.push({ type: "fn", name: details?.refDetail ?? "", cost: fnRam });
        }
        catch (error) {
            console.error(error);
            continue;
        }
    }
    if (ram > RamCostGenerator_1.RamCostConstants.Max) {
        ram = RamCostGenerator_1.RamCostConstants.Max;
        detailedCosts.push({ type: "misc", name: "Max Ram Cap", cost: RamCostGenerator_1.RamCostConstants.Max });
    }
    return { cost: ram, entries: detailedCosts.filter((e) => e.cost > 0) };
}
function checkInfiniteLoop(ast, code) {
    function nodeHasTrueTest(node) {
        return node.type === "Literal" && "raw" in node && (node.raw === "true" || node.raw === "1");
    }
    function hasAwait(ast) {
        let hasAwait = false;
        walk.recursive(ast, {}, {
            AwaitExpression: () => {
                hasAwait = true;
            },
        });
        return hasAwait;
    }
    const possibleLines = [];
    walk.recursive(ast, // Pretend that ast is an acorn node
    {}, {
        WhileStatement: (node, st, walkDeeper) => {
            const previousLines = code.slice(0, node.start).trimEnd().split("\n");
            const lineNumber = previousLines.length + 1;
            if (previousLines[previousLines.length - 1].match(/^\s*\/\/\s*@ignore-infinite/)) {
                return;
            }
            if (nodeHasTrueTest(node.test) && !hasAwait(node)) {
                possibleLines.push(lineNumber);
            }
            else {
                node.body && walkDeeper(node.body, st);
            }
        },
    });
    return possibleLines;
}
/**
 * Helper function that parses a single script. It returns a map of all dependencies,
 * which are items in the code's AST that potentially need to be evaluated
 * for RAM usage calculations. It also returns an array of additional modules
 * that need to be parsed (i.e. are 'import'ed scripts).
 */
function parseOnlyCalculateDeps(ast, currentModule, fileTypeFeature, otherScripts) {
    // Everything from the global scope goes in ".". Everything else goes in ".function", where only
    // the outermost layer of functions counts.
    const globalKey = currentModule + memCheckGlobalKey;
    const dependencyMap = {};
    dependencyMap[globalKey] = new Set();
    // If we reference this internal name, we're really referencing that external name.
    // Filled when we import names from other modules.
    const internalToExternal = {};
    const additionalModules = [];
    // References get added pessimistically. They are added for thisModule.name, name, and for
    // any aliases.
    function addRef(key, name, module = currentModule) {
        const s = dependencyMap[key] || (dependencyMap[key] = new Set());
        const external = internalToExternal[name];
        if (external !== undefined) {
            s.add(external);
        }
        s.add(module + "." + name);
        s.add(name); // For builtins like hack.
    }
    //A list of identifiers that resolve to "native Javascript code"
    const objectPrototypeProperties = Object.getOwnPropertyNames(Object.prototype);
    function checkRamOverride(node) {
        // To trigger a syntactic RAM override, the first statement must be a call
        // to ns.ramOverride() (or something that looks similar).
        if (!node.body || !node.body.length)
            return;
        const statement = node.body[0];
        if (statement.type !== "ExpressionStatement")
            return;
        const expr = statement.expression;
        if (expr.type !== "CallExpression")
            return;
        if (!expr.arguments || expr.arguments.length !== 1)
            return;
        /**
         * This function is called with expr.callee. expr.callee can be Expression or Super. In its implementation, the
         * "node" parameter can be reassigned to node.property if "node" is MemberExpression. node.property may be
         * PrivateIdentifier, so we need to add that type to the type list of "node".
         */
        function findIdentifier(node) {
            for (;;) {
                // Find the identifier node attached to the call
                switch (node.type) {
                    case "ParenthesizedExpression":
                    case "ChainExpression":
                        node = node.expression;
                        break;
                    case "MemberExpression":
                        node = node.property;
                        break;
                    default:
                        return node;
                }
            }
        }
        const idNode = findIdentifier(expr.callee);
        if (idNode.type !== "Identifier" || idNode.name !== "ramOverride")
            return;
        // For the time being, we only handle simple literals for the argument.
        // If needed, this could be extended to simple constant expressions.
        const literal = expr.arguments[0];
        if (literal.type !== "Literal")
            return;
        const value = literal.value;
        if (typeof value !== "number")
            return;
        // Finally, we know the syntax checks out for applying the RAM override.
        // But the value might be illegal.
        if (!isFinite(value) || value < RamCostGenerator_1.RamCostConstants.Base)
            return;
        // This is an unusual arrangement; the "function name" here is our special
        // case, and it is "depending on" the stringified value of our ram override
        // (which is not any kind of identifier).
        dependencyMap[currentModule + specialReferenceRAM] = new Set([(0, roundToTwo_1.roundToTwo)(value).toString()]);
    }
    // If we discover a dependency identifier, state.key is the dependent identifier.
    // walkDeeper is for doing recursive walks of expressions in composites that we handle.
    function commonVisitors() {
        return {
            Identifier: (node, st) => {
                if (objectPrototypeProperties.includes(node.name)) {
                    return;
                }
                addRef(st.key, node.name);
            },
            WhileStatement: (node, st, walkDeeper) => {
                addRef(st.key, specialReferenceWHILE);
                node.test && walkDeeper(node.test, st);
                node.body && walkDeeper(node.body, st);
            },
            DoWhileStatement: (node, st, walkDeeper) => {
                addRef(st.key, specialReferenceWHILE);
                node.test && walkDeeper(node.test, st);
                node.body && walkDeeper(node.body, st);
            },
            ForStatement: (node, st, walkDeeper) => {
                addRef(st.key, specialReferenceFOR);
                node.init && walkDeeper(node.init, st);
                node.test && walkDeeper(node.test, st);
                node.update && walkDeeper(node.update, st);
                node.body && walkDeeper(node.body, st);
            },
            IfStatement: (node, st, walkDeeper) => {
                addRef(st.key, specialReferenceIF);
                node.test && walkDeeper(node.test, st);
                node.consequent && walkDeeper(node.consequent, st);
                node.alternate && walkDeeper(node.alternate, st);
            },
            MemberExpression: (node, st, walkDeeper) => {
                node.object && walkDeeper(node.object, st);
                node.property && walkDeeper(node.property, st);
            },
        };
    }
    walk.recursive(ast, // Pretend that ast is an acorn node
    { key: globalKey }, Object.assign({
        ImportDeclaration: (node, st) => {
            const rawImportModuleName = node.source.value;
            if (typeof rawImportModuleName !== "string") {
                console.error("Invalid node when walking ImportDeclaration in parseOnlyCalculateDeps. node:", node);
                return;
            }
            // Skip these modules. They are popular path aliases of NetscriptDefinitions.d.ts.
            if (fileTypeFeature.isTypeScript && (rawImportModuleName === "@nsdefs" || rawImportModuleName === "@ns")) {
                return;
            }
            const importModuleName = (0, ScriptTransformer_1.getModuleScript)(rawImportModuleName, currentModule, otherScripts).filename;
            additionalModules.push(importModuleName);
            // This module's global scope refers to that module's global scope, no matter how we
            // import it.
            const set = dependencyMap[st.key];
            if (set === undefined)
                throw new Error("set should not be undefined");
            set.add(importModuleName + memCheckGlobalKey);
            for (let i = 0; i < node.specifiers.length; ++i) {
                const spec = node.specifiers[i];
                /**
                 * spec can be ImportSpecifier, ImportDefaultSpecifier, or ImportNamespaceSpecifier. "imported" only exists
                 * in ImportSpecifier. "imported" can be Identifier or Literal. imported.name only exists in Identifier.
                 */
                if (spec.type === "ImportSpecifier" && spec.imported.type === "Identifier" && spec.local !== undefined) {
                    // We depend on specific things.
                    internalToExternal[spec.local.name] = importModuleName + "." + spec.imported.name;
                }
                else {
                    // We depend on everything.
                    const set = dependencyMap[st.key];
                    if (set === undefined)
                        throw new Error("set should not be undefined");
                    set.add(importModuleName + ".*");
                }
            }
        },
        FunctionDeclaration: (node) => {
            if (node.id?.name === "main") {
                checkRamOverride(node.body);
            }
            // node.id will be null when using 'export default'. Add a module name indicating the default export.
            const key = currentModule + "." + (node.id === null ? "__SPECIAL_DEFAULT_EXPORT__" : node.id.name);
            walk.recursive(node, { key: key }, commonVisitors());
        },
        ExportNamedDeclaration: (node, st, walkDeeper) => {
            if (node.declaration != null) {
                // if this is true, the statement is not a named export, but rather a exported function/variable
                walkDeeper(node.declaration, st);
                return;
            }
            for (const specifier of node.specifiers) {
                /**
                 * specifier.exported can be Identifier or Literal. specifier.exported.name only exists in Identifier.
                 */
                if (specifier.exported.type === "Literal") {
                    continue;
                }
                const exportedDepName = currentModule + "." + specifier.exported.name;
                /**
                 * We need to use specifier.local.name and node.source.value. Before doing that, we need to check if they
                 * exist. local.name only exists in Identifier.
                 */
                if (node.source != null && typeof node.source.value === "string" && specifier.local.type === "Identifier") {
                    // if this is true, we are re-exporting something
                    addRef(exportedDepName, specifier.local.name, node.source.value);
                    additionalModules.push(node.source.value);
                }
                else if (specifier.local.type === "Identifier" && specifier.exported.name !== specifier.local.name) {
                    // this makes sure we are not referring to ourselves
                    // if this is not true, we don't need to add anything
                    addRef(exportedDepName, specifier.local.name);
                }
            }
        },
    }, commonVisitors()));
    return { dependencyMap: dependencyMap, additionalModules: additionalModules };
}
/**
 * Calculate RAM usage of a script
 *
 * @param input - Code's AST or code of the script
 * @param scriptName - The script's name. Used to resolve relative paths
 * @param server - Servername of the scripts for Error Message
 * @param otherScripts - Other scripts on the server
 * @returns
 */
function calculateRamUsage(input, scriptName, server, otherScripts) {
    try {
        const fileType = (0, ScriptTransformer_1.getFileType)(scriptName);
        const ast = typeof input === "string" ? (0, ScriptTransformer_1.parseAST)(scriptName, server, input, fileType) : input;
        return parseOnlyRamCalculate(ast, scriptName, server, (0, ScriptTransformer_1.getFileTypeFeature)(fileType), otherScripts);
    }
    catch (error) {
        return {
            errorCode: error instanceof ScriptTransformer_1.ModuleResolutionError
                ? RamCalculationErrorCodes_1.RamCalculationErrorCode.ImportError
                : RamCalculationErrorCodes_1.RamCalculationErrorCode.SyntaxError,
            errorMessage: error instanceof Error ? error.message : String(error),
        };
    }
}
