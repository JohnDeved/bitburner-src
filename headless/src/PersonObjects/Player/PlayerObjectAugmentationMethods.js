"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyEntropy = applyEntropy;
/** Augmentation-related methods for the Player class (PlayerObject) */
const EntropyAccumulation_1 = require("../Grafting/EntropyAccumulation");
const Helper_1 = require("../../CotMG/Helper");
const effect_1 = require("../../Go/effects/effect");
function applyEntropy(stacks = 1) {
    // Save the current HP ratio.
    const currentHpRatio = this.hp.current / this.hp.max;
    // Re-apply all multipliers
    this.reapplyAllAugmentations();
    this.reapplyAllSourceFiles();
    this.mults = (0, EntropyAccumulation_1.calculateEntropy)(stacks);
    Helper_1.staneksGift.updateMults();
    (0, effect_1.updateGoMults)();
    /**
     * The ratio of (hp.current / hp.max) may be wrong after multiple function calls above. We need to recalculate
     * hp.current based on the saved value.
     */
    this.hp.current = Math.round(this.hp.max * Math.min(currentHpRatio, 1));
}
