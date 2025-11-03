"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixDoImportIssue = fixDoImportIssue;
exports.initGameEnvironment = initGameEnvironment;
exports.setupBasicTestingEnvironment = setupBasicTestingEnvironment;
exports.getNS = getNS;
exports.getMockedNetscriptContext = getMockedNetscriptContext;
const WorkerScript_1 = require("../../src/Netscript/WorkerScript");
const NetscriptFunctions_1 = require("../../src/NetscriptFunctions");
const PlayerObject_1 = require("../../src/PersonObjects/Player/PlayerObject");
const Player_1 = require("../../src/Player");
const RunningScript_1 = require("../../src/Script/RunningScript");
const AllServers_1 = require("../../src/Server/AllServers");
const SpecialServers_1 = require("../../src/Server/data/SpecialServers");
const SourceFiles_1 = require("../../src/SourceFile/SourceFiles");
const formatNumber_1 = require("../../src/ui/formatNumber");
const GameRoot_1 = require("../../src/ui/GameRoot");
const NetscriptJSEvaluator_1 = require("../../src/NetscriptJSEvaluator");
function fixDoImportIssue() {
    // Replace Blob/ObjectURL functions, because they don't work natively in Jest
    global.Blob = class extends Blob {
        constructor(blobParts, __options) {
            super();
            this.code = String((blobParts ?? [])[0]);
        }
    };
    global.URL.revokeObjectURL = function () { };
    // Critical: We have to overwrite this, otherwise we get Jest's hooked
    // implementation, which will not work without passing special flags to Node,
    // and tends to crash even if you do.
    NetscriptJSEvaluator_1.config.doImport = importActual;
    global.URL.createObjectURL = function (blob) {
        return "data:text/javascript," + encodeURIComponent(blob.code);
    };
}
function initGameEnvironment() {
    // We need to patch this function. Some APIs call it, but it only works properly after the main UI is loaded.
    GameRoot_1.Router.toPage = () => { };
    /**
     * In src\ui\formatNumber.ts, there are some variables that need to be initialized before other functions can be
     * called. We have to call FormatsNeedToChange.emit() to initialize those variables.
     */
    formatNumber_1.FormatsNeedToChange.emit();
    (0, SourceFiles_1.initSourceFiles)();
}
function setupBasicTestingEnvironment() {
    (0, AllServers_1.prestigeAllServers)();
    (0, Player_1.setPlayer)(new PlayerObject_1.PlayerObject());
    Player_1.Player.init();
    Player_1.Player.sourceFiles.set(4, 3);
    (0, AllServers_1.initForeignServers)(Player_1.Player.getHomeComputer());
}
function getNS() {
    const home = (0, AllServers_1.GetServerOrThrow)(SpecialServers_1.SpecialServers.Home);
    home.maxRam = 1024;
    const filePath = "test.js";
    home.writeToScriptFile(filePath, "");
    const script = home.scripts.get(filePath);
    if (!script) {
        throw new Error("Invalid script");
    }
    const runningScript = new RunningScript_1.RunningScript(script, 1024);
    const workerScript = new WorkerScript_1.WorkerScript(runningScript, 1, NetscriptFunctions_1.NetscriptFunctions);
    const ns = workerScript.env.vars;
    if (!ns) {
        throw new Error("Invalid NS instance");
    }
    return ns;
}
function getMockedNetscriptContext(workerScriptLogFunction = () => { }) {
    return {
        function: "",
        functionPath: "",
        workerScript: {
            log: workerScriptLogFunction,
            scriptRef: {
                dependencies: [],
            },
        },
    };
}
