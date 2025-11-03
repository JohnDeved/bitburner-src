"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vim = vim;
const editor_1 = require("./common/editor");
function vim(args, server) {
    return (0, editor_1.commonEditor)("vim", { args, server }, { vim: true });
}
