"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyBindingEvents = exports.KeyBindingEventType = exports.CurrentKeyBindings = exports.DefaultKeyBindings = exports.KeyBindingTypes = exports.ScriptEditorActionBindingTypes = exports.GoToPageKeyBindingTypes = exports.SpoilerKeyBindingTypes = exports.ScriptEditorAction = void 0;
exports.mergePlayerDefinedKeyBindings = mergePlayerDefinedKeyBindings;
exports.areDifferentKeyCombinations = areDifferentKeyCombinations;
exports.parseKeyCombinationToString = parseKeyCombinationToString;
exports.parseKeyCombinationsToString = parseKeyCombinationsToString;
exports.getKeyCombination = getKeyCombination;
exports.convertKeyboardEventToKeyCombination = convertKeyboardEventToKeyCombination;
exports.determineKeyBindingTypes = determineKeyBindingTypes;
exports.isKeyCombinationPressed = isKeyCombinationPressed;
exports.isSpoilerKeyBindingType = isSpoilerKeyBindingType;
const Record_1 = require("../Types/Record");
const Enums_1 = require("../ui/Enums");
const EventEmitter_1 = require("./EventEmitter");
const KeyboardEventKey_1 = require("./KeyboardEventKey");
var ScriptEditorAction;
(function (ScriptEditorAction) {
    ScriptEditorAction["Save"] = "ScriptEditor-Save";
    ScriptEditorAction["GoToTerminal"] = "ScriptEditor-GoToTerminal";
    ScriptEditorAction["Run"] = "ScriptEditor-Run";
})(ScriptEditorAction || (exports.ScriptEditorAction = ScriptEditorAction = {}));
exports.SpoilerKeyBindingTypes = [
    Enums_1.SimplePage.StaneksGift,
    Enums_1.SimplePage.Sleeves,
    Enums_1.SimplePage.Grafting,
    Enums_1.SimplePage.Bladeburner,
    Enums_1.SimplePage.Corporation,
    Enums_1.SimplePage.Gang,
];
exports.GoToPageKeyBindingTypes = [
    Enums_1.SimplePage.Terminal,
    Enums_1.ComplexPage.ScriptEditor,
    Enums_1.SimplePage.ActiveScripts,
    Enums_1.SimplePage.CreateProgram,
    Enums_1.SimplePage.Stats,
    Enums_1.SimplePage.Factions,
    Enums_1.SimplePage.Augmentations,
    Enums_1.SimplePage.Hacknet,
    Enums_1.SimplePage.City,
    Enums_1.SimplePage.Travel,
    Enums_1.SimplePage.Job,
    Enums_1.SimplePage.StockMarket,
    Enums_1.SimplePage.Go,
    Enums_1.SimplePage.Milestones,
    Enums_1.ComplexPage.Documentation,
    Enums_1.SimplePage.Achievements,
    Enums_1.SimplePage.Options,
    ...exports.SpoilerKeyBindingTypes,
];
exports.ScriptEditorActionBindingTypes = [ScriptEditorAction.Save, ScriptEditorAction.GoToTerminal];
exports.KeyBindingTypes = [...exports.GoToPageKeyBindingTypes, ...exports.ScriptEditorActionBindingTypes];
exports.DefaultKeyBindings = {
    [Enums_1.SimplePage.Terminal]: [
        {
            control: false,
            alt: true,
            shift: false,
            meta: false,
            key: "T",
        },
        null,
    ],
    [Enums_1.ComplexPage.ScriptEditor]: [
        {
            control: false,
            alt: true,
            shift: false,
            meta: false,
            key: "E",
        },
        null,
    ],
    [Enums_1.SimplePage.ActiveScripts]: [
        {
            control: false,
            alt: true,
            shift: false,
            meta: false,
            key: "S",
        },
        null,
    ],
    [Enums_1.SimplePage.CreateProgram]: [
        {
            control: false,
            alt: true,
            shift: false,
            meta: false,
            key: "P",
        },
        null,
    ],
    [Enums_1.SimplePage.StaneksGift]: [null, null],
    [Enums_1.SimplePage.Stats]: [
        {
            control: false,
            alt: true,
            shift: false,
            meta: false,
            key: "C",
        },
        null,
    ],
    [Enums_1.SimplePage.Factions]: [
        {
            control: false,
            alt: true,
            shift: false,
            meta: false,
            key: "F",
        },
        null,
    ],
    [Enums_1.SimplePage.Augmentations]: [
        {
            control: false,
            alt: true,
            shift: false,
            meta: false,
            key: "A",
        },
        null,
    ],
    [Enums_1.SimplePage.Hacknet]: [
        {
            control: false,
            alt: true,
            shift: false,
            meta: false,
            key: "H",
        },
        null,
    ],
    [Enums_1.SimplePage.Sleeves]: [null, null],
    [Enums_1.SimplePage.Grafting]: [null, null],
    [Enums_1.SimplePage.City]: [
        {
            control: false,
            alt: true,
            shift: false,
            meta: false,
            key: "W",
        },
        null,
    ],
    [Enums_1.SimplePage.Travel]: [
        {
            control: false,
            alt: true,
            shift: false,
            meta: false,
            key: "R",
        },
        null,
    ],
    [Enums_1.SimplePage.Job]: [
        {
            control: false,
            alt: true,
            shift: false,
            meta: false,
            key: "J",
        },
        null,
    ],
    [Enums_1.SimplePage.StockMarket]: [null, null],
    [Enums_1.SimplePage.Bladeburner]: [
        {
            control: false,
            alt: true,
            shift: false,
            meta: false,
            key: "B",
        },
        null,
    ],
    [Enums_1.SimplePage.Corporation]: [null, null],
    [Enums_1.SimplePage.Gang]: [
        {
            control: false,
            alt: true,
            shift: false,
            meta: false,
            key: "G",
        },
        null,
    ],
    [Enums_1.SimplePage.Go]: [null, null],
    [Enums_1.SimplePage.Milestones]: [null, null],
    [Enums_1.ComplexPage.Documentation]: [
        {
            control: false,
            alt: true,
            shift: false,
            meta: false,
            key: "U",
        },
        null,
    ],
    [Enums_1.SimplePage.Achievements]: [null, null],
    [Enums_1.SimplePage.Options]: [
        {
            control: false,
            alt: true,
            shift: false,
            meta: false,
            key: "O",
        },
        null,
    ],
    [ScriptEditorAction.Save]: [
        {
            control: true,
            alt: false,
            shift: false,
            meta: false,
            key: "S",
        },
        {
            control: false,
            alt: false,
            shift: false,
            meta: true,
            key: "S",
        },
    ],
    [ScriptEditorAction.GoToTerminal]: [
        {
            control: true,
            alt: false,
            shift: false,
            meta: false,
            key: "B",
        },
        {
            control: false,
            alt: false,
            shift: false,
            meta: true,
            key: "B",
        },
    ],
    [ScriptEditorAction.Run]: [
        {
            control: true,
            alt: false,
            shift: false,
            meta: false,
            key: "Q",
        },
        null,
    ],
};
// This is the set of key bindings merged from DefaultKeyBindings and Settings.KeyBindings.
exports.CurrentKeyBindings = structuredClone(exports.DefaultKeyBindings);
/**
 * In order to avoid a circular dependency, do not use Settings.KeyBindings directly in this function. We need to pass
 * it as a parameter.
 */
function mergePlayerDefinedKeyBindings(bindings) {
    for (const [action, keyCombinations] of (0, Record_1.getRecordEntries)(bindings)) {
        exports.CurrentKeyBindings[action][0] = keyCombinations[0];
        exports.CurrentKeyBindings[action][1] = keyCombinations[1];
    }
}
function areDifferentKeyCombinations(combination1, combination2) {
    return (combination1.control !== combination2.control ||
        combination1.alt !== combination2.alt ||
        combination1.shift !== combination2.shift ||
        combination1.meta !== combination2.meta ||
        combination1.key !== combination2.key);
}
function parseKeyCombinationToString(keyCombination) {
    if (!keyCombination) {
        return "";
    }
    let result = "";
    if (keyCombination.control) {
        result += "Ctrl + ";
    }
    if (keyCombination.alt) {
        if (window.navigator.userAgent.includes("Mac")) {
            result += "Option + ";
        }
        else {
            result += "Alt + ";
        }
    }
    if (keyCombination.shift) {
        result += "Shift + ";
    }
    if (keyCombination.meta) {
        if (window.navigator.userAgent.includes("Mac")) {
            result += "⌘ + ";
        }
        else {
            // Most non-Apple keyboards print a form of Windows icon on the key cap of the "meta" key.
            result += "⊞ + ";
        }
    }
    if (keyCombination.key === KeyboardEventKey_1.KEY.SPACE) {
        result += "Space";
    }
    else {
        result += keyCombination.key;
    }
    return result;
}
function parseKeyCombinationsToString(keyCombinations) {
    let result = "";
    for (const keyCombination of keyCombinations) {
        if (!keyCombination) {
            continue;
        }
        result += ` or ${parseKeyCombinationToString(keyCombination)}`;
    }
    if (result.startsWith(" or ")) {
        return result.substring(4);
    }
    return result;
}
function getKeyCombination(keyBindings, keyBindingType, isPrimary) {
    return keyBindings[keyBindingType][isPrimary ? 0 : 1];
}
function convertKeyboardEventToKeyCombination(event) {
    return {
        control: event.ctrlKey,
        alt: event.altKey,
        shift: event.shiftKey,
        meta: event.metaKey,
        /**
         * Use uppercase to avoid the problem of Caps Lock key. For example, if the player presses Alt+t when Caps Lock is
         * on, event.key will be "T", not "t".
         */
        key: event.key.toUpperCase(),
    };
}
function determineKeyBindingTypes(keyBindings, keyCombination) {
    const result = new Set();
    for (const [keyBindingType, combinations] of (0, Record_1.getRecordEntries)(keyBindings)) {
        for (const combination of combinations) {
            if (!combination ||
                combination.control !== keyCombination.control ||
                combination.alt !== keyCombination.alt ||
                combination.shift !== keyCombination.shift ||
                combination.meta !== keyCombination.meta ||
                combination.key !== keyCombination.key) {
                continue;
            }
            result.add(keyBindingType);
        }
    }
    return result;
}
function isKeyCombinationPressed(keyCombination, requiredCombination) {
    for (const key of ["control", "alt", "shift", "meta"]) {
        if (requiredCombination[key] === undefined) {
            requiredCombination[key] = false;
        }
    }
    return (requiredCombination.control === keyCombination.control &&
        requiredCombination.alt === keyCombination.alt &&
        requiredCombination.shift === keyCombination.shift &&
        requiredCombination.meta === keyCombination.meta &&
        requiredCombination.key === keyCombination.key);
}
/**
 * This function can be called in situations that the parameter is a string, not just KeyBindingType.
 */
function isSpoilerKeyBindingType(keyBindingType) {
    return exports.SpoilerKeyBindingTypes.some((value) => value === keyBindingType);
}
var KeyBindingEventType;
(function (KeyBindingEventType) {
    KeyBindingEventType[KeyBindingEventType["StartSettingUp"] = 0] = "StartSettingUp";
    KeyBindingEventType[KeyBindingEventType["StopSettingUp"] = 1] = "StopSettingUp";
})(KeyBindingEventType || (exports.KeyBindingEventType = KeyBindingEventType = {}));
exports.KeyBindingEvents = new EventEmitter_1.EventEmitter();
