"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minimumPathSumInATriangle = void 0;
const getRandomIntInclusive_1 = require("../../utils/helpers/getRandomIntInclusive");
const _enums_1 = require("@enums");
exports.minimumPathSumInATriangle = {
    [_enums_1.CodingContractName.MinimumPathSumInATriangle]: {
        desc: (data) => {
            function createTriangleRecurse(data, level = 0) {
                const numLevels = data.length;
                if (level >= numLevels) {
                    return "";
                }
                const numSpaces = numLevels - level + 1;
                let str = [" ".repeat(numSpaces), "[", data[level].toString(), "]"].join("");
                if (level < numLevels - 1) {
                    str += ",";
                }
                return str + "\n" + createTriangleRecurse(data, level + 1);
            }
            function createTriangle(data) {
                return ["[\n", createTriangleRecurse(data), "]"].join("");
            }
            const triangle = createTriangle(data);
            return [
                "Given a triangle, find the minimum path sum from top to bottom. In each step",
                "of the path, you may only move to adjacent numbers in the row below.",
                "The triangle is represented as a 2D array of numbers:\n\n",
                `${triangle}\n\n`,
                "Example: If you are given the following triangle:\n\n[\n",
                "     [2],\n",
                "    [3,4],\n",
                "   [6,5,7],\n",
                "  [4,1,8,3]\n",
                "]\n\n",
                "The minimum path sum is 11 (2 -> 3 -> 5 -> 1).",
            ].join(" ");
        },
        difficulty: 5,
        generate: () => {
            const triangle = [];
            const levels = (0, getRandomIntInclusive_1.getRandomIntInclusive)(3, 12);
            triangle.length = levels;
            for (let row = 0; row < levels; ++row) {
                triangle[row] = [];
                triangle[row].length = row + 1;
                for (let i = 0; i < triangle[row].length; ++i) {
                    triangle[row][i] = (0, getRandomIntInclusive_1.getRandomIntInclusive)(1, 9);
                }
            }
            return triangle;
        },
        solver: (data, answer) => {
            const n = data.length;
            const dp = data[n - 1].slice();
            for (let i = n - 2; i > -1; --i) {
                for (let j = 0; j < data[i].length; ++j) {
                    dp[j] = Math.min(dp[j], dp[j + 1]) + data[i][j];
                }
            }
            return dp[0] === answer;
        },
        convertAnswer: (ans) => parseInt(ans, 10),
        validateAnswer: (ans) => typeof ans === "number",
    },
};
