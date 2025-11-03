"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTextExtension = hasTextExtension;
exports.resolveTextFilePath = resolveTextFilePath;
const FilePath_1 = require("./FilePath");
/** Check extension only */
function hasTextExtension(path) {
    return path.endsWith(".txt") || path.endsWith(".json");
}
/** Sanitize a player input, resolve any relative paths, and for imports add the correct extension if missing */
function resolveTextFilePath(path, base = "") {
    const result = (0, FilePath_1.resolveFilePath)(path, base);
    return result && hasTextExtension(result) ? result : null;
}
