"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalWaysToSum = void 0;
const getRandomIntInclusive_1 = require("../../utils/helpers/getRandomIntInclusive");
const _enums_1 = require("@enums");
exports.totalWaysToSum = {
    [_enums_1.CodingContractName.TotalWaysToSum]: {
        desc: (n) => {
            return [
                "It is possible write four as a sum in exactly four different ways:\n\n",
                "    3 + 1\n",
                "    2 + 2\n",
                "    2 + 1 + 1\n",
                "    1 + 1 + 1 + 1\n\n",
                `How many different distinct ways can the number ${n} be written as a sum of at least`,
                "two positive integers?",
            ].join(" ");
        },
        difficulty: 1,
        generate: () => {
            return (0, getRandomIntInclusive_1.getRandomIntInclusive)(8, 100);
        },
        solver: (data, answer) => {
            if (typeof data !== "number")
                throw new Error("solver expected number");
            const ways = [1];
            ways.length = data + 1;
            ways.fill(0, 1);
            for (let i = 1; i < data; ++i) {
                for (let j = i; j <= data; ++j) {
                    ways[j] += ways[j - i];
                }
            }
            return ways[data] === answer;
        },
        convertAnswer: (ans) => parseInt(ans, 10),
        validateAnswer: (ans) => typeof ans === "number",
    },
    [_enums_1.CodingContractName.TotalWaysToSumII]: {
        desc: (data) => {
            const n = data[0];
            const s = data[1];
            return [
                `How many different distinct ways can the number ${n} be written`,
                "as a sum of integers contained in the set:\n\n",
                `[${s}]?\n\n`,
                "You may use each integer in the set zero or more times.",
            ].join(" ");
        },
        difficulty: 2,
        generate: () => {
            const n = (0, getRandomIntInclusive_1.getRandomIntInclusive)(12, 200);
            const maxLen = (0, getRandomIntInclusive_1.getRandomIntInclusive)(8, 12);
            const s = [];
            // Bias towards small numbers is intentional to have much bigger answers in general
            // to force people better optimize their solutions
            for (let i = 1; i <= n; i++) {
                if (s.length == maxLen) {
                    break;
                }
                if (Math.random() < 0.6 || n - i < maxLen - s.length) {
                    s.push(i);
                }
            }
            return [n, s];
        },
        solver: (data, answer) => {
            // https://www.geeksforgeeks.org/coin-change-dp-7/?ref=lbp
            const n = data[0];
            const s = data[1];
            const ways = [1];
            ways.length = n + 1;
            ways.fill(0, 1);
            for (let i = 0; i < s.length; i++) {
                for (let j = s[i]; j <= n; j++) {
                    ways[j] += ways[j - s[i]];
                }
            }
            return ways[n] === answer;
        },
        convertAnswer: (ans) => parseInt(ans, 10),
        validateAnswer: (ans) => typeof ans === "number",
    },
};
