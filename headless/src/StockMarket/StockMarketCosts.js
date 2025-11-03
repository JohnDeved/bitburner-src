"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockMarket4SDataCost = getStockMarket4SDataCost;
exports.getStockMarket4STixApiCost = getStockMarket4STixApiCost;
exports.getStockMarketWseCost = getStockMarketWseCost;
exports.getStockMarketTixApiCost = getStockMarketTixApiCost;
const BitNodeMultipliers_1 = require("../BitNode/BitNodeMultipliers");
const Constants_1 = require("./data/Constants");
function getStockMarket4SDataCost() {
    return Constants_1.StockMarketConstants.MarketData4SCost * BitNodeMultipliers_1.currentNodeMults.FourSigmaMarketDataCost;
}
function getStockMarket4STixApiCost() {
    return Constants_1.StockMarketConstants.MarketDataTixApi4SCost * BitNodeMultipliers_1.currentNodeMults.FourSigmaMarketDataApiCost;
}
function getStockMarketWseCost() {
    return Constants_1.StockMarketConstants.WseAccountCost;
}
function getStockMarketTixApiCost() {
    return Constants_1.StockMarketConstants.TixApiCost;
}
