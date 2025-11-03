import { LocationName, CityName } from "@enums";
/** Class representing a City in the game */
export declare class City {
    /** List of all locations in this city */
    locations: LocationName[];
    /** Name of this city */
    name: CityName;
    /** Metro map ascii art */
    asciiArt: string;
    constructor(name: CityName, locations?: LocationName[], asciiArt?: string);
    addLocation(loc: LocationName): void;
}
