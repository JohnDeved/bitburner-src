/**
 * Represents a Limit or Buy Order on the stock market. Does not represent
 * a Market Order since those are just executed immediately
 */
import { PositionType, OrderType } from "@enums";
import { IReviverValue } from "../utils/JSONReviver";
export declare class Order {
    readonly pos: PositionType;
    readonly price: number;
    shares: number;
    readonly stockSymbol: string;
    readonly type: OrderType;
    constructor(stockSymbol?: string, shares?: number, price?: number, typ?: OrderType, pos?: PositionType);
    /** Serialize the Order to a JSON save state. */
    toJSON(): IReviverValue;
    /** Initializes a Order from a JSON save state */
    static fromJSON(value: IReviverValue): Order;
}
