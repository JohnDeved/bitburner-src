"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scananalyze = scananalyze;
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const Terminal_1 = require("../../Terminal");
function scananalyze(args) {
    if (args.length === 0) {
        Terminal_1.Terminal.executeScanAnalyzeCommand();
    }
    else {
        // # of args must be 2 or 3
        if (args.length > 2) {
            Terminal_1.Terminal.error("Incorrect usage of scan-analyze command. usage: scan-analyze [depth]");
            return;
        }
        let all = false;
        if (args.length === 2 && args[1] === "-a") {
            all = true;
        }
        const depth = parseInt(args[0] + "");
        if (isNaN(depth) || depth < 0) {
            return Terminal_1.Terminal.error("Incorrect usage of scan-analyze command. depth argument must be positive numeric");
        }
        if (depth > 3 &&
            !_player_1.Player.hasProgram(_enums_1.CompletedProgramName.deepScan1) &&
            !_player_1.Player.hasProgram(_enums_1.CompletedProgramName.deepScan2)) {
            return Terminal_1.Terminal.error("You cannot scan-analyze with that high of a depth. Maximum depth is 3");
        }
        else if (depth > 5 && !_player_1.Player.hasProgram(_enums_1.CompletedProgramName.deepScan2)) {
            return Terminal_1.Terminal.error("You cannot scan-analyze with that high of a depth. Maximum depth is 5");
        }
        else if (depth > 10) {
            return Terminal_1.Terminal.error("You cannot scan-analyze with that high of a depth. Maximum depth is 10");
        }
        Terminal_1.Terminal.executeScanAnalyzeCommand(depth, all);
    }
}
