"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorpUnlocks = void 0;
const _enums_1 = require("@enums");
// Corporation Unlock Upgrades
// Upgrades for entire corporation, unlocks features, either you have it or you don't.
exports.CorpUnlocks = {
    //Lets you export goods
    [_enums_1.CorpUnlockName.Export]: {
        name: _enums_1.CorpUnlockName.Export,
        price: 20e9,
        desc: "Develop infrastructure to export your materials to your other facilities. " +
            "This allows you to move materials around between different divisions and cities.",
    },
    //Lets you buy exactly however many required materials you need for production
    [_enums_1.CorpUnlockName.SmartSupply]: {
        name: _enums_1.CorpUnlockName.SmartSupply,
        price: 25e9,
        desc: "Use advanced AI to anticipate your supply needs. " +
            "This allows you to purchase exactly however many materials you need for production.",
    },
    //Displays each material/product's demand
    [_enums_1.CorpUnlockName.MarketResearchDemand]: {
        name: _enums_1.CorpUnlockName.MarketResearchDemand,
        price: 5e9,
        desc: "Mine and analyze market data to determine the demand of all resources. " +
            "The demand attribute, which affects sales, will be displayed for every material and product.",
    },
    //Display's each material/product's competition
    [_enums_1.CorpUnlockName.MarketDataCompetition]: {
        name: _enums_1.CorpUnlockName.MarketDataCompetition,
        price: 5e9,
        desc: "Mine and analyze market data to determine how much competition there is on the market " +
            "for all resources. The competition attribute, which affects sales, will be displayed for " +
            "every material and product.",
    },
    [_enums_1.CorpUnlockName.ShadyAccounting]: {
        name: _enums_1.CorpUnlockName.ShadyAccounting,
        price: 500e12,
        desc: "Utilize unscrupulous accounting practices and pay off government officials to save money " +
            "on tribute. This reduces the tribute modifier by 0.05.",
    },
    [_enums_1.CorpUnlockName.GovernmentPartnership]: {
        name: _enums_1.CorpUnlockName.GovernmentPartnership,
        price: 2e15,
        desc: "Help national governments further their agendas in exchange for lowered tribute. " +
            "This reduces the tribute modifier by 0.1",
    },
    [_enums_1.CorpUnlockName.WarehouseAPI]: {
        name: _enums_1.CorpUnlockName.WarehouseAPI,
        price: 50e9,
        desc: "Enables the warehouse API.",
    },
    [_enums_1.CorpUnlockName.OfficeAPI]: {
        name: _enums_1.CorpUnlockName.OfficeAPI,
        price: 50e9,
        desc: "Enables the office API.",
    },
};
