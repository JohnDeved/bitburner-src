"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayError = void 0;
const GameRoot_1 = require("../ui/GameRoot");
const _enums_1 = require("@enums");
const ErrorState_1 = require("./ErrorState");
const ErrorMessages_1 = require("../Netscript/ErrorMessages");
let currentId = 0;
const DisplayError = (message, errorType, ws = null) => {
    const scriptName = ws?.scriptRef?.filename ?? "";
    const hostname = ws?.hostname ?? "";
    const pid = ws?.pid ?? -1;
    const parsedMessage = ws ? (0, ErrorMessages_1.parseBlobUrlInMessage)(ws, message) : message;
    const errorPageOpen = GameRoot_1.Router.page() === _enums_1.SimplePage.RecentErrors;
    if (!errorPageOpen) {
        ErrorState_1.ErrorState.UnreadErrors++;
    }
    const prior = findExistingErrorCopy(parsedMessage, hostname);
    if (prior) {
        prior.occurrences++;
        prior.time = new Date();
        if (pid !== -1) {
            prior.pid = pid;
        }
        prior.server = hostname;
        prior.message = parsedMessage;
        updateActiveError(prior);
    }
    else {
        ErrorState_1.ErrorState.Errors.unshift({
            id: currentId++,
            server: hostname,
            errorType,
            scriptName,
            message: parsedMessage,
            pid,
            occurrences: 1,
            time: new Date(),
            unread: !errorPageOpen,
        });
        while (ErrorState_1.ErrorState.Errors.length > 100) {
            ErrorState_1.ErrorState.Errors.pop();
        }
        updateActiveError(ErrorState_1.ErrorState.Errors[0]);
    }
};
exports.DisplayError = DisplayError;
function findExistingErrorCopy(message, hostname) {
    const serverAgnosticMessage = message.replaceAll(hostname, "<server>");
    return (ErrorState_1.ErrorState.Errors.find((e) => e.message.replaceAll(e.server, "<server>") === serverAgnosticMessage || e.message === message) ?? null);
}
function updateActiveError(error) {
    if (!ErrorState_1.ErrorState.ActiveError && !(0, ErrorState_1.errorModalsAreSuppressed)()) {
        ErrorState_1.ErrorState.ActiveError = error;
        ErrorState_1.ErrorState.ErrorUpdate.emit(ErrorState_1.ErrorState.ActiveError);
    }
}
