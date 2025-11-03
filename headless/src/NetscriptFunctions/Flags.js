"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flags = Flags;
const toNative_1 = require("./toNative");
const arg_1 = __importDefault(require("arg"));
function Flags(ctx) {
    const vargs = Array.isArray(ctx) ? ctx : ctx.workerScript.args;
    return (schema) => {
        schema = (0, toNative_1.toNative)(schema);
        if (!Array.isArray(schema))
            throw new Error("flags schema passed in is invalid.");
        const args = {};
        for (const d of schema) {
            let t = String;
            if (typeof d[1] === "number") {
                t = Number;
            }
            else if (typeof d[1] === "boolean") {
                t = Boolean;
            }
            else if (Array.isArray(d[1])) {
                t = [String];
            }
            const numDashes = d[0].length > 1 ? 2 : 1;
            args["-".repeat(numDashes) + d[0]] = t;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
        const ret = (0, arg_1.default)(args, { argv: vargs });
        for (const d of schema) {
            if (!Object.hasOwn(ret, "--" + d[0]) || !Object.hasOwn(ret, "-" + d[0]))
                ret[d[0]] = d[1];
        }
        for (const key of Object.keys(ret)) {
            if (!key.startsWith("-"))
                continue;
            const value = ret[key];
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete ret[key];
            const numDashes = key.length === 2 ? 1 : 2;
            ret[key.slice(numDashes)] = value;
        }
        return ret;
    };
}
