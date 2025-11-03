import { Company } from "../Company/Company";
import { Server } from "../Server/Server";
export declare const forecastForecastChangeFromHack = 0.1;
export declare const forecastForecastChangeFromCompanyWork = 0.001;
/**
 * Potentially decreases a stock's second-order forecast when its corresponding
 * server is hacked. The chance of the hack decreasing the stock's second-order
 * forecast is dependent on what percentage of the server's money is hacked
 * @param {Server} server - Server being hack()ed
 * @param {number} moneyHacked - Amount of money stolen from the server
 */
export declare function influenceStockThroughServerHack(server: Server, moneyHacked: number): void;
/**
 * Potentially increases a stock's second-order forecast when its corresponding
 * server is grown (grow()). The chance of the grow() to increase the stock's
 * second-order forecast is dependent on how much money is added to the server
 * @param {Server} server - Server being grow()n
 * @param {number} moneyGrown - Amount of money added to the server
 */
export declare function influenceStockThroughServerGrow(server: Server, moneyGrown: number): void;
/**
 * Potentially increases a stock's second-order forecast when the player works for
 * its corresponding company.
 * @param {Company} company - Company being worked for
 * @param {number} performanceMult - Effectiveness of player's work. Affects influence
 * @param {number} cyclesOfWork - # game cycles of work being processed
 */
export declare function influenceStockThroughCompanyWork(company: Company, performanceMult: number, cyclesOfWork: number): void;
