import type { PromisePair } from "../Types/Promises";
import type { IStockMarket } from "./IStockMarket";
import { Order } from "./Order";
import { Stock } from "./Stock";
import { PositionType, OrderType } from "@enums";
import { NetscriptContext } from "../Netscript/APIWrapper";
export declare function getDefaultEmptyStockMarket(): IStockMarket;
export declare let StockMarket: IStockMarket;
export declare const SymbolToStockMap: Record<string, Stock>;
export declare const StockMarketPromise: PromisePair<number>;
export declare function placeOrder(stock: Stock, shares: number, price: number, type: OrderType, position: PositionType, ctx?: NetscriptContext): boolean;
export interface ICancelOrderParams {
    order?: Order;
    pos?: PositionType;
    price?: number;
    shares?: number;
    stock?: Stock;
    type?: OrderType;
}
export declare function cancelOrder(params: ICancelOrderParams, ctx?: NetscriptContext): boolean;
export declare function loadStockMarket(saveString: string): void;
export declare function canAccessStockMarket(): boolean;
export declare function isStockMarketInitialized(): boolean;
/**
 * After calling this function, the stock market will be back to the uninitialized state (i.e.,
 * isStockMarketInitialized() returns false).
 */
export declare function deleteStockMarket(): void;
export declare function initStockMarket(): void;
export declare function initSymbolToStockMap(): void;
export declare function processStockPrices(numCycles?: number): void;
