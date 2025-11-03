"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonEditor = commonEditor;
const Terminal_1 = require("../../../Terminal");
const Router_1 = require("../../../ui/Router");
const GameRoot_1 = require("../../../ui/GameRoot");
const ScriptFilePath_1 = require("../../../Paths/ScriptFilePath");
const TextFilePath_1 = require("../../../Paths/TextFilePath");
const GlobbedFiles_1 = require("../../../Paths/GlobbedFiles");
const deprecation_1 = require("./deprecation");
const ScriptTransformer_1 = require("../../../utils/ScriptTransformer");
function getScriptTemplate(path) {
    if ((0, TextFilePath_1.hasTextExtension)(path) || (0, ScriptFilePath_1.isLegacyScript)(path)) {
        return "";
    }
    const fileTypeFeature = (0, ScriptTransformer_1.getFileTypeFeature)((0, ScriptTransformer_1.getFileType)(path));
    if (fileTypeFeature.isTypeScript) {
        return `export async function main(ns: NS) {

}`;
    }
    else {
        return `/** @param {NS} ns */
export async function main(ns) {

}`;
    }
}
function commonEditor(command, { args, server }, options) {
    if (args.length < 1)
        return Terminal_1.Terminal.error(`Incorrect usage of ${command} command. Usage: ${command} [scriptname]`);
    const files = new Map();
    let hasLegacyScript = false;
    for (const arg of args) {
        const pattern = String(arg);
        // Glob of existing files
        if (pattern.includes("*") || pattern.includes("?")) {
            for (const [path, file] of (0, GlobbedFiles_1.getGlobbedFileMap)(pattern, server, Terminal_1.Terminal.currDir)) {
                if ((0, ScriptFilePath_1.isLegacyScript)(path)) {
                    hasLegacyScript = true;
                }
                files.set(path, file.content);
            }
            continue;
        }
        // Non-glob, files do not need to already exist
        const path = Terminal_1.Terminal.getFilepath(pattern);
        if (!path)
            return Terminal_1.Terminal.error(`Invalid file path ${arg}`);
        if (!(0, ScriptFilePath_1.hasScriptExtension)(path) && !(0, TextFilePath_1.hasTextExtension)(path)) {
            return Terminal_1.Terminal.error(`${command}: Only scripts or text files can be edited. Invalid file type: ${arg}`);
        }
        if ((0, ScriptFilePath_1.isLegacyScript)(path)) {
            hasLegacyScript = true;
        }
        const file = server.getContentFile(path);
        files.set(path, file ? file.content : getScriptTemplate(path));
    }
    if (hasLegacyScript) {
        (0, deprecation_1.sendDeprecationNotice)();
    }
    GameRoot_1.Router.toPage(Router_1.Page.ScriptEditor, { files, options });
}
