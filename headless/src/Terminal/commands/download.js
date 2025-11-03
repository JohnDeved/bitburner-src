"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportScripts = exportScripts;
exports.download = download;
const Terminal_1 = require("../../Terminal");
const jszip_1 = __importDefault(require("jszip"));
const Directory_1 = require("../../Paths/Directory");
const ScriptFilePath_1 = require("../../Paths/ScriptFilePath");
const TextFilePath_1 = require("../../Paths/TextFilePath");
const GlobbedFiles_1 = require("../../Paths/GlobbedFiles");
const FileUtils_1 = require("../../utils/FileUtils");
// Basic globbing implementation only supporting * and ?. Can be broken out somewhere else later.
function exportScripts(pattern, server, currDir = Directory_1.root) {
    const zip = new jszip_1.default();
    for (const [name, file] of (0, GlobbedFiles_1.getGlobbedFileMap)(pattern, server, currDir)) {
        zip.file(name, new Blob([file.content], { type: "text/plain" }));
    }
    // Return an error if no files matched, rather than an empty zip folder
    if (Object.keys(zip.files).length == 0)
        throw new Error(`No files match the pattern ${pattern}`);
    const filename = `bitburner${(0, ScriptFilePath_1.hasScriptExtension)(pattern) ? "Scripts" : (0, TextFilePath_1.hasTextExtension)(pattern) ? "Texts" : "Files"}.zip`;
    zip
        .generateAsync({ type: "blob" })
        .then((content) => (0, FileUtils_1.downloadContentAsFile)(content, filename))
        .catch((error) => {
        console.error(error);
        Terminal_1.Terminal.error(`Cannot compress scripts with pattern ${pattern} on ${server.hostname}. Error: ${error}`);
    });
}
function download(args, server) {
    if (args.length !== 1) {
        return Terminal_1.Terminal.error("Incorrect usage of download command. Usage: download [script/text file]");
    }
    const pattern = String(args[0]);
    // If the path contains a * or ?, treat as glob
    if (pattern.includes("*") || pattern.includes("?")) {
        try {
            exportScripts(pattern, server, Terminal_1.Terminal.currDir);
            return;
        }
        catch (error) {
            console.error(error);
            Terminal_1.Terminal.error(`Cannot export scripts with pattern ${pattern} on ${server.hostname}. Error: ${error}`);
            return;
        }
    }
    const path = Terminal_1.Terminal.getFilepath(pattern);
    if (!path)
        return Terminal_1.Terminal.error(`Could not resolve path ${pattern}`);
    if (!(0, ScriptFilePath_1.hasScriptExtension)(path) && !(0, TextFilePath_1.hasTextExtension)(path)) {
        return Terminal_1.Terminal.error("Can only download script and text files");
    }
    const file = server.getContentFile(path);
    if (!file)
        return Terminal_1.Terminal.error(`File not found: ${path}`);
    return (0, FileUtils_1.downloadContentAsFile)(file.content, file.filename);
}
