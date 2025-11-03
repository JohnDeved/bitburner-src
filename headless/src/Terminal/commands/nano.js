"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nano = nano;
const editor_1 = require("./common/editor");
function nano(args, server) {
    return (0, editor_1.commonEditor)("nano", { args, server }, { vim: false });
}
