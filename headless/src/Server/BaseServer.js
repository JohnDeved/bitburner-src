"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseServer = void 0;
const Script_1 = require("../Script/Script");
const TextFile_1 = require("../TextFile");
const ScriptFilePath_1 = require("../Paths/ScriptFilePath");
const Directory_1 = require("../Paths/Directory");
const TextFilePath_1 = require("../Paths/TextFilePath");
const JSONReviver_1 = require("../utils/JSONReviver");
const scriptKey_1 = require("../utils/helpers/scriptKey");
const IPAddress_1 = require("../utils/IPAddress");
const Jsonable_1 = require("../Types/Jsonable");
const ProgramFilePath_1 = require("../Paths/ProgramFilePath");
const getKeyList_1 = require("../utils/helpers/getKeyList");
const lodash_1 = __importDefault(require("lodash"));
const Settings_1 = require("../Settings/Settings");
const TypeAssertion_1 = require("../utils/TypeAssertion");
const clampNumber_1 = require("../utils/helpers/clampNumber");
/** Abstract Base Class for any Server object */
class BaseServer {
    constructor(params = { hostname: "", ip: (0, IPAddress_1.createRandomIp)() }) {
        // Coding Contract files on this server
        this.contracts = [];
        // How many CPU cores this server has.
        this.cpuCores = 1;
        // Flag indicating whether the FTP port is open
        this.ftpPortOpen = false;
        // Flag indicating whether player has admin/root access to this server
        this.hasAdminRights = false;
        // Hostname. Must be unique
        this.hostname = "home";
        // Flag indicating whether HTTP Port is open
        this.httpPortOpen = false;
        // IP Address. Must be unique
        this.ip = "1.1.1.1";
        // Flag indicating whether player is currently connected to this server
        this.isConnectedTo = false;
        // RAM (GB) available on this server
        this.maxRam = 0;
        // Message files AND Literature files on this Server
        this.messages = [];
        // Name of company/faction/etc. that this server belongs to.
        // Optional, not applicable to all Servers
        this.organizationName = "";
        // Programs on this servers. Contains only the names of the programs
        // CompletedProgramNames are all typechecked as valid paths in Program constructor
        this.programs = [];
        // RAM (GB) used. i.e. unavailable RAM
        this.ramUsed = 0;
        // RunningScript files on this server. Keyed first by name/args, then by PID.
        this.runningScriptMap = new Map();
        // RunningScript files loaded from the savegame. Only stored here temporarily,
        // this field is undef while the game is running.
        this.savedScripts = undefined;
        // Script files on this Server
        this.scripts = new Jsonable_1.JSONMap();
        // Contains the hostnames of all servers that are immediately
        // reachable from this one
        this.serversOnNetwork = [];
        // Flag indicating whether SMTP Port is open
        this.smtpPortOpen = false;
        // Flag indicating whether SQL Port is open
        this.sqlPortOpen = false;
        // Flag indicating whether the SSH Port is open
        this.sshPortOpen = false;
        // Text files on this server
        this.textFiles = new Jsonable_1.JSONMap();
        // Flag indicating whether this is a purchased server
        this.purchasedByPlayer = false;
        this.ip = params.ip ? params.ip : (0, IPAddress_1.createRandomIp)();
        this.hostname = params.hostname;
        this.organizationName = params.organizationName != null ? params.organizationName : "";
        this.isConnectedTo = params.isConnectedTo != null ? params.isConnectedTo : false;
        //Access information
        this.hasAdminRights = params.adminRights != null ? params.adminRights : false;
    }
    addContract(contract) {
        this.contracts.push(contract);
    }
    getContract(contractName) {
        for (const contract of this.contracts) {
            if (contract.fn === contractName) {
                return contract;
            }
        }
        return null;
    }
    /** Get a TextFile or Script depending on the input path type. */
    getContentFile(path) {
        return ((0, TextFilePath_1.hasTextExtension)(path) ? this.textFiles.get(path) : this.scripts.get(path)) ?? null;
    }
    /** Returns boolean indicating whether the given script is running on this server */
    isRunning(path) {
        const pattern = (0, scriptKey_1.matchScriptPathExact)(lodash_1.default.escapeRegExp(path));
        for (const k of this.runningScriptMap.keys()) {
            if (pattern.test(k)) {
                return true;
            }
        }
        return false;
    }
    removeContract(contract) {
        const index = this.contracts.findIndex((c) => c.fn === (typeof contract === "string" ? contract : contract.fn));
        if (index > -1)
            this.contracts.splice(index, 1);
    }
    /**
     * Remove a file from the server
     * @param path Name of file to be deleted
     * @returns {IReturnStatus} Return status object indicating whether or not file was deleted
     */
    removeFile(path) {
        if ((0, TextFilePath_1.hasTextExtension)(path)) {
            const textFile = this.textFiles.get(path);
            if (!textFile)
                return { res: false, msg: `Text file ${path} not found.` };
            this.textFiles.delete(path);
            return { res: true };
        }
        if ((0, ScriptFilePath_1.hasScriptExtension)(path)) {
            const script = this.scripts.get(path);
            if (!script)
                return { res: false, msg: `Script ${path} not found.` };
            if (this.isRunning(path))
                return { res: false, msg: "Cannot delete a script that is currently running!" };
            script.invalidateModule();
            this.scripts.delete(path);
            return { res: true };
        }
        if ((0, ProgramFilePath_1.hasProgramExtension)(path)) {
            const programIndex = this.programs.findIndex((program) => program === path);
            if (programIndex === -1)
                return { res: false, msg: `Program ${path} does not exist` };
            this.programs.splice(programIndex, 1);
            return { res: true };
        }
        if (path.endsWith(".lit")) {
            const litIndex = this.messages.findIndex((lit) => lit === path);
            if (litIndex === -1)
                return { res: false, msg: `Literature file ${path} does not exist` };
            this.messages.splice(litIndex, 1);
            return { res: true };
        }
        if (path.endsWith(".cct")) {
            const contractIndex = this.contracts.findIndex((contracts) => contracts.fn === path);
            if (contractIndex === -1)
                return { res: false, msg: `Contract file ${path} does not exist` };
            this.contracts.splice(contractIndex, 1);
            return { res: true };
        }
        return { res: false, msg: `Unhandled file extension on file path ${path}` };
    }
    /**
     * Called when a script is run on this server.
     * All this function does is add a RunningScript object to the
     * `runningScripts` array. It does NOT check whether the script actually can
     * be run.
     */
    runScript(script) {
        let byPid = this.runningScriptMap.get(script.scriptKey);
        if (!byPid) {
            byPid = new Map();
            this.runningScriptMap.set(script.scriptKey, byPid);
        }
        byPid.set(script.pid, script);
    }
    setMaxRam(ram) {
        this.maxRam = ram;
    }
    updateRamUsed(ram) {
        this.ramUsed = (0, clampNumber_1.clampNumber)(ram, 0, this.maxRam);
    }
    pushProgram(program) {
        if (this.programs.includes(program))
            return;
        // Remove partially created program if there is one
        const existingPartialExeIndex = this.programs.findIndex((p) => p.startsWith(program));
        // findIndex returns -1 if there is no match, we only want to splice on a match
        if (existingPartialExeIndex > -1)
            this.programs.splice(existingPartialExeIndex, 1);
        this.programs.push(program);
    }
    /**
     * Write to a script file
     * Overwrites existing files. Creates new files if the script does not exist.
     */
    writeToScriptFile(filename, code) {
        // Check if the script already exists, and overwrite it if it does
        const script = this.scripts.get(filename);
        if (script) {
            // content setter handles module invalidation
            script.content = code;
            return { overwritten: true };
        }
        // Otherwise, create a new script
        const newScript = new Script_1.Script(filename, code, this.hostname);
        this.scripts.set(filename, newScript);
        return { overwritten: false };
    }
    // Write to a text file
    // Overwrites existing files. Creates new files if the text file does not exist
    writeToTextFile(textPath, txt) {
        // Check if the text file already exists, and overwrite if it does
        const existingFile = this.textFiles.get(textPath);
        // overWrite if already exists
        if (existingFile) {
            existingFile.content = txt;
            return { overwritten: true };
        }
        // Otherwise create a new text file
        const newFile = new TextFile_1.TextFile(textPath, txt);
        this.textFiles.set(textPath, newFile);
        return { overwritten: false };
    }
    /** Write to a Script or TextFile */
    writeToContentFile(path, content) {
        if ((0, TextFilePath_1.hasTextExtension)(path))
            return this.writeToTextFile(path, content);
        return this.writeToScriptFile(path, content);
    }
    // Serialize the current object to a JSON save state
    // Called by subclasses, not stringify.
    toJSONBase(ctorName, keys) {
        // RunningScripts are stored as a simple array, both for backward compatibility,
        // compactness, and ease of filtering them here.
        const result = (0, JSONReviver_1.Generic_toJSON)(ctorName, this, keys);
        (0, TypeAssertion_1.assertObject)(result.data);
        if (Settings_1.Settings.ExcludeRunningScriptsFromSave) {
            result.data.runningScripts = [];
            return result;
        }
        const rsArray = [];
        for (const byPid of this.runningScriptMap.values()) {
            for (const rs of byPid.values()) {
                if (!rs.temporary) {
                    rsArray.push(rs);
                }
            }
        }
        result.data.runningScripts = rsArray;
        return result;
    }
    // Initializes a Server Object from a JSON save state
    // Called by subclasses, not Reviver.
    static fromJSONBase(value, ctor, keys) {
        (0, TypeAssertion_1.assertObject)(value.data);
        const server = (0, JSONReviver_1.Generic_fromJSON)(ctor, value.data, keys);
        if (value.data.runningScripts != null && Array.isArray(value.data.runningScripts)) {
            server.savedScripts = value.data.runningScripts;
        }
        // If textFiles is not an array, we've already done the 2.3 migration to textFiles and scripts as maps + path changes.
        if (!Array.isArray(server.textFiles))
            return server;
        // Migrate to using maps for scripts and textfiles. This is done here, directly at load, instead of the
        // usual upgrade logic, for two reasons:
        // 1) Our utility functions depend on it, so the upgrade logic itself needs the data to be in maps, even the logic
        //    written earlier than 2.3!
        // 2) If the upgrade logic throws, and then you soft-reset at the recovery screen (or maybe don't even see the
        //    recovery screen), you can end up with a "migrated" save that still has arrays.
        const newDirectory = (0, Directory_1.resolveDirectory)("v2.3FileChanges/");
        let invalidScriptCount = 0;
        // There was a brief dev window where Server.scripts was already a map but the filepath changes weren't in yet.
        // Thus, we can't skip this logic just because it's already a map.
        const oldScripts = Array.isArray(server.scripts) ? server.scripts : [...server.scripts.values()];
        server.scripts = new Jsonable_1.JSONMap();
        // In case somehow there are previously valid filenames that can't be sanitized, they will go in a new directory with a note.
        for (const script of oldScripts) {
            // We're about to do type validation on the filename anyway.
            if (script.filename.endsWith(".ns"))
                script.filename = (script.filename + ".js");
            let newFilePath = (0, ScriptFilePath_1.resolveScriptFilePath)(script.filename);
            if (!newFilePath) {
                newFilePath = `${newDirectory}script${++invalidScriptCount}.js`;
                script.content = `// Original path: ${script.filename}. Path was no longer valid\n` + script.content;
            }
            script.filename = newFilePath;
            server.scripts.set(newFilePath, script);
        }
        let invalidTextCount = 0;
        const oldTextFiles = server.textFiles;
        server.textFiles = new Jsonable_1.JSONMap();
        for (const textFile of oldTextFiles) {
            const oldName = textFile.fn ?? textFile.filename;
            delete textFile.fn;
            let newFilePath = (0, TextFilePath_1.resolveTextFilePath)(oldName);
            if (!newFilePath) {
                newFilePath = `${newDirectory}text${++invalidTextCount}.txt`;
                textFile.content = `// Original path: ${textFile.filename}. Path was no longer valid\n` + textFile.content;
            }
            textFile.filename = newFilePath;
            server.textFiles.set(newFilePath, textFile);
        }
        if (invalidScriptCount || invalidTextCount) {
            // If we had to migrate names, don't run scripts for this server.
            server.savedScripts = [];
        }
        return server;
    }
    // Customize a prune list for a subclass.
    static getIncludedKeys(ctor) {
        return (0, getKeyList_1.getKeyList)(ctor, { removedKeys: ["runningScriptMap", "savedScripts", "ramUsed", "isHacknetServer"] });
    }
}
exports.BaseServer = BaseServer;
