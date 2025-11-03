"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recentScripts = void 0;
exports.AddRecentScript = AddRecentScript;
const Settings_1 = require("../Settings/Settings");
exports.recentScripts = [];
let recentScriptId = 0;
function AddRecentScript(workerScript) {
    if (exports.recentScripts.find((r) => r.runningScript.pid === workerScript.pid))
        return;
    const killedTime = new Date();
    ++recentScriptId;
    exports.recentScripts.unshift({
        id: recentScriptId,
        timeOfDeath: killedTime,
        runningScript: workerScript.scriptRef,
    });
    while (exports.recentScripts.length > Settings_1.Settings.MaxRecentScriptsCapacity) {
        exports.recentScripts.pop();
    }
}
