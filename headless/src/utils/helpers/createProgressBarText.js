"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProgressBarText = createProgressBarText;
/**
 * Creates a graphical "progress bar"
 * e.g.:  [||||---------------]
 * @param params The configuration parameters for the progress bar
 */
function createProgressBarText(params) {
    // Default values
    const defaultParams = {
        progress: 0,
        totalTicks: 20,
    };
    const derived = Object.assign({}, defaultParams, params);
    // Ensure it is 0..1
    derived.progress = Math.max(Math.min(derived.progress, 1), 0);
    // This way there is always at least one bar filled in...
    const bars = Math.max(Math.floor(derived.progress / (1 / derived.totalTicks)), 1);
    const dashes = Math.max(derived.totalTicks - bars, 0);
    // String.prototype.repeat isn't completely supported, but good enough for our purposes
    return `[${"|".repeat(bars)}${"-".repeat(dashes)}]`;
}
