"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCorpStat = exports.formatSleeveSynchro = exports.formatSleeveShock = exports.formatMatPurchaseAmount = exports.formatStaneksGiftPower = exports.formatMultiplier = exports.formatMaterialSize = exports.formatPreciseMultiplier = exports.formatWanted = exports.formatRespect = exports.formatMoney = exports.formatSkill = exports.formatThreads = exports.formatHp = exports.formatShares = exports.formatSleeveMemory = exports.formatInt = exports.formatQuality = exports.formatCorpMultiplier = exports.formatStaneksGiftCharge = exports.formatStamina = exports.formatSecurity = exports.formatPopulation = exports.formatReputation = exports.formatHashes = exports.formatExp = exports.formatBigNumber = exports.formatFavor = exports.formatNumberNoSuffix = exports.FormatsHaveChanged = exports.FormatsNeedToChange = void 0;
exports.formatBytes = formatBytes;
exports.formatRam = formatRam;
exports.formatPercent = formatPercent;
exports.formatNumber = formatNumber;
exports.parseBigNumber = parseBigNumber;
const Theme_1 = require("../Themes/ui/Theme");
const EventEmitter_1 = require("../utils/EventEmitter");
const Settings_1 = require("../Settings/Settings");
const numberSuffixList = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n"];
// exponents associated with each suffix
const numberExpList = numberSuffixList.map((_, i) => parseFloat(`1e${i * 3}`));
// Ram suffixes
const decByteSuffixes = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
const binByteSuffixes = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB"];
// Items that get initialized in the initializer function.
let digitFormats = {}, percentFormats = {}, basicFormatter, exponentialFormatter, unitSuffixes, unitExpList, unitLogFn, unitLogDivisor;
/** Event to be emitted when changing number display settings. */
exports.FormatsNeedToChange = new EventEmitter_1.EventEmitter();
/** Event to be emitted after the cached formatters are cleared. */
exports.FormatsHaveChanged = new EventEmitter_1.EventEmitter();
// Initialization function
exports.FormatsNeedToChange.subscribe(() => {
    // Clear all cached formatters
    digitFormats = {};
    percentFormats = {};
    exponentialFormatter = makeFormatter(3, { notation: Settings_1.Settings.useEngineeringNotation ? "engineering" : "scientific" });
    basicFormatter = new Intl.NumberFormat([Settings_1.Settings.Locale, "en"], { useGrouping: !Settings_1.Settings.hideThousandsSeparator });
    [unitSuffixes, unitLogFn, unitLogDivisor] = Settings_1.Settings.UseIEC60027_2
        ? // log2 of 1024 is 10 as divisor for log base 1024
            [binByteSuffixes, Math.log2, 10]
        : // log10 of 1000 is 3 as divisor for log base 1000
            [decByteSuffixes, Math.log10, 3];
    unitExpList = unitSuffixes.map((_, i) => (Settings_1.Settings.UseIEC60027_2 ? 1024 : 1000) ** i);
    // Emit a FormatsHaveChanged event so any static content that uses formats can be regenerated.
    exports.FormatsHaveChanged.emit();
    // Force a redraw of the entire UI
    Theme_1.ThemeEvents.emit();
});
/** Makes a new formatter */
function makeFormatter(fractionalDigits, otherOptions = {}) {
    if (Settings_1.Settings.hideThousandsSeparator)
        otherOptions.useGrouping = false;
    return new Intl.NumberFormat([Settings_1.Settings.Locale, "en"], {
        minimumFractionDigits: Settings_1.Settings.hideTrailingDecimalZeros ? 0 : fractionalDigits,
        maximumFractionDigits: fractionalDigits,
        ...otherOptions,
    });
}
/** Returns a cached formatter if it already exists, otherwise makes and returns a new formatter */
function getFormatter(fractionalDigits, formatList = digitFormats, options = {}) {
    if (formatList[fractionalDigits]) {
        return formatList[fractionalDigits];
    }
    return (formatList[fractionalDigits] = makeFormatter(fractionalDigits, options));
}
/** Display standard byte formatting. */
function formatBytes(n, fractionalDigits = 1) {
    return formatSize(n, fractionalDigits, 0);
}
/** Display standard ram formatting. */
function formatRam(n, fractionalDigits = 2) {
    return formatSize(n, fractionalDigits, 3);
}
function formatSize(n, fractionalDigits = 2, unitOffset = 3) {
    const base = Settings_1.Settings.UseIEC60027_2 ? 1024 : 1000;
    const nAbs = Math.abs(n);
    // Special handling for NaN, Infinities and zero
    if (Number.isNaN(n))
        return `NaN${unitSuffixes[0 + unitOffset]}`;
    if (nAbs === Infinity)
        return `${n < 0 ? "-∞" : "∞"}${unitSuffixes.at(-1)}`;
    // Early return if using first suffix.
    if (nAbs < base)
        return getFormatter(fractionalDigits).format(n) + unitSuffixes[unitOffset];
    // convert input units to bytes
    let nBytes = n * base ** unitOffset;
    const suffixIndex = Math.min(Math.floor(unitLogFn(nBytes) / unitLogDivisor), unitSuffixes.length - 1);
    nBytes /= unitExpList[suffixIndex];
    /* Not really concerned with 1000-rounding or 1024-rounding for ram due to the actual values ram gets displayed at.
    If display of e.g. 1,000.00GB instead of 1.00TB for 999.995GB, or 1,024.00GiB instead of 1.00TiB for 1,023.995GiB
    becomes an actual issue we can add smart rounding, but ram values like that really don't happen ingame so it's
    probably not worth the performance overhead to check and correct these. */
    return getFormatter(fractionalDigits).format(nBytes) + unitSuffixes[suffixIndex];
}
function formatExponential(n) {
    return exponentialFormatter.format(n).toLocaleLowerCase();
}
// Default suffixing starts at 1e9 % which is 1e7.
function formatPercent(n, fractionalDigits = 2, multStart = 1e6) {
    // NaN does not get formatted
    if (Number.isNaN(n))
        return "NaN%";
    const nAbs = Math.abs(n);
    // Special handling for Infinities
    if (nAbs * 100 === Infinity)
        return n < 0 ? "-∞%" : "∞%";
    // Mult form. There are probably some areas in the game this wouldn't make sense, but they hopefully won't ever have huge %.
    if (nAbs >= multStart)
        return "x" + formatNumber(n, fractionalDigits);
    return getFormatter(fractionalDigits, percentFormats, { style: "percent" }).format(n);
}
function formatNumber(n, fractionalDigits = 3, suffixStart = 1000, isInteger = false) {
    // NaN does not get formatted
    if (Number.isNaN(n))
        return "NaN";
    const nAbs = Math.abs(n);
    // Special handling for Infinities
    if (nAbs === Infinity)
        return n < 0 ? "-∞" : "∞";
    if (suffixStart < 1000) {
        throw new Error("suffixStart must be greater than or equal to 1000");
    }
    // Early return for non-suffix or if number and suffix are 0
    if (nAbs < suffixStart) {
        if (isInteger)
            return basicFormatter.format(n);
        return getFormatter(fractionalDigits).format(n);
    }
    // Exponential form
    if (Settings_1.Settings.disableSuffixes || nAbs >= 1e33)
        return formatExponential(n);
    // Calculate suffix index. 1000 = 10^3
    let suffixIndex = Math.floor(Math.log10(nAbs) / 3);
    n /= numberExpList[suffixIndex];
    // Todo: Find a better way to detect if number is rounding to 1000${suffix}, or find a simple way to truncate to x digits instead of rounding
    // Detect if number rounds to 1000.000 (based on number of digits given)
    if (Math.abs(n).toFixed(fractionalDigits).length === fractionalDigits + 5 && numberSuffixList[suffixIndex + 1]) {
        suffixIndex += 1;
        n = n < 0 ? -1 : 1;
    }
    return getFormatter(fractionalDigits).format(n) + numberSuffixList[suffixIndex];
}
/** Format a number without suffixes. Still show exponential form if >= 1e33. */
const formatNumberNoSuffix = (n, fractionalDigits = 0) => {
    return formatNumber(n, fractionalDigits, 1e33);
};
exports.formatNumberNoSuffix = formatNumberNoSuffix;
const formatFavor = (n) => (0, exports.formatNumberNoSuffix)(n, 3);
exports.formatFavor = formatFavor;
/** Standard noninteger formatting with no options set. Collapses to suffix at 1000 and shows 3 fractional digits. */
const formatBigNumber = (n) => formatNumber(n);
exports.formatBigNumber = formatBigNumber;
exports.formatExp = exports.formatBigNumber;
const formatHashes = (n) => {
    if (n < 0.00001) {
        return formatNumber(n, 8);
    }
    if (n < 0.001) {
        return formatNumber(n, 6);
    }
    if (n < 0.01) {
        return formatNumber(n, 4);
    }
    return formatNumber(n);
};
exports.formatHashes = formatHashes;
exports.formatReputation = exports.formatBigNumber;
exports.formatPopulation = exports.formatBigNumber;
exports.formatSecurity = exports.formatBigNumber;
exports.formatStamina = exports.formatBigNumber;
exports.formatStaneksGiftCharge = exports.formatBigNumber;
const formatCorpMultiplier = (n) => "×" + (0, exports.formatBigNumber)(n);
exports.formatCorpMultiplier = formatCorpMultiplier;
/** Format a number with suffixes starting at 1000 and 2 fractional digits */
const formatQuality = (n) => formatNumber(n, 2);
exports.formatQuality = formatQuality;
/** Format an integer that uses suffixed form at 1000 and 3 fractional digits. */
const formatInt = (n) => formatNumber(n, 3, 1000, true);
exports.formatInt = formatInt;
exports.formatSleeveMemory = exports.formatInt;
exports.formatShares = exports.formatInt;
/** Display an integer up to 999,999 before collapsing to suffixed form with 3 fractional digits */
const formatHp = (n) => formatNumber(n, 3, 1e6, true);
exports.formatHp = formatHp;
exports.formatThreads = exports.formatHp;
/** Display an integer up to 999,999,999 before collapsing to suffixed form with 3 fractional digits */
const formatSkill = (n) => formatNumber(n, 3, 1e9, true);
exports.formatSkill = formatSkill;
/** Display standard money formatting, including the preceding $. */
const formatMoney = (n, useExponentialFormForSmallValue = false) => {
    return `$${!useExponentialFormForSmallValue || n === 0 || n >= 0.001 ? formatNumber(n) : n.toExponential(3)}`;
};
exports.formatMoney = formatMoney;
/** Display a decimal number with increased precision (5 fractional digits) */
const formatRespect = (n) => formatNumber(n, 5);
exports.formatRespect = formatRespect;
exports.formatWanted = exports.formatRespect;
exports.formatPreciseMultiplier = exports.formatRespect;
/** Format a number with 3 fractional digits. */
const formatMaterialSize = (n) => formatNumber(n, 3);
exports.formatMaterialSize = formatMaterialSize;
/** Format a number with no suffix and 2 fractional digits. */
const formatMultiplier = (n) => (0, exports.formatNumberNoSuffix)(n, 2);
exports.formatMultiplier = formatMultiplier;
exports.formatStaneksGiftPower = exports.formatMultiplier;
exports.formatMatPurchaseAmount = exports.formatMultiplier;
/** Format a number with no suffix and 3 fractional digits. */
const formatSleeveShock = (n) => (0, exports.formatNumberNoSuffix)(n, 3);
exports.formatSleeveShock = formatSleeveShock;
exports.formatSleeveSynchro = exports.formatSleeveShock;
exports.formatCorpStat = exports.formatSleeveShock;
/** Parsing numbers does not use the locale as this causes complications. */
function parseBigNumber(str) {
    str = str.trim();
    // Remove all commas in case the player is typing a longform number
    str = str.replace(/,/g, "");
    // Handle special returns
    if (["infinity", "Infinity", "∞"].includes(str))
        return Infinity;
    if (["-infinity", "-Infinity", "-∞"].includes(str))
        return -Infinity;
    const suffixIndex = numberSuffixList.indexOf(str.substring(str.length - 1));
    // If there's no valid suffix at the end, just return parseFloated string
    if (suffixIndex === -1)
        return parseFloat(str);
    return parseFloat(str.substring(0, str.length - 1) + "e" + suffixIndex * 3);
}
