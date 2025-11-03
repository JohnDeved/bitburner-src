"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cp = cp;
const Terminal_1 = require("../../Terminal");
const FilePath_1 = require("../../Paths/FilePath");
const TextFilePath_1 = require("../../Paths/TextFilePath");
const ScriptFilePath_1 = require("../../Paths/ScriptFilePath");
function cp(args, server) {
    if (args.length !== 2) {
        return Terminal_1.Terminal.error("Incorrect usage of cp command. Usage: cp [source filename] [destination]");
    }
    // Find the source file
    const sourceFilePath = Terminal_1.Terminal.getFilepath(String(args[0]));
    if (!sourceFilePath)
        return Terminal_1.Terminal.error(`Invalid source filename ${args[0]}`);
    if (!(0, TextFilePath_1.hasTextExtension)(sourceFilePath) && !(0, ScriptFilePath_1.hasScriptExtension)(sourceFilePath)) {
        return Terminal_1.Terminal.error("cp: Can only be performed on script and text files");
    }
    const source = server.getContentFile(sourceFilePath);
    if (!source)
        return Terminal_1.Terminal.error(`File not found: ${sourceFilePath}`);
    // Determine the destination file path.
    const destinationInput = String(args[1]);
    // First treat the input as a file path. If that fails, try treating it as a directory and reusing source filename.
    let destFilePath = Terminal_1.Terminal.getFilepath(destinationInput);
    if (!destFilePath) {
        const destDirectory = Terminal_1.Terminal.getDirectory(destinationInput);
        if (!destDirectory)
            return Terminal_1.Terminal.error(`Could not resolve ${destinationInput} as a FilePath or Directory`);
        destFilePath = (0, FilePath_1.combinePath)(destDirectory, (0, FilePath_1.getFilenameOnly)(sourceFilePath));
    }
    if (!(0, TextFilePath_1.hasTextExtension)(destFilePath) && !(0, ScriptFilePath_1.hasScriptExtension)(destFilePath)) {
        return Terminal_1.Terminal.error(`cp: Can only copy to script and text files (${destFilePath} is invalid destination)`);
    }
    const result = server.writeToContentFile(destFilePath, source.content);
    Terminal_1.Terminal.print(`File ${sourceFilePath} copied to ${destFilePath}`);
    if (result.overwritten)
        Terminal_1.Terminal.warn(`${destFilePath} was overwritten.`);
}
