"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplexPage = exports.SimplePage = exports.ToastVariant = void 0;
var ToastVariant;
(function (ToastVariant) {
    ToastVariant["SUCCESS"] = "success";
    ToastVariant["WARNING"] = "warning";
    ToastVariant["ERROR"] = "error";
    ToastVariant["INFO"] = "info";
})(ToastVariant || (exports.ToastVariant = ToastVariant = {}));
// This enum doesn't need enum helper support for now
/**
 * The full-screen page the player is currently be on.
 * These are "simple" pages that don't require any extra parameters to
 * transition to. You can use setPage() with these.
 */
var SimplePage;
(function (SimplePage) {
    SimplePage["ActiveScripts"] = "Active Scripts";
    SimplePage["RecentlyKilledScripts"] = "Recently Killed Scripts";
    SimplePage["RecentErrors"] = "Recent Errors";
    SimplePage["Augmentations"] = "Augmentations";
    SimplePage["Bladeburner"] = "Bladeburner";
    SimplePage["City"] = "City";
    SimplePage["Corporation"] = "Corporation";
    SimplePage["CreateProgram"] = "Create Program";
    SimplePage["DevMenu"] = "Dev";
    SimplePage["Factions"] = "Factions";
    SimplePage["Gang"] = "Gang";
    SimplePage["Go"] = "IPvGO Subnet";
    SimplePage["Hacknet"] = "Hacknet";
    SimplePage["Milestones"] = "Milestones";
    SimplePage["Options"] = "Options";
    SimplePage["Grafting"] = "Grafting";
    SimplePage["Sleeves"] = "Sleeves";
    SimplePage["Stats"] = "Stats";
    SimplePage["StockMarket"] = "Stock Market";
    SimplePage["Terminal"] = "Terminal";
    SimplePage["Travel"] = "Travel";
    SimplePage["Job"] = "Job";
    SimplePage["Work"] = "Work";
    SimplePage["BladeburnerCinematic"] = "Bladeburner Cinematic";
    SimplePage["Loading"] = "Loading";
    SimplePage["StaneksGift"] = "Stanek's Gift";
    SimplePage["Recovery"] = "Recovery";
    SimplePage["Achievements"] = "Achievements";
    SimplePage["ThemeBrowser"] = "Theme Browser";
})(SimplePage || (exports.SimplePage = SimplePage = {}));
var ComplexPage;
(function (ComplexPage) {
    ComplexPage["BitVerse"] = "BitVerse";
    ComplexPage["Infiltration"] = "Infiltration";
    ComplexPage["Faction"] = "Faction";
    ComplexPage["FactionAugmentations"] = "Faction Augmentations";
    ComplexPage["ScriptEditor"] = "Script Editor";
    ComplexPage["Location"] = "Location";
    ComplexPage["ImportSave"] = "Import Save";
    ComplexPage["Documentation"] = "Documentation";
    ComplexPage["LoadingScreen"] = "Loading Screen";
})(ComplexPage || (exports.ComplexPage = ComplexPage = {}));
