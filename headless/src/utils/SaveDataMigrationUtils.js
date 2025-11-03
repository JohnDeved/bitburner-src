"use strict";
/**
 * This file contains utility functions that migrate save data. Originally, they were in SaveObject.ts. It's too hard to
 * satisfy all TypeScript's type checks, so we move them into a separate helper file, then disable some lint rules in
 * the entire file. It helps us:
 * - Not have to disable lint rules in SaveObject.ts.
 * - Not have to use "// eslint-disable-next-line" everywhere in these functions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateVersionCompatibility = evaluateVersionCompatibility;
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const AllServers_1 = require("../Server/AllServers");
const StockMarket_1 = require("../StockMarket/StockMarket");
const v1APIBreak_1 = require("./v1APIBreak");
const Settings_1 = require("../Settings/Settings");
const themes_1 = require("../ScriptEditor/ui/themes");
const PlayerOwnedAugmentation_1 = require("../Augmentation/PlayerOwnedAugmentation");
const SpecialServers_1 = require("../Server/data/SpecialServers");
const ServerHelpers_1 = require("../Server/ServerHelpers");
const v2APIBreak_1 = require("./v2APIBreak");
const Terminal_1 = require("../Terminal");
const Record_1 = require("../Types/Record");
const Actions_1 = require("../Corporation/Actions");
const SaveLoad_1 = require("../Go/SaveLoad");
const APIBreak_1 = require("./APIBreaks/APIBreak");
const _2_6_1_1 = require("./APIBreaks/2.6.1");
const _3_0_0_1 = require("./APIBreaks/3.0.0");
const helpers_1 = require("../Corporation/helpers");
const Constants_1 = require("../Corporation/data/Constants");
const db_1 = require("../db");
const FileUtils_1 = require("./FileUtils");
/** Function for performing a series of defined replacements. See 0.58.0 for usage */
function convert(code, changes) {
    for (const change of changes) {
        code = code.replace(change[0], change[1]);
    }
    return code;
}
/** Function for removing whitespace from filenames. See 41 for usage */
function removeWhitespace(hostname, file, files) {
    let filename = file.filename.replace(/\s+/g, "-");
    // avoid filename conflicts
    if (files.has(filename)) {
        const idx = filename.lastIndexOf(".");
        const path = filename.slice(0, idx);
        const ext = filename.slice(idx);
        let i = 1;
        do {
            filename = `${path}-${i++}${ext}`;
        } while (files.has(filename));
    }
    console.warn(`Renamed "${file.filename}" to "${filename}" on ${hostname}.`);
    files.delete(file.filename);
    file.filename = filename;
    files.set(file.filename, file);
}
// Makes necessary changes to the loaded/imported data to ensure
// the game stills works with new versions
async function evaluateVersionCompatibility(ver) {
    var _a;
    // We have to do this because ts won't let us otherwise
    const anyPlayer = _player_1.Player;
    if (typeof ver === "string") {
        // This version refactored the Company/job-related code
        if (ver <= "0.41.2") {
            // Player's company position is now a string
            if (anyPlayer.companyPosition != null && typeof anyPlayer.companyPosition !== "string") {
                anyPlayer.companyPosition = anyPlayer.companyPosition.data.positionName;
                if (anyPlayer.companyPosition == null) {
                    anyPlayer.companyPosition = "";
                }
            }
        }
        // This version allowed players to hold multiple jobs
        if (ver < "0.43.0") {
            if (anyPlayer.companyName !== "" && anyPlayer.companyPosition != null && anyPlayer.companyPosition !== "") {
                anyPlayer.jobs[anyPlayer.companyName] = anyPlayer.companyPosition;
            }
            delete anyPlayer.companyPosition;
        }
        if (ver < "0.56.0") {
            // In older versions, keys of AllServers are IP addresses instead of hostnames.
            for (const server of (0, AllServers_1.GetAllServers)()) {
                (0, AllServers_1.renameServer)(server.ip, server.hostname);
            }
            for (const q of anyPlayer.queuedAugmentations) {
                if (q.name === "Graphene BranchiBlades Upgrade") {
                    q.name = "Graphene BrachiBlades Upgrade";
                }
            }
            for (const q of anyPlayer.augmentations) {
                if (q.name === "Graphene BranchiBlades Upgrade") {
                    q.name = "Graphene BrachiBlades Upgrade";
                }
            }
        }
        if (ver < "0.56.1") {
            if (anyPlayer.bladeburner === 0) {
                anyPlayer.bladeburner = null;
            }
            if (anyPlayer.gang === 0) {
                anyPlayer.gang = null;
            }
            // convert all Messages to just filename to save space.
            const home = anyPlayer.getHomeComputer();
            for (let i = 0; i < home.messages.length; i++) {
                if (home.messages[i].filename) {
                    home.messages[i] = home.messages[i].filename;
                }
            }
        }
        if (ver < "0.58.0") {
            const changes = [
                [/getStockSymbols/g, "stock.getSymbols"],
                [/getStockPrice/g, "stock.getPrice"],
                [/getStockAskPrice/g, "stock.getAskPrice"],
                [/getStockBidPrice/g, "stock.getBidPrice"],
                [/getStockPosition/g, "stock.getPosition"],
                [/getStockMaxShares/g, "stock.getMaxShares"],
                [/getStockPurchaseCost/g, "stock.getPurchaseCost"],
                [/getStockSaleGain/g, "stock.getSaleGain"],
                [/buyStock/g, "stock.buy"],
                [/sellStock/g, "stock.sell"],
                [/shortStock/g, "stock.short"],
                [/sellShort/g, "stock.sellShort"],
                [/placeOrder/g, "stock.placeOrder"],
                [/cancelOrder/g, "stock.cancelOrder"],
                [/getOrders/g, "stock.getOrders"],
                [/getStockVolatility/g, "stock.getVolatility"],
                [/getStockForecast/g, "stock.getForecast"],
                [/purchase4SMarketData/g, "stock.purchase4SMarketData"],
                [/purchase4SMarketDataTixApi/g, "stock.purchase4SMarketDataTixApi"],
            ];
            for (const server of (0, AllServers_1.GetAllServers)()) {
                for (const script of server.scripts.values()) {
                    script.content = convert(script.code, changes);
                }
            }
        }
        (0, v1APIBreak_1.v1APIBreak)();
        ver = 1;
    }
    if (typeof ver !== "number")
        return;
    if (ver < 2) {
        (0, v1APIBreak_1.AwardNFG)(10);
        _player_1.Player.reapplyAllAugmentations();
        _player_1.Player.reapplyAllSourceFiles();
    }
    if (ver < 3) {
        anyPlayer.money = parseFloat(anyPlayer.money);
    }
    if (ver < 9) {
        if (Object.hasOwn(StockMarket_1.StockMarket, "Joes Guns")) {
            const s = StockMarket_1.StockMarket["Joes Guns"];
            delete StockMarket_1.StockMarket["Joes Guns"];
            StockMarket_1.StockMarket[_enums_1.LocationName.Sector12JoesGuns] = s;
        }
    }
    if (ver < 10) {
        // Augmentation name was changed in 0.56.0 but sleeves aug list was missed.
        if (anyPlayer.sleeves && anyPlayer.sleeves.length > 0) {
            for (const sleeve of anyPlayer.sleeves) {
                if (!sleeve.augmentations || sleeve.augmentations.length === 0)
                    continue;
                for (const augmentation of sleeve.augmentations) {
                    if (augmentation.name !== "Graphene BranchiBlades Upgrade")
                        continue;
                    augmentation.name = "Graphene BrachiBlades Upgrade";
                }
            }
        }
    }
    if (ver < 12) {
        if (anyPlayer.resleeves !== undefined) {
            delete anyPlayer.resleeves;
        }
    }
    if (ver < 15) {
        Settings_1.Settings.EditorTheme = { ...themes_1.defaultMonacoTheme };
    }
    //Fix contract names
    if (ver < 16) {
        //Iterate over all contracts on all servers
        for (const server of (0, AllServers_1.GetAllServers)()) {
            for (const contract of server.contracts) {
                //Rename old "HammingCodes: Integer to encoded Binary" contracts
                //to "HammingCodes: Integer to Encoded Binary"
                if (contract.type == "HammingCodes: Integer to encoded Binary") {
                    contract.type = _enums_1.CodingContractName.HammingCodesIntegerToEncodedBinary;
                }
            }
        }
    }
    const v22PlayerBreak = () => {
        // reset HP correctly to avoid crash
        anyPlayer.hp = { current: 1, max: 1 };
        for (const sleeve of anyPlayer.sleeves) {
            sleeve.hp = { current: 1, max: 1 };
        }
        // transfer over old exp to new struct
        anyPlayer.exp.hacking = anyPlayer.hacking_exp;
        anyPlayer.exp.strength = anyPlayer.strength_exp;
        anyPlayer.exp.defense = anyPlayer.defense_exp;
        anyPlayer.exp.dexterity = anyPlayer.dexterity_exp;
        anyPlayer.exp.agility = anyPlayer.agility_exp;
        anyPlayer.exp.charisma = anyPlayer.charisma_exp;
        anyPlayer.exp.intelligence = anyPlayer.intelligence_exp;
    };
    // Fix bugged NFG accumulation in owned augmentations
    if (ver < 17) {
        let ownedNFGs = [..._player_1.Player.augmentations];
        ownedNFGs = ownedNFGs.filter((aug) => aug.name === _enums_1.AugmentationName.NeuroFluxGovernor);
        const newNFG = new PlayerOwnedAugmentation_1.PlayerOwnedAugmentation(_enums_1.AugmentationName.NeuroFluxGovernor);
        newNFG.level = 0;
        for (const nfg of ownedNFGs) {
            newNFG.level += nfg.level;
        }
        _player_1.Player.augmentations = [
            ..._player_1.Player.augmentations.filter((aug) => aug.name !== _enums_1.AugmentationName.NeuroFluxGovernor),
            newNFG,
        ];
        v22PlayerBreak();
        _player_1.Player.reapplyAllAugmentations();
        _player_1.Player.reapplyAllSourceFiles();
    }
    if (ver < 20) {
        // Create the darkweb for everyone but it won't be linked
        const dw = (0, AllServers_1.GetServer)(SpecialServers_1.SpecialServers.DarkWeb);
        if (!dw) {
            const darkweb = (0, ServerHelpers_1.safelyCreateUniqueServer)({
                ip: (0, AllServers_1.createUniqueRandomIp)(),
                hostname: SpecialServers_1.SpecialServers.DarkWeb,
                organizationName: "",
                isConnectedTo: false,
                adminRights: false,
                purchasedByPlayer: false,
                maxRam: 1,
            });
            (0, AllServers_1.AddToAllServers)(darkweb);
        }
    }
    if (ver < 21) {
        // 2.0.0 work rework
        (0, v1APIBreak_1.AwardNFG)(10);
        const create = anyPlayer.createProgramName;
        if (create)
            _player_1.Player.getHomeComputer().pushProgram(create);
        const graft = anyPlayer.graftAugmentationName;
        if (graft)
            _player_1.Player.augmentations.push({ name: graft, level: 1 });
    }
    if (ver < 22) {
        v22PlayerBreak();
        (0, v2APIBreak_1.v2APIBreak)();
    }
    if (ver < 23) {
        anyPlayer.currentWork = null;
    }
    if (ver < 25) {
        const removePlayerFields = [
            "hacking_chance_mult",
            "hacking_speed_mult",
            "hacking_money_mult",
            "hacking_grow_mult",
            "hacking_mult",
            "strength_mult",
            "defense_mult",
            "dexterity_mult",
            "agility_mult",
            "charisma_mult",
            "hacking_exp_mult",
            "strength_exp_mult",
            "defense_exp_mult",
            "dexterity_exp_mult",
            "agility_exp_mult",
            "charisma_exp_mult",
            "company_rep_mult",
            "faction_rep_mult",
            "crime_money_mult",
            "crime_success_mult",
            "work_money_mult",
            "hacknet_node_money_mult",
            "hacknet_node_purchase_cost_mult",
            "hacknet_node_ram_cost_mult",
            "hacknet_node_core_cost_mult",
            "hacknet_node_level_cost_mult",
            "bladeburner_max_stamina_mult",
            "bladeburner_stamina_gain_mult",
            "bladeburner_analysis_mult",
            "bladeburner_success_chance_mult",
            "hacking_exp",
            "strength_exp",
            "defense_exp",
            "dexterity_exp",
            "agility_exp",
            "charisma_exp",
            "intelligence_exp",
            "companyName",
            "isWorking",
            "workType",
            "workCostMult",
            "workExpMult",
            "currentWorkFactionName",
            "currentWorkFactionDescription",
            "workHackExpGainRate",
            "workStrExpGainRate",
            "workDefExpGainRate",
            "workDexExpGainRate",
            "workAgiExpGainRate",
            "workChaExpGainRate",
            "workRepGainRate",
            "workMoneyGainRate",
            "workMoneyLossRate",
            "workHackExpGained",
            "workStrExpGained",
            "workDefExpGained",
            "workDexExpGained",
            "workAgiExpGained",
            "workChaExpGained",
            "workRepGained",
            "workMoneyGained",
            "createProgramName",
            "createProgramReqLvl",
            "graftAugmentationName",
            "timeWorkedGraftAugmentation",
            "className",
            "crimeType",
            "timeWorked",
            "timeWorkedCreateProgram",
            "timeNeededToCompleteWork",
            "factionWorkType",
            "committingCrimeThruSingFn",
            "singFnCrimeWorkerScript",
            "hacking",
            "max_hp",
            "strength",
            "defense",
            "dexterity",
            "agility",
            "charisma",
            "intelligence",
        ];
        const removeSleeveFields = [
            "gymStatType",
            "bbAction",
            "bbContract",
            "hacking",
            "strength",
            "defense",
            "dexterity",
            "agility",
            "charisma",
            "intelligence",
            "max_hp",
            "hacking_exp",
            "strength_exp",
            "defense_exp",
            "dexterity_exp",
            "agility_exp",
            "charisma_exp",
            "intelligence_exp",
            "hacking_mult",
            "strength_mult",
            "defense_mult",
            "dexterity_mult",
            "agility_mult",
            "charisma_mult",
            "hacking_exp_mult",
            "strength_exp_mult",
            "defense_exp_mult",
            "dexterity_exp_mult",
            "agility_exp_mult",
            "charisma_exp_mult",
            "hacking_chance_mult",
            "hacking_speed_mult",
            "hacking_money_mult",
            "hacking_grow_mult",
            "company_rep_mult",
            "faction_rep_mult",
            "crime_money_mult",
            "crime_success_mult",
            "work_money_mult",
            "hacknet_node_money_mult",
            "hacknet_node_purchase_cost_mult",
            "hacknet_node_ram_cost_mult",
            "hacknet_node_core_cost_mult",
            "hacknet_node_level_cost_mult",
            "bladeburner_max_stamina_mult",
            "bladeburner_stamina_gain_mult",
            "bladeburner_analysis_mult",
            "bladeburner_success_chance_mult",
            "className",
            "crimeType",
            "currentTask",
            "currentTaskLocation",
            "currentTaskMaxTime",
            "currentTaskTime",
            "earningsForSleeves",
            "earningsForPlayer",
            "earningsForTask",
            "factionWorkType",
            "gainRatesForTask",
            "logs",
        ];
        let intExp = Number(anyPlayer.intelligence_exp);
        if (isNaN(intExp))
            intExp = 0;
        anyPlayer.exp.intelligence += intExp;
        for (const field of removePlayerFields) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete anyPlayer[field];
        }
        for (const sleeve of anyPlayer.sleeves) {
            const anySleeve = sleeve;
            let intExp = Number(anySleeve.intelligence_exp);
            if (isNaN(intExp))
                intExp = 0;
            anySleeve.exp.intelligence += intExp;
            for (const field of removeSleeveFields) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete sleeve[field];
            }
        }
    }
    if (ver < 27) {
        // Prior to v2.2.0, sleeve shock was 0 to 100 internally but displayed as 100 to 0. This unifies them as 100 to 0.
        for (const sleeve of _player_1.Player.sleeves)
            sleeve.shock = 100 - sleeve.shock;
    }
    // Some 2.3 changes are actually in BaseServer.js fromJSONBase function
    if (ver < 31) {
        Terminal_1.Terminal.warn("Migrating to 2.3.0, loading with no scripts.");
        for (const server of (0, AllServers_1.GetAllServers)()) {
            // Do not load any saved scripts on migration
            server.savedScripts = [];
        }
        if (anyPlayer.hashManager?.upgrades) {
            (_a = anyPlayer.hashManager.upgrades)["Company Favor"] ?? (_a["Company Favor"] = 0);
        }
        if (!anyPlayer.lastAugReset || anyPlayer.lastAugReset === -1) {
            anyPlayer.lastAugReset = anyPlayer.lastUpdate - anyPlayer.playtimeSinceLastAug;
        }
        if (!anyPlayer.lastNodeRest || anyPlayer.lastNodeReset === -1) {
            anyPlayer.lastNodeReset = anyPlayer.lastUpdate - anyPlayer.playtimeSinceLastBitnode;
        }
        // Reset corporation to new format.
        const oldCorp = anyPlayer.corporation;
        if (oldCorp && Array.isArray(oldCorp.divisions)) {
            // Corp needs to be reset to new format, just keep some valuation data
            let valuation = oldCorp.valuation * 2 + oldCorp.revenue * 100;
            if (isNaN(valuation))
                valuation = 300e9;
            _player_1.Player.startCorporation(String(oldCorp.name), !!oldCorp.seedFunded);
            _player_1.Player.corporation?.gainFunds(valuation, "force majeure");
            Terminal_1.Terminal.warn("Loading corporation from version prior to 2.3. Corporation has been reset.");
        }
        // End 2.3 changes
    }
    //2.3 hotfix changes and 2.3.1 changes
    if (ver < 32) {
        // Sanitize corporation exports
        let anyExportsFailed = false;
        if (_player_1.Player.corporation) {
            for (const division of _player_1.Player.corporation.divisions.values()) {
                for (const warehouse of (0, Record_1.getRecordValues)(division.warehouses)) {
                    for (const material of (0, Record_1.getRecordValues)(warehouse.materials)) {
                        const originalExports = material.exports;
                        // Clear all exports for the material
                        material.exports = [];
                        for (const originalExport of originalExports) {
                            // Throw if there was a failure re-establishing an export
                            try {
                                const targetDivision = _player_1.Player.corporation.divisions.get(originalExport.division);
                                if (!targetDivision)
                                    throw new Error(`Target division ${originalExport.division} did not exist`);
                                // Set the export again. ExportMaterial throws on failure
                                (0, Actions_1.exportMaterial)(targetDivision, originalExport.city, material, originalExport.amount);
                            }
                            catch (e) {
                                anyExportsFailed = true;
                                // We just need the text error, not a full stack trace
                                console.error(`Failed to load export of material ${material.name} (${division.name} ${warehouse.city})
Original export details: ${JSON.stringify(originalExport)}
Error: ${e}`, e);
                            }
                        }
                    }
                }
            }
        }
        if (anyExportsFailed)
            Terminal_1.Terminal.error("Some material exports failed to validate while loading and have been removed. See console for more info.");
    }
    if (ver < 33) {
        // 2.4.0 fixed what should be the last issue with scripts having the wrong server assigned
        for (const server of (0, AllServers_1.GetAllServers)()) {
            for (const script of server.scripts.values()) {
                if (script.server !== server.hostname) {
                    console.warn(`Detected script ${script.filename} on ${server.hostname} with incorrect server property: ${script.server}. Repairing.`);
                    script.server = server.hostname;
                }
            }
        }
    }
    v2_60: if (ver < 38 && "go" in _player_1.Player) {
        const goData = _player_1.Player.go;
        // Remove outdated savedata
        delete _player_1.Player.go;
        // Attempt to load back in at least the stats object. The current game will not be loaded.
        if (!goData || typeof goData !== "object")
            break v2_60;
        const stats = "status" in goData ? goData.status : "stats" in goData ? goData.stats : null;
        if (!stats || typeof stats !== "object")
            break v2_60;
        const freshSaveData = (0, SaveLoad_1.getGoSave)();
        Object.assign(freshSaveData.stats, stats);
        (0, SaveLoad_1.loadGo)(JSON.stringify(freshSaveData));
    }
    if (ver < 39) {
        (0, APIBreak_1.showAPIBreaks)("2.6.1", _2_6_1_1.breakInfos261);
    }
    if (ver < 42) {
        // All whitespace except for spaces was allowed in filenames
        let found = false;
        for (const server of (0, AllServers_1.GetAllServers)()) {
            for (const script of server.scripts.values()) {
                if (!/\s/.test(script.filename))
                    continue;
                removeWhitespace(server.hostname, script, server.scripts);
                found = true;
            }
            for (const textFile of server.textFiles.values()) {
                if (!/\s/.test(textFile.filename))
                    continue;
                removeWhitespace(server.hostname, textFile, server.textFiles);
                found = true;
            }
        }
        if (found)
            Terminal_1.Terminal.error("Filenames with whitespace found and corrected, see console for details.");
    }
    // Migrate save data related to the breaking changes in the first beta of v3.0.0.
    if (ver < 44) {
        try {
            /**
             * Backup pre-v3 save data. We must use the data in IndexedDB instead of calling saveObject.getSaveData().
             * getSaveData() returns data in v3 format, so the exported data will not be importable in pre-v3.
             */
            const saveData = await (0, db_1.load)();
            (0, FileUtils_1.downloadContentAsFile)(saveData, `bitburnerSave_backup_2.8.1_${Math.round(_player_1.Player.lastUpdate / 1000)}.json.gz`);
        }
        catch (error) {
            console.error("Cannot export pre-v3 save data", error);
        }
        if (_player_1.Player.corporation) {
            // Remove and refund DreamSense
            for (const [name, upgrade] of Object.entries(_player_1.Player.corporation.upgrades)) {
                if (name !== "DreamSense") {
                    continue;
                }
                const cost = (0, helpers_1.calculateUpgradeCost)(4e9, 1.1, 0, upgrade.level);
                _player_1.Player.corporation.gainFunds(cost, "force majeure");
            }
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete _player_1.Player.corporation.upgrades["DreamSense"];
            // Remove and refund Spring Water divisions
            for (const division of _player_1.Player.corporation.divisions.values()) {
                if (division.industry === "Spring Water") {
                    // Refund division
                    let refund = 0;
                    refund += 10e9;
                    for (const office of Object.values(division.offices)) {
                        // Refund office
                        if (office.city !== _enums_1.CityName.Sector12) {
                            refund += Constants_1.officeInitialCost;
                        }
                        if (office.size > Constants_1.officeInitialSize) {
                            refund += (0, helpers_1.calculateOfficeSizeUpgradeCost)(Constants_1.officeInitialSize, (office.size - Constants_1.officeInitialSize));
                        }
                    }
                    for (const warehouse of Object.values(division.warehouses)) {
                        // Refund warehouse
                        if (warehouse.city !== _enums_1.CityName.Sector12) {
                            refund += Constants_1.warehouseInitialCost;
                        }
                        if (warehouse.level > 1) {
                            refund += (0, Actions_1.upgradeWarehouseCost)(1, warehouse.level - 1);
                        }
                        // Refund material
                        for (const material of Object.values(warehouse.materials)) {
                            if (material.stored <= 0) {
                                continue;
                            }
                            refund += material.stored * material.marketPrice;
                        }
                    }
                    _player_1.Player.corporation.gainFunds(refund, "force majeure");
                    _player_1.Player.corporation.divisions.delete(division.name);
                }
                else {
                    // Remove export routes
                    for (const warehouse of Object.values(division.warehouses)) {
                        for (const material of Object.values(warehouse.materials)) {
                            for (let i = 0; i < material.exports.length; ++i) {
                                const exportRoute = material.exports[i];
                                const targetDivision = _player_1.Player.corporation.divisions.get(exportRoute.division);
                                if (targetDivision && targetDivision.industry !== "Spring Water") {
                                    continue;
                                }
                                material.exports.splice(i, 1);
                            }
                        }
                    }
                }
            }
            // Remove and refund VeChain
            const unlocks = _player_1.Player.corporation.unlocks;
            for (const upgrade of unlocks) {
                if (upgrade !== "VeChain") {
                    continue;
                }
                _player_1.Player.corporation.gainFunds(10e9, "force majeure");
            }
            unlocks.delete("VeChain");
        }
    }
    if (ver < 45) {
        (0, APIBreak_1.showAPIBreaks)("3.0.0", _3_0_0_1.breakingChanges300);
    }
}
