"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
exports.setPlayer = setPlayer;
exports.loadPlayer = loadPlayer;
const Exploit_1 = require("./Exploits/Exploit");
const GenericReviver_1 = require("./utils/GenericReviver");
function setPlayer(playerObj) {
    exports.Player = playerObj;
}
function loadPlayer(saveString) {
    /**
     * If we want to check player with "instanceof PlayerObject", we have to import PlayerObject normally (not "import
     * type"). It will create a cyclic dependency. Fixing this cyclic dependency is really hard. It's not worth the
     * effort, so we typecast it here.
     */
    const player = JSON.parse(saveString, GenericReviver_1.Reviver);
    player.money = parseFloat(player.money + "");
    player.exploits = (0, Exploit_1.sanitizeExploits)(player.exploits);
    return player;
}
