"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cd = cd;
const Terminal_1 = require("../../Terminal");
const Directory_1 = require("../../Paths/Directory");
function cd(args, server) {
    if (args.length > 1)
        return Terminal_1.Terminal.error("Incorrect number of arguments. Usage: cd [dir]");
    // If no arg was provided, just use "/".
    const userInput = String(args[0] ?? "/");
    const targetDir = (0, Directory_1.resolveDirectory)(userInput, Terminal_1.Terminal.currDir);
    // Explicitly checking null due to root being ""
    if (targetDir === null)
        return Terminal_1.Terminal.error(`Could not resolve directory ${userInput}`);
    if (!(0, Directory_1.directoryExistsOnServer)(targetDir, server))
        return Terminal_1.Terminal.error(`Directory ${targetDir} does not exist.`);
    Terminal_1.Terminal.setcwd(targetDir);
}
