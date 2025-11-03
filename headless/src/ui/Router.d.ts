import type { ScriptFilePath } from "../Paths/ScriptFilePath";
import type { TextFilePath } from "../Paths/TextFilePath";
import type { Faction } from "../Faction/Faction";
import type { Location } from "../Locations/Location";
import type { SaveData } from "../types";
import { ComplexPage, SimplePage } from "./Enums";
export type Page = SimplePage | ComplexPage;
export declare const Page: {
    BitVerse: ComplexPage.BitVerse;
    Infiltration: ComplexPage.Infiltration;
    Faction: ComplexPage.Faction;
    FactionAugmentations: ComplexPage.FactionAugmentations;
    ScriptEditor: ComplexPage.ScriptEditor;
    Location: ComplexPage.Location;
    ImportSave: ComplexPage.ImportSave;
    Documentation: ComplexPage.Documentation;
    LoadingScreen: ComplexPage.LoadingScreen;
    ActiveScripts: SimplePage.ActiveScripts;
    RecentlyKilledScripts: SimplePage.RecentlyKilledScripts;
    RecentErrors: SimplePage.RecentErrors;
    Augmentations: SimplePage.Augmentations;
    Bladeburner: SimplePage.Bladeburner;
    City: SimplePage.City;
    Corporation: SimplePage.Corporation;
    CreateProgram: SimplePage.CreateProgram;
    DevMenu: SimplePage.DevMenu;
    Factions: SimplePage.Factions;
    Gang: SimplePage.Gang;
    Go: SimplePage.Go;
    Hacknet: SimplePage.Hacknet;
    Milestones: SimplePage.Milestones;
    Options: SimplePage.Options;
    Grafting: SimplePage.Grafting;
    Sleeves: SimplePage.Sleeves;
    Stats: SimplePage.Stats;
    StockMarket: SimplePage.StockMarket;
    Terminal: SimplePage.Terminal;
    Travel: SimplePage.Travel;
    Job: SimplePage.Job;
    Work: SimplePage.Work;
    BladeburnerCinematic: SimplePage.BladeburnerCinematic;
    Loading: SimplePage.Loading;
    StaneksGift: SimplePage.StaneksGift;
    Recovery: SimplePage.Recovery;
    Achievements: SimplePage.Achievements;
    ThemeBrowser: SimplePage.ThemeBrowser;
};
export type PageContext<T extends Page> = T extends ComplexPage.BitVerse ? {
    flume: boolean;
    quick: boolean;
} : T extends ComplexPage.Infiltration ? {
    location: Location;
} : T extends ComplexPage.Faction ? {
    faction: Faction;
} : T extends ComplexPage.FactionAugmentations ? {
    faction: Faction;
} : T extends ComplexPage.ScriptEditor ? {
    files?: Map<ScriptFilePath | TextFilePath, string>;
    options?: ScriptEditorRouteOptions;
} : T extends ComplexPage.Location ? {
    location: Location;
} : T extends ComplexPage.ImportSave ? {
    saveData: SaveData;
    automatic?: boolean;
} : T extends ComplexPage.Documentation ? {
    docPage?: string;
} : never;
export type PageWithContext = ({
    page: ComplexPage.BitVerse;
} & PageContext<ComplexPage.BitVerse>) | ({
    page: ComplexPage.Infiltration;
} & PageContext<ComplexPage.Infiltration>) | ({
    page: ComplexPage.Faction;
} & PageContext<ComplexPage.Faction>) | ({
    page: ComplexPage.FactionAugmentations;
} & PageContext<ComplexPage.FactionAugmentations>) | ({
    page: ComplexPage.ScriptEditor;
} & PageContext<ComplexPage.ScriptEditor>) | ({
    page: ComplexPage.Location;
} & PageContext<ComplexPage.Location>) | ({
    page: ComplexPage.ImportSave;
} & PageContext<ComplexPage.ImportSave>) | ({
    page: ComplexPage.Documentation;
} & PageContext<ComplexPage.Documentation>) | {
    page: ComplexPage.LoadingScreen;
} | {
    page: SimplePage;
};
export interface ScriptEditorRouteOptions {
    vim: boolean;
    hostname?: string;
}
/** The router keeps track of player navigation/routing within the game. */
export interface IRouter {
    page(): Page;
    allowRouting(value: boolean): void;
    /** If messages/toasts are hidden on this page */
    hidingMessages(): boolean;
    toPage(page: SimplePage): void;
    toPage<T extends ComplexPage>(page: T, context: PageContext<T>): void;
    /** go to a preveious page (if any) */
    back(): void;
}
export declare const isSimplePage: (page: Page) => page is SimplePage;
