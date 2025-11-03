/**
 * It's intentional to not use JSONSchemaType here. The data structure of StockMarket is not suitable for the usage of
 * JSONSchemaType. These are 2 biggest problems:
 * - IStockMarket is an intersection type. In our case, satisfying TS's type-checking for JSONSchemaType is too hard.
 * - Stock and Order are classes, not interfaces or types. In those classes, we have functions, but functions are not
 * supported by JSON (without ugly hacks). Let's use the "Order" class as an example. The Order class has the toJSON
 * function, so ajv forces us to define the "toJSON" property. If we define it, we have to give it a "type". In
 * JavaScript, a function is just an object, so the naive solution is to use {type:"object"}. However, the generated
 * validation code uses "typeof" to check the data. "typeof functionName" is "function", not "object", so ajv sees it as
 * invalid data. There are some ways to work around this problem, but all of them are complicated. In the end,
 * JSONSchemaType is only a utility type. If our schema is designed and tested properly, after the validation, we can
 * typecast the data.
 */
export declare const StockMarketSchema: {
    $schema: string;
    type: string;
    patternProperties: {
        /**
         * IStockMarket is an intersection type combining:
         * - Record<string, Stock> [1]
         * - {lastUpdate: number;Orders: IOrderBook;storedCycles: number;ticksUntilCycle: number;} [2]
         *
         * StockMarketSchema contains:
         * - patternProperties: Defines [1]. The following regex matches all properties that are not in [2]. It defines the
         * map of "Full stock name -> Stock".
         * - properties: Define [2].
         *
         * Note that with [1], our code allows unknown stocks. Let's say the player loads a save file with this entry in
         * [1]: UnknownCorp123 -> Stock with symbol UCP123. Although this stock is not in our list of "valid" stocks, we
         * still process it normally. By "tolerating" unknown stocks, we allow loading a save file created in:
         * - Old versions with unsupported stocks: In very old versions (v1.2.0 and older ones), the "full stock name" of
         * "Joe's Guns" is "Joes Guns".
         * - New versions with unknown stocks.
         */
        "^(?!(lastUpdate|Orders|storedCycles|ticksUntilCycle))": {
            type: string;
            properties: {
                b: {
                    type: string;
                };
                cap: {
                    type: string;
                };
                lastPrice: {
                    type: string;
                };
                maxShares: {
                    type: string;
                };
                mv: {
                    type: string;
                };
                name: {
                    type: string;
                };
                otlkMag: {
                    type: string;
                };
                otlkMagForecast: {
                    type: string;
                };
                playerAvgPx: {
                    type: string;
                };
                playerAvgShortPx: {
                    type: string;
                };
                playerShares: {
                    type: string;
                };
                playerShortShares: {
                    type: string;
                };
                price: {
                    type: string;
                };
                shareTxForMovement: {
                    type: string;
                };
                shareTxUntilMovement: {
                    type: string;
                };
                spreadPerc: {
                    type: string;
                };
                symbol: {
                    type: string;
                };
                totalShares: {
                    type: string;
                };
            };
            required: string[];
        };
    };
    properties: {
        lastUpdate: {
            type: string;
        };
        Orders: {
            type: string;
            patternProperties: {
                ".*": {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            pos: {
                                type: string;
                                enum: any[];
                            };
                            price: {
                                type: string;
                            };
                            shares: {
                                type: string;
                            };
                            stockSymbol: {
                                type: string;
                            };
                            type: {
                                type: string;
                                enum: any[];
                            };
                        };
                        required: string[];
                    };
                };
            };
        };
        storedCycles: {
            type: string;
        };
        ticksUntilCycle: {
            type: string;
        };
    };
    required: string[];
};
