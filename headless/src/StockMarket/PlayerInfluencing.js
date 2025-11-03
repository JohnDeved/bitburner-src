"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forecastForecastChangeFromCompanyWork = exports.forecastForecastChangeFromHack = void 0;
exports.influenceStockThroughServerHack = influenceStockThroughServerHack;
exports.influenceStockThroughServerGrow = influenceStockThroughServerGrow;
exports.influenceStockThroughCompanyWork = influenceStockThroughCompanyWork;
/**
 * Implementation of the mechanisms that allow the player to affect the
 * Stock Market
 */
const Stock_1 = require("./Stock");
const StockMarket_1 = require("./StockMarket");
// Change in second-order forecast due to hacks/grows
exports.forecastForecastChangeFromHack = 0.1;
// Change in second-order forecast due to company work
exports.forecastForecastChangeFromCompanyWork = 0.001;
/**
 * Potentially decreases a stock's second-order forecast when its corresponding
 * server is hacked. The chance of the hack decreasing the stock's second-order
 * forecast is dependent on what percentage of the server's money is hacked
 * @param {Server} server - Server being hack()ed
 * @param {number} moneyHacked - Amount of money stolen from the server
 */
function influenceStockThroughServerHack(server, moneyHacked) {
    const orgName = server.organizationName;
    let stock = null;
    if (typeof orgName === "string" && orgName !== "") {
        stock = StockMarket_1.StockMarket[orgName];
    }
    if (!(stock instanceof Stock_1.Stock)) {
        return;
    }
    const percTotalMoneyHacked = moneyHacked / server.moneyMax;
    if (Math.random() < percTotalMoneyHacked) {
        stock.changeForecastForecast(stock.otlkMagForecast - exports.forecastForecastChangeFromHack);
    }
}
/**
 * Potentially increases a stock's second-order forecast when its corresponding
 * server is grown (grow()). The chance of the grow() to increase the stock's
 * second-order forecast is dependent on how much money is added to the server
 * @param {Server} server - Server being grow()n
 * @param {number} moneyGrown - Amount of money added to the server
 */
function influenceStockThroughServerGrow(server, moneyGrown) {
    const orgName = server.organizationName;
    let stock = null;
    if (typeof orgName === "string" && orgName !== "") {
        stock = StockMarket_1.StockMarket[orgName];
    }
    if (!(stock instanceof Stock_1.Stock)) {
        return;
    }
    const percTotalMoneyGrown = moneyGrown / server.moneyMax;
    if (Math.random() < percTotalMoneyGrown) {
        stock.changeForecastForecast(stock.otlkMagForecast + exports.forecastForecastChangeFromHack);
    }
}
/**
 * Potentially increases a stock's second-order forecast when the player works for
 * its corresponding company.
 * @param {Company} company - Company being worked for
 * @param {number} performanceMult - Effectiveness of player's work. Affects influence
 * @param {number} cyclesOfWork - # game cycles of work being processed
 */
function influenceStockThroughCompanyWork(company, performanceMult, cyclesOfWork) {
    const compName = company.name;
    let stock = null;
    stock = StockMarket_1.StockMarket[compName];
    if (!(stock instanceof Stock_1.Stock)) {
        return;
    }
    if (Math.random() < 0.002 * cyclesOfWork) {
        const change = exports.forecastForecastChangeFromCompanyWork * performanceMult;
        stock.changeForecastForecast(stock.otlkMagForecast + change);
    }
}
