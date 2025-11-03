"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runProgram = runProgram;
const Terminal_1 = require("../../Terminal");
const _player_1 = require("@player");
const Programs_1 = require("../../Programs/Programs");
const Record_1 = require("../../Types/Record");
function runProgram(path, args, server) {
    // Check if you have the program on your computer. If you do, execute it, otherwise
    // display an error message
    const programLowered = path.toLowerCase();
    // Support lowercase even though it's an enum
    const realProgramName = (0, Record_1.getRecordKeys)(Programs_1.Programs).find((name) => name.toLowerCase() === programLowered);
    if (!realProgramName || !_player_1.Player.hasProgram(realProgramName)) {
        Terminal_1.Terminal.error(`No such (js, jsx, ts, tsx, script, cct, or exe) file! (Only finished programs that exist on your home computer or scripts on ${server.hostname} can be run)`);
        return;
    }
    Programs_1.Programs[realProgramName].run(args.map(String), server);
}
