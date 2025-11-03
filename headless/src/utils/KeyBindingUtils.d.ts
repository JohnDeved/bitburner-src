import { PartialRecord } from "../Types/Record";
import { ComplexPage, SimplePage } from "../ui/Enums";
import { EventEmitter } from "./EventEmitter";
export declare enum ScriptEditorAction {
    Save = "ScriptEditor-Save",
    GoToTerminal = "ScriptEditor-GoToTerminal",
    Run = "ScriptEditor-Run"
}
export declare const SpoilerKeyBindingTypes: readonly [SimplePage.StaneksGift, SimplePage.Sleeves, SimplePage.Grafting, SimplePage.Bladeburner, SimplePage.Corporation, SimplePage.Gang];
export declare const GoToPageKeyBindingTypes: readonly [SimplePage.Terminal, ComplexPage.ScriptEditor, SimplePage.ActiveScripts, SimplePage.CreateProgram, SimplePage.Stats, SimplePage.Factions, SimplePage.Augmentations, SimplePage.Hacknet, SimplePage.City, SimplePage.Travel, SimplePage.Job, SimplePage.StockMarket, SimplePage.Go, SimplePage.Milestones, ComplexPage.Documentation, SimplePage.Achievements, SimplePage.Options, SimplePage.StaneksGift, SimplePage.Sleeves, SimplePage.Grafting, SimplePage.Bladeburner, SimplePage.Corporation, SimplePage.Gang];
export declare const ScriptEditorActionBindingTypes: ScriptEditorAction[];
export declare const KeyBindingTypes: readonly [SimplePage.Terminal, ComplexPage.ScriptEditor, SimplePage.ActiveScripts, SimplePage.CreateProgram, SimplePage.Stats, SimplePage.Factions, SimplePage.Augmentations, SimplePage.Hacknet, SimplePage.City, SimplePage.Travel, SimplePage.Job, SimplePage.StockMarket, SimplePage.Go, SimplePage.Milestones, ComplexPage.Documentation, SimplePage.Achievements, SimplePage.Options, SimplePage.StaneksGift, SimplePage.Sleeves, SimplePage.Grafting, SimplePage.Bladeburner, SimplePage.Corporation, SimplePage.Gang, ...ScriptEditorAction[]];
export type GoToPageKeyBindingType = (typeof GoToPageKeyBindingTypes)[number];
export type ScriptEditorActionBindingType = (typeof ScriptEditorActionBindingTypes)[number];
export type KeyBindingType = (typeof KeyBindingTypes)[number];
export type KeyCombination = {
    control: boolean;
    alt: boolean;
    shift: boolean;
    meta: boolean;
    key: string;
};
export type PlayerDefinedKeyBindingsType = PartialRecord<KeyBindingType, [
    KeyCombination | null,
    KeyCombination | null
]>;
export declare const DefaultKeyBindings: Record<KeyBindingType, [KeyCombination | null, KeyCombination | null]>;
export declare const CurrentKeyBindings: Record<SimplePage.ActiveScripts | SimplePage.Augmentations | SimplePage.Bladeburner | SimplePage.City | SimplePage.Corporation | SimplePage.CreateProgram | SimplePage.Factions | SimplePage.Gang | SimplePage.Go | SimplePage.Hacknet | SimplePage.Milestones | SimplePage.Options | SimplePage.Grafting | SimplePage.Sleeves | SimplePage.Stats | SimplePage.StockMarket | SimplePage.Terminal | SimplePage.Travel | SimplePage.Job | SimplePage.StaneksGift | SimplePage.Achievements | ComplexPage.ScriptEditor | ComplexPage.Documentation | ScriptEditorAction, [KeyCombination, KeyCombination]>;
/**
 * In order to avoid a circular dependency, do not use Settings.KeyBindings directly in this function. We need to pass
 * it as a parameter.
 */
export declare function mergePlayerDefinedKeyBindings(bindings: PlayerDefinedKeyBindingsType): void;
export declare function areDifferentKeyCombinations(combination1: KeyCombination, combination2: KeyCombination): boolean;
export declare function parseKeyCombinationToString(keyCombination: KeyCombination | null): string;
export declare function parseKeyCombinationsToString(keyCombinations: (KeyCombination | null)[]): string;
export declare function getKeyCombination(keyBindings: typeof DefaultKeyBindings, keyBindingType: KeyBindingType, isPrimary: boolean): KeyCombination | null;
export declare function convertKeyboardEventToKeyCombination(event: KeyboardEvent): KeyCombination;
export declare function determineKeyBindingTypes(keyBindings: typeof DefaultKeyBindings, keyCombination: KeyCombination): Set<KeyBindingType>;
export declare function isKeyCombinationPressed(keyCombination: KeyCombination, requiredCombination: {
    control?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
    key: string;
}): boolean;
/**
 * This function can be called in situations that the parameter is a string, not just KeyBindingType.
 */
export declare function isSpoilerKeyBindingType(keyBindingType: string): boolean;
export declare enum KeyBindingEventType {
    StartSettingUp = 0,
    StopSettingUp = 1
}
export declare const KeyBindingEvents: EventEmitter<[KeyBindingEventType]>;
