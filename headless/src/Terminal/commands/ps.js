"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ps = ps;
const Terminal_1 = require("../../Terminal");
const scriptKey_1 = require("../../utils/helpers/scriptKey");
const arg_1 = __importDefault(require("arg"));
function ps(args, server) {
    let flags;
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
        flags = (0, arg_1.default)({
            "--grep": String,
            "-g": "--grep",
        }, { argv: args });
    }
    catch (e) {
        // catch passing only -g / --grep with no string to use as the search
        Terminal_1.Terminal.error("Incorrect usage of ps command. Usage: ps [-g, --grep pattern]");
        return;
    }
    let pattern = flags["--grep"];
    if (!pattern) {
        pattern = ".*"; // Match anything
    }
    const re = (0, scriptKey_1.matchScriptPathUnanchored)(pattern);
    for (const [k, byPid] of server.runningScriptMap) {
        if (!re.test(k))
            continue;
        for (const rsObj of byPid.values()) {
            const res = `(PID - ${rsObj.pid}) ${rsObj.filename} ${rsObj.args.join(" ")}`;
            Terminal_1.Terminal.print(res);
        }
    }
}
