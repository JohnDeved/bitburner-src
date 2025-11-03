import type { ActionIdentifier } from "../Types";
/** Loads an action identifier
 * This is used for loading ActionIdentifier class objects from pre-2.6.1
 * Should load both the old format and the new format */
export declare function loadActionIdentifier(identifier: unknown): ActionIdentifier | null;
