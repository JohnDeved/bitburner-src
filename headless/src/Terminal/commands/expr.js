"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expr = expr;
const Terminal_1 = require("../../Terminal");
function expr(args) {
    if (args.length === 0) {
        Terminal_1.Terminal.error("Incorrect usage of expr command. Usage: expr [math expression]");
        return;
    }
    const expr = args.join("");
    // Sanitize the math expression
    const sanitizedExpr = expr.replace(/[^-()\deE/*+.%]/g, "");
    let result;
    try {
        result = String(eval?.(sanitizedExpr));
    }
    catch (e) {
        Terminal_1.Terminal.error(`Could not evaluate expression: ${sanitizedExpr}. Error: ${e}.`);
        return;
    }
    Terminal_1.Terminal.print(result);
}
