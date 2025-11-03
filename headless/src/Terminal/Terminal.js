"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Terminal = exports.TerminalCommands = void 0;
const OutputTypes_1 = require("./OutputTypes");
const GameRoot_1 = require("../ui/GameRoot");
const Router_1 = require("../ui/Router");
const _player_1 = require("@player");
const HacknetServer_1 = require("../Hacknet/HacknetServer");
const Server_1 = require("../Server/Server");
const _enums_1 = require("@enums");
const Contract_1 = require("../CodingContract/Contract");
const TerminalEvents_1 = require("./TerminalEvents");
const ScriptFilePath_1 = require("../Paths/ScriptFilePath");
const Constants_1 = require("../Constants");
const AllServers_1 = require("../Server/AllServers");
const DarkWeb_1 = require("../DarkWeb/DarkWeb");
const InteractiveTutorial_1 = require("../InteractiveTutorial");
const ServerHelpers_1 = require("../Server/ServerHelpers");
const Parser_1 = require("./Parser");
const SpecialServers_1 = require("../Server/data/SpecialServers");
const Settings_1 = require("../Settings/Settings");
const createProgressBarText_1 = require("../utils/helpers/createProgressBarText");
const Hacking_1 = require("../Hacking");
const formatNumber_1 = require("../ui/formatNumber");
const StringHelperFunctions_1 = require("../utils/StringHelperFunctions");
// TODO: Does every terminal function really need its own file...?
const alias_1 = require("./commands/alias");
const analyze_1 = require("./commands/analyze");
const backdoor_1 = require("./commands/backdoor");
const buy_1 = require("./commands/buy");
const cat_1 = require("./commands/cat");
const cd_1 = require("./commands/cd");
const check_1 = require("./commands/check");
const connect_1 = require("./commands/connect");
const cp_1 = require("./commands/cp");
const download_1 = require("./commands/download");
const expr_1 = require("./commands/expr");
const free_1 = require("./commands/free");
const grep_1 = require("./commands/grep");
const grow_1 = require("./commands/grow");
const hack_1 = require("./commands/hack");
const help_1 = require("./commands/help");
const history_1 = require("./commands/history");
const home_1 = require("./commands/home");
const hostname_1 = require("./commands/hostname");
const ipaddr_1 = require("./commands/ipaddr");
const kill_1 = require("./commands/kill");
const killall_1 = require("./commands/killall");
const ls_1 = require("./commands/ls");
const lscpu_1 = require("./commands/lscpu");
const mem_1 = require("./commands/mem");
const mv_1 = require("./commands/mv");
const nano_1 = require("./commands/nano");
const ps_1 = require("./commands/ps");
const rm_1 = require("./commands/rm");
const run_1 = require("./commands/run");
const scan_1 = require("./commands/scan");
const scananalyze_1 = require("./commands/scananalyze");
const scp_1 = require("./commands/scp");
const sudov_1 = require("./commands/sudov");
const tail_1 = require("./commands/tail");
const top_1 = require("./commands/top");
const unalias_1 = require("./commands/unalias");
const vim_1 = require("./commands/vim");
const weaken_1 = require("./commands/weaken");
const wget_1 = require("./commands/wget");
const commitHash_1 = require("../utils/helpers/commitHash");
const apr1_1 = require("./commands/apr1");
const changelog_1 = require("./commands/changelog");
const clear_1 = require("./commands/clear");
const BitNodeMultipliers_1 = require("../BitNode/BitNodeMultipliers");
const engine_1 = require("../engine");
const Directory_1 = require("../Paths/Directory");
const FilePath_1 = require("../Paths/FilePath");
const TextFilePath_1 = require("../Paths/TextFilePath");
const Constants_2 = require("../Server/data/Constants");
const strings_1 = require("../Types/strings");
exports.TerminalCommands = {
    "scan-analyze": scananalyze_1.scananalyze,
    alias: alias_1.alias,
    analyze: analyze_1.analyze,
    backdoor: backdoor_1.backdoor,
    buy: buy_1.buy,
    cat: cat_1.cat,
    cd: cd_1.cd,
    changelog: changelog_1.changelog,
    check: check_1.check,
    clear: clear_1.clear,
    cls: clear_1.clear,
    connect: connect_1.connect,
    cp: cp_1.cp,
    download: download_1.download,
    expr: expr_1.expr,
    free: free_1.free,
    grep: grep_1.grep,
    grow: grow_1.grow,
    hack: hack_1.hack,
    help: help_1.help,
    history: history_1.history,
    home: home_1.home,
    hostname: hostname_1.hostname,
    ipaddr: ipaddr_1.ipaddr,
    kill: kill_1.kill,
    killall: killall_1.killall,
    ls: ls_1.ls,
    lscpu: lscpu_1.lscpu,
    mem: mem_1.mem,
    mv: mv_1.mv,
    nano: nano_1.nano,
    ps: ps_1.ps,
    rm: rm_1.rm,
    run: run_1.run,
    scan: scan_1.scan,
    scp: scp_1.scp,
    sudov: sudov_1.sudov,
    tail: tail_1.tail,
    apr1: apr1_1.apr1,
    top: top_1.top,
    unalias: unalias_1.unalias,
    vim: vim_1.vim,
    weaken: weaken_1.weaken,
    wget: wget_1.wget,
};
class Terminal {
    constructor() {
        // Flags to determine whether the player is currently running a hack or an analyze
        this.action = null;
        this.commandHistory = [];
        this.commandHistoryIndex = 0;
        this.outputHistory = [
            new OutputTypes_1.Output(`Bitburner v${Constants_1.CONSTANTS.VersionString} (${(0, commitHash_1.commitHash)()})`, "primary"),
        ];
        // True if a Coding Contract prompt is opened
        this.contractOpen = false;
        // Path of current directory
        this.currDir = "";
    }
    process(cycles) {
        if (this.action === null)
            return;
        this.action.timeLeft -= (Constants_1.CONSTANTS.MilliPerCycle * cycles) / 1000;
        if (this.action.timeLeft < 0.01)
            this.finishAction(false);
    }
    append(item) {
        this.outputHistory.push(item);
        if (this.outputHistory.length > Settings_1.Settings.MaxTerminalCapacity) {
            this.outputHistory.splice(0, this.outputHistory.length - Settings_1.Settings.MaxTerminalCapacity);
        }
        TerminalEvents_1.TerminalEvents.emit();
    }
    print(s) {
        this.append(new OutputTypes_1.Output(s, "primary"));
    }
    printRaw(node) {
        this.append(new OutputTypes_1.RawOutput(node));
    }
    error(s) {
        this.append(new OutputTypes_1.Output(s, "error"));
    }
    success(s) {
        this.append(new OutputTypes_1.Output(s, "success"));
    }
    info(s) {
        this.append(new OutputTypes_1.Output(s, "info"));
    }
    warn(s) {
        this.append(new OutputTypes_1.Output(s, "warn"));
    }
    startHack() {
        // Hacking through Terminal should be faster than hacking through a script
        const server = _player_1.Player.getCurrentServer();
        if (server instanceof HacknetServer_1.HacknetServer) {
            this.error("Cannot hack this kind of server");
            return;
        }
        if (!(server instanceof Server_1.Server))
            throw new Error("server should be normal server");
        this.startAction((0, Hacking_1.calculateHackingTime)(server, _player_1.Player) / 4, "h", server);
    }
    startGrow() {
        const server = _player_1.Player.getCurrentServer();
        if (server instanceof HacknetServer_1.HacknetServer) {
            this.error("Cannot grow this kind of server");
            return;
        }
        if (!(server instanceof Server_1.Server))
            throw new Error("server should be normal server");
        this.startAction((0, Hacking_1.calculateGrowTime)(server, _player_1.Player) / 16, "g", server);
    }
    startWeaken() {
        const server = _player_1.Player.getCurrentServer();
        if (server instanceof HacknetServer_1.HacknetServer) {
            this.error("Cannot weaken this kind of server");
            return;
        }
        if (!(server instanceof Server_1.Server))
            throw new Error("server should be normal server");
        this.startAction((0, Hacking_1.calculateWeakenTime)(server, _player_1.Player) / 16, "w", server);
    }
    startBackdoor() {
        // Backdoor should take the same amount of time as hack
        const server = _player_1.Player.getCurrentServer();
        if (server instanceof HacknetServer_1.HacknetServer) {
            this.error("Cannot backdoor this kind of server");
            return;
        }
        if (!(server instanceof Server_1.Server))
            throw new Error("server should be normal server");
        this.startAction((0, Hacking_1.calculateHackingTime)(server, _player_1.Player) / 4, "b", server);
    }
    startAnalyze() {
        this.print("Analyzing system...");
        const server = _player_1.Player.getCurrentServer();
        this.startAction(1, "a", server);
    }
    startAction(n, action, server) {
        this.action = new OutputTypes_1.TTimer(n, action, server);
    }
    // Complete the hack/analyze command
    finishHack(server, cancelled = false) {
        if (cancelled)
            return;
        if (server instanceof HacknetServer_1.HacknetServer) {
            this.error("Cannot hack this kind of server");
            return;
        }
        if (!(server instanceof Server_1.Server))
            throw new Error("server should be normal server");
        // Calculate whether hack was successful
        const hackChance = (0, Hacking_1.calculateHackingChance)(server, _player_1.Player);
        const rand = Math.random();
        let expGainedOnSuccess = (0, Hacking_1.calculateHackingExpGain)(server, _player_1.Player);
        const expGainedOnFailure = expGainedOnSuccess / 4;
        if (rand < hackChance) {
            // Success!
            server.backdoorInstalled = true;
            if (SpecialServers_1.SpecialServers.WorldDaemon === server.hostname) {
                GameRoot_1.Router.toPage(Router_1.Page.BitVerse, { flume: false, quick: false });
                return;
            }
            // Manually check for faction invitations
            engine_1.Engine.Counters.checkFactionInvitations = 0;
            engine_1.Engine.checkCounters();
            let moneyDrained = server.moneyAvailable * (0, Hacking_1.calculatePercentMoneyHacked)(server, _player_1.Player);
            // Over-the-top safety checks
            if (moneyDrained < 0) {
                moneyDrained = 0;
            }
            if (moneyDrained > server.moneyAvailable) {
                moneyDrained = server.moneyAvailable;
            }
            if (moneyDrained === 0) {
                expGainedOnSuccess = expGainedOnFailure;
            }
            server.moneyAvailable -= moneyDrained;
            if (server.moneyAvailable < 0) {
                server.moneyAvailable = 0;
            }
            const moneyGained = moneyDrained * BitNodeMultipliers_1.currentNodeMults.ManualHackMoney;
            _player_1.Player.gainMoney(moneyGained, "hacking");
            _player_1.Player.gainHackingExp(expGainedOnSuccess);
            if (expGainedOnSuccess > 1) {
                _player_1.Player.gainIntelligenceExp(4 * Math.log10(expGainedOnSuccess));
            }
            const oldSec = server.hackDifficulty;
            server.fortify(Constants_2.ServerConstants.ServerFortifyAmount);
            const newSec = server.hackDifficulty;
            this.print(`Hack successful on '${server.hostname}'! Gained ${(0, formatNumber_1.formatMoney)(moneyGained, true)} and ${(0, formatNumber_1.formatExp)(expGainedOnSuccess)} hacking exp`);
            this.print(`Security increased on '${server.hostname}' from ${(0, formatNumber_1.formatSecurity)(oldSec)} to ${(0, formatNumber_1.formatSecurity)(newSec)}`);
        }
        else {
            // Failure
            _player_1.Player.gainHackingExp(expGainedOnFailure);
            this.print(`Failed to hack '${server.hostname}'. Gained ${(0, formatNumber_1.formatExp)(expGainedOnFailure)} hacking exp`);
        }
    }
    finishGrow(server, cancelled = false) {
        if (cancelled)
            return;
        if (server instanceof HacknetServer_1.HacknetServer) {
            this.error("Cannot grow this kind of server");
            return;
        }
        if (!(server instanceof Server_1.Server))
            throw new Error("server should be normal server");
        const expGain = (0, Hacking_1.calculateHackingExpGain)(server, _player_1.Player);
        const oldSec = server.hackDifficulty;
        const growth = (0, ServerHelpers_1.processSingleServerGrowth)(server, 25, server.cpuCores);
        const newSec = server.hackDifficulty;
        _player_1.Player.gainHackingExp(expGain);
        this.print(`Available money on '${server.hostname}' grown by ${(0, formatNumber_1.formatPercent)(growth - 1, 6)}. Gained ${(0, formatNumber_1.formatExp)(expGain)} hacking exp.`);
        this.print(`Security increased on '${server.hostname}' from ${(0, formatNumber_1.formatSecurity)(oldSec)} to ${(0, formatNumber_1.formatSecurity)(newSec)}`);
    }
    finishWeaken(server, cancelled = false) {
        if (cancelled)
            return;
        if (server instanceof HacknetServer_1.HacknetServer) {
            this.error("Cannot weaken this kind of server");
            return;
        }
        if (!(server instanceof Server_1.Server))
            throw new Error("server should be normal server");
        const expGain = (0, Hacking_1.calculateHackingExpGain)(server, _player_1.Player);
        const oldSec = server.hackDifficulty;
        const weakenAmt = (0, ServerHelpers_1.getWeakenEffect)(1, server.cpuCores);
        server.weaken(weakenAmt);
        const newSec = server.hackDifficulty;
        _player_1.Player.gainHackingExp(expGain);
        this.print(`Security decreased on '${server.hostname}' by ${(0, formatNumber_1.formatSecurity)(weakenAmt)} from ${(0, formatNumber_1.formatSecurity)(oldSec)} to ${(0, formatNumber_1.formatSecurity)(newSec)} (min: ${(0, formatNumber_1.formatSecurity)(server.minDifficulty)})` +
            ` and Gained ${(0, formatNumber_1.formatExp)(expGain)} hacking exp.`);
    }
    finishBackdoor(server, cancelled = false) {
        if (!cancelled) {
            if (server instanceof HacknetServer_1.HacknetServer) {
                this.error("Cannot hack this kind of server");
                return;
            }
            if (!(server instanceof Server_1.Server))
                throw new Error("server should be normal server");
            server.backdoorInstalled = true;
            if (SpecialServers_1.SpecialServers.WorldDaemon === server.hostname) {
                if (_player_1.Player.bitNodeN == null) {
                    _player_1.Player.bitNodeN = 1;
                }
                GameRoot_1.Router.toPage(Router_1.Page.BitVerse, { flume: false, quick: false });
                return;
            }
            // Manunally check for faction invites
            engine_1.Engine.Counters.checkFactionInvitations = 0;
            engine_1.Engine.checkCounters();
            this.print(`Backdoor on '${server.hostname}' successful!`);
        }
    }
    finishAnalyze(currServ, cancelled = false) {
        if (!cancelled) {
            const isHacknet = currServ instanceof HacknetServer_1.HacknetServer;
            this.print(currServ.hostname + ": ");
            const org = currServ.organizationName;
            this.print("Organization name: " + (!isHacknet ? org : "player"));
            const hasAdminRights = (!isHacknet && currServ.hasAdminRights) || isHacknet;
            this.print("Root Access: " + (hasAdminRights ? "YES" : "NO"));
            const canRunScripts = hasAdminRights && currServ.maxRam > 0;
            this.print("Can run scripts on this host: " + (canRunScripts ? "YES" : "NO"));
            this.print("RAM: " + (0, formatNumber_1.formatRam)(currServ.maxRam));
            if (currServ instanceof Server_1.Server) {
                this.print("Backdoor: " + (currServ.backdoorInstalled ? "YES" : "NO"));
                const hackingSkill = currServ.requiredHackingSkill;
                this.print("Required hacking skill for hack() and backdoor: " + (!isHacknet ? hackingSkill : "N/A"));
                const security = currServ.hackDifficulty;
                this.print("Server security level: " + (!isHacknet ? (0, formatNumber_1.formatSecurity)(security) : "N/A"));
                const hackingChance = (0, Hacking_1.calculateHackingChance)(currServ, _player_1.Player);
                this.print("Chance to hack: " + (!isHacknet ? (0, formatNumber_1.formatPercent)(hackingChance) : "N/A"));
                const hackingTime = (0, Hacking_1.calculateHackingTime)(currServ, _player_1.Player) * 1000;
                this.print("Time to hack: " + (!isHacknet ? (0, StringHelperFunctions_1.convertTimeMsToTimeElapsedString)(hackingTime, true) : "N/A"));
            }
            this.print(`Total money available on server: ${currServ instanceof Server_1.Server ? (0, formatNumber_1.formatMoney)(currServ.moneyAvailable, true) : "N/A"}`);
            if (currServ instanceof Server_1.Server) {
                const numPort = currServ.numOpenPortsRequired;
                this.print("Required number of open ports for NUKE: " + (!isHacknet ? numPort : "N/A"));
                this.print("SSH port: " + (currServ.sshPortOpen ? "Open" : "Closed"));
                this.print("FTP port: " + (currServ.ftpPortOpen ? "Open" : "Closed"));
                this.print("SMTP port: " + (currServ.smtpPortOpen ? "Open" : "Closed"));
                this.print("HTTP port: " + (currServ.httpPortOpen ? "Open" : "Closed"));
                this.print("SQL port: " + (currServ.sqlPortOpen ? "Open" : "Closed"));
            }
        }
    }
    finishAction(cancelled = false) {
        if (this.action === null) {
            if (!cancelled)
                throw new Error("Finish action called when there was no action");
            return;
        }
        if (!this.action.server)
            throw new Error("Missing action target server");
        this.print(this.getProgressText());
        if (this.action.action === "h") {
            this.finishHack(this.action.server, cancelled);
        }
        else if (this.action.action === "g") {
            this.finishGrow(this.action.server, cancelled);
        }
        else if (this.action.action === "w") {
            this.finishWeaken(this.action.server, cancelled);
        }
        else if (this.action.action === "b") {
            this.finishBackdoor(this.action.server, cancelled);
        }
        else if (this.action.action === "a") {
            this.finishAnalyze(this.action.server, cancelled);
        }
        if (cancelled) {
            this.print("Cancelled");
        }
        this.action = null;
        TerminalEvents_1.TerminalEvents.emit();
    }
    getFile(filename) {
        if ((0, ScriptFilePath_1.hasScriptExtension)(filename))
            return this.getScript(filename);
        if ((0, TextFilePath_1.hasTextExtension)(filename))
            return this.getTextFile(filename);
        if (filename.endsWith(".lit"))
            return this.getLitFile(filename);
        return null;
    }
    getFilepath(path, useAbsolute) {
        // If path starts with a slash, consider it to be an absolute path
        if (useAbsolute || path.startsWith("/"))
            return (0, FilePath_1.resolveFilePath)(path);
        // Otherwise, force path to be seen as relative to the current directory.
        path = "./" + path;
        return (0, FilePath_1.resolveFilePath)(path, this.currDir);
    }
    getDirectory(path, useAbsolute) {
        // If path starts with a slash, consider it to be an absolute path
        if (useAbsolute || path.startsWith("/"))
            return (0, Directory_1.resolveDirectory)(path);
        // Otherwise, force path to be seen as relative to the current directory.
        path = "./" + path;
        return (0, Directory_1.resolveDirectory)(path, this.currDir);
    }
    getScript(filename) {
        const server = _player_1.Player.getCurrentServer();
        const filepath = this.getFilepath(filename);
        if (!filepath || !(0, ScriptFilePath_1.hasScriptExtension)(filepath))
            return null;
        return server.scripts.get(filepath) ?? null;
    }
    getTextFile(filename) {
        const server = _player_1.Player.getCurrentServer();
        const filepath = this.getFilepath(filename);
        if (!filepath || !(0, TextFilePath_1.hasTextExtension)(filepath))
            return null;
        return server.textFiles.get(filepath) ?? null;
    }
    getLitFile(filename) {
        const s = _player_1.Player.getCurrentServer();
        const filepath = this.getFilepath(filename);
        if (!filepath)
            return null;
        for (const lit of s.messages) {
            if (typeof lit === "string" && filepath === lit) {
                return lit;
            }
        }
        return null;
    }
    cwd() {
        return this.currDir;
    }
    setcwd(dir) {
        this.currDir = dir;
        TerminalEvents_1.TerminalEvents.emit();
    }
    async runContract(contractPath) {
        // There's already an opened contract
        if (this.contractOpen) {
            return this.error("There's already a Coding Contract in Progress");
        }
        const server = _player_1.Player.getCurrentServer();
        const contract = server.getContract(contractPath);
        if (!contract) {
            return this.error("No such contract");
        }
        this.contractOpen = true;
        const promptResult = await contract.prompt();
        // Get a new copy of the server, in case it changed while the prompt was open
        const postPromptServer = (0, AllServers_1.GetServer)(server.hostname);
        // Check if the contract still exists by the time the promise is fulfilled
        if (postPromptServer?.getContract(contractPath) == null) {
            this.contractOpen = false;
            return this.error("Contract no longer exists (Was it solved by a script?)");
        }
        switch (promptResult.result) {
            case Contract_1.CodingContractResult.Success:
                if (contract.reward !== null) {
                    const reward = _player_1.Player.gainCodingContractReward(contract.reward, contract.getDifficulty());
                    this.print(`Contract SUCCESS - ${reward}`);
                }
                server.removeContract(contract);
                break;
            case Contract_1.CodingContractResult.InvalidFormat:
                this.error(`Contract FAILED - ${promptResult.message ?? `The answer is not in the right format for contract '${contract.type}'`}`);
                break;
            case Contract_1.CodingContractResult.Failure:
                ++contract.tries;
                if (contract.tries >= contract.getMaxNumTries()) {
                    this.error("Contract FAILED - Contract is now self-destructing");
                    server.removeContract(contract);
                }
                else {
                    this.error(`Contract FAILED - ${contract.getMaxNumTries() - contract.tries} tries remaining`);
                }
                break;
            case Contract_1.CodingContractResult.Cancelled:
                this.print("Contract cancelled");
                break;
            default: {
                const __ = promptResult.result;
            }
        }
        this.contractOpen = false;
    }
    executeScanAnalyzeCommand(depth = 1, all = false) {
        const ignoreServer = (s, d) => (!all && s.purchasedByPlayer && s.hostname != "home") || d > depth || (!all && s instanceof HacknetServer_1.HacknetServer);
        const makeNode = (parent, s, d = 1) => ({
            hostname: s.hostname,
            children: s.serversOnNetwork
                .filter((h) => h != parent)
                .map((s) => (0, AllServers_1.GetServer)(s))
                .filter((v) => !!v)
                .filter((v) => !ignoreServer(v, d))
                .map((h) => makeNode(s.hostname, h, d + 1)),
        });
        const root = makeNode(_player_1.Player.getCurrentServer().hostname, _player_1.Player.getCurrentServer());
        const printOutput = (node, prefix = ["  "], last = true) => {
            const titlePrefix = prefix.slice(0, prefix.length - 1).join("") + (last ? "┗ " : "┣ ");
            const infoPrefix = prefix.join("") + (node.children.length > 0 ? "┃   " : "    ");
            if (_player_1.Player.hasProgram(_enums_1.CompletedProgramName.autoLink)) {
                this.append(new OutputTypes_1.Link(titlePrefix, node.hostname));
            }
            else {
                this.print(titlePrefix + node.hostname + "\n");
            }
            const server = (0, AllServers_1.GetServer)(node.hostname);
            if (!server)
                return;
            if (server instanceof Server_1.Server) {
                const hasRoot = server.hasAdminRights ? "YES" : "NO";
                this.print(`${infoPrefix}Root Access: ${hasRoot}, Required hacking skill: ${server.requiredHackingSkill}` + "\n");
                this.print(`${infoPrefix}Number of open ports required to NUKE: ${server.numOpenPortsRequired}` + "\n");
            }
            this.print(`${infoPrefix}RAM: ${(0, formatNumber_1.formatRam)(server.maxRam)}` + "\n");
            node.children.forEach((n, i) => printOutput(n, [...prefix, i === node.children.length - 1 ? "  " : "┃ "], i === node.children.length - 1));
        };
        printOutput(root);
    }
    connectToServer(hostname, singularity = false) {
        const server = (0, AllServers_1.GetServer)(hostname);
        if (server === null) {
            this.error("Invalid server. Connection failed.");
            return;
        }
        _player_1.Player.getCurrentServer().isConnectedTo = false;
        _player_1.Player.currentServer = server.hostname;
        server.isConnectedTo = true;
        this.setcwd(Directory_1.root);
        if (!singularity) {
            this.print("Connected to " + `${(0, strings_1.isIPAddress)(hostname) ? server.ip : server.hostname}`);
            if (_player_1.Player.getCurrentServer().hostname === "darkweb") {
                (0, DarkWeb_1.checkIfConnectedToDarkweb)(); // Posts a 'help' message if connecting to dark web
            }
        }
    }
    executeCommands(commands) {
        // Handle Terminal History - multiple commands should be saved as one
        if (this.commandHistory[this.commandHistory.length - 1] != commands) {
            this.commandHistory.push(commands);
            if (this.commandHistory.length > 50) {
                this.commandHistory.splice(0, 1);
            }
            _player_1.Player.terminalCommandHistory = this.commandHistory;
        }
        this.commandHistoryIndex = this.commandHistory.length;
        const allCommands = (0, Parser_1.parseCommands)(commands);
        for (const command of allCommands)
            this.executeCommand(command);
    }
    clear() {
        this.outputHistory = [new OutputTypes_1.Output(`Bitburner v${Constants_1.CONSTANTS.VersionString} (${(0, commitHash_1.commitHash)()})`, "primary")];
        TerminalEvents_1.TerminalEvents.emit();
        TerminalEvents_1.TerminalClearEvents.emit();
    }
    prestige() {
        this.action = null;
        this.clear();
    }
    executeCommand(command) {
        if (this.action !== null)
            return this.error(`Cannot execute command (${command}) while an action is in progress`);
        const commandArray = (0, Parser_1.parseCommand)(command);
        if (!commandArray.length)
            return;
        const currentServer = _player_1.Player.getCurrentServer();
        /****************** Interactive Tutorial Terminal Commands ******************/
        if (InteractiveTutorial_1.ITutorial.isRunning) {
            const n00dlesServ = (0, AllServers_1.GetServer)("n00dles");
            if (n00dlesServ == null) {
                throw new Error("Could not get n00dles server");
            }
            const errorMessageForBadCommand = "Bad command. Please follow the tutorial or click 'Exit Tutorial' if you'd like to skip it.";
            switch (InteractiveTutorial_1.ITutorial.currStep) {
                case InteractiveTutorial_1.iTutorialSteps.TerminalHelp:
                    if (commandArray.length === 1 && commandArray[0] === "help") {
                        (0, InteractiveTutorial_1.iTutorialNextStep)();
                    }
                    else {
                        this.error(errorMessageForBadCommand);
                        return;
                    }
                    break;
                case InteractiveTutorial_1.iTutorialSteps.TerminalLs:
                    if (commandArray.length === 1 && commandArray[0] === "ls") {
                        (0, InteractiveTutorial_1.iTutorialNextStep)();
                    }
                    else if (commandArray[0] === "1s") {
                        this.error("Command '1s' not found. Did you mean 'ls' with a lowercase L?");
                        return;
                    }
                    else {
                        this.error(errorMessageForBadCommand);
                        return;
                    }
                    break;
                case InteractiveTutorial_1.iTutorialSteps.TerminalScan:
                    if (commandArray.length === 1 && commandArray[0] === "scan") {
                        (0, InteractiveTutorial_1.iTutorialNextStep)();
                    }
                    else {
                        this.error(errorMessageForBadCommand);
                        return;
                    }
                    break;
                case InteractiveTutorial_1.iTutorialSteps.TerminalScanAnalyze1:
                    if (commandArray.length === 1 && commandArray[0] === "scan-analyze") {
                        (0, InteractiveTutorial_1.iTutorialNextStep)();
                    }
                    else {
                        this.error(errorMessageForBadCommand);
                        return;
                    }
                    break;
                case InteractiveTutorial_1.iTutorialSteps.TerminalScanAnalyze2:
                    if (commandArray.length === 2 && commandArray[0] === "scan-analyze" && commandArray[1] === 2) {
                        (0, InteractiveTutorial_1.iTutorialNextStep)();
                    }
                    else {
                        this.error(errorMessageForBadCommand);
                        return;
                    }
                    break;
                case InteractiveTutorial_1.iTutorialSteps.TerminalConnect:
                    if (commandArray.length === 2) {
                        if (commandArray[0] === "connect" &&
                            (commandArray[1] === "n00dles" || commandArray[1] === n00dlesServ.hostname)) {
                            (0, InteractiveTutorial_1.iTutorialNextStep)();
                        }
                        else {
                            this.error("Wrong command! Try again!");
                            return;
                        }
                    }
                    else {
                        this.error(errorMessageForBadCommand);
                        return;
                    }
                    break;
                case InteractiveTutorial_1.iTutorialSteps.TerminalAnalyze:
                    if (commandArray.length === 1 && commandArray[0] === "analyze") {
                        (0, InteractiveTutorial_1.iTutorialNextStep)();
                    }
                    else {
                        this.error(errorMessageForBadCommand);
                        return;
                    }
                    break;
                case InteractiveTutorial_1.iTutorialSteps.TerminalNuke:
                    if (commandArray.length === 2 && commandArray[0] === "run" && commandArray[1] === "NUKE.exe") {
                        (0, InteractiveTutorial_1.iTutorialNextStep)();
                    }
                    else {
                        this.error(errorMessageForBadCommand);
                        return;
                    }
                    break;
                case InteractiveTutorial_1.iTutorialSteps.TerminalManualHack:
                    if (commandArray.length === 1 && commandArray[0] === "hack") {
                        (0, InteractiveTutorial_1.iTutorialNextStep)();
                    }
                    else {
                        this.error(errorMessageForBadCommand);
                        return;
                    }
                    break;
                case InteractiveTutorial_1.iTutorialSteps.TerminalHackingMechanics:
                    if (commandArray.length !== 1 || !["grow", "weaken", "hack"].includes(commandArray[0] + "")) {
                        this.error(errorMessageForBadCommand);
                        return;
                    }
                    break;
                case InteractiveTutorial_1.iTutorialSteps.TerminalGoHome:
                    if (commandArray.length === 1 && commandArray[0] === "home") {
                        (0, InteractiveTutorial_1.iTutorialNextStep)();
                    }
                    else {
                        this.error(errorMessageForBadCommand);
                        return;
                    }
                    break;
                case InteractiveTutorial_1.iTutorialSteps.TerminalCreateScript:
                    if (commandArray.length === 2 && commandArray[0] === "nano" && commandArray[1] === "n00dles.js") {
                        (0, InteractiveTutorial_1.iTutorialNextStep)();
                    }
                    else {
                        this.error(errorMessageForBadCommand);
                        return;
                    }
                    break;
                case InteractiveTutorial_1.iTutorialSteps.TerminalFree:
                    if (commandArray.length === 1 && commandArray[0] === "free") {
                        (0, InteractiveTutorial_1.iTutorialNextStep)();
                    }
                    else {
                        this.error(errorMessageForBadCommand);
                        return;
                    }
                    break;
                case InteractiveTutorial_1.iTutorialSteps.TerminalRunScript:
                    if (commandArray.length === 2 && commandArray[0] === "run" && commandArray[1] === "n00dles.js") {
                        (0, InteractiveTutorial_1.iTutorialNextStep)();
                    }
                    else {
                        this.error(errorMessageForBadCommand);
                        return;
                    }
                    break;
                case InteractiveTutorial_1.iTutorialSteps.ActiveScriptsToTerminal:
                    if (commandArray.length === 2 && commandArray[0] === "tail" && commandArray[1] === "n00dles.js") {
                        (0, InteractiveTutorial_1.iTutorialNextStep)();
                    }
                    else {
                        this.error(errorMessageForBadCommand);
                        return;
                    }
                    break;
                default:
                    this.error("Please follow the tutorial or click 'Exit Tutorial' if you'd like to skip it");
                    return;
            }
        }
        /****************** END INTERACTIVE TUTORIAL ******************/
        /* Command parser */
        const commandName = commandArray[0];
        if (typeof commandName !== "string")
            return this.error(`${commandName} is not a valid command.`);
        // run by path command
        if ((0, FilePath_1.isBasicFilePath)(commandName))
            return (0, run_1.run)(commandArray, currentServer);
        // Aside from the run-by-path command, we don't need the first entry once we've stored it in commandName.
        commandArray.shift();
        const f = exports.TerminalCommands[commandName.toLowerCase()];
        if (!f) {
            const similarCommands = findSimilarCommands(commandName);
            const didYouMeanString = similarCommands.length ? ` Did you mean: ${similarCommands.join(" or ")}?` : "";
            return this.error(`Command ${commandName} not found.${didYouMeanString}`);
        }
        f(commandArray, currentServer);
    }
    getProgressText() {
        if (this.action === null)
            throw new Error("trying to get the progress text when there's no action");
        return (0, createProgressBarText_1.createProgressBarText)({
            progress: (this.action.time - this.action.timeLeft) / this.action.time,
            totalTicks: 50,
        });
    }
}
exports.Terminal = Terminal;
function findSimilarCommands(command) {
    const commands = Object.keys(exports.TerminalCommands);
    const offByOneLetter = commands.filter((c) => {
        if (c.length !== command.length)
            return false;
        let diff = 0;
        for (let i = 0; i < c.length; i++) {
            if (c[i] !== command[i])
                diff++;
        }
        return diff === 1;
    });
    const subset = commands.filter((c) => c.includes(command)).sort((a, b) => a.length - b.length);
    return Array.from(new Set([...offByOneLetter, ...subset])).slice(0, 3);
}
