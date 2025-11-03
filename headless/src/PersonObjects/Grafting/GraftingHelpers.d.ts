import { AugmentationName } from "@enums";
import { GraftableAugmentation } from "./GraftableAugmentation";
export declare const getGraftingAvailableAugs: () => AugmentationName[];
export declare const graftingIntBonus: () => number;
export declare const calculateGraftingTimeWithBonus: (aug: GraftableAugmentation) => number;
