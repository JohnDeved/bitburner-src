/**
 * This file contains utility functions that migrate save data. Originally, they were in SaveObject.ts. It's too hard to
 * satisfy all TypeScript's type checks, so we move them into a separate helper file, then disable some lint rules in
 * the entire file. It helps us:
 * - Not have to disable lint rules in SaveObject.ts.
 * - Not have to use "// eslint-disable-next-line" everywhere in these functions.
 */
export declare function evaluateVersionCompatibility(ver: string | number): Promise<void>;
