"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasProgramExtension = hasProgramExtension;
exports.resolveProgramFilePath = resolveProgramFilePath;
exports.asProgramFilePath = asProgramFilePath;
const Directory_1 = require("./Directory");
const FilePath_1 = require("./FilePath");
/** Check extension only. Programs are a bit different than others because of incomplete programs. */
function hasProgramExtension(path) {
    if (path.endsWith(".exe"))
        return true;
    const extension = path.substring(path.indexOf("."));
    return /^\.exe-[0-9]{1,2}\.[0-9]{2}%-INC$/.test(extension);
}
/** Sanitize a player input, resolve any relative paths, and for imports add the correct extension if missing */
function resolveProgramFilePath(path, base = "") {
    const result = (0, FilePath_1.resolveFilePath)(path, base);
    return result && hasProgramExtension(result) ? result : null;
}
function asProgramFilePath(path) {
    if ((0, FilePath_1.isBasicFilePath)(path) && hasProgramExtension(path) && (0, Directory_1.isAbsolutePath)(path))
        return path;
    throw new Error(`${path} failed to validate as a ProgramFilePath.`);
}
