import { Augmentation } from "./Augmentation";
import { PlayerOwnedAugmentation } from "./PlayerOwnedAugmentation";
export declare function getBaseAugmentationPriceMultiplier(): number;
export declare function getGenericAugmentationPriceMultiplier(): number;
export declare function applyAugmentation(aug: PlayerOwnedAugmentation, reapply?: boolean): void;
export declare function installAugmentations(force?: boolean): boolean;
export declare function isRepeatableAug(aug: Augmentation | string): boolean;
export interface AugmentationCosts {
    moneyCost: number;
    repCost: number;
}
export declare function getAugCost(aug: Augmentation): AugmentationCosts;
