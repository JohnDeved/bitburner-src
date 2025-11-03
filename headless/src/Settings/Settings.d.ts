import { OwnedAugmentationsOrderSetting, PurchaseAugmentationsOrderSetting } from "./SettingEnums";
import { CursorStyle, CursorBlinking, WordWrapOptions } from "../ScriptEditor/ui/Options";
import { Result } from "../types";
import { type PlayerDefinedKeyBindingsType } from "../utils/KeyBindingUtils";
/**
 * This function won't be able to catch **all** invalid hostnames. In order to validate a hostname properly, we need to
 * import a good validation library or write one by ourselves. Considering that we only need to catch common mistakes,
 * it's not worth the effort.
 *
 * Some invalid hostnames that we don't catch:
 * - Invalid/missing TLD: "abc".
 * - Use space character: "a a.com"
 * - Use non-http schemes in the hostname: "ftp://a.com"
 * - etc.
 */
export declare function isValidConnectionHostname(hostname: string): Result;
export declare function isValidConnectionPort(port: number): Result;
/** The current options the player has customized to their play style. */
export declare const Settings: {
    /** How many servers per page */
    ActiveScriptsServerPageSize: number;
    /** How many scripts per page */
    ActiveScriptsScriptPageSize: number;
    /** Script + args to launch on game load */
    AutoexecScript: string;
    /** How often the game should autosave the player's progress, in seconds. */
    AutosaveInterval: number;
    /** Whether to render city as list of buttons. */
    DisableASCIIArt: boolean;
    /** Whether global keyboard shortcuts should be disabled throughout the game. */
    DisableHotkeys: boolean;
    /** Whether text effects such as corruption should be disabled. */
    DisableTextEffects: boolean;
    /** Whether overview progress bars should be visible. */
    DisableOverviewProgressBars: boolean;
    /** Whether to enable bash hotkeys */
    EnableBashHotkeys: boolean;
    /** Whether to enable terminal history search */
    EnableHistorySearch: boolean;
    /** Whether to show IPvGO in a traditional stone-and-shell-on-wood style, or the cyberpunk style */
    GoTraditionalStyle: boolean;
    /** Timestamps format string */
    TimestampsFormat: string;
    /** Locale used for display numbers. */
    Locale: string;
    /** Limit the number of recently killed script entries being tracked. */
    MaxRecentScriptsCapacity: number;
    /** Limit the number of log entries for each script being executed on each server. */
    MaxLogCapacity: number;
    /** Limit how many entries can be written to a Netscript Port before entries start to get pushed out. */
    MaxPortCapacity: number;
    /** Limit the number of entries in the terminal. */
    MaxTerminalCapacity: number;
    /** IP address the Remote File API client will try to connect to. Default localhost . */
    RemoteFileApiAddress: string;
    /** Port the Remote File API client will try to connect to. 0 to disable. */
    RemoteFileApiPort: number;
    /** Automatically reconnect to the Remote File API client after this delay. Set it 0 to disable. */
    RemoteFileApiReconnectionDelay: number;
    /** Use wss instead of ws when connecting to RFA clients */
    UseWssForRemoteFileApi: boolean;
    /** Whether to save the game when the player saves any file. */
    SaveGameOnFileSave: boolean;
    /** Whether to hide the confirmation dialog for augmentation purchases. */
    SuppressBuyAugmentationConfirmation: boolean;
    /** Whether to hide the info dialog for script errors. */
    SuppressErrorModals: boolean;
    /** Whether to hide the dialog showing new faction invites. */
    SuppressFactionInvites: boolean;
    /** Whether to hide the dialog when the player receives a new message file. */
    SuppressMessages: boolean;
    /** Whether to hide the confirmation dialog when the player attempts to travel between cities. */
    SuppressTravelConfirmation: boolean;
    /** Whether to hide the dialog when the player's Bladeburner actions are cancelled. */
    SuppressBladeburnerPopup: boolean;
    /** Whether to hide dialogs for stock market actions. */
    SuppressTIXPopup: boolean;
    /** Whether to hide the toast alert when the game is saved. */
    SuppressSavedGameToast: boolean;
    /** Whether to hide the toast warning when the autosave is disabled. */
    SuppressAutosaveDisabledWarnings: boolean;
    /** Whether to GiB instead of GB. */
    UseIEC60027_2: boolean;
    /** Whether to display intermediary time unit when their value is null */
    ShowMiddleNullTimeUnit: boolean;
    /** Whether the game should skip saving the running scripts to the save file. */
    ExcludeRunningScriptsFromSave: boolean;
    /**  Whether the game's sidebar is opened. */
    IsSidebarOpened: boolean;
    /** Tail rendering intervall in ms */
    TailRenderInterval: number;
    /** Theme colors. */
    theme: {
        primarylight: string;
        primary: string;
        primarydark: string;
        successlight: string;
        success: string;
        successdark: string;
        errorlight: string;
        error: string;
        errordark: string;
        secondarylight: string;
        secondary: string;
        secondarydark: string;
        warninglight: string;
        warning: string;
        warningdark: string;
        infolight: string;
        info: string;
        infodark: string;
        welllight: string;
        well: string;
        white: string;
        black: string;
        hp: string;
        money: string;
        hack: string;
        combat: string;
        cha: string;
        int: string;
        rep: string;
        disabled: string;
        backgroundprimary: string;
        backgroundsecondary: string;
        button: string;
        maplocation: string;
        bnlvl0: string;
        bnlvl1: string;
        bnlvl2: string;
        bnlvl3: string;
    };
    /** Interface styles. */
    styles: any;
    /** Character overview settings. */
    overview: {
        x: number;
        y: number;
        opened: boolean;
    };
    /**  Script editor theme data. */
    EditorTheme: {
        base: typeof import("../ScriptEditor/ui/themes").validEditorThemeBases[number];
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
    };
    /** Order to display the player's owned Augmentations/Source Files. */
    OwnedAugmentationsOrder: OwnedAugmentationsOrderSetting;
    /** What order the Augmentations should be displayed in when purchasing from a Faction. */
    PurchaseAugmentationsOrder: PurchaseAugmentationsOrderSetting;
    /** Script editor theme. */
    MonacoTheme: string;
    /** Whether to use spaces instead of tabs for indentation */
    MonacoInsertSpaces: boolean;
    /** Size of indentation */
    MonacoTabSize: number;
    /** Whether to auto detect indentation settings per-file based on contents */
    MonacoDetectIndentation: boolean;
    /** Font Family for script editor. */
    MonacoFontFamily: string;
    /** Text size for script editor. */
    MonacoFontSize: number;
    /** Whether to use font ligatures in the script editor */
    MonacoFontLigatures: boolean;
    /** Whether to use Vim mod by default in the script editor */
    MonacoDefaultToVim: boolean;
    /** Word wrap setting for Script Editor. */
    MonacoWordWrap: WordWrapOptions;
    /** Whether to run Beautify code formatter on save */
    MonacoBeautifyOnSave: boolean;
    /** Control the cursor style*/
    MonacoCursorStyle: CursorStyle;
    /** Control the cursor animation style */
    MonacoCursorBlinking: CursorBlinking;
    /** Whether to hide trailing zeroes on fractional part of decimal */
    hideTrailingDecimalZeros: boolean;
    /** Whether to hide thousands separators. */
    hideThousandsSeparator: boolean;
    /** Whether to use engineering notation instead of scientific for exponential form. */
    useEngineeringNotation: boolean;
    /** Whether to disable suffixes and always use exponential form (scientific or engineering). */
    disableSuffixes: boolean;
    /**
     * Player-defined key bindings. Don't use this property directly. It must be merged with DefaultKeyBindings in
     * src\utils\KeyBindingUtils.ts.
     */
    KeyBindings: PlayerDefinedKeyBindingsType;
    /** Whether to sync Steam achievements */
    SyncSteamAchievements: boolean;
    load(saveString: string): void;
};
