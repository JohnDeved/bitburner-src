"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMarketPromise = exports.SymbolToStockMap = exports.StockMarket = void 0;
exports.getDefaultEmptyStockMarket = getDefaultEmptyStockMarket;
exports.placeOrder = placeOrder;
exports.cancelOrder = cancelOrder;
exports.loadStockMarket = loadStockMarket;
exports.canAccessStockMarket = canAccessStockMarket;
exports.isStockMarketInitialized = isStockMarketInitialized;
exports.deleteStockMarket = deleteStockMarket;
exports.initStockMarket = initStockMarket;
exports.initSymbolToStockMap = initSymbolToStockMap;
exports.processStockPrices = processStockPrices;
const Order_1 = require("./Order");
const Constants_1 = require("./data/Constants");
const OrderProcessing_1 = require("./OrderProcessing");
const Stock_1 = require("./Stock");
const InitStockMetadata_1 = require("./data/InitStockMetadata");
const _enums_1 = require("@enums");
const Constants_2 = require("../Constants");
const formatNumber_1 = require("../ui/formatNumber");
const DialogBox_1 = require("../ui/React/DialogBox");
const GenericReviver_1 = require("../utils/GenericReviver");
const NetscriptHelpers_1 = require("../Netscript/NetscriptHelpers");
const getRandomIntInclusive_1 = require("../utils/helpers/getRandomIntInclusive");
const JsonSchemaValidator_1 = require("../JsonSchema/JsonSchemaValidator");
const Player_1 = require("../Player");
function getDefaultEmptyStockMarket() {
    return {
        lastUpdate: 0,
        Orders: {},
        storedCycles: 0,
        ticksUntilCycle: 0,
    };
}
exports.StockMarket = getDefaultEmptyStockMarket(); // Maps full stock name -> Stock object
// Gross type, needs to be addressed
exports.SymbolToStockMap = {}; // Maps symbol -> Stock object
exports.StockMarketPromise = { promise: null, resolve: null };
function placeOrder(stock, shares, price, type, position, ctx) {
    if (!(stock instanceof Stock_1.Stock)) {
        if (ctx) {
            NetscriptHelpers_1.helpers.log(ctx, () => `Invalid stock: '${stock}'`);
        }
        else {
            (0, DialogBox_1.dialogBoxCreate)(`ERROR: Invalid stock passed to placeOrder() function`);
        }
        return false;
    }
    if (typeof shares !== "number" || typeof price !== "number") {
        if (ctx) {
            NetscriptHelpers_1.helpers.log(ctx, () => `Invalid arguments: shares='${shares}' price='${price}'`);
        }
        else {
            (0, DialogBox_1.dialogBoxCreate)("ERROR: Invalid numeric value provided for either 'shares' or 'price' argument");
        }
        return false;
    }
    const order = new Order_1.Order(stock.symbol, shares, price, type, position);
    if (exports.StockMarket.Orders == null) {
        const orders = {};
        for (const name of Object.keys(exports.StockMarket)) {
            const stk = exports.StockMarket[name];
            if (!(stk instanceof Stock_1.Stock)) {
                continue;
            }
            orders[stk.symbol] = [];
        }
        exports.StockMarket.Orders = orders;
    }
    exports.StockMarket.Orders[stock.symbol].push(order);
    // Process to see if it should be executed immediately
    const processOrderRefs = {
        stockMarket: exports.StockMarket,
        symbolToStockMap: exports.SymbolToStockMap,
    };
    (0, OrderProcessing_1.processOrders)(stock, order.type, order.pos, processOrderRefs);
    return true;
}
function cancelOrder(params, ctx) {
    if (exports.StockMarket.Orders == null)
        return false;
    if (params.order && params.order instanceof Order_1.Order) {
        const order = params.order;
        // An 'Order' object is passed in
        const stockOrders = exports.StockMarket.Orders[order.stockSymbol];
        for (let i = 0; i < stockOrders.length; ++i) {
            if (order == stockOrders[i]) {
                stockOrders.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    else if (params.stock &&
        params.shares &&
        params.price &&
        params.type &&
        params.pos &&
        params.stock instanceof Stock_1.Stock) {
        // Order properties are passed in. Need to look for the order
        const stockOrders = exports.StockMarket.Orders[params.stock.symbol];
        const orderTxt = params.stock.symbol + " - " + params.shares + " @ " + (0, formatNumber_1.formatMoney)(params.price);
        for (let i = 0; i < stockOrders.length; ++i) {
            const order = stockOrders[i];
            if (params.shares === order.shares &&
                params.price === order.price &&
                params.type === order.type &&
                params.pos === order.pos) {
                stockOrders.splice(i, 1);
                if (ctx)
                    NetscriptHelpers_1.helpers.log(ctx, () => "Successfully cancelled order: " + orderTxt);
                return true;
            }
        }
        if (ctx)
            NetscriptHelpers_1.helpers.log(ctx, () => "Failed to cancel order: " + orderTxt);
        return false;
    }
    return false;
}
function loadStockMarket(saveString) {
    let stockMarketData;
    let validate;
    try {
        stockMarketData = JSON.parse(saveString, GenericReviver_1.Reviver);
        validate = JsonSchemaValidator_1.JsonSchemaValidator.StockMarket;
        if (!validate(stockMarketData)) {
            console.error("validate.errors:", validate.errors);
            // validate.errors is an array of objects, so we need to use JSON.stringify.
            throw new Error(JSON.stringify(validate.errors));
        }
    }
    catch (error) {
        console.error(error);
        console.error("Invalid StockMarketSave:", saveString);
        deleteStockMarket();
        if (canAccessStockMarket()) {
            initStockMarket();
        }
        const errorMessage = `Cannot load data of StockMarket. StockMarket is reset.`;
        setTimeout(() => {
            (0, DialogBox_1.dialogBoxCreate)(errorMessage);
        }, 1000);
        return;
    }
    // Typecasting here is fine because we validated the loaded data.
    exports.StockMarket = stockMarketData;
}
function canAccessStockMarket() {
    return Player_1.Player.hasWseAccount || Player_1.Player.hasTixApiAccess;
}
function isStockMarketInitialized() {
    return exports.StockMarket.lastUpdate > 0;
}
/**
 * After calling this function, the stock market will be back to the uninitialized state (i.e.,
 * isStockMarketInitialized() returns false).
 */
function deleteStockMarket() {
    exports.StockMarket = getDefaultEmptyStockMarket();
}
function initStockMarket() {
    for (const stockName of Object.getOwnPropertyNames(exports.StockMarket)) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete exports.StockMarket[stockName];
    }
    for (const metadata of InitStockMetadata_1.InitStockMetadata) {
        const name = metadata.name;
        exports.StockMarket[name] = new Stock_1.Stock(metadata);
    }
    const orders = {};
    for (const name of Object.keys(exports.StockMarket)) {
        const stock = exports.StockMarket[name];
        if (!(stock instanceof Stock_1.Stock))
            continue;
        orders[stock.symbol] = [];
    }
    exports.StockMarket.Orders = orders;
    exports.StockMarket.storedCycles = 0;
    exports.StockMarket.lastUpdate = Date.now();
    exports.StockMarket.ticksUntilCycle = (0, getRandomIntInclusive_1.getRandomIntInclusive)(1, Constants_1.StockMarketConstants.TicksPerCycle);
    initSymbolToStockMap();
}
function initSymbolToStockMap() {
    for (const [name, symbol] of Object.entries(_enums_1.StockSymbol)) {
        const stock = exports.StockMarket[name];
        if (stock == null) {
            console.error(`Could not find Stock for ${name}`);
            continue;
        }
        exports.SymbolToStockMap[symbol] = stock;
    }
}
function stockMarketCycle() {
    for (const name of Object.keys(exports.StockMarket)) {
        const stock = exports.StockMarket[name];
        if (!(stock instanceof Stock_1.Stock))
            continue;
        const roll = Math.random();
        if (roll < 0.45) {
            stock.b = !stock.b;
            stock.flipForecastForecast();
        }
        exports.StockMarket.ticksUntilCycle = Constants_1.StockMarketConstants.TicksPerCycle;
    }
}
const cyclesPerStockUpdate = Constants_1.StockMarketConstants.msPerStockUpdate / Constants_2.CONSTANTS.MilliPerCycle;
function processStockPrices(numCycles = 1) {
    if (exports.StockMarket.storedCycles == null || isNaN(exports.StockMarket.storedCycles)) {
        exports.StockMarket.storedCycles = 0;
    }
    exports.StockMarket.storedCycles += numCycles;
    if (exports.StockMarket.storedCycles < cyclesPerStockUpdate) {
        return;
    }
    // We can process the update every 4 seconds as long as there are enough
    // stored cycles. This lets us account for offline time
    const timeNow = new Date().getTime();
    if (timeNow - exports.StockMarket.lastUpdate < Constants_1.StockMarketConstants.msPerStockUpdateMin)
        return;
    exports.StockMarket.lastUpdate = timeNow;
    exports.StockMarket.storedCycles -= cyclesPerStockUpdate;
    // Cycle
    if (exports.StockMarket.ticksUntilCycle == null || typeof exports.StockMarket.ticksUntilCycle !== "number") {
        exports.StockMarket.ticksUntilCycle = Constants_1.StockMarketConstants.TicksPerCycle;
    }
    --exports.StockMarket.ticksUntilCycle;
    if (exports.StockMarket.ticksUntilCycle <= 0)
        stockMarketCycle();
    const v = Math.random();
    for (const name of Object.keys(exports.StockMarket)) {
        const stock = exports.StockMarket[name];
        if (!(stock instanceof Stock_1.Stock))
            continue;
        let av = (v * stock.mv) / 100;
        if (isNaN(av)) {
            av = 0.02;
        }
        let chc = 50;
        if (stock.b) {
            chc = (chc + stock.otlkMag) / 100;
        }
        else {
            chc = (chc - stock.otlkMag) / 100;
        }
        if (stock.price >= stock.cap) {
            chc = 0.1; // "Soft Limit" on stock price. It could still go up but its unlikely
            stock.b = false;
        }
        if (isNaN(chc)) {
            chc = 0.5;
        }
        const c = Math.random();
        const processOrderRefs = {
            stockMarket: exports.StockMarket,
            symbolToStockMap: exports.SymbolToStockMap,
        };
        if (c < chc) {
            stock.changePrice(stock.price * (1 + av));
            (0, OrderProcessing_1.processOrders)(stock, _enums_1.OrderType.LimitBuy, _enums_1.PositionType.Short, processOrderRefs);
            (0, OrderProcessing_1.processOrders)(stock, _enums_1.OrderType.LimitSell, _enums_1.PositionType.Long, processOrderRefs);
            (0, OrderProcessing_1.processOrders)(stock, _enums_1.OrderType.StopBuy, _enums_1.PositionType.Long, processOrderRefs);
            (0, OrderProcessing_1.processOrders)(stock, _enums_1.OrderType.StopSell, _enums_1.PositionType.Short, processOrderRefs);
        }
        else {
            stock.changePrice(stock.price / (1 + av));
            (0, OrderProcessing_1.processOrders)(stock, _enums_1.OrderType.LimitBuy, _enums_1.PositionType.Long, processOrderRefs);
            (0, OrderProcessing_1.processOrders)(stock, _enums_1.OrderType.LimitSell, _enums_1.PositionType.Short, processOrderRefs);
            (0, OrderProcessing_1.processOrders)(stock, _enums_1.OrderType.StopBuy, _enums_1.PositionType.Short, processOrderRefs);
            (0, OrderProcessing_1.processOrders)(stock, _enums_1.OrderType.StopSell, _enums_1.PositionType.Long, processOrderRefs);
        }
        let otlkMagChange = stock.otlkMag * av;
        if (stock.otlkMag < 5) {
            if (stock.otlkMag <= 1) {
                otlkMagChange = 1;
            }
            else {
                otlkMagChange *= 10;
            }
        }
        stock.cycleForecast(otlkMagChange);
        stock.cycleForecastForecast(otlkMagChange / 2);
        // Shares required for price movement gradually approaches max over time
        stock.shareTxUntilMovement = Math.min(stock.shareTxUntilMovement + 10, stock.shareTxForMovement);
    }
    // Handle "nextUpdate" resolver after this update
    if (exports.StockMarketPromise.resolve) {
        exports.StockMarketPromise.resolve(Constants_1.StockMarketConstants.msPerStockUpdate);
        exports.StockMarketPromise.resolve = null;
        exports.StockMarketPromise.promise = null;
    }
}
