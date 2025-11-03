/** Represents the possible configuration values that can be provided when creating the progress bar text. */
interface IProgressBarConfiguration {
    /** Current progress, taken as a decimal (i.e. '0.6' to represent '60%') */
    progress?: number;
    /** Total number of ticks in progress bar. Preferably a factor of 100. */
    totalTicks?: number;
}
/**
 * Creates a graphical "progress bar"
 * e.g.:  [||||---------------]
 * @param params The configuration parameters for the progress bar
 */
export declare function createProgressBarText(params: IProgressBarConfiguration): string;
export {};
