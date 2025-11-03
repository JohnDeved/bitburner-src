import { CityName, LocationName, LocationType } from "@enums";
interface IInfiltrationMetadata {
    maxClearanceLevel: number;
    startingSecurityLevel: number;
}
export interface IConstructorParams {
    city?: CityName | null;
    costMult?: number;
    expMult?: number;
    infiltrationData?: IInfiltrationMetadata;
    name?: LocationName;
    types?: LocationType[];
    techVendorMaxRam?: number;
    techVendorMinRam?: number;
}
/** Class representing a visitable location in the world */
export declare class Location {
    /**
     * Name of city this location is in. If this property is null, it means this
     * is a generic location that is available in all cities
     */
    city: CityName | null;
    /** Cost multiplier that influences how expensive a gym/university is */
    costMult: number;
    /** Exp multiplier that influences how effective a gym/university is */
    expMult: number;
    /**
     * Companies can be infiltrated. This contains the data required for that
     * infiltration event
     */
    infiltrationData?: IInfiltrationMetadata;
    /** Identifier for location */
    name: LocationName;
    /**
     * List of what type(s) this location is. A location can be multiple types
     * (e.g. company and tech vendor)
     */
    types: LocationType[];
    /**
     * Tech vendors allow you to purchase servers.
     * This property defines the max RAM server you can purchase from this vendor
     */
    techVendorMaxRam: number;
    /**
     * Tech vendors allow you to purchase servers.
     * This property defines the max RAM server you can purchase from this vendor
     */
    techVendorMinRam: number;
    constructor(p: IConstructorParams);
}
export {};
