"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme = void 0;
const screenshot_png_1 = __importDefault(require("./screenshot.png"));
exports.Theme = {
    name: "Default",
    description: "Default game theme, most supported",
    credit: "hydroflame",
    screenshot: screenshot_png_1.default,
    colors: {
        primarylight: "#0f0",
        primary: "#0c0",
        primarydark: "#090",
        successlight: "#0f0",
        success: "#0c0",
        successdark: "#090",
        errorlight: "#f00",
        error: "#c00",
        errordark: "#900",
        secondarylight: "#AAA",
        secondary: "#888",
        secondarydark: "#666",
        warninglight: "#ff0",
        warning: "#cc0",
        warningdark: "#990",
        infolight: "#69f",
        info: "#36c",
        infodark: "#039",
        welllight: "#444",
        well: "#222",
        white: "#fff",
        black: "#000",
        hp: "#dd3434",
        money: "#ffd700",
        hack: "#adff2f",
        combat: "#faffdf",
        cha: "#a671d1",
        int: "#6495ed",
        rep: "#faffdf",
        disabled: "#66cfbc",
        backgroundprimary: "#000",
        backgroundsecondary: "#000",
        button: "#333",
        maplocation: "#ffffff",
        bnlvl0: "#ffff00",
        bnlvl1: "#ff0000",
        bnlvl2: "#48d1cc",
        bnlvl3: "#0000ff",
    },
};
