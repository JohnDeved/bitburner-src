"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validScriptExtensions = exports.legacyScriptExtension = void 0;
exports.resolveScriptFilePath = resolveScriptFilePath;
exports.hasScriptExtension = hasScriptExtension;
exports.isLegacyScript = isLegacyScript;
const FilePath_1 = require("./FilePath");
exports.legacyScriptExtension = ".script";
/**
 * Valid extensions. Used for some error messaging.
 *
 * Running .script is unsupported, but we still put it in the list of valid script extensions. When we remove the
 * support of NS1, we only remove the ability to run it. Except the migration docs, the official documentation (help
 * text, TSDoc of NS APIs, etc.) does not mention NS1 and .script anymore. However, for the player's convenience when
 * migrating from NS1 to NS2, we still let them perform other actions on their unsupported scripts (e.g., open, copy,
 * move, delete).
 */
exports.validScriptExtensions = [".js", ".jsx", ".ts", ".tsx", exports.legacyScriptExtension];
/** Sanitize a player input, resolve any relative paths, and for imports add the correct extension if missing
 * @param path The player-provided path to a file. Can contain relative parts.
 * @param base The base
 */
function resolveScriptFilePath(path, base = "", extensionToAdd) {
    if (extensionToAdd && !path.endsWith(extensionToAdd))
        path = path + extensionToAdd;
    const result = (0, FilePath_1.resolveFilePath)(path, base);
    return result && hasScriptExtension(result) ? result : null;
}
/** Just check extension */
function hasScriptExtension(path) {
    return exports.validScriptExtensions.some((extension) => path.endsWith(extension));
}
function isLegacyScript(path) {
    return path.endsWith(exports.legacyScriptExtension);
}
