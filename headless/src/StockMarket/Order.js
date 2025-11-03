"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
/**
 * Represents a Limit or Buy Order on the stock market. Does not represent
 * a Market Order since those are just executed immediately
 */
const _enums_1 = require("@enums");
const JSONReviver_1 = require("../utils/JSONReviver");
class Order {
    constructor(stockSymbol = "", shares = 0, price = 0, typ = _enums_1.OrderType.LimitBuy, pos = _enums_1.PositionType.Long) {
        // Validate arguments
        let invalidArgs = false;
        if (typeof shares !== "number" || typeof price !== "number") {
            invalidArgs = true;
        }
        if (isNaN(shares) || isNaN(price)) {
            invalidArgs = true;
        }
        if (typeof stockSymbol !== "string") {
            invalidArgs = true;
        }
        if (invalidArgs) {
            throw new Error(`Invalid constructor parameters for Order`);
        }
        this.stockSymbol = stockSymbol;
        this.shares = shares;
        this.price = price;
        this.type = typ;
        this.pos = pos;
    }
    /** Serialize the Order to a JSON save state. */
    toJSON() {
        return (0, JSONReviver_1.Generic_toJSON)("Order", this);
    }
    /** Initializes a Order from a JSON save state */
    static fromJSON(value) {
        return (0, JSONReviver_1.Generic_fromJSON)(Order, value.data);
    }
}
exports.Order = Order;
JSONReviver_1.constructorsForReviver.Order = Order;
