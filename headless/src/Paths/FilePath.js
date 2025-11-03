"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBasicFilePath = isBasicFilePath;
exports.isFilePath = isFilePath;
exports.asFilePath = asFilePath;
exports.getFilenameOnly = getFilenameOnly;
exports.resolveFilePath = resolveFilePath;
exports.combinePath = combinePath;
exports.removeDirectoryFromPath = removeDirectoryFromPath;
const Directory_1 = require("./Directory");
// Capturing group named file which captures the entire filename part of a file path.
const filenameRegexString = `(?<file>${Directory_1.oneValidCharacter}+\\.${Directory_1.oneValidCharacter}+)$`;
/** Regex made of the two above regex parts to test for a whole valid filepath. */
const basicFilePathRegex = new RegExp(Directory_1.directoryRegexString + filenameRegexString);
/** Simple validation function with no modification. Can be combined with isAbsolutePath to get a real FilePath */
function isBasicFilePath(path) {
    return basicFilePathRegex.test(path);
}
function isFilePath(path) {
    return isBasicFilePath(path) && (0, Directory_1.isAbsolutePath)(path);
}
function asFilePath(input) {
    if (isFilePath(input)) {
        return input;
    }
    throw new Error(`${input} failed to validate as a FilePath.`);
}
function getFilenameOnly(path) {
    const start = path.lastIndexOf("/") + 1;
    return path.substring(start);
}
/** Validate while also capturing and returning directory and file parts */
function getFileParts(path) {
    const result = basicFilePathRegex.exec(path);
    return result ? result.groups : null;
}
/** Sanitizes a player input and resolves a relative file path to an absolute one.
 * @param path The player-provided path string. Can include relative directories.
 * @param base The absolute base for resolving a relative path. */
function resolveFilePath(path, base = "") {
    if ((0, Directory_1.isAbsolutePath)(path)) {
        if (path.startsWith("/"))
            path = path.substring(1);
        // Because we modified the string since checking absoluteness, we have to assert that it's still absolute here.
        return isBasicFilePath(path) ? path : null;
    }
    // Turn base into a DirectoryName in case it was not
    base = getBaseDirectory(base);
    const pathParts = getFileParts(path);
    if (!pathParts)
        return null;
    const directory = (0, Directory_1.resolveValidatedDirectory)(pathParts.directory, base);
    // Have to specifically check null here instead of truthiness, because empty string is a valid DirectoryPath
    return directory === null ? null : combinePath(directory, pathParts.file);
}
/** Remove the file part from an absolute path (FilePath or DirectoryPath - no modification is done for a DirectoryPath) */
function getBaseDirectory(path) {
    return path.replace(/[^/]+\.[^/]+$/, "");
}
/** Combine an absolute DirectoryPath and FilePath to create a new FilePath */
function combinePath(directory, file) {
    // Preserves the specific file type because the filepart is preserved.
    return (directory + file);
}
function removeDirectoryFromPath(directory, path) {
    if (!path.startsWith(directory))
        return null;
    return path.substring(directory.length);
}
