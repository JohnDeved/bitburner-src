/**
 * Return a uniform random number in [0, size).
 * Adjusting the range can be done with addition. Because bigints are more
 * expensive, it makes more sense to have the 0-based version as a primitive.
 */
export declare function randomBigIntExclusive(size: bigint): bigint;
