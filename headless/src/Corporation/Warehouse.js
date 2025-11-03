"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Warehouse = void 0;
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const Material_1 = require("./Material");
const MaterialInfo_1 = require("./MaterialInfo");
const JSONReviver_1 = require("../utils/JSONReviver");
const Constants_1 = require("./data/Constants");
const Record_1 = require("../Types/Record");
class Warehouse {
    constructor(params = null) {
        // Warehouse's level, which affects its maximum size
        this.level = 1;
        // City that this Warehouse is in
        this.city = _enums_1.CityName.Sector12;
        // Map of Materials held by this Warehouse
        this.materials = (0, Record_1.createFullRecordFromEntries)(Constants_1.materialNames.map((matName) => [matName, new Material_1.Material({ name: matName })]));
        // Maximum amount warehouse can hold
        this.size = 0;
        // Amount of space currently used by warehouse
        this.sizeUsed = 0;
        // Whether Smart Supply is enabled for this Industry (the Industry that this Warehouse is for)
        this.smartSupplyEnabled = false;
        // Decide if smart supply should use the amount of materials imported into account when deciding on the amount to buy.
        this.smartSupplyOptions = (0, Record_1.createFullRecordFromEntries)(Constants_1.materialNames.map((matName) => [matName, "leftovers"]));
        // Stores the amount of product to be produced. Used for Smart Supply unlock.
        // The production tracked by smart supply is always based on the previous cycle,
        // so it will always trail the "true" production by 1 cycle
        this.smartSupplyStore = 0;
        const corp = _player_1.Player.corporation;
        if (!corp || params === null)
            return;
        this.city = params.loc;
        this.size = params.size;
        this.updateSize(corp, params.division);
        // Default smart supply to being enabled if the upgrade is unlocked
        if (corp.unlocks.has(_enums_1.CorpUnlockName.SmartSupply)) {
            this.smartSupplyEnabled = true;
        }
    }
    // Re-calculate how much space is being used by this Warehouse
    updateMaterialSizeUsed() {
        this.sizeUsed = 0;
        for (const [matName, mat] of (0, Record_1.getRecordEntries)(this.materials)) {
            this.sizeUsed += mat.stored * MaterialInfo_1.MaterialInfo[matName].size;
        }
        if (this.sizeUsed > this.size) {
            console.warn(`Warehouse size used greater than capacity, something went wrong. sizeUsed: ${this.sizeUsed}. size: ${this.size}`, this);
        }
    }
    updateSize(corporation, division) {
        this.size = this.level * 100 * corporation.getStorageMultiplier() * division.getStorageMultiplier();
    }
    // Serialize the current object to a JSON save state.
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("Warehouse", this);
    }
    // Initializes a Warehouse object from a JSON save state.
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(Warehouse, value.data);
    }
}
exports.Warehouse = Warehouse;
JSONReviver_1.constructorsForReviver.Warehouse = Warehouse;
