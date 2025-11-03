"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Programs = void 0;
exports.getEffectiveHackingLevelRequirement = getEffectiveHackingLevelRequirement;
const Program_1 = require("./Program");
const Constants_1 = require("../Constants");
const Server_1 = require("../Server/Server");
const Terminal_1 = require("../Terminal");
const _player_1 = require("@player");
const StringHelperFunctions_1 = require("../utils/StringHelperFunctions");
const AllServers_1 = require("../Server/AllServers");
const formatNumber_1 = require("../ui/formatNumber");
const BitNodeMultipliers_1 = require("../BitNode/BitNodeMultipliers");
const BitFlumeModal_1 = require("../BitNode/ui/BitFlumeModal");
const Hacking_1 = require("../Hacking");
const _enums_1 = require("@enums");
const GameRoot_1 = require("../ui/GameRoot");
const Router_1 = require("../ui/Router");
const BitNodeUtils_1 = require("../BitNode/BitNodeUtils");
const clampNumber_1 = require("../utils/helpers/clampNumber");
function requireHackingLevel(lvl) {
    return function () {
        return _player_1.Player.skills.hacking >= getEffectiveHackingLevelRequirement(lvl);
    };
}
function getEffectiveHackingLevelRequirement(level) {
    return (0, clampNumber_1.clampNumber)(level - _player_1.Player.skills.intelligence / 2, 1);
}
function bitFlumeRequirements() {
    return function () {
        return (0, BitNodeUtils_1.knowAboutBitverse)() && _player_1.Player.skills.hacking >= 1;
    };
}
function warnIfNonArgProgramIsRunWithArgs(name, args) {
    if (args.length === 0) {
        return;
    }
    Terminal_1.Terminal.warn(`You are running ${name} with arguments, but ${name} does not accept arguments. These arguments will be ignored. ` +
        `${name} only affects the server ('${_player_1.Player.currentServer}') that you are connecting via the terminal. ` +
        "If you want to pass the target's hostname as an argument, you have to use the respective NS API.");
}
exports.Programs = {
    [_enums_1.CompletedProgramName.nuke]: new Program_1.Program({
        name: _enums_1.CompletedProgramName.nuke,
        create: {
            level: 1,
            tooltip: "This virus is used to gain root access to a machine if enough ports are opened.",
            req: requireHackingLevel(1),
            time: Constants_1.CONSTANTS.MillisecondsPerFiveMinutes,
        },
        run: (args, server) => {
            warnIfNonArgProgramIsRunWithArgs(_enums_1.CompletedProgramName.nuke, args);
            if (!(server instanceof Server_1.Server)) {
                Terminal_1.Terminal.error("Cannot nuke this kind of server.");
                return;
            }
            if (server.hasAdminRights) {
                Terminal_1.Terminal.print("You already have root access to this computer. There is no reason to run NUKE.exe");
                Terminal_1.Terminal.print("You can now run scripts on this server.");
                return;
            }
            if (server.openPortCount >= server.numOpenPortsRequired) {
                server.hasAdminRights = true;
                Terminal_1.Terminal.print("NUKE successful! Gained root access to " + server.hostname);
                Terminal_1.Terminal.print("You can now run scripts on this server.");
                return;
            }
            Terminal_1.Terminal.print("NUKE unsuccessful. Not enough ports have been opened");
        },
    }),
    [_enums_1.CompletedProgramName.bruteSsh]: new Program_1.Program({
        name: _enums_1.CompletedProgramName.bruteSsh,
        create: {
            level: 50,
            tooltip: "This program executes a brute force attack that opens SSH ports",
            req: requireHackingLevel(50),
            time: Constants_1.CONSTANTS.MillisecondsPerFiveMinutes * 2,
        },
        run: (args, server) => {
            warnIfNonArgProgramIsRunWithArgs(_enums_1.CompletedProgramName.bruteSsh, args);
            if (!(server instanceof Server_1.Server)) {
                Terminal_1.Terminal.error("Cannot run BruteSSH.exe on this kind of server.");
                return;
            }
            if (server.sshPortOpen) {
                Terminal_1.Terminal.print("SSH Port (22) is already open!");
                return;
            }
            server.sshPortOpen = true;
            Terminal_1.Terminal.print("Opened SSH Port(22)!");
            server.openPortCount++;
        },
    }),
    [_enums_1.CompletedProgramName.ftpCrack]: new Program_1.Program({
        name: _enums_1.CompletedProgramName.ftpCrack,
        create: {
            level: 100,
            tooltip: "This program cracks open FTP ports",
            req: requireHackingLevel(100),
            time: Constants_1.CONSTANTS.MillisecondsPerHalfHour,
        },
        run: (args, server) => {
            warnIfNonArgProgramIsRunWithArgs(_enums_1.CompletedProgramName.ftpCrack, args);
            if (!(server instanceof Server_1.Server)) {
                Terminal_1.Terminal.error("Cannot run FTPCrack.exe on this kind of server.");
                return;
            }
            if (server.ftpPortOpen) {
                Terminal_1.Terminal.print("FTP Port (21) is already open!");
                return;
            }
            server.ftpPortOpen = true;
            Terminal_1.Terminal.print("Opened FTP Port (21)!");
            server.openPortCount++;
        },
    }),
    [_enums_1.CompletedProgramName.relaySmtp]: new Program_1.Program({
        name: _enums_1.CompletedProgramName.relaySmtp,
        create: {
            level: 250,
            tooltip: "This program opens SMTP ports by redirecting data",
            req: requireHackingLevel(250),
            time: Constants_1.CONSTANTS.MillisecondsPer2Hours,
        },
        run: (args, server) => {
            warnIfNonArgProgramIsRunWithArgs(_enums_1.CompletedProgramName.relaySmtp, args);
            if (!(server instanceof Server_1.Server)) {
                Terminal_1.Terminal.error("Cannot run relaySMTP.exe on this kind of server.");
                return;
            }
            if (server.smtpPortOpen) {
                Terminal_1.Terminal.print("SMTP Port (25) is already open!");
                return;
            }
            server.smtpPortOpen = true;
            Terminal_1.Terminal.print("Opened SMTP Port (25)!");
            server.openPortCount++;
        },
    }),
    [_enums_1.CompletedProgramName.httpWorm]: new Program_1.Program({
        name: _enums_1.CompletedProgramName.httpWorm,
        create: {
            level: 500,
            tooltip: "This virus opens up HTTP ports",
            req: requireHackingLevel(500),
            time: Constants_1.CONSTANTS.MillisecondsPer4Hours,
        },
        run: (args, server) => {
            warnIfNonArgProgramIsRunWithArgs(_enums_1.CompletedProgramName.httpWorm, args);
            if (!(server instanceof Server_1.Server)) {
                Terminal_1.Terminal.error("Cannot run HTTPWorm.exe on this kind of server.");
                return;
            }
            if (server.httpPortOpen) {
                Terminal_1.Terminal.print("HTTP Port (80) is already open!");
                return;
            }
            server.httpPortOpen = true;
            Terminal_1.Terminal.print("Opened HTTP Port (80)!");
            server.openPortCount++;
        },
    }),
    [_enums_1.CompletedProgramName.sqlInject]: new Program_1.Program({
        name: _enums_1.CompletedProgramName.sqlInject,
        create: {
            level: 750,
            tooltip: "This virus opens SQL ports",
            req: requireHackingLevel(750),
            time: Constants_1.CONSTANTS.MillisecondsPer8Hours,
        },
        run: (args, server) => {
            warnIfNonArgProgramIsRunWithArgs(_enums_1.CompletedProgramName.sqlInject, args);
            if (!(server instanceof Server_1.Server)) {
                Terminal_1.Terminal.error("Cannot run SQLInject.exe on this kind of server.");
                return;
            }
            if (server.sqlPortOpen) {
                Terminal_1.Terminal.print("SQL Port (1433) is already open!");
                return;
            }
            server.sqlPortOpen = true;
            Terminal_1.Terminal.print("Opened SQL Port (1433)!");
            server.openPortCount++;
        },
    }),
    [_enums_1.CompletedProgramName.deepScan1]: new Program_1.Program({
        name: _enums_1.CompletedProgramName.deepScan1,
        create: {
            level: 75,
            tooltip: "This program allows you to use the scan-analyze command with a depth up to 5",
            req: requireHackingLevel(75),
            time: Constants_1.CONSTANTS.MillisecondsPerQuarterHour,
        },
        run: () => {
            Terminal_1.Terminal.print("This executable cannot be run.");
            Terminal_1.Terminal.print("DeepscanV1.exe lets you run 'scan-analyze' with a depth up to 5.");
        },
    }),
    [_enums_1.CompletedProgramName.deepScan2]: new Program_1.Program({
        name: _enums_1.CompletedProgramName.deepScan2,
        create: {
            level: 400,
            tooltip: "This program allows you to use the scan-analyze command with a depth up to 10",
            req: requireHackingLevel(400),
            time: Constants_1.CONSTANTS.MillisecondsPer2Hours,
        },
        run: () => {
            Terminal_1.Terminal.print("This executable cannot be run.");
            Terminal_1.Terminal.print("DeepscanV2.exe lets you run 'scan-analyze' with a depth up to 10.");
        },
    }),
    [_enums_1.CompletedProgramName.serverProfiler]: new Program_1.Program({
        name: _enums_1.CompletedProgramName.serverProfiler,
        create: {
            level: 75,
            tooltip: "This program is used to display hacking and Netscript-related information about servers",
            req: requireHackingLevel(75),
            time: Constants_1.CONSTANTS.MillisecondsPerHalfHour,
        },
        run: (args) => {
            if (args.length !== 1) {
                Terminal_1.Terminal.error("Must pass a server hostname or IP as an argument for ServerProfiler.exe");
                return;
            }
            const targetServer = (0, AllServers_1.GetServer)(args[0]);
            if (targetServer == null) {
                Terminal_1.Terminal.error("Invalid server IP/hostname");
                return;
            }
            if (!(targetServer instanceof Server_1.Server)) {
                Terminal_1.Terminal.error(`ServerProfiler.exe can only be run on normal servers.`);
                return;
            }
            Terminal_1.Terminal.print(targetServer.hostname + ":");
            Terminal_1.Terminal.print("Server base security level: " + targetServer.baseDifficulty);
            Terminal_1.Terminal.print("Server current security level: " + targetServer.hackDifficulty);
            Terminal_1.Terminal.print("Server growth rate: " + targetServer.serverGrowth);
            Terminal_1.Terminal.print(`Netscript hack() execution time: ${(0, StringHelperFunctions_1.convertTimeMsToTimeElapsedString)((0, Hacking_1.calculateHackingTime)(targetServer, _player_1.Player) * 1000, true)}`);
            Terminal_1.Terminal.print(`Netscript grow() execution time: ${(0, StringHelperFunctions_1.convertTimeMsToTimeElapsedString)((0, Hacking_1.calculateGrowTime)(targetServer, _player_1.Player) * 1000, true)}`);
            Terminal_1.Terminal.print(`Netscript weaken() execution time: ${(0, StringHelperFunctions_1.convertTimeMsToTimeElapsedString)((0, Hacking_1.calculateWeakenTime)(targetServer, _player_1.Player) * 1000, true)}`);
        },
    }),
    [_enums_1.CompletedProgramName.autoLink]: new Program_1.Program({
        name: _enums_1.CompletedProgramName.autoLink,
        create: {
            level: 25,
            tooltip: "This program allows you to directly connect to other servers through the 'scan-analyze' command",
            req: requireHackingLevel(25),
            time: Constants_1.CONSTANTS.MillisecondsPerQuarterHour,
        },
        run: () => {
            Terminal_1.Terminal.print("This executable cannot be run.");
            Terminal_1.Terminal.print("AutoLink.exe lets you automatically connect to other servers when using 'scan-analyze'.");
            Terminal_1.Terminal.print("When using scan-analyze, click on a server's hostname to connect to it.");
        },
    }),
    [_enums_1.CompletedProgramName.formulas]: new Program_1.Program({
        name: _enums_1.CompletedProgramName.formulas,
        create: {
            level: 1000,
            tooltip: "This program allows you to use the formulas API",
            req: requireHackingLevel(1000),
            time: Constants_1.CONSTANTS.MillisecondsPer4Hours,
        },
        run: () => {
            Terminal_1.Terminal.print("This executable cannot be run.");
            Terminal_1.Terminal.print("Formulas.exe lets you use the formulas API.");
        },
    }),
    [_enums_1.CompletedProgramName.bitFlume]: new Program_1.Program({
        name: _enums_1.CompletedProgramName.bitFlume,
        create: {
            level: 1,
            tooltip: "This program creates a portal to the BitNode Nexus (allows you to restart and switch BitNodes)",
            req: bitFlumeRequirements(),
            time: Constants_1.CONSTANTS.MillisecondsPerFiveMinutes / 20,
        },
        run: (args) => {
            if (args.length == 1) {
                if (args[0] == "-q") {
                    GameRoot_1.Router.toPage(Router_1.Page.BitVerse, { flume: true, quick: true });
                }
            }
            else {
                BitFlumeModal_1.BitFlumeEvent.emit();
            }
        },
    }),
    [_enums_1.CompletedProgramName.flight]: new Program_1.Program({
        name: _enums_1.CompletedProgramName.flight,
        create: null,
        run: () => {
            const numAugReq = BitNodeMultipliers_1.currentNodeMults.DaedalusAugsRequirement;
            const fulfilled = _player_1.Player.augmentations.length >= numAugReq && _player_1.Player.money >= 1e11 && _player_1.Player.skills.hacking >= 2500;
            if (!fulfilled) {
                if (_player_1.Player.augmentations.length >= numAugReq) {
                    Terminal_1.Terminal.print(`[x] Augmentations: ${_player_1.Player.augmentations.length} / ${numAugReq}`);
                }
                else {
                    Terminal_1.Terminal.print(`[ ] Augmentations: ${_player_1.Player.augmentations.length} / ${numAugReq}`);
                }
                if (_player_1.Player.money >= 1e11) {
                    Terminal_1.Terminal.print(`[x] Money: ${(0, formatNumber_1.formatMoney)(_player_1.Player.money)} / ${(0, formatNumber_1.formatMoney)(1e11)}`);
                }
                else {
                    Terminal_1.Terminal.print(`[ ] Money: ${(0, formatNumber_1.formatMoney)(_player_1.Player.money)} / ${(0, formatNumber_1.formatMoney)(1e11)}`);
                }
                if (_player_1.Player.skills.hacking >= 2500) {
                    Terminal_1.Terminal.print(`[x] Hacking skill: ${_player_1.Player.skills.hacking} / 2500`);
                }
                else {
                    Terminal_1.Terminal.print(`[ ] Hacking skill: ${_player_1.Player.skills.hacking} / 2500`);
                }
                return;
            }
            Terminal_1.Terminal.print("We will contact you.");
            Terminal_1.Terminal.print(`-- ${_enums_1.FactionName.Daedalus} --`);
        },
    }),
};
