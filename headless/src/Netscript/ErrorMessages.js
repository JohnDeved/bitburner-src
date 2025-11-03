"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = log;
exports.parseBlobUrlInMessage = parseBlobUrlInMessage;
exports.basicErrorMessage = basicErrorMessage;
exports.errorMessage = errorMessage;
/** Log a message to a script's logs */
function log(ctx, message) {
    ctx.workerScript.log(ctx.functionPath, message);
}
/** Error messages may contain blob URLs (). This function replaces those URLs with the script names. */
function parseBlobUrlInMessage(ws, msg) {
    for (const [scriptUrl, script] of ws.scriptRef.dependencies) {
        msg = msg.replaceAll(scriptUrl, script.filename);
    }
    return msg;
}
/** Creates an error message string containing hostname, scriptname, and the error message msg */
function basicErrorMessage(ws, msg, type = "RUNTIME") {
    return `${type} ERROR\n${ws.name}@${ws.hostname} (PID - ${ws.pid})\n\n${parseBlobUrlInMessage(ws, msg)}`;
}
/**
 * Creates an error message string with a stack trace.
 *
 * When the player provides invalid input, we try to provide a stack trace that points to the player's invalid caller,
 * but we don't have an error instance with a stack trace. In order to get that stack trace, we create a new error
 * instance, then remove "unrelated" traces (code in our codebase) and leave only traces of the player's code.
 */
function errorMessage(ctx, msg, type = "RUNTIME") {
    const errstack = new Error().stack;
    if (errstack === undefined)
        throw new Error("how did we not throw an error?");
    const stack = errstack.split("\n").slice(1);
    const ws = ctx.workerScript;
    const caller = ctx.functionPath;
    const userstack = [];
    for (const stackline of stack) {
        const filename = (() => {
            // Check urls for dependencies
            for (const [url, script] of ws.scriptRef.dependencies)
                if (stackline.includes(url))
                    return script.filename;
            // Check for filenames directly if no URL found
            if (stackline.includes(ws.scriptRef.filename))
                return ws.scriptRef.filename;
            for (const script of ws.scriptRef.dependencies.values()) {
                if (stackline.includes(script.filename))
                    return script.filename;
            }
        })();
        if (!filename)
            continue;
        let call = { line: "-1", func: "unknown" };
        const chromeCall = parseChromeStackline(stackline);
        if (chromeCall) {
            call = chromeCall;
        }
        const firefoxCall = parseFirefoxStackline(stackline);
        if (firefoxCall) {
            call = firefoxCall;
        }
        userstack.push(`${filename}:L${call.line}@${call.func}`);
    }
    log(ctx, () => msg);
    let rejectMsg = `${caller}: ${msg}`;
    if (userstack.length !== 0)
        rejectMsg += `\n\nStack:\n${userstack.join("\n")}`;
    return basicErrorMessage(ws, rejectMsg, type);
    function parseChromeStackline(line) {
        const lineMatch = line.match(/.*:(\d+):\d+.*/);
        const funcMatch = line.match(/.*at (.+) \(.*/);
        if (lineMatch && funcMatch)
            return { line: lineMatch[1], func: funcMatch[1] };
        return null;
    }
    function parseFirefoxStackline(line) {
        const lineMatch = line.match(/.*:(\d+):\d+$/);
        const lio = line.lastIndexOf("@");
        if (lineMatch && lio !== -1)
            return { line: lineMatch[1], func: line.slice(0, lio) };
        return null;
    }
}
