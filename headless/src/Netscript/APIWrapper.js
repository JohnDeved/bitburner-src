"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NSProxy = NSProxy;
exports.setRemovedFunctions = setRemovedFunctions;
const RamCostGenerator_1 = require("./RamCostGenerator");
const NetscriptHelpers_1 = require("./NetscriptHelpers");
class NSProxyHandler {
    constructor(ws, ns, tree, additionalData) {
        this.memoed = {};
        this.ns = ns;
        this.ws = ws;
        this.tree = tree;
        this.additionalData = additionalData;
        Object.assign(this.memoed, additionalData);
    }
    has(__target, key) {
        return Reflect.has(this.ns, key) || Reflect.has(this.additionalData, key);
    }
    ownKeys(__target) {
        return [...Reflect.ownKeys(this.ns), ...Reflect.ownKeys(this.additionalData)];
    }
    getOwnPropertyDescriptor(__target, key) {
        if (!this.has(__target, key))
            return undefined;
        if (Object.hasOwn(this.memoed, key))
            return Object.getOwnPropertyDescriptor(this.memoed, key);
        this.get(__target, key, this);
        return Object.getOwnPropertyDescriptor(this.memoed, key);
    }
    defineProperty(__target, __key, __attrs) {
        throw new TypeError("ns instances are not modifiable!");
    }
    set(__target, __key, __attrs) {
        // Redundant with defineProperty, but we'll be explicit
        throw new TypeError("ns instances are not modifiable!");
    }
    get(__target, key, __receiver) {
        const ours = this.memoed[key];
        if (ours)
            return ours;
        const descriptor = Object.getOwnPropertyDescriptor(this.ns, key);
        if (!descriptor)
            return descriptor;
        const field = descriptor.value;
        if (typeof field === "function") {
            const arrayPath = [...this.tree, key];
            const functionPath = arrayPath.join(".");
            const ctx = { workerScript: this.ws, function: key, functionPath };
            // Only do the context-binding once, instead of each time the function
            // is called.
            const func = field(ctx);
            const wrappedFunction = function (...args) {
                // What remains *must* be called every time.
                NetscriptHelpers_1.helpers.checkEnvFlags(ctx);
                NetscriptHelpers_1.helpers.updateDynamicRam(ctx, (0, RamCostGenerator_1.getRamCost)(arrayPath));
                return func(...args);
            };
            Object.defineProperty(this.memoed, key, { ...descriptor, value: wrappedFunction });
            return wrappedFunction;
        }
        if (typeof field === "object") {
            return (this.memoed[key] = NSProxy(this.ws, field, [...this.tree, key]));
        }
        console.warn(`Unexpected data while wrapping API.`, "tree:", this.tree, "key:", key, "field:", field);
        throw new Error("Error while wrapping netscript API. See console.");
    }
}
function NSProxy(ws, ns, tree, additionalData = {}) {
    const handler = new NSProxyHandler(ws, ns, tree, additionalData);
    // We target an empty Object, so that unproxied methods don't do anything.
    // We *can't* freeze the target, because it would break invariants on ownKeys.
    return new Proxy({}, handler);
}
function setRemovedFunctions(api, infos) {
    for (const [key, { version, replacement, replaceMsg }] of Object.entries(infos)) {
        Object.defineProperty(api, key, {
            value: (ctx) => () => {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Function removed in ${version}. ${replaceMsg ? replacement : `Please use ${replacement} instead.`}`, "REMOVED FUNCTION");
            },
            configurable: true,
            enumerable: false,
        });
    }
}
