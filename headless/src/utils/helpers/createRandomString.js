"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomString = createRandomString;
// Function that generates a random gibberish string of length n
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function createRandomString(n) {
    let str = "";
    for (let i = 0; i < n; ++i) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
}
