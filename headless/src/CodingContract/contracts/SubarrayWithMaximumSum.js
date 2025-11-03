"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subarrayWithMaximumSum = void 0;
const getRandomIntInclusive_1 = require("../../utils/helpers/getRandomIntInclusive");
const Enums_1 = require("../Enums");
exports.subarrayWithMaximumSum = {
    [Enums_1.CodingContractName.SubarrayWithMaximumSum]: {
        desc: (n) => {
            return [
                "Given the following integer array, find the contiguous subarray",
                "(containing at least one number) which has the largest sum and return that sum.",
                "'Sum' refers to the sum of all the numbers in the subarray.\n",
                `${n.toString()}`,
            ].join(" ");
        },
        difficulty: 1,
        generate: () => {
            const len = (0, getRandomIntInclusive_1.getRandomIntInclusive)(5, 40);
            const arr = [];
            arr.length = len;
            for (let i = 0; i < len; ++i) {
                arr[i] = (0, getRandomIntInclusive_1.getRandomIntInclusive)(-10, 10);
            }
            return arr;
        },
        solver: (data, answer) => {
            const nums = data.slice();
            for (let i = 1; i < nums.length; i++) {
                nums[i] = Math.max(nums[i], nums[i] + nums[i - 1]);
            }
            return Math.max(...nums) === answer;
        },
        convertAnswer: (ans) => parseInt(ans, 10),
        validateAnswer: (ans) => typeof ans === "number",
    },
};
