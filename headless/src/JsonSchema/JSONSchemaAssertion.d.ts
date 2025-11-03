import type { IStyleSettings } from "../ScriptEditor/NetscriptDefinitions";
import type { IScriptEditorTheme } from "../ScriptEditor/ui/themes";
import type { ITheme } from "../Themes/Themes";
import { DefaultKeyBindings } from "../utils/KeyBindingUtils";
/**
 * This function validates the unknown data and removes properties not defined in MainThemeSchema.
 */
export declare function assertAndSanitizeMainTheme(data: unknown): asserts data is ITheme;
/**
 * This function validates the unknown data and removes properties not defined in EditorThemeSchema.
 */
export declare function assertAndSanitizeEditorTheme(data: unknown): asserts data is IScriptEditorTheme;
/**
 * This function validates the unknown data and removes properties not defined in StylesSchema.
 */
export declare function assertAndSanitizeStyles(data: unknown): asserts data is IStyleSettings;
/**
 * This function validates the unknown data and removes properties not defined in KeyBindingsSchema.
 */
export declare function assertAndSanitizeKeyBindings(data: unknown): asserts data is typeof DefaultKeyBindings;
