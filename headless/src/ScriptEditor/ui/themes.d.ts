import type { editor } from "monaco-editor";
type DefineThemeFn = typeof editor.defineTheme;
export declare const validEditorThemeBases: readonly ["vs", "vs-dark", "hc-black", "hc-light"];
/**
 * If we change this interface, we must change EditorThemeSchema.
 */
export interface IScriptEditorTheme {
    base: (typeof validEditorThemeBases)[number];
    inherit: boolean;
    common: {
        accent: string;
        bg: string;
        fg: string;
    };
    syntax: {
        tag: string;
        entity: string;
        string: string;
        regexp: string;
        markup: string;
        keyword: string;
        comment: string;
        constant: string;
        error: string;
    };
    ui: {
        line: string;
        panel: {
            bg: string;
            selected: string;
            border: string;
        };
        selection: {
            bg: string;
        };
    };
}
export declare const defaultMonacoTheme: IScriptEditorTheme;
export declare function makeTheme(theme: IScriptEditorTheme): editor.IStandaloneThemeData;
export declare function loadThemes(defineTheme: DefineThemeFn): void;
export {};
