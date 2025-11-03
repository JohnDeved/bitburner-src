"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationsMetadata = void 0;
/**
 * Metadata for constructing Location objects for all Locations
 * in the game
 */
const _enums_1 = require("@enums");
exports.LocationsMetadata = [
    {
        city: _enums_1.CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 12,
            startingSecurityLevel: 8.18,
        },
        name: _enums_1.LocationName.AevumAeroCorp,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 15,
            startingSecurityLevel: 8.19,
        },
        name: _enums_1.LocationName.AevumBachmanAndAssociates,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 18,
            startingSecurityLevel: 9.55,
        },
        name: _enums_1.LocationName.AevumClarkeIncorporated,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Aevum,
        costMult: 3,
        expMult: 2,
        name: _enums_1.LocationName.AevumCrushFitnessGym,
        types: [_enums_1.LocationType.Gym],
    },
    {
        city: _enums_1.CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 37,
            startingSecurityLevel: 17.02,
        },
        name: _enums_1.LocationName.AevumECorp,
        types: [_enums_1.LocationType.Company, _enums_1.LocationType.TechVendor],
        techVendorMaxRam: 512,
        techVendorMinRam: 128,
    },
    {
        city: _enums_1.CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 15.54,
        },
        name: _enums_1.LocationName.AevumFulcrumTechnologies,
        types: [_enums_1.LocationType.Company, _enums_1.LocationType.TechVendor],
        techVendorMaxRam: 1024,
        techVendorMinRam: 256,
    },
    {
        city: _enums_1.CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 12,
            startingSecurityLevel: 7.89,
        },
        name: _enums_1.LocationName.AevumGalacticCybersystems,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 6,
            startingSecurityLevel: 3.29,
        },
        name: _enums_1.LocationName.AevumNetLinkTechnologies,
        types: [_enums_1.LocationType.Company, _enums_1.LocationType.TechVendor],
        techVendorMaxRam: 64,
        techVendorMinRam: 8,
    },
    {
        city: _enums_1.CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 6,
            startingSecurityLevel: 5.35,
        },
        name: _enums_1.LocationName.AevumPolice,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 5,
            startingSecurityLevel: 5.02,
        },
        name: _enums_1.LocationName.AevumRhoConstruction,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Aevum,
        costMult: 10,
        expMult: 5,
        name: _enums_1.LocationName.AevumSnapFitnessGym,
        types: [_enums_1.LocationType.Gym],
    },
    {
        city: _enums_1.CityName.Aevum,
        costMult: 4,
        expMult: 3,
        name: _enums_1.LocationName.AevumSummitUniversity,
        types: [_enums_1.LocationType.University],
    },
    {
        city: _enums_1.CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 7,
            startingSecurityLevel: 5.85,
        },
        name: _enums_1.LocationName.AevumWatchdogSecurity,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Aevum,
        name: _enums_1.LocationName.AevumCasino,
        types: [_enums_1.LocationType.Casino],
    },
    {
        city: _enums_1.CityName.Chongqing,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 16.25,
        },
        name: _enums_1.LocationName.ChongqingKuaiGongInternational,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Chongqing,
        infiltrationData: {
            maxClearanceLevel: 18,
            startingSecurityLevel: 12.59,
        },
        name: _enums_1.LocationName.ChongqingSolarisSpaceSystems,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Ishima,
        infiltrationData: {
            maxClearanceLevel: 12,
            startingSecurityLevel: 5.02,
        },
        name: _enums_1.LocationName.IshimaNovaMedical,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Ishima,
        infiltrationData: {
            maxClearanceLevel: 10,
            startingSecurityLevel: 3.2,
        },
        name: _enums_1.LocationName.IshimaOmegaSoftware,
        types: [_enums_1.LocationType.Company, _enums_1.LocationType.TechVendor],
        techVendorMaxRam: 128,
        techVendorMinRam: 4,
    },
    {
        city: _enums_1.CityName.Ishima,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 5.38,
        },
        name: _enums_1.LocationName.IshimaStormTechnologies,
        types: [_enums_1.LocationType.Company, _enums_1.LocationType.TechVendor],
        techVendorMaxRam: 512,
        techVendorMinRam: 32,
    },
    {
        city: _enums_1.CityName.NewTokyo,
        infiltrationData: {
            maxClearanceLevel: 17,
            startingSecurityLevel: 7.18,
        },
        name: _enums_1.LocationName.NewTokyoDefComm,
        types: [_enums_1.LocationType.Company, _enums_1.LocationType.Special],
    },
    {
        city: _enums_1.CityName.NewTokyo,
        infiltrationData: {
            maxClearanceLevel: 20,
            startingSecurityLevel: 5.9,
        },
        name: _enums_1.LocationName.NewTokyoGlobalPharmaceuticals,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.NewTokyo,
        infiltrationData: {
            maxClearanceLevel: 5,
            startingSecurityLevel: 2.5,
        },
        name: _enums_1.LocationName.NewTokyoNoodleBar,
        types: [_enums_1.LocationType.Company, _enums_1.LocationType.Special],
    },
    {
        city: _enums_1.CityName.NewTokyo,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 5.52,
        },
        name: _enums_1.LocationName.NewTokyoVitaLife,
        types: [_enums_1.LocationType.Company, _enums_1.LocationType.Special],
    },
    {
        city: _enums_1.CityName.NewTokyo,
        name: _enums_1.LocationName.NewTokyoArcade,
        types: [_enums_1.LocationType.Special],
    },
    {
        city: _enums_1.CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 10,
            startingSecurityLevel: 3.62,
        },
        name: _enums_1.LocationName.Sector12AlphaEnterprises,
        types: [_enums_1.LocationType.Company, _enums_1.LocationType.TechVendor],
        techVendorMaxRam: 8,
        techVendorMinRam: 2,
    },
    {
        city: _enums_1.CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 10.59,
        },
        name: _enums_1.LocationName.Sector12BladeIndustries,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Sector12,
        name: _enums_1.LocationName.Sector12CIA,
        types: [_enums_1.LocationType.Company, _enums_1.LocationType.Special],
    },
    {
        city: _enums_1.CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 15,
            startingSecurityLevel: 4.66,
        },
        name: _enums_1.LocationName.Sector12CarmichaelSecurity,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Sector12,
        name: _enums_1.LocationName.Sector12CityHall,
        types: [_enums_1.LocationType.Special],
    },
    {
        city: _enums_1.CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 12,
            startingSecurityLevel: 5.9,
        },
        name: _enums_1.LocationName.Sector12DeltaOne,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Sector12,
        name: _enums_1.LocationName.Sector12FoodNStuff,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 8.18,
        },
        name: _enums_1.LocationName.Sector12FourSigma,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 17,
            startingSecurityLevel: 6.02,
        },
        name: _enums_1.LocationName.Sector12IcarusMicrosystems,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Sector12,
        expMult: 1,
        costMult: 1,
        name: _enums_1.LocationName.Sector12IronGym,
        types: [_enums_1.LocationType.Gym],
    },
    {
        city: _enums_1.CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 5,
            startingSecurityLevel: 3.13,
        },
        name: _enums_1.LocationName.Sector12JoesGuns,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 31,
            startingSecurityLevel: 16.36,
        },
        name: _enums_1.LocationName.Sector12MegaCorp,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Sector12,
        name: _enums_1.LocationName.Sector12NSA,
        types: [_enums_1.LocationType.Company, _enums_1.LocationType.Special],
    },
    {
        city: _enums_1.CityName.Sector12,
        costMult: 20,
        expMult: 10,
        name: _enums_1.LocationName.Sector12PowerhouseGym,
        types: [_enums_1.LocationType.Gym],
    },
    {
        city: _enums_1.CityName.Sector12,
        costMult: 3,
        expMult: 2,
        name: _enums_1.LocationName.Sector12RothmanUniversity,
        types: [_enums_1.LocationType.University],
    },
    {
        city: _enums_1.CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 12,
            startingSecurityLevel: 5.9,
        },
        name: _enums_1.LocationName.Sector12UniversalEnergy,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 15,
            startingSecurityLevel: 3.59,
        },
        name: _enums_1.LocationName.VolhavenCompuTek,
        types: [_enums_1.LocationType.Company, _enums_1.LocationType.TechVendor],
        techVendorMaxRam: 256,
        techVendorMinRam: 8,
    },
    {
        city: _enums_1.CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 18,
            startingSecurityLevel: 7.28,
        },
        name: _enums_1.LocationName.VolhavenHeliosLabs,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 15,
            startingSecurityLevel: 4.35,
        },
        name: _enums_1.LocationName.VolhavenLexoCorp,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Volhaven,
        costMult: 7,
        expMult: 4,
        name: _enums_1.LocationName.VolhavenMilleniumFitnessGym,
        types: [_enums_1.LocationType.Gym],
    },
    {
        city: _enums_1.CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 50,
            startingSecurityLevel: 8.53,
        },
        name: _enums_1.LocationName.VolhavenNWO,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 7.74,
        },
        name: _enums_1.LocationName.VolhavenOmniTekIncorporated,
        types: [_enums_1.LocationType.Company, _enums_1.LocationType.TechVendor],
        techVendorMaxRam: 1024,
        techVendorMinRam: 128,
    },
    {
        city: _enums_1.CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 22,
            startingSecurityLevel: 6,
        },
        name: _enums_1.LocationName.VolhavenOmniaCybersystems,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 18,
            startingSecurityLevel: 4.77,
        },
        name: _enums_1.LocationName.VolhavenSysCoreSecurities,
        types: [_enums_1.LocationType.Company],
    },
    {
        city: _enums_1.CityName.Volhaven,
        costMult: 5,
        expMult: 4,
        name: _enums_1.LocationName.VolhavenZBInstituteOfTechnology,
        types: [_enums_1.LocationType.University],
    },
    {
        city: null,
        name: _enums_1.LocationName.Hospital,
        types: [_enums_1.LocationType.Hospital],
    },
    {
        city: null,
        name: _enums_1.LocationName.Slums,
        types: [_enums_1.LocationType.Slums],
    },
    {
        city: null,
        name: _enums_1.LocationName.TravelAgency,
        types: [_enums_1.LocationType.TravelAgency],
    },
    {
        city: null,
        name: _enums_1.LocationName.WorldStockExchange,
        types: [_enums_1.LocationType.StockMarket],
    },
    {
        city: _enums_1.CityName.Chongqing,
        name: _enums_1.LocationName.ChongqingChurchOfTheMachineGod,
        types: [_enums_1.LocationType.Special],
    },
    {
        city: _enums_1.CityName.Ishima,
        name: _enums_1.LocationName.IshimaGlitch,
        types: [_enums_1.LocationType.Special],
    },
];
