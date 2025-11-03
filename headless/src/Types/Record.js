"use strict";
// Some extra utility to make Records with strongly typed keys (e.g enum member keys) simpler to work with in TS.
// Using maps instead of plain objects is another option, but maps require an extra step to convert to/from JSON
// So they should not be overused.
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPartialRecordFromEntries = exports.createFullRecordFromEntries = exports.getRecordEntries = exports.getRecordKeys = exports.getRecordValues = void 0;
exports.createEnumKeyedRecord = createEnumKeyedRecord;
/** Get values from a partial record with proper type */
exports.getRecordValues = Object.values;
/** Get a keys array with proper type. Object.keys by default returns string[] */
exports.getRecordKeys = Object.keys;
/** Get an entries array with properly typed keys. Object.entries by default represents keys as string */
exports.getRecordEntries = Object.entries;
/** Use this function only when entries is guaranteed to contain all members of K,
 * e.g. when it's an array from mapping the enum values, or the keys from a different full record.
 * If not all members of type K are used, use createPartialRecordFromEntries instead. */
exports.createFullRecordFromEntries = Object.fromEntries;
/** Create a correctly typed object from entries with strongly typed keys.
 * This is safe to use even if not all members of type K are present in the entries.
 * If all members of K are guaranteed to be present, see createFullRecordFromEntries. */
exports.createPartialRecordFromEntries = Object.fromEntries;
/** Create a correctly-typed full record keyed by an enum with values based on a value function
 * @param enumObj The enum object
 * @param valueFunction The function which will produce the value, taking in the key as a parameter */
function createEnumKeyedRecord(enumObj, valueFunction) {
    return (0, exports.createFullRecordFromEntries)(Object.values(enumObj).map((member) => [member, valueFunction(member)]));
}
