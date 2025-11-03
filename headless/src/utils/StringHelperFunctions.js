"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTimeMsToTimeElapsedString = convertTimeMsToTimeElapsedString;
exports.longestCommonStart = longestCommonStart;
exports.containsAllStrings = containsAllStrings;
exports.generateRandomString = generateRandomString;
exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports.capitalizeEachWord = capitalizeEachWord;
exports.getKeyFromReactElements = getKeyFromReactElements;
const Settings_1 = require("../Settings/Settings");
const I18nUtils_1 = require("./I18nUtils");
/*
Converts a date representing time in milliseconds to a string with the format H hours M minutes and S seconds
e.g.    10000 -> "10 seconds"
        120000 -> "2 minutes and 0 seconds"
*/
function convertTimeMsToTimeElapsedString(time, showMilli = false) {
    const negFlag = time < 0;
    time = Math.abs(Math.floor(time));
    const millisecondsPerSecond = 1000;
    const secondPerMinute = 60;
    const minutesPerHours = 60;
    const secondPerHours = secondPerMinute * minutesPerHours;
    const hoursPerDays = 24;
    const secondPerDay = secondPerHours * hoursPerDays;
    // Convert ms to seconds, since we only have second-level precision
    const totalSeconds = Math.floor(time / millisecondsPerSecond);
    const days = Math.floor(totalSeconds / secondPerDay);
    const secTruncDays = totalSeconds % secondPerDay;
    const hours = Math.floor(secTruncDays / secondPerHours);
    const secTruncHours = secTruncDays % secondPerHours;
    const minutes = Math.floor(secTruncHours / secondPerMinute);
    const secTruncMinutes = secTruncHours % secondPerMinute;
    const milliTruncSec = (() => {
        let str = `${time % millisecondsPerSecond}`;
        while (str.length < 3)
            str = "0" + str;
        return str;
    })();
    const seconds = showMilli ? `${secTruncMinutes}.${milliTruncSec}` : `${secTruncMinutes}`;
    let res = "";
    if (days > 0) {
        res += `${(0, I18nUtils_1.pluralize)(days, "day")} `;
    }
    if (hours > 0 || (Settings_1.Settings.ShowMiddleNullTimeUnit && res != "")) {
        res += `${(0, I18nUtils_1.pluralize)(hours, "hour")} `;
    }
    if (minutes > 0 || (Settings_1.Settings.ShowMiddleNullTimeUnit && res != "")) {
        res += `${(0, I18nUtils_1.pluralize)(minutes, "minute")} `;
    }
    res += `${seconds} second${!showMilli && secTruncMinutes === 1 ? "" : "s"}`;
    return negFlag ? `-(${res})` : res;
}
// Finds the longest common starting substring in a set of strings
function longestCommonStart(strings) {
    if (!containsAllStrings(strings)) {
        return "";
    }
    if (strings.length === 0) {
        return "";
    }
    const a1 = strings[0];
    for (let i = 0; i < a1.length; ++i) {
        const chr = a1.charAt(i).toUpperCase();
        for (let s = 1; s < strings.length; ++s) {
            if (chr !== strings[s].charAt(i).toUpperCase()) {
                return a1.substring(0, i);
            }
        }
    }
    return a1;
}
// Returns whether an array contains entirely of string objects
function containsAllStrings(arr) {
    return arr.every((value) => typeof value === "string");
}
// Generates a random alphanumeric string with N characters
function generateRandomString(n) {
    let str = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < n; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
}
function capitalizeFirstLetter(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
function capitalizeEachWord(s) {
    return s
        .split(" ")
        .map((word) => capitalizeFirstLetter(word))
        .join(" ");
}
function getKeyFromReactElements(a, b) {
    const keyOfA = typeof a === "string" ? a : a.key ?? "";
    const keyOfb = typeof b === "string" ? b : b.key ?? "";
    return keyOfA + keyOfb;
}
