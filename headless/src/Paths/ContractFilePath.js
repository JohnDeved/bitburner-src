"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasContractExtension = hasContractExtension;
exports.resolveContractFilePath = resolveContractFilePath;
const FilePath_1 = require("./FilePath");
/** Check extension only */
function hasContractExtension(path) {
    return path.endsWith(".cct");
}
/** Sanitize a player input, resolve any relative paths, and for imports add the correct extension if missing */
function resolveContractFilePath(path, base = "") {
    const result = (0, FilePath_1.resolveFilePath)(path, base);
    return result && hasContractExtension(result) ? result : null;
}
