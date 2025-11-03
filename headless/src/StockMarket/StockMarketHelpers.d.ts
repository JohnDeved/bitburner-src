import { Stock } from "./Stock";
import { PositionType } from "@enums";
export declare const forecastChangePerPriceMovement = 0.006;
/**
 * Calculate the total cost of a "buy" transaction. This accounts for spread and commission.
 * @param {Stock} stock - Stock being purchased
 * @param {number} shares - Number of shares being transacted
 * @param {PositionType} posType - Long or short position
 * @returns {number | null} Total transaction cost. Returns null for an invalid transaction
 */
export declare function getBuyTransactionCost(stock: Stock, shares: number, posType: PositionType): number | null;
/**
 * Calculate the TOTAL amount of money gained from a sale (NOT net profit). This accounts
 * for spread and commission.
 * @param {Stock} stock - Stock being sold
 * @param {number} shares - Number of shares being transacted
 * @param {PositionType} posType - Long or short position
 * @returns {number | null} Amount of money gained from transaction. Returns null for an invalid transaction
 */
export declare function getSellTransactionGain(stock: Stock, shares: number, posType: PositionType): number | null;
/**
 * Processes a stock's change in forecast & second-order forecast
 * whenever it is transacted
 * @param {Stock} stock - Stock being sold
 * @param {number} shares - Number of shares being transacted
 * @param {PositionType} posType - Long or short position
 */
export declare function processTransactionForecastMovement(stock: Stock, shares: number): void;
/**
 * Calculate the maximum number of shares of a stock that can be purchased.
 * Handles mid-transaction price movements, both L and S positions, etc.
 * Used for the "Buy Max" button in the UI
 * @param {Stock} stock - Stock being purchased
 * @param {PositionType} posType - Long or short position
 * @param {number} money - Amount of money player has
 * @returns maximum number of shares that the player can purchase
 */
export declare function calculateBuyMaxAmount(stock: Stock, posType: PositionType, money: number): number;
