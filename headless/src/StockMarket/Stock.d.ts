import { IMinMaxRange } from "../types";
import { IReviverValue } from "../utils/JSONReviver";
export declare const StockForecastInfluenceLimit = 5;
export interface IConstructorParams {
    b: boolean;
    initPrice: number | IMinMaxRange;
    marketCap: number;
    mv: number | IMinMaxRange;
    name: string;
    otlkMag: number;
    spreadPerc: number | IMinMaxRange;
    shareTxForMovement: number | IMinMaxRange;
    symbol: string;
}
/** Represents the valuation of a company in the World Stock Exchange. */
export declare class Stock {
    /** Bear or bull (more likely to go up or down, based on otlkMag) */
    b: boolean;
    /** Maximum price of a stock (per share) */
    readonly cap: number;
    /** Stocks previous share price */
    lastPrice: number;
    /** Maximum number of shares that player can own (both long and short combined) */
    readonly maxShares: number;
    /** Maximum volatility */
    readonly mv: number;
    /** Name of the company that the stock is for */
    readonly name: string;
    /**
     * Outlook magnitude. Represents the stock's forecast and likelihood
     * of increasing/decreasing (based on whether its in bear or bull mode)
     */
    otlkMag: number;
    /**
     * Forecast of outlook magnitude. Essentially a second-order forecast.
     * Unlike 'otlkMag', this number is on an absolute scale from 0-100 (rather than 0-50)
     */
    otlkMagForecast: number;
    /** Average price of stocks that the player owns in the LONG position */
    playerAvgPx: number;
    /** Average price of stocks that the player owns in the SHORT position */
    playerAvgShortPx: number;
    /** Number of shares the player owns in the LONG position */
    playerShares: number;
    /** Number of shares the player owns in the SHORT position */
    playerShortShares: number;
    /** Stock's share price */
    price: number;
    /** How many shares need to be transacted in order to trigger a price movement */
    readonly shareTxForMovement: number;
    /**
     * How many share transactions remaining until a price movement occurs
     * (separately tracked for upward and downward movements)
     */
    shareTxUntilMovement: number;
    /**
     * Spread percentage. The bid/ask prices for this stock are N% above or below
     * the "real price" to emulate spread.
     */
    readonly spreadPerc: number;
    /** The stock's ticker symbol */
    readonly symbol: string;
    /**
     * Total number of shares of this stock
     * This is different than maxShares, as this is like authorized stock while
     * maxShares is outstanding stock.
     */
    readonly totalShares: number;
    constructor(p?: IConstructorParams);
    /** Safely set the stock's second-order forecast to a new value */
    changeForecastForecast(newff: number): void;
    /** Set the stock to a new price. Also updates the stock's previous price tracker */
    changePrice(newPrice: number): void;
    /**
     * Change the stock's forecast during a stock market 'tick'.
     * The way a stock's forecast changes depends on various internal properties,
     * but is ultimately determined by RNG
     */
    cycleForecast(changeAmt?: number): void;
    /**
     * Change's the stock's second-order forecast during a stock market 'tick'.
     * The change for the second-order forecast to increase is 50/50
     */
    cycleForecastForecast(changeAmt?: number): void;
    /**
     * "Flip" the stock's second-order forecast. This can occur during a
     * stock market "cycle" (determined by RNG). It is used to simulate
     * RL stock market cycles and introduce volatility
     */
    flipForecastForecast(): void;
    /** Returns the stock's absolute forecast, which is a number between 0-100 */
    getAbsoluteForecast(): number;
    /** Return the price at which YOUR stock is bought (market ask price). Accounts for spread */
    getAskPrice(): number;
    /** Return the price at which YOUR stock is sold (market bid price). Accounts for spread */
    getBidPrice(): number;
    /** Returns the chance (0-1 decimal) that a stock has of having its forecast increase */
    getForecastIncreaseChance(): number;
    /**
     * Changes a stock's forecast. This is used when the stock is influenced
     * by a transaction. The stock's forecast always goes towards 50, but the
     * movement is capped by a certain threshold/limit
     */
    influenceForecast(change: number): void;
    /**
     * Changes a stock's second-order forecast. This is used when the stock is
     * influenced by a transaction. The stock's second-order forecast always
     * goes towards 50.
     */
    influenceForecastForecast(change: number): void;
    /** Serialize the Stock to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a Stock from a JSON save state */
    static fromJSON(value: IReviverValue): Stock;
}
