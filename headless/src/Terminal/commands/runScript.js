"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runScript = runScript;
const Terminal_1 = require("../../Terminal");
const LogBoxManager_1 = require("../../ui/React/LogBoxManager");
const NetscriptWorker_1 = require("../../NetscriptWorker");
const arg_1 = __importDefault(require("arg"));
const types_1 = require("../../types");
const ScriptFilePath_1 = require("../../Paths/ScriptFilePath");
const deprecation_1 = require("./common/deprecation");
const roundToTwo_1 = require("../../utils/helpers/roundToTwo");
const RamCostGenerator_1 = require("../../Netscript/RamCostGenerator");
const I18nUtils_1 = require("../../utils/I18nUtils");
function runScript(scriptPath, commandArgs, server) {
    if ((0, ScriptFilePath_1.isLegacyScript)(scriptPath)) {
        (0, deprecation_1.sendDeprecationNotice)();
        return;
    }
    const runArgs = { "--tail": Boolean, "-t": Number, "--ram-override": Number, "--temporary": Boolean };
    let flags;
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
        flags = (0, arg_1.default)(runArgs, {
            permissive: true,
            argv: commandArgs,
        });
    }
    catch (error) {
        Terminal_1.Terminal.error(`Invalid arguments. ${error}.`);
        return;
    }
    const tailFlag = flags["--tail"] === true;
    const numThreads = parseFloat(flags["-t"] ?? 1);
    const ramOverride = flags["--ram-override"] != null ? (0, roundToTwo_1.roundToTwo)(parseFloat(flags["--ram-override"])) : undefined;
    if (!(0, types_1.isPositiveInteger)(numThreads)) {
        return Terminal_1.Terminal.error("Invalid number of threads specified. Number of threads must be an integer greater than 0");
    }
    if (ramOverride != null && (isNaN(ramOverride) || ramOverride < RamCostGenerator_1.RamCostConstants.Base)) {
        Terminal_1.Terminal.error(`Invalid ram override specified. Ram override must be a number greater than ${RamCostGenerator_1.RamCostConstants.Base}`);
        return;
    }
    const tempFlag = flags["--temporary"] === true;
    // Todo: Switch out arg for something with typescript support
    const args = flags._;
    const result = (0, NetscriptWorker_1.createRunningScriptInstance)(server, scriptPath, { threads: numThreads, temporary: tempFlag, ramOverride, preventDuplicates: false }, args);
    if (!result.success) {
        Terminal_1.Terminal.error(result.message);
        return;
    }
    // Able to run script
    const runningScript = result.runningScript;
    runningScript.threads = numThreads;
    const success = (0, NetscriptWorker_1.startWorkerScript)(runningScript, server);
    if (!success) {
        Terminal_1.Terminal.error(`Failed to start script`);
        return;
    }
    Terminal_1.Terminal.print(`Running script with ${(0, I18nUtils_1.pluralize)(numThreads, "thread")}, pid ${runningScript.pid} and args: ${JSON.stringify(args)}.`);
    if (tailFlag) {
        LogBoxManager_1.LogBoxEvents.emit(runningScript);
    }
    return;
}
