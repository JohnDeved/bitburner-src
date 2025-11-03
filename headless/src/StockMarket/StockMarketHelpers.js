"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forecastChangePerPriceMovement = void 0;
exports.getBuyTransactionCost = getBuyTransactionCost;
exports.getSellTransactionGain = getSellTransactionGain;
exports.processTransactionForecastMovement = processTransactionForecastMovement;
exports.calculateBuyMaxAmount = calculateBuyMaxAmount;
const Stock_1 = require("./Stock");
const _enums_1 = require("@enums");
const Constants_1 = require("./data/Constants");
// Amount by which a stock's forecast changes during each price movement
exports.forecastChangePerPriceMovement = 0.006;
/**
 * Calculate the total cost of a "buy" transaction. This accounts for spread and commission.
 * @param {Stock} stock - Stock being purchased
 * @param {number} shares - Number of shares being transacted
 * @param {PositionType} posType - Long or short position
 * @returns {number | null} Total transaction cost. Returns null for an invalid transaction
 */
function getBuyTransactionCost(stock, shares, posType) {
    if (isNaN(shares) || shares <= 0 || !(stock instanceof Stock_1.Stock)) {
        return null;
    }
    // Cap the 'shares' arg at the stock's maximum shares. This'll prevent
    // hanging in the case when a really big number is passed in
    shares = Math.min(shares, stock.maxShares);
    const isLong = posType === _enums_1.PositionType.Long;
    // If the number of shares doesn't trigger a price movement, its a simple calculation
    if (isLong) {
        return shares * stock.getAskPrice() + Constants_1.StockMarketConstants.StockMarketCommission;
    }
    else {
        return shares * stock.getBidPrice() + Constants_1.StockMarketConstants.StockMarketCommission;
    }
}
/**
 * Calculate the TOTAL amount of money gained from a sale (NOT net profit). This accounts
 * for spread and commission.
 * @param {Stock} stock - Stock being sold
 * @param {number} shares - Number of shares being transacted
 * @param {PositionType} posType - Long or short position
 * @returns {number | null} Amount of money gained from transaction. Returns null for an invalid transaction
 */
function getSellTransactionGain(stock, shares, posType) {
    if (isNaN(shares) || shares <= 0 || !(stock instanceof Stock_1.Stock)) {
        return null;
    }
    // Cap the 'shares' arg at the stock's maximum shares. This'll prevent
    // hanging in the case when a really big number is passed in
    shares = Math.min(shares, stock.maxShares);
    const isLong = posType === _enums_1.PositionType.Long;
    if (isLong) {
        return shares * stock.getBidPrice() - Constants_1.StockMarketConstants.StockMarketCommission;
    }
    else {
        // Calculating gains for a short position requires calculating the profit made
        const origCost = shares * stock.playerAvgShortPx;
        const profit = (stock.playerAvgShortPx - stock.getAskPrice()) * shares - Constants_1.StockMarketConstants.StockMarketCommission;
        return origCost + profit;
    }
}
/**
 * Processes a stock's change in forecast & second-order forecast
 * whenever it is transacted
 * @param {Stock} stock - Stock being sold
 * @param {number} shares - Number of shares being transacted
 * @param {PositionType} posType - Long or short position
 */
function processTransactionForecastMovement(stock, shares) {
    if (isNaN(shares) || shares <= 0 || !(stock instanceof Stock_1.Stock)) {
        return;
    }
    // Cap the 'shares' arg at the stock's maximum shares. This'll prevent
    // hanging in the case when a really big number is passed in
    shares = Math.min(shares, stock.maxShares);
    // If there's only going to be one iteration at most
    const firstShares = stock.shareTxUntilMovement;
    if (shares <= firstShares) {
        stock.shareTxUntilMovement -= shares;
        if (stock.shareTxUntilMovement <= 0) {
            stock.shareTxUntilMovement = stock.shareTxForMovement;
            stock.influenceForecast(exports.forecastChangePerPriceMovement);
            stock.influenceForecastForecast(exports.forecastChangePerPriceMovement * (stock.mv / 100));
        }
        return;
    }
    // Calculate how many iterations of price changes we need to account for
    const remainingShares = shares - firstShares;
    let numIterations = 1 + Math.ceil(remainingShares / stock.shareTxForMovement);
    // If on the off chance we end up perfectly at the next price movement
    stock.shareTxUntilMovement =
        stock.shareTxForMovement - ((shares - stock.shareTxUntilMovement) % stock.shareTxForMovement);
    if (stock.shareTxUntilMovement === stock.shareTxForMovement || stock.shareTxUntilMovement <= 0) {
        ++numIterations;
        stock.shareTxUntilMovement = stock.shareTxForMovement;
    }
    // Forecast always decreases in magnitude
    const forecastChange = exports.forecastChangePerPriceMovement * (numIterations - 1);
    const forecastForecastChange = forecastChange * (stock.mv / 100);
    stock.influenceForecast(forecastChange);
    stock.influenceForecastForecast(forecastForecastChange);
}
/**
 * Calculate the maximum number of shares of a stock that can be purchased.
 * Handles mid-transaction price movements, both L and S positions, etc.
 * Used for the "Buy Max" button in the UI
 * @param {Stock} stock - Stock being purchased
 * @param {PositionType} posType - Long or short position
 * @param {number} money - Amount of money player has
 * @returns maximum number of shares that the player can purchase
 */
function calculateBuyMaxAmount(stock, posType, money) {
    if (!(stock instanceof Stock_1.Stock)) {
        return 0;
    }
    const isLong = posType === _enums_1.PositionType.Long;
    const remainingMoney = money - Constants_1.StockMarketConstants.StockMarketCommission;
    const currPrice = isLong ? stock.getAskPrice() : stock.getBidPrice();
    return Math.floor(remainingMoney / currPrice);
}
