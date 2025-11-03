"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cat = cat;
const Terminal_1 = require("../../Terminal");
const MessageHelpers_1 = require("../../Message/MessageHelpers");
const LiteratureHelpers_1 = require("../../Literature/LiteratureHelpers");
const DialogBox_1 = require("../../ui/React/DialogBox");
const ScriptFilePath_1 = require("../../Paths/ScriptFilePath");
const TextFilePath_1 = require("../../Paths/TextFilePath");
const EnumHelper_1 = require("../../utils/EnumHelper");
function cat(args, server) {
    if (args.length !== 1)
        return Terminal_1.Terminal.error("Incorrect usage of cat command. Usage: cat [file]");
    const relative_filename = args[0] + "";
    const path = Terminal_1.Terminal.getFilepath(relative_filename);
    if (!path)
        return Terminal_1.Terminal.error(`Invalid filename: ${relative_filename}`);
    if ((0, ScriptFilePath_1.hasScriptExtension)(path) || (0, TextFilePath_1.hasTextExtension)(path)) {
        const file = server.getContentFile(path);
        if (!file)
            return Terminal_1.Terminal.error(`No file at path ${path}`);
        return (0, DialogBox_1.dialogBoxCreate)(`${file.filename}\n\n${file.content}`);
    }
    if (!path.endsWith(".msg") && !path.endsWith(".lit")) {
        return Terminal_1.Terminal.error("Invalid file extension. Filename must end with .msg, .lit, a script extension (.js, .jsx, .ts, .tsx) or a text extension (.txt, .json)");
    }
    // Message
    if ((0, EnumHelper_1.isMember)("MessageFilename", path)) {
        if (server.messages.includes(path))
            return (0, MessageHelpers_1.showMessage)(path);
    }
    if ((0, EnumHelper_1.isMember)("LiteratureName", path)) {
        if (server.messages.includes(path))
            return (0, LiteratureHelpers_1.showLiterature)(path);
    }
    Terminal_1.Terminal.error(`No file at path ${path}`);
}
