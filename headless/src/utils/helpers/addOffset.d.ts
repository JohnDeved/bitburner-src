/**
 * Adds a random offset to a number within a certain percentage
 * @example
 * // Returns between 95-105
 * addOffset(100, 5);
 * @example
 * // Returns between 63-77
 * addOffSet(70, 10);
 * @param midpoint The number to be the midpoint of the offset range
 * @param percentage The percentage (in a range of 0-100) to offset
 */
export declare function addOffset(midpoint: number, percentage: number): number;
