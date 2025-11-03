"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mv = mv;
const Terminal_1 = require("../../Terminal");
const ScriptFilePath_1 = require("../../Paths/ScriptFilePath");
const TextFilePath_1 = require("../../Paths/TextFilePath");
function mv(args, server) {
    if (args.length !== 2) {
        Terminal_1.Terminal.error(`Incorrect number of arguments. Usage: mv [src] [dest]`);
        return;
    }
    const [source, destination] = args.map((arg) => arg + "");
    const sourcePath = Terminal_1.Terminal.getFilepath(source);
    if (!sourcePath)
        return Terminal_1.Terminal.error(`Invalid source filename: ${source}`);
    const destinationPath = Terminal_1.Terminal.getFilepath(destination);
    if (!destinationPath)
        return Terminal_1.Terminal.error(`Invalid destination filename: ${destinationPath}`);
    if ((!(0, ScriptFilePath_1.hasScriptExtension)(sourcePath) && !(0, TextFilePath_1.hasTextExtension)(sourcePath)) ||
        (!(0, ScriptFilePath_1.hasScriptExtension)(destinationPath) && !(0, TextFilePath_1.hasTextExtension)(destinationPath))) {
        return Terminal_1.Terminal.error(`'mv' can only be used on scripts (.js, .jsx, .ts, .tsx) and text files (.txt, .json)`);
    }
    // Allow content to be moved between scripts and textfiles, no need to limit this.
    const sourceContentFile = server.getContentFile(sourcePath);
    if (!sourceContentFile)
        return Terminal_1.Terminal.error(`Source file ${sourcePath} does not exist`);
    if (!sourceContentFile.deleteFromServer(server)) {
        return Terminal_1.Terminal.error(`Could not remove source file ${sourcePath} from existing location. If ${sourcePath} is a script, make sure that it is NOT running before trying to use 'mv' on it.`);
    }
    Terminal_1.Terminal.print(`Moved ${sourcePath} to ${destinationPath}`);
    const { overwritten } = server.writeToContentFile(destinationPath, sourceContentFile.content);
    if (overwritten)
        Terminal_1.Terminal.warn(`${destinationPath} was overwritten.`);
}
