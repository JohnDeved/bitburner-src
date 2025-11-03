"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scp = scp;
const Terminal_1 = require("../../Terminal");
const AllServers_1 = require("../../Server/AllServers");
const ScriptFilePath_1 = require("../../Paths/ScriptFilePath");
const TextFilePath_1 = require("../../Paths/TextFilePath");
const EnumHelper_1 = require("../../utils/EnumHelper");
function scp(args, server) {
    if (args.length < 2) {
        return Terminal_1.Terminal.error("Incorrect usage of scp command. Usage: scp [source filename] [destination hostname]");
    }
    // Validate destination server
    const destHostname = String(args.pop());
    const destServer = (0, AllServers_1.GetReachableServer)(destHostname);
    if (!destServer)
        return Terminal_1.Terminal.error(`Invalid destination server: ${destHostname}`);
    // Validate filepaths
    const filenames = args.map(String);
    const files = [];
    // File validation loop, handle all errors before copying any files
    for (const filename of filenames) {
        const path = Terminal_1.Terminal.getFilepath(filename);
        if (!path)
            return Terminal_1.Terminal.error(`Invalid file path: ${filename}`);
        // Validate .lit files
        if (path.endsWith(".lit")) {
            if (!(0, EnumHelper_1.isMember)("LiteratureName", path) || !server.messages.includes(path)) {
                return Terminal_1.Terminal.error(`scp failed: ${path} does not exist on server ${server.hostname}`);
            }
            files.push(path);
            continue;
        }
        // Error for invalid filetype
        if (!(0, ScriptFilePath_1.hasScriptExtension)(path) && !(0, TextFilePath_1.hasTextExtension)(path)) {
            return Terminal_1.Terminal.error(`scp failed: ${path} has invalid extension. scp only works for scripts (.js, .jsx, .ts, .tsx), text files (.txt, .json), and literature files (.lit)`);
        }
        const sourceContentFile = server.getContentFile(path);
        if (!sourceContentFile)
            return Terminal_1.Terminal.error(`scp failed: ${path} does not exist on server ${server.hostname}`);
        files.push(sourceContentFile);
    }
    // Actually copy the files (no more errors possible)
    for (const file of files) {
        // Lit files, entire "file" is just the name
        if ((0, EnumHelper_1.isMember)("LiteratureName", file)) {
            if (destServer.messages.includes(file)) {
                Terminal_1.Terminal.print(`${file} was already on ${destHostname}, file skipped`);
                continue;
            }
            destServer.messages.push(file);
            Terminal_1.Terminal.print(`${file} copied to ${destHostname}`);
            continue;
        }
        // Content files (script and txt)
        const { filename, content } = file;
        const { overwritten } = destServer.writeToContentFile(filename, content);
        if (overwritten)
            Terminal_1.Terminal.warn(`${filename} already existed on ${destHostname} and was overwritten`);
        else
            Terminal_1.Terminal.print(`${filename} copied to ${destHostname}`);
    }
}
