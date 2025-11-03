"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changelog = void 0;
const Constants_1 = require("../../Constants");
const DialogBox_1 = require("../../ui/React/DialogBox");
const changelog = () => (0, DialogBox_1.dialogBoxCreate)("Most recent changelog info:\n\n" + Constants_1.CONSTANTS.LatestUpdate);
exports.changelog = changelog;
