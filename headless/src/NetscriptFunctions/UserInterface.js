"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetscriptUserInterface = NetscriptUserInterface;
const Settings_1 = require("../Settings/Settings");
const Theme_1 = require("../Themes/ui/Theme");
const Themes_1 = require("../Themes/Themes");
const Styles_1 = require("../Themes/Styles");
const Constants_1 = require("../Constants");
const commitHash_1 = require("../utils/helpers/commitHash");
const Terminal_1 = require("../../src/Terminal");
const NetscriptHelpers_1 = require("../Netscript/NetscriptHelpers");
const JSONSchemaAssertion_1 = require("../JsonSchema/JSONSchemaAssertion");
const LogBoxManager_1 = require("../ui/React/LogBoxManager");
function NetscriptUserInterface() {
    return {
        openTail: (ctx) => (scriptID, host, ...scriptArgs) => {
            const ident = NetscriptHelpers_1.helpers.scriptIdentifier(ctx, scriptID, host, scriptArgs);
            const runningScriptObj = NetscriptHelpers_1.helpers.getRunningScript(ctx, ident);
            if (runningScriptObj == null) {
                NetscriptHelpers_1.helpers.log(ctx, () => NetscriptHelpers_1.helpers.getCannotFindRunningScriptErrorMessage(ident));
                return;
            }
            LogBoxManager_1.LogBoxEvents.emit(runningScriptObj);
        },
        renderTail: (ctx) => (_pid = ctx.workerScript.scriptRef.pid) => {
            const pid = NetscriptHelpers_1.helpers.number(ctx, "pid", _pid);
            const runningScriptObj = NetscriptHelpers_1.helpers.getRunningScript(ctx, pid);
            if (runningScriptObj == null) {
                NetscriptHelpers_1.helpers.log(ctx, () => NetscriptHelpers_1.helpers.getCannotFindRunningScriptErrorMessage(pid));
                return;
            }
            runningScriptObj.tailProps?.rerender();
        },
        moveTail: (ctx) => (_x, _y, _pid = ctx.workerScript.scriptRef.pid) => {
            const x = NetscriptHelpers_1.helpers.number(ctx, "x", _x);
            const y = NetscriptHelpers_1.helpers.number(ctx, "y", _y);
            const pid = NetscriptHelpers_1.helpers.number(ctx, "pid", _pid);
            const runningScriptObj = NetscriptHelpers_1.helpers.getRunningScript(ctx, pid);
            if (runningScriptObj == null) {
                NetscriptHelpers_1.helpers.log(ctx, () => NetscriptHelpers_1.helpers.getCannotFindRunningScriptErrorMessage(pid));
                return;
            }
            runningScriptObj.tailProps?.setPosition(x, y);
        },
        resizeTail: (ctx) => (_w, _h, _pid = ctx.workerScript.scriptRef.pid) => {
            const w = NetscriptHelpers_1.helpers.number(ctx, "w", _w);
            const h = NetscriptHelpers_1.helpers.number(ctx, "h", _h);
            const pid = NetscriptHelpers_1.helpers.number(ctx, "pid", _pid);
            const runningScriptObj = NetscriptHelpers_1.helpers.getRunningScript(ctx, pid);
            if (runningScriptObj == null) {
                NetscriptHelpers_1.helpers.log(ctx, () => NetscriptHelpers_1.helpers.getCannotFindRunningScriptErrorMessage(pid));
                return;
            }
            runningScriptObj.tailProps?.setSize(w, h);
        },
        closeTail: (ctx) => (_pid = ctx.workerScript.scriptRef.pid) => {
            const pid = NetscriptHelpers_1.helpers.number(ctx, "pid", _pid);
            //Emit an event to tell the game to close the tail window if it exists
            LogBoxManager_1.LogBoxCloserEvents.emit(pid);
        },
        setTailTitle: (ctx) => (title, _pid = ctx.workerScript.scriptRef.pid) => {
            const pid = NetscriptHelpers_1.helpers.number(ctx, "pid", _pid);
            const runningScriptObj = NetscriptHelpers_1.helpers.getRunningScript(ctx, pid);
            if (runningScriptObj == null) {
                NetscriptHelpers_1.helpers.log(ctx, () => NetscriptHelpers_1.helpers.getCannotFindRunningScriptErrorMessage(pid));
                return;
            }
            runningScriptObj.title = typeof title === "string" ? title : (0, NetscriptHelpers_1.wrapUserNode)(title);
            runningScriptObj.tailProps?.rerender();
        },
        setTailFontSize: (ctx) => (_pixel, scriptID, host, ...scriptArgs) => {
            const ident = NetscriptHelpers_1.helpers.scriptIdentifier(ctx, scriptID, host, scriptArgs);
            const runningScriptObj = NetscriptHelpers_1.helpers.getRunningScript(ctx, ident);
            if (runningScriptObj == null) {
                NetscriptHelpers_1.helpers.log(ctx, () => NetscriptHelpers_1.helpers.getCannotFindRunningScriptErrorMessage(ident));
                return;
            }
            if (_pixel === undefined)
                runningScriptObj.tailProps?.setFontSize(undefined);
            else
                runningScriptObj.tailProps?.setFontSize(NetscriptHelpers_1.helpers.number(ctx, "pixel", _pixel));
        },
        windowSize: () => () => {
            return [window.innerWidth, window.innerHeight];
        },
        getTheme: () => () => {
            return { ...Settings_1.Settings.theme };
        },
        getStyles: () => () => {
            return { ...Settings_1.Settings.styles };
        },
        setTheme: (ctx) => (newTheme) => {
            let newData;
            try {
                /**
                 * assertAndSanitizeMainTheme may mutate its parameter, so we have to clone the user-provided data here.
                 */
                newData = structuredClone(newTheme);
                (0, JSONSchemaAssertion_1.assertAndSanitizeMainTheme)(newData);
            }
            catch (error) {
                NetscriptHelpers_1.helpers.log(ctx, () => `Failed to set theme. Errors: ${error}`);
                return;
            }
            Object.assign(Settings_1.Settings.theme, newData);
            Theme_1.ThemeEvents.emit();
            NetscriptHelpers_1.helpers.log(ctx, () => `Successfully set theme`);
        },
        setStyles: (ctx) => (newStyles) => {
            let newData;
            try {
                /**
                 * assertAndSanitizeStyles may mutate its parameter, so we have to clone the user-provided data here.
                 */
                newData = structuredClone(newStyles);
                (0, JSONSchemaAssertion_1.assertAndSanitizeStyles)(newData);
            }
            catch (error) {
                NetscriptHelpers_1.helpers.log(ctx, () => `Failed to set styles. Errors: ${error}`);
                return;
            }
            Object.assign(Settings_1.Settings.styles, newData);
            Theme_1.ThemeEvents.emit();
            NetscriptHelpers_1.helpers.log(ctx, () => `Successfully set styles`);
        },
        resetTheme: (ctx) => () => {
            Settings_1.Settings.theme = { ...Themes_1.defaultTheme };
            Theme_1.ThemeEvents.emit();
            NetscriptHelpers_1.helpers.log(ctx, () => `Reinitialized theme to default`);
        },
        resetStyles: (ctx) => () => {
            Settings_1.Settings.styles = { ...Styles_1.defaultStyles };
            Theme_1.ThemeEvents.emit();
            NetscriptHelpers_1.helpers.log(ctx, () => `Reinitialized styles to default`);
        },
        getGameInfo: () => () => {
            return {
                version: Constants_1.CONSTANTS.VersionString,
                versionNumber: Constants_1.CONSTANTS.VersionNumber,
                commit: (0, commitHash_1.commitHash)(),
                platform: navigator.userAgent.toLowerCase().includes(" electron/") ? "Steam" : "Browser",
            };
        },
        clearTerminal: (ctx) => () => {
            NetscriptHelpers_1.helpers.log(ctx, () => `Clearing terminal`);
            Terminal_1.Terminal.clear();
        },
    };
}
