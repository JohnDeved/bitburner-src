"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTime = formatTime;
const date_fns_1 = require("date-fns");
function formatTime(fmt) {
    try {
        return (0, date_fns_1.format)(new Date(), fmt);
    }
    catch (e) {
        return "format error";
    }
}
