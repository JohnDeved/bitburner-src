"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetscriptStockMarket = NetscriptStockMarket;
const _player_1 = require("@player");
const BuyingAndSelling_1 = require("../StockMarket/BuyingAndSelling");
const StockMarket_1 = require("../StockMarket/StockMarket");
const StockMarketHelpers_1 = require("../StockMarket/StockMarketHelpers");
const _enums_1 = require("@enums");
const StockMarketCosts_1 = require("../StockMarket/StockMarketCosts");
const APIWrapper_1 = require("../Netscript/APIWrapper");
const NetscriptHelpers_1 = require("../Netscript/NetscriptHelpers");
const Constants_1 = require("../StockMarket/data/Constants");
const EnumHelper_1 = require("../utils/EnumHelper");
function NetscriptStockMarket() {
    /** Checks if the player has TIX API access. Throws an error if the player does not */
    const checkTixApiAccess = function (ctx) {
        if (!_player_1.Player.hasTixApiAccess) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `You don't have TIX API Access! Cannot use ${ctx.function}()`);
        }
    };
    const getStockFromSymbol = function (ctx, symbol) {
        const stock = StockMarket_1.SymbolToStockMap[symbol];
        if (stock == null) {
            throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid stock symbol: '${symbol}'`);
        }
        return stock;
    };
    const stockFunctions = {
        getConstants: () => () => structuredClone(Constants_1.StockMarketConstants),
        hasWseAccount: () => () => _player_1.Player.hasWseAccount,
        hasTixApiAccess: () => () => _player_1.Player.hasTixApiAccess,
        has4SData: () => () => _player_1.Player.has4SData,
        has4SDataTixApi: () => () => _player_1.Player.has4SDataTixApi,
        getSymbols: (ctx) => () => {
            checkTixApiAccess(ctx);
            return Object.values(_enums_1.StockSymbol);
        },
        getPrice: (ctx) => (_symbol) => {
            const symbol = NetscriptHelpers_1.helpers.string(ctx, "symbol", _symbol);
            checkTixApiAccess(ctx);
            const stock = getStockFromSymbol(ctx, symbol);
            return stock.price;
        },
        getOrganization: (ctx) => (_symbol) => {
            const symbol = NetscriptHelpers_1.helpers.string(ctx, "symbol", _symbol);
            checkTixApiAccess(ctx);
            const stock = getStockFromSymbol(ctx, symbol);
            return stock.name;
        },
        getAskPrice: (ctx) => (_symbol) => {
            const symbol = NetscriptHelpers_1.helpers.string(ctx, "symbol", _symbol);
            checkTixApiAccess(ctx);
            const stock = getStockFromSymbol(ctx, symbol);
            return stock.getAskPrice();
        },
        getBidPrice: (ctx) => (_symbol) => {
            const symbol = NetscriptHelpers_1.helpers.string(ctx, "symbol", _symbol);
            checkTixApiAccess(ctx);
            const stock = getStockFromSymbol(ctx, symbol);
            return stock.getBidPrice();
        },
        getPosition: (ctx) => (_symbol) => {
            const symbol = NetscriptHelpers_1.helpers.string(ctx, "symbol", _symbol);
            checkTixApiAccess(ctx);
            const stock = StockMarket_1.SymbolToStockMap[symbol];
            if (stock == null) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid stock symbol: ${symbol}`);
            }
            return [stock.playerShares, stock.playerAvgPx, stock.playerShortShares, stock.playerAvgShortPx];
        },
        getMaxShares: (ctx) => (_symbol) => {
            const symbol = NetscriptHelpers_1.helpers.string(ctx, "symbol", _symbol);
            checkTixApiAccess(ctx);
            const stock = getStockFromSymbol(ctx, symbol);
            return stock.maxShares;
        },
        getPurchaseCost: (ctx) => (_symbol, _shares, _posType) => {
            const symbol = NetscriptHelpers_1.helpers.string(ctx, "symbol", _symbol);
            let shares = NetscriptHelpers_1.helpers.number(ctx, "shares", _shares);
            const posType = (0, EnumHelper_1.getEnumHelper)("PositionType").nsGetMember(ctx, _posType);
            checkTixApiAccess(ctx);
            const stock = getStockFromSymbol(ctx, symbol);
            shares = Math.round(shares);
            const res = (0, StockMarketHelpers_1.getBuyTransactionCost)(stock, shares, posType);
            if (res == null) {
                return Infinity;
            }
            return res;
        },
        getSaleGain: (ctx) => (_symbol, _shares, _posType) => {
            const symbol = NetscriptHelpers_1.helpers.string(ctx, "symbol", _symbol);
            let shares = NetscriptHelpers_1.helpers.number(ctx, "shares", _shares);
            const posType = (0, EnumHelper_1.getEnumHelper)("PositionType").nsGetMember(ctx, _posType);
            checkTixApiAccess(ctx);
            const stock = getStockFromSymbol(ctx, symbol);
            shares = Math.round(shares);
            const res = (0, StockMarketHelpers_1.getSellTransactionGain)(stock, shares, posType);
            if (res == null) {
                return 0;
            }
            return res;
        },
        buyStock: (ctx) => (_symbol, _shares) => {
            const symbol = NetscriptHelpers_1.helpers.string(ctx, "symbol", _symbol);
            const shares = NetscriptHelpers_1.helpers.number(ctx, "shares", _shares);
            checkTixApiAccess(ctx);
            const stock = getStockFromSymbol(ctx, symbol);
            const res = (0, BuyingAndSelling_1.buyStock)(stock, shares, ctx, {});
            return res ? stock.getAskPrice() : 0;
        },
        sellStock: (ctx) => (_symbol, _shares) => {
            const symbol = NetscriptHelpers_1.helpers.string(ctx, "symbol", _symbol);
            const shares = NetscriptHelpers_1.helpers.number(ctx, "shares", _shares);
            checkTixApiAccess(ctx);
            const stock = getStockFromSymbol(ctx, symbol);
            const res = (0, BuyingAndSelling_1.sellStock)(stock, shares, ctx, {});
            return res ? stock.getBidPrice() : 0;
        },
        buyShort: (ctx) => (_symbol, _shares) => {
            const symbol = NetscriptHelpers_1.helpers.string(ctx, "symbol", _symbol);
            const shares = NetscriptHelpers_1.helpers.number(ctx, "shares", _shares);
            checkTixApiAccess(ctx);
            if (_player_1.Player.bitNodeN !== 8 && _player_1.Player.activeSourceFileLvl(8) <= 1) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, "You must either be in BitNode-8 or you must have Source-File 8 Level 2.");
            }
            const stock = getStockFromSymbol(ctx, symbol);
            const res = (0, BuyingAndSelling_1.shortStock)(stock, shares, ctx, {});
            return res ? stock.getBidPrice() : 0;
        },
        sellShort: (ctx) => (_symbol, _shares) => {
            const symbol = NetscriptHelpers_1.helpers.string(ctx, "symbol", _symbol);
            const shares = NetscriptHelpers_1.helpers.number(ctx, "shares", _shares);
            checkTixApiAccess(ctx);
            if (_player_1.Player.bitNodeN !== 8 && _player_1.Player.activeSourceFileLvl(8) <= 1) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, "You must either be in BitNode-8 or you must have Source-File 8 Level 2.");
            }
            const stock = getStockFromSymbol(ctx, symbol);
            const res = (0, BuyingAndSelling_1.sellShort)(stock, shares, ctx, {});
            return res ? stock.getAskPrice() : 0;
        },
        placeOrder: (ctx) => (_symbol, _shares, _price, _type, _pos) => {
            const symbol = NetscriptHelpers_1.helpers.string(ctx, "symbol", _symbol);
            const shares = NetscriptHelpers_1.helpers.number(ctx, "shares", _shares);
            const price = NetscriptHelpers_1.helpers.number(ctx, "price", _price);
            const type = (0, EnumHelper_1.getEnumHelper)("OrderType").nsGetMember(ctx, _type);
            const pos = (0, EnumHelper_1.getEnumHelper)("PositionType").nsGetMember(ctx, _pos);
            checkTixApiAccess(ctx);
            if (_player_1.Player.bitNodeN !== 8 && _player_1.Player.activeSourceFileLvl(8) <= 2) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, "You must either be in BitNode-8 or you must have Source-File 8 Level 3.");
            }
            const stock = getStockFromSymbol(ctx, symbol);
            return (0, StockMarket_1.placeOrder)(stock, shares, price, type, pos, ctx);
        },
        cancelOrder: (ctx) => (_symbol, _shares, _price, _type, _pos) => {
            const symbol = NetscriptHelpers_1.helpers.string(ctx, "symbol", _symbol);
            const shares = NetscriptHelpers_1.helpers.number(ctx, "shares", _shares);
            const price = NetscriptHelpers_1.helpers.number(ctx, "price", _price);
            const type = (0, EnumHelper_1.getEnumHelper)("OrderType").nsGetMember(ctx, _type);
            const pos = (0, EnumHelper_1.getEnumHelper)("PositionType").nsGetMember(ctx, _pos);
            checkTixApiAccess(ctx);
            if (_player_1.Player.bitNodeN !== 8 && _player_1.Player.activeSourceFileLvl(8) <= 2) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, "You must either be in BitNode-8 or you must have Source-File 8 Level 3.");
            }
            const stock = getStockFromSymbol(ctx, symbol);
            if (isNaN(shares) || isNaN(price)) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, `Invalid shares or price. Must be numeric. shares=${shares}, price=${price}`);
            }
            return (0, StockMarket_1.cancelOrder)({ stock, shares, price, type, pos }, ctx);
        },
        getOrders: (ctx) => () => {
            checkTixApiAccess(ctx);
            if (_player_1.Player.bitNodeN !== 8 && _player_1.Player.activeSourceFileLvl(8) <= 2) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, "You must either be in BitNode-8 or have Source-File 8 Level 3.");
            }
            const orders = {};
            const stockMarketOrders = StockMarket_1.StockMarket.Orders;
            for (const symbol of Object.keys(stockMarketOrders)) {
                const orderBook = stockMarketOrders[symbol];
                if (orderBook.constructor === Array && orderBook.length > 0) {
                    orders[symbol] = [];
                    for (let i = 0; i < orderBook.length; ++i) {
                        orders[symbol].push({
                            shares: orderBook[i].shares,
                            price: orderBook[i].price,
                            type: orderBook[i].type,
                            position: orderBook[i].pos,
                        });
                    }
                }
            }
            return orders;
        },
        getVolatility: (ctx) => (_symbol) => {
            const symbol = NetscriptHelpers_1.helpers.string(ctx, "symbol", _symbol);
            if (!_player_1.Player.has4SDataTixApi) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, "You don't have 4S Market Data TIX API Access!");
            }
            const stock = getStockFromSymbol(ctx, symbol);
            return stock.mv / 100; // Convert from percentage to decimal
        },
        getForecast: (ctx) => (_symbol) => {
            const symbol = NetscriptHelpers_1.helpers.string(ctx, "symbol", _symbol);
            if (!_player_1.Player.has4SDataTixApi) {
                throw NetscriptHelpers_1.helpers.errorMessage(ctx, "You don't have 4S Market Data TIX API Access!");
            }
            const stock = getStockFromSymbol(ctx, symbol);
            let forecast = 50;
            stock.b ? (forecast += stock.otlkMag) : (forecast -= stock.otlkMag);
            return forecast / 100; // Convert from percentage to decimal
        },
        purchase4SMarketData: (ctx) => () => {
            if (_player_1.Player.bitNodeOptions.disable4SData) {
                NetscriptHelpers_1.helpers.log(ctx, () => "4S Market Data is disabled in advanced BitNode options.");
                return false;
            }
            if (_player_1.Player.has4SData) {
                NetscriptHelpers_1.helpers.log(ctx, () => "Already purchased 4S Market Data.");
                return true;
            }
            if (!_player_1.Player.hasWseAccount) {
                NetscriptHelpers_1.helpers.log(ctx, () => "You need to have a WSE account.");
                return false;
            }
            if (_player_1.Player.money < (0, StockMarketCosts_1.getStockMarket4SDataCost)()) {
                NetscriptHelpers_1.helpers.log(ctx, () => "Not enough money to purchase 4S Market Data.");
                return false;
            }
            _player_1.Player.has4SData = true;
            _player_1.Player.loseMoney((0, StockMarketCosts_1.getStockMarket4SDataCost)(), "stock");
            NetscriptHelpers_1.helpers.log(ctx, () => "Purchased 4S Market Data");
            return true;
        },
        purchase4SMarketDataTixApi: (ctx) => () => {
            if (_player_1.Player.bitNodeOptions.disable4SData) {
                NetscriptHelpers_1.helpers.log(ctx, () => "4S Market Data is disabled in advanced BitNode options.");
                return false;
            }
            checkTixApiAccess(ctx);
            if (_player_1.Player.has4SDataTixApi) {
                NetscriptHelpers_1.helpers.log(ctx, () => "Already purchased 4S Market Data TIX API");
                return true;
            }
            if (_player_1.Player.money < (0, StockMarketCosts_1.getStockMarket4STixApiCost)()) {
                NetscriptHelpers_1.helpers.log(ctx, () => "Not enough money to purchase 4S Market Data TIX API");
                return false;
            }
            _player_1.Player.has4SDataTixApi = true;
            _player_1.Player.loseMoney((0, StockMarketCosts_1.getStockMarket4STixApiCost)(), "stock");
            NetscriptHelpers_1.helpers.log(ctx, () => "Purchased 4S Market Data TIX API");
            return true;
        },
        purchaseWseAccount: (ctx) => () => {
            if (_player_1.Player.hasWseAccount) {
                NetscriptHelpers_1.helpers.log(ctx, () => "Already purchased WSE Account");
                return true;
            }
            if (_player_1.Player.money < (0, StockMarketCosts_1.getStockMarketWseCost)()) {
                NetscriptHelpers_1.helpers.log(ctx, () => "Not enough money to purchase WSE Account Access");
                return false;
            }
            _player_1.Player.hasWseAccount = true;
            if (!(0, StockMarket_1.isStockMarketInitialized)()) {
                (0, StockMarket_1.initStockMarket)();
            }
            _player_1.Player.loseMoney((0, StockMarketCosts_1.getStockMarketWseCost)(), "stock");
            NetscriptHelpers_1.helpers.log(ctx, () => "Purchased WSE Account Access");
            return true;
        },
        purchaseTixApi: (ctx) => () => {
            if (_player_1.Player.hasTixApiAccess) {
                NetscriptHelpers_1.helpers.log(ctx, () => "Already purchased TIX API");
                return true;
            }
            if (_player_1.Player.money < (0, StockMarketCosts_1.getStockMarketTixApiCost)()) {
                NetscriptHelpers_1.helpers.log(ctx, () => "Not enough money to purchase TIX API Access");
                return false;
            }
            _player_1.Player.hasTixApiAccess = true;
            if (!(0, StockMarket_1.isStockMarketInitialized)()) {
                (0, StockMarket_1.initStockMarket)();
            }
            _player_1.Player.loseMoney((0, StockMarketCosts_1.getStockMarketTixApiCost)(), "stock");
            NetscriptHelpers_1.helpers.log(ctx, () => "Purchased TIX API");
            return true;
        },
        getBonusTime: (ctx) => () => {
            checkTixApiAccess(ctx);
            return StockMarket_1.StockMarket.storedCycles * 200;
        },
        nextUpdate: (ctx) => () => {
            checkTixApiAccess(ctx);
            if (!StockMarket_1.StockMarketPromise.promise)
                StockMarket_1.StockMarketPromise.promise = new Promise((res) => (StockMarket_1.StockMarketPromise.resolve = res));
            return StockMarket_1.StockMarketPromise.promise;
        },
    };
    (0, APIWrapper_1.setRemovedFunctions)(stockFunctions, {
        hasWSEAccount: { version: "3.0.0", replacement: "stock.hasWseAccount()" },
        hasTIXAPIAccess: { version: "3.0.0", replacement: "stock.hasTixApiAccess()" },
        has4SDataTIXAPI: { version: "3.0.0", replacement: "stock.has4SDataTixApi()" },
    });
    return stockFunctions;
}
