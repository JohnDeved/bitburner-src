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
exports.saveObject = void 0;
exports.loadGame = loadGame;
const Alias_1 = require("./Alias");
const Companies_1 = require("./Company/Companies");
const Constants_1 = require("./Constants");
const Factions_1 = require("./Faction/Factions");
const AllGangs_1 = require("./Gang/AllGangs");
const Player_1 = require("./Player");
const AllServers_1 = require("./Server/AllServers");
const Settings_1 = require("./Settings/Settings");
const StockMarket_1 = require("./StockMarket/StockMarket");
const Helper_1 = require("./CotMG/Helper");
const Snackbar_1 = require("./ui/React/Snackbar");
const ExportBonus = __importStar(require("./ExportBonus"));
const DialogBox_1 = require("./ui/React/DialogBox");
const JSONReviver_1 = require("./utils/JSONReviver");
const db_1 = require("./db");
const _enums_1 = require("@enums");
const Electron_1 = require("./Electron");
const SaveLoad_1 = require("./Go/SaveLoad");
const SaveDataUtils_1 = require("./utils/SaveDataUtils");
const saveDataBinaryFormat_1 = require("../electron/saveDataBinaryFormat");
const FileUtils_1 = require("./utils/FileUtils");
const ErrorHandler_1 = require("./utils/ErrorHandler");
const TypeAssertion_1 = require("./utils/TypeAssertion");
const SaveDataMigrationUtils_1 = require("./utils/SaveDataMigrationUtils");
const GenericReviver_1 = require("./utils/GenericReviver");
const ExportBonus_1 = require("./ExportBonus");
const SaveLoadInfiltration_1 = require("./Infiltration/SaveLoadInfiltration");
const game_1 = require("./Infiltration/formulas/game");
/**
 * This function asserts the unknown saveObject.
 *
 * In "loadGame", we parse a json save string to saveObject, then load data from this object. When we do that, we have
 * to ensure that this object contains valid data. Due to how "loadGame" uses other "loader" functions, we split
 * properties of saveObject into 3 groups:
 * - "Mandatory". "loadGame" always loads these properties. The respective loaders require string values. We assert
 * that the values are strings.
 * - "Optional 1": "loadGame" always loads these properties. The respective loaders require string values, but they have
 * special handlers for the empty string case. These handlers might be designed as a "safety net" for invalid/legacy
 * save data. If saveObject does not have these properties, we will only print a warning, then use an empty string as a
 * fallback value; otherwise, we check if their values are strings.
 * - "Optional 2": "loadGame" only loads these properties if they exist. The respective loaders require string values.
 * If saveObject has these properties, we check if their values are strings.
 */
function assertBitburnerSaveObjectType(saveObject) {
    (0, TypeAssertion_1.assertObject)(saveObject);
    const mandatoryKeysOfSaveObj = [
        "PlayerSave",
        "AllServersSave",
        "CompaniesSave",
        "FactionsSave",
        "AliasesSave",
        "GlobalAliasesSave",
    ];
    for (const key of mandatoryKeysOfSaveObj) {
        const value = saveObject[key];
        if (typeof value !== "string") {
            throw new Error(`Save data contains invalid data. Value of ${key} is not a string.`);
        }
    }
    const optional1KeysOfSaveObj = ["StaneksGiftSave", "StockMarketSave"];
    for (const key of optional1KeysOfSaveObj) {
        if (Object.hasOwn(saveObject, key)) {
            if (typeof saveObject[key] !== "string") {
                throw new Error(`Save data contains invalid data. Value of ${key} is not a string.`);
            }
        }
        else {
            console.warn(`Save data does not have ${key}.`);
            saveObject[key] = "";
        }
    }
    const optional2KeysOfSaveObj = ["SettingsSave", "LastExportBonus", "AllGangsSave", "VersionSave"];
    for (const key of optional2KeysOfSaveObj) {
        if (Object.hasOwn(saveObject, key) && typeof saveObject[key] !== "string") {
            throw new Error(`Save data contains invalid data. Value of ${key} is not a string.`);
        }
    }
}
function assertParsedSaveData(parsedSaveData) {
    if (!(0, TypeAssertion_1.isObject)(parsedSaveData) ||
        parsedSaveData.ctor !== "BitburnerSaveObject" ||
        !(0, TypeAssertion_1.isObject)(parsedSaveData.data) ||
        typeof parsedSaveData.data.PlayerSave !== "string") {
        console.error("parsedSaveData:", parsedSaveData);
        throw new Error("The parsed save data is not valid.");
    }
}
class BitburnerSaveObject {
    constructor() {
        this.PlayerSave = "";
        this.AllServersSave = "";
        this.CompaniesSave = "";
        this.FactionsSave = "";
        this.AliasesSave = "";
        this.GlobalAliasesSave = "";
        this.StockMarketSave = "";
        this.SettingsSave = "";
        this.VersionSave = "";
        this.AllGangsSave = "";
        this.LastExportBonus = "0";
        this.StaneksGiftSave = "";
        this.GoSave = "";
        this.InfiltrationsSave = "";
    }
    async getSaveData(forceExcludeRunningScripts = false) {
        this.PlayerSave = JSON.stringify(Player_1.Player);
        // For the servers save, overwrite the ExcludeRunningScripts setting if forced
        const originalExcludeSetting = Settings_1.Settings.ExcludeRunningScriptsFromSave;
        if (forceExcludeRunningScripts)
            Settings_1.Settings.ExcludeRunningScriptsFromSave = true;
        this.AllServersSave = (0, AllServers_1.saveAllServers)();
        Settings_1.Settings.ExcludeRunningScriptsFromSave = originalExcludeSetting;
        this.CompaniesSave = JSON.stringify((0, Companies_1.getCompaniesSave)());
        this.FactionsSave = JSON.stringify((0, Factions_1.getFactionsSave)());
        this.AliasesSave = JSON.stringify(Object.fromEntries(Alias_1.Aliases.entries()));
        this.GlobalAliasesSave = JSON.stringify(Object.fromEntries(Alias_1.GlobalAliases.entries()));
        this.StockMarketSave = JSON.stringify(StockMarket_1.StockMarket);
        this.SettingsSave = JSON.stringify(Settings_1.Settings);
        this.VersionSave = JSON.stringify(Constants_1.CONSTANTS.VersionNumber);
        this.LastExportBonus = JSON.stringify(ExportBonus.LastExportBonus);
        this.StaneksGiftSave = JSON.stringify(Helper_1.staneksGift);
        this.GoSave = JSON.stringify((0, SaveLoad_1.getGoSave)());
        this.InfiltrationsSave = JSON.stringify(game_1.InfiltrationState);
        if (Player_1.Player.gang)
            this.AllGangsSave = JSON.stringify(AllGangs_1.AllGangs);
        return await (0, SaveDataUtils_1.encodeJsonSaveString)(JSON.stringify(this));
    }
    async saveGame(emitToastEvent = true) {
        const savedOn = new Date().getTime();
        Player_1.Player.lastSave = savedOn;
        let saveData;
        try {
            saveData = await this.getSaveData();
        }
        catch (error) {
            (0, ErrorHandler_1.handleGetSaveDataInfoError)(error);
            return;
        }
        try {
            await (0, db_1.save)(saveData);
        }
        catch (error) {
            console.error(error);
            (0, DialogBox_1.dialogBoxCreate)(`Cannot save game: ${error}`);
            return;
        }
        const electronGameData = {
            playerIdentifier: Player_1.Player.identifier,
            fileName: this.getSaveFileName(),
            save: saveData,
            savedOn,
        };
        (0, Electron_1.pushGameSaved)(electronGameData);
        if (emitToastEvent) {
            Snackbar_1.SnackbarEvents.emit("Game Saved!", _enums_1.ToastVariant.INFO, 2000);
        }
    }
    getSaveFileName() {
        // Save file name is based on current timestamp and BitNode
        const epochTime = Math.round(Date.now() / 1000);
        const bn = Player_1.Player.bitNodeN;
        /**
         * - Binary format: save file uses .json.gz extension. Save data is the compressed json save string.
         * - Base64 format: save file uses .json extension. Save data is the base64-encoded json save string.
         */
        const extension = (0, SaveDataUtils_1.canUseBinaryFormat)() ? "json.gz" : "json";
        return `bitburnerSave_${epochTime}_BN${bn}x${Player_1.Player.sourceFileLvl(bn) + 1}.${extension}`;
    }
    async exportGame() {
        // Give the export bonus before exporting the save data
        (0, ExportBonus_1.giveExportBonus)();
        let saveData;
        try {
            saveData = await this.getSaveData();
        }
        catch (error) {
            (0, ErrorHandler_1.handleGetSaveDataInfoError)(error);
            return;
        }
        const filename = this.getSaveFileName();
        (0, FileUtils_1.downloadContentAsFile)(saveData, filename);
    }
    async importGame(saveData, overrideSettings) {
        if (!saveData || saveData.length === 0) {
            (0, DialogBox_1.dialogBoxCreate)("Invalid save data");
            return;
        }
        // Modify settings in save data if needed (i.e., toggle SyncSteamAchievements before importing).
        if (overrideSettings) {
            let parsedSaveData;
            try {
                parsedSaveData = await this.getParsedSaveData(saveData);
                // Validate SettingsSave
                if (parsedSaveData.data.SettingsSave && typeof parsedSaveData.data.SettingsSave === "string") {
                    // Parse settings from data.SettingsSave
                    const settings = JSON.parse(parsedSaveData.data.SettingsSave);
                    (0, TypeAssertion_1.assertObject)(settings);
                    // Modify setting
                    settings.SyncSteamAchievements = overrideSettings.SyncSteamAchievements;
                    // Save modified data back to saveData
                    parsedSaveData.data.SettingsSave = JSON.stringify(settings);
                    saveData = await (0, SaveDataUtils_1.encodeJsonSaveString)(JSON.stringify(parsedSaveData));
                }
            }
            catch (error) {
                console.error(error);
                (0, DialogBox_1.dialogBoxCreate)(`Cannot override settings: ${error}`);
                return;
            }
        }
        try {
            await (0, db_1.save)(saveData);
            /**
             * Notify Electron code that the player imported a save file. "restoreIfNewerExists" will be disabled for a brief
             * period of time.
             */
            (0, Electron_1.pushImportResult)(true);
        }
        catch (error) {
            console.error(error);
            (0, DialogBox_1.dialogBoxCreate)(`Cannot import save data: ${error}`);
            return;
        }
        setTimeout(() => location.reload(), 1000);
    }
    async getSaveDataFromFile(files) {
        if (files === null) {
            throw new Error("No file selected");
        }
        const file = files[0];
        if (!file) {
            throw new Error("Invalid file selected");
        }
        const rawData = new Uint8Array(await file.arrayBuffer());
        if ((0, saveDataBinaryFormat_1.isBinaryFormat)(rawData)) {
            return rawData;
        }
        return new TextDecoder().decode(rawData);
    }
    async getParsedSaveData(saveData) {
        if (!saveData || saveData.length === 0) {
            throw new Error("Invalid save data");
        }
        if (typeof saveData === "string" && saveData.startsWith(`{"ctor"`)) {
            throw new Error("The save data is invalid. You must import the original save file. If it's a .gz file, don't decompress it.");
        }
        let decodedSaveData;
        try {
            decodedSaveData = await (0, SaveDataUtils_1.decodeSaveData)(saveData);
        }
        catch (error) {
            console.error(error);
            // Rethrow immediately if the error is SaveDataError; otherwise, handle it below.
            if (error instanceof SaveDataUtils_1.SaveDataError) {
                throw error;
            }
        }
        if (!decodedSaveData || decodedSaveData === "") {
            console.error("decodedSaveData:", decodedSaveData);
            console.error("saveData:", saveData);
            throw new Error("The save data cannot be decoded.");
        }
        let parsedSaveData;
        try {
            parsedSaveData = JSON.parse(decodedSaveData);
        }
        catch (error) {
            console.error("decodedSaveData:", decodedSaveData);
            throw new Error("The decoded save data is not valid.");
        }
        assertParsedSaveData(parsedSaveData);
        return parsedSaveData;
    }
    async getImportDataFromSaveData(saveData) {
        const parsedSaveData = await this.getParsedSaveData(saveData);
        const data = {
            saveData: saveData,
        };
        const importedPlayer = (0, Player_1.loadPlayer)(parsedSaveData.data.PlayerSave);
        let syncSteamAchievements = true;
        // Parse data.SettingsSave to get syncSteamAchievements.
        if (parsedSaveData.data.SettingsSave && typeof parsedSaveData.data.SettingsSave === "string") {
            try {
                const settings = JSON.parse(parsedSaveData.data.SettingsSave);
                (0, TypeAssertion_1.assertObject)(settings);
                if (typeof settings.SyncSteamAchievements === "boolean") {
                    syncSteamAchievements = settings.SyncSteamAchievements;
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        const playerData = {
            identifier: importedPlayer.identifier,
            lastSave: importedPlayer.lastSave,
            totalPlaytime: importedPlayer.totalPlaytime,
            money: importedPlayer.money,
            skills: importedPlayer.skills,
            augmentations: importedPlayer.augmentations?.reduce((total, current) => (total += current.level), 0) ?? 0,
            factions: importedPlayer.factions?.length ?? 0,
            achievements: importedPlayer.achievements?.length ?? 0,
            bitNode: importedPlayer.bitNodeN,
            bitNodeLevel: importedPlayer.sourceFileLvl(Player_1.Player.bitNodeN) + 1,
            sourceFiles: [...importedPlayer.sourceFiles].reduce((total, [__bn, lvl]) => (total += lvl), 0),
            exploits: importedPlayer.exploits.length,
            syncSteamAchievements,
        };
        data.playerData = playerData;
        return data;
    }
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("BitburnerSaveObject", this);
    }
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(BitburnerSaveObject, value.data);
    }
}
async function loadGame(saveData) {
    createScamUpdateText();
    if (!saveData) {
        return false;
    }
    const jsonSaveString = await (0, SaveDataUtils_1.decodeSaveData)(saveData);
    const saveObj = JSON.parse(jsonSaveString, GenericReviver_1.Reviver);
    assertBitburnerSaveObjectType(saveObj);
    // "Mandatory"
    (0, Player_1.setPlayer)((0, Player_1.loadPlayer)(saveObj.PlayerSave));
    (0, AllServers_1.loadAllServers)(saveObj.AllServersSave);
    (0, Companies_1.loadCompanies)(saveObj.CompaniesSave);
    (0, Factions_1.loadFactions)(saveObj.FactionsSave, Player_1.Player);
    (0, SaveLoad_1.loadGo)(saveObj.GoSave);
    (0, SaveLoadInfiltration_1.loadInfiltrations)(saveObj.InfiltrationsSave);
    try {
        (0, Alias_1.loadAliases)(saveObj.AliasesSave);
    }
    catch (e) {
        console.warn(`Could not load Aliases from save`);
    }
    try {
        (0, Alias_1.loadGlobalAliases)(saveObj.GlobalAliasesSave);
    }
    catch (e) {
        console.warn(`Could not load GlobalAliases from save`);
    }
    // "Optional 1"
    (0, Helper_1.loadStaneksGift)(saveObj.StaneksGiftSave);
    try {
        (0, StockMarket_1.loadStockMarket)(saveObj.StockMarketSave);
    }
    catch (e) {
        console.error("Couldn't load stock market:", e);
        (0, StockMarket_1.loadStockMarket)("");
    }
    // "Optional 2"
    if (saveObj.SettingsSave) {
        try {
            // Try to set saved settings.
            Settings_1.Settings.load(saveObj.SettingsSave);
        }
        catch (e) {
            console.error("SettingsSave was present but an error occurred while loading:");
            console.error(e);
        }
    }
    if (saveObj.LastExportBonus) {
        try {
            const lastExportBonus = JSON.parse(saveObj.LastExportBonus);
            if (typeof lastExportBonus !== "number" || !Number.isFinite(lastExportBonus)) {
                throw new Error(`Invalid LastExportBonus: ${saveObj.LastExportBonus}`);
            }
            ExportBonus.setLastExportBonus(lastExportBonus);
        }
        catch (error) {
            ExportBonus.setLastExportBonus(new Date().getTime());
            console.error(`ERROR: Failed to parse last export bonus setting. Error: ${error}.`, error);
        }
    }
    if (Player_1.Player.gang && saveObj.AllGangsSave) {
        try {
            (0, AllGangs_1.loadAllGangs)(saveObj.AllGangsSave);
        }
        catch (error) {
            console.error(`ERROR: Failed to parse AllGangsSave. Error: ${error}.`, error);
        }
    }
    if (saveObj.VersionSave) {
        try {
            const ver = JSON.parse(saveObj.VersionSave, GenericReviver_1.Reviver);
            if (typeof ver !== "string" && typeof ver !== "number") {
                throw new Error(`Invalid VersionSave: ${saveObj.VersionSave}`);
            }
            await (0, SaveDataMigrationUtils_1.evaluateVersionCompatibility)(ver);
            if (Constants_1.CONSTANTS.isDevBranch) {
                // Beta branch, always show changes
                createBetaUpdateText();
            }
            else if (ver !== Constants_1.CONSTANTS.VersionNumber) {
                createNewUpdateText();
            }
        }
        catch (e) {
            console.error("Error upgrading versions:", e);
            createNewUpdateText();
        }
    }
    else {
        createNewUpdateText();
    }
    return true;
}
function createScamUpdateText() {
    if (navigator.userAgent.includes("wv") && navigator.userAgent.includes("Chrome/")) {
        setInterval(() => {
            (0, DialogBox_1.dialogBoxCreate)("SCAM ALERT. This app is not official and you should uninstall it.");
        }, 1000);
    }
}
function createNewUpdateText() {
    setTimeout(() => (0, DialogBox_1.dialogBoxCreate)("New update!\n" +
        "Please report any bugs/issues through the GitHub repository (https://github.com/bitburner-official/bitburner-src/issues) " +
        "or the #bug-report channel on Discord (https://discord.com/channels/415207508303544321/415213413745164318).\n\n" +
        Constants_1.CONSTANTS.LatestUpdate), 1000);
}
function createBetaUpdateText() {
    setTimeout(() => (0, DialogBox_1.dialogBoxCreate)("You are playing on the beta environment! This branch of the game " +
        "features the latest developments in the game. This version may be unstable.\n" +
        "Please report any bugs/issues through the github repository (https://github.com/bitburner-official/bitburner-src/issues) " +
        "or the #bug-report channel on Discord (https://discord.com/channels/415207508303544321/415213413745164318).\n\n" +
        Constants_1.CONSTANTS.LatestUpdate), 1000);
}
JSONReviver_1.constructorsForReviver.BitburnerSaveObject = BitburnerSaveObject;
const saveObject = new BitburnerSaveObject();
exports.saveObject = saveObject;
