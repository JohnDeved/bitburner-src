"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAccessBladeburner = canAccessBladeburner;
exports.startBladeburner = startBladeburner;
const BitNodeUtils_1 = require("../../BitNode/BitNodeUtils");
const Bladeburner_1 = require("../../Bladeburner/Bladeburner");
const _enums_1 = require("@enums");
function canAccessBladeburner() {
    return ((0, BitNodeUtils_1.canAccessBitNodeFeature)(6) || (0, BitNodeUtils_1.canAccessBitNodeFeature)(7)) && !this.bitNodeOptions.disableBladeburner;
}
function startBladeburner() {
    this.bladeburner = new Bladeburner_1.Bladeburner();
    this.bladeburner.init();
    // Give Blades Simulacrum if you have unlocked it
    if (this.activeSourceFileLvl(7) >= 3) {
        this.augmentations.push({
            name: _enums_1.AugmentationName.BladesSimulacrum,
            level: 1,
        });
    }
}
