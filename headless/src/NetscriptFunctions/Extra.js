"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetscriptExtra = NetscriptExtra;
const _player_1 = require("@player");
const Exploit_1 = require("../Exploits/Exploit");
const bcrypt = __importStar(require("bcryptjs"));
const Apr1_1 = require("../ui/Apr1");
const NetscriptHelpers_1 = require("../Netscript/NetscriptHelpers");
const RamCostGenerator_1 = require("../Netscript/RamCostGenerator");
function NetscriptExtra() {
    return {
        openDevMenu: () => () => Apr1_1.Apr1Events.emit(),
        exploit: () => () => _player_1.Player.giveExploit(Exploit_1.Exploit.UndocumentedFunctionCall),
        bypass: (ctx) => (doc) => {
            const d = doc;
            d.completely_unused_field = undefined;
            const real_document = document;
            real_document.completely_unused_field = undefined;
            // set one to true and check that it affected the other.
            real_document.completely_unused_field = true;
            if (d.completely_unused_field && ctx.workerScript.scriptRef.ramUsage === RamCostGenerator_1.RamCostConstants.Base) {
                _player_1.Player.giveExploit(Exploit_1.Exploit.Bypass);
            }
            d.completely_unused_field = undefined;
            real_document.completely_unused_field = undefined;
        },
        alterReality: () => () => {
            // We need to trick webpack into not optimizing a variable that is guaranteed to be false (and doesn't use prototypes)
            let x = false;
            const recur = function (depth) {
                if (depth === 0)
                    return;
                x = !x;
                recur(depth - 1);
            };
            recur(2);
            console.warn("I am sure that this variable is false.");
            if (x) {
                console.warn("Reality has been altered!");
                _player_1.Player.giveExploit(Exploit_1.Exploit.RealityAlteration);
            }
        },
        rainbow: (ctx) => (_guess) => {
            const guess = NetscriptHelpers_1.helpers.string(ctx, "guess", _guess);
            const verified = bcrypt.compareSync(guess, "$2a$10$aertxDEkgor8baVtQDZsLuMwwGYmkRM/ohcA6FjmmzIHQeTCsrCcO");
            if (!verified)
                return false;
            _player_1.Player.giveExploit(Exploit_1.Exploit.INeedARainbow);
            return true;
        },
    };
}
