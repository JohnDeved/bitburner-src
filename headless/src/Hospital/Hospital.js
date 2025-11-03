"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHospitalizationCost = getHospitalizationCost;
exports.calculateHospitalizationCost = calculateHospitalizationCost;
const _player_1 = require("@player");
const Constants_1 = require("../Constants");
function getHospitalizationCost() {
    if (_player_1.Player.money < 0) {
        return 0;
    }
    return Math.min(_player_1.Player.money * 0.1, (_player_1.Player.hp.max - _player_1.Player.hp.current) * Constants_1.CONSTANTS.HospitalCostPerHp);
}
function calculateHospitalizationCost(damage) {
    const oldhp = _player_1.Player.hp.current;
    _player_1.Player.hp.current -= damage;
    const cost = getHospitalizationCost();
    _player_1.Player.hp.current = oldhp;
    return cost;
}
