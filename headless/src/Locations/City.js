"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.City = void 0;
/** Class representing a City in the game */
class City {
    constructor(name, locations = [], asciiArt = "") {
        this.name = name;
        this.locations = locations;
        this.asciiArt = asciiArt;
    }
    addLocation(loc) {
        this.locations.push(loc);
    }
}
exports.City = City;
