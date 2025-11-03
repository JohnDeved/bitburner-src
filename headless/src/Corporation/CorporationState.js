"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorporationState = void 0;
const JSONReviver_1 = require("../utils/JSONReviver");
const Constants_1 = require("./data/Constants");
class CorporationState {
    constructor() {
        // Number representing what state the Corporation is in. The number
        // is an index for the array that holds all Corporation States
        this.state = 0;
    }
    // Get the name of the current state
    // NOTE: This does NOT return the number stored in the 'state' property,
    // which is just an index for the array of all possible Corporation States.
    get nextName() {
        return Constants_1.stateNames[this.state];
    }
    get prevName() {
        return Constants_1.stateNames[(this.state + (Constants_1.stateNames.length - 1)) % Constants_1.stateNames.length];
    }
    // Transition to the next state
    incrementState() {
        this.state = (this.state + 1) % Constants_1.stateNames.length;
    }
    // Serialize the current object to a JSON save state.
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("CorporationState", this);
    }
    // Initializes a CorporationState object from a JSON save state.
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(CorporationState, value.data);
    }
}
exports.CorporationState = CorporationState;
JSONReviver_1.constructorsForReviver.CorporationState = CorporationState;
