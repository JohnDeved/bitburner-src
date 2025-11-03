import { ITaskParams } from "../ITaskParams";
/**
 * Defines the parameters that can be used to initialize and describe a GangMemberTask
 * (defined in Gang.js)
 */
interface IGangMemberTaskMetadata {
    /** Description of the task */
    desc: string;
    /** Whether or not this task is meant for Combat-type gangs */
    isCombat: boolean;
    /** Whether or not this task is for Hacking-type gangs */
    isHacking: boolean;
    /** Name of the task */
    name: string;
    /**
     * An object containing weighting parameters for the task. These parameters are used for
     * various calculations (respect gain, wanted gain, etc.)
     */
    params: ITaskParams;
}
/**
 * Array of metadata for all Gang Member tasks. Used to construct the global GangMemberTask
 * objects in Gang.js
 */
export declare const gangMemberTasksMetadata: IGangMemberTaskMetadata[];
export {};
