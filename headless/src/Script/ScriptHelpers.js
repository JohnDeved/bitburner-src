"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scriptCalculateOfflineProduction = scriptCalculateOfflineProduction;
exports.findRunningScripts = findRunningScripts;
exports.findRunningScriptByPid = findRunningScriptByPid;
const Constants_1 = require("../Constants");
const _player_1 = require("@player");
const Server_1 = require("../Server/Server");
const ServerHelpers_1 = require("../Server/ServerHelpers");
const AllServers_1 = require("../Server/AllServers");
const formatNumber_1 = require("../ui/formatNumber");
const WorkerScripts_1 = require("../Netscript/WorkerScripts");
const scriptKey_1 = require("../utils/helpers/scriptKey");
function scriptCalculateOfflineProduction(runningScript, playerLastUpdate, playerPlaytimeSinceLastAug) {
    //The Player object stores the last update time from when we were online
    const thisUpdate = new Date().getTime();
    const lastUpdate = playerLastUpdate;
    const timePassed = Math.max((thisUpdate - lastUpdate) / 1000, 0); //Seconds
    //Calculate the "confidence" rating of the script's true production. This is based
    //entirely off of time. We will arbitrarily say that if a script has been running for
    //4 hours (14400 sec) then we are completely confident in its ability
    let confidence = runningScript.onlineRunningTime / 14400;
    if (confidence >= 1) {
        confidence = 1;
    }
    //Data map: [MoneyStolen, NumTimesHacked, NumTimesGrown, NumTimesWeaken]
    // Grow
    for (const hostname of Object.keys(runningScript.dataMap)) {
        if (Object.hasOwn(runningScript.dataMap, hostname)) {
            if (runningScript.dataMap[hostname][2] == 0 || runningScript.dataMap[hostname][2] == null) {
                continue;
            }
            const server = (0, AllServers_1.GetServer)(hostname);
            if (server == null) {
                continue;
            }
            const timesGrown = Math.round(((0.5 * runningScript.dataMap[hostname][2]) / runningScript.onlineRunningTime) * timePassed);
            runningScript.log(`Called on ${server.hostname} ${timesGrown} times while offline`);
            const host = (0, AllServers_1.GetServer)(runningScript.server);
            if (host === null) {
                throw new Error("getServer of null key?");
            }
            if (!(server instanceof Server_1.Server)) {
                throw new Error("trying to grow a non-normal server");
            }
            const growth = (0, ServerHelpers_1.processSingleServerGrowth)(server, timesGrown, host.cpuCores);
            runningScript.log(`'${server.hostname}' grown by ${(0, formatNumber_1.formatPercent)(growth - 1, 6)} while offline`);
        }
    }
    // Offline EXP gain
    // A script's offline production will always be at most half of its online production.
    const expGain = confidence * (runningScript.onlineExpGained / runningScript.onlineRunningTime) * timePassed;
    _player_1.Player.gainHackingExp(expGain);
    let moneyGain = (runningScript.onlineMoneyMade / playerPlaytimeSinceLastAug) * timePassed * Constants_1.CONSTANTS.OfflineHackingIncome;
    if (!Number.isFinite(moneyGain)) {
        moneyGain = 0;
    }
    // money is given to player during engine load
    _player_1.Player.scriptProdSinceLastAug += moneyGain;
    // Update script stats
    runningScript.offlineRunningTime += timePassed;
    runningScript.offlineExpGained += expGain;
    runningScript.offlineMoneyMade += moneyGain;
    // Weaken
    for (const hostname of Object.keys(runningScript.dataMap)) {
        if (Object.hasOwn(runningScript.dataMap, hostname)) {
            if (runningScript.dataMap[hostname][3] == 0 || runningScript.dataMap[hostname][3] == null) {
                continue;
            }
            const serv = (0, AllServers_1.GetServer)(hostname);
            if (serv == null) {
                continue;
            }
            if (!(serv instanceof Server_1.Server))
                throw new Error("trying to weaken a non-normal server");
            const host = (0, AllServers_1.GetServer)(runningScript.server);
            if (host === null)
                throw new Error("getServer of null key?");
            const timesWeakened = Math.round(((0.5 * runningScript.dataMap[hostname][3]) / runningScript.onlineRunningTime) * timePassed);
            runningScript.log(`Called weaken() on ${serv.hostname} ${timesWeakened} times while offline`);
            const weakenAmount = (0, ServerHelpers_1.getWeakenEffect)(runningScript.threads, host.cpuCores);
            serv.weaken(weakenAmount * timesWeakened);
        }
    }
}
//Returns a RunningScript map containing scripts matching the filename and
//arguments on the designated server, or null if none were found
function findRunningScripts(path, args, server) {
    return server.runningScriptMap.get((0, scriptKey_1.scriptKey)(path, args)) ?? null;
}
//Returns a RunningScript object with the given pid, or null
function findRunningScriptByPid(pid) {
    const ws = WorkerScripts_1.workerScripts.get(pid);
    if (!ws)
        return null;
    return ws.scriptRef;
}
