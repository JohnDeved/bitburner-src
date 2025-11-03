"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonSchemaValidator = void 0;
const ajv_1 = __importDefault(require("ajv"));
const AllGangsSchema_1 = require("./Data/AllGangsSchema");
const KeyBindingSchema_1 = require("./Data/KeyBindingSchema");
const StockMarketSchema_1 = require("./Data/StockMarketSchema");
const StylesSchema_1 = require("./Data/StylesSchema");
const ThemeSchema_1 = require("./Data/ThemeSchema");
const ajv = new ajv_1.default();
const ajvWithRemoveAdditionalOption = new ajv_1.default({ removeAdditional: "all" });
exports.JsonSchemaValidator = {
    AllGangs: ajv.compile(AllGangsSchema_1.AllGangsSchema),
    StockMarket: ajv.compile(StockMarketSchema_1.StockMarketSchema),
    MainTheme: ajvWithRemoveAdditionalOption.compile(ThemeSchema_1.MainThemeSchema),
    EditorTheme: ajvWithRemoveAdditionalOption.compile(ThemeSchema_1.EditorThemeSchema),
    Styles: ajvWithRemoveAdditionalOption.compile(StylesSchema_1.StylesSchema),
    KeyBindingsSchema: ajvWithRemoveAdditionalOption.compile(KeyBindingSchema_1.KeyBindingsSchema),
};
