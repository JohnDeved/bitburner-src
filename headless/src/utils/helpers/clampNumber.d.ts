/**
 * Clamps the value on a lower and an upper bound
 * @param {number} value Value to clamp
 * @param {number} min Lower bound, defaults to negative Number.MAX_VALUE
 * @param {number} max Upper bound, defaults to Number.MAX_VALUE
 * @returns {number} Clamped value
 */
export declare function clampNumber(value: number, min?: number, max?: number): number;
export declare function clampInteger(value: number, min?: number, max?: number): number;
