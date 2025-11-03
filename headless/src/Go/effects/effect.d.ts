import { GoOpponent } from "@enums";
/**
 * Calculates the effect size of the given player boost, based on the node power (points based on number of subnet
 * nodes captured and player wins) and effect power (scalar for individual boosts)
 */
export declare function CalculateEffect(nodes: number, faction: GoOpponent): number;
/**
 * Get maximum favor that you can gain from IPvGO win streaks
 * for factions you are a member of.
 *
 * This is added as converted rep to avoid making the equivalent value of the favor in rep very different as you approach 150 favor
 */
export declare function getMaxRep(): 100000 | 400000 | 200000 | 300000;
/**
 * Gets a formatted description of the current bonus from this faction
 */
export declare function getBonusText(opponent: GoOpponent): string;
/**
 * Update the player object, using the multipliers gained from node power for each faction
 */
export declare function updateGoMults(): void;
export declare function playerHasDiscoveredGo(): boolean;
export declare function getEffectTypeForFaction(opponent: GoOpponent): string;
export declare function getWinstreakMultiplier(winStreak: number, previousWinStreak: number): number;
export declare function getDifficultyMultiplier(komi: number, boardSize: number): number;
