"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ns = exports.enums = void 0;
exports.NetscriptFunctions = NetscriptFunctions;
const sprintf_js_1 = require("sprintf-js");
const BitNodeMultipliers_1 = require("./BitNode/BitNodeMultipliers");
const Constants_1 = require("./Constants");
const Hacking_1 = require("./Hacking");
const netscriptCanHack_1 = require("./Hacking/netscriptCanHack");
const Terminal_1 = require("./Terminal");
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const PromptManager_1 = require("./ui/React/PromptManager");
const AllServers_1 = require("./Server/AllServers");
const ServerHelpers_1 = require("./Server/ServerHelpers");
const ServerPurchases_1 = require("./Server/ServerPurchases");
const PlayerInfluencing_1 = require("./StockMarket/PlayerInfluencing");
const NetscriptWorker_1 = require("./NetscriptWorker");
const killWorkerScript_1 = require("./Netscript/killWorkerScript");
const WorkerScripts_1 = require("./Netscript/WorkerScripts");
const NetscriptHelpers_1 = require("./Netscript/NetscriptHelpers");
const formatNumber_1 = require("./ui/formatNumber");
const StringHelperFunctions_1 = require("./utils/StringHelperFunctions");
const roundToTwo_1 = require("./utils/helpers/roundToTwo");
const ArrayHelpers_1 = require("./utils/helpers/ArrayHelpers");
const Gang_1 = require("./NetscriptFunctions/Gang");
const Go_1 = require("./NetscriptFunctions/Go");
const Sleeve_1 = require("./NetscriptFunctions/Sleeve");
const Extra_1 = require("./NetscriptFunctions/Extra");
const Hacknet_1 = require("./NetscriptFunctions/Hacknet");
const Stanek_1 = require("./NetscriptFunctions/Stanek");
const Infiltration_1 = require("./NetscriptFunctions/Infiltration");
const UserInterface_1 = require("./NetscriptFunctions/UserInterface");
const Bladeburner_1 = require("./NetscriptFunctions/Bladeburner");
const CodingContract_1 = require("./NetscriptFunctions/CodingContract");
const Corporation_1 = require("./NetscriptFunctions/Corporation");
const Formulas_1 = require("./NetscriptFunctions/Formulas");
const StockMarket_1 = require("./NetscriptFunctions/StockMarket");
const Grafting_1 = require("./NetscriptFunctions/Grafting");
const Singularity_1 = require("./NetscriptFunctions/Singularity");
const DialogBox_1 = require("./ui/React/DialogBox");
const Snackbar_1 = require("./ui/React/Snackbar");
const scriptKey_1 = require("./utils/helpers/scriptKey");
const Flags_1 = require("./NetscriptFunctions/Flags");
const Share_1 = require("./NetworkShare/Share");
const RecentScripts_1 = require("./Netscript/RecentScripts");
const APIWrapper_1 = require("./Netscript/APIWrapper");
const ScriptDeath_1 = require("./Netscript/ScriptDeath");
const BitNode_1 = require("./BitNode/BitNode");
const TypeAssertion_1 = require("./utils/TypeAssertion");
const lodash_1 = require("lodash");
const NetscriptPort_1 = require("./NetscriptPort");
const FilePath_1 = require("./Paths/FilePath");
const ScriptFilePath_1 = require("./Paths/ScriptFilePath");
const TextFilePath_1 = require("./Paths/TextFilePath");
const ContractFilePath_1 = require("./Paths/ContractFilePath");
const RamCostGenerator_1 = require("./Netscript/RamCostGenerator");
const EnumHelper_1 = require("./utils/EnumHelper");
const Constants_2 = require("./Server/data/Constants");
const TypeAssertion_2 = require("./Netscript/TypeAssertion");
const GameRoot_1 = require("./ui/GameRoot");
const Router_1 = require("./ui/Router");
const BitNodeUtils_1 = require("./BitNode/BitNodeUtils");
const Constants_3 = require("./BitNode/Constants");
const strings_1 = require("./Types/strings");
const NetscriptJSEvaluator_1 = require("./NetscriptJSEvaluator");
const Format_1 = require("./NetscriptFunctions/Format");
const FragmentType_1 = require("./CotMG/FragmentType");
exports.enums = {
    CityName: _enums_1.CityName,
    CrimeType: _enums_1.CrimeType,
    FactionWorkType: _enums_1.FactionWorkType,
    GymType: _enums_1.GymType,
    JobName: _enums_1.JobName,
    JobField: _enums_1.JobField,
    LocationName: _enums_1.LocationName,
    ToastVariant: _enums_1.ToastVariant,
    UniversityClassType: _enums_1.UniversityClassType,
    CompanyName: _enums_1.CompanyName,
    FactionName: _enums_1.FactionName,
    CodingContractName: _enums_1.CodingContractName,
    PositionType: _enums_1.PositionType,
    OrderType: _enums_1.OrderType,
    BladeburnerActionType: _enums_1.BladeburnerActionType,
    SpecialBladeburnerActionTypeForSleeve: _enums_1.SpecialBladeburnerActionTypeForSleeve,
    FragmentType: FragmentType_1.FragmentTypeEnum,
};
for (const val of Object.values(exports.enums))
    Object.freeze(val);
Object.freeze(exports.enums);
exports.ns = {
    singularity: (0, Singularity_1.NetscriptSingularity)(),
    format: (0, Format_1.NetscriptFormat)(),
    gang: (0, Gang_1.NetscriptGang)(),
    go: (0, Go_1.NetscriptGo)(),
    bladeburner: (0, Bladeburner_1.NetscriptBladeburner)(),
    codingcontract: (0, CodingContract_1.NetscriptCodingContract)(),
    sleeve: (0, Sleeve_1.NetscriptSleeve)(),
    corporation: (0, Corporation_1.NetscriptCorporation)(),
    stanek: (0, Stanek_1.NetscriptStanek)(),
    infiltration: (0, Infiltration_1.NetscriptInfiltration)(),
    ui: (0, UserInterface_1.NetscriptUserInterface)(),
    formulas: (0, Formulas_1.NetscriptFormulas)(),
    stock: (0, StockMarket_1.NetscriptStockMarket)(),
    grafting: (0, Grafting_1.NetscriptGrafting)(),
    hacknet: (0, Hacknet_1.NetscriptHacknet)(),
    sprintf: (ctx) => (_format, ...args) => {
        const format = NetscriptHelpers_1.helpers.string(ctx, "format", _format);
        return (0, sprintf_js_1.sprintf)(format, ...args);
    },
    vsprintf: (ctx) => (_format, _args) => {
        const format = NetscriptHelpers_1.helpers.string(ctx, "format", _format);
        if (!Array.isArray(_args)) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `args must be an array.`);
        }
        return (0, sprintf_js_1.vsprintf)(format, _args);
    },
    scan: (ctx) => (_host, _returnOpts) => {
        const host = _host ? NetscriptHelpers_1.helpers.string(ctx, "host", _host) : ctx.workerScript.hostname;
        const returnOpts = NetscriptHelpers_1.helpers.hostReturnOptions(_returnOpts);
        const server = NetscriptHelpers_1.helpers.getServer(ctx, host);
        const out = [];
        for (let i = 0; i < server.serversOnNetwork.length; i++) {
            const s = (0, ServerHelpers_1.getServerOnNetwork)(server, i);
            if (s === null)
                continue;
            const entry = NetscriptHelpers_1.helpers.returnServerID(s, returnOpts);
            if (entry === null)
                continue;
            out.push(entry);
        }
        NetscriptHelpers_1.helpers.log(ctx, () => `returned ${server.serversOnNetwork.length} connections for ${(0, strings_1.isIPAddress)(host) ? server.ip : server.hostname}`);
        return out;
    },
    hasTorRouter: () => () => _player_1.Player.hasTorRouter(),
    hack: (ctx) => (_host, opts) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        return NetscriptHelpers_1.helpers.hack(ctx, host, false, opts);
    },
    hackAnalyzeThreads: (ctx) => (_host, _hackAmount) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const hackAmount = NetscriptHelpers_1.helpers.number(ctx, "hackAmount", _hackAmount);
        // Check argument validity
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        if (isNaN(hackAmount)) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid hackAmount argument passed into hackAnalyzeThreads: ${hackAmount}. Must be numeric.`);
        }
        if (hackAmount < 0 || hackAmount > server.moneyAvailable) {
            return -1;
        }
        else if (hackAmount === 0) {
            return 0;
        }
        const percentHacked = (0, Hacking_1.calculatePercentMoneyHacked)(server, _player_1.Player);
        if (percentHacked === 0 || server.moneyAvailable === 0) {
            return -1; // To prevent returning infinity below
        }
        return hackAmount / (server.moneyAvailable * percentHacked);
    },
    hackAnalyze: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        return (0, Hacking_1.calculatePercentMoneyHacked)(server, _player_1.Player);
    },
    hackAnalyzeSecurity: (ctx) => (_threads, _host) => {
        let threads = NetscriptHelpers_1.helpers.number(ctx, "threads", _threads);
        if (_host) {
            const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
            const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
            const percentHacked = (0, Hacking_1.calculatePercentMoneyHacked)(server, _player_1.Player);
            if (percentHacked > 0) {
                // thread count is limited to the maximum number of threads needed
                threads = Math.min(threads, Math.ceil(1 / percentHacked));
            }
        }
        return Constants_2.ServerConstants.ServerFortifyAmount * threads;
    },
    hackAnalyzeChance: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        return (0, Hacking_1.calculateHackingChance)(server, _player_1.Player);
    },
    sleep: (ctx) => (_time = 0) => {
        const time = NetscriptHelpers_1.helpers.number(ctx, "time", _time);
        NetscriptHelpers_1.helpers.log(ctx, () => `Sleeping for ${(0, StringHelperFunctions_1.convertTimeMsToTimeElapsedString)(time, true)}.`);
        return NetscriptHelpers_1.helpers.netscriptDelay(ctx, time).then(function () {
            return Promise.resolve(true);
        });
    },
    asleep: (ctx) => (_time = 0) => {
        const time = NetscriptHelpers_1.helpers.number(ctx, "time", _time);
        NetscriptHelpers_1.helpers.log(ctx, () => `Sleeping for ${(0, StringHelperFunctions_1.convertTimeMsToTimeElapsedString)(time, true)}.`);
        return new Promise((resolve) => setTimeout(() => resolve(true), time));
    },
    grow: (ctx) => (_host, opts) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const { threads, stock, additionalMsec } = NetscriptHelpers_1.helpers.validateHGWOptions(ctx, opts);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        // No root access or skill level too low
        const canHack = (0, netscriptCanHack_1.netscriptCanGrow)(server);
        if (!canHack.res) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, canHack.msg || "");
        }
        const growTime = (0, Hacking_1.calculateGrowTime)(server, _player_1.Player) + additionalMsec / 1000.0;
        NetscriptHelpers_1.helpers.log(ctx, () => `Executing on '${server.hostname}' in ${(0, StringHelperFunctions_1.convertTimeMsToTimeElapsedString)(growTime * 1000, true)} (t=${(0, formatNumber_1.formatThreads)(threads)}).`);
        return NetscriptHelpers_1.helpers.netscriptDelay(ctx, growTime * 1000).then(function () {
            const scripthost = (0, AllServers_1.GetServer)(ctx.workerScript.hostname);
            if (scripthost === null) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Cannot find host of WorkerScript. Hostname: ${ctx.workerScript.hostname}.`);
            }
            const moneyBefore = server.moneyAvailable;
            const growth = (0, ServerHelpers_1.processSingleServerGrowth)(server, threads, scripthost.cpuCores);
            const moneyAfter = server.moneyAvailable;
            ctx.workerScript.scriptRef.recordGrow(server.hostname, threads);
            const expGain = (0, Hacking_1.calculateHackingExpGain)(server, _player_1.Player) * threads;
            NetscriptHelpers_1.helpers.log(ctx, () => `Available money on '${server.hostname}' grown by ${(0, formatNumber_1.formatPercent)(growth - 1, 6)}. Gained ${(0, formatNumber_1.formatExp)(expGain)} hacking exp (t=${(0, formatNumber_1.formatThreads)(threads)}).`);
            ctx.workerScript.scriptRef.onlineExpGained += expGain;
            _player_1.Player.gainHackingExp(expGain);
            if (stock) {
                (0, PlayerInfluencing_1.influenceStockThroughServerGrow)(server, moneyAfter - moneyBefore);
            }
            return Promise.resolve(server.moneyMax === 0 ? 0 : growth);
        });
    },
    growthAnalyze: (ctx) => (_host, _multiplier, _cores = 1) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "hostname", _host);
        const mult = NetscriptHelpers_1.helpers.number(ctx, "multiplier", _multiplier);
        const cores = NetscriptHelpers_1.helpers.positiveInteger(ctx, "cores", _cores);
        // Check argument validity
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        if (!Number.isFinite(mult) || mult < 1) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid argument: multiplier must be finite and >= 1, is ${mult}.`);
        }
        return (0, ServerHelpers_1.numCycleForGrowth)(server, mult, cores);
    },
    growthAnalyzeSecurity: (ctx) => (_threads, _host, _cores = 1) => {
        let threads = NetscriptHelpers_1.helpers.number(ctx, "threads", _threads);
        if (_host) {
            const cores = NetscriptHelpers_1.helpers.number(ctx, "cores", _cores);
            const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
            const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
            const maxThreadsNeeded = Math.ceil((0, ServerHelpers_1.numCycleForGrowthCorrected)(server, server.moneyMax, server.moneyAvailable, cores));
            threads = Math.min(threads, maxThreadsNeeded);
        }
        return 2 * Constants_2.ServerConstants.ServerFortifyAmount * threads;
    },
    weaken: (ctx) => async (_host, opts) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const { threads, additionalMsec } = NetscriptHelpers_1.helpers.validateHGWOptions(ctx, opts);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        // No root access or skill level too low
        const canHack = (0, netscriptCanHack_1.netscriptCanWeaken)(server);
        if (!canHack.res) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, canHack.msg || "");
        }
        const weakenTime = (0, Hacking_1.calculateWeakenTime)(server, _player_1.Player) + additionalMsec / 1000.0;
        NetscriptHelpers_1.helpers.log(ctx, () => `Executing on '${server.hostname}' in ${(0, StringHelperFunctions_1.convertTimeMsToTimeElapsedString)(weakenTime * 1000, true)} (t=${(0, formatNumber_1.formatThreads)(threads)})`);
        return NetscriptHelpers_1.helpers.netscriptDelay(ctx, weakenTime * 1000).then(function () {
            const scripthost = (0, AllServers_1.GetServer)(ctx.workerScript.hostname);
            if (scripthost === null) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Cannot find host of WorkerScript. Hostname: ${ctx.workerScript.hostname}.`);
            }
            const weakenAmt = (0, ServerHelpers_1.getWeakenEffect)(threads, scripthost.cpuCores);
            const securityBeforeWeaken = server.hackDifficulty;
            server.weaken(weakenAmt);
            const securityAfterWeaken = server.hackDifficulty;
            const securityReduction = securityBeforeWeaken - securityAfterWeaken;
            ctx.workerScript.scriptRef.recordWeaken(server.hostname, threads);
            const expGain = (0, Hacking_1.calculateHackingExpGain)(server, _player_1.Player) * threads;
            NetscriptHelpers_1.helpers.log(ctx, () => `'${server.hostname}' security level weakened to ${server.hackDifficulty}. Gained ${(0, formatNumber_1.formatExp)(expGain)} hacking exp (t=${(0, formatNumber_1.formatThreads)(threads)})`);
            ctx.workerScript.scriptRef.onlineExpGained += expGain;
            _player_1.Player.gainHackingExp(expGain);
            // Account for hidden multiplier in Server.weaken()
            return Promise.resolve(securityReduction);
        });
    },
    weakenAnalyze: (ctx) => (_threads, _cores = 1) => {
        const threads = NetscriptHelpers_1.helpers.number(ctx, "threads", _threads);
        const cores = NetscriptHelpers_1.helpers.number(ctx, "cores", _cores);
        return (0, ServerHelpers_1.getWeakenEffect)(threads, cores);
    },
    share: (ctx) => () => {
        const threads = ctx.workerScript.scriptRef.threads;
        const hostname = ctx.workerScript.hostname;
        NetscriptHelpers_1.helpers.log(ctx, () => `Sharing ${threads} threads on ${hostname}.`);
        const end = (0, Share_1.startSharing)(threads, NetscriptHelpers_1.helpers.getServer(ctx, hostname).cpuCores);
        return NetscriptHelpers_1.helpers.netscriptDelay(ctx, Share_1.ShareBonusTime).finally(function () {
            NetscriptHelpers_1.helpers.log(ctx, () => `Finished sharing ${threads} threads on ${hostname}.`);
            end();
        });
    },
    getSharePower: () => () => {
        return (0, Share_1.calculateCurrentShareBonus)();
    },
    print: (ctx) => (...args) => {
        if (args.length === 0) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, "Takes at least 1 argument.");
        }
        ctx.workerScript.print(NetscriptHelpers_1.helpers.argsToString(args));
    },
    printf: (ctx) => (_format, ...args) => {
        const format = NetscriptHelpers_1.helpers.string(ctx, "format", _format);
        if (typeof format !== "string") {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, "First argument must be string for the format.");
        }
        ctx.workerScript.print((0, sprintf_js_1.vsprintf)(format, args));
    },
    tprint: (ctx) => (...args) => {
        if (args.length === 0) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, "Takes at least 1 argument.");
        }
        const str = NetscriptHelpers_1.helpers.argsToString(args);
        if (str.startsWith("ERROR") || str.startsWith("FAIL")) {
            Terminal_1.Terminal.error(`${ctx.workerScript.name}: ${str}`);
            return;
        }
        if (str.startsWith("SUCCESS")) {
            Terminal_1.Terminal.success(`${ctx.workerScript.name}: ${str}`);
            return;
        }
        if (str.startsWith("WARN")) {
            Terminal_1.Terminal.warn(`${ctx.workerScript.name}: ${str}`);
            return;
        }
        if (str.startsWith("INFO")) {
            Terminal_1.Terminal.info(`${ctx.workerScript.name}: ${str}`);
            return;
        }
        Terminal_1.Terminal.print(`${ctx.workerScript.name}: ${str}`);
    },
    tprintf: (ctx) => (_format, ...args) => {
        const format = NetscriptHelpers_1.helpers.string(ctx, "format", _format);
        const str = (0, sprintf_js_1.vsprintf)(format, args);
        if (str.startsWith("ERROR") || str.startsWith("FAIL")) {
            Terminal_1.Terminal.error(`${str}`);
            return;
        }
        if (str.startsWith("SUCCESS")) {
            Terminal_1.Terminal.success(`${str}`);
            return;
        }
        if (str.startsWith("WARN")) {
            Terminal_1.Terminal.warn(`${str}`);
            return;
        }
        if (str.startsWith("INFO")) {
            Terminal_1.Terminal.info(`${str}`);
            return;
        }
        Terminal_1.Terminal.print(`${str}`);
    },
    clearLog: (ctx) => () => {
        ctx.workerScript.scriptRef.clearLog();
    },
    disableLog: (ctx) => (_fn) => {
        const fn = NetscriptHelpers_1.helpers.string(ctx, "fn", _fn);
        if (possibleLogs[fn] === undefined) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid argument: ${fn}.`);
        }
        if (fn === "ALL") {
            ctx.workerScript.disableLogs = allDisabled;
            // No need to log here, it's been disabled.
        }
        else {
            // We don't track individual log entries when all are disabled.
            if (!ctx.workerScript.disableLogs["ALL"]) {
                ctx.workerScript.disableLogs[fn] = true;
                NetscriptHelpers_1.helpers.log(ctx, () => `Disabled logging for ${fn}`);
            }
        }
    },
    enableLog: (ctx) => (_fn) => {
        const fn = NetscriptHelpers_1.helpers.string(ctx, "fn", _fn);
        if (possibleLogs[fn] === undefined) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid argument: ${fn}.`);
        }
        if (fn === "ALL") {
            ctx.workerScript.disableLogs = {};
            NetscriptHelpers_1.helpers.log(ctx, () => `Enabled logging for all functions`);
        }
        else {
            if (ctx.workerScript.disableLogs["ALL"]) {
                // As an optimization, we normally store only that key, but we have to
                // expand it out to all keys at this point.
                // Conveniently, possibleLogs serves as a model for "all keys disabled."
                ctx.workerScript.disableLogs = Object.assign({}, possibleLogs, { ALL: false, [fn]: false });
            }
            else {
                ctx.workerScript.disableLogs[fn] = false;
            }
            NetscriptHelpers_1.helpers.log(ctx, () => `Enabled logging for ${fn}`);
        }
    },
    isLogEnabled: (ctx) => (_fn) => {
        const fn = NetscriptHelpers_1.helpers.string(ctx, "fn", _fn);
        if (possibleLogs[fn] === undefined) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid argument: ${fn}.`);
        }
        return ctx.workerScript.shouldLog(fn);
    },
    getScriptLogs: (ctx) => (scriptID, host, ...scriptArgs) => {
        const ident = NetscriptHelpers_1.helpers.scriptIdentifier(ctx, scriptID, host, scriptArgs);
        const runningScriptObj = NetscriptHelpers_1.helpers.getRunningScript(ctx, ident);
        if (runningScriptObj == null) {
            NetscriptHelpers_1.helpers.log(ctx, () => NetscriptHelpers_1.helpers.getCannotFindRunningScriptErrorMessage(ident));
            return [];
        }
        return runningScriptObj.logs.map((x) => String(x));
    },
    nuke: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        if (server.hasAdminRights) {
            NetscriptHelpers_1.helpers.log(ctx, () => `Already have root access to '${server.hostname}'.`);
            return true;
        }
        if (!_player_1.Player.hasProgram(_enums_1.CompletedProgramName.nuke)) {
            NetscriptHelpers_1.helpers.log(ctx, () => "You do not have the NUKE.exe virus!");
            return false;
        }
        if (server.openPortCount < server.numOpenPortsRequired) {
            NetscriptHelpers_1.helpers.log(ctx, () => "Not enough ports opened to use NUKE.exe virus.");
            return false;
        }
        server.hasAdminRights = true;
        NetscriptHelpers_1.helpers.log(ctx, () => `Executed NUKE.exe virus on '${server.hostname}' to gain root access.`);
        return true;
    },
    brutessh: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        if (!_player_1.Player.hasProgram(_enums_1.CompletedProgramName.bruteSsh)) {
            NetscriptHelpers_1.helpers.log(ctx, () => "You do not have the BruteSSH.exe program!");
            return false;
        }
        if (!server.sshPortOpen) {
            NetscriptHelpers_1.helpers.log(ctx, () => `Executed BruteSSH.exe on '${server.hostname}' to open SSH port (22).`);
            server.sshPortOpen = true;
            ++server.openPortCount;
        }
        else {
            NetscriptHelpers_1.helpers.log(ctx, () => `SSH Port (22) already opened on '${server.hostname}'.`);
        }
        return true;
    },
    ftpcrack: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        if (!_player_1.Player.hasProgram(_enums_1.CompletedProgramName.ftpCrack)) {
            NetscriptHelpers_1.helpers.log(ctx, () => "You do not have the FTPCrack.exe program!");
            return false;
        }
        if (!server.ftpPortOpen) {
            NetscriptHelpers_1.helpers.log(ctx, () => `Executed FTPCrack.exe on '${server.hostname}' to open FTP port (21).`);
            server.ftpPortOpen = true;
            ++server.openPortCount;
        }
        else {
            NetscriptHelpers_1.helpers.log(ctx, () => `FTP Port (21) already opened on '${server.hostname}'.`);
        }
        return true;
    },
    relaysmtp: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        if (!_player_1.Player.hasProgram(_enums_1.CompletedProgramName.relaySmtp)) {
            NetscriptHelpers_1.helpers.log(ctx, () => "You do not have the relaySMTP.exe program!");
            return false;
        }
        if (!server.smtpPortOpen) {
            NetscriptHelpers_1.helpers.log(ctx, () => `Executed relaySMTP.exe on '${server.hostname}' to open SMTP port (25).`);
            server.smtpPortOpen = true;
            ++server.openPortCount;
        }
        else {
            NetscriptHelpers_1.helpers.log(ctx, () => `SMTP Port (25) already opened on '${server.hostname}'.`);
        }
        return true;
    },
    httpworm: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        if (!_player_1.Player.hasProgram(_enums_1.CompletedProgramName.httpWorm)) {
            NetscriptHelpers_1.helpers.log(ctx, () => "You do not have the HTTPWorm.exe program!");
            return false;
        }
        if (!server.httpPortOpen) {
            NetscriptHelpers_1.helpers.log(ctx, () => `Executed HTTPWorm.exe on '${server.hostname}' to open HTTP port (80).`);
            server.httpPortOpen = true;
            ++server.openPortCount;
        }
        else {
            NetscriptHelpers_1.helpers.log(ctx, () => `HTTP Port (80) already opened on '${server.hostname}'.`);
        }
        return true;
    },
    sqlinject: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        if (!_player_1.Player.hasProgram(_enums_1.CompletedProgramName.sqlInject)) {
            NetscriptHelpers_1.helpers.log(ctx, () => "You do not have the SQLInject.exe program!");
            return false;
        }
        if (!server.sqlPortOpen) {
            NetscriptHelpers_1.helpers.log(ctx, () => `Executed SQLInject.exe on '${server.hostname}' to open SQL port (1433).`);
            server.sqlPortOpen = true;
            ++server.openPortCount;
        }
        else {
            NetscriptHelpers_1.helpers.log(ctx, () => `SQL Port (1433) already opened on '${server.hostname}'.`);
        }
        return true;
    },
    run: (ctx) => (_scriptname, _thread_or_opt = 1, ..._args) => {
        const path = NetscriptHelpers_1.helpers.scriptPath(ctx, "scriptname", _scriptname);
        const runOpts = NetscriptHelpers_1.helpers.runOptions(ctx, _thread_or_opt);
        const args = NetscriptHelpers_1.helpers.scriptArgs(ctx, _args);
        const scriptServer = ctx.workerScript.getServer();
        return (0, NetscriptWorker_1.runScriptFromScript)("run", scriptServer, path, args, ctx.workerScript, runOpts);
    },
    exec: (ctx) => (_scriptname, _host, _thread_or_opt = 1, ..._args) => {
        const path = NetscriptHelpers_1.helpers.scriptPath(ctx, "scriptname", _scriptname);
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const runOpts = NetscriptHelpers_1.helpers.runOptions(ctx, _thread_or_opt);
        const args = NetscriptHelpers_1.helpers.scriptArgs(ctx, _args);
        const server = NetscriptHelpers_1.helpers.getServer(ctx, host);
        return (0, NetscriptWorker_1.runScriptFromScript)("exec", server, path, args, ctx.workerScript, runOpts);
    },
    spawn: (ctx) => (_scriptname, _thread_or_opt = 1, ..._args) => {
        const path = NetscriptHelpers_1.helpers.scriptPath(ctx, "scriptname", _scriptname);
        const runOpts = NetscriptHelpers_1.helpers.spawnOptions(ctx, _thread_or_opt);
        const args = NetscriptHelpers_1.helpers.scriptArgs(ctx, _args);
        const spawnCb = () => {
            if (GameRoot_1.Router.page() === Router_1.Page.BitVerse) {
                NetscriptHelpers_1.helpers.log(ctx, () => `Script execution is canceled because you are in Bitverse.`);
                return;
            }
            const scriptServer = (0, AllServers_1.GetServer)(ctx.workerScript.hostname);
            if (scriptServer == null) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Cannot find server ${ctx.workerScript.hostname}`);
            }
            return (0, NetscriptWorker_1.runScriptFromScript)("spawn", scriptServer, path, args, ctx.workerScript, runOpts);
        };
        if (runOpts.spawnDelay !== 0) {
            setTimeout(spawnCb, runOpts.spawnDelay);
            NetscriptHelpers_1.helpers.log(ctx, () => `Will execute '${path}' in ${runOpts.spawnDelay} milliseconds`);
        }
        NetscriptHelpers_1.helpers.log(ctx, () => "About to exit...");
        const killed = (0, killWorkerScript_1.killWorkerScript)(ctx.workerScript);
        if (runOpts.spawnDelay === 0) {
            NetscriptHelpers_1.helpers.log(ctx, () => `Executing '${path}' immediately`);
            spawnCb();
        }
        if (killed) {
            // This prevents error messages about statements after the spawn()
            // trying to be executed when the script is dead.
            throw new ScriptDeath_1.ScriptDeath(ctx.workerScript);
        }
    },
    self: (ctx) => () => {
        const runningScript = NetscriptHelpers_1.helpers.getRunningScript(ctx, ctx.workerScript.pid);
        if (runningScript == null)
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, "Cannot find running script. This is a bug.");
        return NetscriptHelpers_1.helpers.createPublicRunningScript(runningScript, ctx.workerScript);
    },
    kill: (ctx) => (scriptID, host = ctx.workerScript.hostname, ...scriptArgs) => {
        const ident = NetscriptHelpers_1.helpers.scriptIdentifier(ctx, scriptID, host, scriptArgs);
        let res;
        const killByPid = typeof ident === "number";
        if (killByPid) {
            // Kill by pid
            res = (0, killWorkerScript_1.killWorkerScriptByPid)(ident, ctx.workerScript);
        }
        else {
            // Kill by filename/hostname
            if (scriptID === undefined) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, "Usage: kill(scriptname, server, [arg1], [arg2]...)");
            }
            const byPid = NetscriptHelpers_1.helpers.getRunningScriptsByArgs(ctx, ident.scriptname, ident.hostname, ident.args);
            if (byPid === null) {
                NetscriptHelpers_1.helpers.log(ctx, () => NetscriptHelpers_1.helpers.getCannotFindRunningScriptErrorMessage(ident));
                return false;
            }
            res = true;
            for (const pid of byPid.keys()) {
                res && (res = (0, killWorkerScript_1.killWorkerScriptByPid)(pid, ctx.workerScript));
            }
        }
        if (res) {
            if (killByPid) {
                NetscriptHelpers_1.helpers.log(ctx, () => `Killing script with PID ${ident}`);
            }
            else {
                NetscriptHelpers_1.helpers.log(ctx, () => `Killing '${scriptID}' on '${host}' with args: ${(0, ArrayHelpers_1.arrayToString)(scriptArgs)}.`);
            }
            return true;
        }
        else {
            if (killByPid) {
                NetscriptHelpers_1.helpers.log(ctx, () => `No script with PID ${ident}`);
            }
            else {
                NetscriptHelpers_1.helpers.log(ctx, () => `Internal error killing '${scriptID}' on '${host}' with args: ${(0, ArrayHelpers_1.arrayToString)(scriptArgs)}`);
            }
            return false;
        }
    },
    killall: (ctx) => (_host = ctx.workerScript.hostname, _safetyGuard = true) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const safetyGuard = !!_safetyGuard;
        const server = NetscriptHelpers_1.helpers.getServer(ctx, host);
        let scriptsKilled = 0;
        for (const byPid of server.runningScriptMap.values()) {
            for (const pid of byPid.keys()) {
                if (safetyGuard && pid == ctx.workerScript.pid)
                    continue;
                (0, killWorkerScript_1.killWorkerScriptByPid)(pid, ctx.workerScript);
                ++scriptsKilled;
            }
        }
        NetscriptHelpers_1.helpers.log(ctx, () => `Killing all scripts on '${server.hostname}'.`);
        return scriptsKilled > 0;
    },
    exit: (ctx) => () => {
        NetscriptHelpers_1.helpers.log(ctx, () => "Exiting...");
        (0, killWorkerScript_1.killWorkerScript)(ctx.workerScript);
        throw new ScriptDeath_1.ScriptDeath(ctx.workerScript);
    },
    scp: (ctx) => (_files, _destination, _source) => {
        const destination = NetscriptHelpers_1.helpers.string(ctx, "destination", _destination);
        const source = NetscriptHelpers_1.helpers.string(ctx, "source", _source ?? ctx.workerScript.hostname);
        const destServer = NetscriptHelpers_1.helpers.getServer(ctx, destination);
        const sourceServer = NetscriptHelpers_1.helpers.getServer(ctx, source);
        const files = Array.isArray(_files) ? _files : [_files];
        const lits = [];
        const contentFiles = [];
        //First loop through filenames to find all errors before moving anything.
        for (const file of files) {
            const path = NetscriptHelpers_1.helpers.filePath(ctx, "files", file);
            if ((0, ScriptFilePath_1.hasScriptExtension)(path) || (0, TextFilePath_1.hasTextExtension)(path)) {
                contentFiles.push(path);
                continue;
            }
            if (!path.endsWith(".lit")) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, "Only works for scripts, .lit and .txt files.");
            }
            lits.push(path);
        }
        let noFailures = true;
        // --- Scripts and Text Files---
        for (const contentFilePath of contentFiles) {
            const sourceContentFile = sourceServer.getContentFile(contentFilePath);
            if (!sourceContentFile) {
                NetscriptHelpers_1.helpers.log(ctx, () => `File '${contentFilePath}' does not exist.`);
                noFailures = false;
                continue;
            }
            // Overwrite script if it already exists
            const result = destServer.writeToContentFile(contentFilePath, sourceContentFile.content);
            NetscriptHelpers_1.helpers.log(ctx, () => `Copied file ${contentFilePath} from ${sourceServer.hostname} to ${destServer.hostname}`);
            if (result.overwritten) {
                NetscriptHelpers_1.helpers.log(ctx, () => `Warning: ${contentFilePath} was overwritten on ${destServer.hostname}`);
            }
        }
        // --- Literature Files ---
        for (const litFilePath of lits) {
            const sourceMessage = sourceServer.messages.find((message) => message === litFilePath);
            if (!sourceMessage) {
                NetscriptHelpers_1.helpers.log(ctx, () => `File '${litFilePath}' does not exist.`);
                noFailures = false;
                continue;
            }
            const destMessage = destServer.messages.find((message) => message === litFilePath);
            if (destMessage) {
                NetscriptHelpers_1.helpers.log(ctx, () => `File '${litFilePath}' was already on '${destServer.hostname}'.`);
                continue;
            }
            // It exists in sourceServer.messages, so it's a valid name.
            destServer.messages.push(litFilePath);
            NetscriptHelpers_1.helpers.log(ctx, () => `File '${litFilePath}' copied over to '${destServer.hostname}'.`);
            continue;
        }
        return noFailures;
    },
    ls: (ctx) => (_host, _substring) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const substring = NetscriptHelpers_1.helpers.string(ctx, "substring", _substring ?? "");
        const server = NetscriptHelpers_1.helpers.getServer(ctx, host);
        const allFilenames = [
            ...server.contracts.map((contract) => contract.fn),
            ...server.messages,
            ...server.programs,
            ...server.scripts.keys(),
            ...server.textFiles.keys(),
        ];
        if (!substring)
            return allFilenames.sort();
        return allFilenames.filter((filename) => ("/" + filename).includes(substring)).sort();
    },
    getRecentScripts: () => () => {
        return RecentScripts_1.recentScripts.map((rs) => ({
            timeOfDeath: rs.timeOfDeath,
            ...NetscriptHelpers_1.helpers.createPublicRunningScript(rs.runningScript),
        }));
    },
    ps: (ctx) => (_host = ctx.workerScript.hostname) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getServer(ctx, host);
        const processes = [];
        for (const byPid of server.runningScriptMap.values()) {
            for (const script of byPid.values()) {
                processes.push({
                    filename: script.filename,
                    threads: script.threads,
                    args: script.args.slice(),
                    pid: script.pid,
                    temporary: script.temporary,
                });
            }
        }
        return processes;
    },
    hasRootAccess: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getServer(ctx, host);
        return server.hasAdminRights;
    },
    getHostname: (ctx) => () => ctx.workerScript.hostname,
    getIP: (ctx) => () => {
        const hostname = ctx.workerScript.hostname;
        const server = NetscriptHelpers_1.helpers.getServer(ctx, hostname);
        return server.ip;
    },
    getHackingLevel: (ctx) => () => {
        _player_1.Player.updateSkillLevels();
        NetscriptHelpers_1.helpers.log(ctx, () => `returned ${_player_1.Player.skills.hacking}`);
        return _player_1.Player.skills.hacking;
    },
    getHackingMultipliers: () => () => {
        return {
            chance: _player_1.Player.mults.hacking_chance,
            speed: _player_1.Player.mults.hacking_speed,
            money: _player_1.Player.mults.hacking_money,
            growth: _player_1.Player.mults.hacking_grow,
        };
    },
    getHacknetMultipliers: () => () => {
        return {
            production: _player_1.Player.mults.hacknet_node_money,
            purchaseCost: _player_1.Player.mults.hacknet_node_purchase_cost,
            ramCost: _player_1.Player.mults.hacknet_node_ram_cost,
            coreCost: _player_1.Player.mults.hacknet_node_core_cost,
            levelCost: _player_1.Player.mults.hacknet_node_level_cost,
        };
    },
    getBitNodeMultipliers: (ctx) => (_n = _player_1.Player.bitNodeN, _lvl = _player_1.Player.activeSourceFileLvl(_player_1.Player.bitNodeN) + 1) => {
        if (!(0, BitNodeUtils_1.canAccessBitNodeFeature)(5)) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, "Requires Source-File 5 to run.");
        }
        const n = NetscriptHelpers_1.helpers.positiveInteger(ctx, "n", _n);
        const lvl = NetscriptHelpers_1.helpers.positiveInteger(ctx, "lvl", _lvl);
        if (!Constants_3.validBitNodes.includes(n)) {
            throw new Error(`Invalid BitNode: ${n}.`);
        }
        return Object.assign({}, (0, BitNode_1.getBitNodeMultipliers)(n, lvl));
    },
    getServer: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host ?? ctx.workerScript.hostname);
        const server = NetscriptHelpers_1.helpers.getServer(ctx, host);
        return {
            hostname: server.hostname,
            ip: server.ip,
            sshPortOpen: server.sshPortOpen,
            ftpPortOpen: server.ftpPortOpen,
            smtpPortOpen: server.smtpPortOpen,
            httpPortOpen: server.httpPortOpen,
            sqlPortOpen: server.sqlPortOpen,
            hasAdminRights: server.hasAdminRights,
            cpuCores: server.cpuCores,
            isConnectedTo: server.isConnectedTo,
            ramUsed: server.ramUsed,
            maxRam: server.maxRam,
            organizationName: server.organizationName,
            purchasedByPlayer: server.purchasedByPlayer,
            backdoorInstalled: server.backdoorInstalled,
            baseDifficulty: server.baseDifficulty,
            hackDifficulty: server.hackDifficulty,
            minDifficulty: server.minDifficulty,
            moneyAvailable: server.hostname === "home" ? _player_1.Player.money : server.moneyAvailable,
            moneyMax: server.moneyMax,
            numOpenPortsRequired: server.numOpenPortsRequired,
            openPortCount: server.openPortCount,
            requiredHackingSkill: server.requiredHackingSkill,
            serverGrowth: server.serverGrowth,
        };
    },
    getServerMoneyAvailable: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        if (server.hostname == "home") {
            // Return player's money
            NetscriptHelpers_1.helpers.log(ctx, () => `returned player's money: ${(0, formatNumber_1.formatMoney)(_player_1.Player.money)}`);
            return _player_1.Player.money;
        }
        NetscriptHelpers_1.helpers.log(ctx, () => `returned ${(0, formatNumber_1.formatMoney)(server.moneyAvailable)} for '${server.hostname}'`);
        return server.moneyAvailable;
    },
    getServerSecurityLevel: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        NetscriptHelpers_1.helpers.log(ctx, () => `returned ${(0, formatNumber_1.formatSecurity)(server.hackDifficulty)} for '${server.hostname}'`);
        return server.hackDifficulty;
    },
    getServerBaseSecurityLevel: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        NetscriptHelpers_1.helpers.log(ctx, () => `returned ${(0, formatNumber_1.formatSecurity)(server.baseDifficulty)} for '${server.hostname}'`);
        return server.baseDifficulty;
    },
    getServerMinSecurityLevel: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        NetscriptHelpers_1.helpers.log(ctx, () => `returned ${(0, formatNumber_1.formatSecurity)(server.minDifficulty)} for ${server.hostname}`);
        return server.minDifficulty;
    },
    getServerRequiredHackingLevel: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        NetscriptHelpers_1.helpers.log(ctx, () => `returned ${(0, formatNumber_1.formatNumberNoSuffix)(server.requiredHackingSkill, 0)} for '${server.hostname}'`);
        return server.requiredHackingSkill;
    },
    getServerMaxMoney: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        NetscriptHelpers_1.helpers.log(ctx, () => `returned ${(0, formatNumber_1.formatMoney)(server.moneyMax)} for '${server.hostname}'`);
        return server.moneyMax;
    },
    getServerGrowth: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        NetscriptHelpers_1.helpers.log(ctx, () => `returned ${server.serverGrowth} for '${server.hostname}'`);
        return server.serverGrowth;
    },
    getServerNumPortsRequired: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        NetscriptHelpers_1.helpers.log(ctx, () => `returned ${server.numOpenPortsRequired} for '${server.hostname}'`);
        return server.numOpenPortsRequired;
    },
    getServerMaxRam: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getServer(ctx, host);
        NetscriptHelpers_1.helpers.log(ctx, () => `returned ${(0, formatNumber_1.formatRam)(server.maxRam)}`);
        return server.maxRam;
    },
    getServerUsedRam: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getServer(ctx, host);
        NetscriptHelpers_1.helpers.log(ctx, () => `returned ${(0, formatNumber_1.formatRam)(server.ramUsed)}`);
        return server.ramUsed;
    },
    dnsLookup: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getServer(ctx, host);
        return (0, strings_1.isIPAddress)(host) ? server.hostname : server.ip;
    },
    serverExists: (ctx) => (_host) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = (0, AllServers_1.GetServer)(host);
        return server !== null && server.serversOnNetwork.length > 0;
    },
    fileExists: (ctx) => (_filename, _host) => {
        const filename = NetscriptHelpers_1.helpers.string(ctx, "filename", _filename);
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host ?? ctx.workerScript.hostname);
        const server = NetscriptHelpers_1.helpers.getServer(ctx, host);
        const path = (0, FilePath_1.resolveFilePath)(filename, ctx.workerScript.name);
        if (!path)
            return false;
        if ((0, ScriptFilePath_1.hasScriptExtension)(path))
            return server.scripts.has(path);
        if ((0, TextFilePath_1.hasTextExtension)(path))
            return server.textFiles.has(path);
        if (path.endsWith(".lit") || path.endsWith(".msg"))
            return server.messages.includes(path);
        if ((0, ContractFilePath_1.hasContractExtension)(path))
            return !!server.contracts.find(({ fn }) => fn === path);
        const lowerPath = path.toLowerCase();
        return server.programs.map((programName) => programName.toLowerCase()).includes(lowerPath);
    },
    isRunning: (ctx) => (fn, host, ...scriptArgs) => {
        const ident = NetscriptHelpers_1.helpers.scriptIdentifier(ctx, fn, host, scriptArgs);
        return NetscriptHelpers_1.helpers.getRunningScript(ctx, ident) !== null;
    },
    getPurchasedServerLimit: () => () => {
        return (0, ServerPurchases_1.getPurchaseServerLimit)();
    },
    getPurchasedServerMaxRam: () => () => {
        return (0, ServerPurchases_1.getPurchaseServerMaxRam)();
    },
    getPurchasedServerCost: (ctx) => (_ram) => {
        const ram = NetscriptHelpers_1.helpers.number(ctx, "ram", _ram);
        const cost = (0, ServerPurchases_1.getPurchaseServerCost)(ram);
        if (cost === Infinity) {
            if (ram > (0, ServerPurchases_1.getPurchaseServerMaxRam)()) {
                NetscriptHelpers_1.helpers.log(ctx, () => `Invalid argument: ram='${ram}' must not be greater than getPurchaseServerMaxRam`);
            }
            else {
                NetscriptHelpers_1.helpers.log(ctx, () => `Invalid argument: ram='${ram}' must be a positive power of 2`);
            }
            return Infinity;
        }
        return cost;
    },
    purchaseServer: (ctx) => (_name, _ram) => {
        const name = NetscriptHelpers_1.helpers.string(ctx, "name", _name);
        const ram = NetscriptHelpers_1.helpers.number(ctx, "ram", _ram);
        let hostnameStr = String(name);
        hostnameStr = hostnameStr.replace(/\s+/g, "");
        if (hostnameStr == "" || (0, strings_1.isIPAddress)(hostnameStr)) {
            NetscriptHelpers_1.helpers.log(ctx, () => `Invalid argument: hostname='${hostnameStr}'`);
            return "";
        }
        if (hostnameStr.startsWith("hacknet-node-") || hostnameStr.startsWith("hacknet-server-")) {
            NetscriptHelpers_1.helpers.log(ctx, () => `Invalid argument: hostname='${hostnameStr}' is a reserved hostname.`);
            return "";
        }
        if (_player_1.Player.purchasedServers.length >= (0, ServerPurchases_1.getPurchaseServerLimit)()) {
            NetscriptHelpers_1.helpers.log(ctx, () => `You have reached the maximum limit of ${(0, ServerPurchases_1.getPurchaseServerLimit)()} servers. You cannot purchase any more.`);
            return "";
        }
        const cost = (0, ServerPurchases_1.getPurchaseServerCost)(ram);
        if (cost === Infinity) {
            if (ram > (0, ServerPurchases_1.getPurchaseServerMaxRam)()) {
                NetscriptHelpers_1.helpers.log(ctx, () => `Invalid argument: ram='${ram}' must not be greater than getPurchaseServerMaxRam`);
            }
            else {
                NetscriptHelpers_1.helpers.log(ctx, () => `Invalid argument: ram='${ram}' must be a positive power of 2`);
            }
            return "";
        }
        if (_player_1.Player.money < cost) {
            NetscriptHelpers_1.helpers.log(ctx, () => `Not enough money to purchase server. Need ${(0, formatNumber_1.formatMoney)(cost)}`);
            return "";
        }
        const newServ = (0, ServerHelpers_1.safelyCreateUniqueServer)({
            ip: (0, AllServers_1.createUniqueRandomIp)(),
            hostname: hostnameStr,
            organizationName: "",
            isConnectedTo: false,
            adminRights: true,
            purchasedByPlayer: true,
            maxRam: ram,
        });
        (0, AllServers_1.AddToAllServers)(newServ);
        _player_1.Player.purchasedServers.push(newServ.hostname);
        const homeComputer = _player_1.Player.getHomeComputer();
        homeComputer.serversOnNetwork.push(newServ.hostname);
        newServ.serversOnNetwork.push(homeComputer.hostname);
        _player_1.Player.loseMoney(cost, "servers");
        NetscriptHelpers_1.helpers.log(ctx, () => `Purchased new server with hostname '${newServ.hostname}' for ${(0, formatNumber_1.formatMoney)(cost)}`);
        return newServ.hostname;
    },
    getPurchasedServerUpgradeCost: (ctx) => (_host, _ram) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const ram = NetscriptHelpers_1.helpers.number(ctx, "ram", _ram);
        try {
            return (0, ServerPurchases_1.getPurchasedServerUpgradeCost)(host, ram);
        }
        catch (err) {
            NetscriptHelpers_1.helpers.log(ctx, () => String(err));
            return -1;
        }
    },
    upgradePurchasedServer: (ctx) => (_host, _ram) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const ram = NetscriptHelpers_1.helpers.number(ctx, "ram", _ram);
        try {
            (0, ServerPurchases_1.upgradePurchasedServer)(host, ram);
            return true;
        }
        catch (err) {
            NetscriptHelpers_1.helpers.log(ctx, () => String(err));
            return false;
        }
    },
    renamePurchasedServer: (ctx) => (_hostname, _newName) => {
        const hostname = NetscriptHelpers_1.helpers.string(ctx, "hostname", _hostname);
        const newName = NetscriptHelpers_1.helpers.string(ctx, "newName", _newName);
        try {
            (0, ServerPurchases_1.renamePurchasedServer)(hostname, newName);
            return true;
        }
        catch (err) {
            NetscriptHelpers_1.helpers.log(ctx, () => String(err));
            return false;
        }
    },
    deleteServer: (ctx) => (_name) => {
        const name = NetscriptHelpers_1.helpers.string(ctx, "name", _name);
        let hostnameStr = String(name);
        hostnameStr = hostnameStr.replace(/\s\s+/g, "");
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, hostnameStr);
        if (!server.purchasedByPlayer || server.hostname === "home") {
            NetscriptHelpers_1.helpers.log(ctx, () => "Cannot delete non-purchased server.");
            return false;
        }
        const hostname = server.hostname;
        // Can't delete server you're currently connected to
        if (server.isConnectedTo) {
            NetscriptHelpers_1.helpers.log(ctx, () => "You are currently connected to the server you are trying to delete.");
            return false;
        }
        // A server cannot delete itself
        if (hostname === ctx.workerScript.hostname) {
            NetscriptHelpers_1.helpers.log(ctx, () => "Cannot delete the server this script is running on.");
            return false;
        }
        // Delete all scripts running on server
        if (server.runningScriptMap.size > 0) {
            NetscriptHelpers_1.helpers.log(ctx, () => `Cannot delete server '${hostname}' because it still has scripts running.`);
            return false;
        }
        // Delete from player's purchasedServers array
        let found = false;
        for (let i = 0; i < _player_1.Player.purchasedServers.length; ++i) {
            if (hostname == _player_1.Player.purchasedServers[i]) {
                found = true;
                _player_1.Player.purchasedServers.splice(i, 1);
                break;
            }
        }
        if (!found) {
            NetscriptHelpers_1.helpers.log(ctx, () => `Could not identify server ${hostname} as a purchased server. This is a bug. Report to dev.`);
            return false;
        }
        // Delete from all servers
        (0, AllServers_1.DeleteServer)(hostname);
        // Delete from home computer
        found = false;
        const homeComputer = _player_1.Player.getHomeComputer();
        for (let i = 0; i < homeComputer.serversOnNetwork.length; ++i) {
            if (hostname == homeComputer.serversOnNetwork[i]) {
                homeComputer.serversOnNetwork.splice(i, 1);
                NetscriptHelpers_1.helpers.log(ctx, () => `Deleted server '${hostnameStr}`);
                return true;
            }
        }
        // Wasn't found on home computer
        NetscriptHelpers_1.helpers.log(ctx, () => `Could not find server ${hostname} as a purchased server. This is a bug. Report to dev.`);
        return false;
    },
    getPurchasedServers: (ctx) => (_returnOpts) => {
        const returnOpts = NetscriptHelpers_1.helpers.hostReturnOptions(_returnOpts);
        const res = [];
        for (const hostname of _player_1.Player.purchasedServers) {
            const server = NetscriptHelpers_1.helpers.getServer(ctx, hostname);
            const id = NetscriptHelpers_1.helpers.returnServerID(server, returnOpts);
            res.push(id);
        }
        return res;
    },
    writePort: (ctx) => (_portNumber, data) => {
        const portNumber = NetscriptHelpers_1.helpers.portNumber(ctx, _portNumber);
        return (0, NetscriptPort_1.writePort)(portNumber, data);
    },
    write: (ctx) => (_filename, _data, _mode) => {
        const filepath = NetscriptHelpers_1.helpers.filePath(ctx, "filename", _filename);
        const data = NetscriptHelpers_1.helpers.string(ctx, "data", _data ?? "");
        const mode = NetscriptHelpers_1.helpers.string(ctx, "mode", _mode ?? "a");
        const server = NetscriptHelpers_1.helpers.getServer(ctx, ctx.workerScript.hostname);
        if ((0, ScriptFilePath_1.hasScriptExtension)(filepath)) {
            if (mode === "w") {
                server.writeToScriptFile(filepath, data);
                return;
            }
            const existingScript = server.scripts.get(filepath);
            const existingCode = existingScript ? existingScript.code : "";
            server.writeToScriptFile(filepath, existingCode + data);
            return;
        }
        if (!(0, TextFilePath_1.hasTextExtension)(filepath)) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `File path should be a text file or script. ${filepath} is invalid.`);
        }
        if (mode === "w") {
            server.writeToTextFile(filepath, data);
            return;
        }
        const existingTextFile = server.textFiles.get(filepath);
        const existingText = existingTextFile?.text ?? "";
        server.writeToTextFile(filepath, mode === "w" ? data : existingText + data);
    },
    tryWritePort: (ctx) => (_portNumber, data) => {
        const portNumber = NetscriptHelpers_1.helpers.portNumber(ctx, _portNumber);
        return (0, NetscriptPort_1.tryWritePort)(portNumber, data);
    },
    nextPortWrite: (ctx) => (_portNumber) => {
        const portNumber = NetscriptHelpers_1.helpers.portNumber(ctx, _portNumber);
        return (0, NetscriptPort_1.nextPortWrite)(portNumber);
    },
    readPort: (ctx) => (_portNumber) => {
        const portNumber = NetscriptHelpers_1.helpers.portNumber(ctx, _portNumber);
        return (0, NetscriptPort_1.readPort)(portNumber);
    },
    read: (ctx) => (_filename) => {
        const path = NetscriptHelpers_1.helpers.filePath(ctx, "filename", _filename);
        if (!(0, ScriptFilePath_1.hasScriptExtension)(path) && !(0, TextFilePath_1.hasTextExtension)(path))
            return "";
        const server = ctx.workerScript.getServer();
        return server.getContentFile(path)?.content ?? "";
    },
    getFileMetadata: (ctx) => (_filename) => {
        const path = NetscriptHelpers_1.helpers.filePath(ctx, "filename", _filename);
        if (!(0, ScriptFilePath_1.hasScriptExtension)(path) && !(0, TextFilePath_1.hasTextExtension)(path)) {
            throw new Error(`Invalid path: ${_filename}. It must be a text file or a script.`);
        }
        const server = ctx.workerScript.getServer();
        const contentFile = server.getContentFile(path);
        if (!contentFile) {
            throw new Error(`Invalid path: ${_filename}. The file does not exist on ${server.hostname}.`);
        }
        return contentFile.metadata.plain();
    },
    peek: (ctx) => (_portNumber) => {
        const portNumber = NetscriptHelpers_1.helpers.portNumber(ctx, _portNumber);
        return (0, NetscriptPort_1.peekPort)(portNumber);
    },
    clear: (ctx) => (_file) => {
        const path = NetscriptHelpers_1.helpers.filePath(ctx, "file", _file);
        if (!(0, ScriptFilePath_1.hasScriptExtension)(path) && !(0, TextFilePath_1.hasTextExtension)(path)) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid file path or extension: ${_file}`);
        }
        const server = ctx.workerScript.getServer();
        const file = server.getContentFile(path);
        if (!file)
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `${path} does not exist on ${server.hostname}`);
        // The content setter handles invalidating script modules where applicable.
        file.content = "";
    },
    clearPort: (ctx) => (_portNumber) => {
        const portNumber = NetscriptHelpers_1.helpers.portNumber(ctx, _portNumber);
        return (0, NetscriptPort_1.clearPort)(portNumber);
    },
    getPortHandle: (ctx) => (_portNumber) => {
        const portNumber = NetscriptHelpers_1.helpers.portNumber(ctx, _portNumber);
        return (0, NetscriptPort_1.portHandle)(portNumber);
    },
    rm: (ctx) => (_fn, _host) => {
        const filepath = NetscriptHelpers_1.helpers.filePath(ctx, "fn", _fn);
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host ?? ctx.workerScript.hostname);
        const s = NetscriptHelpers_1.helpers.getServer(ctx, host);
        if (!filepath) {
            NetscriptHelpers_1.helpers.log(ctx, () => `Error while parsing filepath ${filepath}`);
            return false;
        }
        const status = s.removeFile(filepath);
        if (!status.res) {
            NetscriptHelpers_1.helpers.log(ctx, () => status.msg + "");
        }
        return status.res;
    },
    scriptRunning: (ctx) => (_scriptname, _host) => {
        const scriptname = NetscriptHelpers_1.helpers.scriptPath(ctx, "scriptname", _scriptname);
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getServer(ctx, host);
        return server.isRunning(scriptname);
    },
    scriptKill: (ctx) => (_scriptname, _host) => {
        const path = NetscriptHelpers_1.helpers.scriptPath(ctx, "scriptname", _scriptname);
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getServer(ctx, host);
        let suc = false;
        const pattern = (0, scriptKey_1.matchScriptPathExact)((0, lodash_1.escapeRegExp)(path));
        for (const [key, byPid] of server.runningScriptMap) {
            if (!pattern.test(key))
                continue;
            suc = true;
            for (const pid of byPid.keys()) {
                (0, killWorkerScript_1.killWorkerScriptByPid)(pid, ctx.workerScript);
            }
        }
        return suc;
    },
    getScriptName: (ctx) => () => ctx.workerScript.name,
    getScriptRam: (ctx) => (_scriptname, _host) => {
        const path = NetscriptHelpers_1.helpers.scriptPath(ctx, "scriptname", _scriptname);
        const host = NetscriptHelpers_1.helpers.string(ctx, "hostname", _host ?? ctx.workerScript.hostname);
        const server = NetscriptHelpers_1.helpers.getServer(ctx, host);
        const script = server.scripts.get(path);
        if (!script)
            return 0;
        const ramUsage = script.getRamUsage(server.scripts);
        if (!ramUsage) {
            NetscriptHelpers_1.helpers.log(ctx, () => `Could not calculate ram usage for ${path} on ${host}.`);
            return 0;
        }
        return ramUsage;
    },
    getRunningScript: (ctx) => (fn, host, ...args) => {
        const ident = NetscriptHelpers_1.helpers.scriptIdentifier(ctx, fn, host, args);
        const runningScript = NetscriptHelpers_1.helpers.getRunningScript(ctx, ident);
        if (runningScript === null)
            return null;
        // Need to look this up again, because we only have ident-based lookup
        // for RunningScript.
        const ws = WorkerScripts_1.workerScripts.get(runningScript.pid);
        // We don't check for null, since it's fine to pass null as the 2nd arg.
        return NetscriptHelpers_1.helpers.createPublicRunningScript(runningScript, ws);
    },
    ramOverride: (ctx) => (_ram) => {
        const newRam = (0, roundToTwo_1.roundToTwo)(NetscriptHelpers_1.helpers.number(ctx, "ram", _ram || 0));
        const rs = ctx.workerScript.scriptRef;
        const server = ctx.workerScript.getServer();
        if (newRam < (0, roundToTwo_1.roundToTwo)(ctx.workerScript.dynamicRamUsage)) {
            // Impossibly small, return immediately.
            return rs.ramUsage;
        }
        const newServerRamUsed = (0, roundToTwo_1.roundToTwo)(server.ramUsed + (newRam - rs.ramUsage) * rs.threads);
        if (newServerRamUsed > server.maxRam) {
            // Can't allocate more RAM.
            return rs.ramUsage;
        }
        if (newServerRamUsed <= 0) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Game error: Calculated impossible new server ramUsed ${newServerRamUsed} from new limit of ${_ram}`);
        }
        server.updateRamUsed(newServerRamUsed);
        rs.ramUsage = newRam;
        return rs.ramUsage;
    },
    getHackTime: (ctx) => (_host = ctx.workerScript.hostname) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "hostname", _host);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        return (0, Hacking_1.calculateHackingTime)(server, _player_1.Player) * 1000;
    },
    getGrowTime: (ctx) => (_host = ctx.workerScript.hostname) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        return (0, Hacking_1.calculateGrowTime)(server, _player_1.Player) * 1000;
    },
    getWeakenTime: (ctx) => (_host = ctx.workerScript.hostname) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "hostname", _host);
        const server = NetscriptHelpers_1.helpers.getNormalServer(ctx, host);
        return (0, Hacking_1.calculateWeakenTime)(server, _player_1.Player) * 1000;
    },
    getTotalScriptIncome: () => () => {
        // First element is total income of all currently running scripts
        let total = 0;
        for (const script of WorkerScripts_1.workerScripts.values()) {
            total += script.scriptRef.onlineMoneyMade / script.scriptRef.onlineRunningTime;
        }
        let incomeFromScriptsSinceLastAug = _player_1.Player.scriptProdSinceLastAug / (_player_1.Player.playtimeSinceLastAug / 1000);
        if (!Number.isFinite(incomeFromScriptsSinceLastAug)) {
            incomeFromScriptsSinceLastAug = 0;
        }
        return [total, incomeFromScriptsSinceLastAug];
    },
    getScriptIncome: (ctx) => (fn, host, ...args) => {
        const ident = NetscriptHelpers_1.helpers.scriptIdentifier(ctx, fn, host, args);
        const runningScript = NetscriptHelpers_1.helpers.getRunningScript(ctx, ident);
        if (runningScript == null) {
            NetscriptHelpers_1.helpers.log(ctx, () => NetscriptHelpers_1.helpers.getCannotFindRunningScriptErrorMessage(ident));
            return -1;
        }
        return runningScript.onlineMoneyMade / runningScript.onlineRunningTime;
    },
    getTotalScriptExpGain: () => () => {
        let total = 0;
        for (const ws of WorkerScripts_1.workerScripts.values()) {
            total += ws.scriptRef.onlineExpGained / ws.scriptRef.onlineRunningTime;
        }
        return total;
    },
    getScriptExpGain: (ctx) => (fn, host, ...args) => {
        const ident = NetscriptHelpers_1.helpers.scriptIdentifier(ctx, fn, host, args);
        const runningScript = NetscriptHelpers_1.helpers.getRunningScript(ctx, ident);
        if (runningScript == null) {
            NetscriptHelpers_1.helpers.log(ctx, () => NetscriptHelpers_1.helpers.getCannotFindRunningScriptErrorMessage(ident));
            return -1;
        }
        return runningScript.onlineExpGained / runningScript.onlineRunningTime;
    },
    alert: (ctx) => (...args) => {
        if (args.length === 0) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, "Takes at least 1 argument.");
        }
        const message = NetscriptHelpers_1.helpers.argsToString(args);
        (0, DialogBox_1.dialogBoxCreate)(message, { html: true, canBeDismissedEasily: true });
    },
    toast: (ctx) => (_message, _variant = _enums_1.ToastVariant.SUCCESS, _duration = 2000) => {
        const message = NetscriptHelpers_1.helpers.string(ctx, "message", _message);
        const variant = (0, EnumHelper_1.getEnumHelper)("ToastVariant").nsGetMember(ctx, _variant);
        const duration = _duration === null ? null : NetscriptHelpers_1.helpers.number(ctx, "duration", _duration);
        Snackbar_1.SnackbarEvents.emit(message, variant, duration);
    },
    prompt: (ctx) => (_txt, _options) => {
        const options = {};
        _options ?? (_options = options);
        const txt = NetscriptHelpers_1.helpers.string(ctx, "txt", _txt);
        (0, TypeAssertion_1.assert)(_options, TypeAssertion_1.assertObject, (type) => NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid type for options: ${type}. Should be object.`, "TYPE"));
        if (_options.type !== undefined) {
            (0, TypeAssertion_1.assert)(_options.type, TypeAssertion_1.assertString, (type) => NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid type for options.type: ${type}. Should be string.`, "TYPE"));
            options.type = _options.type;
            const validTypes = ["boolean", "text", "select"];
            if (!["boolean", "text", "select"].includes(options.type)) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid value for options.type: ${options.type}. Must be one of ${validTypes.join(", ")}.`);
            }
            if (options.type === "select") {
                (0, TypeAssertion_1.assert)(_options.choices, TypeAssertion_1.assertArray, (type) => NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid type for options.choices: ${type}. If options.type is "select", options.choices must be an array.`, "TYPE"));
                options.choices = _options.choices.map((choice, i) => NetscriptHelpers_1.helpers.string(ctx, `options.choices[${i}]`, choice));
            }
        }
        return new Promise(function (resolve) {
            PromptManager_1.PromptEvent.emit({
                txt: txt,
                options,
                resolve: resolve,
            });
        });
    },
    wget: (ctx) => async (_url, _target, _host) => {
        const url = NetscriptHelpers_1.helpers.string(ctx, "url", _url);
        const target = NetscriptHelpers_1.helpers.filePath(ctx, "target", _target);
        const host = _host ? NetscriptHelpers_1.helpers.string(ctx, "hostname", _host) : ctx.workerScript.hostname;
        const server = NetscriptHelpers_1.helpers.getServer(ctx, host);
        if (!target || (!(0, TextFilePath_1.hasTextExtension)(target) && !(0, ScriptFilePath_1.hasScriptExtension)(target))) {
            NetscriptHelpers_1.helpers.log(ctx, () => `Invalid target file: '${target}'. Must be a script or text file.`);
            return false;
        }
        let response;
        try {
            response = await fetch(url);
        }
        catch (error) {
            /**
             * Properties in error are not enumerable, so JSON.stringify(error) returns "{}". We need to explicitly specify
             * the properties in the "replacer" parameter of JSON.stringify. We can do it by using Object.getOwnPropertyNames.
             *
             * Ref:
             * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
             * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
             * - https://stackoverflow.com/q/18391212
             */
            NetscriptHelpers_1.helpers.log(ctx, () => JSON.stringify(error, Object.getOwnPropertyNames(error)));
            return false;
        }
        if (response.status !== 200) {
            NetscriptHelpers_1.helpers.log(ctx, () => `wget failed. HTTP code: ${response.status}.`);
            return false;
        }
        const writeResult = server.writeToContentFile(target, await response.text());
        if (writeResult.overwritten) {
            NetscriptHelpers_1.helpers.log(ctx, () => `Successfully retrieved content and overwrote '${target}' on '${host}'`);
        }
        else {
            NetscriptHelpers_1.helpers.log(ctx, () => `Successfully retrieved content to new file '${target}' on '${host}'`);
        }
        return true;
    },
    getFavorToDonate: () => () => {
        return Math.floor(Constants_1.CONSTANTS.BaseFavorToDonate * BitNodeMultipliers_1.currentNodeMults.FavorToDonateToFaction);
    },
    getPlayer: () => () => {
        const data = {
            // Person
            hp: structuredClone(_player_1.Player.hp),
            skills: structuredClone(_player_1.Player.skills),
            exp: structuredClone(_player_1.Player.exp),
            mults: structuredClone(_player_1.Player.mults),
            city: _player_1.Player.city,
            // Player-specific
            numPeopleKilled: _player_1.Player.numPeopleKilled,
            money: _player_1.Player.money,
            location: _player_1.Player.location,
            totalPlaytime: _player_1.Player.totalPlaytime,
            jobs: structuredClone(_player_1.Player.jobs),
            factions: _player_1.Player.factions.slice(),
            entropy: _player_1.Player.entropy,
            karma: _player_1.Player.karma,
        };
        return data;
    },
    getMoneySources: () => () => ({
        sinceInstall: Object.assign({}, _player_1.Player.moneySourceA),
        sinceStart: Object.assign({}, _player_1.Player.moneySourceB),
    }),
    atExit: (ctx) => (callback, _id) => {
        const id = _id ? NetscriptHelpers_1.helpers.string(ctx, "id", _id) : "default";
        (0, TypeAssertion_2.assertFunctionWithNSContext)(ctx, "callback", callback);
        ctx.workerScript.atExit.set(id, callback);
    },
    mv: (ctx) => (_host, _source, _destination) => {
        const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
        const server = NetscriptHelpers_1.helpers.getServer(ctx, host);
        const sourcePath = NetscriptHelpers_1.helpers.filePath(ctx, "source", _source);
        const destinationPath = NetscriptHelpers_1.helpers.filePath(ctx, "destination", _destination);
        if ((!(0, TextFilePath_1.hasTextExtension)(sourcePath) && !(0, ScriptFilePath_1.hasScriptExtension)(sourcePath)) ||
            (!(0, TextFilePath_1.hasTextExtension)(destinationPath) && !(0, ScriptFilePath_1.hasScriptExtension)(destinationPath))) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `'mv' can only be used on scripts (.js, .jsx, .ts, .tsx) and text files (.txt, .json)`);
        }
        if (sourcePath === destinationPath) {
            NetscriptHelpers_1.helpers.log(ctx, () => "WARNING: Did nothing, source and destination paths were the same.");
            return;
        }
        const sourceContentFile = server.getContentFile(sourcePath);
        if (!sourceContentFile) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Source text file ${sourcePath} does not exist on ${host}`);
        }
        const success = sourceContentFile.deleteFromServer(server);
        if (!success) {
            NetscriptHelpers_1.helpers.log(ctx, () => `ERROR: Failed. Was unable to remove file ${sourcePath} from its original location. If ${sourcePath} is a script, make sure that it is NOT running before trying to use 'mv' on it.`);
            return;
        }
        const { overwritten } = server.writeToContentFile(destinationPath, sourceContentFile.content);
        if (overwritten) {
            NetscriptHelpers_1.helpers.log(ctx, () => `WARNING: Overwriting file ${destinationPath} on ${host}`);
        }
        NetscriptHelpers_1.helpers.log(ctx, () => `Moved ${sourcePath} to ${destinationPath} on ${host}`);
    },
    getResetInfo: () => () => ({
        lastAugReset: _player_1.Player.lastAugReset,
        lastNodeReset: _player_1.Player.lastNodeReset,
        currentNode: _player_1.Player.bitNodeN,
        ownedAugs: new Map(_player_1.Player.augmentations.map((aug) => [aug.name, aug.level])),
        ownedSF: new Map([..._player_1.Player.activeSourceFiles].filter(([__, activeLevel]) => {
            return activeLevel > 0;
        })),
        bitNodeOptions: {
            ..._player_1.Player.bitNodeOptions,
            sourceFileOverrides: new Map(_player_1.Player.bitNodeOptions.sourceFileOverrides),
        },
    }),
    getFunctionRamCost: (ctx) => (_name) => {
        const name = NetscriptHelpers_1.helpers.string(ctx, "name", _name);
        return (0, RamCostGenerator_1.getRamCost)(name.split("."), true);
    },
    tprintRaw: () => (value) => {
        Terminal_1.Terminal.printRaw((0, NetscriptHelpers_1.wrapUserNode)(value));
    },
    printRaw: (ctx) => (value) => {
        ctx.workerScript.print((0, NetscriptHelpers_1.wrapUserNode)(value));
    },
    dynamicImport: (ctx) => async (value) => {
        const path = NetscriptHelpers_1.helpers.scriptPath(ctx, "path", value);
        const server = NetscriptHelpers_1.helpers.getServer(ctx, ctx.workerScript.hostname);
        const script = server.getContentFile(path);
        if (!script)
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Script was not found\nPath: ${path}`);
        //We validated the path as ScriptFilePath and made sure script is not null
        //Script **must** be a script at this point
        return (0, NetscriptJSEvaluator_1.compile)(script, server.scripts);
    },
    flags: Flags_1.Flags,
    heart: { break: () => () => _player_1.Player.karma },
    ...(0, Extra_1.NetscriptExtra)(),
};
// Removed functions
(0, APIWrapper_1.setRemovedFunctions)(exports.ns, {
    getServerRam: { version: "2.2.0", replacement: "getServerMaxRam and getServerUsedRam" },
    nFormat: {
        version: "3.0.0",
        replacement: "ns.formatNumber, ns.formatRam, ns.formatPercent, or JS built-in objects/functions",
    },
    getTimeSinceLastAug: {
        version: "3.0.0",
        replacement: "Date.now() - ns.getResetInfo().lastAugReset",
    },
    formatNumber: {
        version: "3.0.0",
        replacement: "ns.format.number()",
    },
    formatRam: {
        version: "3.0.0",
        replacement: "ns.format.ram()",
    },
    formatPercent: {
        version: "3.0.0",
        replacement: "ns.format.percent()",
    },
    tFormat: {
        version: "3.0.0",
        replacement: "ns.format.time()",
    },
    tail: {
        version: "3.0.0",
        replacement: "ns.ui.openTail()",
    },
    moveTail: {
        version: "3.0.0",
        replacement: "ns.ui.moveTail()",
    },
    resizeTail: {
        version: "3.0.0",
        replacement: "ns.ui.resizeTail()",
    },
    closeTail: {
        version: "3.0.0",
        replacement: "ns.ui.closeTail()",
    },
    setTitle: {
        version: "3.0.0",
        replacement: "ns.ui.setTailTitle()",
    },
});
function NetscriptFunctions(ws) {
    return (0, APIWrapper_1.NSProxy)(ws, exports.ns, [], { args: ws.args.slice(), pid: ws.pid, enums: exports.enums });
}
const possibleLogs = Object.fromEntries(getFunctionNames(exports.ns, "").map((a) => [a, true]));
possibleLogs.ALL = true;
// We reuse this object for *all* scripts that disable all keys, to prevent memory growth.
// Any script that needs a custom set of values will use a fresh object.
const allDisabled = { ALL: true };
/** Provides an array of all function names on a nested object */
function getFunctionNames(obj, prefix) {
    const functionNames = [];
    for (const [key, value] of Object.entries(obj)) {
        if (key === "args") {
            continue;
        }
        else if (typeof value === "function") {
            functionNames.push(prefix + key);
        }
        else if (typeof value === "object") {
            functionNames.push(...getFunctionNames(value, `${prefix}${key}.`));
        }
    }
    return functionNames;
}
