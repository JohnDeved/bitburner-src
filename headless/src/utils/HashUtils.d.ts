/**
 * Hashes the input string. This is a fast hash, so NOT good for cryptography.
 * This has been ripped off here: https://stackoverflow.com/a/52171480
 * @param str The string that is to be hashed
 * @param seed A seed to randomize the result
 * @returns An hexadecimal string representation of the hashed input
 */
export declare function cyrb53(str: string, seed?: number): string;
