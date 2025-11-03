"use strict";
// General reusable tools for API breaks
Object.defineProperty(exports, "__esModule", { value: true });
exports.showAPIBreaks = showAPIBreaks;
const _player_1 = require("@player");
const AllServers_1 = require("../../Server/AllServers");
const TextFilePath_1 = require("../../Paths/TextFilePath");
const DialogBox_1 = require("../../ui/React/DialogBox");
const Terminal_1 = require("../../Terminal");
const I18nUtils_1 = require("../I18nUtils");
// Temporary until fixing alerts manager to store alerts outside of react scope
const dialogBoxCreate = (text) => setTimeout(() => {
    (0, DialogBox_1.dialogBoxCreate)(text, { html: false, canBeDismissedEasily: false });
}, 2000);
function detectImpactAndMigrateLines(script, brokenFunctions) {
    const impactedLines = [];
    const lines = script.content.split("\n");
    for (let i = 0; i < lines.length; ++i) {
        for (const brokenFunction of brokenFunctions) {
            if (!lines[i].includes(brokenFunction.name) &&
                (!brokenFunction.migration || !lines[i].match(brokenFunction.migration.searchValue))) {
                continue;
            }
            impactedLines.push(i + 1);
            if (brokenFunction.migration) {
                lines[i] = lines[i].replaceAll(brokenFunction.migration.searchValue, brokenFunction.migration.replaceValue);
            }
        }
    }
    script.content = lines.join("\n");
    return impactedLines.length ? impactedLines : null;
}
/** Returns a map keyed by hostname */
function detectImpactAndMigrate(brokenFunctions) {
    const returnMap = new Map();
    let totalDetectedLines = 0;
    for (const server of (0, AllServers_1.GetAllServers)()) {
        const impactedScripts = new Map();
        for (const [filename, script] of server.scripts) {
            const impactedLines = detectImpactAndMigrateLines(script, brokenFunctions);
            if (impactedLines) {
                totalDetectedLines += impactedLines.length;
                impactedScripts.set(filename, impactedLines);
            }
        }
        if (impactedScripts.size) {
            returnMap.set(server.hostname, impactedScripts);
        }
    }
    return { impactMap: returnMap, totalDetectedLines };
}
/** Show the player a dialog for their API breaks, and save an info file for the player to review later */
function showAPIBreaks(version, { additionalText, apiBreakingChanges }) {
    const details = [];
    let numberOfWarnings = 0;
    for (const breakInfo of apiBreakingChanges) {
        const scanResult = detectImpactAndMigrate(breakInfo.brokenAPIs);
        const impactMap = scanResult.impactMap;
        // Skip processing if we don't find any affected code and the breaking change does not enable the "doNotSkip" flag.
        if (impactMap.size === 0 && !breakInfo.doNotSkip) {
            continue;
        }
        let detailText = breakInfo.info;
        if (impactMap.size > 0) {
            detailText +=
                `\n\nUsage of the following functions may have been affected:\n${breakInfo.brokenAPIs
                    .map((func) => func.name)
                    .join("\n")}\n\n` +
                    [...impactMap]
                        .map(([hostname, scriptImpactMap]) => `Potentially affected files on server ${hostname} (with line numbers):\n` +
                        [...scriptImpactMap]
                            .map(([filename, lineNumbers]) => `${filename}: (${(0, I18nUtils_1.pluralize)(lineNumbers.length, "Line number", undefined, true)}: ${lineNumbers.join(", ")})`)
                            .join("\n"))
                        .join("\n\n");
        }
        details.push({
            apiBreakInfo: breakInfo,
            text: detailText,
            totalDetectedLines: scanResult.totalDetectedLines,
            showWarning: breakInfo.showWarning,
        });
        if (breakInfo.showWarning) {
            ++numberOfWarnings;
        }
    }
    if (!details.length) {
        return;
    }
    const textFileName = (0, TextFilePath_1.resolveTextFilePath)(`APIBreakInfo-${version}.txt`);
    if (!textFileName) {
        throw new Error("Version string created an invalid API break file name");
    }
    _player_1.Player.getHomeComputer().writeToTextFile(textFileName, `API BREAK INFO FOR ${version}\n\n${details.map((detail) => detail.text).join("\n\n\n\n")}`);
    Terminal_1.Terminal.warn(`AN API BREAK FROM VERSION ${version} MAY HAVE AFFECTED SOME OF YOUR SCRIPTS.`);
    Terminal_1.Terminal.warn(`INFORMATION ABOUT THIS POTENTIAL IMPACT HAS BEEN LOGGED IN ${textFileName} ON YOUR HOME COMPUTER.`);
    dialogBoxCreate(`SOME OF YOUR SCRIPTS HAVE POTENTIALLY BEEN IMPACTED BY AN API BREAK, DUE TO CHANGES IN VERSION ${version}\n\n` +
        "The following dialog boxes will provide details of the potential impact to your scripts.\n" +
        `A file with these details has also been saved on your home computer under filename ${textFileName}.` +
        (additionalText ? `\n\n${additionalText}` : ""));
    let warningIndex = 0;
    for (const detail of details) {
        if (!detail.showWarning) {
            continue;
        }
        Terminal_1.Terminal.warn(`\nAPI BREAK VERSION ${version} DETAILS ${warningIndex + 1} of ${numberOfWarnings}\n\n${detail.apiBreakInfo.info}` +
            /**
             * If we can detect the affected lines via apiBreakInfo.brokenAPIs, we will show the number of affected lines.
             * However, some breaking changes cannot be reliably detected, so we intentionally leave apiBreakInfo.brokenAPIs
             * empty. With these changes, the number of affected lines is always 0, but saying that there are no affected
             * lines is misleading, so we won't say anything about the number of affected lines.
             */
            (detail.apiBreakInfo.brokenAPIs.length > 0
                ? `\n\nWe found ${(0, I18nUtils_1.pluralize)(detail.totalDetectedLines, "affected line")}.`
                : ""));
        ++warningIndex;
    }
}
