"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pendingUIShareJobIds = exports.ShareBonusTime = void 0;
exports.calculateEffectiveSharedThreads = calculateEffectiveSharedThreads;
exports.startSharing = startSharing;
exports.calculateShareBonus = calculateShareBonus;
exports.calculateShareBonusWithAdditionalThreads = calculateShareBonusWithAdditionalThreads;
exports.calculateCurrentShareBonus = calculateCurrentShareBonus;
const _player_1 = require("@player");
const intelligence_1 = require("../PersonObjects/formulas/intelligence");
const ServerHelpers_1 = require("../Server/ServerHelpers");
const clampNumber_1 = require("../utils/helpers/clampNumber");
let shareThreads = 1;
exports.ShareBonusTime = 10000;
/**
 * When the player shares free RAM via UI, it's a "pending job". After that job finishes, we restore the free RAM by
 * decreasing server.ramUsed by calling server.updateRamUsed(). However, if the player prestiges before that, all
 * servers are reset and ramUsed is reset to 0. This means that when a job finishes, we may modify ramUsed of a new
 * server.
 *
 * To solve this problem, we use an array to save job IDs. When the player prestiges, we clear this array. When a job
 * finishes, we check if that job ID is still in this array. If it is not, it means that the player performed a
 * prestige, and we do not need to decrease ramUsed.
 */
exports.pendingUIShareJobIds = [];
function calculateEffectiveSharedThreads(threads, cpuCores) {
    const coreBonus = (0, ServerHelpers_1.getCoreBonus)(cpuCores);
    return threads * (0, intelligence_1.calculateIntelligenceBonus)(_player_1.Player.skills.intelligence, 2) * coreBonus;
}
function startSharing(threads, cpuCores) {
    const effectiveThreads = calculateEffectiveSharedThreads(threads, cpuCores);
    shareThreads += effectiveThreads;
    return () => {
        /**
         * Due to floating point inaccuracy, shareThreads may be slightly higher or lower than 1 after many times the player
         * shares their RAM. We need to make sure that it's not smaller than 1.
         */
        shareThreads = (0, clampNumber_1.clampNumber)(shareThreads - effectiveThreads, 1);
        // shareThreads may be slightly higher than 1. Reset shareThreads if it's smaller than a threshold.
        if (shareThreads < 1.00001) {
            shareThreads = 1;
        }
    };
}
function calculateShareBonus(shareThreads) {
    const bonus = 1 + Math.log(shareThreads) / 25;
    if (!Number.isFinite(bonus)) {
        return 1;
    }
    return bonus;
}
function calculateShareBonusWithAdditionalThreads(threads, cpuCores) {
    return calculateShareBonus(shareThreads + calculateEffectiveSharedThreads(threads, cpuCores));
}
function calculateCurrentShareBonus() {
    return calculateShareBonus(shareThreads);
}
