"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleeveWorkType = exports.SleeveWorkClass = exports.applySleeveGains = void 0;
const _player_1 = require("@player");
const WorkStats_1 = require("../../../Work/WorkStats");
const applySleeveGains = (sleeve, shockedStats, mult = 1) => {
    (0, WorkStats_1.applyWorkStatsExp)(sleeve, shockedStats, mult);
    _player_1.Player.gainMoney(shockedStats.money * mult, "sleeves");
    const sync = sleeve.syncBonus();
    // The receiving sleeves and the player do not apply their xp multipliers from augs (avoid double dipping xp mults)
    (0, WorkStats_1.applyWorkStatsExp)(_player_1.Player, shockedStats, mult * sync);
    // Sleeves apply their own shock bonus to the XP they receive, even though it is also shocked by the working sleeve
    _player_1.Player.sleeves.forEach((s) => s !== sleeve && (0, WorkStats_1.applyWorkStatsExp)(s, shockedStats, mult * sync * s.shockBonus()));
};
exports.applySleeveGains = applySleeveGains;
class SleeveWorkClass {
    finish() {
        /* left for children to implement */
    }
}
exports.SleeveWorkClass = SleeveWorkClass;
var SleeveWorkType;
(function (SleeveWorkType) {
    SleeveWorkType["COMPANY"] = "COMPANY";
    SleeveWorkType["FACTION"] = "FACTION";
    SleeveWorkType["CRIME"] = "CRIME";
    SleeveWorkType["CLASS"] = "CLASS";
    SleeveWorkType["RECOVERY"] = "RECOVERY";
    SleeveWorkType["SYNCHRO"] = "SYNCHRO";
    SleeveWorkType["BLADEBURNER"] = "BLADEBURNER";
    SleeveWorkType["INFILTRATE"] = "INFILTRATE";
    SleeveWorkType["SUPPORT"] = "SUPPORT";
})(SleeveWorkType || (exports.SleeveWorkType = SleeveWorkType = {}));
