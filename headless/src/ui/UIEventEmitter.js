"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIEventEmitter = exports.UIEventType = void 0;
const EventEmitter_1 = require("../utils/EventEmitter");
var UIEventType;
(function (UIEventType) {
    UIEventType[UIEventType["MainUILoaded"] = 0] = "MainUILoaded";
})(UIEventType || (exports.UIEventType = UIEventType = {}));
exports.UIEventEmitter = new EventEmitter_1.EventEmitter();
