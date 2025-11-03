"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme = void 0;
const screenshot_png_1 = __importDefault(require("./screenshot.png"));
exports.Theme = {
    name: "Iron Man",
    credit: "Matti#2942",
    description: "Mark 42. Threw a little hot rod red in there.",
    reference: "https://discord.com/channels/415207508303544321/921991895230611466/1069233364927787089",
    screenshot: screenshot_png_1.default,
    colors: {
        primarylight: "#FFFEFC",
        primary: "#FFA95E",
        primarydark: "#E8BC71",
        successlight: "#00FF00",
        success: "#0c0",
        successdark: "#090",
        errorlight: "#FF0B0B",
        error: "#FF0000",
        errordark: "#770000",
        secondarylight: "#FFC596",
        secondary: "#DA3F3F",
        secondarydark: "#6E1D1D",
        warninglight: "#ff0",
        warning: "#cc0",
        warningdark: "#990",
        infolight: "#FFFFFF",
        info: "#B6E9FF",
        infodark: "#5596CF",
        welllight: "#8A2121",
        well: "#350000",
        white: "#fff",
        black: "#000",
        hp: "#FF4E4E",
        money: "#C2F26F",
        hack: "#D5FFB2",
        combat: "#E39C5A",
        cha: "#CA4444",
        int: "#6495ed",
        rep: "#E39C5A",
        disabled: "#3C0C0C",
        backgroundprimary: "#2C0707",
        backgroundsecondary: "#551212",
        button: "#8A2121",
        maplocation: "#ffffff",
        bnlvl0: "#ffff00",
        bnlvl1: "#ff0000",
        bnlvl2: "#48d1cc",
        bnlvl3: "#0000ff",
    },
};
