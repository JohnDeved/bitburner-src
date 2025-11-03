"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwardNFG = AwardNFG;
exports.v1APIBreak = v1APIBreak;
const _enums_1 = require("@enums");
const PlayerOwnedAugmentation_1 = require("../Augmentation/PlayerOwnedAugmentation");
const _player_1 = require("@player");
const AllServers_1 = require("../Server/AllServers");
const TextFilePath_1 = require("../Paths/TextFilePath");
const ScriptFilePath_1 = require("../Paths/ScriptFilePath");
const detect = [
    ["getHackTime", "returns milliseconds"],
    ["getGrowTime", "returns milliseconds"],
    ["getWeakenTime", "returns milliseconds"],
    ["getActionTime", "returns milliseconds"],
    ["hackAnalyzePercent", "renamed 'hackAnalyze' and returns decimal"],
    ["hackChance", "renamed 'hackAnalyzeChance'"],
    ["basic.calculateSkill", "renamed 'skills.calculateSkill'"],
    ["basic.calculateExp", "renamed 'skills.calculateExp'"],
    ["basic.hackChance", "renamed 'hacking.hackChance'"],
    ["basic.hackExp", "renamed 'hacking.hackExp'"],
    ["basic.hackPercent", "renamed 'hacking.hackPercent'"],
    ["basic.growPercent", "renamed 'hacking.growPercent'"],
    ["basic.hackTime", "renamed 'hacking.hackTime'"],
    ["basic.growTime", "renamed 'hacking.growTime'"],
    ["basic.weakenTime", "renamed 'hacking.weakenTime'"],
    ["write", "needs to be awaited"],
    ["scp", "needs to be awaited"],
    ["sleep", "Can no longer be called simultaneously."],
    ["hacking_skill", "renamed 'hacking'"],
    ["tryWrite", "renamed 'tryWritePort'"],
];
const changes = [
    [/ns.getHackTime/g, "((...a)=>ns.getHackTime(...a)/1000)"],
    [/ns.getGrowTime/g, "((...a)=>ns.getGrowTime(...a)/1000)"],
    [/ns.getWeakenTime/g, "((...a)=>ns.getWeakenTime(...a)/1000)"],
    [/ns.bladeburner.getActionTime/g, "((...a)=>ns.bladeburner.getActionTime(...a)/1000)"],
    [/ns.hackAnalyzePercent/g, "((...a)=>ns.hackAnalyze(...a)*100)"],
    [/ns.hackChance/g, "ns.hackAnalyzeChance"],
    [/ns.tryWrite/g, "ns.tryWritePort"],
    [/formulas.basic.calculateSkill/g, "formulas.skills.calculateSkill"],
    [/formulas.basic.calculateExp/g, "formulas.skills.calculateExp"],
    [/formulas.basic.hackChance/g, "formulas.hacking.hackChance"],
    [/formulas.basic.hackExp/g, "formulas.hacking.hackExp"],
    [/formulas.basic.hackPercent/g, "formulas.hacking.hackPercent"],
    [/formulas.basic.growPercent/g, "formulas.hacking.growPercent"],
    [/formulas.basic.hackTime/g, "formulas.hacking.hackTime"],
    [/formulas.basic.growTime/g, "formulas.hacking.growTime"],
    [/formulas.basic.weakenTime/g, "formulas.hacking.weakenTime"],
];
function hasChanges(code) {
    for (const change of changes) {
        if (code.match(change[0]))
            return true;
    }
    return false;
}
function convert(code) {
    const lines = code.split("\n");
    const out = [];
    for (let i = 0; i < lines.length; i++) {
        const orig = lines[i];
        let line = lines[i];
        for (const change of changes) {
            line = line.replace(change[0], change[1]);
        }
        if (line != orig) {
            out.push(`// =============================== original line ===============================`);
            out.push(`/**`);
            out.push(` * ${orig}`);
            out.push(" */");
            out.push(`// =============================================================================`);
        }
        out.push(line);
    }
    code = out.join("\n");
    return code;
}
function AwardNFG(n = 1) {
    const nf = _player_1.Player.augmentations.find((a) => a.name === _enums_1.AugmentationName.NeuroFluxGovernor);
    if (nf) {
        nf.level += n;
    }
    else {
        const nf = new PlayerOwnedAugmentation_1.PlayerOwnedAugmentation(_enums_1.AugmentationName.NeuroFluxGovernor);
        nf.level = n;
        _player_1.Player.augmentations.push(nf);
    }
}
function v1APIBreak() {
    let txt = "";
    for (const server of (0, AllServers_1.GetAllServers)()) {
        for (const change of detect) {
            const s = [];
            for (const script of server.scripts.values()) {
                const lines = script.code.split("\n");
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].includes(change[0])) {
                        s.push({
                            file: script.filename,
                            line: i + 1,
                            content: "",
                        });
                    }
                }
            }
            if (s.length === 0)
                continue;
            txt += `// Detected change ${change[0]}, reason: ${change[1]}\n`;
            for (const fl of s) {
                txt += `${fl.file}:${fl.line}\n`;
            }
        }
    }
    if (txt !== "") {
        const home = _player_1.Player.getHomeComputer();
        const textPath = (0, TextFilePath_1.resolveTextFilePath)("v1_DETECTED_CHANGES.txt");
        if (!textPath)
            return console.error("Filepath unexpectedly failed to parse");
        home.writeToTextFile(textPath, txt);
    }
    const backupFiles = new Map();
    for (const server of (0, AllServers_1.GetAllServers)()) {
        backupFiles.clear();
        for (const script of server.scripts.values()) {
            if (!hasChanges(script.code)) {
                continue;
            }
            // Sanitize first before combining
            const oldFilename = (0, ScriptFilePath_1.resolveScriptFilePath)(script.filename);
            if (!oldFilename) {
                console.error(`Cannot resolve path for ${script.filename}`);
                continue;
            }
            const filename = (0, ScriptFilePath_1.resolveScriptFilePath)("BACKUP_" + oldFilename);
            if (!filename) {
                console.error(`Cannot resolve backup path for ${script.filename}`);
                continue;
            }
            backupFiles.set(filename, script.code);
            script.code = convert(script.code);
        }
        for (const [filename, code] of backupFiles.entries()) {
            server.writeToScriptFile(filename, code);
        }
    }
}
