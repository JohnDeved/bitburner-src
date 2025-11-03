"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLargestPrimeFactor = void 0;
const _enums_1 = require("@enums");
const getRandomIntInclusive_1 = require("../../utils/helpers/getRandomIntInclusive");
exports.findLargestPrimeFactor = {
    [_enums_1.CodingContractName.FindLargestPrimeFactor]: {
        desc: (n) => {
            return ["A prime factor is a factor that is a prime number.", `What is the largest prime factor of ${n}?`].join(" ");
        },
        difficulty: 1,
        generate: () => {
            return (0, getRandomIntInclusive_1.getRandomIntInclusive)(500, 1e9);
        },
        solver: (data, answer) => {
            let fac = 2;
            let n = data;
            while (n > (fac - 1) * (fac - 1)) {
                while (n % fac === 0) {
                    n = Math.round(n / fac);
                }
                ++fac;
            }
            return (n === 1 ? fac - 1 : n) === answer;
        },
        convertAnswer: (ans) => parseInt(ans, 10),
        validateAnswer: (ans) => typeof ans === "number",
    },
};
