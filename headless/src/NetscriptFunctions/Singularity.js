"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetscriptSingularity = NetscriptSingularity;
const _player_1 = require("@player");
const _enums_1 = require("@enums");
const FactionHelpers_1 = require("../Faction/FactionHelpers");
const NetscriptWorker_1 = require("../NetscriptWorker");
const Augmentations_1 = require("../Augmentation/Augmentations");
const AugmentationHelpers_1 = require("../Augmentation/AugmentationHelpers");
const Constants_1 = require("../Constants");
const RunningScript_1 = require("../Script/RunningScript");
const Achievements_1 = require("../Achievements/Achievements");
const CompanyPositions_1 = require("../Company/CompanyPositions");
const DarkWebItems_1 = require("../DarkWeb/DarkWebItems");
const GameRoot_1 = require("../ui/GameRoot");
const Router_1 = require("../ui/Router");
const SpecialServers_1 = require("../Server/data/SpecialServers");
const Locations_1 = require("../Locations/Locations");
const AllServers_1 = require("../Server/AllServers");
const Programs_1 = require("../Programs/Programs");
const formatNumber_1 = require("../ui/formatNumber");
const BitNodeMultipliers_1 = require("../BitNode/BitNodeMultipliers");
const Companies_1 = require("../Company/Companies");
const Factions_1 = require("../Faction/Factions");
const NetscriptHelpers_1 = require("../Netscript/NetscriptHelpers");
const StringHelperFunctions_1 = require("../utils/StringHelperFunctions");
const ServerHelpers_1 = require("../Server/ServerHelpers");
const Terminal_1 = require("../Terminal");
const Hacking_1 = require("../Hacking");
const Server_1 = require("../Server/Server");
const netscriptCanHack_1 = require("../Hacking/netscriptCanHack");
const FactionInfo_1 = require("../Faction/FactionInfo");
const donation_1 = require("../Faction/formulas/donation");
const APIWrapper_1 = require("../Netscript/APIWrapper");
const RedPill_1 = require("../RedPill");
const ClassWork_1 = require("../Work/ClassWork");
const CreateProgramWork_1 = require("../Work/CreateProgramWork");
const FactionWork_1 = require("../Work/FactionWork");
const CompanyWork_1 = require("../Work/CompanyWork");
const ExportBonus_1 = require("../ExportBonus");
const SaveObject_1 = require("../SaveObject");
const Formulas_1 = require("../Work/Formulas");
const engine_1 = require("../engine");
const EnumHelper_1 = require("../utils/EnumHelper");
const ScriptFilePath_1 = require("../Paths/ScriptFilePath");
const Record_1 = require("../Types/Record");
const JobTracks_1 = require("../Company/data/JobTracks");
const Constants_2 = require("../Server/data/Constants");
const BlackOperations_1 = require("../Bladeburner/data/BlackOperations");
const utils_1 = require("../Company/utils");
const favor_1 = require("../Faction/formulas/favor");
const Constants_3 = require("../BitNode/Constants");
const exceptionAlert_1 = require("../utils/helpers/exceptionAlert");
const cat_1 = require("../Terminal/commands/cat");
const Crimes_1 = require("../Crime/Crimes");
function NetscriptSingularity() {
    const runAfterReset = function (cbScript) {
        //Run a script after reset
        if (!cbScript)
            return;
        const home = _player_1.Player.getHomeComputer();
        const script = home.scripts.get(cbScript);
        if (!script)
            return;
        const ramUsage = script.getRamUsage(home.scripts);
        if (!ramUsage) {
            return Terminal_1.Terminal.error(`Attempted to launch ${cbScript} after reset but could not calculate ram usage.`);
        }
        const ramAvailable = home.maxRam - home.ramUsed;
        if (ramUsage > ramAvailable + 0.001) {
            return Terminal_1.Terminal.error(`Attempted to launch ${cbScript} after reset but there was not enough ram.`);
        }
        // Start script with no args and 1 thread (default).
        const runningScriptObj = new RunningScript_1.RunningScript(script, ramUsage, []);
        (0, NetscriptWorker_1.startWorkerScript)(runningScriptObj, home);
    };
    const singularityAPI = {
        getOwnedAugmentations: (ctx) => (_purchased) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const purchased = !!_purchased;
            const res = [];
            for (let i = 0; i < _player_1.Player.augmentations.length; ++i) {
                res.push(_player_1.Player.augmentations[i].name);
            }
            if (purchased) {
                for (let i = 0; i < _player_1.Player.queuedAugmentations.length; ++i) {
                    res.push(_player_1.Player.queuedAugmentations[i].name);
                }
            }
            return res;
        },
        getOwnedSourceFiles: () => () => {
            return [..._player_1.Player.activeSourceFiles]
                .filter(([__, activeLevel]) => {
                return activeLevel > 0;
            })
                .map(([n, lvl]) => ({ n, lvl }));
        },
        getAugmentationFactions: (ctx) => (_augName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const augName = (0, EnumHelper_1.getEnumHelper)("AugmentationName").nsGetMember(ctx, _augName);
            const aug = Augmentations_1.Augmentations[augName];
            const factions = aug.factions.slice();
            if (!_player_1.Player.gang) {
                return factions;
            }
            const gangFactionName = _player_1.Player.gang.facName;
            const augmentationListOfGangFaction = (0, FactionHelpers_1.getFactionAugmentationsFiltered)(Factions_1.Factions[gangFactionName]);
            /**
             * If the gang faction does not offer this augmentation, we need to remove the gang faction from the faction list.
             * Example: "NeuroFlux Governor"
             */
            if (!augmentationListOfGangFaction.includes(augName)) {
                return factions.filter((factionName) => factionName !== gangFactionName);
            }
            /**
             * If the gang faction offers this augmentation, but the faction list does not contain the gang faction, we need
             * to add the gang faction to that list.
             * Example: "The Red Pill" in BN2
             */
            if (augmentationListOfGangFaction.includes(augName) && !factions.includes(gangFactionName)) {
                factions.push(gangFactionName);
                return factions;
            }
            return factions;
        },
        getAugmentationsFromFaction: (ctx) => (_facName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const facName = (0, EnumHelper_1.getEnumHelper)("FactionName").nsGetMember(ctx, _facName);
            const faction = Factions_1.Factions[facName];
            return (0, FactionHelpers_1.getFactionAugmentationsFiltered)(faction);
        },
        getAugmentationPrereq: (ctx) => (_augName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const augName = (0, EnumHelper_1.getEnumHelper)("AugmentationName").nsGetMember(ctx, _augName);
            const aug = Augmentations_1.Augmentations[augName];
            return aug.prereqs.slice();
        },
        getAugmentationBasePrice: (ctx) => (_augName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const augName = (0, EnumHelper_1.getEnumHelper)("AugmentationName").nsGetMember(ctx, _augName);
            const aug = Augmentations_1.Augmentations[augName];
            return aug.baseCost * BitNodeMultipliers_1.currentNodeMults.AugmentationMoneyCost;
        },
        getAugmentationPrice: (ctx) => (_augName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const augName = (0, EnumHelper_1.getEnumHelper)("AugmentationName").nsGetMember(ctx, _augName);
            const aug = Augmentations_1.Augmentations[augName];
            return (0, AugmentationHelpers_1.getAugCost)(aug).moneyCost;
        },
        getAugmentationRepReq: (ctx) => (_augName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const augName = (0, EnumHelper_1.getEnumHelper)("AugmentationName").nsGetMember(ctx, _augName);
            const aug = Augmentations_1.Augmentations[augName];
            return (0, AugmentationHelpers_1.getAugCost)(aug).repCost;
        },
        getAugmentationStats: (ctx) => (_augName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const augName = (0, EnumHelper_1.getEnumHelper)("AugmentationName").nsGetMember(ctx, _augName);
            const aug = Augmentations_1.Augmentations[augName];
            return Object.assign({}, aug.mults);
        },
        purchaseAugmentation: (ctx) => (_facName, _augName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const facName = (0, EnumHelper_1.getEnumHelper)("FactionName").nsGetMember(ctx, _facName);
            const augName = (0, EnumHelper_1.getEnumHelper)("AugmentationName").nsGetMember(ctx, _augName);
            const faction = Factions_1.Factions[facName];
            const augmentation = Augmentations_1.Augmentations[augName];
            const result = (0, FactionHelpers_1.purchaseAugmentation)(faction, augmentation, true);
            if (!result.success) {
                NetscriptHelpers_1.helpers.log(ctx, () => result.message);
                return false;
            }
            NetscriptHelpers_1.helpers.log(ctx, () => `You purchased ${augName}.`);
            _player_1.Player.gainIntelligenceExp(Constants_1.CONSTANTS.IntelligenceSingFnBaseExpGain * 10);
            return true;
        },
        softReset: (ctx) => (_cbScript) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const cbScript = _cbScript
                ? (0, ScriptFilePath_1.resolveScriptFilePath)(NetscriptHelpers_1.helpers.string(ctx, "cbScript", _cbScript), ctx.workerScript.name)
                : false;
            if (cbScript === null)
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Could not resolve file path: ${_cbScript}`);
            NetscriptHelpers_1.helpers.log(ctx, () => "Soft resetting. This will cause this script to be killed");
            (0, AugmentationHelpers_1.installAugmentations)(true);
            if (cbScript)
                setTimeout(() => runAfterReset(cbScript), 500);
        },
        installAugmentations: (ctx) => (_cbScript) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const cbScript = _cbScript
                ? (0, ScriptFilePath_1.resolveScriptFilePath)(NetscriptHelpers_1.helpers.string(ctx, "cbScript", _cbScript), ctx.workerScript.name)
                : false;
            if (cbScript === null)
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Could not resolve file path: ${_cbScript}`);
            if (_player_1.Player.queuedAugmentations.length === 0) {
                NetscriptHelpers_1.helpers.log(ctx, () => "You do not have any Augmentations to be installed.");
                return false;
            }
            _player_1.Player.gainIntelligenceExp(Constants_1.CONSTANTS.IntelligenceSingFnBaseExpGain * 10);
            NetscriptHelpers_1.helpers.log(ctx, () => "Installing Augmentations. This will cause this script to be killed");
            (0, AugmentationHelpers_1.installAugmentations)();
            if (cbScript)
                setTimeout(() => runAfterReset(cbScript), 500);
        },
        goToLocation: (ctx) => (_locationName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const locationName = NetscriptHelpers_1.helpers.string(ctx, "locationName", _locationName);
            const location = Object.values(Locations_1.Locations).find((l) => l.name === locationName);
            if (!location) {
                NetscriptHelpers_1.helpers.log(ctx, () => `No location named ${locationName}`);
                return false;
            }
            if (location.city && _player_1.Player.city !== location.city) {
                NetscriptHelpers_1.helpers.log(ctx, () => `No location named ${locationName} in ${_player_1.Player.city}`);
                return false;
            }
            if (location.name === _enums_1.LocationName.TravelAgency) {
                GameRoot_1.Router.toPage(Router_1.Page.Travel);
            }
            else if (location.name === _enums_1.LocationName.WorldStockExchange) {
                GameRoot_1.Router.toPage(Router_1.Page.StockMarket);
            }
            else {
                GameRoot_1.Router.toPage(Router_1.Page.Location, { location });
            }
            _player_1.Player.gainIntelligenceExp(Constants_1.CONSTANTS.IntelligenceSingFnBaseExpGain / 50000);
            return true;
        },
        universityCourse: (ctx) => (_universityName, _className, _focus = true) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const universityName = NetscriptHelpers_1.helpers.string(ctx, "universityName", _universityName);
            const classType = (0, EnumHelper_1.getEnumHelper)("UniversityClassType").nsGetMember(ctx, _className);
            const focus = !!_focus;
            const wasFocusing = _player_1.Player.focus;
            switch (universityName) {
                case _enums_1.LocationName.AevumSummitUniversity:
                    if (_player_1.Player.city !== _enums_1.CityName.Aevum) {
                        NetscriptHelpers_1.helpers.log(ctx, () => `You cannot study at 'Summit University' because you are not in '${_enums_1.CityName.Aevum}'.`);
                        return false;
                    }
                    _player_1.Player.gotoLocation(_enums_1.LocationName.AevumSummitUniversity);
                    break;
                case _enums_1.LocationName.Sector12RothmanUniversity:
                    if (_player_1.Player.city !== _enums_1.CityName.Sector12) {
                        NetscriptHelpers_1.helpers.log(ctx, () => `You cannot study at 'Rothman University' because you are not in '${_enums_1.CityName.Sector12}'.`);
                        return false;
                    }
                    _player_1.Player.gotoLocation(_enums_1.LocationName.Sector12RothmanUniversity);
                    break;
                case _enums_1.LocationName.VolhavenZBInstituteOfTechnology:
                    if (_player_1.Player.city !== _enums_1.CityName.Volhaven) {
                        NetscriptHelpers_1.helpers.log(ctx, () => `You cannot study at 'ZB Institute of Technology' because you are not in '${_enums_1.CityName.Volhaven}'.`);
                        return false;
                    }
                    _player_1.Player.gotoLocation(_enums_1.LocationName.VolhavenZBInstituteOfTechnology);
                    break;
                default:
                    NetscriptHelpers_1.helpers.log(ctx, () => `Invalid university name: '${universityName}'.`);
                    return false;
            }
            _player_1.Player.startWork(new ClassWork_1.ClassWork({
                classType,
                location: _player_1.Player.location,
                singularity: true,
            }));
            if (focus) {
                _player_1.Player.startFocusing();
                GameRoot_1.Router.toPage(Router_1.Page.Work);
            }
            else if (wasFocusing) {
                _player_1.Player.stopFocusing();
                GameRoot_1.Router.toPage(Router_1.Page.Terminal);
            }
            NetscriptHelpers_1.helpers.log(ctx, () => `Started ${classType} at ${universityName}`);
            return true;
        },
        gymWorkout: (ctx) => (_gymName, _stat, _focus = true) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const gymName = NetscriptHelpers_1.helpers.string(ctx, "gymName", _gymName);
            const classType = (0, EnumHelper_1.getEnumHelper)("GymType").nsGetMember(ctx, _stat);
            const focus = !!_focus;
            const wasFocusing = _player_1.Player.focus;
            switch (gymName) {
                case _enums_1.LocationName.AevumCrushFitnessGym:
                    if (_player_1.Player.city !== _enums_1.CityName.Aevum) {
                        NetscriptHelpers_1.helpers.log(ctx, () => `You cannot workout at '${_enums_1.LocationName.AevumCrushFitnessGym}' because you are not in '${_enums_1.CityName.Aevum}'.`);
                        return false;
                    }
                    _player_1.Player.gotoLocation(_enums_1.LocationName.AevumCrushFitnessGym);
                    break;
                case _enums_1.LocationName.AevumSnapFitnessGym:
                    if (_player_1.Player.city !== _enums_1.CityName.Aevum) {
                        NetscriptHelpers_1.helpers.log(ctx, () => `You cannot workout at '${_enums_1.LocationName.AevumSnapFitnessGym}' because you are not in '${_enums_1.CityName.Aevum}'.`);
                        return false;
                    }
                    _player_1.Player.gotoLocation(_enums_1.LocationName.AevumSnapFitnessGym);
                    break;
                case _enums_1.LocationName.Sector12IronGym:
                    if (_player_1.Player.city !== _enums_1.CityName.Sector12) {
                        NetscriptHelpers_1.helpers.log(ctx, () => `You cannot workout at '${_enums_1.LocationName.Sector12IronGym}' because you are not in '${_enums_1.CityName.Sector12}'.`);
                        return false;
                    }
                    _player_1.Player.gotoLocation(_enums_1.LocationName.Sector12IronGym);
                    break;
                case _enums_1.LocationName.Sector12PowerhouseGym:
                    if (_player_1.Player.city !== _enums_1.CityName.Sector12) {
                        NetscriptHelpers_1.helpers.log(ctx, () => `You cannot workout at '${_enums_1.LocationName.Sector12PowerhouseGym}' because you are not in '${_enums_1.CityName.Sector12}'.`);
                        return false;
                    }
                    _player_1.Player.gotoLocation(_enums_1.LocationName.Sector12PowerhouseGym);
                    break;
                case _enums_1.LocationName.VolhavenMilleniumFitnessGym:
                    if (_player_1.Player.city !== _enums_1.CityName.Volhaven) {
                        NetscriptHelpers_1.helpers.log(ctx, () => `You cannot workout at '${_enums_1.LocationName.VolhavenMilleniumFitnessGym}' because you are not in '${_enums_1.CityName.Volhaven}'.`);
                        return false;
                    }
                    _player_1.Player.gotoLocation(_enums_1.LocationName.VolhavenMilleniumFitnessGym);
                    break;
                default:
                    NetscriptHelpers_1.helpers.log(ctx, () => `Invalid gym name: ${gymName}. gymWorkout() failed`);
                    return false;
            }
            _player_1.Player.startWork(new ClassWork_1.ClassWork({ classType, location: _player_1.Player.location, singularity: true }));
            if (focus) {
                _player_1.Player.startFocusing();
                GameRoot_1.Router.toPage(Router_1.Page.Work);
            }
            else if (wasFocusing) {
                _player_1.Player.stopFocusing();
                GameRoot_1.Router.toPage(Router_1.Page.Terminal);
            }
            NetscriptHelpers_1.helpers.log(ctx, () => `Started training ${classType} at ${gymName}`);
            return true;
        },
        travelToCity: (ctx) => (_cityName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const cityName = (0, EnumHelper_1.getEnumHelper)("CityName").nsGetMember(ctx, _cityName);
            switch (cityName) {
                case _enums_1.CityName.Aevum:
                case _enums_1.CityName.Chongqing:
                case _enums_1.CityName.Sector12:
                case _enums_1.CityName.NewTokyo:
                case _enums_1.CityName.Ishima:
                case _enums_1.CityName.Volhaven:
                    if (!_player_1.Player.travel(cityName)) {
                        NetscriptHelpers_1.helpers.log(ctx, () => "Not enough money to travel.");
                        return false;
                    }
                    NetscriptHelpers_1.helpers.log(ctx, () => `Traveled to ${cityName}`);
                    _player_1.Player.gainIntelligenceExp(Constants_1.CONSTANTS.IntelligenceSingFnBaseExpGain / 50000);
                    return true;
                default:
                    throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid city name: '${cityName}'.`);
            }
        },
        purchaseTor: (ctx) => () => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            if (_player_1.Player.hasTorRouter()) {
                NetscriptHelpers_1.helpers.log(ctx, () => "You already have a TOR router!");
                return true;
            }
            if (_player_1.Player.money < Constants_1.CONSTANTS.TorRouterCost) {
                NetscriptHelpers_1.helpers.log(ctx, () => "You cannot afford to purchase a Tor router.");
                return false;
            }
            _player_1.Player.loseMoney(Constants_1.CONSTANTS.TorRouterCost, "other");
            const darkweb = (0, AllServers_1.GetServer)(SpecialServers_1.SpecialServers.DarkWeb);
            if (!darkweb)
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, "DarkWeb was not a server but should have been");
            _player_1.Player.getHomeComputer().serversOnNetwork.push(darkweb.hostname);
            darkweb.serversOnNetwork.push(_player_1.Player.getHomeComputer().hostname);
            _player_1.Player.gainIntelligenceExp(Constants_1.CONSTANTS.IntelligenceSingFnBaseExpGain / 500);
            NetscriptHelpers_1.helpers.log(ctx, () => "You have purchased a Tor router!");
            return true;
        },
        purchaseProgram: (ctx) => (_programName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const programName = NetscriptHelpers_1.helpers.string(ctx, "programName", _programName).toLowerCase();
            if (!_player_1.Player.hasTorRouter()) {
                NetscriptHelpers_1.helpers.log(ctx, () => "You do not have the TOR router.");
                return false;
            }
            const item = Object.values(DarkWebItems_1.DarkWebItems).find((i) => i.program.toLowerCase() === programName);
            if (item == null) {
                NetscriptHelpers_1.helpers.log(ctx, () => `Invalid program name: '${programName}.`);
                return false;
            }
            if (_player_1.Player.hasProgram(item.program)) {
                NetscriptHelpers_1.helpers.log(ctx, () => `You already have the '${item.program}' program`);
                return true;
            }
            if (_player_1.Player.money < item.price) {
                NetscriptHelpers_1.helpers.log(ctx, () => `Not enough money to purchase '${item.program}'. Need ${(0, formatNumber_1.formatMoney)(item.price)}`);
                return false;
            }
            _player_1.Player.getHomeComputer().pushProgram(item.program);
            // Cancel if the program is in progress of writing
            if ((0, CreateProgramWork_1.isCreateProgramWork)(_player_1.Player.currentWork) && _player_1.Player.currentWork.programName === item.program) {
                _player_1.Player.finishWork(true);
            }
            _player_1.Player.loseMoney(item.price, "other");
            NetscriptHelpers_1.helpers.log(ctx, () => `You have purchased the '${item.program}' program. The new program can be found on your home computer.`);
            _player_1.Player.gainIntelligenceExp(Constants_1.CONSTANTS.IntelligenceSingFnBaseExpGain / 5000);
            return true;
        },
        getCurrentServer: (ctx) => (_returnOpts) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const returnOpts = NetscriptHelpers_1.helpers.hostReturnOptions(_returnOpts);
            const server = _player_1.Player.getCurrentServer();
            return NetscriptHelpers_1.helpers.returnServerID(server, returnOpts);
        },
        cat: (ctx) => (_filename) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const filename = NetscriptHelpers_1.helpers.string(ctx, "filename", _filename);
            const server = _player_1.Player.getCurrentServer();
            (0, cat_1.cat)([filename], server);
        },
        connect: (ctx) => (_host) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const host = NetscriptHelpers_1.helpers.string(ctx, "host", _host);
            if (!host) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid server: '${host}'`);
            }
            const target = (0, AllServers_1.GetServer)(host);
            if (target == null) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid server: '${host}'`);
            }
            // Adjacent servers
            const server = _player_1.Player.getCurrentServer();
            for (let i = 0; i < server.serversOnNetwork.length; i++) {
                const other = (0, ServerHelpers_1.getServerOnNetwork)(server, i);
                if (other === null) {
                    (0, exceptionAlert_1.exceptionAlert)(new Error(`${server.serversOnNetwork[i]} is on the network of ${server.hostname}, but we cannot find its data.`));
                    return false;
                }
                if (other.hostname === target.hostname) {
                    Terminal_1.Terminal.connectToServer(host, true);
                    return true;
                }
            }
            /**
             * Backdoored + owned servers (home, private servers, or hacknet servers). With home computer, purchasedByPlayer
             * is true.
             */
            if (target.backdoorInstalled || target.purchasedByPlayer) {
                Terminal_1.Terminal.connectToServer(host, true);
                return true;
            }
            // Failure case
            return false;
        },
        manualHack: (ctx) => () => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const server = _player_1.Player.getCurrentServer();
            return NetscriptHelpers_1.helpers.hack(ctx, server.hostname, true, null);
        },
        installBackdoor: (ctx) => async () => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const baseserver = _player_1.Player.getCurrentServer();
            if (!(baseserver instanceof Server_1.Server)) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, "Cannot backdoor this kind of server.");
            }
            const server = baseserver;
            const installTime = ((0, Hacking_1.calculateHackingTime)(server, _player_1.Player) / 4) * 1000;
            // No root access or skill level too low
            const canHack = (0, netscriptCanHack_1.netscriptCanHack)(server, "backdoor");
            if (!canHack.res) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, canHack.msg || "");
            }
            NetscriptHelpers_1.helpers.log(ctx, () => `Installing backdoor on '${server.hostname}' in ${(0, StringHelperFunctions_1.convertTimeMsToTimeElapsedString)(installTime, true)}`);
            return NetscriptHelpers_1.helpers.netscriptDelay(ctx, installTime).then(function () {
                NetscriptHelpers_1.helpers.log(ctx, () => `Successfully installed backdoor on '${server.hostname}'`);
                server.backdoorInstalled = true;
                if (SpecialServers_1.SpecialServers.WorldDaemon === server.hostname) {
                    return GameRoot_1.Router.toPage(Router_1.Page.BitVerse, { flume: false, quick: false });
                }
                // Manunally check for faction invites
                engine_1.Engine.Counters.checkFactionInvitations = 0;
                engine_1.Engine.checkCounters();
            });
        },
        isFocused: (ctx) => () => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            return _player_1.Player.focus;
        },
        setFocus: (ctx) => (_focus) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const focus = !!_focus;
            if (_player_1.Player.currentWork === null) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, "Not currently working");
            }
            if (!_player_1.Player.focus && focus) {
                _player_1.Player.startFocusing();
                GameRoot_1.Router.toPage(Router_1.Page.Work);
                return true;
            }
            else if (_player_1.Player.focus && !focus) {
                _player_1.Player.stopFocusing();
                GameRoot_1.Router.toPage(Router_1.Page.Terminal);
                return true;
            }
            return false;
        },
        hospitalize: (ctx) => () => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            _player_1.Player.hospitalize(true);
        },
        isBusy: (ctx) => () => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            return _player_1.Player.currentWork !== null || GameRoot_1.Router.page() === Router_1.Page.Infiltration || GameRoot_1.Router.page() === Router_1.Page.BitVerse;
        },
        stopAction: (ctx) => () => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const wasWorking = _player_1.Player.currentWork !== null;
            _player_1.Player.finishWork(true);
            return wasWorking;
        },
        upgradeHomeCores: (ctx) => () => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            // Check if we're at max cores
            const homeComputer = _player_1.Player.getHomeComputer();
            if (_player_1.Player.bitNodeOptions.restrictHomePCUpgrade || homeComputer.cpuCores >= 8) {
                NetscriptHelpers_1.helpers.log(ctx, () => `Your home computer is at max cores.`);
                return false;
            }
            const cost = _player_1.Player.getUpgradeHomeCoresCost();
            if (_player_1.Player.money < cost) {
                NetscriptHelpers_1.helpers.log(ctx, () => `You don't have enough money. Need ${(0, formatNumber_1.formatMoney)(cost)}`);
                return false;
            }
            homeComputer.cpuCores += 1;
            _player_1.Player.loseMoney(cost, "servers");
            _player_1.Player.gainIntelligenceExp(Constants_1.CONSTANTS.IntelligenceSingFnBaseExpGain * 2);
            NetscriptHelpers_1.helpers.log(ctx, () => `Purchased an additional core for home computer! It now has ${homeComputer.cpuCores} cores.`);
            return true;
        },
        getUpgradeHomeCoresCost: (ctx) => () => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            return _player_1.Player.getUpgradeHomeCoresCost();
        },
        upgradeHomeRam: (ctx) => () => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            // Check if we're at max RAM
            const homeComputer = _player_1.Player.getHomeComputer();
            if ((_player_1.Player.bitNodeOptions.restrictHomePCUpgrade && homeComputer.maxRam >= 128) ||
                homeComputer.maxRam >= Constants_2.ServerConstants.HomeComputerMaxRam) {
                NetscriptHelpers_1.helpers.log(ctx, () => `Your home computer is at max RAM.`);
                return false;
            }
            const cost = _player_1.Player.getUpgradeHomeRamCost();
            if (_player_1.Player.money < cost) {
                NetscriptHelpers_1.helpers.log(ctx, () => `You don't have enough money. Need ${(0, formatNumber_1.formatMoney)(cost)}`);
                return false;
            }
            homeComputer.maxRam *= 2;
            _player_1.Player.loseMoney(cost, "servers");
            _player_1.Player.gainIntelligenceExp(Constants_1.CONSTANTS.IntelligenceSingFnBaseExpGain * 2);
            NetscriptHelpers_1.helpers.log(ctx, () => `Purchased additional RAM for home computer! It now has ${(0, formatNumber_1.formatRam)(homeComputer.maxRam)} of RAM.`);
            return true;
        },
        getUpgradeHomeRamCost: (ctx) => () => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            return _player_1.Player.getUpgradeHomeRamCost();
        },
        getCompanyPositions: (ctx) => (_companyName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const companyName = (0, EnumHelper_1.getEnumHelper)("CompanyName").nsGetMember(ctx, _companyName);
            return (0, Record_1.getRecordEntries)(CompanyPositions_1.CompanyPositions)
                .filter((_position) => Companies_1.Companies[companyName].hasPosition(_position[0]))
                .map((_position) => _position[1].name);
        },
        getCompanyPositionInfo: (ctx) => (_companyName, _positionName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const companyName = (0, EnumHelper_1.getEnumHelper)("CompanyName").nsGetMember(ctx, _companyName);
            const positionName = (0, EnumHelper_1.getEnumHelper)("JobName").nsGetMember(ctx, _positionName, "positionName");
            const company = Companies_1.Companies[companyName];
            if (!company.hasPosition(positionName)) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Company '${companyName}' does not have position '${positionName}'`);
            }
            const job = CompanyPositions_1.CompanyPositions[positionName];
            const res = {
                name: job.name,
                field: job.field,
                nextPosition: job.nextPosition,
                salary: job.baseSalary * company.salaryMultiplier,
                requiredReputation: (0, utils_1.calculateEffectiveRequiredReputation)(companyName, job.requiredReputation),
                requiredSkills: job.requiredSkills(company.jobStatReqOffset),
            };
            return res;
        },
        workForCompany: (ctx) => (_companyName, _focus = true) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const companyName = (0, EnumHelper_1.getEnumHelper)("CompanyName").nsGetMember(ctx, _companyName);
            const focus = !!_focus;
            const jobName = _player_1.Player.jobs[companyName];
            // Make sure player is actually employed at the company
            if (!jobName) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `You do not have a job at: '${companyName}'`);
            }
            const wasFocused = _player_1.Player.focus;
            _player_1.Player.startWork(new CompanyWork_1.CompanyWork({
                singularity: true,
                companyName: companyName,
            }));
            if (focus) {
                _player_1.Player.startFocusing();
                GameRoot_1.Router.toPage(Router_1.Page.Work);
            }
            else if (wasFocused) {
                _player_1.Player.stopFocusing();
                GameRoot_1.Router.toPage(Router_1.Page.Terminal);
            }
            NetscriptHelpers_1.helpers.log(ctx, () => `Began working at '${companyName}' with position '${jobName}'`);
            return true;
        },
        applyToCompany: (ctx) => (_companyName, _field) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const companyName = (0, EnumHelper_1.getEnumHelper)("CompanyName").nsGetMember(ctx, _companyName);
            const field = (0, EnumHelper_1.getEnumHelper)("JobField").nsGetMember(ctx, _field, "field");
            const company = Companies_1.Companies[companyName];
            const entryPos = CompanyPositions_1.CompanyPositions[JobTracks_1.JobTracks[field][0]];
            const result = _player_1.Player.applyForJob(company, entryPos);
            if (!result.success) {
                NetscriptHelpers_1.helpers.log(ctx, () => `You failed to get a new job/promotion at '${companyName}' in the '${field}' field. Reason: ${result.message}`);
                return null;
            }
            NetscriptHelpers_1.helpers.log(ctx, () => `You were offered a new job at '${companyName}' with position '${result.jobName}'.`);
            return result.jobName;
        },
        quitJob: (ctx) => (_companyName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const companyName = (0, EnumHelper_1.getEnumHelper)("CompanyName").nsGetMember(ctx, _companyName);
            _player_1.Player.quitJob(companyName, true);
        },
        getCompanyRep: (ctx) => (_companyName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const companyName = (0, EnumHelper_1.getEnumHelper)("CompanyName").nsGetMember(ctx, _companyName);
            return Companies_1.Companies[companyName].playerReputation;
        },
        getCompanyFavor: (ctx) => (_companyName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const companyName = (0, EnumHelper_1.getEnumHelper)("CompanyName").nsGetMember(ctx, _companyName);
            return Companies_1.Companies[companyName].favor;
        },
        getCompanyFavorGain: (ctx) => (_companyName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const companyName = (0, EnumHelper_1.getEnumHelper)("CompanyName").nsGetMember(ctx, _companyName);
            const company = Companies_1.Companies[companyName];
            return (0, favor_1.addRepToFavor)(company.favor, company.playerReputation) - company.favor;
        },
        getFactionInviteRequirements: (ctx) => (_facName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const facName = (0, EnumHelper_1.getEnumHelper)("FactionName").nsGetMember(ctx, _facName);
            const fac = Factions_1.Factions[facName];
            return [...fac.getInfo().inviteReqs].map((condition) => condition.toJSON());
        },
        getFactionEnemies: (ctx) => (_facName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const facName = (0, EnumHelper_1.getEnumHelper)("FactionName").nsGetMember(ctx, _facName);
            const fac = Factions_1.Factions[facName];
            return fac.getInfo().enemies.slice();
        },
        checkFactionInvitations: (ctx) => () => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            // Manually trigger a check for faction invites
            engine_1.Engine.Counters.checkFactionInvitations = 0;
            engine_1.Engine.checkCounters();
            // Make a copy of player.factionInvitations
            return _player_1.Player.factionInvitations.slice();
        },
        joinFaction: (ctx) => (_facName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const facName = (0, EnumHelper_1.getEnumHelper)("FactionName").nsGetMember(ctx, _facName);
            if (!_player_1.Player.factionInvitations.includes(facName)) {
                NetscriptHelpers_1.helpers.log(ctx, () => `You have not been invited by faction '${facName}'`);
                return false;
            }
            const fac = Factions_1.Factions[facName];
            (0, FactionHelpers_1.joinFaction)(fac);
            _player_1.Player.gainIntelligenceExp(Constants_1.CONSTANTS.IntelligenceSingFnBaseExpGain * 5);
            NetscriptHelpers_1.helpers.log(ctx, () => `Joined the '${facName}' faction.`);
            return true;
        },
        workForFaction: (ctx) => (_facName, _type, _focus = true) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const facName = (0, EnumHelper_1.getEnumHelper)("FactionName").nsGetMember(ctx, _facName);
            const type = (0, EnumHelper_1.getEnumHelper)("FactionWorkType").nsGetMember(ctx, _type);
            const focus = !!_focus;
            const faction = Factions_1.Factions[facName];
            // if the player is in a gang and the target faction is any of the gang faction, fail
            if (_player_1.Player.gang && faction.name === _player_1.Player.getGangFaction().name) {
                NetscriptHelpers_1.helpers.log(ctx, () => `You can't work for '${facName}' because you are managing a gang for it`);
                return false;
            }
            if (!_player_1.Player.factions.includes(facName)) {
                NetscriptHelpers_1.helpers.log(ctx, () => `You are not a member of '${facName}'`);
                return false;
            }
            const wasFocusing = _player_1.Player.focus;
            switch (type) {
                case _enums_1.FactionWorkType.hacking:
                    if (!FactionInfo_1.FactionInfos[faction.name].offerHackingWork) {
                        NetscriptHelpers_1.helpers.log(ctx, () => `Faction '${faction.name}' do not need help with hacking contracts.`);
                        return false;
                    }
                    _player_1.Player.startWork(new FactionWork_1.FactionWork({
                        singularity: true,
                        factionWorkType: _enums_1.FactionWorkType.hacking,
                        faction: faction.name,
                    }));
                    if (focus) {
                        _player_1.Player.startFocusing();
                        GameRoot_1.Router.toPage(Router_1.Page.Work);
                    }
                    else if (wasFocusing) {
                        _player_1.Player.stopFocusing();
                        GameRoot_1.Router.toPage(Router_1.Page.Terminal);
                    }
                    NetscriptHelpers_1.helpers.log(ctx, () => `Started carrying out hacking contracts for '${faction.name}'`);
                    return true;
                case _enums_1.FactionWorkType.field:
                    if (!FactionInfo_1.FactionInfos[faction.name].offerFieldWork) {
                        NetscriptHelpers_1.helpers.log(ctx, () => `Faction '${faction.name}' do not need help with field missions.`);
                        return false;
                    }
                    _player_1.Player.startWork(new FactionWork_1.FactionWork({
                        singularity: true,
                        factionWorkType: _enums_1.FactionWorkType.field,
                        faction: faction.name,
                    }));
                    if (focus) {
                        _player_1.Player.startFocusing();
                        GameRoot_1.Router.toPage(Router_1.Page.Work);
                    }
                    else if (wasFocusing) {
                        _player_1.Player.stopFocusing();
                        GameRoot_1.Router.toPage(Router_1.Page.Terminal);
                    }
                    NetscriptHelpers_1.helpers.log(ctx, () => `Started carrying out field missions for '${faction.name}'`);
                    return true;
                case _enums_1.FactionWorkType.security:
                    if (!FactionInfo_1.FactionInfos[faction.name].offerSecurityWork) {
                        NetscriptHelpers_1.helpers.log(ctx, () => `Faction '${faction.name}' do not need help with security work.`);
                        return false;
                    }
                    _player_1.Player.startWork(new FactionWork_1.FactionWork({
                        singularity: true,
                        factionWorkType: _enums_1.FactionWorkType.security,
                        faction: faction.name,
                    }));
                    if (focus) {
                        _player_1.Player.startFocusing();
                        GameRoot_1.Router.toPage(Router_1.Page.Work);
                    }
                    else if (wasFocusing) {
                        _player_1.Player.stopFocusing();
                        GameRoot_1.Router.toPage(Router_1.Page.Terminal);
                    }
                    NetscriptHelpers_1.helpers.log(ctx, () => `Started carrying out security work for '${faction.name}'`);
                    return true;
                default:
                    NetscriptHelpers_1.helpers.log(ctx, () => `Invalid work type: '${type}`);
                    return false;
            }
        },
        getFactionWorkTypes: (ctx) => (_facName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const facName = (0, EnumHelper_1.getEnumHelper)("FactionName").nsGetMember(ctx, _facName);
            // Gang does not offer normal work.
            if (_player_1.Player.gang?.facName === facName) {
                return [];
            }
            const factionInfo = Factions_1.Factions[facName].getInfo();
            const workTypes = [];
            if (factionInfo.offerHackingWork) {
                workTypes.push(_enums_1.FactionWorkType.hacking);
            }
            if (factionInfo.offerFieldWork) {
                workTypes.push(_enums_1.FactionWorkType.field);
            }
            if (factionInfo.offerSecurityWork) {
                workTypes.push(_enums_1.FactionWorkType.security);
            }
            return workTypes;
        },
        getFactionRep: (ctx) => (_facName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const facName = (0, EnumHelper_1.getEnumHelper)("FactionName").nsGetMember(ctx, _facName);
            const faction = Factions_1.Factions[facName];
            return faction.playerReputation;
        },
        getFactionFavor: (ctx) => (_facName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const facName = (0, EnumHelper_1.getEnumHelper)("FactionName").nsGetMember(ctx, _facName);
            const faction = Factions_1.Factions[facName];
            return faction.favor;
        },
        getFactionFavorGain: (ctx) => (_facName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const facName = (0, EnumHelper_1.getEnumHelper)("FactionName").nsGetMember(ctx, _facName);
            const faction = Factions_1.Factions[facName];
            return (0, favor_1.addRepToFavor)(faction.favor, faction.playerReputation) - faction.favor;
        },
        donateToFaction: (ctx) => (_facName, _amt) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const facName = (0, EnumHelper_1.getEnumHelper)("FactionName").nsGetMember(ctx, _facName);
            const amt = NetscriptHelpers_1.helpers.number(ctx, "amt", _amt);
            const faction = Factions_1.Factions[facName];
            if (!_player_1.Player.factions.includes(faction.name)) {
                NetscriptHelpers_1.helpers.log(ctx, () => `You can't donate to '${facName}' because you aren't a member`);
                return false;
            }
            if (_player_1.Player.gang && faction.name === _player_1.Player.getGangFaction().name) {
                NetscriptHelpers_1.helpers.log(ctx, () => `You can't donate to '${facName}' because you are managing a gang for it`);
                return false;
            }
            if (!faction.getInfo().offersWork()) {
                NetscriptHelpers_1.helpers.log(ctx, () => `You can't donate to '${facName}' because this faction does not offer any type of work`);
                return false;
            }
            if (typeof amt !== "number" || amt <= 0 || isNaN(amt)) {
                NetscriptHelpers_1.helpers.log(ctx, () => `Invalid donation amount: '${amt}'.`);
                return false;
            }
            if (_player_1.Player.money < amt) {
                NetscriptHelpers_1.helpers.log(ctx, () => `You do not have enough money to donate ${(0, formatNumber_1.formatMoney)(amt)} to '${facName}'`);
                return false;
            }
            if (faction.favor < (0, donation_1.favorNeededToDonate)()) {
                NetscriptHelpers_1.helpers.log(ctx, () => `You do not have enough favor to donate to this faction. Have ${faction.favor}, need ${(0, donation_1.favorNeededToDonate)()}`);
                return false;
            }
            const repGain = (0, donation_1.donate)(amt, faction);
            NetscriptHelpers_1.helpers.log(ctx, () => `${(0, formatNumber_1.formatMoney)(amt)} donated to '${facName}' for ${(0, formatNumber_1.formatReputation)(repGain)} reputation`);
            return true;
        },
        createProgram: (ctx) => (_programName, _focus = true) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const programName = NetscriptHelpers_1.helpers.string(ctx, "programName", _programName).toLowerCase();
            const focus = !!_focus;
            const wasFocusing = _player_1.Player.focus;
            const p = Object.values(Programs_1.Programs).find((p) => p.name.toLowerCase() === programName);
            if (p == null) {
                NetscriptHelpers_1.helpers.log(ctx, () => `The specified program does not exist: '${programName}'`);
                return false;
            }
            if (_player_1.Player.hasProgram(p.name)) {
                NetscriptHelpers_1.helpers.log(ctx, () => `You already have the '${p.name}' program`);
                return false;
            }
            const create = p.create;
            if (create === null) {
                NetscriptHelpers_1.helpers.log(ctx, () => `You cannot create the '${p.name}' program`);
                return false;
            }
            if (!create.req()) {
                NetscriptHelpers_1.helpers.log(ctx, () => `Hacking level is too low to create '${p.name}' (level ${create.level} req)`);
                return false;
            }
            if (_player_1.Player.currentWork) {
                _player_1.Player.finishWork(true);
            }
            _player_1.Player.startWork(new CreateProgramWork_1.CreateProgramWork({
                programName: p.name,
                singularity: true,
            }));
            if (focus) {
                _player_1.Player.startFocusing();
                GameRoot_1.Router.toPage(Router_1.Page.Work);
            }
            else if (wasFocusing) {
                _player_1.Player.stopFocusing();
                GameRoot_1.Router.toPage(Router_1.Page.Terminal);
            }
            NetscriptHelpers_1.helpers.log(ctx, () => `Began creating program: '${programName}'`);
            return true;
        },
        getHackingLevelRequirementOfProgram: (ctx) => (_programName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const programName = NetscriptHelpers_1.helpers.string(ctx, "programName", _programName).toLowerCase();
            const program = Object.values(Programs_1.Programs).find((p) => p.name.toLowerCase() === programName);
            if (program == null) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `The specified program does not exist: '${programName}'`);
            }
            const create = program.create;
            // Return Infinity if this program cannot be created.
            if (create === null) {
                return Infinity;
            }
            // The hacking level requirement of bitFlume is exactly 1. It does not depend on Intelligence.
            if (program.name === _enums_1.CompletedProgramName.bitFlume) {
                return 1;
            }
            return (0, Programs_1.getEffectiveHackingLevelRequirement)(create.level);
        },
        commitCrime: (ctx) => (_crimeType, _focus) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const crimeType = (0, EnumHelper_1.getEnumHelper)("CrimeType").nsGetMember(ctx, _crimeType);
            const focus = _focus === undefined ? true : !!_focus;
            const wasFocusing = _player_1.Player.focus;
            if (_player_1.Player.currentWork !== null) {
                _player_1.Player.finishWork(true);
            }
            _player_1.Player.gotoLocation(_enums_1.LocationName.Slums);
            const crime = Crimes_1.Crimes[crimeType];
            if (crime == null) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid crime: '${crimeType}'`);
            }
            NetscriptHelpers_1.helpers.log(ctx, () => `Attempting to commit ${crime.type}...`);
            const crimeTime = crime.commit(1, ctx.workerScript);
            if (focus) {
                _player_1.Player.startFocusing();
                GameRoot_1.Router.toPage(Router_1.Page.Work);
            }
            else if (wasFocusing) {
                _player_1.Player.stopFocusing();
                GameRoot_1.Router.toPage(Router_1.Page.Terminal);
            }
            return crimeTime;
        },
        getCrimeChance: (ctx) => (_crimeType) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const crimeType = (0, EnumHelper_1.getEnumHelper)("CrimeType").nsGetMember(ctx, _crimeType);
            const crime = Crimes_1.Crimes[crimeType];
            if (crime == null) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid crime: '${crimeType}'`);
            }
            return crime.successRate(_player_1.Player);
        },
        getCrimeStats: (ctx) => (_crimeType) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const crimeType = (0, EnumHelper_1.getEnumHelper)("CrimeType").nsGetMember(ctx, _crimeType);
            const crime = Crimes_1.Crimes[crimeType];
            if (crime == null) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid crime: '${crimeType}'`);
            }
            const crimeStatsWithMultipliers = (0, Formulas_1.calculateCrimeWorkStats)(_player_1.Player, crime);
            return Object.assign({}, crime, {
                money: crimeStatsWithMultipliers.money,
                reputation: crimeStatsWithMultipliers.reputation,
                hacking_exp: crimeStatsWithMultipliers.hackExp,
                strength_exp: crimeStatsWithMultipliers.strExp,
                defense_exp: crimeStatsWithMultipliers.defExp,
                dexterity_exp: crimeStatsWithMultipliers.dexExp,
                agility_exp: crimeStatsWithMultipliers.agiExp,
                charisma_exp: crimeStatsWithMultipliers.chaExp,
                intelligence_exp: crimeStatsWithMultipliers.intExp,
            });
        },
        getDarkwebPrograms: (ctx) => () => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            // If we don't have Tor, log it and return [] (empty list)
            if (!_player_1.Player.hasTorRouter()) {
                NetscriptHelpers_1.helpers.log(ctx, () => "You do not have the TOR router.");
                return [];
            }
            return Object.values(DarkWebItems_1.DarkWebItems).map((p) => p.program);
        },
        getDarkwebProgramCost: (ctx) => (_programName) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const programName = NetscriptHelpers_1.helpers.string(ctx, "programName", _programName).toLowerCase();
            // If we don't have Tor, log it and return -1
            if (!_player_1.Player.hasTorRouter()) {
                NetscriptHelpers_1.helpers.log(ctx, () => "You do not have the TOR router.");
                // returning -1 rather than throwing an error to be consistent with purchaseProgram
                // which returns false if tor has
                return -1;
            }
            const item = Object.values(DarkWebItems_1.DarkWebItems).find((i) => i.program.toLowerCase() === programName);
            // If the program doesn't exist, throw an error. The reasoning here is that the 99% case is that
            // the player will be using this in automation scripts, and if they're asking for a program that
            // doesn't exist, it's the first time they've run the script. So throw an error to let them know
            // that they need to fix it.
            if (item == null) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `No such exploit ('${programName}') found on the darkweb! ` +
                    `\nThis function is not case-sensitive. Did you perhaps forget .exe at the end?`);
            }
            if (_player_1.Player.hasProgram(item.program)) {
                NetscriptHelpers_1.helpers.log(ctx, () => `You already have the '${item.program}' program`);
                return 0;
            }
            return item.price;
        },
        b1tflum3: (ctx) => (_nextBN, _cbScript, _bitNodeOptions) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const nextBN = NetscriptHelpers_1.helpers.number(ctx, "nextBN", _nextBN);
            const cbScript = _cbScript
                ? (0, ScriptFilePath_1.resolveScriptFilePath)(NetscriptHelpers_1.helpers.string(ctx, "cbScript", _cbScript), ctx.workerScript.name)
                : false;
            if (cbScript === null) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Could not resolve file path. callbackScript is null.`);
            }
            (0, RedPill_1.enterBitNode)(true, _player_1.Player.bitNodeN, nextBN, NetscriptHelpers_1.helpers.validateBitNodeOptions(ctx, _bitNodeOptions));
            if (cbScript) {
                setTimeout(() => runAfterReset(cbScript), 500);
            }
        },
        destroyW0r1dD43m0n: (ctx) => (_nextBN, _cbScript, _bitNodeOptions) => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const nextBN = NetscriptHelpers_1.helpers.number(ctx, "nextBN", _nextBN);
            if (!Constants_3.validBitNodes.includes(nextBN)) {
                throw new Error(`Invalid BitNode: ${_nextBN}.`);
            }
            const cbScript = _cbScript
                ? (0, ScriptFilePath_1.resolveScriptFilePath)(NetscriptHelpers_1.helpers.string(ctx, "cbScript", _cbScript), ctx.workerScript.name)
                : false;
            if (cbScript === null) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Could not resolve file path. callbackScript is null.`);
            }
            const wd = (0, AllServers_1.GetServer)(SpecialServers_1.SpecialServers.WorldDaemon);
            if (!(wd instanceof Server_1.Server)) {
                throw new Error("WorldDaemon is not a normal server. This is a bug. Please contact developers.");
            }
            const hackingRequirements = () => {
                if (_player_1.Player.skills.hacking < wd.requiredHackingSkill || !wd.hasAdminRights) {
                    return false;
                }
                return true;
            };
            const bladeburnerRequirements = () => {
                if (!_player_1.Player.bladeburner) {
                    return false;
                }
                return _player_1.Player.bladeburner.numBlackOpsComplete >= BlackOperations_1.blackOpsArray.length;
            };
            if (!hackingRequirements() && !bladeburnerRequirements()) {
                NetscriptHelpers_1.helpers.log(ctx, () => "Requirements not met to destroy the world daemon");
                return;
            }
            wd.backdoorInstalled = true;
            (0, Achievements_1.calculateAchievements)();
            (0, RedPill_1.enterBitNode)(false, _player_1.Player.bitNodeN, nextBN, NetscriptHelpers_1.helpers.validateBitNodeOptions(ctx, _bitNodeOptions));
            if (cbScript) {
                setTimeout(() => runAfterReset(cbScript), 500);
            }
        },
        getCurrentWork: (ctx) => () => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            if (!_player_1.Player.currentWork)
                return null;
            return _player_1.Player.currentWork.APICopy();
        },
        getSaveData: (ctx) => async () => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            const saveData = await SaveObject_1.saveObject.getSaveData();
            if (typeof saveData === "string") {
                // saveData is the base64-encoded json save string. A base64-encoded string only uses ASCII characters, so it's
                // fine to use new TextEncoder().encode() to encode it to a Uint8Array.
                return new TextEncoder().encode(saveData);
            }
            // saveData is the compressed json save string.
            return saveData;
        },
        exportGame: (ctx) => () => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            return SaveObject_1.saveObject.exportGame();
        },
        exportGameBonus: (ctx) => () => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            return (0, ExportBonus_1.canGetBonus)();
        },
        getUnlockedAchievements: (ctx) => () => {
            NetscriptHelpers_1.helpers.checkSingularityAccess(ctx);
            return Object.values(_player_1.Player.achievements).map((a) => a.ID);
        },
    };
    // Removed functions
    (0, APIWrapper_1.setRemovedFunctions)(singularityAPI, {
        getAugmentationCost: {
            version: "2.2.0",
            replacement: "singularity.getAugmentationPrice and singularity.getAugmentationRepReq",
        },
    });
    return singularityAPI;
}
