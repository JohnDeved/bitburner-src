export interface VersionBreakingChange {
    additionalText?: string;
    apiBreakingChanges: APIBreakInfo[];
}
export interface APIBreakInfo {
    /** The API functions impacted by the API break */
    brokenAPIs: {
        name: string;
        migration?: {
            /** We may need to use a custom search value instead of name */
            searchValue: string | RegExp;
            replaceValue: string;
        };
    }[];
    /** Info that should be shown to the player, alongside the list of impacted scripts */
    info: string;
    /** If broken APIs can be safely migrated, we can skip displaying the warning */
    showWarning: boolean;
    /**
     * With a new version with breaking changes, the "showAPIBreaks" function checks all breaking changes and does 2
     * things with changes that affect the player's scripts:
     * - Write info of changes to a log file.
     * - Show a warning per change.
     * Note that we skip changes that do not affect the player's scripts. This is problematic with some breaking changes.
     *
     * With each breaking change in "brokenAPIs", we try to detect the affected code by using "name" or
     * "migration.searchValue". However, with some breaking changes, we cannot detect the affected code reliably via
     * "brokenAPIs". In this case, instead of skipping them, we always "process" that change (i.e., write info to the log
     * file and optionally show a warning that notifies the player about this change).
     */
    doNotSkip?: boolean;
}
/** Show the player a dialog for their API breaks, and save an info file for the player to review later */
export declare function showAPIBreaks(version: string, { additionalText, apiBreakingChanges }: VersionBreakingChange): void;
