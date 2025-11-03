"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockSymbol = exports.PositionType = exports.OrderType = void 0;
// Direct import from Locations instead of the barrel file, to avoid circular dependency
const _enums_1 = require("@enums");
// Does not need an enum helper for now
var OrderType;
(function (OrderType) {
    OrderType["LimitBuy"] = "Limit Buy Order";
    OrderType["LimitSell"] = "Limit Sell Order";
    OrderType["StopBuy"] = "Stop Buy Order";
    OrderType["StopSell"] = "Stop Sell Order";
})(OrderType || (exports.OrderType = OrderType = {}));
var PositionType;
(function (PositionType) {
    PositionType["Long"] = "L";
    PositionType["Short"] = "S";
})(PositionType || (exports.PositionType = PositionType = {}));
//Enum-like object because some keys are created via code and have spaces. Still works with an EnumHelper.
exports.StockSymbol = {
    // Stocks for companies at which you can work
    [_enums_1.LocationName.AevumECorp]: "ECP",
    [_enums_1.LocationName.Sector12MegaCorp]: "MGCP",
    [_enums_1.LocationName.Sector12BladeIndustries]: "BLD",
    [_enums_1.LocationName.AevumClarkeIncorporated]: "CLRK",
    [_enums_1.LocationName.VolhavenOmniTekIncorporated]: "OMTK",
    [_enums_1.LocationName.Sector12FourSigma]: "FSIG",
    [_enums_1.LocationName.ChongqingKuaiGongInternational]: "KGI",
    [_enums_1.LocationName.AevumFulcrumTechnologies]: "FLCM",
    [_enums_1.LocationName.IshimaStormTechnologies]: "STM",
    [_enums_1.LocationName.NewTokyoDefComm]: "DCOMM",
    [_enums_1.LocationName.VolhavenHeliosLabs]: "HLS",
    [_enums_1.LocationName.NewTokyoVitaLife]: "VITA",
    [_enums_1.LocationName.Sector12IcarusMicrosystems]: "ICRS",
    [_enums_1.LocationName.Sector12UniversalEnergy]: "UNV",
    [_enums_1.LocationName.AevumAeroCorp]: "AERO",
    [_enums_1.LocationName.VolhavenOmniaCybersystems]: "OMN",
    [_enums_1.LocationName.ChongqingSolarisSpaceSystems]: "SLRS",
    [_enums_1.LocationName.NewTokyoGlobalPharmaceuticals]: "GPH",
    [_enums_1.LocationName.IshimaNovaMedical]: "NVMD",
    [_enums_1.LocationName.AevumWatchdogSecurity]: "WDS",
    [_enums_1.LocationName.VolhavenLexoCorp]: "LXO",
    [_enums_1.LocationName.AevumRhoConstruction]: "RHOC",
    [_enums_1.LocationName.Sector12AlphaEnterprises]: "APHE",
    [_enums_1.LocationName.VolhavenSysCoreSecurities]: "SYSC",
    [_enums_1.LocationName.VolhavenCompuTek]: "CTK",
    [_enums_1.LocationName.AevumNetLinkTechnologies]: "NTLK",
    [_enums_1.LocationName.IshimaOmegaSoftware]: "OMGA",
    [_enums_1.LocationName.Sector12FoodNStuff]: "FNS",
    [_enums_1.LocationName.Sector12JoesGuns]: "JGN",
    // Stocks for other companies
    ["Sigma Cosmetics"]: "SGC",
    ["Catalyst Ventures"]: "CTYS",
    ["Microdyne Technologies"]: "MDYN",
    ["Titan Laboratories"]: "TITN",
};
