"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnedAugmentationsOrderSetting = exports.PurchaseAugmentationsOrderSetting = void 0;
// Numeric enum
/** Allowed values for the 'OwnedAugmentationsOrder' setting */
var PurchaseAugmentationsOrderSetting;
(function (PurchaseAugmentationsOrderSetting) {
    PurchaseAugmentationsOrderSetting[PurchaseAugmentationsOrderSetting["Cost"] = 0] = "Cost";
    PurchaseAugmentationsOrderSetting[PurchaseAugmentationsOrderSetting["Default"] = 1] = "Default";
    PurchaseAugmentationsOrderSetting[PurchaseAugmentationsOrderSetting["Reputation"] = 2] = "Reputation";
    PurchaseAugmentationsOrderSetting[PurchaseAugmentationsOrderSetting["Purchasable"] = 3] = "Purchasable";
})(PurchaseAugmentationsOrderSetting || (exports.PurchaseAugmentationsOrderSetting = PurchaseAugmentationsOrderSetting = {}));
// Numeric enum
/** Allowed values for the 'OwnedAugmentationsOrder' setting */
var OwnedAugmentationsOrderSetting;
(function (OwnedAugmentationsOrderSetting) {
    OwnedAugmentationsOrderSetting[OwnedAugmentationsOrderSetting["Alphabetically"] = 0] = "Alphabetically";
    OwnedAugmentationsOrderSetting[OwnedAugmentationsOrderSetting["AcquirementTime"] = 1] = "AcquirementTime";
})(OwnedAugmentationsOrderSetting || (exports.OwnedAugmentationsOrderSetting = OwnedAugmentationsOrderSetting = {}));
