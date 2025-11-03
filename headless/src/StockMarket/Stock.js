"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stock = exports.StockForecastInfluenceLimit = void 0;
const JSONReviver_1 = require("../utils/JSONReviver");
const getRandomIntInclusive_1 = require("../utils/helpers/getRandomIntInclusive");
exports.StockForecastInfluenceLimit = 5;
const defaultConstructorParams = {
    b: true,
    initPrice: 10e3,
    marketCap: 1e12,
    mv: 1,
    name: "",
    otlkMag: 0,
    spreadPerc: 0,
    shareTxForMovement: 1e6,
    symbol: "",
};
// Helper function that convert a IMinMaxRange to a number
function toNumber(n) {
    let value;
    switch (typeof n) {
        case "number": {
            return n;
        }
        case "object": {
            const range = n;
            value = (0, getRandomIntInclusive_1.getRandomIntInclusive)(range.min, range.max);
            break;
        }
        default:
            throw Error(`Do not know how to convert the type '${typeof n}' to a number`);
    }
    if (typeof n === "object" && typeof n.divisor === "number") {
        return value / n.divisor;
    }
    return value;
}
/** Represents the valuation of a company in the World Stock Exchange. */
class Stock {
    constructor(p = defaultConstructorParams) {
        this.name = p.name;
        this.symbol = p.symbol;
        this.price = toNumber(p.initPrice);
        this.lastPrice = this.price;
        this.playerShares = 0;
        this.playerAvgPx = 0;
        this.playerShortShares = 0;
        this.playerAvgShortPx = 0;
        this.mv = toNumber(p.mv);
        this.b = p.b;
        this.otlkMag = p.otlkMag;
        this.otlkMagForecast = this.getAbsoluteForecast();
        this.cap = (0, getRandomIntInclusive_1.getRandomIntInclusive)(this.price * 1e3, this.price * 25e3);
        this.spreadPerc = toNumber(p.spreadPerc);
        this.shareTxForMovement = toNumber(p.shareTxForMovement);
        this.shareTxUntilMovement = this.shareTxForMovement;
        // Total shares is determined by market cap, and is rounded to nearest 100k
        const totalSharesUnrounded = p.marketCap / this.price;
        this.totalShares = Math.round(totalSharesUnrounded / 1e5) * 1e5;
        // Max Shares (Outstanding shares) is a percentage of total shares
        const outstandingSharePercentage = 0.2;
        this.maxShares = Math.round((this.totalShares * outstandingSharePercentage) / 1e5) * 1e5;
    }
    /** Safely set the stock's second-order forecast to a new value */
    changeForecastForecast(newff) {
        this.otlkMagForecast = newff;
        if (this.otlkMagForecast > 100) {
            this.otlkMagForecast = 100;
        }
        else if (this.otlkMagForecast < 0) {
            this.otlkMagForecast = 0;
        }
    }
    /** Set the stock to a new price. Also updates the stock's previous price tracker */
    changePrice(newPrice) {
        this.lastPrice = this.price;
        this.price = newPrice;
    }
    /**
     * Change the stock's forecast during a stock market 'tick'.
     * The way a stock's forecast changes depends on various internal properties,
     * but is ultimately determined by RNG
     */
    cycleForecast(changeAmt = 0.1) {
        const increaseChance = this.getForecastIncreaseChance();
        if (Math.random() < increaseChance) {
            // Forecast increases
            if (this.b) {
                this.otlkMag += changeAmt;
            }
            else {
                this.otlkMag -= changeAmt;
            }
        }
        else if (this.b) {
            // Forecast decreases
            this.otlkMag -= changeAmt;
        }
        else {
            this.otlkMag += changeAmt;
        }
        this.otlkMag = Math.min(this.otlkMag, 50);
        if (this.otlkMag < 0) {
            this.otlkMag *= -1;
            this.b = !this.b;
        }
    }
    /**
     * Change's the stock's second-order forecast during a stock market 'tick'.
     * The change for the second-order forecast to increase is 50/50
     */
    cycleForecastForecast(changeAmt = 0.1) {
        if (Math.random() < 0.5) {
            this.changeForecastForecast(this.otlkMagForecast + changeAmt);
        }
        else {
            this.changeForecastForecast(this.otlkMagForecast - changeAmt);
        }
    }
    /**
     * "Flip" the stock's second-order forecast. This can occur during a
     * stock market "cycle" (determined by RNG). It is used to simulate
     * RL stock market cycles and introduce volatility
     */
    flipForecastForecast() {
        this.otlkMagForecast = 100 - this.otlkMagForecast;
    }
    /** Returns the stock's absolute forecast, which is a number between 0-100 */
    getAbsoluteForecast() {
        return this.b ? 50 + this.otlkMag : 50 - this.otlkMag;
    }
    /** Return the price at which YOUR stock is bought (market ask price). Accounts for spread */
    getAskPrice() {
        return this.price * (1 + this.spreadPerc / 100);
    }
    /** Return the price at which YOUR stock is sold (market bid price). Accounts for spread */
    getBidPrice() {
        return this.price * (1 - this.spreadPerc / 100);
    }
    /** Returns the chance (0-1 decimal) that a stock has of having its forecast increase */
    getForecastIncreaseChance() {
        const diff = this.otlkMagForecast - this.getAbsoluteForecast();
        return (50 + Math.min(Math.max(diff, -45), 45)) / 100;
    }
    /**
     * Changes a stock's forecast. This is used when the stock is influenced
     * by a transaction. The stock's forecast always goes towards 50, but the
     * movement is capped by a certain threshold/limit
     */
    influenceForecast(change) {
        if (this.otlkMag > exports.StockForecastInfluenceLimit) {
            this.otlkMag = Math.max(exports.StockForecastInfluenceLimit, this.otlkMag - change);
        }
    }
    /**
     * Changes a stock's second-order forecast. This is used when the stock is
     * influenced by a transaction. The stock's second-order forecast always
     * goes towards 50.
     */
    influenceForecastForecast(change) {
        if (this.otlkMagForecast > 50) {
            this.otlkMagForecast -= change;
            this.otlkMagForecast = Math.max(50, this.otlkMagForecast);
        }
        else if (this.otlkMagForecast < 50) {
            this.otlkMagForecast += change;
            this.otlkMagForecast = Math.min(50, this.otlkMagForecast);
        }
    }
    /** Serialize the Stock to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("Stock", this);
    }
    /** Initializes a Stock from a JSON save state */
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(Stock, value.data);
    }
}
exports.Stock = Stock;
JSONReviver_1.constructorsForReviver.Stock = Stock;
