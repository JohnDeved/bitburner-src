import { NSFull } from "../NetscriptFunctions";
/**
 * The environment in which a script runs. The environment holds
 * Netscript functions and arguments for that script.
 */
export declare class Environment {
    /** Whether or not the script that uses this Environment is stopped */
    stopFlag: boolean;
    /** The currently running function */
    runningFn: string;
    /** Environment variables (currently only Netscript functions) */
    vars: NSFull | null;
}
