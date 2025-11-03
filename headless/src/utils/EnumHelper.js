"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMember = exports.getEnumHelper = void 0;
const allEnums = __importStar(require("../Enums"));
const TypeAssertion_1 = require("../Netscript/TypeAssertion");
const ErrorMessages_1 = require("../Netscript/ErrorMessages");
const getRandomIntInclusive_1 = require("./helpers/getRandomIntInclusive");
const Record_1 = require("../Types/Record");
class EnumHelper {
    constructor(obj, name) {
        this.name = name;
        this.defaultArgName = name.charAt(0).toLowerCase() + name.slice(1);
        this.valueArray = (0, Record_1.getRecordValues)(obj);
        this.valueSet = new Set(this.valueArray);
        this.fuzzMap = new Map(this.valueArray.map((val) => [val.toLowerCase().replace(/[ -]+/g, ""), val]));
    }
    /** Provide a boolean indication for whether a value is a member of an enum */
    isMember(toValidate) {
        // Asserting that Set.has actually takes in arbitrary values, which it does.
        return this.valueSet.has(toValidate);
    }
    /** Take an unknown input from a player script, either return an enum member or throw */
    nsGetMember(ctx, toValidate, argName = this.defaultArgName, options) {
        const match = this.getMember(toValidate, options);
        if (match)
            return match;
        // No match found, create error message
        (0, TypeAssertion_1.assertStringWithNSContext)(ctx, argName, toValidate);
        let allowableValues = `Allowable values: ${this.valueArray.map((val) => `"${val}"`).join(", ")}`;
        // Don't display all possibilities for large enums
        if (this.valueArray.length > 10) {
            console.warn(`Provided value ${toValidate} was not a valid option for enum type ${this.name}.\n${allowableValues}`);
            allowableValues = `See the developer console for allowable values.`;
        }
        throw (0, ErrorMessages_1.errorMessage)(ctx, `Argument ${argName} should be a ${this.name} enum member.\nProvided value: "${toValidate}".\n${allowableValues}`);
    }
    getMember(input, options) {
        if (this.isMember(input))
            return input;
        if (typeof input !== "string")
            return options?.alwaysMatch ? this.valueArray[0] : undefined;
        if (options?.fuzzy || options?.alwaysMatch) {
            const fuzzMatch = this.fuzzMap.get(input.toLowerCase().replace(/[ -]+/g, ""));
            if (fuzzMatch)
                return fuzzMatch;
        }
        return undefined;
    }
    // Get a random enum member
    random() {
        const index = (0, getRandomIntInclusive_1.getRandomIntInclusive)(0, this.valueArray.length - 1);
        return this.valueArray[index];
    }
}
const enumHelpers = new Map();
// Ensure all enums get helpers assigned to them.
Object.entries(allEnums).forEach(([enumName, enumObj]) => {
    enumHelpers.set(enumName, new EnumHelper(enumObj, enumName));
});
// This function is just adding types to enumHelpers.get, and is all that gets exposed for use in other files.
exports.getEnumHelper = enumHelpers.get.bind(enumHelpers);
const isMember = (name, value) => (0, exports.getEnumHelper)(name).isMember(value);
exports.isMember = isMember;
