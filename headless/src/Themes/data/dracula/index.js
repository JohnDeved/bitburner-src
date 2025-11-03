"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme = void 0;
const screenshot_png_1 = __importDefault(require("./screenshot.png"));
exports.Theme = {
    name: "Dracula",
    description: "Dracula Look-alike",
    credit: "H3draut3r",
    reference: "https://discord.com/channels/415207508303544321/921991895230611466/922296307836678144",
    screenshot: screenshot_png_1.default,
    colors: {
        primarylight: "#7082B8",
        primary: "#F8F8F2",
        primarydark: "#FF79C6",
        successlight: "#0f0",
        success: "#0c0",
        successdark: "#090",
        errorlight: "#FD4545",
        error: "#FF2D2D",
        errordark: "#C62424",
        secondarylight: "#AAA",
        secondary: "#8BE9FD",
        secondarydark: "#666",
        warninglight: "#FFC281",
        warning: "#FFB86C",
        warningdark: "#E6A055",
        infolight: "#A0A0FF",
        info: "#7070FF",
        infodark: "#4040FF",
        welllight: "#44475A",
        well: "#363948",
        white: "#fff",
        black: "#282A36",
        hp: "#D34448",
        money: "#50FA7B",
        hack: "#F1FA8C",
        combat: "#BD93F9",
        cha: "#FF79C6",
        int: "#6495ed",
        rep: "#faffdf",
        disabled: "#66cfbc",
        backgroundprimary: "#282A36",
        backgroundsecondary: "#21222C",
        button: "#21222C",
        maplocation: "#ffffff",
        bnlvl0: "#ffff00",
        bnlvl1: "#ff0000",
        bnlvl2: "#48d1cc",
        bnlvl3: "#0000ff",
    },
};
