"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerEvents = exports.PlayerEventType = void 0;
const EventEmitter_1 = require("../../utils/EventEmitter");
var PlayerEventType;
(function (PlayerEventType) {
    PlayerEventType[PlayerEventType["Hospitalized"] = 0] = "Hospitalized";
})(PlayerEventType || (exports.PlayerEventType = PlayerEventType = {}));
exports.PlayerEvents = new EventEmitter_1.EventEmitter();
