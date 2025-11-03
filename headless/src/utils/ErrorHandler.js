"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUnknownError = handleUnknownError;
exports.handleGetSaveDataInfoError = handleGetSaveDataInfoError;
const ScriptDeath_1 = require("../Netscript/ScriptDeath");
const DialogBox_1 = require("../ui/React/DialogBox");
const ErrorHelper_1 = require("./ErrorHelper");
const DisplayError_1 = require("../ErrorHandling/DisplayError");
/** Generate an error dialog when workerscript is known */
function handleUnknownError(e, ws = null, initialText = "") {
    if (e instanceof ScriptDeath_1.ScriptDeath) {
        // No dialog for ScriptDeath
        return;
    }
    if (ws && typeof e === "string") {
        /**
         * - Attempt to strip out the error type, if present.
         * - Extract error text by skipping:
         *   - Error type
         *   - Script name and PID
         *
         * Error example:
         * "RUNTIME ERROR\ntest.js@home (PID - 1)\n\ngetServer: Invalid hostname: 'invalid'\n\nStack:\ntest.js:L5@main"
         *
         * - errorType: "RUNTIME"
         * - errorText: "getServer: Invalid hostname: 'invalid'\n\nStack:\ntest.js:L5@main"
         */
        const errorType = e.match(/^(\w+) ERROR/)?.[1];
        if (errorType) {
            const errorText = e.split(/\n/).slice(3).join("\n");
            (0, DisplayError_1.DisplayError)(initialText + errorText, errorType, ws);
            return;
        }
        (0, DisplayError_1.DisplayError)(initialText + e, "RUNTIME", ws);
    }
    else if (e instanceof SyntaxError) {
        (0, DisplayError_1.DisplayError)(initialText + (0, ErrorHelper_1.getErrorMessageWithStackAndCause)(e), "SYNTAX", ws);
    }
    else if (e instanceof Error) {
        // Ignore any cancellation errors from Monaco that get here
        if (e.name === "Canceled" && e.message === "Canceled") {
            return;
        }
        if (ws) {
            console.error(`An error was thrown in your script. Hostname: ${ws.hostname}, script name: ${ws.name}.`);
        }
        /**
         * If e is an instance of Error, we print it to the console. This is especially useful when debugging a TypeScript
         * script. The stack trace in the error popup contains only the trace of the transpiled code. Even with a source
         * map, parsing it to get the relevant info from the original TypeScript file is complicated. The built-in developer
         * tool of browsers will do that for us if we print the error to the console.
         */
        console.error(e);
        (0, DisplayError_1.DisplayError)(initialText + (0, ErrorHelper_1.getErrorMessageWithStackAndCause)(e), getErrorType(e.stack) ?? "RUNTIME", ws);
    }
    else if (typeof e !== "string") {
        console.error("Unexpected error:", e);
        const msg = `Unexpected type of error thrown. This error was likely thrown manually within a script.
        Error has been logged to the console.\n\nType of error: ${typeof e}\nValue of error: ${e}`;
        (0, DisplayError_1.DisplayError)(msg, "UNKNOWN", ws);
    }
}
/** Use this handler to handle the error when we call getSaveData function or getSaveInfo function */
function handleGetSaveDataInfoError(error, fromGetSaveInfo = false) {
    console.error(error);
    let errorMessage = `Cannot get save ${fromGetSaveInfo ? "info" : "data"}. Error: ${error}.`;
    if (error instanceof RangeError) {
        errorMessage += " This may be because the save data is too large.";
    }
    if (error instanceof Error && error.stack) {
        errorMessage += `\nStack:\n${error.stack}`;
    }
    (0, DialogBox_1.dialogBoxCreate)(errorMessage);
}
function getErrorType(e = "") {
    if (e.toLowerCase().includes("typeerror")) {
        return "TYPE";
    }
    if (e.toLowerCase().includes("syntaxerror")) {
        return "SYNTAX";
    }
    if (e.toLowerCase().includes("referenceerror")) {
        return "REFERENCE";
    }
    if (e.toLowerCase().includes("rangeerror")) {
        return "RANGE";
    }
    // Check if the first line contains an error type
    const match = e.match(/^\s*([A-Z]+)\s+ERROR/);
    return match?.[1];
}
