"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const Terminal_1 = require("../../Terminal");
const runScript_1 = require("./runScript");
const runProgram_1 = require("./runProgram");
const ScriptFilePath_1 = require("../../Paths/ScriptFilePath");
const ContractFilePath_1 = require("../../Paths/ContractFilePath");
const ProgramFilePath_1 = require("../../Paths/ProgramFilePath");
function run(args, server) {
    // Run a program or a script
    const arg = args.shift();
    if (!arg)
        return Terminal_1.Terminal.error("Usage: run [program/script] [-t num_threads] [--tail] [--ram-override ram_in_GBs] [--temporary] [args...]");
    const path = Terminal_1.Terminal.getFilepath(String(arg));
    if (!path)
        return Terminal_1.Terminal.error(`${arg} is not a valid filepath.`);
    if ((0, ScriptFilePath_1.hasScriptExtension)(path)) {
        return (0, runScript_1.runScript)(path, args, server);
    }
    else if ((0, ContractFilePath_1.hasContractExtension)(path)) {
        Terminal_1.Terminal.runContract(path).catch((error) => {
            console.error(error);
            Terminal_1.Terminal.error(`Cannot run contract ${path} on ${server.hostname}. Error: ${error}.`);
        });
        return;
    }
    else if ((0, ProgramFilePath_1.hasProgramExtension)(path)) {
        return (0, runProgram_1.runProgram)(path, args, server);
    }
    Terminal_1.Terminal.error(`Invalid file extension. Only .js, .jsx, .ts, .tsx, .cct, and .exe files can be run.`);
}
