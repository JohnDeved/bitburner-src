"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineCrimeSuccess = determineCrimeSuccess;
const Crimes_1 = require("./Crimes");
const _player_1 = require("@player");
//This is only used for the player
function determineCrimeSuccess(type) {
    const crime = Crimes_1.Crimes[type];
    const chance = crime.successRate(_player_1.Player);
    return Math.random() <= chance;
}
