interface RNG {
    random(): number;
}
declare class RNG0 implements RNG {
    x: number;
    m: number;
    a: number;
    c: number;
    constructor();
    step(): void;
    random(): number;
    reset(): void;
}
export declare const BadRNG: RNG0;
export declare class WHRNG implements RNG {
    s1: number;
    s2: number;
    s3: number;
    constructor(totalPlaytime: number);
    step(): void;
    random(): number;
}
export declare function SFC32RNG(seed: string): () => number;
export {};
