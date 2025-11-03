"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateEffect = CalculateEffect;
exports.getMaxRep = getMaxRep;
exports.getBonusText = getBonusText;
exports.updateGoMults = updateGoMults;
exports.playerHasDiscoveredGo = playerHasDiscoveredGo;
exports.getEffectTypeForFaction = getEffectTypeForFaction;
exports.getWinstreakMultiplier = getWinstreakMultiplier;
exports.getDifficultyMultiplier = getDifficultyMultiplier;
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const Go_1 = require("../Go");
const BitNodeMultipliers_1 = require("../../BitNode/BitNodeMultipliers");
const Constants_1 = require("../Constants");
const Multipliers_1 = require("../../PersonObjects/Multipliers");
const formatNumber_1 = require("../../ui/formatNumber");
const scoring_1 = require("../boardAnalysis/scoring");
const Record_1 = require("../../Types/Record");
/**
 * Calculates the effect size of the given player boost, based on the node power (points based on number of subnet
 * nodes captured and player wins) and effect power (scalar for individual boosts)
 */
function CalculateEffect(nodes, faction) {
    const power = getEffectPowerForFaction(faction);
    const sourceFileBonus = _player_1.Player.activeSourceFileLvl(14) ? 2 : 1;
    return (1 + Math.log(nodes + 1) * Math.pow(nodes + 1, 0.3) * 0.002 * power * BitNodeMultipliers_1.currentNodeMults.GoPower * sourceFileBonus);
}
/**
 * Get maximum favor that you can gain from IPvGO win streaks
 * for factions you are a member of.
 *
 * This is added as converted rep to avoid making the equivalent value of the favor in rep very different as you approach 150 favor
 */
function getMaxRep() {
    const sourceFileLevel = _player_1.Player.activeSourceFileLvl(14);
    if (sourceFileLevel === 1) {
        return 200000;
    }
    if (sourceFileLevel === 2) {
        return 300000;
    }
    if (sourceFileLevel >= 3) {
        return 400000;
    }
    return 100000;
}
/**
 * Gets a formatted description of the current bonus from this faction
 */
function getBonusText(opponent) {
    const nodePower = (0, scoring_1.getOpponentStats)(opponent).nodePower;
    const effectPercent = (0, formatNumber_1.formatPercent)(CalculateEffect(nodePower, opponent) - 1);
    const effectDescription = getEffectTypeForFaction(opponent);
    return `${effectPercent} ${effectDescription}`;
}
/**
 * Update the player object, using the multipliers gained from node power for each faction
 */
function updateGoMults() {
    const mults = calculateMults();
    _player_1.Player.mults = (0, Multipliers_1.mergeMultipliers)(_player_1.Player.mults, mults);
    _player_1.Player.updateSkillLevels();
}
/**
 * Creates a multiplier object based on the player's total node power for each faction
 */
function calculateMults() {
    const mults = (0, Multipliers_1.defaultMultipliers)();
    (0, Record_1.getRecordEntries)(Go_1.Go.stats).forEach(([opponent, stats]) => {
        const effect = CalculateEffect(stats.nodePower, opponent);
        switch (opponent) {
            case _enums_1.GoOpponent.Netburners:
                mults.hacknet_node_money *= effect;
                break;
            case _enums_1.GoOpponent.SlumSnakes:
                mults.crime_success *= effect;
                break;
            case _enums_1.GoOpponent.TheBlackHand:
                mults.hacking_money *= effect;
                break;
            case _enums_1.GoOpponent.Tetrads:
                mults.strength *= effect;
                mults.defense *= effect;
                mults.dexterity *= effect;
                mults.agility *= effect;
                break;
            case _enums_1.GoOpponent.Daedalus:
                mults.company_rep *= effect;
                mults.faction_rep *= effect;
                break;
            case _enums_1.GoOpponent.Illuminati:
                mults.hacking_speed *= effect;
                break;
            case _enums_1.GoOpponent.w0r1d_d43m0n:
                mults.hacking *= effect;
                break;
        }
    });
    return mults;
}
function playerHasDiscoveredGo() {
    const playedGame = Go_1.Go.currentGame.previousBoards.length;
    const hasRecords = (0, Record_1.getRecordValues)(Go_1.Go.stats).some((stats) => stats.wins + stats.losses);
    const isInBn14 = _player_1.Player.bitNodeN === 14;
    return !!(playedGame || hasRecords || isInBn14);
}
function getEffectPowerForFaction(opponent) {
    return Constants_1.opponentDetails[opponent].bonusPower;
}
function getEffectTypeForFaction(opponent) {
    return Constants_1.opponentDetails[opponent].bonusDescription;
}
function getWinstreakMultiplier(winStreak, previousWinStreak) {
    if (winStreak < 0) {
        return 0.5;
    }
    // If you break a dry streak, gain extra bonus based on the length of the dry streak (up to 5x bonus)
    if (previousWinStreak < 0 && winStreak > 0) {
        const dryStreakBroken = -1 * previousWinStreak;
        return 1 + 0.5 * Math.min(dryStreakBroken, 8);
    }
    // Win streak bonus caps at x3
    return 1 + 0.25 * Math.min(winStreak, 8);
}
function getDifficultyMultiplier(komi, boardSize) {
    const isTinyBoardVsIlluminati = boardSize === 5 && komi === Constants_1.opponentDetails[_enums_1.GoOpponent.Illuminati].komi;
    return isTinyBoardVsIlluminati ? 8 : (komi + 0.5) * 0.25;
}
