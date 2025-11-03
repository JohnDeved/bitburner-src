"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeOverlappingIntervals = void 0;
const getRandomIntInclusive_1 = require("../../utils/helpers/getRandomIntInclusive");
const ContractTypes_1 = require("../ContractTypes");
const _enums_1 = require("@enums");
exports.mergeOverlappingIntervals = {
    [_enums_1.CodingContractName.MergeOverlappingIntervals]: {
        desc: (arr) => {
            return [
                "Given the following array of arrays of numbers representing a list of",
                "intervals, merge all overlapping intervals.\n\n",
                `[${(0, ContractTypes_1.convert2DArrayToString)(arr)}]\n\n`,
                "Example:\n\n",
                "[[1, 3], [8, 10], [2, 6], [10, 16]]\n\n",
                "would merge into [[1, 6], [8, 16]].\n\n",
                "The intervals must be returned in ASCENDING order.",
                "You can assume that in an interval, the first number will always be",
                "smaller than the second.",
            ].join(" ");
        },
        difficulty: 3,
        generate: () => {
            const intervals = [];
            const numIntervals = (0, getRandomIntInclusive_1.getRandomIntInclusive)(3, 20);
            for (let i = 0; i < numIntervals; ++i) {
                const start = (0, getRandomIntInclusive_1.getRandomIntInclusive)(1, 25);
                const end = start + (0, getRandomIntInclusive_1.getRandomIntInclusive)(1, 10);
                intervals.push([start, end]);
            }
            return intervals;
        },
        numTries: 15,
        solver: (data, answer) => {
            const intervals = data.slice();
            intervals.sort((a, b) => {
                return a[0] - b[0];
            });
            const result = [];
            let start = intervals[0][0];
            let end = intervals[0][1];
            for (const interval of intervals) {
                if (interval[0] <= end) {
                    end = Math.max(end, interval[1]);
                }
                else {
                    result.push([start, end]);
                    start = interval[0];
                    end = interval[1];
                }
            }
            result.push([start, end]);
            return result.length === answer.length && result.every((a, i) => a[0] === answer[i][0] && a[1] === answer[i][1]);
        },
        convertAnswer: (ans) => {
            const arrayRegex = /\[\d+,\d+\]/g;
            const matches = ans.replace(/\s/g, "").match(arrayRegex);
            if (matches === null)
                return null;
            const arr = matches.map((a) => (0, ContractTypes_1.removeBracketsFromArrayString)(a)
                .split(",")
                .map((n) => parseInt(n)));
            // An inline function is needed here, so that TS knows this returns true if it matches the type
            if (((a) => a.every((n) => n.length === 2))(arr))
                return arr;
            return null;
        },
        validateAnswer: (ans) => typeof ans === "object" &&
            Array.isArray(ans) &&
            ans.every((a) => Array.isArray(a) && a.length === 2 && a.every((n) => typeof n === "number")),
    },
};
