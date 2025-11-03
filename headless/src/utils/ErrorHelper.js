"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newIssueUrl = void 0;
exports.parseUnknownError = parseUnknownError;
exports.getErrorMessageWithStackAndCause = getErrorMessageWithStackAndCause;
exports.getCrashReportMetadata = getCrashReportMetadata;
exports.getCrashReport = getCrashReport;
const commitHash_1 = require("./helpers/commitHash");
const Constants_1 = require("../Constants");
var GameEnv;
(function (GameEnv) {
    GameEnv[GameEnv["Production"] = 0] = "Production";
    GameEnv[GameEnv["Development"] = 1] = "Development";
})(GameEnv || (GameEnv = {}));
var Platform;
(function (Platform) {
    Platform[Platform["Browser"] = 0] = "Browser";
    Platform[Platform["Steam"] = 1] = "Steam";
})(Platform || (Platform = {}));
exports.newIssueUrl = `https://github.com/bitburner-official/bitburner-src/issues/new`;
function parseUnknownError(error) {
    const errorAsString = String(error);
    let stack = undefined;
    let causeAsString = undefined;
    let causeStack = undefined;
    if (error instanceof Error) {
        stack = error.stack;
        if (error.cause != null) {
            causeAsString = String(error.cause);
            if (error.cause instanceof Error) {
                causeStack = error.cause.stack;
            }
        }
    }
    return {
        errorAsString,
        stack,
        causeAsString,
        causeStack,
    };
}
function getErrorMessageWithStackAndCause(error, prefix = "") {
    const errorData = parseUnknownError(error);
    let errorMessage = `${prefix}${errorData.errorAsString}`;
    if (errorData.stack) {
        errorMessage += `\n\nStack: ${errorData.stack}`;
    }
    if (errorData.causeAsString) {
        errorMessage += `\nError cause: ${errorData.causeAsString}`;
        if (errorData.causeStack) {
            errorMessage += `\nCause stack: ${errorData.causeStack}`;
        }
    }
    return errorMessage;
}
function getCrashReportMetadata(error, reactErrorInfo, page) {
    const isElectron = navigator.userAgent.toLowerCase().includes(" electron/");
    const env = process.env.NODE_ENV === "development" ? GameEnv.Development : GameEnv.Production;
    const version = {
        version: Constants_1.CONSTANTS.VersionString,
        commitHash: (0, commitHash_1.commitHash)(),
        toDisplay: () => `v${Constants_1.CONSTANTS.VersionString} (${(0, commitHash_1.commitHash)()})`,
    };
    const browserFeatures = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        indexedDb: !!window.indexedDB,
    };
    const errorObj = typeof error === "object" && error !== null ? error : {};
    return {
        platform: isElectron ? Platform.Steam : Platform.Browser,
        environment: env,
        version,
        browserFeatures,
        error: errorObj,
        reactErrorInfo,
        page,
    };
}
function getCrashReport(error, reactErrorInfo, page) {
    const metadata = getCrashReportMetadata(error, reactErrorInfo, page);
    const errorData = parseUnknownError(error);
    const fileName = String(metadata.error.fileName);
    const features = `lang=${metadata.browserFeatures.language} cookiesEnabled=${metadata.browserFeatures.cookiesEnabled.toString()}` +
        ` doNotTrack=${metadata.browserFeatures.doNotTrack ?? "null"} indexedDb=${metadata.browserFeatures.indexedDb.toString()}`;
    const title = `${metadata.error.name}: ${metadata.error.message} (at "${metadata.page}")`;
    let causeAndCauseStack = errorData.causeAsString
        ? `
### Error cause: ${errorData.causeAsString}
`
        : "";
    if (errorData.causeStack) {
        causeAndCauseStack += `Cause stack:
\`\`\`
${errorData.causeStack}
\`\`\`
`;
    }
    const body = `
## ${title}

### How did this happen?

Please fill this information with details if relevant.

- [ ] Save file
- [ ] Minimal scripts to reproduce the issue
- [ ] Steps to reproduce

### Environment

* Error: ${errorData.errorAsString ?? "n/a"}
* Page: ${metadata.page ?? "n/a"}
* Version: ${metadata.version.toDisplay()}
* Environment: ${GameEnv[metadata.environment]}
* Platform: ${Platform[metadata.platform]}
* UserAgent: ${navigator.userAgent}
* Features: ${features}
* Source: ${fileName ?? "n/a"}

### Stack Trace
\`\`\`
${errorData.stack}
\`\`\`
${causeAndCauseStack}
### React Component Stack
\`\`\`
${metadata.reactErrorInfo?.componentStack}
\`\`\`

### Save
\`\`\`
Copy your save here if possible
\`\`\`
`.trim();
    const issueUrl = `${exports.newIssueUrl}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    return {
        metadata,
        title,
        body,
        issueUrl,
    };
}
