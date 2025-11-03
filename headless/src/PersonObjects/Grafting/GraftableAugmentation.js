"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraftableAugmentation = void 0;
const lodash_1 = require("lodash");
const Constants_1 = require("../../Constants");
class GraftableAugmentation {
    constructor(augmentation) {
        this.augmentation = augmentation;
    }
    get cost() {
        return this.augmentation.baseCost * Constants_1.CONSTANTS.AugmentationGraftingCostMult;
    }
    get time() {
        // Time = 1 hour * log_2(sum(aug multipliers) || 1) + 30 minutes
        const antiLog = Math.max((0, lodash_1.sum)(Object.values(this.augmentation.mults).filter((x) => x !== 1)), 1);
        const mult = Math.log2(antiLog);
        return (Constants_1.CONSTANTS.AugmentationGraftingTimeBase * mult + Constants_1.CONSTANTS.MillisecondsPerHalfHour) / 2;
    }
}
exports.GraftableAugmentation = GraftableAugmentation;
