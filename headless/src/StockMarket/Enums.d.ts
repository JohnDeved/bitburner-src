import { LocationName } from "@enums";
export declare enum OrderType {
    LimitBuy = "Limit Buy Order",
    LimitSell = "Limit Sell Order",
    StopBuy = "Stop Buy Order",
    StopSell = "Stop Sell Order"
}
export declare enum PositionType {
    Long = "L",
    Short = "S"
}
export declare const StockSymbol: {
    readonly [LocationName.AevumECorp]: "ECP";
    readonly [LocationName.Sector12MegaCorp]: "MGCP";
    readonly [LocationName.Sector12BladeIndustries]: "BLD";
    readonly [LocationName.AevumClarkeIncorporated]: "CLRK";
    readonly [LocationName.VolhavenOmniTekIncorporated]: "OMTK";
    readonly [LocationName.Sector12FourSigma]: "FSIG";
    readonly [LocationName.ChongqingKuaiGongInternational]: "KGI";
    readonly [LocationName.AevumFulcrumTechnologies]: "FLCM";
    readonly [LocationName.IshimaStormTechnologies]: "STM";
    readonly [LocationName.NewTokyoDefComm]: "DCOMM";
    readonly [LocationName.VolhavenHeliosLabs]: "HLS";
    readonly [LocationName.NewTokyoVitaLife]: "VITA";
    readonly [LocationName.Sector12IcarusMicrosystems]: "ICRS";
    readonly [LocationName.Sector12UniversalEnergy]: "UNV";
    readonly [LocationName.AevumAeroCorp]: "AERO";
    readonly [LocationName.VolhavenOmniaCybersystems]: "OMN";
    readonly [LocationName.ChongqingSolarisSpaceSystems]: "SLRS";
    readonly [LocationName.NewTokyoGlobalPharmaceuticals]: "GPH";
    readonly [LocationName.IshimaNovaMedical]: "NVMD";
    readonly [LocationName.AevumWatchdogSecurity]: "WDS";
    readonly [LocationName.VolhavenLexoCorp]: "LXO";
    readonly [LocationName.AevumRhoConstruction]: "RHOC";
    readonly [LocationName.Sector12AlphaEnterprises]: "APHE";
    readonly [LocationName.VolhavenSysCoreSecurities]: "SYSC";
    readonly [LocationName.VolhavenCompuTek]: "CTK";
    readonly [LocationName.AevumNetLinkTechnologies]: "NTLK";
    readonly [LocationName.IshimaOmegaSoftware]: "OMGA";
    readonly [LocationName.Sector12FoodNStuff]: "FNS";
    readonly [LocationName.Sector12JoesGuns]: "JGN";
    readonly "Sigma Cosmetics": "SGC";
    readonly "Catalyst Ventures": "CTYS";
    readonly "Microdyne Technologies": "MDYN";
    readonly "Titan Laboratories": "TITN";
};
export type StockSymbol = (typeof StockSymbol)[keyof typeof StockSymbol];
