export declare const ShareBonusTime = 10000;
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
export declare const pendingUIShareJobIds: number[];
export declare function calculateEffectiveSharedThreads(threads: number, cpuCores: number): number;
export declare function startSharing(threads: number, cpuCores: number): () => void;
export declare function calculateShareBonus(shareThreads: number): number;
export declare function calculateShareBonusWithAdditionalThreads(threads: number, cpuCores: number): number;
export declare function calculateCurrentShareBonus(): number;
