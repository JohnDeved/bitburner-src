"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WHRNG = exports.BadRNG = void 0;
exports.SFC32RNG = SFC32RNG;
/*
 * very bad RNG, meant to be used as introduction to RNG manipulation. It has a
 * period of 1024.
 */
class RNG0 {
    constructor() {
        this.m = 1024;
        this.a = 341;
        this.c = 1;
        this.x = 0;
        this.reset();
    }
    step() {
        this.x = (this.a * this.x + this.c) % this.m;
    }
    random() {
        this.step();
        return this.x / this.m;
    }
    reset() {
        this.x = new Date().getTime() % this.m;
    }
}
exports.BadRNG = new RNG0();
/*
 * Wichmann–Hill PRNG
 * The period is 6e12.
 */
class WHRNG {
    constructor(totalPlaytime) {
        this.s1 = 0;
        this.s2 = 0;
        this.s3 = 0;
        // This one is seeded by the players total play time.
        const v = (totalPlaytime / 1000) % 30000;
        this.s1 = v;
        this.s2 = v;
        this.s3 = v;
    }
    step() {
        this.s1 = (171 * this.s1) % 30269;
        this.s2 = (172 * this.s2) % 30307;
        this.s3 = (170 * this.s3) % 30323;
    }
    random() {
        this.step();
        return (this.s1 / 30269.0 + this.s2 / 30307.0 + this.s3 / 30323.0) % 1.0;
    }
}
exports.WHRNG = WHRNG;
function SFC32RNG(seed) {
    let h = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i++) {
        h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    const genSeed = () => {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    };
    let a = genSeed();
    let b = genSeed();
    let c = genSeed();
    let d = genSeed();
    return () => {
        a >>>= 0;
        b >>>= 0;
        c >>>= 0;
        d >>>= 0;
        let t = (a + b) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        d = (d + 1) | 0;
        t = (t + d) | 0;
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
    };
}
