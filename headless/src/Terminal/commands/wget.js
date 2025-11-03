"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wget = wget;
const Terminal_1 = require("../../Terminal");
const ScriptFilePath_1 = require("../../Paths/ScriptFilePath");
const TextFilePath_1 = require("../../Paths/TextFilePath");
function wget(args, server) {
    if (args.length !== 2 || typeof args[0] !== "string" || typeof args[1] !== "string") {
        Terminal_1.Terminal.error("Incorrect usage of wget command. Usage: wget [url] [target file]");
        return;
    }
    const target = Terminal_1.Terminal.getFilepath(args[1]);
    if (!target || (!(0, ScriptFilePath_1.hasScriptExtension)(target) && !(0, TextFilePath_1.hasTextExtension)(target))) {
        Terminal_1.Terminal.error(`wget failed: Invalid target file. Target file must be a script file or a text file.`);
        return;
    }
    fetch(args[0])
        .then(async (response) => {
        if (response.status !== 200) {
            Terminal_1.Terminal.error(`wget failed. HTTP code: ${response.status}.`);
            return;
        }
        const writeResult = server.writeToContentFile(target, await response.text());
        if (writeResult.overwritten) {
            Terminal_1.Terminal.print(`wget successfully retrieved content and overwrote ${target}`);
        }
        else {
            Terminal_1.Terminal.print(`wget successfully retrieved content to new file ${target}`);
        }
    })
        .catch((reason) => {
        // Check the comment in wget of src\NetscriptFunctions.ts to see why we use Object.getOwnPropertyNames.
        Terminal_1.Terminal.error(`wget failed: ${JSON.stringify(reason, Object.getOwnPropertyNames(reason))}`);
    });
}
