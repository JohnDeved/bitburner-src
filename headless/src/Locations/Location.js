"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = void 0;
const _enums_1 = require("@enums");
/** Class representing a visitable location in the world */
class Location {
    constructor(p) {
        /**
         * Name of city this location is in. If this property is null, it means this
         * is a generic location that is available in all cities
         */
        this.city = null;
        /** Cost multiplier that influences how expensive a gym/university is */
        this.costMult = 0;
        /** Exp multiplier that influences how effective a gym/university is */
        this.expMult = 0;
        /** Identifier for location */
        this.name = _enums_1.LocationName.Void;
        /**
         * List of what type(s) this location is. A location can be multiple types
         * (e.g. company and tech vendor)
         */
        this.types = [];
        /**
         * Tech vendors allow you to purchase servers.
         * This property defines the max RAM server you can purchase from this vendor
         */
        this.techVendorMaxRam = 0;
        /**
         * Tech vendors allow you to purchase servers.
         * This property defines the max RAM server you can purchase from this vendor
         */
        this.techVendorMinRam = 0;
        if (p.city) {
            this.city = p.city;
        }
        if (p.costMult) {
            this.costMult = p.costMult;
        }
        if (p.expMult) {
            this.expMult = p.expMult;
        }
        if (p.infiltrationData) {
            this.infiltrationData = p.infiltrationData;
        }
        if (p.name) {
            this.name = p.name;
        }
        if (p.types) {
            this.types = p.types;
        }
        if (p.techVendorMaxRam) {
            this.techVendorMaxRam = p.techVendorMaxRam;
        }
        if (p.techVendorMinRam) {
            this.techVendorMinRam = p.techVendorMinRam;
        }
    }
}
exports.Location = Location;
